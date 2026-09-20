import axios, { AxiosError } from 'axios';

export interface ProblemDetailsResponse {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  instance?: string;
  code?: string;
  errors?: Record<string, string[]>;
}

export class ApiError extends Error {
  public status: number;
  public code: string;
  public errors?: Record<string, string[]>;

  constructor(status: number, code: string, message: string, errors?: Record<string, string[]>) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.errors = errors;
  }
}

export function parseApiError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error;
  }

  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ProblemDetailsResponse>;

    // Network error (no response received)
    if (!axiosError.response) {
      return new ApiError(
        0,
        'NETWORK',
        'Không thể kết nối đến máy chủ. Vui lòng kiểm tra mạng hoặc nhờ admin bật server!'
      );
    }

    const { status, data } = axiosError.response;

    const code = data?.code || (status === 401 ? 'UNAUTHORIZED' : status === 403 ? 'FORBIDDEN' : 'API_ERROR');
    const message =
      data?.detail ||
      data?.title ||
      axiosError.message ||
      'Đã xảy ra lỗi khi giao tiếp với hệ thống.';

    return new ApiError(status, code, message, data?.errors);
  }

  if (error instanceof Error) {
    return new ApiError(500, 'UNKNOWN', error.message);
  }

  return new ApiError(500, 'UNKNOWN', 'Lỗi không xác định.');
}
