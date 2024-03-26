import {Body, Request, Controller, Post, UseGuards, Get, Query, Param, Put, Delete} from '@nestjs/common';
import {BlogService} from "../service/blog.service";
import {BlogEntry} from "../model/blog-entry.interface";
import {Observable} from "rxjs";
import {JWTAuthGuard} from "../../auth/guards/jwt-guard";
import {UserIsAuthorGuard} from "../../auth/guards/user-is-author.guard";

export const BLOG_ENTRIES_URL = 'http://localhost:3000/blog-entries';
@Controller('blog-entries')
export class BlogController {
    constructor(private blogService: BlogService) {
    }

    @UseGuards(JWTAuthGuard)
    @Post()
    create(@Body() blogEntry: BlogEntry, @Request() req): Observable<BlogEntry> {
        const user = req.user;
        return this.blogService.create(user, blogEntry);
    }

 /*   @Get()
    findBlogEntries(@Query('userId') userId: number): Observable<BlogEntry[]> {
        if(userId === null) {
            return this.blogService.findAll();
        } else {
            return this.blogService.findByUser(userId);
        }
    }*/

    @Get('')
    index(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10
    ) {
        limit = limit > 100 ? 100 : limit;
        return this.blogService.paginateAll({
            limit: Number(limit),
            page: Number(page),
            route: BLOG_ENTRIES_URL
        });
    }

    @Get('user/:user')
    indexByUser(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
        @Param('user') userId: number
    ) {
        limit = limit > 100 ? 100 : limit;
        return this.blogService.paginateByUser({
            limit: Number(limit),
            page: Number(page),
            route: BLOG_ENTRIES_URL
        }, Number(userId));
    }

    @Get(':id')
    findOne(@Param('id') id: number): Observable<BlogEntry> {
        return this.blogService.findOne(id);
    }

    @UseGuards(JWTAuthGuard, UserIsAuthorGuard)
    @Put(`:id`)
    updateOne(@Param('id') id: number, @Body() blogEntry: BlogEntry): Observable<BlogEntry> {
        return this.blogService.updateOne(Number(id), blogEntry)
    }

    @UseGuards(JWTAuthGuard, UserIsAuthorGuard)
    @Delete(':id')
    deleteOne(@Param('id') id: number): Observable<any> {
        return this.blogService.deleteOne(id)
    }
}
