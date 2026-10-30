'use client';

import { useCallback, useRef } from 'react';
import { trackEvent } from '@/lib/analytics';
import { createSessionId, recordLearningSessionCompletion, recordLearningSessionStart, type SessionContext } from '@/lib/games/learning-journey';

export function useLearningSession(gameId: string, { trackAchievementEvents = true }: { trackAchievementEvents?: boolean } = {}) {
  const sessionId = useRef<string | null>(null);

  const announceAchievements = useCallback((ids: string[]) => {
    if (trackAchievementEvents) ids.forEach((achievement) => trackEvent('achievement_earned', { achievement }));
  }, [trackAchievementEvents]);

  const startLearningSession = useCallback((context?: SessionContext) => {
    if (sessionId.current) return sessionId.current;
    const id = createSessionId();
    const result = recordLearningSessionStart(gameId, id, undefined, undefined, context);
    if (result) {
      sessionId.current = id;
      announceAchievements(result.newlyEarned);
    }
    return id;
  }, [announceAchievements, gameId]);

  const completeLearningSession = useCallback((correct: number, questions: number) => {
    if (!sessionId.current) return false;
    const result = recordLearningSessionCompletion(gameId, sessionId.current, correct, questions);
    if (!result) return false;
    announceAchievements(result.newlyEarned);
    sessionId.current = null;
    return true;
  }, [announceAchievements, gameId]);

  // Keep the started record as an unfinished attempt, but allow a genuinely new
  // board to start its own session. Existing games need not use this operation.
  const abandonLearningSession = useCallback(() => { sessionId.current = null; }, []);
  return { startLearningSession, completeLearningSession, abandonLearningSession };
}
