import 'server-only';

import { vocabularyLevelOneGames } from '../academy-games';
import type { AcademyGameSummary } from '../types';
import { buildPremiumGame, rotateChoices, type QuestionSeed } from './question-helpers.server';

type Entry = readonly [word: string, icon: string, accessibleClue: string, meaningClue: string];
type Extra = readonly [clue: string, answer: string];
const summary = (slug: string) => vocabularyLevelOneGames.find((game) => game.slug === slug) as AcademyGameSummary;

function vocabularySeeds(entries: readonly Entry[], extras: readonly Extra[]): Record<'easy' | 'normal' | 'challenge', QuestionSeed[]> {
  const words = entries.map(([word]) => word);
  const question = (index: number, size: 2 | 4, prompt: string, usePicture: boolean): QuestionSeed => {
    const [answer, icon, , meaningClue] = entries[index % entries.length];
    return { prompt, choices: rotateChoices(words, index % entries.length, size), answer, explanation: `“${answer}” is the word that matches this clue.`, ...(usePicture ? { illustration: icon, illustrationLabel: meaningClue } : {}) };
  };
  const easy = Array.from({ length: 15 }, (_, index) => {
    const [, , , meaningClue] = entries[index % entries.length];
    return question(index, 2, index < entries.length ? `Which word matches this symbol and clue: ${meaningClue}?` : `Which word matches this clue: ${meaningClue}?`, index < entries.length);
  });
  const normal = Array.from({ length: 15 }, (_, index) => {
    const [, , , meaningClue] = entries[index % entries.length];
    return question(index, 4, index < entries.length ? `Choose the best word for this visual clue: ${meaningClue}.` : `Choose the best word for this description: ${meaningClue}.`, index < entries.length);
  });
  const challengeSource: Extra[] = [...entries.map(([word, , , clue]) => [clue, word] as const), ...extras];
  const challenge = challengeSource.slice(0, 15).map(([clue, answer], index) => ({ prompt: clue, choices: rotateChoices(words, words.indexOf(answer), 4), answer, explanation: `“${answer}” is the word that best completes the clue.` }));
  return { easy, normal, challenge };
}

function vocabGame(slug: string, entries: readonly Entry[], extras: readonly Extra[], details: { instructions: string; whatItTeaches: string; parentTip: string }) {
  return buildPremiumGame(summary(slug), vocabularySeeds(entries, extras), details);
}

const colours = [
  ['red','🔴','a red circle','the colour of a ripe strawberry'], ['blue','🔵','a blue circle','the colour often used for a clear sky'], ['green','🟢','a green circle','the colour of fresh grass'], ['yellow','🟡','a yellow circle','the colour of a bright lemon'], ['orange','🟠','an orange circle','the colour of a pumpkin'],
  ['purple','🟣','a purple circle','a colour made by mixing red and blue'], ['pink','🌸','a pink flower','the colour named by a pink flower'], ['black','⬛','a black square','the darkest colour in this set'], ['white','⬜','a white square with a dark outline','the colour of fresh snow'], ['brown','🟫','a brown square','the colour of many tree trunks'],
] as const satisfies readonly Entry[];
const animals = [
  ['cat','🐱','a small cat face','a pet that may purr'], ['dog','🐶','a friendly dog face','a pet that may bark'], ['bird','🐦','a small bird','an animal with feathers and wings'], ['fish','🐟','a fish swimming','an animal that lives and breathes in water'], ['rabbit','🐰','a rabbit with long ears','a small animal with long ears'],
  ['elephant','🐘','an elephant with a trunk','a very large animal with a long trunk'], ['lion','🦁','a lion with a mane','a big wild cat whose male may have a mane'], ['tiger','🐯','a striped tiger face','a large wild cat with stripes'], ['monkey','🐒','a monkey','an animal that can climb and use its hands'], ['horse','🐴','a horse face','a large animal that people may ride'], ['cow','🐄','a black-and-white cow','a farm animal that gives milk'], ['duck','🦆','a duck','a bird with a flat bill that can swim'], ['frog','🐸','a green frog face','a small animal that hops and lives near water'], ['bear','🐻','a bear face','a large furry wild animal'],
] as const satisfies readonly Entry[];
const foods = [
  ['apple','🍎','a red apple','a round fruit that grows on a tree'], ['banana','🍌','a yellow banana','a long curved fruit with a peel'], ['orange','🍊','an orange fruit','a round citrus fruit with segments'], ['rice','🍚','a bowl of cooked rice','small grains eaten in meals around the world'], ['bread','🍞','a loaf of bread','a baked food often sliced'], ['egg','🥚','an egg','a food with a shell'], ['milk','🥛','a glass of milk','a pale drink used with cereal'], ['water','💧','a drop of water','a clear drink our bodies need'], ['carrot','🥕','an orange carrot','a crunchy root vegetable'], ['cake','🍰','a slice of cake','a sweet baked food for celebrations'], ['fish','🐟','a fish','an animal food that comes from water'], ['chicken','🍗','a cooked piece of chicken','a common type of poultry food'],
] as const satisfies readonly Entry[];
const body = [
  ['head','🙂','a face showing the whole head','the top part of the body above the neck'], ['eyes','👀','a pair of eyes','the body parts used to see'], ['ears','👂','an ear','the body parts used to hear'], ['nose','👃','a nose','the body part used to smell'], ['mouth','👄','a mouth','the body part used to speak and eat'], ['hands','👐','two open hands','the body parts used to hold things'], ['arms','💪','a bent arm','the body parts joining shoulders to hands'], ['legs','🦵','a leg','the body parts used for walking'], ['feet','🦶','a foot','the body parts at the ends of the legs'], ['hair','💇','hair being cut','the strands that grow on the head'],
] as const satisfies readonly Entry[];
const school = [
  ['book','📘','a closed blue book','pages bound together for reading'], ['pencil','✏️','a wooden pencil','a tool for writing that can be sharpened'], ['pen','🖊️','an ink pen','a writing tool that uses ink'], ['eraser','▰','a small rectangular eraser','an item used to remove pencil marks'], ['ruler','📏','a ruler with measurement marks','a tool used to measure or draw a straight line'], ['bag','🎒','a school backpack','a container used to carry school things'], ['paper','📄','a sheet of paper','a thin sheet used for writing or drawing'], ['crayon','🖍️','a colourful crayon','a wax colouring stick'], ['scissors','✂️','a pair of scissors','a tool used to cut paper'], ['notebook','📓','a spiral notebook','a book of blank or lined pages for notes'],
] as const satisfies readonly Entry[];

export const firstFiveVocabularyGames = [
  vocabGame('colour-quest', colours, [['Which colour word completes this sentence: The school bus is often ___.','yellow'],['Which colour word completes this sentence: The leaves are fresh and ___.','green'],['Which colour word completes this sentence: The night sky can look ___.','black'],['Which colour word completes this sentence: The cloud is bright ___.','white'],['Which colour word completes this sentence: The soil is ___.','brown']], { instructions: 'Use both the symbol and written clue to choose the colour word.', whatItTeaches: 'Ten common colour words without relying on colour alone.', parentTip: 'Find the same colour on a safe object nearby and say its name aloud.' }),
  vocabGame('animal-friends', animals, [['This animal has a long trunk.','elephant'],['This animal has orange fur with dark stripes.','tiger'],['This animal may purr on your lap.','cat'],['This animal has feathers and a flat bill.','duck'],['This animal hops and has long ears.','rabbit']], { instructions: 'Match each animal symbol or description with its English name.', whatItTeaches: 'Names and simple features of familiar pets, farm animals and wild animals.', parentTip: 'Make the animal’s sound or movement after saying its name.' }),
  vocabGame('food-fun', foods, [['Which one is a fruit that is long and curved?','banana'],['Which drink is clear and has no added flavour?','water'],['Which food is made from baked dough and often sliced?','bread'],['Which one is a crunchy root vegetable?','carrot'],['Which food might have candles at a birthday?','cake']], { instructions: 'Choose the food or drink word that matches each clue.', whatItTeaches: 'Inclusive everyday food, drink and simple category vocabulary.', parentTip: 'Name foods during meals without labelling any familiar food as strange.' }),
  vocabGame('my-body', body, [['You use these to hear.','ears'],['You use these to see.','eyes'],['You use this to smell a flower.','nose'],['You use these to hold a pencil.','hands'],['You stand on these.','feet']], { instructions: 'Match each body-part symbol or function with the correct word.', whatItTeaches: 'Common external body-part words and what they help us do.', parentTip: 'Point to your own body part only when the child is comfortable copying.' }),
  vocabGame('in-my-school-bag', school, [['You use this to measure a line.','ruler'],['You use these to cut paper safely with an adult nearby.','scissors'],['You use this to remove a pencil mark.','eraser'],['You can sharpen this writing tool.','pencil'],['You carry school items inside this.','bag']], { instructions: 'Match school-item symbols and uses with their English words.', whatItTeaches: 'Useful classroom and school-supply vocabulary.', parentTip: 'Ask the learner to find and name a safe item in their own school bag.' }),
];

const family = [
  ['mother','👩','an adult woman labelled mother','a female parent; another word is mum'], ['father','👨','an adult man labelled father','a male parent; another word is dad'], ['mum','👩','the word Mum beside a woman','an informal British word for mother'], ['dad','👨','the word Dad beside a man','an informal word for father'], ['brother','👦','a boy labelled brother','a male sibling'], ['sister','👧','a girl labelled sister','a female sibling'], ['grandmother','👵','an older woman labelled grandmother','a parent of a parent who is a woman'], ['grandfather','👴','an older man labelled grandfather','a parent of a parent who is a man'], ['parents','🧑‍🤝‍🧑','two caring adults labelled parents','a plural word for a person’s parent figures'], ['family','👪','a group of people labelled family','people connected through care, birth, marriage or adoption'],
] as const satisfies readonly Entry[];
const clothes = [
  ['shirt','👔','a collared shirt','a top with a collar and buttons'], ['dress','👗','a dress','a one-piece item of clothing'], ['trousers','👖','a pair of trousers','British English for clothing covering both legs'], ['shorts','🩳','a pair of shorts','short clothing worn on the legs'], ['shoes','👟','a pair of shoes','footwear worn outside socks'], ['socks','🧦','a pair of socks','soft clothing worn on the feet inside shoes'], ['hat','🧢','a hat with a brim','something worn on the head'], ['jacket','🧥','a jacket','a short outer layer with sleeves'], ['skirt','🩱','a skirt-shaped garment','clothing hanging from the waist without separate legs'], ['T-shirt','👕','a short-sleeved T-shirt','a casual top shaped like the letter T'],
] as const satisfies readonly Entry[];
const home = [
  ['bed','🛏️','a bed with a pillow','furniture used for sleeping'], ['table','🪑','a table beside a chair','furniture with a flat top for meals or work'], ['chair','🪑','a chair with a back','a seat for one person'], ['door','🚪','a closed door','a moving panel used to enter a room'], ['window','🪟','a window with panes','an opening with glass that lets in light'], ['sofa','🛋️','a sofa with cushions','a soft seat for more than one person'], ['kitchen','🍳','a cooking pan labelled kitchen','the room where food is prepared'], ['bedroom','🛏️','a bed labelled bedroom','the room where people sleep'], ['bathroom','🛁','a bath labelled bathroom','the room used for washing'], ['lamp','💡','a table lamp','an object that gives light'],
] as const satisfies readonly Entry[];
const actions = [
  ['run','🏃','a person running','move quickly on your feet'], ['walk','🚶','a person walking','move on your feet at a steady pace'], ['jump','🤸','a person jumping','push off the ground into the air'], ['eat','🍽️','a plate used for eating','take food into your mouth'], ['drink','🥤','a cup with a straw','take liquid into your mouth'], ['read','📖','an open book','look at and understand written words'], ['write','✍️','a hand writing','make letters or words on a surface'], ['sleep','😴','a sleeping face','rest with your eyes closed'], ['sit','🪑','a chair labelled sit','rest your body on a seat'], ['stand','🧍','a person standing','be upright on your feet'], ['swim','🏊','a person swimming','move through water'], ['play','⚽','a ball used for play','take part in a game or fun activity'],
] as const satisfies readonly Entry[];
const opposites = [
  ['small','🐭','a small mouse beside a large shape','the opposite of big'], ['cold','🧊','an ice cube labelled cold','the opposite of hot'], ['sad','🙁','a sad face','the opposite of happy'], ['slow','🐢','a slow tortoise','the opposite of fast'], ['down','⬇️','an arrow pointing down','the opposite of up'], ['closed','🔒','a closed lock','the opposite of open'], ['night','🌙','a moon at night','the opposite time to day'], ['new','✨','a shiny new object','the opposite of old'], ['empty','🫙','an empty jar','the opposite of full'], ['short','📏','a short line beside a tall one','the opposite of tall'],
] as const satisfies readonly Entry[];

export const remainingVocabularyGames = [
  vocabGame('my-family', family, [['Which word can mean a female parent?','mother'],['Which informal word can mean a male parent?','dad'],['Which word means a male sibling?','brother'],['Which word can include the people who care for and belong with one another?','family'],['Which plural word can describe parent figures?','parents']], { instructions: 'Use the written clue to learn respectful words for family relationships.', whatItTeaches: 'Common family vocabulary without assuming that every household has the same structure.', parentTip: 'Use whichever words fit the learner’s own family and explain that families can be different.' }),
  vocabGame('what-are-we-wearing', clothes, [['You wear these on your feet over socks.','shoes'],['British English uses this word for clothing that covers both legs.','trousers'],['You wear this on your head.','hat'],['This casual top is shaped like the letter T.','T-shirt'],['This is a short outer layer with sleeves.','jacket']], { instructions: 'Match clothing symbols and descriptions with British-English words.', whatItTeaches: 'Everyday clothing vocabulary including trousers and T-shirt.', parentTip: 'Choose one item the learner is wearing and say its English name.' }),
  vocabGame('at-home', home, [['You sleep in this room.','bedroom'],['You prepare food in this room.','kitchen'],['You sit on this soft seat with other people.','sofa'],['You open this to enter a room.','door'],['This object gives light.','lamp']], { instructions: 'Choose the home word that matches each room, object or use.', whatItTeaches: 'Common rooms, furniture and objects found in many homes.', parentTip: 'Walk through a familiar room and name only the objects that are really there.' }),
  vocabGame('action-time', actions, [['Which word means moving quickly on your feet?','run'],['Which word means looking at and understanding written words?','read'],['Which word means moving through water?','swim'],['Which word means resting on a seat?','sit'],['Which word means making letters or words?','write']], { instructions: 'Match each action symbol or meaning with its verb.', whatItTeaches: 'Useful everyday action verbs.', parentTip: 'Act out a safe verb and invite the learner to name it.' }),
  vocabGame('opposite-match', opposites, [['The bottle is full. The opposite of full is ___.','empty'],['The rabbit is fast. The opposite of fast is ___.','slow'],['The door is open. The opposite of open is ___.','closed'],['The tower is tall. The opposite of tall is ___.','short'],['The toy is old. The opposite of old is ___.','new']], { instructions: 'Choose the word with the opposite meaning.', whatItTeaches: 'Ten useful opposite pairs through direct matches and simple contexts.', parentTip: 'Say both words as a pair, such as “open, closed”, and use a safe gesture.' }),
];

export const vocabularyPremiumGames = [...firstFiveVocabularyGames, ...remainingVocabularyGames];
