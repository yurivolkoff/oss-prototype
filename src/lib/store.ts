import { create } from 'zustand';
import type { Meeting, MeetingState } from './types';
import { seedHouse, seedAdministrator, seedPremises } from './seed';

function buildInitialMeeting(state: MeetingState = 'none'): Meeting {
  return {
    id: 'demo-meeting-1',
    state,
    isFirstInSystem: true,
    house: seedHouse,
    premises: seedPremises,
    administrator: seedAdministrator,
    _step1Substep: null,
    _step1Completed: false,
  };
}

interface MeetingStoreState {
  meeting: Meeting;
  /** Start a new meeting (Шаг 1 — клик «Начать собрание»). */
  startMeeting: () => void;
  /** Move to screen 03 (шахматка). */
  goToHouseB: () => void;
  /** Mark step 1 completed and move to module 2. */
  completeStep1: () => void;
  /** Reset meeting back to initial 'none' (for debug only). */
  resetMeeting: () => void;
  /** Replace meeting wholesale (used by ?demo-state parser at boot). */
  setMeeting: (meeting: Meeting) => void;
}

export const useMeetingStore = create<MeetingStoreState>((set) => ({
  meeting: buildInitialMeeting(),
  startMeeting: () =>
    set((s) => ({
      meeting: {
        ...s.meeting,
        id: `meeting-${Date.now()}`,
        state: 'draft_preparation',
        _step1Substep: 'house-a',
        _step1Completed: false,
      },
    })),
  goToHouseB: () =>
    set((s) => ({
      meeting: { ...s.meeting, _step1Substep: 'house-b' },
    })),
  completeStep1: () =>
    set((s) => ({
      meeting: { ...s.meeting, _step1Completed: true },
    })),
  resetMeeting: () => set({ meeting: buildInitialMeeting() }),
  setMeeting: (meeting) => set({ meeting }),
}));

export { buildInitialMeeting };
