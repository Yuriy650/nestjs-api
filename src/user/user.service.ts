import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {UserEntity} from "./models/user.entity";
import {Like, Repository} from "typeorm";
import {catchError, from, map, Observable, switchMap, throwError} from "rxjs";
import {User, UserRole} from "./models/user.interface";
import {AuthService} from "../auth/auth.service";
import {
    paginate,
    Pagination,
    IPaginationOptions,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
        private authService: AuthService
    ) {}

     create(user: User): Observable<User> {
        return this.authService.hashPassword(user.password).pipe(
            switchMap((passwordHash: string) => {
                const newUser = new UserEntity();
                newUser.name = user.name;
                newUser.username = user.username;
                newUser.email = user.email;
                newUser.password = passwordHash;
                newUser.role = UserRole.USER;

                return from(this.userRepository.save(newUser)).pipe(
                    map((user: User) => {
                        const {password, ...result} = user;
                        return result
                    }),
                    catchError(err => throwError(err))
                )
            })
        )
    }

    findOne(id: number): Observable<User> {
        return from(this.userRepository.findOne({
            where: {
                //@ts-ignore
                id: id
            },
            relations: ['blogEntries']
        })).pipe(
            map((user: User) => {
                const {password, ...result} = user;
                return result;
            })
        )
    }

    findAll(): Observable<User[]> {
        return from(this.userRepository.find()).pipe(
            map((users: User[]) => {
                users.forEach(function (u) {delete u.password})
                return users;
            })
        )
    }

    paginate(options: IPaginationOptions): Observable<Pagination<User>> {
        return from(paginate<User>(this.userRepository, options)).pipe(
            map((usersPagination: Pagination<User>) => {
                usersPagination.items.forEach(function (user) {delete user.password});
                return usersPagination;
            })
        )
    }

    paginateFilterByUsername(options: IPaginationOptions, user: User): Observable<Pagination<User>> {
        return from(this.userRepository.findAndCount({
            // @ts-ignore
            skip: options.page * options.limit || 0,
            // @ts-ignore
            take: options.limit || 10,
            order: {id: 'ASC'},
            relations: ['blogEntries'],
            select: ['id', 'name', 'username', 'email', 'role'],
            where: [
                {username: Like(`%${user.username}%`)}
            ]
        })).pipe(
            map(([users, totalUsers]) => {
                const usersPageable: Pagination<User> = {
                   items: users,
                   links: {
                       first: options.route + `?limit=${options.limit}`,
                       previous: options.route + ``,
                       // @ts-ignore
                       next: options.route + `?limit=${options.limit}&page=${options.page + 1}`,
                       // @ts-ignore
                       last: options.route + `?limit=${options.limit}&page=${Math.ceil(totalUsers/options.limit)}`,
                   },
                    meta: {
                        // @ts-ignore
                       currentPage: options.page,
                       itemCount: users.length,
                        // @ts-ignore
                       itemsPerPage: options.limit,
                       totalItems: totalUsers,
                        // @ts-ignore
                       totalPages: Math.ceil(totalUsers/options.limit)
                    }
                }
                return usersPageable;
            })
        )
    }

    deleteOne(id: number): Observable<any> {
        return from(this.userRepository.delete(id));
    }

    update(id: number, user: User): Observable<any> {
        delete user.email;
        delete user.password;
        delete user.role;
        return from(this.userRepository.update(id, user)).pipe(
            switchMap(() => this.findOne(id))
        )
    }

    login(user: User): Observable<string> {
        return this.validateUser(user.email, user.password).pipe(
            switchMap((user: User) => {
                if(user) {
                    return this.authService.generateJWT(user).pipe(map(jwt => jwt))
                } else {
                    return "Wrong Credentials"
                }
            })
        )
    }

    validateUser(email: string, password: string): Observable<User> {
        return this.findByMail(email).pipe(
            switchMap((user: User) => this.authService.comparePassword(password, user.password).pipe(
                map((match: boolean) => {
                    if (match) {
                        const {password, ...result} = user;
                        return result;
                    } else {
                        throw Error;
                    }
                })
            ))
        )
    }

    findByMail(email: string): Observable<User> {
        return from(this.userRepository.findOneBy({email}));
    }

    updateRoleOfUser(id: number, user: User): Observable<any> {
        return from(this.userRepository.update(id, user));
    }
}
