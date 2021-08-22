import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import icVisibility from '@iconify/icons-ic/twotone-visibility';
import icVisibilityOff from '@iconify/icons-ic/twotone-visibility-off';
import { fadeInUp400ms } from '../../../../@vex/animations/fade-in-up.animation';
import { AuthService } from 'src/app/auth/auth.service';
import { LoginRq } from 'src/app/auth/interfaces/login-rq.interface';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'vex-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    fadeInUp400ms
  ]
})
export class LoginComponent implements OnInit {

  form: FormGroup;
  loginRq = {} as LoginRq;

  isLoading = false;

  inputType = 'password';
  visible = false;

  returnUrl: string;
  error = '';

  icVisibility = icVisibility;
  icVisibilityOff = icVisibilityOff;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private fb: FormBuilder,
              private cd: ChangeDetectorRef,
              private authService: AuthService
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/dashboard';
  }

  get f() { return this.form.controls; }

  send() {
    this.loginRq = {email: this.f.email.value, password: this.f.password.value};

    this.error = null;
    this.isLoading = true;
    this.authService.login(this.loginRq)
    .pipe(finalize(() => {
      this.isLoading = false;
      this.cd.markForCheck();
    }))
    .subscribe(rs => {
      if (rs === 'OK') {
        window.location.href = this.returnUrl;
        // this.router.navigate([this.returnUrl]);
      } else {
        this.error = rs;
      }
    });
  }

  toggleVisibility() {
    if (this.visible) {
      this.inputType = 'password';
      this.visible = false;
      this.cd.markForCheck();
    } else {
      this.inputType = 'text';
      this.visible = true;
      this.cd.markForCheck();
    }
  }
}
