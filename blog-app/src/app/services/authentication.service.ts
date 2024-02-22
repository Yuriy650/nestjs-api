import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";

export interface LoginForm {
  email: string;
  password: string
}

export interface User {
  name: string;
  username: string;
  email: string;
  password: string;
  passwordConfirm?: string;
  profileImage?: string;
  role?: string
}

@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {

  constructor(private http: HttpClient) { }

  login(loginForm: LoginForm): Observable<{ access_token: string }> {
    return this.http.post<{access_token: string}>('http://localhost:3000/users/login', {email: loginForm.email, password: loginForm.password}).pipe(
      map((token) => {
        localStorage.setItem('token', token.access_token);
        return token;
      })
    )
  }

  register(user: User) {
    return this.http.post<any>('http://localhost:3000/users', user).pipe(
      map(user => user)
    )
  }
}
