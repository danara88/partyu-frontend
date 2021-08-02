import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import { NgxSpinnerService } from "ngx-spinner";
import { SECRET_KEY } from '../../../environments/environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { MessageService } from 'primeng/api';
import { UtilsService } from '../../services/utils.service';

@Component({
  selector: 'app-recover-password',
  templateUrl: './recover-password.component.html',
  styleUrls: ['./recover-password.component.scss']
})
export class RecoverPasswordComponent implements OnInit {

  public recoverPasswordForm: FormGroup = new FormGroup({});
  public email: string;
  public expiresIn: number;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private authService: AuthService,
    private utilsService: UtilsService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private messageService: MessageService,
  ) {
    this.email = '';
    this.expiresIn = 0;
  }

  ngOnInit(): void {
    this.validateURL();
    this.createForm();
  }

  validateURL() {
    this.route.queryParams.subscribe(params => {

      this.email = params.email;
      this.expiresIn = Number(params.expiresIn);

      let actualDate = new Date().getTime();

      if (actualDate >= this.expiresIn ) {
        // Expired URL
        this.router.navigate([`/auth/login`], { state: { recoverPasswordExpired: true } });
      }
      
    });
  }

  /**
   * Validates if each form input is valid
   * @param fieldName 
   * @returns 
   */
  notValidField(fieldName: string): boolean {
      if (fieldName === 'repeatPassword') {
        let password1 = this.recoverPasswordForm.controls['password'].value;
        let password2 = this.recoverPasswordForm.controls['repeatPassword'].value;
  
        return password1 == password2 ? false : true;
      }
      return this.recoverPasswordForm.controls[fieldName]?.touched && this.recoverPasswordForm.controls[fieldName]?.invalid;
  }

  /**
   * Creates the form for Recover Password
   */
  createForm() {
    this.recoverPasswordForm = this.fb.group({
      password: ['',  [Validators.required, Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[?!@#$%^&*_=+-]).{8,}")]],
      repeatPassword: ['', [Validators.required, Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[?!@#$%^&*_=+-]).{8,}")]],
    },
    {
    validators: this.notEqualPasswords('password', 'repeatPassword')
    })
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

  /**
   * Submit the form to reset password
   * @returns 
   */
  onSubmit() {
    if (this.recoverPasswordForm.invalid) return;

    this.spinner.show();
    let newPassword = this.recoverPasswordForm.controls.password.value;

    let bodyObj = {
      email: this.email,
      password: newPassword,
      expiresIn: this.expiresIn
    }

    //Service to change password API 
    this.authService.changePassword(bodyObj).subscribe(user => {
      this.router.navigate([`/auth/login`], { state: { recoverPasswordSuccess: true } });
      this.spinner.hide();

    }, error => {
      console.log(error);
      this.spinner.hide();
      this.recoverPasswordForm.reset();
      this.utilsService.showToastMessage('recoverPasswordError', 'error', 'Recover Password', error.error.message, this.messageService);

    });

  }


}
