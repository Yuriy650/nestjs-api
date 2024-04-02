import {Component, OnDestroy, OnInit} from '@angular/core';
import {map, Subscription} from "rxjs";
import {User} from "../../model/user.interface";
import {ActivatedRoute} from "@angular/router";
import {UsersService} from "../../services/users.service";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit, OnDestroy{
  //@ts-ignore
  public userId;
  //@ts-ignore
  private sub: Subscription;
  //@ts-ignore
  public user: User;
  constructor(
    private activatedRoute: ActivatedRoute,
    private usersService: UsersService
  ) {
  }

  ngOnInit(): void {
    this.sub = this.activatedRoute.params.subscribe(params => {
      this.userId = parseInt(params['id']);
      this.sub = this.usersService.findOne(this.userId).pipe(
        map((user: User) => this.user = user)
      ).subscribe()
    })
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
