import { NextFunction, Request } from "express";
import { ApiResponse } from "../../../../internal/domain/types/globalResponse";
import { HttpStatusCode } from "../../../../internal/domain/types";
import { requestSender } from "../../../../internal/application/utils";

const responseHandler = (_: Request, res: any, next: NextFunction) => {
  res.success = (statusCode: HttpStatusCode, data: any, message?: string) => {
    const response: ApiResponse<any> = {
      success: true,
      data,
      message
    };
    return requestSender(res, response, statusCode);
  };

  res.error = (statusCode: HttpStatusCode, message: string, error?: any) => {
    const response: ApiResponse<null> = {
      success: false,
      message,
      error
    };
    return requestSender(res, response, statusCode);
  };

  next();
};

export default responseHandler;
