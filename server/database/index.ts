import UsersCollection from './collections/users.json';
import TasksCollection from './collections/tasks.json';
import { IUser } from '../interfaces/user';
import { ITask } from '../interfaces/task';
import fs from 'fs';
import path from 'path';

export default class Database {
  private static instance: Database;

  public static getInstance() {
    if (!this.instance) {
      this.instance = new Database();
    }
    return this.instance;
  }

  private users: IUser[] = UsersCollection;
  private tasks: ITask[] = TasksCollection;

  private maxUserId: number = 0;
  private maxTaskId: number = 0;

  constructor() {
    this.maxUserId = Math.max(...(this.users.length > 0 ? this.users.map(({ id }) => id) : [0]));
    this.maxTaskId = Math.max(...(this.tasks.length > 0 ? this.tasks.map(({ id }) => id) : [0]));
  }

  public getUserById(id: number): IUser | undefined {
    return this.users.find((user) => user.id === id);
  }

  public getUserByEmail(email: string): IUser | undefined {
    return this.users.find((user) => user.email === email);
  }

  public getUser(email: string, password: string) {
    return this.users.find((user) => user.email === email && user.password === password);
  }

  public getTaskById(id: number): ITask | undefined {
    return this.tasks.find((task) => task.id === id);
  }

  public getAllTasks(): ITask[] {
    return this.tasks;
  }

  public saveUser(email: string, password: string) {
    const user: IUser = { id: ++this.maxUserId, email, password };
    this.users.push(user);
    fs.writeFileSync(
      path.resolve(__dirname, './collections', 'users.json'),
      JSON.stringify(this.users, null, 2),
    );
    return user;
  }

  public saveTask(name: string) {
    const task: ITask = { id: ++this.maxTaskId, name };
    this.tasks.push(task);
    fs.writeFileSync(
      path.resolve(__dirname, './collections', 'tasks.json'),
      JSON.stringify(this.tasks, null, 2),
    );
    return task;
  }
}
