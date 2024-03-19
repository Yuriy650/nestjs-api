import {CanActivate, Injectable, ExecutionContext} from "@nestjs/common";
import {UserService} from "../../user/user.service";
import {BlogEntry} from "../../blog/model/blog-entry.interface";
import {BlogService} from "../../blog/service/blog.service";
import {map, switchMap, Observable} from "rxjs";
import {User} from "../../user/models/user.interface";

@Injectable()
export class UserIsAuthorGuard implements CanActivate {
    constructor(private userService: UserService,
                private blogService: BlogService) {
    }

    canActivate(context: ExecutionContext): Observable<boolean> {
        const req = context.switchToHttp().getRequest();
        const params = req.params;
        const blogEntryId: number = Number(params.id);
        const user: User = req.user;

        return this.userService.findOne(user.id).pipe(
            switchMap((user: User) => this.blogService.findOne(blogEntryId).pipe(
                map((blogEntry: BlogEntry) => {
                    let hasPermission = false;
                    if(user.id === blogEntry.author.id) {
                        hasPermission = true;
                    }
                    return user && hasPermission;
                })
            ))
        )
    }
}
