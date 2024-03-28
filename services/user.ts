import { DataLayerService } from './general-services/data-layer';
import { BadRequestError } from '../errors/bad-request';
import User from '../models/User';
import { ForbiddenError } from '../errors/forbidden';
import { IPasswordPayload, IUser } from '../types/interfaces';
import { Roles } from '../types/enums';
import { createSessionUser } from '../helpers/create-token-user';

export class UserService extends DataLayerService<IUser> {
  private select: string;
  private searchFields: string[];

  constructor() {
    super(User);
    this.select = '-password -createdAt -updatedAt';
    this.searchFields = ['fullName', 'role'];
  }

  public async getUsers(searchString: string, id?: string) {
    if (searchString === 'dentist') {
      searchString = Roles.DENTIST;
    }
    if (searchString === 'user') {
      searchString = Roles.UNCATEGORIZED;
    }
    if (searchString === 'admin') {
      searchString = Roles.ADMIN;
    }

    const users = await this.getMany(
      searchString,
      this.select,
      this.searchFields
    );

    return users.filter((user) => user._id.toString() !== id);
  }

  public async getSingleUser(userId: string) {
    return await this.getOne(userId, this.select);
  }

  public async deleteUser(userId: string, usersRole: Roles) {
    if (usersRole === Roles.ADMIN) {
      const users = await User.find();
      const admins = users.filter((user) => user.role === Roles.ADMIN);
      if (!(admins.length - 1)) {
        throw new ForbiddenError(
          'Δεν μπορείται να διαγράψατε το λογαριασμό σας ως διαχειριστής!'
        );
      }
    }

    const deletedUser = await this.delete(userId);
    return deletedUser;
  }

  public async updateUser(payload: IUser, userId: string) {
    await super.validateData(payload);
    const updatedUser = await this.update(userId, payload, this.select);
    return createSessionUser(updatedUser);
  }

  public async changePassword(userId: string, payload: IPasswordPayload) {
    const { oldPassword, newPassword } = payload;
    if (!oldPassword && !newPassword) {
      throw new BadRequestError('Δώστε καινούργιο και παλαιό κωδικό!');
    }

    const user = await this.getOne(userId);
    const isMatch = await user.comparePassword(oldPassword);

    if (!isMatch) {
      throw new BadRequestError('Οι κωδικοί δεν ταιριάζουν!');
    }

    user.password = newPassword;
    await user.save();

    return 'Ο κωδικός πρόσβασης άλλαξε!';
  }

  public async createUser(payload: IUser) {
    await super.validateData(payload);
    const user = await super.create(payload);
    return await this.getOne(user._id, this.select);
  }

  public async changeUserRole(
    userId: string,
    role: Roles,
    currentUserId: string
  ) {
    if (userId === currentUserId) {
      throw new ForbiddenError('Δεν μπορείτε να αλλάξετε το ρόλο σας!');
    }
    if (!role) {
      throw new BadRequestError('Παρακαλώ επιλέξτε ένα ρόλο!');
    }

    const user = await this.getOne(userId);

    if (user.role === role) {
      throw new BadRequestError('Ο χρήστης εχεί ήδη αυτό το ρολό!');
    }

    user.role = role;
    await user.save();

    return `Ο ρόλος για το χρήστη ${user.fullName} άλλαξε σε ${user.role}`;
  }
}
