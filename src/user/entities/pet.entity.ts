import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('pet')
export class Pet {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    owner: string;

    @Column()
    name: string;

    @Column()
    photoUrl: string[]

    @Column()
    character: string[]
}