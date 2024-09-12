import { rateLimitHandler } from "../../cmd/gateway/http/middlewares/rateLimiter.middleware";
import { CONFIG } from "../../deploy";
import { ApiResponse } from "../../internal/domain/types/globalResponse";
import { HttpStatusMessage } from "../../internal/domain/types/httpStatusMessage";
import { HttpStatusCode } from "../../internal/domain/types";

const mockRedisRepo = {
  get: jest.fn(),
  setWithTimeout: jest.fn()
};

const mockResponse = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn()
};

const mockConfig = {
  maxRateLimit: 5,
  rateLimitTime: 1
};

describe("rateLimitHandler", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should allow the request if the rate limit has not been exceeded", async () => {
    mockRedisRepo.get.mockResolvedValueOnce("2");

    await rateLimitHandler(
      "{{RANDOM_PHONE_NUMBER}}",
      mockRedisRepo as any,
      mockConfig as CONFIG,
      mockResponse as any
    );

    expect(mockRedisRepo.get).toHaveBeenCalledWith("rate-limit:{{RANDOM_PHONE_NUMBER}}");
    expect(mockRedisRepo.setWithTimeout).toHaveBeenCalledWith(
      "rate-limit:{{RANDOM_PHONE_NUMBER}}",
      "3",
      mockConfig.rateLimitTime
    );
    expect(mockResponse.status).not.toHaveBeenCalled();
    expect(mockResponse.json).not.toHaveBeenCalled();
  });

  it("should block the request if the rate limit has been exceeded", async () => {
    mockRedisRepo.get.mockResolvedValueOnce("5");

    await rateLimitHandler(
      "{{RANDOM_PHONE_NUMBER}}",
      mockRedisRepo as any,
      mockConfig as CONFIG,
      mockResponse as any
    );

    expect(mockRedisRepo.get).toHaveBeenCalledWith("rate-limit:{{RANDOM_PHONE_NUMBER}}");
    expect(mockRedisRepo.setWithTimeout).not.toHaveBeenCalled();

    const expectedPayload: ApiResponse<null> = {
      success: false,
      error: HttpStatusMessage.TOO_MANY_REQUESTS,
      message: `You have exceeded the ${mockConfig.maxRateLimit} requests in ${
        mockConfig.rateLimitTime * 60
      } seconds limit!`
    };
    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatusCode.TOO_MANY_REQUESTS);
    expect(mockResponse.json).toHaveBeenCalledWith(expectedPayload);
  });

  it("should handle the case when no prior requests have been made (request count is null)", async () => {
    mockRedisRepo.get.mockResolvedValueOnce(null);

    await rateLimitHandler(
      "{{RANDOM_PHONE_NUMBER}}",
      mockRedisRepo as any,
      mockConfig as CONFIG,
      mockResponse as any
    );

    expect(mockRedisRepo.get).toHaveBeenCalledWith("rate-limit:{{RANDOM_PHONE_NUMBER}}");
    expect(mockRedisRepo.setWithTimeout).toHaveBeenCalledWith(
      "rate-limit:{{RANDOM_PHONE_NUMBER}}",
      "1",
      mockConfig.rateLimitTime
    );
    expect(mockResponse.status).not.toHaveBeenCalled();
    expect(mockResponse.json).not.toHaveBeenCalled();
  });
});
