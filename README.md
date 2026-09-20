# ⚽ SÂN 7 – THE MEDIA (FRONTEND)

Frontend cho hệ thống chia 2 đội bóng đá 7 người cân bằng thực lực nội bộ The Media.
Được xây dựng bằng: React 18, Vite, TypeScript, TailwindCSS v4, Framer Motion, Tanstack Query.

## Tính Năng
- Cổng nhập liệu cầu thủ thông minh (Wizard Form) với animations mượt mà.
- Trang kết quả chia đội với Confetti, hiệu ứng Share Card đẹp mắt và có thể tải về dạng hình ảnh.
- Trang Dashboard Quản trị viên quản lý Cầu thủ, Chia đội (cân bằng Score, Constraints), và Công khai kết quả.
- Giao diện Dark-Mode, Neon-Accent siêu mượt, phong cách Premium.
- Hỗ trợ tốt trên thiết bị di động.

## Cài Đặt & Chạy Local

### Yêu cầu
- Node.js 20+
- Chạy backend (xem hướng dẫn ở thư mục backend hoặc root).

### Các bước chạy
1. Cài dependencies:
   ```bash
   npm install
   ```
2. Tạo file `.env` từ `.env.example`:
   ```bash
   cp .env.example .env
   ```
3. Chạy môi trường Dev:
   ```bash
   npm run dev
   ```

### Biến môi trường (.env)
- `VITE_API_URL`: URL Backend (vd: `http://localhost:5000` hoặc link ngrok).
- `VITE_ADMIN_PASSWORD`: Mật khẩu cho phần admin (mặc định: `123456`).

## Testing
Dự án sử dụng Vitest & React Testing Library.
Chạy test:
```bash
npm run test
```

## Build cho Production
```bash
npm run build
```
*(Thư mục sinh ra là `dist/`)*

## Xem thêm
- [Hướng dẫn Deploy chi tiết](../docs/DEPLOY.md)
