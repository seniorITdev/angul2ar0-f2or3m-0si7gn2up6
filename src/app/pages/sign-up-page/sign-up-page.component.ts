import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { combineLatest, Observable } from 'rxjs';
import { startWith, debounceTime, map } from 'rxjs/operators';

import { SignUpService } from 'src/app/services/sign-up.service';

@Component({
  selector: 'app-sign-up-page',
  templateUrl: './sign-up-page.component.html',
  styleUrls: ['./sign-up-page.component.scss']
})
export class SignUpPageComponent implements OnInit {
  subTitle: Observable<string> | null = null;

  signupForm: FormGroup = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.pattern(
        '^(?=.*[a-z])(?=.*[A-Z])(?!.*(?:\bfirst_name\b|\blast_name\b)).{8,}$'
      ),
    ]),
  });

  constructor(private signUpService: SignUpService) {}

  ngOnInit(): void {
    this.subTitle = combineLatest([
      this.signupForm.controls['firstName'].valueChanges.pipe(startWith(''), debounceTime(300)),
      this.signupForm.controls['lastName'].valueChanges.pipe(startWith(''), debounceTime(300)),
    ]).pipe(
      map(([firstName, lastName]) => (`${firstName} ${lastName}`))
    );
  }

  onSubmit() {
    if (this.signupForm.valid) {
      this.signUpService.setUserData(this.signupForm.value);
    }
  }
}
