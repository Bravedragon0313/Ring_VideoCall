import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class Cameras {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    cameraid: number;

    @Column()
    cameraname: string;

}
