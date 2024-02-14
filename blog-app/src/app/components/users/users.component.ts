import {Component, OnInit} from '@angular/core';
import {UserData, UsersService} from "../../services/users.service";
import {map} from "rxjs";
import {CdkTableDataSourceInput} from "@angular/cdk/table";
import {PageEvent} from "@angular/material/paginator";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})

export class UsersComponent implements OnInit {
  public usersDataSource!: any;
  public pageEvent!: PageEvent;
  public totalItems: number = 10;
  public itemsPerPage: number = 10;
  public displayedColumns: string[] = ['id', 'name', 'username', 'email', 'role']
  constructor(private userService: UsersService) {
}

ngOnInit() {
    this.initUsersDataSource()
}

  initUsersDataSource() {
    this.userService.fetchUsers(1, 10).pipe(
      map((userData: UserData) => this.getUserData(userData))
    ).subscribe()
  }

  onPaginateChange(event: PageEvent) {
    let page = event.pageIndex;
    let size = event.pageSize;
    page = page + 1;
    this.userService.fetchUsers(page, size).subscribe(
      userData => this.getUserData(userData)
    )
  }

  getUserData(userData: UserData) {
    this.usersDataSource = userData.items;
    this.totalItems = userData.meta.totalItems;
    this.itemsPerPage = userData.meta.itemsPerPage;
  }
}
