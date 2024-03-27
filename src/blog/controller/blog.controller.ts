import {
    Body,
    Request,
    Controller,
    Post,
    UseGuards,
    Get,
    Query,
    Param,
    Put,
    Delete,
    UseInterceptors, UploadedFile, Res
} from '@nestjs/common';
import {BlogService} from "../service/blog.service";
import {BlogEntry} from "../model/blog-entry.interface";
import {map, Observable, of} from "rxjs";
import {JWTAuthGuard} from "../../auth/guards/jwt-guard";
import {UserIsAuthorGuard} from "../../auth/guards/user-is-author.guard";
import {FileInterceptor} from "@nestjs/platform-express";
import {diskStorage} from "multer";
import path = require('path');
import {v4 as uuidv4} from "uuid";
import {IImage} from "../model/image.interface";

export const BLOG_ENTRIES_URL = 'http://localhost:3000/blog-entries';
export const STORAGE = {
    storage: diskStorage({
        destination: './uploads/blog-entry-images',
        filename: (req, file, cb) => {
            console.log(path)
            const filename: string = path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
            const extension: string = path.parse(file.originalname).ext;
            cb(null, `${filename}${extension}`)
        }
    })
}

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

    @UseGuards(JWTAuthGuard)
    @Post('image/upload')
    @UseInterceptors(FileInterceptor('file', STORAGE))
    uploadFile(@UploadedFile() file, @Request() req): Observable<IImage> {
       return of(file)
    }

    @Get('image/:imagename')
    findImage(@Param('imagename') imagename, @Res() res): Observable<IImage> {
        return of(res.sendFile(path.join(process.cwd(), 'uploads/blog-entry-images/' + imagename)))
    }
}
