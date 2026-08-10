import 'server-only';

import { grammarLevelTwoGames } from '../academy-games';
import type { AcademyGameSummary } from '../types';
import { buildPremiumGame, type QuestionSeed } from './question-helpers.server';

const summary = (slug: string) => grammarLevelTwoGames.find((game) => game.slug === slug) as AcademyGameSummary;
const seed = (prompt: string, choices: readonly string[], answer: string, explanation: string): QuestionSeed => ({ prompt, choices, answer, explanation });

const wasWereEasy = [
  ['I', 'was', 'happy yesterday'], ['She', 'was', 'at home'], ['He', 'was', 'seven last year'], ['The cat', 'was', 'sleepy'], ['It', 'was', 'sunny'],
  ['We', 'were', 'ready'], ['You', 'were', 'very kind'], ['They', 'were', 'in the garden'], ['The books', 'were', 'on the desk'], ['My parents', 'were', 'busy'],
  ['Mia', 'was', 'at school'], ['The children', 'were', 'excited'], ['Our bus', 'was', 'late'], ['Tom and Ali', 'were', 'friends'], ['My shoes', 'were', 'wet'],
] as const;
const wasWereNormal = [
  ['Tom and Mia', 'were', 'at school yesterday'], ['My little brother', 'was', 'tired after lunch'], ['The birds', 'were', 'in the tree this morning'], ['Our classroom', 'was', 'quiet after the bell'], ['You and I', 'were', 'on the same team'],
  ['The soup', 'was', 'hot at dinner'], ['Those pencils', 'were', 'under the chair'], ['Aisha', 'was', 'happy with her picture'], ['The football players', 'were', 'muddy after the match'], ['My favourite toy', 'was', 'in the box'],
  ['Sam and his sister', 'were', 'at the library'], ['The windows', 'were', 'open yesterday'], ['Our teacher', 'was', 'proud of the class'], ['I', 'was', 'hungry after swimming'], ['The puppies', 'were', 'very playful'],
] as const;
const wasWereChallenge = wasWereNormal.map(([subject, answer, ending]) => {
  const wrong = answer === 'was' ? 'were' : 'was';
  const correct = `${subject} ${answer} ${ending}.`;
  return seed(`Choose the correct sentence about the past.`, [`${subject} ${wrong} ${ending}.`, correct, `${subject} is ${ending}.`], correct, `Use “${answer}” with “${subject}” when talking about the past.`);
});

const subjectVerb = [
  ['I', 'do', 'like apples'], ['you', 'do', 'play chess'], ['we', 'do', 'need our coats'], ['they', 'do', 'walk to school'], ['she', 'does', 'read every night'],
  ['he', 'does', 'ride a bicycle'], ['it', 'does', 'make a sound'], ['Mia', 'does', 'help at home'], ['your friends', 'do', 'play football'], ['the dog', 'does', 'sleep here'],
  ['Tom and Ali', 'do', 'share a desk'], ['your sister', 'does', 'draw animals'], ['the children', 'do', 'know the song'], ['our teacher', 'does', 'use this book'], ['Sam', 'does', 'bring lunch'],
] as const;
const doDoes = (difficulty: 'easy' | 'normal') => subjectVerb.map(([subject, answer, rest]) => seed(`___ ${subject} ${rest}?`, ['do', 'does'], answer, `Use “${answer}” with “${subject}”. The main verb stays in its base form.`));
const doDoesChallenge = subjectVerb.map(([subject, answer, rest]) => {
  const capital = answer === 'do' ? 'Do' : 'Does';
  const wrong = answer === 'do' ? 'Does' : 'Do';
  const correct = `${capital} ${subject} ${rest}?`;
  return seed('Choose the correct full question.', [correct, `${wrong} ${subject} ${rest}?`, `${capital} ${subject} ${rest}s?`], correct, `“${capital}” agrees with the subject, and the next verb remains in its base form.`);
});

const negativeRows = [
  ['I', "don't", 'like cold tea'], ['you', "don't", 'need a ticket'], ['we', "don't", 'walk in the road'], ['they', "don't", 'play indoors'], ['he', "doesn't", 'like carrots'],
  ['she', "doesn't", 'ride the bus'], ['it', "doesn't", 'open easily'], ['Mia', "doesn't", 'eat fish'], ['my friends', "don't", 'live nearby'], ['the cat', "doesn't", 'sleep outside'],
  ['Tom and Ali', "don't", 'share a room'], ['my brother', "doesn't", 'watch that show'], ['the children', "don't", 'wear boots today'], ['our clock', "doesn't", 'work now'], ['Sam', "doesn't", 'bring lunch on Fridays'],
] as const;
const negative = (longer: boolean) => negativeRows.map(([subject, answer, rest]) => seed(`${subject[0].toUpperCase()}${subject.slice(1)} ___ ${rest}${longer ? ' on school days' : ''}.`, ["don't", "doesn't"], answer, `Use “${answer}” with “${subject}”. The verb after it stays in the base form.`));
const negativeChallenge = negativeRows.map(([subject, answer, rest]) => {
  const correct = `${subject[0].toUpperCase()}${subject.slice(1)} ${answer} ${rest}.`;
  const other = answer === "don't" ? "doesn't" : "don't";
  return seed('Choose the correct negative sentence.', [correct, `${subject} ${other} ${rest}.`, `${subject} ${answer} ${rest}s.`], correct, `“${answer}” matches the subject and is followed by the base verb.`);
});

const presentRows = [
  ['She', 'runs', 'run', 'every morning'], ['He', 'plays', 'play', 'football'], ['Tom', 'reads', 'read', 'after school'], ['Mia', 'helps', 'help', 'her dad'], ['The dog', 'jumps', 'jump', 'over the log'],
  ['My sister', 'watches', 'watch', 'a cartoon'], ['Sam', 'goes', 'go', 'to school'], ['The bus', 'passes', 'pass', 'our house'], ['A bee', 'buzzes', 'buzz', 'near the flower'], ['Dad', 'washes', 'wash', 'the cups'],
  ['The baby', 'cries', 'cry', 'when hungry'], ['Ali', 'carries', 'carry', 'his bag'], ['My teacher', 'teaches', 'teach', 'English'], ['The bird', 'flies', 'fly', 'over the tree'], ['Nora', 'tidies', 'tidy', 'her desk'],
] as const;
const addS = (longer: boolean) => presentRows.map(([subject, answer, base, ending]) => seed(`${subject} ___ ${ending}${longer ? ' before breakfast' : ''}.`, [base, answer], answer, `With one person or thing, “${base}” changes to “${answer}”.`));
const addSChallenge = presentRows.map(([subject, answer, base, ending]) => {
  const correct = `${subject} ${answer} ${ending}.`;
  return seed('Choose the correct simple-present sentence.', [correct, `${subject} ${base} ${ending}.`, `${subject} is ${answer} ${ending}.`], correct, `“${subject}” is singular, so the verb is “${answer}”.`);
});

const pastRows = [
  ['walk', 'walked', 'to the park'], ['play', 'played', 'in the garden'], ['jump', 'jumped', 'over a puddle'], ['help', 'helped', 'my teacher'], ['wash', 'washed', 'the cup'],
  ['look', 'looked', 'at the map'], ['open', 'opened', 'the box'], ['paint', 'painted', 'a star'], ['visit', 'visited', 'Grandma'], ['clean', 'cleaned', 'the table'],
  ['go', 'went', 'to the library'], ['eat', 'ate', 'an apple'], ['see', 'saw', 'a rainbow'], ['have', 'had', 'a picnic'], ['kick', 'kicked', 'the ball'],
] as const;
const pastEasy = pastRows.map(([base, past]) => seed(`What is the past form of “${base}”?`, [base, past], past, `“${past}” tells us the action happened in the past.`));
const pastNormal = pastRows.map(([base, past, ending]) => seed(`Yesterday, Mia ___ ${ending}.`, [base, past], past, `“Yesterday” tells us to use the past form “${past}”.`));
const pastChallenge = pastRows.map(([base, past, ending]) => {
  const correct = `Yesterday, we ${past} ${ending}.`;
  return seed('Choose the correct sentence.', [correct, `Yesterday, we ${base} ${ending}.`, `Yesterday, we are ${past} ${ending}.`], correct, `The past form of “${base}” is “${past}”.`);
});

export const firstFiveGrammarGames = [
  buildPremiumGame(summary('was-or-were'), { easy: wasWereEasy.map(([s,a,e]) => seed(`${s} ___ ${e}.`, ['was','were'], a, `Use “${a}” with “${s}” for the past.`)), normal: wasWereNormal.map(([s,a,e]) => seed(`${s} ___ ${e}.`, ['was','were'], a, `Use “${a}” because the subject is ${a === 'was' ? 'singular' : 'plural or “you”'}.`)), challenge: wasWereChallenge }, { instructions: 'Choose was or were to complete each past-tense sentence.', whatItTeaches: 'Past forms of the verb “to be” with singular and plural subjects.', parentTip: 'Ask whether the subject means one or more than one before choosing.' }),
  buildPremiumGame(summary('do-or-does'), { easy: doDoes('easy'), normal: doDoes('normal').map((q,i) => ({...q,prompt:`At school, ${q.prompt.toLowerCase()}`})), challenge: doDoesChallenge }, { instructions: 'Choose do or does to make a correct question.', whatItTeaches: 'Subject agreement in simple-present questions while keeping the main verb in its base form.', parentTip: 'Say the subject first: he, she and it use does; I, you, we and they use do.' }),
  buildPremiumGame(summary('dont-or-doesnt'), { easy: negative(false), normal: negative(true), challenge: negativeChallenge }, { instructions: "Choose don't or doesn't to complete each negative sentence.", whatItTeaches: 'Simple-present negative sentences and base verbs.', parentTip: "Listen for a singular subject before choosing doesn't." }),
  buildPremiumGame(summary('add-s-or-not'), { easy: addS(false), normal: addS(true), challenge: addSChallenge }, { instructions: 'Choose the verb form that agrees with the subject.', whatItTeaches: 'Third-person singular verb endings including -s, -es and -ies.', parentTip: 'Point to the one person or thing doing the action, then check the verb ending.' }),
  buildPremiumGame(summary('yesterday-actions'), { easy: pastEasy, normal: pastNormal, challenge: pastChallenge }, { instructions: 'Choose the verb that shows an action happened in the past.', whatItTeaches: 'Common regular past forms and a small set of useful irregular past verbs.', parentTip: 'Use the word yesterday as a clue that the action is finished.' }),
];

const ownershipRows = [
  ['Sam','bag'], ['Mia','pencil'], ['Tom','kite'], ['Ava','book'], ['Ben','hat'], ['Nora','lunchbox'], ['Ali','bicycle'], ['Sara','coat'], ['Leo','ball'], ['Mei','picture'], ['Omar','ruler'], ['Lina','scarf'], ['Jack','robot'], ['Priya','notebook'], ['Adam','umbrella'],
] as const;
const possessiveEasy = ownershipRows.map(([name, object]) => seed(`The ${object} belongs to ${name}. Choose the owner word.`, [name, `${name}'s`, `${name}s`], `${name}'s`, `Add apostrophe-s to show that the ${object} belongs to ${name}.`));
const possessiveNormal = ownershipRows.map(([name, object]) => seed(`This is ${name}'s ${object}. Whose ${object} is it?`, [`${name}'s`, 'The teacher’s', 'A friend’s'], `${name}'s`, `“${name}'s” means the ${object} belongs to ${name}.`));
const possessiveChallenge = ownershipRows.map(([name, object], index) => {
  const place = ['desk','shelf','chair'][index % 3];
  const correct = `${name}'s ${object} is on the ${place}.`;
  return seed('Choose the sentence that clearly shows ownership.', [correct, `${name}s ${object} is on the ${place}.`, `${name} ${object}'s is on the ${place}.`], correct, `The apostrophe-s after ${name} shows who owns the ${object}.`);
});

const questionRows = [
  ['Who','your teacher','asks about a person'], ['What','your favourite game','asks about a thing'], ['Where','you live','asks about a place'], ['When','your birthday is','asks about a time'], ['Who','is knocking at the door','asks about a person'],
  ['What','is inside the box','asks about a thing'], ['Where','the library is','asks about a place'], ['When','school starts','asks about a time'], ['Who','made this cake','asks about a person'], ['What','you are drawing','asks about a thing'],
  ['Where','we should meet','asks about a place'], ['When','the bus arrives','asks about a time'], ['Who','can help me','asks about a person'], ['What','the word means','asks about information'], ['Where','my shoes are','asks about a place'],
] as const;
const questionSeeds = (context: boolean) => questionRows.map(([answer, rest, reason]) => seed(`${context ? 'Think about the missing information. ' : ''}___ ${rest}?`, ['Who','What','Where','When'], answer, `Use “${answer}” because the question ${reason}.`));
const questionChallenge = questionRows.map(([answer, rest, reason], index) => {
  const extra = index % 3 === 0 ? ` The answer will be ${answer === 'Who' ? "a person's name" : answer === 'Where' ? 'a place' : answer === 'When' ? 'a time' : 'some information'}.` : '';
  return seed(`Choose the best question word.${extra} ___ ${rest}?`, ['Who','What','Where','When','Why'], answer, `“${answer}” is best because it ${reason}.`);
});

const conjunctionRows = [
  ['I like apples','bananas','and','adds another thing'], ['Mia can read','write','and','joins two similar skills'], ['We sang','danced','and','adds another action'], ['Tom has a pencil','a ruler','and','joins two items'], ['The cat is small','playful','and','adds a similar idea'],
  ['I wanted to play outside','it was raining','but','shows a contrast'], ['The bag is old','it is strong','but','shows a contrast'], ['Sam was tired','he finished the game','but','shows an unexpected contrast'], ['I ate the soup slowly','it was hot','because','gives a reason'], ['We went home','it was late','because','gives a reason'],
  ['I wore my coat','it was cold','because','gives a reason'], ['We drank water','we were thirsty','because','gives a reason'], ['Ali smiled','he found his book','because','gives a reason'], ['The plants grew','we watered them','because','gives a reason'], ['She used an umbrella','it was raining','because','gives a reason'],
] as const;
const conjunctionChoices = ['and','but','because'] as const;
const conjunction = (longer: boolean) => conjunctionRows.map(([first,second,answer,reason]) => seed(`${first} ___ ${second}${longer ? ' after school' : ''}.`, conjunctionChoices, answer, `“${answer}” ${reason}.`));
const conjunctionChallenge = conjunctionRows.map(([first,second,answer,reason]) => {
  const correct = `${first} ${answer} ${second}.`;
  return seed('Choose the sentence with the best joining word.', conjunctionChoices.filter((word) => word !== answer).slice(0,2).map((word) => `${first} ${word} ${second}.`).concat(correct).sort(), correct, `“${answer}” ${reason}, so it makes the meaning clear.`);
});

const timeRows = [
  ['Monday','on','a day'], ['Friday','on','a day'], ['my birthday','on','a particular day'], ['7 o’clock','at','an exact time'], ['noon','at','an exact time'], ['night','at','the familiar phrase “at night”'],
  ['July','in','a month'], ['December','in','a month'], ['the morning','in','a part of the day'], ['the afternoon','in','a part of the day'], ['2026','in','a year'], ['summer','in','a season'],
  ['Tuesday morning','on','a particular day'], ['8:30','at','an exact time'], ['the evening','in','a part of the day'],
] as const;
const timeSeeds = (context: boolean) => timeRows.map(([time,answer,reason]) => seed(`${context ? 'Our activity happens ' : 'The activity is '}___ ${time}.`, ['in','on','at'], answer, `Use “${answer}” with ${reason}.`));
const timeChallenge = timeRows.map(([time,answer,reason]) => {
  const correct = `We will meet ${answer} ${time}.`;
  return seed('Choose the sentence with the correct time word.', ['in','on','at'].map((word) => `We will meet ${word} ${time}.`), correct, `Use “${answer}” with ${reason}.`);
});

const sentenceSets = {
  easy: ['Mia likes apples','Tom reads books','Birds can fly','We play outside','I drink water','Sam kicks balls','Cats chase mice','Dad cooks rice','Mum reads stories','Ben has lunch','Dogs like walks','She draws stars','He rides bikes','They sing songs','You look happy'],
  normal: ['They are playing outside','Mia reads a book daily','We walk to school','The cat sleeps upstairs','My friend likes green apples','Sam is wearing a hat','Birds are singing today','Dad cooks dinner at home','The children share their toys','I can swim very well','Our teacher reads funny stories','Tom and Ali play chess','She drinks water after running','The bus arrives at eight','My sister paints bright flowers'],
  challenge: ['My brother walks to school every day','The small rabbit jumps over the log','We are reading a story in class','Mia carefully carries her lunch to school','Our friends play football after the lesson','The happy children sing on the stage','Dad makes warm soup for our family','I put my blue book on the shelf','The puppy sleeps beside the old chair','Sam and Ali visit the library together','My teacher writes new words on the board','We wear our coats because it is cold','The little bird builds a nest in spring','You can finish this puzzle with patience','Our class cleans the room after lunch'],
} as const;
const scramble = (sentence: string, index: number) => {
  const words = sentence.split(' ');
  const shift = (index % (words.length - 1)) + 1;
  return [...words.slice(shift), ...words.slice(0, shift)];
};
const sentenceQuestions = (difficulty: keyof typeof sentenceSets) => sentenceSets[difficulty].map((answer,index) => seed('Tap the words in the correct order to build the sentence.', scramble(answer,index), answer, 'A sentence begins with the subject and puts the words in a clear, natural order.'));

export const remainingGrammarGames = [
  buildPremiumGame(summary('sams-bag'), { easy: possessiveEasy, normal: possessiveNormal, challenge: possessiveChallenge }, { instructions: 'Choose the form that shows who owns each object.', whatItTeaches: 'Apostrophe-s for singular ownership.', parentTip: 'Say “the bag belonging to Sam” and then shorten it to “Sam’s bag”.' }),
  buildPremiumGame(summary('question-words'), { easy: questionSeeds(false), normal: questionSeeds(true), challenge: questionChallenge }, { instructions: 'Choose the question word that asks for the missing information.', whatItTeaches: 'Who for people, what for things or information, where for places and when for times.', parentTip: 'Ask what kind of answer the question needs before choosing the question word.' }),
  buildPremiumGame(summary('and-but-because'), { easy: conjunction(false), normal: conjunction(true), challenge: conjunctionChallenge }, { instructions: 'Choose the joining word that makes the meaning clear.', whatItTeaches: 'Joining similar ideas, contrasts, reasons and simple results.', parentTip: 'Read both halves aloud and ask how the two ideas are connected.' }),
  buildPremiumGame(summary('in-on-at'), { easy: timeSeeds(false), normal: timeSeeds(true), challenge: timeChallenge }, { instructions: 'Choose in, on or at for each familiar time expression.', whatItTeaches: 'Common time patterns for days, exact times, months, years and parts of a day.', parentTip: 'Group examples together: on Monday, at seven, in July.' }),
  buildPremiumGame(summary('build-the-sentence'), { easy: sentenceQuestions('easy'), normal: sentenceQuestions('normal'), challenge: sentenceQuestions('challenge') }, { instructions: 'Tap each word or phrase in order, then check your sentence.', whatItTeaches: 'Clear English word order from short sentences to longer everyday statements.', parentTip: 'Find who or what the sentence is about first, then add the action.' }),
];

export const grammarPremiumGames = [...firstFiveGrammarGames, ...remainingGrammarGames];
