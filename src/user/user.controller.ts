import {Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards} from '@nestjs/common';
import {UserService} from "./user.service";
import {User, UserRole} from "./models/user.interface";
import {catchError, map, Observable, of} from "rxjs";
import {hasRoles} from "../auth/decorators/roles.decorator";
import {JWTAuthGuard} from "../auth/guards/jwt-guard";
import {RolesGuard} from "../auth/guards/roles.guard";
import {Pagination} from "nestjs-typeorm-paginate";

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

    /*@Get()
    findAll(): Observable<User[]> {
        return this.userService.findAll();
    }*/

    @Get()
    index(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
        @Query('username') username: string
    ): Observable<Pagination<User>> {
        limit = limit > 100 ? 100 : limit;
        console.log(username);

       if(username === null || username === undefined) {
           return this.userService.paginate({page, limit, route: 'http://localhost:3000/users'});
       } else {
           return this.userService.paginateFilterByUsername({page, limit, route: 'http://localhost:3000/users'},
               {username})
       }
    }

    @Delete(':id')
    deleteOne(@Param('id') id: string): Observable<User> {
        return this.userService.deleteOne(+id);
    }

    @Put(':id')
    updateOne(@Param('id') id: string, @Body() user: User): Observable<any> {
        return this.userService.update(+id, user);
    }

    @hasRoles(UserRole.ADMIN)
    @UseGuards(JWTAuthGuard, RolesGuard)
    @Put(':id/role')
    updateRoleOfUser(@Param('id') id: string, @Body() user: User): Observable<User> {
        return this.userService.updateRoleOfUser(+id, user);
    }
}
