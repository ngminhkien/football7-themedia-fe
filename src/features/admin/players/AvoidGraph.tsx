import React, { useState } from 'react';
import { EyeOff } from 'lucide-react';
import { AdminPlayer } from '../../../api/types';

export interface AvoidGraphProps {
  players: AdminPlayer[];
}

export const AvoidGraph: React.FC<AvoidGraphProps> = ({ players }) => {
  const [hoveredPlayerId, setHoveredPlayerId] = useState<number | null>(null);

  const activePlayers = players.filter((p) => p.isActive);
  const total = activePlayers.length;

  if (total === 0) {
    return null;
  }

  // Count how many times each player is avoided
  const avoidedCountMap: Record<number, number> = {};
  activePlayers.forEach((p) => {
    p.avoidIds?.forEach((targetId) => {
      avoidedCountMap[targetId] = (avoidedCountMap[targetId] || 0) + 1;
    });
  });

  // Calculate coordinates on a circle of radius R
  const size = 380;
  const center = size / 2;
  const radius = 135;

  const nodeCoords = new Map<number, { x: number; y: number; angle: number }>();
  activePlayers.forEach((p, idx) => {
    const angle = (idx / total) * 2 * Math.PI - Math.PI / 2;
    const x = center + radius * Math.cos(angle);
    const y = center + radius * Math.sin(angle);
    nodeCoords.set(p.id, { x, y, angle });
  });

  // Collect all edges: source -> target
  interface Edge {
    sourceId: number;
    targetId: number;
    isMutual: boolean;
  }

  const edges: Edge[] = [];
  const edgeSet = new Set<string>();

  activePlayers.forEach((p) => {
    p.avoidIds?.forEach((targetId) => {
      const targetPlayer = activePlayers.find((tp) => tp.id === targetId);
      if (!targetPlayer) return;

      const isMutual = targetPlayer.avoidIds?.includes(p.id) || false;
      const key = `${Math.min(p.id, targetId)}-${Math.max(p.id, targetId)}`;

      if (isMutual) {
        if (!edgeSet.has(key)) {
          edgeSet.add(key);
          edges.push({ sourceId: p.id, targetId, isMutual: true });
        }
      } else {
        edges.push({ sourceId: p.id, targetId, isMutual: false });
      }
    });
  });

  return (
    <div className="p-4 sm:p-6 rounded-3xl bg-pitch-panel/80 border border-pitch-line/80 space-y-4 shadow-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <EyeOff className="w-4 h-4 text-accent-neon" />
          <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
            Sơ Đồ Xung Đột & Tránh Nhau (Avoid Graph)
          </h4>
        </div>
        <span className="text-xs text-pitch-muted font-mono">
          Tổng {edges.length} quan hệ né
        </span>
      </div>

      <p className="text-xs text-pitch-muted">
        Mũi tên chỉ từ người né đến người bị né. Đường đỏ dày là cặp né lẫn nhau. Người có viền nhấp nháy bị ≥ 3 người né.
      </p>

      {/* SVG Interactive Circular Graph (Shown on md+) */}
      <div className="hidden md:flex items-center justify-center py-2 relative">
        <svg width={size} height={size} className="overflow-visible select-none">
          {/* Defs for arrowheads */}
          <defs>
            <marker
              id="arrow"
              viewBox="0 0 10 10"
              refX="18"
              refY="5"
              markerWidth="5"
              markerHeight="5"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#f43f5e" />
            </marker>
            <marker
              id="arrow-active"
              viewBox="0 0 10 10"
              refX="18"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#E8FF3A" />
            </marker>
          </defs>

          {/* Background circle guideline */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeDasharray="4 4"
          />

          {/* Edges */}
          {edges.map((e, idx) => {
            const p1 = nodeCoords.get(e.sourceId);
            const p2 = nodeCoords.get(e.targetId);
            if (!p1 || !p2) return null;

            const isRelatedToHover =
              hoveredPlayerId != null &&
              (e.sourceId === hoveredPlayerId || e.targetId === hoveredPlayerId);

            return (
              <line
                key={`edge-${idx}`}
                x1={p1.x}
                y1={p1.y}
                x2={p2.x}
                y2={p2.y}
                stroke={
                  isRelatedToHover
                    ? '#E8FF3A'
                    : e.isMutual
                    ? '#f43f5e'
                    : 'rgba(244,63,94,0.4)'
                }
                strokeWidth={isRelatedToHover ? 2.5 : e.isMutual ? 2.5 : 1.2}
                strokeDasharray={e.isMutual ? undefined : '3 3'}
                markerEnd={e.isMutual ? undefined : isRelatedToHover ? 'url(#arrow-active)' : 'url(#arrow)'}
                className="transition-all"
              />
            );
          })}

          {/* Nodes */}
          {activePlayers.map((p) => {
            const coord = nodeCoords.get(p.id);
            if (!coord) return null;

            const timesAvoided = avoidedCountMap[p.id] || 0;
            const isCritical = timesAvoided >= 3;
            const isHovered = hoveredPlayerId === p.id;

            return (
              <g
                key={p.id}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredPlayerId(p.id)}
                onMouseLeave={() => setHoveredPlayerId(null)}
              >
                {/* Pulsing ring if avoided by >= 3 */}
                {isCritical && (
                  <circle
                    cx={coord.x}
                    cy={coord.y}
                    r={22}
                    fill="none"
                    stroke="#f43f5e"
                    strokeWidth="1.5"
                    className="animate-ping opacity-75"
                  />
                )}

                {/* Node circle */}
                <circle
                  cx={coord.x}
                  cy={coord.y}
                  r={16}
                  fill={isHovered ? '#E8FF3A' : '#06251B'}
                  stroke={isCritical ? '#f43f5e' : isHovered ? '#FFFFFF' : '#0E5A3F'}
                  strokeWidth="2.5"
                  className="transition-all"
                />

                {/* Player Initials text inside node */}
                <text
                  x={coord.x}
                  y={coord.y + 4}
                  textAnchor="middle"
                  fill={isHovered ? '#06251B' : '#FFFFFF'}
                  fontSize="9px"
                  fontWeight="bold"
                  fontFamily="sans-serif"
                >
                  {p.name.substring(0, 2).toUpperCase()}
                </text>

                {/* Name Label */}
                <text
                  x={coord.x}
                  y={coord.y + (coord.y > center ? 26 : -20)}
                  textAnchor="middle"
                  fill={isHovered ? '#E8FF3A' : '#F4FFF8'}
                  fontSize="11px"
                  fontWeight="600"
                >
                  {p.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Mobile-friendly List View */}
      <div className="space-y-2 pt-2 border-t border-pitch-line/50 md:hidden">
        <h5 className="text-xs font-semibold text-pitch-text">Danh sách chi tiết né nhau:</h5>
        <div className="space-y-1.5 max-h-60 overflow-y-auto">
          {activePlayers.map((p) => {
            if (!p.avoidIds || p.avoidIds.length === 0) return null;
            const targetNames = p.avoidIds
              .map((id) => activePlayers.find((tp) => tp.id === id)?.name)
              .filter(Boolean);

            return (
              <div
                key={p.id}
                className="flex items-center justify-between p-2 rounded-xl bg-pitch-dark/60 border border-pitch-line/40 text-xs"
              >
                <span className="font-semibold text-white">{p.name}</span>
                <span className="text-rose-400 font-medium">né ✕ {targetNames.join(', ')}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
