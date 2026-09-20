import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { useToast } from '../components/ui/Toast';
import { Spinner } from '../components/ui/Spinner';
import { Skeleton } from '../components/ui/Skeleton';
import { Slider } from '../components/ui/Slider';
import { Field, Input } from '../components/ui/Field';
import { EmptyState } from '../components/ui/EmptyState';
import { ErrorState } from '../components/ui/ErrorState';
import { BouncingBall } from '../components/fx/BouncingBall';
import { CountUp } from '../components/fx/CountUp';
import { fireTeamSplitConfetti, fireSideCannons } from '../components/fx/confetti';
import { ShuffleReveal } from '../components/fx/ShuffleReveal';
import { PositionPicker } from '../components/pitch/PositionPicker';
import { TeamPitch } from '../components/pitch/TeamPitch';
import { BallAvatar } from '../components/player/BallAvatar';
import { PlayerChip } from '../components/player/PlayerChip';
import { PlayerCard } from '../components/player/PlayerCard';
import { PositionSubmissionDto, TeamPlayerDto } from '../api/types';
import { Trophy, RefreshCw } from 'lucide-react';

export const DevUiPage: React.FC = () => {
  const toast = useToast();

  // State for interactive components
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sliderVal, setSliderVal] = useState(8.5);
  const [inputVal, setInputVal] = useState('Nguyễn Văn A');
  const [positions, setPositions] = useState<PositionSubmissionDto[]>([
    { position: 'MF', isPrimary: true },
    { position: 'FW', isPrimary: false },
  ]);
  const [isRevealed, setIsRevealed] = useState(false);

  // Mock 7 players for TeamPitch
  const sampleTeamPlayers: TeamPlayerDto[] = [
    { id: 1, name: 'Bùi Tấn Trường', assignedPosition: 'GK', isPrimaryPosition: true, jerseyNumber: 1 },
    { id: 2, name: 'Quế Ngọc Hải', assignedPosition: 'DF', isPrimaryPosition: true, jerseyNumber: 3 },
    { id: 3, name: 'Đoàn Văn Hậu', assignedPosition: 'WG', isPrimaryPosition: true, jerseyNumber: 5 },
    { id: 4, name: 'Vũ Văn Thanh', assignedPosition: 'WG', isPrimaryPosition: true, jerseyNumber: 17 },
    { id: 5, name: 'Nguyễn Quang Hải', assignedPosition: 'MF', isPrimaryPosition: true, jerseyNumber: 19 },
    { id: 6, name: 'Nguyễn Tiến Linh', assignedPosition: 'FW', isPrimaryPosition: true, jerseyNumber: 22 },
    { id: 7, name: 'Phạm Tuấn Hải', assignedPosition: 'FW', isPrimaryPosition: false, jerseyNumber: 10 },
  ];

  return (
    <div className="space-y-12 pb-16">
      {/* Header */}
      <div className="border-b border-pitch-line/60 pb-6">
        <Badge variant="neon" size="sm" className="mb-2">
          Design System & UI Kit
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-display font-black uppercase text-white tracking-wider">
          Giao diện SÂN 7 – Nội Bộ The Media
        </h1>
        <p className="text-pitch-muted text-sm mt-1">
          Hệ thống visual dark mode, pitch green, neon accent (#E8FF3A) và các hiệu ứng động.
        </p>
      </div>

      {/* 1. Buttons */}
      <section className="space-y-4">
        <h2 className="text-xl font-display uppercase tracking-wider text-accent-neon font-bold">
          1. Buttons & Trạng thái
        </h2>
        <Card>
          <CardContent className="pt-6 flex flex-wrap gap-4 items-center">
            <Button variant="neon">Neon Accent</Button>
            <Button variant="primary">Primary Emerald</Button>
            <Button variant="secondary">Secondary Dark</Button>
            <Button variant="ghost">Ghost Button</Button>
            <Button variant="danger">Danger Red</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="neon" isLoading>
              Loading...
            </Button>
            <Button variant="primary" size="sm">
              Small
            </Button>
            <Button variant="primary" size="lg">
              Large
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* 2. Badges & Spinners */}
      <section className="space-y-4">
        <h2 className="text-xl font-display uppercase tracking-wider text-accent-neon font-bold">
          2. Badges, Spinners & Skeletons
        </h2>
        <Card>
          <CardContent className="pt-6 space-y-6">
            <div className="flex flex-wrap gap-3 items-center">
              <Badge variant="default">Default</Badge>
              <Badge variant="neon" dot pulseDot>
                Neon Pulse
              </Badge>
              <Badge variant="teamA" dot>
                Team A (Emerald)
              </Badge>
              <Badge variant="teamB" dot>
                Team B (Cyan)
              </Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="danger">Danger</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="neon" size="xs">
                XS Badge
              </Badge>
              <Badge variant="neon" size="md">
                MD Badge
              </Badge>
            </div>

            <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-pitch-line/50">
              <Spinner size="sm" variant="neon" label="Small Neon" />
              <Spinner size="md" variant="white" label="Medium White" />
              <Spinner size="lg" variant="neon" label="Large Neon" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-pitch-line/50">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </CardContent>
        </Card>
      </section>

      {/* 3. Toasts & Modals */}
      <section className="space-y-4">
        <h2 className="text-xl font-display uppercase tracking-wider text-accent-neon font-bold">
          3. Thông báo Toast & Modal
        </h2>
        <Card>
          <CardContent className="pt-6 flex flex-wrap gap-4">
            <Button
              variant="secondary"
              onClick={() => toast.success('Đã lưu dữ liệu thành công!', 'Thành công')}
            >
              Toast Success
            </Button>
            <Button
              variant="secondary"
              onClick={() => toast.error('Không thể kết nối đến máy chủ!', 'Lỗi')}
            >
              Toast Error
            </Button>
            <Button
              variant="secondary"
              onClick={() => toast.warning('Cần chọn ít nhất 1 vị trí sở trường!', 'Lưu ý')}
            >
              Toast Warning
            </Button>
            <Button
              variant="secondary"
              onClick={() => toast.info('Hệ thống đang chạy tối ưu 1.716 tổ hợp.', 'Thông tin')}
            >
              Toast Info
            </Button>
            <Button variant="neon" onClick={() => setIsModalOpen(true)}>
              Mở Modal Demo
            </Button>
          </CardContent>
        </Card>

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Xác nhận đăng ký đội hình"
          description="Vui lòng kiểm tra lại thông tin trước khi hoàn tất nộp phiếu."
          footer={
            <>
              <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
                Hủy bỏ
              </Button>
              <Button
                variant="neon"
                onClick={() => {
                  setIsModalOpen(false);
                  toast.success('Đã xác nhận thành công!');
                }}
              >
                Xác nhận
              </Button>
            </>
          }
        >
          <div className="space-y-3 text-sm">
            <p className="text-pitch-text">
              Bạn đã chọn vị trí sở trường <strong>Tiền vệ trung tâm (MF)</strong> và vị trí phụ{' '}
              <strong>Tiền đạo (FW)</strong>.
            </p>
            <p className="text-xs text-pitch-muted">
              Sau khi nộp, ban quản lý sẽ sử dụng dữ liệu để chia 2 đội hình tối ưu nhất.
            </p>
          </div>
        </Modal>
      </section>

      {/* 4. Controls: Slider, Input & Field */}
      <section className="space-y-4">
        <h2 className="text-xl font-display uppercase tracking-wider text-accent-neon font-bold">
          4. Controls: Slider, Input & Field
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Thang điểm đánh giá</CardTitle>
              <CardDescription>Thước đo điểm lực chiến từ 1.0 đến 10.0</CardDescription>
            </CardHeader>
            <CardContent>
              <Slider
                value={sliderVal}
                onChange={setSliderVal}
                min={1}
                max={10}
                step={0.5}
                label="Điểm thực lực Admin"
                unit="đ"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Input Field</CardTitle>
              <CardDescription>Trường nhập dữ liệu với label & trạng thái</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Field label="Họ và tên cầu thủ" required hint="Tên dùng để điểm danh trên sân">
                <Input
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder="Nhập tên..."
                />
              </Field>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 5. Player Avatars & Chips */}
      <section className="space-y-4">
        <h2 className="text-xl font-display uppercase tracking-wider text-accent-neon font-bold">
          5. BallAvatar & PlayerChip
        </h2>
        <Card>
          <CardContent className="pt-6 space-y-6">
            <div className="flex flex-wrap items-center gap-6">
              <BallAvatar name="Quang Hải" jerseyNumber={19} teamVariant="neon" size="lg" />
              <BallAvatar name="Văn Hậu" jerseyNumber={5} teamVariant="teamA" size="lg" />
              <BallAvatar name="Tiến Linh" jerseyNumber={22} teamVariant="teamB" size="lg" />
              <BallAvatar name="Tấn Trường" jerseyNumber={1} teamVariant="neutral" size="lg" />
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-pitch-line/50">
              <PlayerChip
                name="Nguyễn Quang Hải"
                jerseyNumber={19}
                primaryPosition="MF"
                secondaryPosition="FW"
                hasSubmitted={true}
                showStatus
              />
              <PlayerChip
                name="Đoàn Văn Hậu"
                jerseyNumber={5}
                primaryPosition="WG"
                isSelected={true}
                showStatus
              />
              <PlayerChip
                name="Nguyễn Văn Toàn"
                jerseyNumber={9}
                primaryPosition="FW"
                onRemove={() => toast.info('Đã xóa khỏi danh sách né')}
              />
            </div>
          </CardContent>
        </Card>
      </section>

      {/* 6. FX & Animations */}
      <section className="space-y-4">
        <h2 className="text-xl font-display uppercase tracking-wider text-accent-neon font-bold">
          6. Hiệu ứng FX & Hoạt cảnh
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Quả bóng tưng</CardTitle>
            </CardHeader>
            <CardContent>
              <BouncingBall size="md" label="Đang nạp dữ liệu trận đấu..." />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Bộ đếm CountUp</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-4">
              <CountUp
                end={98.5}
                decimals={1}
                suffix="%"
                className="text-4xl text-accent-neon font-display"
              />
              <span className="text-xs text-pitch-muted mt-1">Độ cân bằng thuật toán</span>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pháo giấy Confetti</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <Button variant="neon" size="sm" onClick={fireTeamSplitConfetti}>
                Bắn pháo chia đội (Full)
              </Button>
              <Button variant="secondary" size="sm" onClick={fireSideCannons}>
                Bắn 2 bên biên sân
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Shuffle Reveal Demo */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Mô phỏng bốc thăm đội hình (ShuffleReveal)</CardTitle>
              <CardDescription>Hiệu ứng xoay bài kịch tính trước khi mở kết quả</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsRevealed(!isRevealed)}
              className="gap-1.5"
            >
              <RefreshCw className="h-4 w-4" />
              {isRevealed ? 'Đặt lại' : 'Kích hoạt Reveal'}
            </Button>
          </CardHeader>
          <CardContent>
            <ShuffleReveal isRevealed={isRevealed} durationMs={1500}>
              <div className="p-6 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-center">
                <Trophy className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
                <h4 className="text-lg font-display uppercase tracking-wider text-white">
                  Đội hình đã được bốc thăm hoàn tất!
                </h4>
                <p className="text-xs text-pitch-muted mt-1">
                  Độ chênh lệch điểm sức mạnh: 0.2đ • Tối ưu 100% vị trí sở trường
                </p>
              </div>
            </ShuffleReveal>
          </CardContent>
        </Card>
      </section>

      {/* 7. Position Picker */}
      <section className="space-y-4">
        <h2 className="text-xl font-display uppercase tracking-wider text-accent-neon font-bold">
          7. Sơ đồ chọn vị trí (Tactical Position Picker)
        </h2>
        <Card>
          <CardHeader>
            <CardTitle>Khai báo vị trí thi đấu trên sân</CardTitle>
            <CardDescription>
              Nhấp trực tiếp vào các vị trí trên sa bàn: Click lần 1 là Vị trí chính (Neon), lần 2 là
              Vị trí phụ (Cyan).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PositionPicker value={positions} onChange={setPositions} />
          </CardContent>
        </Card>
      </section>

      {/* 8. FIFA 3D Tilt Card */}
      <section className="space-y-4">
        <h2 className="text-xl font-display uppercase tracking-wider text-accent-neon font-bold">
          8. Thẻ cầu thủ FIFA 3D (PlayerCard Tilt & Flip)
        </h2>
        <p className="text-xs text-pitch-muted">
          Di chuột để cảm nhận hiệu ứng nghiêng 3D. Nhấp vào thẻ để lật xem mặt sau!
        </p>
        <div className="flex flex-wrap gap-8 items-center justify-center sm:justify-start">
          <PlayerCard
            id={1}
            name="Nguyễn Quang Hải"
            jerseyNumber={19}
            primaryPosition="MF"
            secondaryPosition="FW"
            hasSubmitted={true}
            score={9.2}
            isAdmin={true}
            avoidances={[{ id: 2, name: 'Văn Toàn' }]}
            notes="Chuyên sút phạt chân trái, phát động tấn công tuyến 2."
            teamVariant="neon"
          />

          <PlayerCard
            id={2}
            name="Đoàn Văn Hậu"
            jerseyNumber={5}
            primaryPosition="WG"
            secondaryPosition="DF"
            hasSubmitted={true}
            score={8.8}
            isAdmin={false} // Public view -> no score or avoidance shown!
            teamVariant="teamA"
          />

          <PlayerCard
            id={3}
            name="Nguyễn Tiến Linh"
            jerseyNumber={22}
            primaryPosition="FW"
            secondaryPosition={null}
            hasSubmitted={false}
            teamVariant="teamB"
          />
        </div>
      </section>

      {/* 9. Team Pitch (7 players on pitch) */}
      <section className="space-y-4">
        <h2 className="text-xl font-display uppercase tracking-wider text-accent-neon font-bold">
          9. Sa bàn đội hình 7 người (Sơ đồ 1-1-2-1-2)
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <TeamPitch
            teamName="ĐỘI XANH LÁ (TEAM A)"
            players={sampleTeamPlayers}
            onPlayerClick={(p) => toast.info(`Đã chọn cầu thủ: ${p.name} (#${p.jerseyNumber})`)}
          />
          <TeamPitch
            teamName="ĐỘI XANH DƯƠNG (TEAM B)"
            isTeamB={true}
            players={sampleTeamPlayers}
            onPlayerClick={(p) => toast.info(`Đã chọn cầu thủ: ${p.name} (#${p.jerseyNumber})`)}
          />
        </div>
      </section>

      {/* 10. Empty State & Error State */}
      <section className="space-y-4">
        <h2 className="text-xl font-display uppercase tracking-wider text-accent-neon font-bold">
          10. Empty State & Error State
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <EmptyState
            icon={Trophy}
            title="Chưa có kết quả chia đội"
            description="Ban tổ chức đang chuẩn bị danh sách cầu thủ. Kết quả sẽ được công bố tại đây."
            actionLabel="Làm mới trang"
            onAction={() => toast.info('Đang kiểm tra kết quả mới...')}
          />
          <ErrorState
            title="Không thể tải danh sách cầu thủ"
            message="Máy chủ phản hồi mã lỗi 500 hoặc mất kết nối mạng. Vui lòng kiểm tra lại."
            onRetry={() => toast.info('Đang thử lại kết nối...')}
          />
        </div>
      </section>
    </div>
  );
};
export default DevUiPage;
