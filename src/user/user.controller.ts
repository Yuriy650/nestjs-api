import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Query,
    UploadedFile,
    UseGuards,
    Request,
    UseInterceptors, Res
} from '@nestjs/common';
import {UserService} from "./user.service";
import {User, UserRole} from "./models/user.interface";
import {catchError, map, Observable, of} from "rxjs";
import {hasRoles} from "../auth/decorators/roles.decorator";
import {JWTAuthGuard} from "../auth/guards/jwt-guard";
import {RolesGuard} from "../auth/guards/roles.guard";
import {Pagination} from "nestjs-typeorm-paginate";
import {FileInterceptor} from "@nestjs/platform-express";
import {diskStorage} from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path = require('path');
import {UserIsUserGuard} from "../auth/guards/userIsUser.guard";

export const STORAGE = {
    storage: diskStorage({
        destination: './uploads/profileimages',
        filename: (req, file, cb) => {
            const filename: string = path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
            const extension: string = path.parse(file.originalname).ext;
            cb(null, `${filename}${extension}`)
        }
    })
}

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

    @Get()
    index(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
        @Query('username') username: string
    ): Observable<Pagination<User>> {
        limit = limit > 100 ? 100 : limit;

       if(username === null || username === undefined) {
           return this.userService.paginate({page, limit, route: 'http://localhost:3000/users'});
       } else {
           return this.userService.paginateFilterByUsername({page, limit, route: 'http://localhost:3000/users'},
               {username})
       }
    }

    @hasRoles(UserRole.ADMIN)
    @UseGuards(JWTAuthGuard, RolesGuard)
    @Delete(':id')
    deleteOne(@Param('id') id: string): Observable<User> {
        return this.userService.deleteOne(+id);
    }

    @UseGuards(JWTAuthGuard, UserIsUserGuard)
    @Put(':id')
    updateOne(@Param('id') id: string, @Body() user: User): Observable<any> {
        return this.userService.update(Number(id), user);
    }

    @hasRoles(UserRole.ADMIN)
    @UseGuards(JWTAuthGuard, RolesGuard)
    @Put(':id/role')
    updateRoleOfUser(@Param('id') id: string, @Body() user: User): Observable<User> {
        return this.userService.updateRoleOfUser(+id, user);
    }

    @UseGuards(JWTAuthGuard)
    @Post('upload')
    @UseInterceptors(FileInterceptor('file', STORAGE))
    uploadFile(@UploadedFile() file, @Request() req): Observable<Object> {
        const user: User = req.user
        return this.userService.update(user.id, {profileImage: file.filename}).pipe(
           map((user: User) => ({profileImage: user.profileImage}))
        )
    }

    @Get('profile-image/:imagename')
    findProfileImage(@Param('imagename') imagename, @Res() res): Observable<Object> {
        return of(res.sendFile(path.join(process.cwd(), 'uploads/profileimages/' + imagename)))
    }
}
