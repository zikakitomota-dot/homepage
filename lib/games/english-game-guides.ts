export type EnglishGameGuide = {
  heading: string;
  pageIntro: string;
  introduction: string;
  explanation: readonly string[];
  examples: readonly string[];
  table?: {
    caption: string;
    headers: readonly string[];
    rows: readonly (readonly string[])[];
  };
  mistakes: readonly {
    wrong: string;
    correct: string;
    note: string;
  }[];
  practice: {
    title: string;
    text: string;
  };
  recognitionProduction: {
    recognition: string;
    production: string;
  };
  progress: {
    heading: string;
    repeat: string;
    moveOn: string;
  };
  relatedGames?: readonly {
    title: string;
    href: string;
    note: string;
  }[];
};

export const englishGameGuides: Record<string, EnglishGameGuide> = {
  'a-or-an': {
    heading: 'When to use a and an',
    pageIntro: 'Listen to the opening sound of each noun, then decide whether a or an makes the phrase easier to say.',
    introduction: 'A and an both introduce one person, animal, place or thing when we are not naming a particular one. The choice depends on the sound at the beginning of the next word.',
    explanation: [
      'Use a before a consonant sound: a cat, a ball and a red apple. Use an before a vowel sound: an apple, an egg and an orange bag.',
      'The sound matters more than the first written letter. We say an hour because hour begins with a vowel sound, but a university because university begins with a “y” sound. These less common examples can wait until the basic pattern feels familiar.',
    ],
    examples: ['a cat', 'a ball', 'an apple', 'an egg', 'an hour', 'a university'],
    mistakes: [
      { wrong: 'a apple', correct: 'an apple', note: 'Apple begins with a vowel sound.' },
      { wrong: 'an ball', correct: 'a ball', note: 'Ball begins with a consonant sound.' },
    ],
    practice: {
      title: 'Make an a-or-an tray',
      text: 'Collect a few safe objects or picture cards. Take turns naming each one with a or an, then sort it into two groups. Say each phrase aloud so the child listens to the opening sound.',
    },
    recognitionProduction: {
      recognition: 'Choosing “an” before apple shows that the learner noticed a vowel sound in that prompt.',
      production: 'Naming a different object as “an orange” or “a spoon” without answer choices shows the sound rule transferring to a new phrase.',
    },
    progress: {
      heading: 'Listen again or try a new noun?',
      repeat: 'Repeat with fewer nouns if choices follow the first written letter without listening, or if the reason for a versus an cannot be explained aloud.',
      moveOn: 'A new article or noun-phrase activity may be reasonable when varied nouns are answered consistently and the learner can supply a or an for an unseen object.',
    },
  },
  'one-or-many': {
    heading: 'Singular and plural nouns',
    pageIntro: 'Use the number clue to decide whether the noun names one item or a group, then check whether the regular plural needs s.',
    introduction: 'A singular noun names one thing. A plural noun names more than one. This game pairs a number clue with familiar regular nouns.',
    explanation: [
      'Many common plurals are made by adding s: one cat becomes two cats, and one book becomes three books. The number and the noun ending work together to show whether there is one item or a group.',
      'The game concentrates on this regular s pattern. Children do not need a long list of irregular plurals to practise the skill used here.',
    ],
    examples: ['one cat → two cats', 'one book → three books', 'one pencil → four pencils', 'one apple → five apples'],
    mistakes: [
      { wrong: 'two cat', correct: 'two cats', note: 'With this regular noun, more than one needs the plural s.' },
      { wrong: 'one books', correct: 'one book', note: 'One takes the singular form.' },
    ],
    practice: {
      title: 'Count real objects',
      text: 'Place one pencil on a table and say “one pencil.” Add two more and say “three pencils.” Repeat with cups, blocks or picture cards, letting the child say both the number and noun.',
    },
    recognitionProduction: {
      recognition: 'Selecting “many” for three books shows recognition of the quantity shown in that question.',
      production: 'Looking at a new group and saying “four pencils” independently also requires the learner to produce the regular plural ending.',
    },
    progress: {
      heading: 'Count again or add a new number?',
      repeat: 'Repeat when the learner notices the number but drops plural s, or chooses from memory without matching the noun to the quantity.',
      moveOn: 'Moving to a related number-and-language task may be reasonable when the learner describes different one-item and many-item groups correctly without the buttons.',
    },
    relatedGames: [
      { title: 'This, That, These or Those?', href: '/games/english/this-that-these-those', note: 'Use the one-or-many clue together with distance words.' },
    ],
  },
  'he-she-it': {
    heading: 'Replacing a name with he, she or it',
    pageIntro: 'Find the single person, animal or object named in the first sentence and replace that noun with he, she or it.',
    introduction: 'A pronoun can replace a noun so we do not repeat the same name in every sentence. This game uses he, she and it for one person, animal or thing.',
    explanation: [
      'Use he for a boy or man and she for a girl or woman in the simple contexts shown. Use it for an object, place or animal when no personal gender is given.',
      'Show the noun first, then replace it: “Tom has a cap. He likes it.” The word he points back to Tom. In “The bus is here. It is yellow,” it points back to the bus.',
    ],
    examples: ['Ben is kind. He is my friend.', 'Mina is reading. She has a book.', 'The ball is blue. It is under the chair.'],
    mistakes: [
      { wrong: 'Sara has a kite. He flies it.', correct: 'Sara has a kite. She flies it.', note: 'She replaces Sara in this sentence.' },
      { wrong: 'The book is new. He is on the desk.', correct: 'The book is new. It is on the desk.', note: 'It replaces the object.' },
    ],
    practice: {
      title: 'Name, then replace',
      text: 'Choose people or objects in a picture. Say the name in one sentence, then use he, she or it in the next. Ask the child what the pronoun points back to.',
    },
    recognitionProduction: {
      recognition: 'Choosing “it” after “the bus” shows that the learner can match that visible noun to a pronoun.',
      production: 'Describing a different pictured object in two sentences—naming it first and then using it—shows stronger control of the reference.',
    },
    progress: {
      heading: 'Trace the reference or widen the pronoun set?',
      repeat: 'Repeat if the learner chooses from the nearest name rather than the subject, or cannot say which noun the pronoun replaces.',
      moveOn: 'It may be reasonable to continue to a wider pronoun game when he, she and it are used consistently in new two-sentence examples.',
    },
    relatedGames: [
      { title: 'Is, Am, Are', href: '/games/english/is-am-are', note: 'Match these pronouns with the correct form of “to be”.' },
      { title: 'Has or Have?', href: '/games/english/has-or-have', note: 'Use he, she and it with has.' },
    ],
  },
  'is-am-are': {
    heading: 'Choosing is, am or are',
    pageIntro: 'Identify the sentence subject first, then match it with am, is or are instead of choosing the verb by sound alone.',
    introduction: 'Is, am and are are present forms of the verb “to be.” The correct form depends on the subject at the beginning of the sentence.',
    explanation: [
      'Use am with I. Use is with he, she, it or one named person or thing. Use are with you, we, they or a subject that names more than one person or thing.',
      'It helps to identify the subject before choosing the verb. “The books” means more than one, so we say “The books are on the table.”',
    ],
    examples: ['I am happy.', 'She is tall.', 'The cat is sleepy.', 'They are friends.', 'We are ready.'],
    table: {
      caption: 'Subject and verb matches',
      headers: ['Subject', 'Verb'],
      rows: [['I', 'am'], ['he / she / it', 'is'], ['you / we / they', 'are']],
    },
    mistakes: [
      { wrong: 'I is happy.', correct: 'I am happy.', note: 'I always uses am in this pattern.' },
      { wrong: 'They is playing.', correct: 'They are playing.', note: 'They uses are.' },
    ],
    practice: {
      title: 'Finish the sentence aloud',
      text: 'Say a subject such as “I,” “the dog,” “we” or “the children.” Ask the child to add am, is or are and finish with one simple idea: “We are ready.”',
    },
    recognitionProduction: {
      recognition: 'Selecting “are” for “They ___ playing” shows recognition of the they–are pair in that sentence.',
      production: 'Creating “They are running” with a different action shows that the learner can carry the subject–verb match into a new sentence.',
    },
    progress: {
      heading: 'Rebuild the pair or change the sentence?',
      repeat: 'Repeat if I is paired with is, plural subjects are treated as one, or the correct choice cannot be linked back to the subject.',
      moveOn: 'A new agreement activity may be reasonable when the learner handles I, one subject and plural subjects across varied sentences and can invent an example for each.',
    },
    relatedGames: [
      { title: 'He, She, It', href: '/games/english/he-she-it', note: 'Review the singular pronouns that use is.' },
      { title: 'Has or Have?', href: '/games/english/has-or-have', note: 'Use the same subject-checking habit to choose has or have.' },
    ],
  },
  'can-or-cant': {
    heading: 'Talking about what is possible',
    pageIntro: 'Decide whether the subject is able to do the stated action, then complete the meaning with can or can’t.',
    introduction: 'Can says that a person, animal or thing is able to do something. Can’t says that the action is not possible for that subject.',
    explanation: [
      'Place can or can’t after the subject and before the action word: “A bird can fly” and “A fish can’t walk.” The action word does not change after can or can’t.',
      'The game uses clear everyday facts, so children can think about both the sentence and its meaning before answering.',
    ],
    examples: ['A bird can fly.', 'A fish can’t walk.', 'A frog can jump.', 'A pencil can’t talk.'],
    mistakes: [
      { wrong: 'A bird can flies.', correct: 'A bird can fly.', note: 'Use the simple action word after can.' },
      { wrong: 'A chair can run.', correct: 'A chair can’t run.', note: 'The sentence must also make sense.' },
    ],
    practice: {
      title: 'Ask about abilities',
      text: 'Take turns choosing an animal or person and asking what it can or can’t do. Encourage a full answer such as “A duck can swim” rather than only saying can.',
    },
    recognitionProduction: {
      recognition: 'Choosing “can” for a bird flying shows recognition that the statement describes a possible ability.',
      production: 'Giving a new pair such as “A duck can swim, but a chair can’t swim” requires an independent meaningful sentence, not just a button choice.',
    },
    progress: {
      heading: 'Check the meaning or create a new contrast?',
      repeat: 'Repeat if answers ignore whether the action is possible, or if an extra s is added to the action after can or can’t.',
      moveOn: 'Moving on may be reasonable when the learner explains the real-world clue and makes new can/can’t sentences with the base action word.',
    },
  },
  'who-is-it': {
    heading: 'Choosing I, you, he, she, it, we or they',
    pageIntro: 'Work out who is speaking, who is being addressed and whether the sentence refers to one person, one thing or a group.',
    introduction: 'Who asks about a person, but the questions in this game focus on the pronoun that stands for the speaker, listener, person, thing or group in a sentence.',
    explanation: [
      'Use I for the speaker and you for the person being spoken to. He, she and it refer to one person or thing. We includes the speaker in a group, while they refers to other people, animals or things as a group.',
      'Context tells us which pronoun fits. In “Sara and I are playing. We are a team,” the speaker is part of the group, so we is correct. In “The cats are sleeping. They are quiet,” they replaces the cats.',
    ],
    examples: ['I am holding a pencil.', 'You may choose a game.', 'He is kind.', 'She likes books.', 'It is new.', 'We are a team.', 'They play together.'],
    table: {
      caption: 'Who or what the pronoun represents',
      headers: ['Pronoun', 'Use it for'],
      rows: [['I', 'the speaker'], ['you', 'the listener'], ['he / she / it', 'one person or thing'], ['we', 'the speaker and others'], ['they', 'other people or things']],
    },
    mistakes: [
      { wrong: 'Sara and I are playing. They are a team.', correct: 'Sara and I are playing. We are a team.', note: 'The speaker is included, so use we.' },
      { wrong: 'The cats are sleeping. It is quiet.', correct: 'The cats are sleeping. They are quiet.', note: 'Cats is plural, so use they.' },
    ],
    practice: {
      title: 'Point to the speaker and group',
      text: 'Use family photos, book characters or classroom pictures. Point to yourself for I, the child for you, both of you for we, and a separate group for they. Build one short sentence for each.',
    },
    recognitionProduction: {
      recognition: 'Choosing “we” for “Sara and I” shows recognition that the speaker belongs to the group.',
      production: 'Pointing to a different group and making a sentence with we or they shows that speaker and number distinctions can transfer beyond the prompt.',
    },
    progress: {
      heading: 'Map the people again or use a fresh context?',
      repeat: 'Repeat if we and they are confused, if you is selected for the speaker, or if the learner cannot identify who a pronoun represents.',
      moveOn: 'It may be reasonable to move on when the full pronoun set is used across new speaker, listener, person, object and group examples.',
    },
    relatedGames: [
      { title: 'He, She, It', href: '/games/english/he-she-it', note: 'Begin with three pronouns before practising the full set.' },
    ],
  },
  'whose-is-it': {
    heading: 'Showing who owns something',
    pageIntro: 'Identify the owner before choosing my, your, his, her, our or their to place in front of the object name.',
    introduction: 'Whose asks which person or group something belongs to. This game answers that ownership clue with my, your, his, her, our or their before a noun.',
    explanation: [
      'The owner decides the word: my pencil belongs to me, your book belongs to you, his cap belongs to him and her bag belongs to her. Use our for something shared by the speaker’s group and their for something belonging to another group.',
      'Who asks for a person’s identity: “Who is she?” Whose asks about ownership: “Whose bag is this?” A simple answer can be “It is her bag” or “It is Sara’s bag.”',
    ],
    examples: ['This is my pencil.', 'It is your book.', 'It is his cap.', 'It is her bag.', 'It is our classroom.', 'They are their bicycles.'],
    mistakes: [
      { wrong: 'The bag belongs to Sara. It is his bag.', correct: 'The bag belongs to Sara. It is her bag.', note: 'Her matches the owner in this example.' },
      { wrong: 'We share the room. It is their room.', correct: 'We share the room. It is our room.', note: 'Our includes the speaker.' },
    ],
    practice: {
      title: 'Label everyday belongings',
      text: 'Put two or three familiar objects on a table. Ask “Whose pencil is this?” and answer with a complete phrase such as “It is my pencil” or “It is her pencil.”',
    },
    recognitionProduction: {
      recognition: 'Selecting “her” after a sentence says the bag belongs to Maya shows recognition of the stated owner.',
      production: 'Passing the same object between people and saying “my pencil,” “your pencil” and “their pencil” shows the ownership word changing with the owner.',
    },
    progress: {
      heading: 'Find the owner again or change owners?',
      repeat: 'Repeat if the object rather than the owner controls the choice, or if our and their are confused when the speaker is or is not included.',
      moveOn: 'Moving on may be reasonable when a new owner is matched to the correct possessive word and the learner can use it before a noun in a fresh sentence.',
    },
  },
  'where-is-it': {
    heading: 'Using words for position',
    pageIntro: 'Picture the relationship between the two objects, then choose the location phrase that describes where one sits in relation to the other.',
    introduction: 'Where asks about location. This game practises six position words and phrases: in, on, under, behind, in front of and next to.',
    explanation: [
      'In means inside; on means touching and supported by a surface; under means lower than something. Behind and in front of describe opposite sides, while next to means beside something.',
      'Read the whole sentence because the objects provide the location clue: a pencil can be in a bag, a cup can be on a tray and shoes can be under a bed.',
    ],
    examples: ['The apple is in the bowl.', 'The book is on the table.', 'The shoes are under the bed.', 'The garden is behind the house.', 'The bus is in front of the school.', 'The pencil is next to the notebook.'],
    mistakes: [
      { wrong: 'The pencils are on the bag.', correct: 'The pencils are in the bag.', note: 'In shows that the pencils are inside.' },
      { wrong: 'The bus is behind the school.', correct: 'The bus is in front of the school.', note: 'Use the phrase that matches the stated position.' },
    ],
    practice: {
      title: 'Move a toy around a box',
      text: 'Place a toy in, on, under, behind, in front of or next to a box. Ask “Where is it?” Then let the child move the toy and describe the new position.',
    },
    recognitionProduction: {
      recognition: 'Choosing “under” in a described scene shows recognition of that spatial relationship in the question.',
      production: 'Moving a toy and saying “The toy is next to the box” without choices shows that the learner can produce the full location phrase.',
    },
    progress: {
      heading: 'Move the object again or add another position?',
      repeat: 'Repeat with real objects if behind and in front of are reversed, or if in, on and under cannot be demonstrated after a correct screen answer.',
      moveOn: 'A new location activity may be reasonable when the learner follows and gives directions using the six position phrases in unfamiliar arrangements.',
    },
  },
  'this-that-these-those': {
    heading: 'Near or far, one or more',
    pageIntro: 'Combine two clues in every question: whether the item is near or far, and whether the noun names one item or more than one.',
    introduction: 'This, that, these and those depend on two clues: distance and number. First decide whether the object is near or farther away, then decide whether there is one or more than one.',
    explanation: [
      'Use this for one nearby thing and these for several nearby things. Use that for one thing farther away and those for several things farther away.',
      'A noun after this or that is usually singular: “this cup.” A noun after these or those is plural: “those trees.”',
    ],
    examples: ['This cup is full.', 'That tree is tall.', 'These shoes are clean.', 'Those stars are bright.'],
    table: {
      caption: 'Distance and number',
      headers: ['', 'One', 'More than one'],
      rows: [['Near', 'this', 'these'], ['Farther away', 'that', 'those']],
    },
    mistakes: [
      { wrong: 'this shoes', correct: 'these shoes', note: 'Shoes means more than one nearby item.' },
      { wrong: 'those kite', correct: 'that kite', note: 'One farther-away kite takes that.' },
    ],
    practice: {
      title: 'Point near and far',
      text: 'Hold one object and say “this pencil.” Point to one farther away and say “that pencil.” Repeat with two nearby objects for these and a distant group for those.',
    },
    recognitionProduction: {
      recognition: 'Choosing “those” for several faraway stars shows recognition of both the distance and plural clues.',
      production: 'Pointing around the room and saying “this chair” or “those books” independently shows the two-clue choice transferring to real objects.',
    },
    progress: {
      heading: 'Separate the two clues or combine them elsewhere?',
      repeat: 'Repeat if only distance or only number is considered, especially when this/these or that/those are mixed up.',
      moveOn: 'Moving on may be reasonable when all four words are used with different nearby and farther-away objects and the learner can explain both clues.',
    },
    relatedGames: [
      { title: 'One or Many?', href: '/games/english/one-or-many', note: 'Review the number clue used to choose this/that or these/those.' },
    ],
  },
  'has-or-have': {
    heading: 'Choosing has or have',
    pageIntro: 'Locate the true sentence subject, replace it with a pronoun if helpful, and use that subject to choose has or have.',
    introduction: 'Has and have are present forms of the same verb. In these sentences they often tell us what a person, animal, place or thing owns or includes.',
    explanation: [
      'Use have with I, you, we and they. Use has with he, she and it. One named person or thing also uses has, while plural subjects use have.',
      'Find the subject first, then choose the verb: “She has a book,” but “They have two bags.”',
    ],
    examples: ['I have a pencil.', 'You have a blue coat.', 'She has a book.', 'The dog has a bowl.', 'We have a ball.', 'They have two bags.'],
    table: {
      caption: 'Subject and verb matches',
      headers: ['Subject', 'Verb'],
      rows: [['I / you / we / they', 'have'], ['he / she / it', 'has'], ['one named person or thing', 'has'], ['plural subjects', 'have']],
    },
    mistakes: [
      { wrong: 'She have a red bag.', correct: 'She has a red bag.', note: 'She uses has.' },
      { wrong: 'They has two cats.', correct: 'They have two cats.', note: 'They uses have.' },
    ],
    practice: {
      title: 'Make possession sentences',
      text: 'Choose people, toys or pictures and name what each one has. Change the subject—“I have a pencil,” “Maya has a pencil,” “They have pencils”—and listen for the verb change.',
    },
    recognitionProduction: {
      recognition: 'Selecting “has” for “Maya ___ a storybook” shows recognition that one named person follows the she–has pattern.',
      production: 'Changing the subject to “Maya and Tom” and producing “They have storybooks” shows the verb changing with a new subject.',
    },
    progress: {
      heading: 'Find the subject again or vary it?',
      repeat: 'Repeat if a nearby plural noun distracts from the true subject, or if he/she/it and I/you/we/they are not linked to their verb forms.',
      moveOn: 'Another agreement pattern may be reasonable when named, pronoun and plural subjects all lead to consistent has/have choices in new sentences.',
    },
    relatedGames: [
      { title: 'He, She, It', href: '/games/english/he-she-it', note: 'Review the pronouns that pair with has.' },
    ],
  },
};

export function getEnglishGameGuide(slug: string) {
  return englishGameGuides[slug];
}
