import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
} from 'typeorm';

@Entity()
export class Admin {
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

  @AfterInsert()
  logInsert() {
    console.log(`Inserted admin with id ${this.id}`);
  }

  @AfterUpdate()
  logUpdate() {
    console.log(`Updated admin with id ${this.id}`);
  }

  @AfterRemove()
  logRemove() {
    console.log(`Removed admin`);
  }
}
