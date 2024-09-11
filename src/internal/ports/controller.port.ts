import { Request, Response } from "express";

export interface IUserController {
  getRandomUser(req: Request, res: Response): Promise<any>;
}
