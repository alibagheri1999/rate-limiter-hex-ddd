import { ExpressRequest } from "../../../../internal/domain/types/expressRequest";
import express, { Response } from "express";
import { ApiResponse } from "../../../../internal/domain/types/globalResponse";
import { HttpStatusMessage } from "../../../../internal/domain/types/httpStatusMessage";
import { requestSender } from "../../../../internal/application/utils";
import { HttpStatusCode } from "../../../../internal/domain/types";
import { ExpressError } from "../../../../internal/domain/types/expressError";

export const globalMiddleware = (_: ExpressRequest, res: Response, next: express.NextFunction) => {
  const response: ApiResponse<null> = {
    success: false,
    message: HttpStatusMessage.NOT_FOUND,
    error: "API_NOT_FOUND"
  };
  requestSender(res, response, HttpStatusCode.NOT_FOUND);
};

export const errorMiddleware = (
  error: ExpressError,
  _: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const response: ApiResponse<null> = {
    success: false,
    message: HttpStatusMessage.INTERNAL_SERVER_ERROR,
    error: error.message
  };
  requestSender(res, response, error?.status ? error.status : HttpStatusCode.INTERNAL_SERVER_ERROR);
};
