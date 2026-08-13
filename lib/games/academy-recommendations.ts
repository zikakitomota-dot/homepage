const academyRecommendations: Record<string, string> = {
  'a-or-an': 'Great work with articles! Continue building your grammar skills in Grammar Level 2.',
  'one-or-many': 'Great work with nouns! More grammar challenges are waiting in the Academy.',
  'he-she-it': 'Great work with pronouns! Continue practising sentence patterns in Grammar Level 2.',
  'is-am-are': 'Great work with verbs! Take the next step with Grammar Level 2.',
  'can-or-cant': 'Great work expressing what people can do! Keep building confident sentences in the Academy.',
  'who-is-it': 'Great work with pronouns! Continue practising sentence patterns in Grammar Level 2.',
  'whose-is-it': 'Great work showing who things belong to! Discover more sentence challenges in Grammar Level 2.',
  'where-is-it': 'Great work with position words! Keep growing your grammar and vocabulary in the Academy.',
  'this-that-these-those': 'Great work choosing words for things near and far! More grammar practice is waiting in the Academy.',
  'has-or-have': 'Great work with has and have! Continue strengthening everyday grammar in Level 2.',
};

export function getAcademyRecommendation(gameSlug: string) {
  return academyRecommendations[gameSlug] ?? 'Great work! Continue building your English skills in Zalea English Academy.';
}

export function getAcademyResultsHeadline(score: number) {
  if (score >= 8) return 'Amazing work! Ready for the next challenge?';
  if (score >= 5) return 'Nice work! Keep practising and growing.';
  return 'Good try! Every practice makes you stronger.';
}
