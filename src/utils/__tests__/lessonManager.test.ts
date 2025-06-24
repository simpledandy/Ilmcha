import { LessonManager } from '../lessonManager';

describe('LessonManager', () => {
  it('should instantiate without error', () => {
    expect(() => new LessonManager()).not.toThrow();
  });
  it('should have createIslandLessons method', () => {
    const manager = new LessonManager();
    expect(typeof manager.createIslandLessons).toBe('function');
  });
}); 