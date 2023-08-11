export interface Event {
  event_id: string;
  event_name: string;
  start_date: string;
  end_date: string;
}

export type LeaderboardAssociation = {
  name: string;
  totalTime: number;
}