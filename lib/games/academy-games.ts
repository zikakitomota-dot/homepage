import type { AcademyGameSummary } from './types';

const premium = (
  id: string,
  slug: string,
  title: string,
  shortDescription: string,
  category: 'Grammar' | 'Vocabulary',
  level: 1 | 2,
  icon: string,
  learningObjective: string,
  questionCount: number,
  interaction: AcademyGameSummary['interaction'] = 'multipleChoice',
): AcademyGameSummary => ({ id, slug, title, shortDescription, category, level, access: 'premium', icon, learningObjective, questionCount, interaction });

export const grammarLevelTwoGames = [
  premium('grammar-was-were', 'was-or-were', 'Was or Were?', 'Practise the past form of “to be”.', 'Grammar', 2, '⏰', 'Choose was or were to complete simple past-tense sentences.', 25),
  premium('grammar-do-does', 'do-or-does', 'Do or Does?', 'Choose the correct helping verb.', 'Grammar', 2, '❓', 'Use do and does correctly in simple present questions.', 25),
  premium('grammar-dont-doesnt', 'dont-or-doesnt', "Don't or Doesn't?", 'Practise negative sentences in the simple present.', 'Grammar', 2, '🚫', "Use don't and doesn't with the correct subject and base verb.", 25),
  premium('grammar-add-s', 'add-s-or-not', 'Add S or Not?', 'Practise present-tense verbs with he, she, and it.', 'Grammar', 2, '➕', 'Recognise when a simple present verb needs an s or es ending.', 25),
  premium('grammar-yesterday', 'yesterday-actions', 'Yesterday Actions', 'Practise common simple past-tense verbs.', 'Grammar', 2, '📅', 'Choose familiar regular and common irregular past-tense verbs.', 25),
  premium('grammar-possessive-s', 'sams-bag', "Sam's Bag", "Learn how 's shows that something belongs to someone.", 'Grammar', 2, '🎒', "Use apostrophe-s to show ownership clearly.", 20),
  premium('grammar-question-words', 'question-words', 'Who, What, Where or When?', 'Choose the right question word.', 'Grammar', 2, '🔎', 'Select a question word based on the information being requested.', 25),
  premium('grammar-conjunctions', 'and-but-because', 'And, But or Because?', 'Join ideas using simple conjunctions.', 'Grammar', 2, '🔗', 'Connect related, contrasting, and cause-and-effect ideas.', 25),
  premium('grammar-time-words', 'in-on-at', 'In, On or At?', 'Practise simple time words.', 'Grammar', 2, '🕐', 'Use in, on, and at with common dates and times.', 25),
  premium('grammar-sentence-builder', 'build-the-sentence', 'Build the Sentence', 'Tap words in the correct order to make a sentence.', 'Grammar', 2, '🧩', 'Arrange words into a complete sentence with correct word order.', 25, 'wordOrder'),
] as const;

export const vocabularyLevelOneGames = [
  premium('vocabulary-colours', 'colour-quest', 'Colour Quest', 'Learn common colour words.', 'Vocabulary', 1, '🎨', 'Recognise and name ten common colours using accessible visual clues.', 25, 'visualMultipleChoice'),
  premium('vocabulary-animals', 'animal-friends', 'Animal Friends', 'Learn the names of common animals.', 'Vocabulary', 1, '🐘', 'Identify familiar animal names from clear visual and written clues.', 30, 'visualMultipleChoice'),
  premium('vocabulary-food', 'food-fun', 'Food Fun', 'Learn common food and drink words.', 'Vocabulary', 1, '🍎', 'Recognise everyday food and drink vocabulary.', 30, 'visualMultipleChoice'),
  premium('vocabulary-body', 'my-body', 'My Body', 'Learn common body-part words.', 'Vocabulary', 1, '👋', 'Identify and name common external body parts.', 25, 'visualMultipleChoice'),
  premium('vocabulary-school', 'in-my-school-bag', 'In My School Bag', 'Learn words for things children use at school.', 'Vocabulary', 1, '✏️', 'Recognise common classroom and school-supply vocabulary.', 25, 'visualMultipleChoice'),
  premium('vocabulary-family', 'my-family', 'My Family', 'Learn respectful words for family members.', 'Vocabulary', 1, '👪', 'Understand common family vocabulary without assuming one family structure.', 25, 'visualMultipleChoice'),
  premium('vocabulary-clothes', 'what-are-we-wearing', 'What Are We Wearing?', 'Learn words for common clothes.', 'Vocabulary', 1, '👕', 'Identify common clothing words using British English.', 25, 'visualMultipleChoice'),
  premium('vocabulary-home', 'at-home', 'At Home', 'Learn words for rooms and things in a home.', 'Vocabulary', 1, '🏠', 'Recognise common home, room, and furniture vocabulary.', 30, 'visualMultipleChoice'),
  premium('vocabulary-actions', 'action-time', 'Action Time!', 'Learn common action verbs.', 'Vocabulary', 1, '🏃', 'Match familiar actions with simple English verbs.', 30, 'visualMultipleChoice'),
  premium('vocabulary-opposites', 'opposite-match', 'Opposite Match', 'Practise simple opposite words.', 'Vocabulary', 1, '↔️', 'Recognise and pair common opposite adjectives and concepts.', 25, 'visualMultipleChoice'),
] as const;

export const academyGames: readonly AcademyGameSummary[] = [...grammarLevelTwoGames, ...vocabularyLevelOneGames];
