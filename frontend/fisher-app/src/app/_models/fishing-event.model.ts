import { Stats } from '@app/_models/stats';

export class FishingEvent {
  id: number;
  date: string;
  location: string;
  persons: number;
  stats: Stats [];
}
