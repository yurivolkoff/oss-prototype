import type { MeetingState } from './types';
import { buildInitialMeeting, useMeetingStore } from './store';

const validStates: MeetingState[] = [
  'none',
  'draft_preparation',
  'draft_ready',
  'preview_notification',
  'notification_published',
  'voting_active',
  'voting_completed',
  'work_info_required',
  'archived',
];

export function applyDemoStateFromUrl(): void {
  const params = new URLSearchParams(window.location.search);
  const raw = params.get('demo-state');
  if (!raw) return;
  if (!validStates.includes(raw as MeetingState)) return;

  const meeting = buildInitialMeeting(raw as MeetingState);
  // For draft_preparation — start at house-a; for others, leave substep null.
  if (meeting.state === 'draft_preparation') {
    meeting._step1Substep = 'house-a';
  }
  useMeetingStore.getState().setMeeting(meeting);
}
