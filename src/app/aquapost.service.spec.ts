import { TestBed } from '@angular/core/testing';

import { AquapostService } from './aquapost.service';

describe('AquapostService', () => {
  let service: AquapostService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AquapostService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
