import {Entity, PrimaryGeneratedColumn} from "typeorm";
import {Column} from "typeorm";

@Entity()
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    name: string;
    @Column({unique: true})
    username: string;
}
