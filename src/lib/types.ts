export type MeetingState =
  | 'none'
  | 'draft_preparation'
  | 'draft_ready'
  | 'preview_notification'
  | 'notification_published'
  | 'voting_active'
  | 'voting_completed'
  | 'work_info_required'
  | 'archived';

export type PremiseIssue = 'no_cadastral' | 'wrong_area' | 'duplicate';
export type PremiseStatus = 'ok' | 'warning' | 'error';
export type PremiseType = 'apartment' | 'non_residential';

export interface PremiseOwner {
  fullName: string;
  email: string;
  phone: string;
  ownedArea: number;
  ownershipShare: string;
  ownershipDocNumber: string;
  state: 'verified' | 'pending';
}

export interface Premise {
  id: string;
  type: PremiseType;
  number: string;
  entrance: number;
  floor: number;
  area: number;
  cadastralNumber: string;
  cadastralLinked: boolean;
  status: PremiseStatus;
  issues: PremiseIssue[];
  owners: PremiseOwner[];
  /** Optional human-readable annotation for tile display, e.g. '+1 м² к данным Росреестра' */
  warningNote?: string;
}

export interface House {
  address: string;
  cadastralNumber: string;
  addressCode: string;
  totalArea: number;
  apartmentsCount: number;
  nonResidentialCount: number;
  floorsCount: number;
  dataUpdatedAt: string;
  cadastralLinkedCount: number;
  duplicatesCount: number;
}

export interface Administrator {
  organizationName: string;
  email: string;
  phone: string;
  inn: string;
}

export interface Meeting {
  id: string;
  state: MeetingState;
  isFirstInSystem: boolean;
  house: House;
  premises: Premise[];
  administrator: Administrator;
  /** Module 1 sub-step: which preparation page is active. */
  _step1Substep: 'house-a' | 'house-b' | null;
  /** Set when user clicks «Продолжить» on screen 03. */
  _step1Completed: boolean;
}
