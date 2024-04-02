import {Component, OnInit} from '@angular/core';
import {BlogEntriesPageable} from "../../model/blog-entry.interface";
import {BlogService} from "../../services/blog-service/blog.service";
import {PageEvent} from "@angular/material/paginator";
import {Observable} from "rxjs";

@Component({
  selector: 'app-all-blog-entries',
  templateUrl: './all-blog-entries.component.html',
  styleUrls: ['./all-blog-entries.component.scss']
})
export class AllBlogEntriesComponent implements OnInit {

  public dataSource: Observable<BlogEntriesPageable> = this.blogService.indexAll(1, 10)
  //@ts-ignore
  public pageEvent: PageEvent;
  constructor(
    private blogService: BlogService
  ) {
  }
  ngOnInit(): void {
  }

  public onPaginateChange(event: PageEvent) {
    let page = event.pageIndex;
    let limit = event.pageSize;

    page = page + 1;
    this.dataSource = this.blogService.indexAll(page, limit);
  }

}
