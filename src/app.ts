import cors from 'cors';
import express, { Application, NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import cookieParser from 'cookie-parser';
import router from './app/routes';

const app: Application = express();

app.use(cors());
app.use(cookieParser());

//parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1', router)

//global error handler

//server root page
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.FOUND).json({
    success: true,
    message: 'Welcome to Bikash Payment backend server',
  });
  next();
});

export default app;
