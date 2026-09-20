import { z } from 'zod';

export const positionEnum = z.enum(['GK', 'DF', 'WG', 'MF', 'FW']);

export const stepNameSchema = z.object({
  playerId: z.number({ required_error: 'Vui lòng chọn tên cầu thủ' }).positive(),
});

export const stepPositionsSchema = z
  .object({
    positions: z
      .array(positionEnum)
      .min(1, 'Vui lòng chọn ít nhất 1 vị trí có thể đá')
      .max(5),
    preferredPosition: positionEnum,
  })
  .refine((data) => data.positions.includes(data.preferredPosition), {
    message: 'Vị trí sở trường phải nằm trong danh sách vị trí đã chọn',
    path: ['preferredPosition'],
  });

export const stepAvoidSchema = z.object({
  playerId: z.number(),
  avoidIds: z
    .array(z.number())
    .max(2, 'Tối đa chỉ được chọn 2 người né')
    .refine((ids) => new Set(ids).size === ids.length, {
      message: 'Không được chọn trùng lặp người né',
    }),
}).refine((data) => !data.avoidIds.includes(data.playerId), {
  message: 'Bạn không thể tự chọn né chính mình',
  path: ['avoidIds'],
});

export const stepScoreSchema = z.object({
  selfScore: z
    .number()
    .int('Điểm số phải là số nguyên')
    .min(1, 'Điểm số tối thiểu là 1')
    .max(10, 'Điểm số tối đa là 10'),
});

export const submissionFormSchema = z
  .object({
    playerId: z.number().positive(),
    positions: z.array(positionEnum).min(1).max(5),
    preferredPosition: positionEnum,
    avoidIds: z.array(z.number()).max(2),
    selfScore: z.number().int().min(1).max(10),
  })
  .refine((data) => data.positions.includes(data.preferredPosition), {
    message: 'Vị trí sở trường phải nằm trong các vị trí đã chọn',
    path: ['preferredPosition'],
  })
  .refine((data) => !data.avoidIds.includes(data.playerId), {
    message: 'Không thể né chính mình',
    path: ['avoidIds'],
  });

export type SubmissionFormData = z.infer<typeof submissionFormSchema>;
