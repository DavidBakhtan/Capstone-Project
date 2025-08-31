import { TestBed } from '@angular/core/testing';
import { LoginElementComponent } from './login-element.component';

describe('LoginElementComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginElementComponent], // standalone
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(LoginElementComponent);
    const comp = fixture.componentInstance;
    expect(comp).toBeTruthy();
  });

  it('should render title text (smoke)', () => {
    const fixture = TestBed.createComponent(LoginElementComponent);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent || '').toContain('Sign in');
  });
});
