import { Stats } from '@app/_models/stats';

export class FishingEvent {
  id: number;
  date: string;
  location: string;
  location_details: string;
  start_time: string;
  end_time: string;
  weather: string;
  air_temperature: number;
  persons: number;
  stats: Stats [];
}
