export type TelegramUserData = {
  id: string;
  first_name: string;
  last_name?: string;
  username?: string;
}

export type LeaderboardRow = {
  association: string;
  totalTime: number;
}