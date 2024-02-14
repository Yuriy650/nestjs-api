import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {catchError, map, Observable, throwError} from "rxjs";
import {User} from "./authentication.service";

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
    params = params.append('limit', String(limit))
    return this.http.get('http://localhost:3000/users', {params}).pipe(
      map((userData) => userData),
      catchError(err => throwError(err))
    )
  }
}
