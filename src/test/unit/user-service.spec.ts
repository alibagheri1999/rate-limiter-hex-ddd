import { CONFIG } from "../../deploy";
import { User } from "../../internal/domain/model";
import { RepositoryResult } from "../../internal/domain/types";
import { UserService } from "../../internal/application/services";

const mockPgUserRepo = {
  findUser: jest.fn()
};

const mockRedisCacheRepo = {
  get: jest.fn(),
  setWithTimeout: jest.fn()
};

const mockConfig = {
  cacheDuration: 300
};

const sampleUser = {
  id: 1,
  username: "John Doe",
  phoneNumber: "{{RANDOM_PHONE_NUMBER}}",
};

const mockUserRepoResult: RepositoryResult<User> = {
  success: true,
  rowCount: 1,
  rows: [sampleUser as User]
};

describe("UserService - getRandomUser", () => {
  let userService: UserService;

  beforeEach(() => {
    jest.clearAllMocks();
    userService = new UserService(
      mockPgUserRepo as any,
      mockRedisCacheRepo as any,
      mockConfig as CONFIG
    );
  });

  it("should return user from cache if found", async () => {
    mockRedisCacheRepo.get.mockResolvedValueOnce(JSON.stringify(mockUserRepoResult));

    const result = await userService.getRandomUser("{{RANDOM_PHONE_NUMBER}}");

    expect(mockRedisCacheRepo.get).toHaveBeenCalledWith("user-{{RANDOM_PHONE_NUMBER}}");
    expect(result).toEqual(sampleUser);
    expect(mockPgUserRepo.findUser).not.toHaveBeenCalled();
  });

  it("should fetch user from DB and cache it if not found in cache", async () => {
    mockRedisCacheRepo.get.mockResolvedValueOnce(null);

    mockPgUserRepo.findUser.mockResolvedValueOnce(mockUserRepoResult);

    const result = await userService.getRandomUser("{{RANDOM_PHONE_NUMBER}}");

    expect(mockRedisCacheRepo.get).toHaveBeenCalledWith("user-{{RANDOM_PHONE_NUMBER}}");
    expect(mockPgUserRepo.findUser).toHaveBeenCalledWith("{{RANDOM_PHONE_NUMBER}}");
    expect(result).toEqual(sampleUser);
    expect(mockRedisCacheRepo.setWithTimeout).toHaveBeenCalledWith(
      "user-{{RANDOM_PHONE_NUMBER}}",
      JSON.stringify(mockUserRepoResult),
      mockConfig.cacheDuration
    );
  });

  it("should throw an error if user is not found in DB", async () => {
    mockRedisCacheRepo.get.mockResolvedValueOnce(null);

    mockPgUserRepo.findUser.mockResolvedValueOnce({
      success: true,
      rowCount: 0,
      rows: []
    });

    await expect(userService.getRandomUser("{{RANDOM_PHONE_NUMBER}}")).rejects.toThrow("User not found");

    expect(mockRedisCacheRepo.get).toHaveBeenCalledWith("user-{{RANDOM_PHONE_NUMBER}}");
    expect(mockPgUserRepo.findUser).toHaveBeenCalledWith("{{RANDOM_PHONE_NUMBER}}");
    expect(mockRedisCacheRepo.setWithTimeout).not.toHaveBeenCalled();
  });
});
