import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('subscription')
export class Subscription {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    owner: string;

    @Column()
    subscriptionType: number;

    @Column()
    endDate: Date;
}