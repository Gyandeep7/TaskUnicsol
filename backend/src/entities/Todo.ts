// entities/Todo.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { IsNotEmpty, IsString, Length } from 'class-validator'; 
import { User } from './User';

@Entity()
export class Todo {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  @IsNotEmpty({ message: 'Title cannot be empty' })
  @IsString({ message: 'Title must be a string' })
  @Length(1, 255, { message: 'Title must be between 1 and 255 characters' })
  title!: string;

  @Column()
  @IsNotEmpty({ message: 'Description cannot be empty' })
  @IsString({ message: 'Description must be a string' })
  @Length(1, 1000, { message: 'Description must be between 1 and 1000 characters' })
  description!: string;

  @ManyToOne(() => User, (user) => user.todos)
  user!: User;
}
