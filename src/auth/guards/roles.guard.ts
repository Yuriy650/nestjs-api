import {CanActivate, Injectable, ExecutionContext} from "@nestjs/common";
import {map, Observable, of} from "rxjs";
import {Reflector} from "@nestjs/core";
import {UserService} from "../../user/user.service";
import {User} from "../../user/models/user.interface";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector,
                private userService: UserService) {}
    canActivate(
        context: ExecutionContext,
    ): Observable<boolean> | boolean {
        const roles = this.reflector.get<string[]>('roles', context.getHandler())
        if(!roles) {
            return of(true);
        }
        const request = context.switchToHttp().getRequest();
        console.log(request)
        const user = request.user;

        return this.userService.findOne(user.id).pipe(
            map((user: User) => {
               const hasRole = () => roles.indexOf(user.role) > -1;
               let hasPermission: boolean = false;
               if (hasRole()) hasPermission = true;
               return user && hasPermission;
            })
        )
    }
}
