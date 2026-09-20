import { Position } from '../../api/types';

export interface FormationSlot {
  slotId: string;
  position: Position;
  label: string;
  vietnameseName: string;
  // Coordinates in percentage (0 - 100) for vertical half-pitch (Attack at top, Goal at bottom)
  x: number;
  y: number;
}

export const FORMATION_11212: FormationSlot[] = [
  {
    slotId: 'FW_L',
    position: 'FW',
    label: 'FW-T',
    vietnameseName: 'Tiền đạo trái',
    x: 30,
    y: 16,
  },
  {
    slotId: 'FW_R',
    position: 'FW',
    label: 'FW-P',
    vietnameseName: 'Tiền đạo phải',
    x: 70,
    y: 16,
  },
  {
    slotId: 'MF',
    position: 'MF',
    label: 'MF',
    vietnameseName: 'Tiền vệ trung tâm',
    x: 50,
    y: 38,
  },
  {
    slotId: 'WG_L',
    position: 'WG',
    label: 'WG-T',
    vietnameseName: 'Cánh trái',
    x: 18,
    y: 52,
  },
  {
    slotId: 'WG_R',
    position: 'WG',
    label: 'WG-P',
    vietnameseName: 'Cánh phải',
    x: 82,
    y: 52,
  },
  {
    slotId: 'DF',
    position: 'DF',
    label: 'DF',
    vietnameseName: 'Thòng (Hậu vệ)',
    x: 50,
    y: 70,
  },
  {
    slotId: 'GK',
    position: 'GK',
    label: 'GK',
    vietnameseName: 'Thủ môn',
    x: 50,
    y: 88,
  },
];

export const POSITION_COORDINATES: Record<Position, { x: number; y: number }> = {
  FW: { x: 50, y: 16 },
  MF: { x: 50, y: 38 },
  WG: { x: 50, y: 52 },
  DF: { x: 50, y: 70 },
  GK: { x: 50, y: 88 },
};
