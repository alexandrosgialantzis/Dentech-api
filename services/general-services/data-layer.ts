import { Model } from 'mongoose';
import { IPopulate } from '../../interfaces_enums/interfaces';
import { createSearchQuery } from '../../helpers/create-search-query';
import { BadRequestError } from '../../errors/bad-request';

export class DataLayerService<T> {
  public model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  public async getMany(
    searchString: string,
    select: string,
    searchFields: string[],
    populateOptions: Array<IPopulate> = []
  ) {
    const searchQuery = createSearchQuery(searchString, searchFields);

    return (await this.model
      .find(searchQuery)
      .select(select)
      .populate(populateOptions)) as T[];
  }

  public async getOne(
    id: string,
    selectOptions = '',
    populateOptions: Array<IPopulate> = []
  ) {
    return (await this.model
      .findById(id)
      .select(selectOptions)
      .populate(populateOptions)) as T;
  }

  public async create(data: Partial<T>) {
    return (await this.model.create(data)) as T;
  }

  public async update(
    id: string,
    data: Partial<T>,
    select = '',
    populateOptions: Array<IPopulate> = []
  ) {
    const options = { new: true, runValidators: true };
    return (await this.model
      .findByIdAndUpdate(id, data, options)
      .select(select)
      .populate(populateOptions)) as T;
  }

  public async delete(id: string) {
    return (await this.model.findByIdAndDelete(id).select('-createdAt')) as T;
  }

  public async validateData(data: Partial<T>) {
    const schemaPaths = Object.keys(this.model.schema.paths);

    const invalidKeys = Object.keys(data).filter(
      (key) => !schemaPaths.includes(key)
    );

    if (invalidKeys.length) {
      throw new BadRequestError(`Λάθος πέδια: ${invalidKeys.join(', ')}`);
    }
  }
}
