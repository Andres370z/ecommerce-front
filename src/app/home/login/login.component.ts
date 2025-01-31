import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { NotificationsService } from 'src/app/shared/services/notifications.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public form: FormGroup;

  constructor(
    private myFormBuilder: FormBuilder,
    private alertService: NotificationsService,
    private authService: AuthService,
    private router: Router, private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.myform();
    this.authService.authState$.subscribe(authState => {
      if (authState) {
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
        this.router.navigateByUrl(returnUrl);
      } else {
        this.router.navigateByUrl('/login');
      }
    });
  }

  myform() {
    this.form = this.myFormBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      pass: ['', Validators.compose([Validators.required, Validators.minLength(5)])],
    })
  }

  verifi() {
    console.log(this.form);

    if (this.form.controls.email.invalid) {
      this.alertService.errorNotifi('Ups', 'Error en el email');
      return false
    };
    if (this.form.controls.pass.invalid) {
      this.alertService.errorNotifi('Ups', 'Error en la constraseña');
      return false
    };
    if (this.form.valid) {
      return true
    }
  }
  
  onSubmit(form: any) {
    const data = {
      email: form.email,
      password: form.pass
    };
    if (this.verifi()) {
      this.authService.login(data).then((res: any) => {
        console.log('sirve');
      }).catch((err: any) => {
        console.log('Error en la autenticación:', err);
        this.alertService.errorNotifi('Ups', err.error)
      });
    }
  }
  

}
