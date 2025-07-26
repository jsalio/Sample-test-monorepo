import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        ReactiveFormsModule,
        NoopAnimationsModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create a login form with email and password controls', () => {
    expect(component.loginForm).toBeDefined();
    expect(component.loginForm.controls['email']).toBeDefined();
    expect(component.loginForm.controls['password']).toBeDefined();
  });

  it('should make the email control required and a valid email', () => {
    const emailControl = component.loginForm.controls['email'];
    expect(emailControl.valid).toBeFalsy();

    emailControl.setValue('');
    expect(emailControl.hasError('required')).toBeTruthy();

    emailControl.setValue('test');
    expect(emailControl.hasError('email')).toBeTruthy();

    emailControl.setValue('test@example.com');
    expect(emailControl.valid).toBeTruthy();
  });

  it('should make the password control required', () => {
    const passwordControl = component.loginForm.controls['password'];
    expect(passwordControl.valid).toBeFalsy();

    passwordControl.setValue('');
    expect(passwordControl.hasError('required')).toBeTruthy();

    passwordControl.setValue('password');
    expect(passwordControl.valid).toBeTruthy();
  });

  it('should be invalid when form is empty', () => {
    expect(component.loginForm.valid).toBeFalsy();
  });

  it('should be valid when form is filled correctly', () => {
    component.loginForm.controls['email'].setValue('test@example.com');
    component.loginForm.controls['password'].setValue('password');
    expect(component.loginForm.valid).toBeTruthy();
  });

  it('should call onSubmit method when form is submitted', () => {
    spyOn(component, 'onSubmit');
    component.loginForm.controls['email'].setValue('test@example.com');
    component.loginForm.controls['password'].setValue('password');
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const button = compiled.querySelector('button');
    button.click();

    expect(component.onSubmit).toHaveBeenCalled();
  });
});
