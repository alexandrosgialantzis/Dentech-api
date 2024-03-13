import { BadRequestError } from '../errors/bad-request';

export const checkDate = async (datePayload: Date, dateName: string) => {
  const date = new Date(datePayload);
  const isValid = !isNaN(date.getTime());

  if (!isValid) {
    throw new BadRequestError(`H ημερομινία ${dateName} είναι λάθος.`);
  }
};
