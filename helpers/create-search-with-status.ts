import { OrderStatus } from '../types/enums';
import { createSearchQuery } from './create-search-query';

export const createStatusSearchQuery = (
  search: OrderStatus | string,
  fields: string[]
) => {
  let searchQuery = {};
  if (search) {
    const orderStatuses = [OrderStatus.SEND, OrderStatus.NOT_SEND];
    const hasStatus = orderStatuses.includes(search as OrderStatus);
    if (hasStatus) {
      searchQuery = { status: search };
    } else {
      searchQuery = createSearchQuery(search, fields);
    }
  }

  return searchQuery;
};
