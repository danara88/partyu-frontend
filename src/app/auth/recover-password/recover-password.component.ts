import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import { NgxSpinnerService } from "ngx-spinner";
import { SECRET_KEY } from '../../../environments/environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-recover-password',
  templateUrl: './recover-password.component.html',
  styleUrls: ['./recover-password.component.scss']
})
export class RecoverPasswordComponent implements OnInit {

  public recoverPasswordForm: FormGroup = new FormGroup({});
  public email: string;
  public expiresIn: string;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private authService: AuthService,
    private spinner: NgxSpinnerService,
    private router: Router,
  ) {
    this.email = '';
    this.expiresIn = '';
  }

  ngOnInit(): void {
    // this.validateURL();
    this.createForm();
  }

  validateURL() {
    this.route.queryParams.subscribe(params => {
      let encryptedEmail = params.email;
      let encryptedExpiresIn = params.expiresIn;

      this.email = encryptedEmail;
      this.expiresIn = encryptedExpiresIn;

      console.log(this.expiresIn);
      
    });
  }

    /**
   * function to decrypt URL parameters
   * @param key 
   * @param ciphertextB64 
   */
  decryptData(key: string, ciphertextB64: string) {                     // Base64 encoded ciphertext, 32 bytes string as key
      let k = CryptoJS.enc.Utf8.parse(key);                               // Convert into WordArray (using Utf8)
      let iv = CryptoJS.lib.WordArray.create([0x00, 0x00, 0x00, 0x00]);   // Use zero vector as IV
      let decrypted = CryptoJS.AES.decrypt(ciphertextB64, k, { iv: iv }); // By default: CBC, PKCS7 
      return decrypted.toString(CryptoJS.enc.Utf8);                       // Convert into string (using Utf8)
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

  onSubmit() {
    if (this.recoverPasswordForm.invalid) return;

    this.spinner.show();
    let newPassword = this.recoverPasswordForm.controls.password.value;

    let bodyObj = {
      email: this.email,
      password: newPassword,
      expiresIn: this.expiresIn
    }

    setInterval(() => {
      this.spinner.hide();
      this.router.navigate([`/auth/login`], { state: { recoverPasswordSuccess: true } });
    }, 3000);

    // Service to change password API
    // this.authService.changePassword(bodyObj).subscribe(user => {
    //   console.log(user);

    // }, error => {
    //   console.log(error);

    // });

  }

}
