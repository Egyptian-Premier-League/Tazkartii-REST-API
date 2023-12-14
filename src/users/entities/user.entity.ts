import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  OneToMany,
} from 'typeorm';

import { Seat } from 'src/general/entities/seat.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  password: string;

  @Column()
  city: string;

  @Column()
  gender: string;

  @Column()
  role: string;

  @Column()
  birthdate: Date;

  @Column({ default: false })
  approved: boolean;

  @Column({ nullable: true })
  address: string;

  @OneToMany(() => Seat, (seat) => seat.user)
  seats: Seat[];

  @AfterInsert()
  logInsert() {
    console.log(`Inserted user with id ${this.id}`);
  }

  @AfterUpdate()
  logUpdate() {
    console.log(`Updated user with id ${this.id}`);
  }

  @AfterRemove()
  logRemove() {
    console.log(`Removed user`);
  }
}
