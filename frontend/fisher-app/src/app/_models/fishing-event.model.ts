export class FishingEvent {
  id: bigint;
  date: string;
  location: string;
  persons: bigint;
  stats: [
    {
      id: bigint;
      fishing_method: string;
      catches: [
        {
          id: bigint;
          fish_species: string;
          fish_details: string;
          lure: string;
          lure_details: string;
        }
      ]
    }
  ];
}
