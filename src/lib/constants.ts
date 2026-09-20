import { Position } from '@/api/types';

export const POSITION_DETAILS: Record<
  Position,
  { label: string; shortLabel: string; code: Position; desc: string }
> = {
  GK: {
    code: 'GK',
    label: 'Thủ môn',
    shortLabel: 'TM',
    desc: 'Chốt chặn cuối cùng, bảo vệ mành lưới',
  },
  DF: {
    code: 'DF',
    label: 'Thòng (Hậu vệ)',
    shortLabel: 'DF',
    desc: 'Chỉ huy hàng thủ, quét sạch bóng nguy hiểm',
  },
  WG: {
    code: 'WG',
    label: 'Cánh',
    shortLabel: 'CÁNH',
    desc: 'Lên công về thủ, leo biên tạt bóng',
  },
  MF: {
    code: 'MF',
    label: 'Giữa (Tiền vệ)',
    shortLabel: 'GIỮA',
    desc: 'Cầm nhịp, phân phối bóng và chia bài',
  },
  FW: {
    code: 'FW',
    label: 'Tiền đạo',
    shortLabel: 'TĐ',
    desc: 'Chớp thời cơ, săn bàn kết liễu trận đấu',
  },
};

export const ALL_POSITIONS: Position[] = ['GK', 'DF', 'WG', 'MF', 'FW'];
export const POSITIONS = ALL_POSITIONS;

export const POSITION_NAMES: Record<Position, string> = {
  GK: 'Thủ môn',
  DF: 'Thòng',
  WG: 'Cánh',
  MF: 'Giữa',
  FW: 'Tiền đạo',
};

export const SCORE_DESCRIPTIONS: Record<number, string> = {
  1: 'Mới tập đá, chủ yếu ra sân cho vui 🏃',
  2: 'Mới tập đá, chủ yếu ra sân cho vui 🏃',
  3: 'Chạy nhiệt tình, kỹ thuật đang cập nhật ⚙️',
  4: 'Chạy nhiệt tình, kỹ thuật đang cập nhật ⚙️',
  5: 'Đá ổn, không làm hại đội ⚽',
  6: 'Đá ổn, không làm hại đội ⚽',
  7: 'Gánh team được, phong độ uy tín 💪',
  8: 'Gánh team được, phong độ uy tín 💪',
  9: 'Cân cả sân, xin đừng khiêm tốn giả 🔥',
  10: 'Cân cả sân, xin đừng khiêm tốn giả 🔥',
};

export const BALANCE_COMMENTARY = (diff: number): string => {
  if (diff <= 0.5) return 'Kèo thơm, cân từng gram ⚖️';
  if (diff <= 1.5) return 'Cân tương đối, trận đấu hứa hẹn kịch tính ⚡';
  if (diff <= 2.5) return 'Hơi lệch nhẹ, cần chiến thuật bù đắp 🧠';
  return 'Có mùi thiên vị 👀, kèo hơi lệch nha admin!';
};
