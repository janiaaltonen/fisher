import { TestBed } from '@angular/core/testing';

import { FishingStatsService } from './fishing-stats.service';

describe('FishingStatsService', () => {
  let service: FishingStatsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FishingStatsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
