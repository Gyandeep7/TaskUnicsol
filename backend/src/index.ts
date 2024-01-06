import express from 'express';
import session from 'express-session';
import { createConnection } from 'typeorm';
import bodyParser from 'body-parser';
import * as path from 'path';

import { User } from './entities/User';
import { Todo } from './entities/Todo';
import { UserController } from './controllers/UserController';
import { TodoController } from './controllers/TodoController';

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'your-secret-key', resave: false, saveUninitialized: false }));

createConnection()
  .then(() => {
    app.use(express.static(path.join(__dirname, 'public')));
    app.use('/user', UserController);
    app.use('/todo', TodoController);

    app.listen(3000, () => {
      console.log('Server is running on port 3000');
    });
  })
  .catch((error) => console.log('TypeORM connection error: ', error));
