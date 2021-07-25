import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  public displayModal: boolean;
  public formForgotPassword: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private messageService: MessageService
  ) { 
    this.displayModal = false;
    this.formForgotPassword = new FormGroup({});
  }

  ngOnInit(): void {
    this.createForm();
  }

  /**
   * Show the dialog modal to recover password
   */
  showModalDialog() {
    this.displayModal = true;
  }

  /**
   * Create the forgot password form
   */
  createForm() {
    this.formForgotPassword = this.fb.group({
      email   : ['danielarandamar88@gmail.com',  [Validators.required, Validators.pattern("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$")]]
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
      life: 3000,
      closable: false
    });
  }

  onSubmit() {

    if (this.formForgotPassword.invalid) return;

    this.displayModal = false;

    let email = this.formForgotPassword.controls.email.value;

    this.authService.recoverPassword(email).subscribe(resp => {
      this.showToastMessage('forgotPassword', 'success', 'Recover Password', resp.message);
      this.formForgotPassword.reset();

    }, error => {
      console.log(error);
      this.showToastMessage('forgotPassword', 'error', 'Recover Password', 'Something went wrong ...');
      this.formForgotPassword.reset();
    });

  }

}
