//general
import express from 'express';
import dotenv from 'dotenv';
import 'express-async-errors';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import { InternalServerError } from './errors/internal-server-error';
import { connectDB } from './db/connect';
import { IUserWithId } from './interfaces_enums/interfaces';
import { notFoundMiddleware } from './middlewares/not-found';
import { errorHandlerMiddleware } from './middlewares/error-handler';
import { headersMiddleware } from './middlewares/headers';
import { authenticateUser, authorizePermissions } from './middlewares/auth';
import { Roles } from './interfaces_enums/enums';

//routes
import authRouter from './routes/auth';
import userRouter from './routes/user';
import productRouter from './routes/product';
import orderRouter from './routes/order';

const corsObject = {
  origin: true,
  credentials: true,
};

const server = express();

dotenv.config();

server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(cookieParser(process.env.JWT_SECRET));
server.use(cors(corsObject));

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      currentUser?: IUserWithId;
    }
  }
}

const port = process.env.PORT || 4500;

server.use('/api/v1/auth', authRouter);
server.use('/api/v1/user', authenticateUser, userRouter);
server.use('/api/v1/order', authenticateUser, orderRouter);
server.use(
  '/api/v1/product',
  authenticateUser,
  authorizePermissions(Roles.ADMIN),
  productRouter
);

server.use(notFoundMiddleware);
server.use(headersMiddleware);
server.use(errorHandlerMiddleware);

const startServer = async () => {
  try {
    if (process.env.MONGO_URI) {
      await connectDB(process.env.MONGO_URI);
      server.listen(port, () => {
        console.log(`Ο server βρίσκεται στη θύρα ${port}...`);
      });
    } else {
      throw new InternalServerError(
        'Κάτι πήγε στραβά, ξανά δοκιμάστε σε λίγο.'
      );
    }
  } catch (error) {
    console.log(error);
  }
};

startServer();
