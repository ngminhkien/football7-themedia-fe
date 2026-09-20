import { describe, it, expect } from 'vitest';
import { wizardReducer, initialWizardState, WizardState } from '../src/features/submission/wizardReducer';

describe('wizardReducer', () => {
  it('should navigate to next and prev step', () => {
    let state = wizardReducer(initialWizardState, { type: 'NEXT_STEP' });
    expect(state.currentStep).toBe(2);

    state = wizardReducer(state, { type: 'NEXT_STEP' });
    expect(state.currentStep).toBe(3);

    state = wizardReducer(state, { type: 'PREV_STEP' });
    expect(state.currentStep).toBe(2);
  });

  it('should limit avoidIds to max 2', () => {
    let state = { ...initialWizardState, avoidIds: [101, 102] };
    
    // Trying to toggle a 3rd id should not add it (since max is 2)
    state = wizardReducer(state, { type: 'TOGGLE_AVOID', payload: 103 });
    expect(state.avoidIds).toEqual([101, 102]);

    // Toggling an existing id should remove it
    state = wizardReducer(state, { type: 'TOGGLE_AVOID', payload: 101 });
    expect(state.avoidIds).toEqual([102]);
  });

  it('should clear preferred position if it is no longer in positions', () => {
    let state: WizardState = { 
      ...initialWizardState, 
      positions: ['FW', 'MF'], 
      preferredPosition: 'FW' 
    };

    // Changing positions to not include 'FW'
    state = wizardReducer(state, { 
      type: 'SET_POSITIONS', 
      payload: { positions: ['DF', 'GK'] } 
    });

    expect(state.positions).toEqual(['DF', 'GK']);
    expect(state.preferredPosition).toBeNull(); // it should be cleared
  });
});
