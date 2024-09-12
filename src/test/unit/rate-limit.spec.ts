import { Request, Response, NextFunction } from "express";
import { CONFIG } from "../../deploy";
import { rateLimiter } from "../../cmd/gateway/http/middlewares/rateLimiter.middleware";
import { RedisCacheRepository } from "../../internal/adapters/repository/redis/cache.repository";
import { HttpStatusCode } from "../../internal/domain/types";

jest.mock("../../internal/adapters/repository/redis/cache.repository");
jest.mock("../../deploy", () => ({
  CONFIG: {
    maxRateLimit: 5,
    rateLimitTime: 60
  }
}));

const mockRedisRepo = RedisCacheRepository.prototype;
let mockConfig: CONFIG;

describe("rateLimiter middleware", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = { headers: { "user-id": "test-user" } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  it("should allow the request if rate limit is not exceeded", async () => {
    mockRedisRepo.get = jest.fn().mockResolvedValue("2"); // Simulate 2 requests so far
    mockRedisRepo.setWithTimeout = jest.fn().mockResolvedValue(null);

    await rateLimiter(req as Request, res as Response, next);

    expect(mockRedisRepo.get).toHaveBeenCalledWith("rate-limit:test-user");
    expect(mockRedisRepo.setWithTimeout).toHaveBeenCalledWith(
      "rate-limit:test-user",
      "3",
      mockConfig.rateLimitTime
    );
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled(); // No response sent yet
  });

  it("should block the request if rate limit is exceeded", async () => {
    mockRedisRepo.get = jest.fn().mockResolvedValue("5"); // Simulate 5 requests already made

    await rateLimiter(req as Request, res as Response, next);

    expect(mockRedisRepo.get).toHaveBeenCalledWith("rate-limit:test-user");
    expect(res.status).toHaveBeenCalledWith(HttpStatusCode.TOO_MANY_REQUESTS);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: "TOO_MANY_REQUESTS",
      message: "You have exceeded the 5 requests in 3600 seconds limit!"
    });
    expect(next).not.toHaveBeenCalled(); // next() should not be called if rate limit exceeded
  });

  it("should handle errors thrown by Redis", async () => {
    mockRedisRepo.get = jest.fn().mockRejectedValue(new Error("Redis error"));

    await rateLimiter(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(HttpStatusCode.INTERNAL_SERVER_ERROR);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Redis error",
      error: "INTERNAL_SERVER_ERROR"
    });
    expect(next).not.toHaveBeenCalled(); // next() should not be called if there's an error
  });
});
