import { NextFunction, Request, Response } from "express";
import { User } from "../domain/model";

export interface IUserController {
  getRandomUser(req: Request, res: Response): Promise<User> ;
}
