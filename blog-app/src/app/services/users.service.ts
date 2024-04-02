import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {catchError, map, Observable, throwError} from "rxjs";
import {User} from "../model/user.interface";

export interface UserData {
  items: User[],
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  },
  links: {
    first: string,
    previous: string,
    next: string,
    last: string
  }
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) { }

  fetchUsers(page: number, limit: number): Observable<any> {
    let params = new HttpParams();
    params = params.append('page', String(page));
    params = params.append('limit', String(limit));
    return this.http.get('http://localhost:3000/users', {params}).pipe(
      map((userData) => userData),
      catchError(err => throwError(err))
    )
  }

  findOne(id: number): Observable<User> {
    return this.http.get('http://localhost:3000/users/' + id).pipe(
      //@ts-ignore
      map((user: User) => user)
    )
  }

  uploadProfileImage(formData: FormData): Observable<any> {
    return this.http.post<FormData>('http://localhost:3000/users/upload', formData, {
      reportProgress: true,
      observe: 'events'
    })
  }

  updateOne(user: User): Observable<Object> {
    console.log(user)
    return this.http.put('http://localhost:3000/users/' + user.id, user);
  }

  paginateByUsername(page: number, limit: number, username: string): Observable<UserData> {
    let params = new HttpParams();
    params = params.append('page', String(page));
    params = params.append('limit', String(limit));
    params = params.append('username', username);
    return this.http.get('http://localhost:3000/users', {params}).pipe(
      // @ts-ignore
      map((userData) => userData),
      catchError(err => throwError(err))
    )
  }
}
