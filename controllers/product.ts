import { Request, Response } from 'express';
import { ProductService } from '../services/product';
import { StatusCodes } from 'http-status-codes';

export class ProductController {
  private serv: ProductService;

  constructor() {
    this.serv = new ProductService();
  }

  public async updateProduct(req: Request, res: Response) {
    const { body } = req;
    const { id } = req.params;

    const product = await this.serv.updateProduct(body, id);

    res.status(StatusCodes.OK).json({
      product,
      message: 'Το προιόν ενημερώθηκε!',
    });
  }

  public async createProduct(req: Request, res: Response) {
    const { body, currentUser } = req;
    const product = await this.serv.createProduct(body, currentUser);
    res
      .status(StatusCodes.OK)
      .json({ product, message: 'Το προιόν δημιουργήθηκε!' });
  }

  public async deleteProduct(req: Request, res: Response) {
    const { id } = req.params;
    const product = await this.serv.deleteProduct(id);
    res
      .status(StatusCodes.OK)
      .json({ product, message: 'To προιόν διαγραφτήκε!' });
  }

  public async getProducts(req: Request, res: Response) {
    const { searchString } = req.query;
    const products = await this.serv.getProducts(searchString as string);
    res.status(StatusCodes.OK).json({ products, totalCount: products.length });
  }

  public async getSingleProduct(req: Request, res: Response) {
    const { id } = req.params;
    const product = await this.serv.getSingleProduct(id);
    res.status(StatusCodes.OK).json({ product });
  }
}
