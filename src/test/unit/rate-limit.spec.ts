// Mocking the RedisCacheRepository
import { rateLimitHandler } from "../../cmd/gateway/http/middlewares/rateLimiter.middleware";
import { CONFIG } from "../../deploy";
import { ApiResponse } from "../../internal/domain/types/globalResponse";
import { HttpStatusMessage } from "../../internal/domain/types/httpStatusMessage";
import { HttpStatusCode } from "../../internal/domain/types";

const mockRedisRepo = {
  get: jest.fn(),
  setWithTimeout: jest.fn()
};

// Mocking the response and requestSender function
const mockResponse = {};
const requestSender = jest.fn();

// Mocking the CONFIG object
const mockConfig = {
  maxRateLimit: 5,
  rateLimitTime: 1 // in minutes
};

describe("rateLimitHandler", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should allow the request if the rate limit has not been exceeded", async () => {
    mockRedisRepo.get.mockResolvedValueOnce("2"); // current request count is 2

    await rateLimitHandler(
      "user123",
      mockRedisRepo as any,
      mockConfig as CONFIG,
      mockResponse as any
    );

    expect(mockRedisRepo.get).toHaveBeenCalledWith("rate-limit:user123");
    expect(mockRedisRepo.setWithTimeout).toHaveBeenCalledWith(
      "rate-limit:user123",
      "3",
      mockConfig.rateLimitTime
    );
    expect(requestSender).not.toHaveBeenCalled(); // request should not be blocked
  });

  it("should block the request if the rate limit has been exceeded", async () => {
    mockRedisRepo.get.mockResolvedValueOnce("5"); // current request count is 5, equal to maxRateLimit

    await rateLimitHandler(
      "user123",
      mockRedisRepo as any,
      mockConfig as CONFIG,
      mockResponse as any
    );

    expect(mockRedisRepo.get).toHaveBeenCalledWith("rate-limit:user123");
    expect(mockRedisRepo.setWithTimeout).not.toHaveBeenCalled(); // no need to increment since the limit is exceeded

    const expectedPayload: ApiResponse<null> = {
      success: false,
      error: HttpStatusMessage.TOO_MANY_REQUESTS,
      message: `You have exceeded the ${mockConfig.maxRateLimit} requests in ${
        mockConfig.rateLimitTime * 60
      } seconds limit!`
    };
    expect(requestSender).toHaveBeenCalledWith(
      mockResponse,
      expectedPayload,
      HttpStatusCode.TOO_MANY_REQUESTS
    );
  });

  it("should handle the case when no prior requests have been made (request count is null)", async () => {
    mockRedisRepo.get.mockResolvedValueOnce(null); // no prior request count

    await rateLimitHandler(
      "user123",
      mockRedisRepo as any,
      mockConfig as CONFIG,
      mockResponse as any
    );

    expect(mockRedisRepo.get).toHaveBeenCalledWith("rate-limit:user123");
    expect(mockRedisRepo.setWithTimeout).toHaveBeenCalledWith(
      "rate-limit:user123",
      "1",
      mockConfig.rateLimitTime
    ); // first request
    expect(requestSender).not.toHaveBeenCalled(); // request should not be blocked
  });
});
