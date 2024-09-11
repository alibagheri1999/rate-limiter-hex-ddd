import { Response } from "express";
import { HttpStatusCode } from "./httpStatusCode";

type success = (statusCode: HttpStatusCode, data: any, message?: string) => void;

type error = (statusCode: HttpStatusCode, message: string, error?: string) => void;

export type ExpressResponse = Response & { success: success; error: error; statusCode?: number };
