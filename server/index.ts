import express from 'express';
import { SERVER_PORT } from './config';
import router from './routes';

const app = express();
app.use(express.json());
app.use(router);

app.listen(SERVER_PORT, () => console.log(`Server listening on ${SERVER_PORT}`));
