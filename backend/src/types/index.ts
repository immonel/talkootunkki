export interface TelegramUserData {
  id: string;
  first_name: string;
  last_name?: string;
  username?: string;
}

export interface UserData extends TelegramUserData {
  email?: string;
}

export type LeaderboardAssociation = {
  name: string;
  totalTime: number;
}

export interface GoogleSheetsRow {
  first_name?: string;
  last_name?: string;
  username?: string;
  email?: string;
  association?: string;
  start_date?: number;
  end_date?: number;
  participation_id: string;
}