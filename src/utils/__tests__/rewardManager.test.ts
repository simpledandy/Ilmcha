import { RewardManager } from '../rewardManager';

describe('RewardManager', () => {
  it('should instantiate without error', () => {
    expect(() => new RewardManager()).not.toThrow();
  });
  it('should have awardTreasure method', () => {
    const manager = new RewardManager();
    expect(typeof manager.awardTreasure).toBe('function');
  });
}); 