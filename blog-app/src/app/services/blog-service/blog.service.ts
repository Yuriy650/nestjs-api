import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable, tap} from "rxjs";
import {BlogEntryInterface, BlogEntriesPageable} from "../../model/blog-entry.interface";
import {logCumulativeDurations} from "@angular-devkit/build-angular/src/builders/browser-esbuild/profiling";

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  constructor(private http: HttpClient) { }

  indexAll(page: number, limit: number): Observable<BlogEntriesPageable> {
    let params = new HttpParams();

    params = params.append('page', String(page));
    params = params.append('limit', String(limit));

    return this.http.get<BlogEntriesPageable>('http://localhost:3000/blog-entries', {params});
  }
}
