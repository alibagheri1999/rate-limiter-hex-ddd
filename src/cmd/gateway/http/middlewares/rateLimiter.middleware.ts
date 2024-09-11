import { DI } from "../../../DI";
import { NextFunction, Request, Response } from "express";
import { HTTP_STATUS_CODE, TYPES } from "../../../../internal/domain/types";
import { RedisCacheRepository } from "../../../../internal/adapters/repository/redis/cache.repository";

const WINDOW_SIZE_IN_SECONDS = 60;
const MAX_WINDOW_REQUEST_COUNT = 10;


export const rateLimiter = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const redisRepo = DI.get<RedisCacheRepository>(TYPES.CacheRepository);

    const userID = req.headers?.["user-id"];

    if (!userID) next();

    const key = `rate-limit:${userID}`;

    let requestCount = await redisRepo.get(key);
    const count = requestCount ? parseInt(requestCount) : 0;
    if (count >= MAX_WINDOW_REQUEST_COUNT) {
      return res.status(HTTP_STATUS_CODE.TOO_MANY_REQUESTS).json({
        message: `You have exceeded the ${MAX_WINDOW_REQUEST_COUNT} requests in ${WINDOW_SIZE_IN_SECONDS} seconds limit!`
      });
    }

    await redisRepo.setRateWithTimeout(key, count + 1);

    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};