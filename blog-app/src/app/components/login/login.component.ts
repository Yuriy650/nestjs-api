import {Component, OnInit} from '@angular/core';
import {AuthenticationService, LoginForm} from "../../services/authentication.service";
import {Router} from "@angular/router";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {map} from "rxjs";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public loginForm!: FormGroup;
  constructor(private authService: AuthenticationService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl(null, [
        Validators.required,
        Validators.email,
        Validators.minLength(6)
      ]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(3),
      ])
    })
  }


  onSubmit() {
    this.authService.login(this.loginForm.value).pipe(
      map(token => {
        this.router.navigate(['admin']);
        console.log(token)
      })
    )
      .subscribe()
  }
}
