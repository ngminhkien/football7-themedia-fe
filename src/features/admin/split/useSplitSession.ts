import { useState, useCallback } from 'react';
import { SplitPlan, SplitWeights } from '../../../api/types';

export const DEFAULT_WEIGHTS: SplitWeights = {
  adminWeight: 0.7,
  selfWeight: 0.3,
  powerWeight: 1.0,
  conflictWeight: 6.0,
  outOfPositionWeight: 100.0,
  preferredBonus: 0.3,
};

export interface SplitSessionHistory {
  id: string;
  timestamp: string;
  plans: SplitPlan[];
}

export function useSplitSession() {
  const [plans, setPlans] = useState<SplitPlan[]>([]);
  const [selectedPlanIndex, setSelectedPlanIndex] = useState<number>(0);
  const [lockedTeamA, setLockedTeamA] = useState<number[]>([]);
  const [lockedTeamB, setLockedTeamB] = useState<number[]>([]);
  const [allowIncomplete, setAllowIncomplete] = useState<boolean>(false);
  const [weights, setWeights] = useState<SplitWeights>(DEFAULT_WEIGHTS);
  const [history, setHistory] = useState<SplitSessionHistory[]>([]);

  const togglePlayerLock = useCallback((playerId: number, targetTeam: 'A' | 'B' | 'NONE') => {
    setLockedTeamA((prevA) => {
      const filteredA = prevA.filter((id) => id !== playerId);
      if (targetTeam === 'A') {
        if (filteredA.length >= 7) return prevA; // maximum 7
        return [...filteredA, playerId];
      }
      return filteredA;
    });

    setLockedTeamB((prevB) => {
      const filteredB = prevB.filter((id) => id !== playerId);
      if (targetTeam === 'B') {
        if (filteredB.length >= 7) return prevB; // maximum 7
        return [...filteredB, playerId];
      }
      return filteredB;
    });
  }, []);

  const clearLocks = useCallback(() => {
    setLockedTeamA([]);
    setLockedTeamB([]);
  }, []);

  const [activeHistoryId, setActiveHistoryId] = useState<string | null>(null);

  const pushPlans = useCallback((newPlans: SplitPlan[]) => {
    setPlans(newPlans);
    setSelectedPlanIndex(0);

    if (newPlans.length > 0) {
      const newId = Math.random().toString(36).substring(2, 8);
      const newHistoryItem: SplitSessionHistory = {
        id: newId,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        plans: newPlans,
      };
      setActiveHistoryId(newId);
      setHistory((prev) => [newHistoryItem, ...prev.slice(0, 4)]); // keep last 5 runs
    }
  }, []);

  const selectHistory = useCallback((id: string) => {
    setHistory((prev) => {
      const found = prev.find((h) => h.id === id);
      if (found) {
        setPlans(found.plans);
        setSelectedPlanIndex(0);
        setActiveHistoryId(id);
      }
      return prev;
    });
  }, []);

  const loadHistoryItem = useCallback((item: SplitSessionHistory) => {
    setPlans(item.plans);
    setSelectedPlanIndex(0);
    setActiveHistoryId(item.id);
  }, []);

  const resetWeights = useCallback(() => {
    setWeights(DEFAULT_WEIGHTS);
  }, []);

  const selectedPlan = plans[selectedPlanIndex] || null;

  return {
    plans,
    selectedPlan,
    selectedPlanIndex,
    setSelectedPlanIndex,
    lockedTeamA,
    lockedTeamB,
    togglePlayerLock,
    clearLocks,
    allowIncomplete,
    setAllowIncomplete,
    weights,
    setWeights,
    resetWeights,
    history,
    activeHistoryId,
    selectHistory,
    pushPlans,
    loadHistoryItem,
  };
}
