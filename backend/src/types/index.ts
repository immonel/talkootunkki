export type TelegramUserData = {
  id: string;
  first_name: string;
  last_name?: string;
  username?: string;
}

export type LeaderboardAssociation = {
  name: string;
  totalTime: number;
}