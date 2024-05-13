import {BlogEntry} from "../../blog/model/blog-entry.interface";

export interface User {
    id?: number;
    name?: string;
    username?: string;
    email?: string;
    password?: string;
    role?: UserRole;
    profileImage?: string | null;
    blogEntries?: BlogEntry[];
}

export enum UserRole {
    ADMIN = 'admin',
    CHIEFEDITOR = 'chiefeditor',
    EDITOR = 'editor',
    USER = 'user'
}
