import { storage } from "../storage";

const mockGetItem = jest.fn((key) => {
  if (key === "@auth_token") return Promise.resolve("mock-token");
  if (key === "@user_data")
    return Promise.resolve(JSON.stringify({ name: "test" }));
  return Promise.resolve(null);
});

const mockAsyncStorage = {
  setItem: jest.fn(),
  getItem: mockGetItem,
  multiRemove: jest.fn(),
};

jest.mock("@react-native-async-storage/async-storage", () => ({
  __esModule: true,
  default: mockAsyncStorage,
  ...mockAsyncStorage,
}));

describe("storage utility", () => {
  it("should set auth token without throwing", async () => {
    await expect(storage.setAuthToken("token")).resolves.toBeUndefined();
  });
  it("should get auth token without throwing", async () => {
    await expect(storage.getAuthToken()).resolves.toBe("mock-token");
  });
  it("should set user data without throwing", async () => {
    await expect(
      storage.setUserData({ name: "test", email: "test@example.com" }),
    ).resolves.toBeUndefined();
  });
  it("should get user data without throwing", async () => {
    await expect(storage.getUserData()).resolves.toEqual({ name: "test" });
  });
  it("should clear auth without throwing", async () => {
    await expect(storage.clearAuth()).resolves.toBeUndefined();
  });
});
