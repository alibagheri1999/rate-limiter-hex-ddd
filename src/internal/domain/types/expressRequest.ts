import { Request } from "express";

export type ExpressRequest = Request & { status?: number };