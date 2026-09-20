import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { TeamPitch } from '../src/components/pitch/TeamPitch';
import { TeamPlayerDto } from '../src/api/types';

describe('TeamPitch slot mapping', () => {
  it('should map 7 players with correct positions to their respective slots', () => {
    const players: TeamPlayerDto[] = [
      { id: 1, name: 'P1', assignedPosition: 'GK' },
      { id: 2, name: 'P2', assignedPosition: 'DF' },
      { id: 3, name: 'P3', assignedPosition: 'WG' },
      { id: 4, name: 'P4', assignedPosition: 'WG' },
      { id: 5, name: 'P5', assignedPosition: 'MF' },
      { id: 6, name: 'P6', assignedPosition: 'FW' },
      { id: 7, name: 'P7', assignedPosition: 'FW' },
    ];

    const { getAllByText } = render(<TeamPitch teamName="Test Team" players={players} />);
    
    // We expect their names to be rendered on the pitch
    players.forEach(p => {
      expect(getAllByText(p.name).length).toBeGreaterThan(0);
    });
  });

  it('should fallback to fill empty slots if positions are unbalanced', () => {
    // E.g., 7 Forwards
    const players: TeamPlayerDto[] = Array.from({ length: 7 }).map((_, i) => ({
      id: i + 1,
      name: `Striker ${i + 1}`,
      assignedPosition: 'FW'
    }));

    const { getAllByText, queryByText } = render(<TeamPitch teamName="Test Team" players={players} />);
    
    // All 7 players should still be placed in *some* slot
    players.forEach(p => {
      expect(getAllByText(p.name).length).toBeGreaterThan(0);
    });
    
    // The empty slots (like GK, DF) shouldn't be showing their placeholder labels if they are filled by fallbacks
    expect(queryByText('GK - Thủ môn')).not.toBeInTheDocument();
  });

  it('should show placeholders for missing players', () => {
    const players: TeamPlayerDto[] = [
      { id: 1, name: 'Keeper', assignedPosition: 'GK' }
    ];

    const { getAllByText } = render(<TeamPitch teamName="Test Team" players={players} />);
    
    expect(getAllByText('Keeper').length).toBeGreaterThan(0);
    
    // Other slots should show placeholders
    expect(getAllByText('DF').length).toBeGreaterThan(0);
  });
});
