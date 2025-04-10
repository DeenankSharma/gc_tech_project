import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import {router as protectedRoutes } from './routes/P_Routes.ts';
import {router as unprotectedRoutes } from './routes/UP_Routes.ts';
import { jwtCheck } from './middleware/auth_middleware.ts';
import { db_connect } from './configs/db_connection.ts';

db_connect()

const app = express();
const port = process.env.PORT;
dotenv.config();
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());


// Import routes
app.use('/', unprotectedRoutes);  
app.use('/protected',jwtCheck,protectedRoutes);

app.listen(port, () => {
  console.log(`Auth server is running on port ${port}`);
}); 


