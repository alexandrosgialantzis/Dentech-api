import { OrderStatus } from '../types/enums';
import { IDateQuery } from '../types/interfaces';

export const createDateQuery = (
  year?: string,
  status?: OrderStatus
): IDateQuery => {
  let dateQuery = {};

  if (year) {
    const startDate = new Date(Number(year), 0, 1);
    const endDate = new Date(Number(year) + 1, 0, 1);

    if (status === OrderStatus.NOT_SEND) {
      dateQuery = {
        $or: [{ takenDate: { $gte: startDate, $lt: endDate } }],
      };
    }

    if (status === OrderStatus.SEND) {
      dateQuery = {
        $or: [{ sendDate: { $gte: startDate, $lt: endDate } }],
      };
    }

    dateQuery = {
      $or: [
        { sendDate: { $gte: startDate, $lt: endDate } },
        { takenDate: { $gte: startDate, $lt: endDate } },
      ],
    };
  }

  return dateQuery;
};
