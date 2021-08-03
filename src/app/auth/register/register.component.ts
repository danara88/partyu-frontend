import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { UtilsService } from '../../services/utils.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  public user: User;
  public registerForm: FormGroup;
  public messageError: string;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private utilsService: UtilsService,
    private spinner: NgxSpinnerService,
    private router: Router          
  ) {

    this.user = new User('', '');
    this.registerForm = new FormGroup({});
    this.messageError = '';

  }

  ngOnInit(): void {
    this.createForm();
  }

  /**
   * Validates if each form input is valid
   * @param fieldName 
   * @returns 
   */
  notValidField(fieldName: string): boolean {
    if (fieldName === 'repeatPassword') {
      let password1 = this.registerForm.controls['password'].value;
      let password2 = this.registerForm.controls['repeatPassword'].value;

      return password1 == password2 ? false : true;
    }
    return this.registerForm.controls[fieldName]?.touched && this.registerForm.controls[fieldName]?.invalid;
  }

  /**
   * Creates the reactive form for Register Form
   */
  createForm() {
    this.registerForm = this.fb.group({
      fullname: ['',  [Validators.required]],
      email   : ['',  [Validators.required, Validators.pattern("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$")]],
      password: ['',  [Validators.required, Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[?!@#$%^&*_=+-]).{8,}")]],
      repeatPassword: ['', [Validators.required, Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[?!@#$%^&*_=+-]).{8,}")]],
    },
    {
      validators: this.notEqualPasswords('password', 'repeatPassword'),
    });
  }

  /**
   * Register the user in the platform
   */
  onSubmit() {
    if (this.registerForm.invalid) {
      Object.values(this.registerForm.controls).forEach(control => control.markAsTouched());
      return;
    } 

    this.spinner.show();

    this.user.fullname = this.registerForm.controls['fullname'].value;
    this.user.email = this.registerForm.controls['email'].value;
    this.user.password = this.registerForm.controls['password'].value;

    this.userService.register(this.user).subscribe(async (resp) => {
      this.spinner.hide();

      localStorage.setItem('access_token', resp.token);

      let identity = await this.utilsService.getUserProfileData(this.userService);
      localStorage.setItem('identity', JSON.stringify(identity));

      this.router.navigateByUrl('/pages/home');
      this.router.navigate([`/pages/home`], { state: { RegisterSuccess: true, fullname: this.user.fullname } });

    }, error => {
      let errorsObj = error.error;
      
      if (errorsObj.email) {

        this.messageError = errorsObj.email.msg;
        this.registerForm.controls.email.setErrors({ hasErrors: true });
        this.registerForm.controls.password.setValue('');
        this.registerForm.controls.repeatPassword.setValue('');

      }
      this.spinner.hide();

    });
  }

  /**
   * Validates if the two passwords are equal
   * @param password 
   * @param repeatPassword 
   * @returns 
   */
  notEqualPasswords(password: string, repeatPassword: string) {
    return (formGroup: FormGroup) => {
      let passwordInput = formGroup.controls[password];
      let repeatPasswordInput = formGroup.controls[repeatPassword];

      if (passwordInput.value === repeatPasswordInput.value) {
        repeatPasswordInput.setErrors(null);
      } else {
        repeatPasswordInput.setErrors({ notEqual: true });
      }
    }
  }

}
