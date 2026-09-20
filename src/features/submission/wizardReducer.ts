import { Position } from '../../api/types';
import { getSubmissionDraft, getSubmittedRecord } from './draftStorage';

export type WizardStep = 1 | 2 | 3 | 4 | 5;

export interface WizardState {
  currentStep: WizardStep;
  playerId: number | null;
  playerName: string;
  positions: Position[];
  preferredPosition: Position | null;
  avoidIds: number[];
  selfScore: number;
  isSubmitting: boolean;
  isSubmitted: boolean;
  error: string | null;
}

export type WizardAction =
  | { type: 'SELECT_PLAYER'; payload: { id: number; name: string } }
  | { type: 'SET_POSITIONS'; payload: { positions: Position[]; preferredPosition?: Position | null } }
  | { type: 'SET_PREFERRED_POSITION'; payload: Position }
  | { type: 'TOGGLE_AVOID'; payload: number }
  | { type: 'CLEAR_AVOIDS' }
  | { type: 'SET_SELF_SCORE'; payload: number }
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'GO_TO_STEP'; payload: WizardStep }
  | { type: 'SUBMIT_START' }
  | { type: 'SUBMIT_SUCCESS' }
  | { type: 'SUBMIT_ERROR'; payload: string }
  | { type: 'RESET_FLOW' };

export const initialWizardState: WizardState = {
  currentStep: 1,
  playerId: null,
  playerName: '',
  positions: [],
  preferredPosition: null,
  avoidIds: [],
  selfScore: 6,
  isSubmitting: false,
  isSubmitted: false,
  error: null,
};

export function wizardReducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case 'SELECT_PLAYER': {
      const { id, name } = action.payload;
      // Check existing draft or previous submission
      const existing = getSubmittedRecord(id) || getSubmissionDraft(id);
      if (existing) {
        return {
          ...state,
          playerId: id,
          playerName: name,
          positions: existing.positions || [],
          preferredPosition: existing.preferredPosition || null,
          avoidIds: existing.avoidIds || [],
          selfScore: existing.selfScore || 6,
          error: null,
        };
      }
      return {
        ...state,
        playerId: id,
        playerName: name,
        error: null,
      };
    }

    case 'SET_POSITIONS': {
      const { positions, preferredPosition } = action.payload;
      let newPreferred = preferredPosition !== undefined ? preferredPosition : state.preferredPosition;

      // If preferred position is not in positions, update or clear it
      if (newPreferred && !positions.includes(newPreferred)) {
        newPreferred = positions.length === 1 ? positions[0] : null;
      } else if (!newPreferred && positions.length === 1) {
        newPreferred = positions[0];
      }

      return {
        ...state,
        positions,
        preferredPosition: newPreferred,
        error: null,
      };
    }

    case 'SET_PREFERRED_POSITION':
      return {
        ...state,
        preferredPosition: action.payload,
        error: null,
      };

    case 'TOGGLE_AVOID': {
      const id = action.payload;
      if (state.avoidIds.includes(id)) {
        return {
          ...state,
          avoidIds: state.avoidIds.filter((item) => item !== id),
        };
      }
      if (state.avoidIds.length >= 2) {
        return state; // maximum 2
      }
      return {
        ...state,
        avoidIds: [...state.avoidIds, id],
      };
    }

    case 'CLEAR_AVOIDS':
      return {
        ...state,
        avoidIds: [],
      };

    case 'SET_SELF_SCORE':
      return {
        ...state,
        selfScore: action.payload,
      };

    case 'NEXT_STEP':
      if (state.currentStep < 5) {
        return {
          ...state,
          currentStep: (state.currentStep + 1) as WizardStep,
          error: null,
        };
      }
      return state;

    case 'PREV_STEP':
      if (state.currentStep > 1) {
        return {
          ...state,
          currentStep: (state.currentStep - 1) as WizardStep,
          error: null,
        };
      }
      return state;

    case 'GO_TO_STEP':
      return {
        ...state,
        currentStep: action.payload,
        error: null,
      };

    case 'SUBMIT_START':
      return {
        ...state,
        isSubmitting: true,
        error: null,
      };

    case 'SUBMIT_SUCCESS':
      return {
        ...state,
        isSubmitting: false,
        isSubmitted: true,
        currentStep: 5,
        error: null,
      };

    case 'SUBMIT_ERROR':
      return {
        ...state,
        isSubmitting: false,
        error: action.payload,
      };

    case 'RESET_FLOW':
      return {
        ...initialWizardState,
      };

    default:
      return state;
  }
}
