import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Todo } from './Todo';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
    id!: number;

  @Column()
    username!: string;

  @Column()
    password!: string;

  @OneToMany(() => Todo, (todo) => todo.user)
    todos!: Todo[];
}
