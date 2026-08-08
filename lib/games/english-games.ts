import type { EnglishGame, GameQuestion } from './types';

const q = (id: string, prompt: string, choices: readonly string[], correctAnswer: string, explanation: string, illustration?: string): GameQuestion =>
  ({ id, prompt, choices, correctAnswer, explanation, illustration });

const articleQuestions = [
  ['apple', 'an', '🍎'], ['banana', 'a', '🍌'], ['orange', 'an', '🍊'], ['cat', 'a', '🐱'], ['elephant', 'an', '🐘'],
  ['umbrella', 'an', '☂️'], ['dog', 'a', '🐶'], ['egg', 'an', '🥚'], ['igloo', 'an', '🏠'], ['robot', 'a', '🤖'],
  ['ant', 'an', '🐜'], ['kite', 'a', '🪁'], ['owl', 'an', '🦉'], ['fish', 'a', '🐟'], ['octopus', 'an', '🐙'],
  ['book', 'a', '📘'], ['insect', 'an', '🐞'], ['car', 'a', '🚗'], ['ice cream', 'an', '🍦'], ['rabbit', 'a', '🐰'],
  ['airplane', 'an', '✈️'], ['pencil', 'a', '✏️'], ['avocado', 'an', '🥑'], ['star', 'a', '⭐'], ['uncle', 'an', '👨'],
] as const;

const oneManyItems = [
  ['1 cat', 'one', '🐱'], ['2 cats', 'many', '🐱🐱'], ['1 apple', 'one', '🍎'], ['3 apples', 'many', '🍎🍎🍎'],
  ['1 book', 'one', '📘'], ['4 books', 'many', '📚'], ['1 star', 'one', '⭐'], ['5 stars', 'many', '⭐⭐⭐'],
  ['1 dog', 'one', '🐶'], ['2 dogs', 'many', '🐶🐶'], ['1 ball', 'one', '⚽'], ['3 balls', 'many', '⚽⚽⚽'],
  ['1 flower', 'one', '🌼'], ['4 flowers', 'many', '🌼🌼🌼'], ['1 pencil', 'one', '✏️'], ['2 pencils', 'many', '✏️✏️'],
  ['1 bird', 'one', '🐦'], ['3 birds', 'many', '🐦🐦🐦'], ['1 cup', 'one', '🥤'], ['5 cups', 'many', '🥤🥤🥤'],
] as const;

const heSheIt = [
  ['Tom is running.', 'he'], ['Sara is reading.', 'she'], ['The dog is sleeping.', 'it'], ['Adam is drawing.', 'he'],
  ['Maya is singing.', 'she'], ['The ball is red.', 'it'], ['Ben is eating lunch.', 'he'], ['Lina is riding a bicycle.', 'she'],
  ['The bird is in the tree.', 'it'], ['Omar is my brother.', 'he'], ['Aisha is my friend.', 'she'], ['The book is on the desk.', 'it'],
  ['Leo is swimming.', 'he'], ['Nora is smiling.', 'she'], ['The bus is yellow.', 'it'], ['Sam is kicking the ball.', 'he'],
  ['Mei is painting.', 'she'], ['The flower is pretty.', 'it'], ['Jack is wearing a hat.', 'he'], ['Priya is opening the door.', 'she'],
] as const;

const isAmAre = [
  ['I ___ happy.', 'am'], ['She ___ my friend.', 'is'], ['They ___ playing.', 'are'], ['He ___ seven years old.', 'is'],
  ['We ___ ready.', 'are'], ['The cat ___ sleepy.', 'is'], ['You ___ very kind.', 'are'], ['I ___ at school.', 'am'],
  ['The books ___ on the table.', 'are'], ['It ___ a sunny day.', 'is'], ['My parents ___ at home.', 'are'], ['I ___ hungry.', 'am'],
  ['Sara ___ reading.', 'is'], ['The children ___ laughing.', 'are'], ['You ___ my teammate.', 'are'], ['The apple ___ red.', 'is'],
  ['We ___ in the garden.', 'are'], ['I ___ excited.', 'am'], ['Tom and Ben ___ brothers.', 'are'], ['My bag ___ blue.', 'is'],
] as const;

const canCant = [
  ['A bird ___ fly.', 'can'], ['A fish ___ walk.', "can't"], ['A dog ___ bark.', 'can'], ['A car ___ eat lunch.', "can't"],
  ['A frog ___ jump.', 'can'], ['A baby ___ drive a bus.', "can't"], ['A duck ___ swim.', 'can'], ['A pencil ___ talk.', "can't"],
  ['A monkey ___ climb.', 'can'], ['A chair ___ run.', "can't"], ['A bee ___ buzz.', 'can'], ['A stone ___ sing.', "can't"],
  ['A horse ___ run.', 'can'], ['A book ___ drink water.', "can't"], ['A child ___ learn.', 'can'], ['A tree ___ ride a bicycle.', "can't"],
  ['A cat ___ see in dim light.', 'can'], ['A spoon ___ dance.', "can't"], ['A kangaroo ___ hop.', 'can'], ['A shoe ___ read.', "can't"],
] as const;

const whoIsIt = [
  ['___ am holding a pencil.', 'I'], ['The teacher is talking to Sam: “___ are helpful.”', 'you'], ['Tom is my brother. ___ is kind.', 'he'],
  ['Mina is reading. ___ likes books.', 'she'], ['The robot is new. ___ can move.', 'it'], ['Sara and I are playing. ___ are a team.', 'we'],
  ['Tom and Ali are friends. ___ play together.', 'they'], ['I am seven. ___ like drawing.', 'I'], ['Mum says to me: “___ are ready.”', 'you'],
  ['Ben has a kite. ___ flies it.', 'he'], ['Ava has a red bag. ___ carries it.', 'she'], ['The bus is here. ___ is yellow.', 'it'],
  ['My sister and I cook. ___ help Dad.', 'we'], ['The cats are sleeping. ___ are quiet.', 'they'], ['I have a ball. ___ can throw it.', 'I'],
  ['Dad asks Sam: “Can ___ help me?”', 'you'], ['Leo is swimming. ___ is fast.', 'he'], ['Nora is smiling. ___ is happy.', 'she'],
  ['The apple fell. ___ is on the floor.', 'it'], ['My friends and I read. ___ love stories.', 'we'], ['The children are outside. ___ are running.', 'they'],
  ['I am at school. ___ have my lunch.', 'I'], ['The coach tells us: “___ played well.”', 'you'], ['Omar is drawing. ___ has a blue pencil.', 'he'],
  ['The birds are singing. ___ are in the tree.', 'they'],
] as const;

const whoseIsIt = [
  ['This pencil belongs to me. It is ___ pencil.', 'my'], ['This book belongs to you. It is ___ book.', 'your'],
  ['This cap belongs to Tom. It is ___ cap.', 'his'], ['This bag belongs to Sarah. It is ___ bag.', 'her'],
  ['The house belongs to my family and me. It is ___ house.', 'our'], ['The bicycles belong to the children. They are ___ bicycles.', 'their'],
  ['I have a lunch box. This is ___ lunch box.', 'my'], ['You have a blue coat. This is ___ coat.', 'your'],
  ['Ben owns the toy car. It is ___ toy car.', 'his'], ['Maya owns the doll. It is ___ doll.', 'her'],
  ['We share this classroom. It is ___ classroom.', 'our'], ['The dogs have bowls. Those are ___ bowls.', 'their'],
  ['I drew this picture. It is ___ picture.', 'my'], ['You packed this snack. It is ___ snack.', 'your'],
  ['Dad has a phone. It is ___ phone.', 'his'], ['Mum has a scarf. It is ___ scarf.', 'her'],
  ['My team and I have a ball. It is ___ ball.', 'our'], ['The birds built a nest. It is ___ nest.', 'their'],
  ['I wear these shoes. They are ___ shoes.', 'my'], ['Lina has a bicycle. It is ___ bicycle.', 'her'],
] as const;

const whereIsIt = [
  ['The apple is ___ the bowl.', 'in'], ['The book is resting ___ the table.', 'on'], ['The shoes are ___ the bed.', 'under'],
  ['The child is hiding ___ the curtain.', 'behind'], ['The teacher is standing ___ the class.', 'in front of'], ['The lamp is ___ the sofa.', 'next to'],
  ['The fish is ___ the water.', 'in'], ['The cup is ___ the tray.', 'on'], ['The ball rolled ___ the chair.', 'under'],
  ['The moon is ___ the cloud.', 'behind'], ['The bus is waiting ___ the school.', 'in front of'], ['The pencil is ___ the notebook.', 'next to'],
  ['The toys are ___ the box.', 'in'], ['The picture hangs ___ the wall.', 'on'], ['The cat sleeps ___ the blanket.', 'under'],
  ['The garden is ___ the house.', 'behind'], ['The speaker stands ___ the audience.', 'in front of'], ['The tree is ___ the playground.', 'next to'],
  ['The milk is ___ the fridge.', 'in'], ['The hat is ___ his head.', 'on'],
] as const;

const demonstratives = [
  ['[near] ___ pencil is sharp.', 'this'], ['[far] ___ kite is high.', 'that'], ['[near] ___ apples are fresh.', 'these'], ['[far] ___ stars are bright.', 'those'],
  ['[near] ___ book is mine.', 'this'], ['[far] ___ tree is tall.', 'that'], ['[near] ___ shoes are clean.', 'these'], ['[far] ___ mountains are blue.', 'those'],
  ['[near] ___ flower smells lovely.', 'this'], ['[far] ___ bus is late.', 'that'], ['[near] ___ cookies are warm.', 'these'], ['[far] ___ birds are flying.', 'those'],
  ['[near] ___ toy is new.', 'this'], ['[far] ___ house has a red roof.', 'that'], ['[near] ___ crayons are colourful.', 'these'], ['[far] ___ boats are small.', 'those'],
  ['[near] ___ cup is full.', 'this'], ['[far] ___ cloud looks dark.', 'that'], ['[near] ___ socks are soft.', 'these'], ['[far] ___ children are waving.', 'those'],
] as const;

const hasHave = [
  ['She ___ a red bag.', 'has'], ['They ___ two cats.', 'have'], ['I ___ a pencil.', 'have'], ['He ___ a blue bicycle.', 'has'],
  ['We ___ a new teacher.', 'have'], ['The dog ___ a long tail.', 'has'], ['You ___ a lovely smile.', 'have'], ['Maya ___ a storybook.', 'has'],
  ['Tom and Ben ___ football practice.', 'have'], ['My school ___ a library.', 'has'], ['I ___ an orange.', 'have'], ['The children ___ clean hands.', 'have'],
  ['Dad ___ a green car.', 'has'], ['Our classroom ___ twenty chairs.', 'has'], ['You ___ good ideas.', 'have'], ['The bird ___ two wings.', 'has'],
  ['We ___ lunch at noon.', 'have'], ['Sara ___ a little brother.', 'has'], ['The trees ___ green leaves.', 'have'], ['It ___ four legs.', 'has'],
] as const;

const fixed = (prefix: string, rows: readonly (readonly [string, string])[], choices: readonly string[], explanation: (answer: string, prompt: string) => string) =>
  rows.map(([prompt, answer], index) => q(`${prefix}-${index + 1}`, prompt, choices, answer, explanation(answer, prompt)));

const games: EnglishGame[] = [
  {
    id: 'grammar-a-or-an', slug: 'a-or-an', title: 'A or An?', shortDescription: 'Choose the correct article before a noun.',
    seoDescription: 'Practise using “a” and “an” with this free interactive English grammar game for children. Play 10 fun questions on any device.',
    category: 'Grammar', level: 1, access: 'free', icon: '🍎', instructions: 'Choose “a” or “an” to complete each phrase.',
    whatItTeaches: 'Children practise choosing the indefinite articles “a” and “an” by listening to the beginning sound of a familiar noun. The question bank uses simple objects, animals, foods, and people suitable for early primary learners.',
    learningObjective: 'By the end of a session, learners should recognise that “a” comes before a consonant sound and “an” comes before a vowel sound. Each answer includes a short reminder so mistakes become useful practice.',
    parentTip: 'Say each phrase aloud together. Stretch the first sound of the noun and ask whether it begins with a vowel sound. Focus on sound rather than asking children to memorise a list.',
    questions: articleQuestions.map(([noun, answer, icon], i) => q(`article-${i + 1}`, `___ ${noun}`, ['a', 'an'], answer, `Use “${answer}” before “${noun}” because it begins with a ${answer === 'an' ? 'vowel' : 'consonant'} sound.`, icon)),
  },
  {
    id: 'grammar-one-many', slug: 'one-or-many', title: 'One or Many?', shortDescription: 'Practise singular and plural nouns.',
    seoDescription: 'Help children practise singular and plural nouns with a free One or Many English grammar game containing 10 random questions.',
    category: 'Grammar', level: 1, access: 'free', icon: '🐱', instructions: 'Look at the number and noun, then choose “one” or “many”.',
    whatItTeaches: 'This game connects number clues with singular and regular plural nouns. Children see familiar examples such as one cat and two cats, helping them notice when a noun describes one thing or more than one.',
    learningObjective: 'Learners practise identifying one object as singular and two or more objects as plural. The examples reinforce the common Level 1 pattern of adding “s” to regular plural nouns.',
    parentTip: 'After each question, invite the child to say the phrase aloud. You can point to one nearby object and then a group of objects to make the idea concrete.',
    questions: oneManyItems.map(([item, answer, icon], i) => q(`number-${i + 1}`, `${item}: is this one or many?`, ['one', 'many'], answer, `${item} means ${answer} because the number shows ${answer === 'one' ? 'a single thing' : 'more than one thing'}.`, icon)),
  },
  {
    id: 'grammar-he-she-it', slug: 'he-she-it', title: 'He, She, It', shortDescription: 'Choose the correct personal pronoun.',
    seoDescription: 'Practise he, she, and it with a free mobile-friendly English pronoun game for children ages 5–8.',
    category: 'Grammar', level: 1, access: 'free', icon: '👧', instructions: 'Read the sentence and choose “he”, “she”, or “it”.',
    whatItTeaches: 'Children replace a simple person, animal, object, or place with the matching pronoun. Names and contexts are kept clear so every question has one expected Level 1 answer.',
    learningObjective: 'Learners identify “he” for a boy or man, “she” for a girl or woman, and “it” for an animal or object when no personal gender is given.',
    parentTip: 'Ask the child to repeat the sentence using the answer. Hearing the full sentence helps the pronoun sound natural and strengthens speaking as well as recognition.',
    questions: fixed('pronoun', heSheIt, ['he', 'she', 'it'], (a) => `“${a[0].toUpperCase() + a.slice(1)}” is the pronoun that replaces the person or thing in this sentence.`),
  },
  {
    id: 'grammar-is-am-are', slug: 'is-am-are', title: 'Is, Am, Are', shortDescription: 'Practise the verb “to be”.',
    seoDescription: 'Play a free Is, Am, Are grammar game for kids and practise the verb “to be” in simple English sentences.',
    category: 'Grammar', level: 1, access: 'free', icon: '💬', instructions: 'Choose “is”, “am”, or “are” to complete the sentence.',
    whatItTeaches: 'This game gives children repeated practice with the present forms of the verb “to be”. Sentences use common pronouns and simple nouns from everyday life.',
    learningObjective: 'Learners connect “am” with I, “is” with one person or thing, and “are” with you, we, they, or more than one subject.',
    parentTip: 'Read the completed sentence aloud. If a child is unsure, first identify the subject and then recall which verb usually follows it.',
    questions: fixed('be', isAmAre, ['is', 'am', 'are'], (a, p) => `The correct sentence is “${p.replace('___', a)}”`),
  },
  {
    id: 'grammar-can-cant', slug: 'can-or-cant', title: "Can or Can't?", shortDescription: 'Learn how to talk about ability.',
    seoDescription: 'Practise can and can’t with a free interactive English ability game using clear, child-friendly facts.',
    category: 'Grammar', level: 1, access: 'free', icon: '🐦', instructions: 'Decide whether the subject can or cannot do the action.',
    whatItTeaches: 'Children use “can” for an ability and “can’t” when an action is not possible. Every statement uses an obvious fact to avoid confusing or debatable answers.',
    learningObjective: 'Learners understand the positive and negative forms used to describe ability, then read each completed sentence as a meaningful statement.',
    parentTip: 'Turn this into a speaking activity by asking, “What can you do?” Invite the child to answer with one “I can” sentence and one playful “I can’t” sentence.',
    questions: fixed('ability', canCant, ['can', "can't"], (a, p) => `${p.replace('___', a)} This is a clear example of what the subject ${a === 'can' ? 'is able' : 'is not able'} to do.`),
  },
  {
    id: 'grammar-who', slug: 'who-is-it', title: 'Who Is It?', shortDescription: 'Practise I, you, he, she, it, we, and they.',
    seoDescription: 'Practise English personal pronouns with a free Who Is It game for early primary children.',
    category: 'Grammar', level: 1, access: 'free', icon: '👥', instructions: 'Choose the pronoun that best replaces the person or group.',
    whatItTeaches: 'This game expands pronoun practice to I, you, he, she, it, we, and they. Short contexts show whether the speaker means themselves, the listener, one person, one thing, or a group.',
    learningObjective: 'Learners choose personal pronouns based on who is speaking and how many people or things are being discussed.',
    parentTip: 'Use gestures while reading: point to yourself for “I”, to the learner for “you”, and to both of you for “we”. Physical cues make the pronouns easier to remember.',
    questions: fixed('who', whoIsIt, ['I', 'you', 'he', 'she', 'it', 'we', 'they'], (a, p) => `“${a}” completes the idea: ${p.replace('___', a)}`),
  },
  {
    id: 'grammar-whose', slug: 'whose-is-it', title: 'Whose Is It?', shortDescription: 'Practise my, your, his, her, our, and their.',
    seoDescription: 'Practise possessive words with a free Whose Is It English grammar game for children.',
    category: 'Grammar', level: 1, access: 'free', icon: '🎒', instructions: 'Read who owns the object, then choose the correct possessive word.',
    whatItTeaches: 'Children connect an owner with the possessive words my, your, his, her, our, and their. Each sentence states ownership clearly before asking for the missing word.',
    learningObjective: 'Learners select a possessive determiner that agrees with the owner and understand that it comes before the name of an object.',
    parentTip: 'Use real objects and take turns saying “my pencil”, “your book”, or “our table”. Keeping the noun after the possessive word helps children learn the full pattern.',
    questions: fixed('whose', whoseIsIt, ['my', 'your', 'his', 'her', 'our', 'their'], (a, p) => `“${a}” shows who owns it: ${p.replace('___', a)}`),
  },
  {
    id: 'grammar-where', slug: 'where-is-it', title: 'Where Is It?', shortDescription: 'Practise in, on, under, behind, in front of, and next to.',
    seoDescription: 'Practise simple English prepositions with a free Where Is It grammar game for kids.',
    category: 'Grammar', level: 1, access: 'free', icon: '📦', instructions: 'Choose the position word that makes the sentence correct.',
    whatItTeaches: 'This game practises six useful position words through sentences whose physical relationships are clear from the action or location described.',
    learningObjective: 'Learners distinguish in, on, under, behind, in front of, and next to, then use each phrase naturally within a full sentence.',
    parentTip: 'Move a toy around a box and ask where it is. Let the child place it in a new position and describe that position back to you.',
    questions: fixed('where', whereIsIt, ['in', 'on', 'under', 'behind', 'in front of', 'next to'], (a, p) => `The correct position is “${a}”: ${p.replace('___', a)}`),
  },
  {
    id: 'grammar-demonstratives', slug: 'this-that-these-those', title: 'This, That, These or Those?', shortDescription: 'Practise demonstrative words.',
    seoDescription: 'Practise this, that, these, and those with a free interactive English game for children.',
    category: 'Grammar', level: 1, access: 'free', icon: '👉', instructions: 'Use the near or far clue and the number of objects to choose the answer.',
    whatItTeaches: 'Children combine two clues: whether an object is near or far and whether there is one object or more than one. Clear text labels keep the task understandable without relying on an image.',
    learningObjective: 'Learners use this for one nearby thing, that for one far thing, these for several nearby things, and those for several far things.',
    parentTip: 'Point to one nearby object and one far object, then repeat with groups. Ask the child to make a short phrase such as “this cup” or “those trees”.',
    questions: fixed('demonstrative', demonstratives, ['this', 'that', 'these', 'those'], (a, p) => `“${a}” matches the distance and number clue: ${p.replace('___', a)}`),
  },
  {
    id: 'grammar-has-have', slug: 'has-or-have', title: 'Has or Have?', shortDescription: 'Choose the correct form of “have”.',
    seoDescription: 'Practise has and have in simple sentences with a free English grammar game for kids.',
    category: 'Grammar', level: 1, access: 'free', icon: '✏️', instructions: 'Choose “has” or “have” to complete each sentence.',
    whatItTeaches: 'Children practise two present forms of “have” in short, familiar sentences about possessions, people, animals, and places.',
    learningObjective: 'Learners use “has” with he, she, it, or one subject, and “have” with I, you, we, they, or plural subjects.',
    parentTip: 'Ask the child to identify the subject first. Then say the full sentence aloud so the correct verb form becomes a familiar pattern.',
    questions: fixed('have', hasHave, ['has', 'have'], (a, p) => `The correct sentence is “${p.replace('___', a)}”`),
  },
];

for (const game of games) {
  if (game.questions.length < 20) throw new Error(`${game.slug} needs at least 20 questions.`);
  if (new Set(game.questions.map(({ id }) => id)).size !== game.questions.length) throw new Error(`${game.slug} has duplicate question IDs.`);
  if (new Set(game.questions.map(({ prompt }) => prompt)).size !== game.questions.length) throw new Error(`${game.slug} has duplicate prompts.`);
  if (game.questions.some(({ choices, correctAnswer }) => !choices.includes(correctAnswer))) throw new Error(`${game.slug} has an answer missing from its choices.`);
}

export const englishGames = games;
export const getEnglishGame = (slug: string) => englishGames.find((game) => game.slug === slug);
