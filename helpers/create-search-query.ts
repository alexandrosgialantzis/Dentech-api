import { FilterQuery } from 'mongoose';

export const createSearchQuery = <T>(
  searchString: string = '',
  fields: Array<keyof T>
): FilterQuery<T> => {
  if (typeof searchString !== 'string' || searchString.trim() === '') {
    return {};
  }

  const searchRegex = new RegExp(searchString.trim(), 'i');
  const searchConditions = fields.map(
    (field) =>
      ({
        [field]: { $regex: searchRegex },
      } as FilterQuery<T>)
  );

  return searchConditions.length > 0 ? { $or: searchConditions } : {};
};
