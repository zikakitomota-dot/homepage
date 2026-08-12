import type { GameDifficulty, GameQuestion } from './types';

type Article = 'a' | 'an';

function soundExplanation(article: Article, noun: string) {
  const sound = article === 'an' ? 'vowel' : 'consonant';
  return `We use “${article}” before the ${sound} sound at the beginning of “${noun}”.`;
}

function blank(id: string, difficulty: GameDifficulty, prompt: string, noun: string, answer: Article, illustration?: string, illustrationLabel?: string): GameQuestion {
  return { id, difficulty, prompt, choices: ['a', 'an'], correctAnswer: answer, explanation: soundExplanation(answer, noun), illustration, illustrationLabel };
}

function phrase(id: string, difficulty: GameDifficulty, noun: string, answer: Article, illustration?: string): GameQuestion {
  const correct = `${answer} ${noun}`;
  const incorrect = `${answer === 'a' ? 'an' : 'a'} ${noun}`;
  const questionNumber = Number(id.split('-').at(-1));
  const choices = questionNumber % 2 === 0 ? [incorrect, correct] : [correct, incorrect];
  return { id, difficulty, prompt: `Choose the correct phrase for ${noun}.`, choices, correctAnswer: correct, explanation: soundExplanation(answer, noun), illustration, illustrationLabel: illustration ? noun : undefined };
}

function sentence(id: string, difficulty: GameDifficulty, prompt: string, choices: readonly [string, string], correctAnswer: string, explanation: string): GameQuestion {
  return { id, difficulty, prompt, choices, correctAnswer, explanation };
}

function mistake(id: string, prompt: string, choices: readonly [string, string, string], correctAnswer: string, correction: string): GameQuestion {
  return { id, difficulty: 'challenge', prompt, choices, correctAnswer, explanation: `${correctAnswer} needs fixing. We say “${correction}”.` };
}

const easy: GameQuestion[] = [
  blank('article-easy-1', 'easy', 'I need ___ pencil.', 'pencil', 'a', '✏️', 'pencil'),
  blank('article-easy-2', 'easy', 'Mia ate ___ apple.', 'apple', 'an', '🍎', 'apple'),
  phrase('article-easy-3', 'easy', 'dog', 'a', '🐶'),
  phrase('article-easy-4', 'easy', 'egg', 'an', '🥚'),
  blank('article-easy-5', 'easy', 'Ben has ___ ball.', 'ball', 'a', '⚽', 'ball'),
  blank('article-easy-6', 'easy', 'She opened ___ umbrella.', 'umbrella', 'an', '☂️', 'umbrella'),
  blank('article-easy-7', 'easy', 'Dad baked ___ cake.', 'cake', 'a', '🎂', 'cake'),
  phrase('article-easy-8', 'easy', 'orange', 'an', '🍊'),
  blank('article-easy-9', 'easy', 'Tom found ___ coin.', 'coin', 'a', '🪙', 'coin'),
  blank('article-easy-10', 'easy', 'We saw ___ elephant.', 'elephant', 'an', '🐘', 'elephant'),
  phrase('article-easy-11', 'easy', 'book', 'a', '📘'),
  blank('article-easy-12', 'easy', 'Anya drew ___ octopus.', 'octopus', 'an', '🐙', 'octopus'),
  blank('article-easy-13', 'easy', 'Mum packed ___ sandwich.', 'sandwich', 'a', '🥪', 'sandwich'),
  phrase('article-easy-14', 'easy', 'ant', 'an', '🐜'),
  blank('article-easy-15', 'easy', 'Lily wears ___ hat.', 'hat', 'a', '🎩', 'hat'),
  blank('article-easy-16', 'easy', 'Can I have ___ ice cream cone?', 'ice cream cone', 'an', '🍦', 'ice cream cone'),
  phrase('article-easy-17', 'easy', 'rabbit', 'a', '🐰'),
  blank('article-easy-18', 'easy', 'Look! It is ___ airplane!', 'airplane', 'an', '✈️', 'airplane'),
  blank('article-easy-19', 'easy', 'We planted ___ tree.', 'tree', 'a', '🌳', 'tree'),
  phrase('article-easy-20', 'easy', 'insect', 'an', '🐞'),
  blank('article-easy-21', 'easy', 'Sam carried ___ chair.', 'chair', 'a', '🪑', 'chair'),
  blank('article-easy-22', 'easy', 'I heard ___ owl.', 'owl', 'an', '🦉', 'owl'),
  phrase('article-easy-23', 'easy', 'banana', 'a', '🍌'),
  blank('article-easy-24', 'easy', 'There is ___ fish in the pond.', 'fish', 'a', '🐟', 'fish'),
  phrase('article-easy-25', 'easy', 'apple', 'an', '🍎'),
];

const normal: GameQuestion[] = [
  blank('article-normal-1', 'normal', 'Mia wants ___ orange for her snack.', 'orange', 'an'),
  blank('article-normal-2', 'normal', 'There is ___ rabbit near the tree.', 'rabbit', 'a'),
  blank('article-normal-3', 'normal', 'Dad bought ___ umbrella because it was raining.', 'umbrella', 'an'),
  blank('article-normal-4', 'normal', 'My teacher has ___ computer.', 'computer', 'a'),
  blank('article-normal-5', 'normal', 'Sam has ___ idea for our picture.', 'idea', 'an'),
  phrase('article-normal-6', 'normal', 'octopus', 'an'),
  sentence('article-normal-7', 'normal', 'She found one coin. How should we write the sentence?', ['She found a coin.', 'She found an coin.'], 'She found a coin.', soundExplanation('a', 'coin')),
  blank('article-normal-8', 'normal', 'We saw ___ owl sitting in the tree.', 'owl', 'an'),
  blank('article-normal-9', 'normal', 'Ben found ___ old toy in the cupboard.', 'old toy', 'an'),
  blank('article-normal-10', 'normal', 'Mum made ___ warm drink.', 'warm drink', 'a'),
  phrase('article-normal-11', 'normal', 'school bag', 'a'),
  sentence('article-normal-12', 'normal', 'Choose the sentence that sounds right.', ['Lily drew a elephant.', 'Lily drew an elephant.'], 'Lily drew an elephant.', soundExplanation('an', 'elephant')),
  blank('article-normal-13', 'normal', 'At the park, Tom kicked ___ red ball.', 'red ball', 'a'),
  blank('article-normal-14', 'normal', 'We watched ___ airplane cross the sky.', 'airplane', 'an'),
  blank('article-normal-15', 'normal', 'Zara brought ___ new game to school.', 'new game', 'a'),
  phrase('article-normal-16', 'normal', 'avocado', 'an'),
  sentence('article-normal-17', 'normal', 'Choose the correct breakfast sentence.', ['I ate an egg for breakfast.', 'I ate a egg for breakfast.'], 'I ate an egg for breakfast.', soundExplanation('an', 'egg')),
  blank('article-normal-18', 'normal', 'The class made ___ paper kite.', 'paper kite', 'a'),
  blank('article-normal-19', 'normal', 'He saw ___ ant crawl across the floor.', 'ant', 'an'),
  blank('article-normal-20', 'normal', 'Grandad told us ___ funny story.', 'funny story', 'a'),
  phrase('article-normal-21', 'normal', 'ice cube', 'an'),
  sentence('article-normal-22', 'normal', 'Choose the better sentence.', ['We planted a small tree.', 'We planted an small tree.'], 'We planted a small tree.', soundExplanation('a', 'small tree')),
  blank('article-normal-23', 'normal', 'On the shelf is ___ empty box.', 'empty box', 'an'),
  blank('article-normal-24', 'normal', 'Nora carried ___ blue backpack.', 'blue backpack', 'a'),
  phrase('article-normal-25', 'normal', 'orange balloon', 'an'),
];

const challenge: GameQuestion[] = [
  sentence('article-challenge-1', 'challenge', 'Sam has a new plan. Which sentence says this correctly?', ['Sam has a idea.', 'Sam has an idea.'], 'Sam has an idea.', soundExplanation('an', 'idea')),
  mistake('article-challenge-2', 'A learner wrote three phrases. Which phrase needs fixing?', ['a pencil', 'an orange', 'a elephant'], 'a elephant', 'an elephant'),
  sentence('article-challenge-3', 'challenge', 'You see an owl in a tree. Choose the correctly written sentence.', ['I saw an owl in the tree.', 'I saw a owl in the tree.'], 'I saw an owl in the tree.', soundExplanation('an', 'owl')),
  sentence('article-challenge-4', 'challenge', 'Rain starts at the park. Which sentence is correct?', ['Mia opens a umbrella.', 'Mia opens an umbrella.'], 'Mia opens an umbrella.', soundExplanation('an', 'umbrella')),
  mistake('article-challenge-5', 'Spot the article mistake in this set.', ['an ant', 'a apple', 'a rabbit'], 'a apple', 'an apple'),
  sentence('article-challenge-6', 'challenge', 'Which sentence is written correctly?', ['Dad packed an sandwich.', 'Dad packed a sandwich.'], 'Dad packed a sandwich.', soundExplanation('a', 'sandwich')),
  blank('article-challenge-7', 'challenge', 'The bus arrives in ___ hour.', 'hour', 'an'),
  sentence('article-challenge-8', 'challenge', 'A story includes a unicorn. Choose the correct sentence.', ['The story has an unicorn.', 'The story has a unicorn.'], 'The story has a unicorn.', 'We use “a” before “unicorn” because it begins with a “y” consonant sound: yoo-ni-corn.'),
  mistake('article-challenge-9', 'Two clothing phrases are correct. Which one is not?', ['a blue coat', 'an empty bag', 'an red hat'], 'an red hat', 'a red hat'),
  sentence('article-challenge-10', 'challenge', 'Ben is hungry after school. What happens next?', ['He peels a orange.', 'He peels an orange.'], 'He peels an orange.', soundExplanation('an', 'orange')),
  sentence('article-challenge-11', 'challenge', 'A noise surprises us. Which sentence sounds right?', ['We heard a strange noise.', 'We heard an strange noise.'], 'We heard a strange noise.', soundExplanation('a', 'strange noise')),
  mistake('article-challenge-12', 'Check these animal phrases and find the mistake.', ['an insect', 'a octopus', 'a fish'], 'a octopus', 'an octopus'),
  sentence('article-challenge-13', 'challenge', 'Lily finds an old button. Which sentence is written correctly?', ['Lily found an old button.', 'Lily found a old button.'], 'Lily found an old button.', soundExplanation('an', 'old button')),
  sentence('article-challenge-14', 'challenge', 'Choose the correctly written sentence.', ['Tom carried a heavy box.', 'Tom carried an heavy box.'], 'Tom carried a heavy box.', soundExplanation('a', 'heavy box')),
  mistake('article-challenge-15', 'Which phrase has the wrong article?', ['a toy car', 'an ice cube', 'an banana'], 'an banana', 'a banana'),
  blank('article-challenge-16', 'challenge', 'At the zoo, we watched ___ animal eat leaves.', 'animal', 'an'),
  sentence('article-challenge-17', 'challenge', 'Which sentence is correct?', ['There is a tiny frog by the pond.', 'There is an tiny frog by the pond.'], 'There is a tiny frog by the pond.', soundExplanation('a', 'tiny frog')),
  mistake('article-challenge-18', 'Find the phrase that should use “an”.', ['an airplane', 'a egg', 'a kite'], 'a egg', 'an egg'),
  sentence('article-challenge-19', 'challenge', 'The classroom is untidy. Which sentence is correct?', ['There is an book on the floor.', 'There is a book on the floor.'], 'There is a book on the floor.', soundExplanation('a', 'book')),
  sentence('article-challenge-20', 'challenge', 'Choose the best sentence.', ['Nora drew an amazing picture.', 'Nora drew a amazing picture.'], 'Nora drew an amazing picture.', soundExplanation('an', 'amazing picture')),
  mistake('article-challenge-21', 'One of these phrases does not sound right. Which one?', ['a yellow star', 'an uncle', 'an little cat'], 'an little cat', 'a little cat'),
  sentence('article-challenge-22', 'challenge', 'Mum buys a new lamp. Which option is correct?', ['Mum bought a new lamp.', 'Mum bought an new lamp.'], 'Mum bought a new lamp.', soundExplanation('a', 'new lamp')),
  sentence('article-challenge-23', 'challenge', 'Zara looks inside the nest. What does she see?', ['She sees a egg.', 'She sees an egg.'], 'She sees an egg.', soundExplanation('an', 'egg')),
  mistake('article-challenge-24', 'A book phrase is incorrect. Can you find it?', ['an apple pie', 'a funny story', 'a interesting book'], 'a interesting book', 'an interesting book'),
  sentence('article-challenge-25', 'challenge', 'We made a very large snowball. Choose the sentence that sounds right.', ['We made an enormous snowball.', 'We made a enormous snowball.'], 'We made an enormous snowball.', soundExplanation('an', 'enormous snowball')),
];

export const articleGameQuestions = [...easy, ...normal, ...challenge];
