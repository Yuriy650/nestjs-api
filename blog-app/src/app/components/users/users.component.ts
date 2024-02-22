import {Component, OnInit} from '@angular/core';
import {UserData, UsersService} from "../../services/users.service";
import {map} from "rxjs";
import {CdkTableDataSourceInput} from "@angular/cdk/table";
import {PageEvent} from "@angular/material/paginator";
import {ActivatedRoute, Router} from "@angular/router";

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
  public filterValue: string = '';
  constructor(private userService: UsersService,
              private router: Router,
              private activatedRoute: ActivatedRoute) {
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
    let limit = event.pageSize;

    if (this.filterValue === null) {
      page = page + 1;
      this.userService.fetchUsers(page, limit).subscribe(
        userData => this.getUserData(userData)
      )
    } else {
      console.log('page', page)
      this.userService.paginateByUsername(page, limit, this.filterValue).pipe(
        map(userData => {
          this.getUserData(userData);
          console.log(userData)
        })
      ).subscribe();
    }

  }

  getUserData(userData: UserData) {
    this.usersDataSource = userData.items;
    this.totalItems = userData.meta.totalItems;
    this.itemsPerPage = userData.meta.itemsPerPage;
  }

  public findByUsername(username: string) {
    this.userService.paginateByUsername(0, 10, username).pipe(
      map(userData => this.getUserData(userData))
    ).subscribe();
  }

  public navigateToCurrentProfile(id: string) {
    this.router.navigate(['./' + id], {relativeTo: this.activatedRoute})
  }
}
