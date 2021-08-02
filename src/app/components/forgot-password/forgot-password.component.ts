import { Component, Input, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UtilsService } from '../../services/utils.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  @Input() public isForgotPasswordProfile: boolean;
  public displayModal: boolean;
  public formForgotPassword: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private utilsService: UtilsService,
    private messageService: MessageService
  ) { 
    this.displayModal = false;
    this.formForgotPassword = new FormGroup({});
    this.isForgotPasswordProfile = false;
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
      email   : ['',  [Validators.required, Validators.pattern("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$")]]
    });
  }

  /**
   * Sends the recover password to the email
   * @returns 
   */
  onSubmit() {

    if (this.formForgotPassword.invalid) return;

    this.displayModal = false;

    let email = this.formForgotPassword.controls.email.value;

    this.authService.recoverPassword(email).subscribe(resp => {
      this.utilsService.showToastMessage('forgotPassword', 'success', 'Recover Password', resp.message, this.messageService);
      this.formForgotPassword.reset();

    }, error => {
      console.log(error);
      this.utilsService.showToastMessage('forgotPassword', 'error', 'Recover Password', 'Something went wrong ...', this.messageService);
      this.formForgotPassword.reset();
    });

  }

}
