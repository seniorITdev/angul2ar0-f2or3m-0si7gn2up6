import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { SignUpService } from 'src/app/services/sign-up.service';
import { SignUpPageComponent } from './sign-up-page.component';

describe('SignUpPageComponent', () => {
  let component: SignUpPageComponent;
  let fixture: ComponentFixture<SignUpPageComponent>;
  let mockSignUpService: any;

  beforeEach(() => {
    mockSignUpService = jasmine.createSpyObj(['setUserData']);

    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule, 
        HttpClientTestingModule, 
        MatCardModule,
        MatButtonModule,
        MatInputModule,
        BrowserAnimationsModule,
      ],
      declarations: [SignUpPageComponent],
      providers: [
        { provide: SignUpService, useValue: mockSignUpService },
      ],
    });

    fixture = TestBed.createComponent(SignUpPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form controls', () => {
    expect(component.signupForm.get('firstName')).toBeTruthy();
    expect(component.signupForm.get('lastName')).toBeTruthy();
    expect(component.signupForm.get('email')).toBeTruthy();
    expect(component.signupForm.get('password')).toBeTruthy();
  });

  it('should set up subTitle observable', () => {
    expect(component.subTitle).not.toBeNull();
  });

  it('should update subTitle when form values change', (done) => {
    if (component.subTitle) {
      component.subTitle.subscribe(subTitle => {
        expect(subTitle).toEqual('John Doe');
        done();
      });
      component.signupForm.setValue({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password'
      });
    }
  });

  it('should call setUserData with form value when form is valid and onSubmit is called', () => {
    const formValue = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'Password123456'
    };
    component.signupForm.setValue(formValue);
    component.onSubmit();
    expect(mockSignUpService.setUserData).toHaveBeenCalledWith(formValue);
  });

  it('should validate email field as required', () => {
    let errors;
    let email = component.signupForm.controls['email'];
    expect(email.valid).toBeFalsy();
  
    errors = email.errors || {};
    expect(errors['required']).toBeTruthy();
  
    email.setValue("test");
    errors = email.errors || {};
    expect(errors['required']).toBeFalsy();
    expect(errors['email']).toBeTruthy();
  
    email.setValue("test@example.com");
    errors = email.errors || {};
    expect(errors['required']).toBeFalsy();
    expect(errors['email']).toBeFalsy();
  });
  
  it('should validate password field as required', () => {
    let errors;
    let password = component.signupForm.controls['password'];
    expect(password.valid).toBeFalsy();
  
    errors = password.errors || {};
    expect(errors['required']).toBeTruthy();
  
    password.setValue("123");
    errors = password.errors || {};
    expect(errors['required']).toBeFalsy();
    expect(errors['pattern']).toBeTruthy();
  
    password.setValue("Abcdefgh");
    errors = password.errors || {};
    expect(errors['required']).toBeFalsy();
    expect(errors['pattern']).toBeFalsy();
  });
});