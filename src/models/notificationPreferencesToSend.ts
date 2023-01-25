export interface NotificationPreferencesToSend {
  roomId?: string,
  sectionId?: string,
  preferences: 'ALL' | 'MENTIONS_ONLY' | 'NONE',
}
