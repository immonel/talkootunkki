export interface Event {
  event_id: string;
  event_name: string;
  start_date: string;
  end_date: string;
}

export interface Participant {
  username: string | null;
  first_name: string;
  last_name: string | null;
  email: string | null;
}

export interface Participation {
  participation_id: string;
  user_id: string;
  start_date: string;
  end_date: string;
  association: string | null;
}

export type LeaderboardAssociation = {
  name: string;
  totalTime: number;
}

export type EventWithLeaderboards = {
  event_id: string;
  event_name: string;
  start_date: string;
  end_date: string;
  leaderboards: LeaderboardAssociation[];
}