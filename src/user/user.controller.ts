import {Body, Controller, Delete, Get, Param, Post, Put, UseGuards} from '@nestjs/common';
import {UserService} from "./user.service";
import {User, UserRole} from "./models/user.interface";
import {catchError, map, Observable, of} from "rxjs";
import {hasRoles} from "../auth/decorators/roles.decorator";
import {JWTAuthGuard} from "../auth/guards/jwt-guard";
import {RolesGuard} from "../auth/guards/roles.guard";

@Controller('users')
export class UserController {
    constructor(private userService: UserService) {
    }
    @Post()
    create(@Body() user: User) {
      return this.userService.create(user).pipe(
          map((user: User) => user),
          catchError(err => of({error: err.message}))
      );
    }

    @Post('login')
    login(@Body() user: User): Observable<Object> {
        return this.userService.login(user).pipe(
            map((jwt: string) => {
                return {access_token: jwt}
            })
        )
    }

    @Get(':id')
    findOne(@Param() params): Observable<User> {
      return this.userService.findOne(params.id);
    }

    @hasRoles(UserRole.ADMIN)
    @UseGuards(JWTAuthGuard, RolesGuard)
    @Get()
    findAll(): Observable<User[]> {
        return this.userService.findAll();
    }

    @Delete(':id')
    deleteOne(@Param('id') id: string): Observable<User> {
        return this.userService.deleteOne(+id);
    }

    @Put(':id')
    updateOne(@Param('id') id: string, @Body() user: User): Observable<any> {
        return this.userService.update(+id, user);
    }

    @Put(':id/role')
    updateRoleOfUser(@Param('id') id: string, @Body() user: User): Observable<User> {
        return this.userService.updateRoleOfUser(+id, user);
    }
}
