import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavedProjectComponent } from './saved-project.component';

describe('SavedProjectComponent', () => {
  let component: SavedProjectComponent;
  let fixture: ComponentFixture<SavedProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SavedProjectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SavedProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
