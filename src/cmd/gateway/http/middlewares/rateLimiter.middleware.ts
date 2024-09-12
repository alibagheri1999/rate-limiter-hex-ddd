import { DI } from "../../../DI";
import { NextFunction, Request, Response } from "express";
import { HttpStatusCode, TYPES } from "../../../../internal/domain/types";
import { RedisCacheRepository } from "../../../../internal/adapters/repository/redis/cache.repository";
import { HttpStatusMessage } from "../../../../internal/domain/types/httpStatusMessage";
import { CONFIG } from "../../../../deploy";
import { ApiResponse } from "../../../../internal/domain/types/globalResponse";
import { nullableStrings } from "../../../../internal/domain/types/strings";

export const rateLimiter = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const redisRepo = DI.get<RedisCacheRepository>(TYPES.CacheRepository);
    const cfg = DI.get<CONFIG>(TYPES.APP_CONFIG);

    const userID = req.headers?.["user-id"];

    const result = await rateLimitHandler(userID, redisRepo, cfg, res);
    if (result) return result;
  } catch (err: any) {
    const payload: ApiResponse<null> = {
      success: false,
      message: err.message,
      error: HttpStatusMessage.INTERNAL_SERVER_ERROR
    };
    return requestSender(res, payload, HttpStatusCode.INTERNAL_SERVER_ERROR);
  }
  next();
};

export async function rateLimitHandler(
  userID: nullableStrings,
  redisRepo: RedisCacheRepository,
  cfg: CONFIG,
  response: Response
) {
  const key = `rate-limit:${userID}`;

  let requestCount = await redisRepo.get(key);
  const count = requestCount ? parseInt(requestCount) : 0;
  if (count >= cfg.maxRateLimit) {
    const payload: ApiResponse<null> = {
      success: false,
      error: HttpStatusMessage.TOO_MANY_REQUESTS,
      message: `You have exceeded the ${cfg.maxRateLimit} requests in ${
        cfg.rateLimitTime * 60
      } seconds limit!`
    };
    return requestSender(response, payload, HttpStatusCode.TOO_MANY_REQUESTS);
  }
  await redisRepo.setWithTimeout(key, String(count + 1), cfg.rateLimitTime);
}

export function requestSender(
  response: Response,
  payload: ApiResponse<null>,
  status: HttpStatusCode
) {
  return response.status(status).json(payload);
}
