import { storage } from "../storage";
import AsyncStorage from "@react-native-async-storage/async-storage";

// The comprehensive mocks in jest.setup.js should handle all the React Native mocking
// We just need to test the storage functions directly

describe("storage utility", () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    await AsyncStorage.clear();
  });

  it("stores auth token successfully", async () => {
    const token = "test-token";
    await expect(storage.setAuthToken(token)).resolves.toBeUndefined();
  });

  it("retrieves auth token successfully", async () => {
    // First store a token
    const testToken = "test-token-123";
    await storage.setAuthToken(testToken);
    // Mock AsyncStorage.getItem to return the token
    jest.spyOn(AsyncStorage, "getItem").mockResolvedValueOnce(testToken);
    // Then retrieve it
    const token = await storage.getAuthToken();
    expect(token).toBe(testToken);
  });

  it("stores user data successfully", async () => {
    const userData = { name: "test", email: "test@example.com" };
    await expect(storage.setUserData(userData)).resolves.toBeUndefined();
  });

  it("retrieves user data successfully", async () => {
    const userData = await storage.getUserData();
    expect(userData).toBeDefined();
  });

  it("clears auth data successfully", async () => {
    await expect(storage.clearAuth()).resolves.toBeUndefined();
  });
});
