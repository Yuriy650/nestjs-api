import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable, of, switchMap, tap} from "rxjs";
import {JwtHelperService} from "@auth0/angular-jwt";
import {User} from "../model/user.interface"

export interface LoginForm {
  email: string;
  password: string
}

export const JWT_NAME = 'token';

@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {

  constructor(private http: HttpClient,
              private jwtHelper: JwtHelperService) { }

  login(loginForm: LoginForm): Observable<{ access_token: string }> {
    return this.http.post<{access_token: string}>('http://localhost:3000/users/login', {email: loginForm.email, password: loginForm.password}).pipe(
      map((token) => {
        localStorage.setItem(JWT_NAME, token.access_token);
        return token;
      })
    )
  }

  register(user: User) {
    return this.http.post<any>('http://localhost:3000/users', user).pipe(
      map(user => user)
    )
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem(JWT_NAME);
    console.log(!this.jwtHelper.isTokenExpired(token))
    return !this.jwtHelper.isTokenExpired(token);
  }

  getUserId(): Observable<number> {
    return of(localStorage.getItem(JWT_NAME)).pipe(
      //@ts-ignore
      switchMap((jwt) => of(this.jwtHelper.decodeToken(jwt)).pipe(
        tap(jwt => console.log('jwt', jwt)),
        //@ts-ignore
        map(jwt => jwt.user.id))
      )
    )
  }
}
