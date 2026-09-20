import React from 'react';
import { PublicTeam, TeamPlayerDto } from '../../api/types';
import { TeamPitch } from '../../components/pitch/TeamPitch';

export interface TeamSheetProps {
  team: PublicTeam;
  isTeamB?: boolean;
}

export const TeamSheet: React.FC<TeamSheetProps> = ({ team, isTeamB = false }) => {
  // Convert PublicSlotPlayer[] to TeamPlayerDto[] for TeamPitch
  const players: TeamPlayerDto[] = team.players.map((p) => ({
    id: p.id,
    name: p.name,
    assignedPosition: p.position,
    isPrimaryPosition: true,
  }));

  return (
    <div className="w-full space-y-2">
      <TeamPitch
        teamName={team.name}
        color={team.color}
        players={players}
        isTeamB={isTeamB}
      />
    </div>
  );
};
