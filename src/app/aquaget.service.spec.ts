import { TestBed } from '@angular/core/testing';

import { AquagetService } from './aquaget.service';

describe('AquagetService', () => {
  let service: AquagetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AquagetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
