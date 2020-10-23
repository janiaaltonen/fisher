import { Catches } from '@app/_models/catches';

export class Stats {
  id: number;
  fishing_method: string;
  lure: string;
  lure_details: string;
  catches: Catches[];
}
