import { DI } from "../../../DI";
import { NextFunction, Request, Response } from "express";
import { HttpStatusCode, TYPES } from "../../../../internal/domain/types";
import { RedisCacheRepository } from "../../../../internal/adapters/repository/redis/cache.repository";
import { HttpStatusMessage } from "../../../../internal/domain/types/httpStatusMessage";
import { CONFIG } from "../../../../deploy";
import { ApiResponse } from "../../../../internal/domain/types/globalResponse";

export const rateLimiter = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const redisRepo = DI.get<RedisCacheRepository>(TYPES.CacheRepository);
    const cfg = DI.get<CONFIG>(TYPES.APP_CONFIG);

    const userID = req.headers?.["user-id"];

    if (!userID) next();

    const key = `rate-limit:${userID}`;

    let requestCount = await redisRepo.get(key);
    const count = requestCount ? parseInt(requestCount) : 0;
    if (count >= cfg.maxRateLimit) {
      const response: ApiResponse<null> = {
        success: false,
        error: HttpStatusMessage.TOO_MANY_REQUESTS,
        message: `You have exceeded the ${cfg.maxRateLimit} requests in ${
          cfg.rateLimitTime * 60
        } seconds limit!`
      };
      res.status(HttpStatusCode.TOO_MANY_REQUESTS).json(response);
      next();
    }
    await redisRepo.setRateWithTimeout(key, String(count + 1));
  } catch (err: any) {
    const response: ApiResponse<null> = {
      success: false,
      message: err.message,
      error: HttpStatusMessage.INTERNAL_SERVER_ERROR
    };
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json(response);
    next();
  }
};
