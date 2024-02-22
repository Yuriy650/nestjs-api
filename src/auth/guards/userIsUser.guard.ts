import {CanActivate, ExecutionContext, forwardRef, Inject, Injectable} from "@nestjs/common";
import {map, Observable} from "rxjs";
import {UserService} from "../../user/user.service";
import {User} from "../../user/models/user.interface";

@Injectable()
export class UserIsUserGuard implements CanActivate {
    constructor(
        @Inject(forwardRef(() => UserService))
        private userService: UserService
    ) {
    }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const req = context.switchToHttp().getRequest();
        const params = req.params;
        const user: User = req.user.user;
        return this.userService.findOne(user.id).pipe(
            map((user: User) => {
                let hasPermission = false;
                if(user.id === +params.id) {
                    hasPermission = true;
                }
                return user && hasPermission
            })
        )
    }
}
