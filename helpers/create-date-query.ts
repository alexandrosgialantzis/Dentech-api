import { OrderStatus } from '../types/enums';
import { IDateQuery } from '../types/interfaces';

export const createDateQuery = (
  year?: string,
  status?: OrderStatus
): IDateQuery => {
  let dateQuery = {};

  if (year) {
    const firstDay = new Date(Number(year), 0, 1);
    const lastDay = new Date(Number(year) + 1, 0, 1);

    switch (status) {
      case OrderStatus.NOT_SEND:
        dateQuery = {
          $or: [{ takenDate: { $gte: firstDay, $lt: lastDay } }],
        };
        break;

      case OrderStatus.SEND:
        dateQuery = {
          $or: [{ sendDate: { $gte: firstDay, $lt: lastDay } }],
        };
        break;

      default:
        dateQuery = {
          $or: [
            { sendDate: { $gte: firstDay, $lt: lastDay } },
            { takenDate: { $gte: firstDay, $lt: lastDay } },
          ],
        };
        break;
    }
  }

  return dateQuery;
};
