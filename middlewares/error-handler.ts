import { NextFunction, Request, Response } from 'express';
import StatusCodes from 'http-status-codes';
import { ICustomError, IUpdatedError } from '../interfaces_enums/interfaces';

export const errorHandlerMiddleware = (
  err: IUpdatedError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  const customError: ICustomError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'Κάτι πήγε στράβα, προσπαθήστε πάλι!',
  };

  if (err.name === 'CastError') {
    customError.msg = `Σφάλμα: Το ${err.value} έχει λάθος διαμόρφωση`;
    customError.statusCode = 400;
  }

  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((item) => {
      if (item.name === 'CastError') {
        return `
        Η τιμή ${item.value} είναι λάθος`;
      }
      if (item.kind === 'minlength') {
        if (item.path === 'password') {
          return 'Ο κωδικός πρεπεί να είναι μεγαλύτερος απο 5 χαρακτήρες';
        }
        return `Το ${item.value} πρέπει να έχει περισσότερους απο ${
          item.properties.minlength - 1
        } χαρακτήρες.`;
      }
      if (item.kind === 'maxlength') {
        return `Το ${item.value} πρέπει να έχει λιγότερους απο ${
          item.properties.maxlength + 1
        } χαρακτήρες.`;
      }
      return item;
    });

    customError.msg = errors[0].message ?? errors[0];
    customError.statusCode = 400;
  }

  if (err.code && err.code === 11000) {
    const fieldName = Object.keys(err.keyValue)[0];
    const fieldValue = err.keyValue[fieldName as unknown as number];

    const customMessage = `Το ${fieldValue} που δώσατε είναι ήδη σε χρήση, επιλέξτε κάτι άλλο!`;

    customError.msg = customMessage;
    customError.statusCode = 409;
  }

  if (err.path === '_id') {
    customError.msg = `Λάθος MongoDB ID διαμόρφωση (ID : ${err.value})`;
    customError.statusCode = 400;
  }

  return res
    .status(Number(customError.statusCode))
    .json({ message: customError.msg.replace('/', '') });
};
