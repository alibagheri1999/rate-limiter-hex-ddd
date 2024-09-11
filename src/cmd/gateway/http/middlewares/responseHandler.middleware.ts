import { Request, NextFunction } from "express";
import { ApiResponse } from "../../../../internal/domain/types/globalResponse";
import { HttpStatusCode } from "../../../../internal/domain/types";

const responseHandler = (_: Request, res: any, next: NextFunction) => {
  res.success = (statusCode: HttpStatusCode, data: any, message?: string) => {
    const response: ApiResponse<any> = {
      success: true,
      data,
      message
    };
    return res.status(statusCode).json(response);
  };

  res.error = (statusCode: HttpStatusCode, message: string, error?: any) => {
    const response: ApiResponse<null> = {
      success: false,
      message,
      error
    };
    return res.status(statusCode).json(response);
  };

  next();
};

export default responseHandler;
