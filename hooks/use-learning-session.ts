'use client';

import { useCallback, useRef } from 'react';
import { trackEvent } from '@/lib/analytics';
import { createSessionId, recordLearningSessionCompletion, recordLearningSessionStart } from '@/lib/games/learning-journey';

export function useLearningSession(gameId: string) {
  const sessionId = useRef<string | null>(null);

  const announceAchievements = useCallback((ids: string[]) => {
    ids.forEach((achievement) => trackEvent('achievement_earned', { achievement }));
  }, []);

  const startLearningSession = useCallback(() => {
    if (sessionId.current) return sessionId.current;
    const id = createSessionId();
    const result = recordLearningSessionStart(gameId, id);
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

  return { startLearningSession, completeLearningSession };
}
