import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";
import { FormBuilder, FormGroup } from '@angular/forms';
import { User } from '../../models/user.model';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public user: User;
  public loginForm: FormGroup;
  public loginFail: boolean;

  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private router: Router,
    private authService: AuthService,
    private messageService: MessageService
  ) {

    this.user = new User('', '');
    this.loginForm = new FormGroup({});
    this.loginFail = false;

   }

  ngOnInit(): void {
    this.createForm();
   
    if (history.state.recoverPasswordSuccess === true) {
      setTimeout(() => {
        this.showToastMessage('recoverPasswordSuccess', 'success', 'Recover Password', 'Your password was reseted successfully');
      }, 500);
    }
  }

  /**
   * Creates the reactive form for Login Form
   */
  createForm() {
    this.loginForm = this.fb.group({
      email   : ['',  []],
      password: ['',  []],
    });
  }

  /**
   * Show Toast Notification Message
   * @param key 
   * @param severity 
   * @param summary 
   * @param detail 
   */
    showToastMessage(key: string, severity: string, summary: string, detail: string) {
      this.messageService.add({
        key: key, 
        severity: severity, 
        summary: summary, 
        detail: detail,
        life: 4000,
        closable: false
      });
    }
  
  /**
   * Submit the form for user authentication
   */
  onSubmit() {
    this.spinner.show();
    this.loginFail = false;
    
    let emailPattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    let passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[?!@#$%^&*_=+-]).{8,}/;
   
    if (this.loginForm.invalid || 
      !emailPattern.test(this.loginForm.controls.email.value) || 
      !passwordPattern.test(this.loginForm.controls.password.value)) {

        this.loginFail = true;
        this.loginForm.controls.password.setValue('');
        this.spinner.hide();

        return;
    }

    this.user.email = this.loginForm.controls.email.value;
    this.user.password = this.loginForm.controls.password.value;

    this.authService.login(this.user).subscribe(resp => {
      localStorage.setItem('access_token', resp.token);
      this.router.navigateByUrl('/pages/home');
      this.spinner.hide();
      
    }, error => {
      console.log(error);

      this.loginFail = true;
      this.loginForm.controls.password.setValue('');
      this.spinner.hide();

    });


  }

}
