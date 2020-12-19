import { Request, RequestHandler, Response, Router } from 'express';
import jwt from 'jsonwebtoken';
import { ACCESS_TOKEN_SECRET } from './config';
import Database from './database';
import { IUser } from './interfaces/user';

interface IUserRequest extends Request {
  user?: IUser;
}

const database = Database.getInstance();

const router = Router();

/**
 * ******************* Auth Routes *******************
 **/

const verifyJWT: RequestHandler = (req: IUserRequest, res, next) => {
  const header = req.get('authorization');
  const accessToken = header && header.split('Bearer ')[1];

  if (accessToken) {
    const user = jwt.verify(accessToken, ACCESS_TOKEN_SECRET);
    req.user = user as IUser;
    return next();
  }
  res.sendStatus(401);
};

router.post('/register', (req, res) => {
  const { email, password } = req.body;

  if (database.getUserByEmail(email)) {
    return res.status(403).send('User already exists');
  }

  const user = database.saveUser(email, password);

  res.json({ id: user.id, email: user.email });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  const user = database.getUser(email, password);
  if (!user) {
    return res.status(403).send('Email or Password is incorrect');
  }
  const accessToken = jwt.sign({ email, password }, ACCESS_TOKEN_SECRET);

  res.json({ jwt: accessToken });
});

router.get('/user', verifyJWT, (req: IUserRequest, res) => {
  const { id, email } = database.getUserByEmail(req.user!.email)!;
  res.json({ user: { id, email } });
});

/**
 * ******************* Tasks Routes *******************
 **/

router.post('/create-task', verifyJWT, (req: IUserRequest, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).send('Name of the task is required');
  }

  const task = database.saveTask(name);
  res.json({ task });
});

router.get('/list-tasks', verifyJWT, (req: IUserRequest, res) => {
  const tasks = database.getAllTasks();

  res.json(tasks);
});

export default router;
