import type { GameDifficulty, GameQuestion } from './types';

type Seed = readonly [prompt: string, choices: readonly string[], answer: string, explanation: string];
type DifficultySeeds = Record<GameDifficulty, readonly Seed[]>;

function makeBank(slug: string, seeds: DifficultySeeds): GameQuestion[] {
  return (['easy', 'normal', 'challenge'] as const).flatMap((difficulty, difficultyIndex) => seeds[difficulty].map(([prompt, choices, correctAnswer, explanation], index) => {
    const shift = (index + difficultyIndex) % choices.length;
    const balancedChoices = [...choices.slice(shift), ...choices.slice(0, shift)];
    return { id: `${slug}-${difficulty}-extra-${index + 1}`, difficulty, prompt, choices: balancedChoices, correctAnswer, explanation };
  }));
}

type SimpleSeeds = Record<GameDifficulty, readonly (readonly [prompt: string, answer: string])[]>;
function makeSimpleBank(slug: string, choices: readonly string[], seeds: SimpleSeeds, explain: (answer: string) => string): GameQuestion[] {
  const expanded = Object.fromEntries((['easy', 'normal', 'challenge'] as const).map((difficulty) => [difficulty, seeds[difficulty].map(([prompt, answer]) => [prompt, choices, answer, explain(answer)])]));
  return makeBank(slug, expanded as unknown as DifficultySeeds);
}

export const levelOneQuestionExpansions: Record<string, readonly GameQuestion[]> = {
  'one-or-many': makeBank('number', {
    easy: [
      ['Look at 🐶. Is it one or many?', ['one', 'many'], 'one', 'There is one dog, so the answer is “one”.'],
      ['The basket holds three balls. Is that one or many?', ['many', 'one'], 'many', 'Three means more than one, so the answer is “many”.'],
      ['Choose the phrase for a single star.', ['one star', 'two stars'], 'one star', 'A single star means one star.'],
      ['Mia has two books. Which word describes the books?', ['one', 'many'], 'many', 'Two books are many books.'],
      ['Which picture label means just one?', ['one flower', 'four flowers'], 'one flower', '“One flower” names a single flower.'],
      ['There are five ducks on the pond. One or many?', ['many', 'one'], 'many', 'Five ducks are more than one.'],
      ['Ben sees one red bus. Choose the correct word.', ['one', 'many'], 'one', 'The number one tells us there is a single bus.'],
      ['Which phrase names more than one cat?', ['three cats', 'one cat'], 'three cats', 'Three cats means there is more than one cat.'],
      ['A plate has one sandwich. Is the sandwich one or many?', ['one', 'many'], 'one', 'There is only one sandwich.'],
      ['Four crayons are on the desk. Choose “one” or “many”.', ['many', 'one'], 'many', 'Four crayons are many crayons.'],
    ],
    normal: [
      ['Lily packs one apple and Sam packs three apples. Which group is many?', ['Sam’s apples', 'Lily’s apple'], 'Sam’s apples', 'Sam has three apples, so his group is many.'],
      ['Complete the sentence: One bird is singing, but two birds ___ singing.', ['are', 'is'], 'are', 'We use “are” when there is more than one bird.'],
      ['Which sentence is correct?', ['Three dogs are playing.', 'Three dog is playing.'], 'Three dogs are playing.', 'More than one dog needs the plural word “dogs”.'],
      ['The shelf has a single toy. Which label fits?', ['one toy', 'many toys'], 'one toy', 'A single toy means one toy.'],
      ['Find the correct phrase for six pencils.', ['six pencils', 'six pencil'], 'six pencils', 'With six, the regular plural noun is “pencils”.'],
      ['A child points to two cups. What should the child say?', ['These are cups.', 'This is a cup.'], 'These are cups.', 'Two cups are plural, so “These are cups” fits.'],
      ['Which sentence talks about only one thing?', ['The kite is blue.', 'The kites are blue.'], 'The kite is blue.', '“The kite” names one kite.'],
      ['Mum buys four oranges. Choose the correct shopping-list entry.', ['4 oranges', '4 orange'], '4 oranges', 'More than one regular noun usually ends in “s”.'],
      ['There is one fox near the tree. Which phrase is correct?', ['one fox', 'one foxes'], 'one fox', 'One uses the singular noun “fox”.'],
      ['Which label belongs under a picture of several chairs?', ['many chairs', 'one chair'], 'many chairs', 'Several chairs means many chairs.'],
    ],
    challenge: [
      ['Which sentence needs fixing?', ['Two cats are asleep.', 'One dogs is barking.', 'Four birds are flying.'], 'One dogs is barking.', 'With one, say “One dog is barking.”'],
      ['A box has one blue pencil and three red pencils. Which statement is true?', ['There are many red pencils.', 'There are many blue pencils.'], 'There are many red pencils.', 'Three red pencils are many; one blue pencil is not.'],
      ['Choose the best correction for “Five apple are on the table.”', ['Five apples are on the table.', 'One apples is on the table.'], 'Five apples are on the table.', 'Five needs the plural noun “apples”.'],
      ['Which pair is matched correctly?', ['one child — many children', 'one child — many childs'], 'one child — many children', 'The plural of child is “children”.'],
      ['The farm has one sheep in this field and four sheep in that field. Which word can describe the second group?', ['many', 'one'], 'many', 'Four sheep are many, even though “sheep” does not change spelling.'],
      ['Find the sentence about a single object.', ['A leaf fell from the tree.', 'Leaves fell from the tree.'], 'A leaf fell from the tree.', '“A leaf” means one leaf.'],
      ['Which sign is grammatically correct for a basket with two loaves?', ['Two loaves', 'Two loafs'], 'Two loaves', 'The plural of loaf is “loaves”.'],
      ['Mia says, “I have three toy.” What should she say?', ['I have three toys.', 'I have one toys.'], 'I have three toys.', 'Three needs the plural noun “toys”.'],
      ['Which sentence correctly compares the groups?', ['One bee is near the flower; many bees are near the hive.', 'One bees is near the flower; many bee are near the hive.'], 'One bee is near the flower; many bees are near the hive.', 'Use a singular noun for one and a plural noun for many.'],
      ['The word “fish” can name one fish or several fish. Which clue proves there are many?', ['Six fish swim together.', 'A fish swims alone.'], 'Six fish swim together.', 'The number six shows that the sentence means many fish.'],
    ],
  }),

  'he-she-it': makeBank('pronoun', {
    easy: [
      ['Mia is drawing. ___ has a green crayon.', ['she', 'he', 'it'], 'she', 'Use “she” for Mia.'],
      ['Ben is on the swing. ___ is smiling.', ['he', 'it', 'she'], 'he', 'Use “he” for Ben.'],
      ['The clock is on the wall. ___ is round.', ['it', 'she', 'he'], 'it', 'Use “it” for one thing.'],
      ['Dad is cooking. Choose the pronoun for Dad.', ['he', 'she', 'it'], 'he', '“He” can replace Dad.'],
      ['Ava has a puppy. ___ feeds it.', ['she', 'it', 'he'], 'she', '“She” replaces Ava.'],
      ['Which word can replace “the bicycle”?', ['it', 'he', 'she'], 'it', 'A bicycle is a thing, so use “it”.'],
      ['Tom reads every night. Choose the next sentence.', ['He likes stories.', 'It likes stories.'], 'He likes stories.', 'Use “he” when the sentence is still about Tom.'],
      ['The cake is ready. ___ smells lovely.', ['it', 'she', 'he'], 'it', 'Use “it” for the cake.'],
      ['Lily can swim. Which pronoun replaces Lily?', ['she', 'he', 'it'], 'she', '“She” replaces Lily.'],
      ['The rabbit hops away. ___ is quick.', ['it', 'he', 'she'], 'it', 'At this level, use “it” for an animal when its sex is not given.'],
    ],
    normal: [
      ['Sam forgot his lunch, so ___ went back home.', ['he', 'she', 'it'], 'he', '“He” refers back to Sam.'],
      ['Nora waters the plant because ___ looks dry.', ['it', 'she', 'he'], 'it', '“It” refers to the plant, not Nora.'],
      ['Which two sentences connect correctly?', ['Maya found a key. She picked it up.', 'Maya found a key. It picked she up.'], 'Maya found a key. She picked it up.', '“She” means Maya and “it” means the key.'],
      ['The red bus stops here every day. Choose the sentence that continues the idea.', ['It arrives at eight.', 'He arrives at eight.'], 'It arrives at eight.', 'Use “it” for the bus.'],
      ['Uncle Ali tells funny stories. ___ makes us laugh.', ['he', 'it', 'she'], 'he', '“He” refers to Uncle Ali.'],
      ['Mei puts on her coat because ___ is cold.', ['she', 'it', 'he'], 'she', '“She” is the person who feels cold.'],
      ['Which sentence uses “it” correctly?', ['The lamp is bright. It lights the room.', 'Lily is kind. It helps me.'], 'The lamp is bright. It lights the room.', '“It” correctly replaces the lamp.'],
      ['A bird lands beside Ben. ___ watches it quietly.', ['he', 'it', 'she'], 'he', '“He” refers to Ben; “it” refers to the bird.'],
      ['Priya made a card. Which sentence is about Priya?', ['She gave it to Mum.', 'It gave her to Mum.'], 'She gave it to Mum.', '“She” refers to Priya and “it” refers to the card.'],
      ['The rain has stopped. ___ was heavy this morning.', ['it', 'he', 'she'], 'it', 'Use “it” for the rain.'],
    ],
    challenge: [
      ['Find the pronoun mistake.', ['Mia is reading. She has a book.', 'The bell rang. He was loud.', 'Tom is ready. He has his bag.'], 'The bell rang. He was loud.', 'A bell is a thing, so say “It was loud.”'],
      ['Leo sees a puppy. ___ waves while ___ wags its tail.', ['He; it', 'It; he', 'She; it'], 'He; it', '“He” means Leo and “it” means the puppy.'],
      ['Which sentence clearly means that Sara opened the box?', ['Sara found a box. She opened it.', 'Sara found a box. It opened her.'], 'Sara found a box. She opened it.', '“She” refers to Sara and “it” refers to the box.'],
      ['Fix “The computer is new. She works well.”', ['The computer is new. It works well.', 'The computer is new. He works well.'], 'The computer is new. It works well.', 'Use “it” for a computer.'],
      ['Ben gives Maya a kite. Which pronoun replaces Maya?', ['she', 'he', 'it'], 'she', 'Maya is the person named, so use “she”.'],
      ['A sentence says, “Lily found her shoe. It put it on.” What needs changing?', ['The first “It” should be “She”.', 'The second “it” should be “he”.'], 'The first “It” should be “She”.', 'Lily puts on the shoe, so the subject pronoun is “She”.'],
      ['Which short story keeps its pronouns clear?', ['Omar has a robot. He turns it on.', 'Omar has a robot. It turns he on.'], 'Omar has a robot. He turns it on.', '“He” means Omar and “it” means the robot.'],
      ['The kitten follows Ava because ___ has food. Who does the blank describe?', ['she', 'it', 'he'], 'she', 'Ava has the food, so use “she”.'],
      ['Choose the correction: “Mum baked a pie. She smells delicious.”', ['Mum baked a pie. It smells delicious.', 'Mum baked a pie. He smells delicious.'], 'Mum baked a pie. It smells delicious.', 'The pie smells delicious, so use “it”.'],
      ['Which sentence uses all pronouns correctly?', ['Jack found a shell. He showed it to Dad.', 'Jack found a shell. It showed he to Dad.'], 'Jack found a shell. He showed it to Dad.', '“He” replaces Jack and “it” replaces the shell.'],
    ],
  }),

  'is-am-are': makeBank('be', {
    easy: [
      ['I ___ ready for school.', ['am', 'is', 'are'], 'am', 'Use “am” with “I”.'],
      ['The dog ___ in the garden.', ['is', 'are', 'am'], 'is', 'Use “is” with one dog.'],
      ['We ___ a good team.', ['are', 'is', 'am'], 'are', 'Use “are” with “we”.'],
      ['You ___ my friend.', ['are', 'am', 'is'], 'are', 'Use “are” with “you”.'],
      ['Mia ___ seven today.', ['is', 'are', 'am'], 'is', 'Use “is” with one person.'],
      ['The apples ___ red.', ['are', 'is', 'am'], 'are', 'Use “are” with more than one apple.'],
      ['Choose the correct sentence.', ['I am hungry.', 'I is hungry.'], 'I am hungry.', '“I” goes with “am”.'],
      ['Which phrase sounds right?', ['she is', 'she are'], 'she is', 'Use “is” with “she”.'],
      ['Tom and Ben ___ outside.', ['are', 'is', 'am'], 'are', 'Two people go with “are”.'],
      ['It ___ raining.', ['is', 'am', 'are'], 'is', 'Use “is” with “it”.'],
    ],
    normal: [
      ['After football, the children ___ tired.', ['are', 'is', 'am'], 'are', '“Children” is plural, so use “are”.'],
      ['I ___ excited because today is sports day.', ['am', 'are', 'is'], 'am', 'Use “am” with “I”.'],
      ['Which sentence is correct?', ['The soup is hot.', 'The soup are hot.'], 'The soup is hot.', 'Soup is one thing here, so use “is”.'],
      ['Mum and I ___ baking a cake.', ['are', 'am', 'is'], 'are', '“Mum and I” means we, so use “are”.'],
      ['The pair of shoes ___ by the door.', ['is', 'are', 'am'], 'is', 'The subject “pair” is singular, so use “is”.'],
      ['Complete Mia’s reply: “Yes, I ___ ready.”', ['am', 'is', 'are'], 'am', 'A speaker uses “I am”.'],
      ['Which classroom notice is correct?', ['You are welcome here.', 'You is welcome here.'], 'You are welcome here.', 'Use “are” with “you”.'],
      ['There ___ three birds on the fence.', ['are', 'is', 'am'], 'are', 'Use “are” because three birds are plural.'],
      ['My favourite book ___ on the shelf.', ['is', 'are', 'am'], 'is', 'One book goes with “is”.'],
      ['The weather ___ cold, but we ___ warm inside.', ['is; are', 'are; is', 'am; are'], 'is; are', 'Use “is” with weather and “are” with we.'],
    ],
    challenge: [
      ['Which sentence needs fixing?', ['I am early.', 'They is waiting.', 'She is inside.'], 'They is waiting.', 'Say “They are waiting.”'],
      ['Choose the best correction for “The puppies is hungry.”', ['The puppies are hungry.', 'The puppies am hungry.'], 'The puppies are hungry.', 'Puppies is plural, so use “are”.'],
      ['Ava says, “My brother and I am ready.” What should she say?', ['My brother and I are ready.', 'My brother and I is ready.'], 'My brother and I are ready.', '“My brother and I” means we, so use “are”.'],
      ['Which pair of sentences is correct?', ['The bus is late. The children are waiting.', 'The bus are late. The children is waiting.'], 'The bus is late. The children are waiting.', 'Use “is” for one bus and “are” for the children.'],
      ['Fill both blanks: I ___ in the team, and my friends ___ too.', ['am; are', 'are; is', 'is; am'], 'am; are', 'Use “am” with I and “are” with friends.'],
      ['Find the sentence with correct agreement.', ['Each child is holding a pencil.', 'Each child are holding a pencil.'], 'Each child is holding a pencil.', '“Each child” means one child at a time, so use “is”.'],
      ['Which correction keeps the meaning of “You is very helpful”?', ['You are very helpful.', 'You am very helpful.'], 'You are very helpful.', 'Use “are” with “you”.'],
      ['The scissors ___ on the table. Choose the standard sentence.', ['are', 'is', 'am'], 'are', '“Scissors” normally takes “are”.'],
      ['Which mini-dialogue is correct?', ['“Are you ready?” “Yes, I am.”', '“Is you ready?” “Yes, I are.”'], '“Are you ready?” “Yes, I am.”', 'Questions use “are” with you; replies use “am” with I.'],
      ['Complete both ideas: The rice ___ hot, and the plates ___ clean.', ['is; are', 'are; is', 'am; are'], 'is; are', 'Use “is” with rice and “are” with plates.'],
    ],
  }),

  'can-or-cant': makeSimpleBank('ability', ['can', "can't"], {
    easy: [
      ['A duck ___ swim across the pond.', 'can'], ['A stone ___ eat an apple.', "can't"], ['Ben ___ tie his shoes.', 'can'], ['A chair ___ jump over a rope.', "can't"], ['We ___ learn new words.', 'can'],
      ['A pencil ___ speak to you.', "can't"], ['Mia ___ draw a rainbow.', 'can'], ['A toy car ___ cook dinner.', "can't"], ['Birds ___ build nests.', 'can'], ['A sandwich ___ read a book.', "can't"],
    ],
    normal: [
      ['It is raining, but we ___ play a board game indoors.', 'can'], ['The gate is locked, so Sam ___ open it without the key.', "can't"], ['Choose the word that makes sense: A guide dog ___ help its owner.', 'can'], ['My cup is empty, so I ___ drink from it yet.', "can't"], ['Lily practises every day. Now she ___ play the song.', 'can'],
      ['The baby is asleep, so it ___ answer the phone.', "can't"], ['With a torch, we ___ see inside the dark tent.', 'can'], ['Tom forgot his boots, so he ___ walk through the puddle safely.', "can't"], ['A calculator ___ help us check a sum.', 'can'], ['The ice is too thin; we ___ skate on it safely.', "can't"],
    ],
    challenge: [
      ['Fix the meaning: “A fish can ride a bicycle.” Which word should replace “can”?', "can't"], ['Which word completes a true sentence? After lessons, children ___ improve with practice.', 'can'], ['The sign says the playground is closed. We ___ use it today.', "can't"], ['Mia has permission and a helmet, so she ___ ride her bicycle.', 'can'], ['Find the sensible completion: A map ___ show us where the library is.', 'can'],
      ['The batteries are flat, so the toy ___ move now.', "can't"], ['Although Ben is young, he ___ ask an adult for help.', 'can'], ['A plant needs sunlight, but it ___ walk towards the window.', "can't"], ['Complete the safety rule: You ___ cross until the light is green.', "can't"], ['The puzzle looks difficult, but we ___ solve it together.', 'can'],
    ],
  }, (answer) => answer === 'can' ? 'Use “can” for something that is possible or an ability.' : 'Use “can’t” for something that is not possible or allowed.'),

  'who-is-it': makeSimpleBank('who', ['I', 'you', 'he', 'she', 'it', 'we', 'they'], {
    easy: [
      ['I am speaking about myself. Which pronoun do I use?', 'I'], ['Mum speaks directly to Ben: “___ are helpful.”', 'you'], ['Tom has a football. ___ kicks it.', 'he'], ['Lily is painting. ___ uses blue.', 'she'], ['The bell is ringing. ___ is loud.', 'it'],
      ['Sam and I share a desk. ___ keep it tidy.', 'we'], ['The dogs are hungry. ___ need food.', 'they'], ['Choose the pronoun for the person listening to you.', 'you'], ['Ava and Mia are friends. ___ play together.', 'they'], ['My brother and I are ready. ___ have our bags.', 'we'],
    ],
    normal: [
      ['Dad asks me, “Can ___ carry this?”', 'you'], ['I packed my own lunch. ___ am ready.', 'I'], ['The robot needs charging because ___ has no power.', 'it'], ['Ben and Tom found a ball. ___ returned it.', 'they'], ['Maya and I made soup. ___ cooked together.', 'we'],
      ['Our teacher points to Nora. “___ has the answer,” she says.', 'she'], ['The coach speaks to the whole team: “___ played well.”', 'you'], ['Uncle Ali tells jokes. ___ makes us laugh.', 'he'], ['The leaves are falling. ___ cover the path.', 'they'], ['I tell Sam, “___ can sit beside me.”', 'you'],
    ],
    challenge: [
      ['Fix “Mia and I are partners. They work together.” Which pronoun fits?', 'we'], ['A speaker says, “___ am eight years old.”', 'I'], ['The coach asks Lily, “Can ___ lead the warm-up?”', 'you'], ['Ben has a kitten. ___ feeds it each morning.', 'he'], ['The twins wave from the bus. ___ look excited.', 'they'],
      ['Which pronoun replaces “the old computer”?', 'it'], ['Mum and I visit the market. ___ buy fruit.', 'we'], ['Ava wins the race. ___ feels proud.', 'she'], ['Fix “Tom and Ali are here. We are waiting outside.” when the speaker is not with them.', 'they'], ['The words are addressed to the reader: “___ can try again.”', 'you'],
    ],
  }, (answer) => `“${answer}” matches who is speaking, listening, or being discussed.`),

  'whose-is-it': makeSimpleBank('whose', ['my', 'your', 'his', 'her', 'our', 'their'], {
    easy: [
      ['I own this pencil. It is ___ pencil.', 'my'], ['You brought the book. It is ___ book.', 'your'], ['The cap belongs to Ben. It is ___ cap.', 'his'], ['Mia owns the red bag. It is ___ bag.', 'her'], ['My family and I live here. It is ___ home.', 'our'],
      ['The children have bicycles. They are ___ bicycles.', 'their'], ['I packed these shoes. They are ___ shoes.', 'my'], ['You drew the star. It is ___ picture.', 'your'], ['Dad has a mug. It is ___ mug.', 'his'], ['Lily found her coat. It is ___ coat.', 'her'],
    ],
    normal: [
      ['Sam and I built this model together. It is ___ model.', 'our'], ['The birds made a nest. It is ___ nest.', 'their'], ['I left a name label on ___ lunch box.', 'my'], ['Mum asks you, “Is this ___ scarf?”', 'your'], ['Omar parks ___ bicycle by the gate.', 'his'],
      ['Ava lends me ___ favourite storybook.', 'her'], ['Our class painted this mural. It is ___ artwork.', 'our'], ['The players put ___ bags beside the bench.', 'their'], ['You and I share this project. It is ___ project.', 'our'], ['I return Tom’s ruler to ___ desk.', 'his'],
    ],
    challenge: [
      ['Fix “Mia owns the kite. It is his kite.” Which word is needed?', 'her'], ['Lina and I wrote the song. It is ___ song.', 'our'], ['The puppies sleep in ___ basket.', 'their'], ['A teacher speaks to you: “Please open ___ notebook.”', 'your'], ['I made this card by myself. It is ___ card.', 'my'],
      ['Ben and his brother share a room. It is ___ room.', 'their'], ['Dad cannot find the keys that belong to him. They are ___ keys.', 'his'], ['Nora brings the lunch she packed. It is ___ lunch.', 'her'], ['Fix “We planted the garden. It is their garden.” when the speaker belongs to the group.', 'our'], ['I ask you about the coat you own: “Is that ___ coat?”', 'your'],
    ],
  }, (answer) => `“${answer}” shows who owns the object.`),

  'where-is-it': makeSimpleBank('where', ['in', 'on', 'under', 'behind', 'in front of', 'next to'], {
    easy: [
      ['The apple is inside the lunch box. It is ___ the box.', 'in'], ['The book rests on top of the desk. It is ___ the desk.', 'on'], ['The ball rolls below the chair. It is ___ the chair.', 'under'], ['The puppy hides at the back of the sofa. It is ___ the sofa.', 'behind'], ['The teacher stands before the class. She is ___ the class.', 'in front of'],
      ['The pencil lies beside the ruler. It is ___ the ruler.', 'next to'], ['Milk is kept inside the fridge. It is ___ the fridge.', 'in'], ['The hat sits on top of Ben’s head. It is ___ his head.', 'on'], ['Shoes are below the bed. They are ___ the bed.', 'under'], ['The bicycle is beside the gate. It is ___ the gate.', 'next to'],
    ],
    normal: [
      ['Mia cannot see the rabbit because it is hiding ___ the tree.', 'behind'], ['The bus stops before the school gate. It waits ___ the gate.', 'in front of'], ['Put the crayons inside the pot. The crayons belong ___ the pot.', 'in'], ['A calendar hangs against the wall. It is ___ the wall.', 'on'], ['Sam sits beside Lily during lunch. He is ___ Lily.', 'next to'],
      ['The cat crawls below the blanket. It is ___ the blanket.', 'under'], ['The garden is at the back of the house. It is ___ the house.', 'behind'], ['The actor stands before the curtain. She is ___ the curtain.', 'in front of'], ['The spoon is inside the bowl, not beside it. It is ___ the bowl.', 'in'], ['The lamp stands beside the bed. It is ___ the bed.', 'next to'],
    ],
    challenge: [
      ['Fix “The keys are on the drawer” when the keys are inside it. Which word is needed?', 'in'], ['A child is hidden by a wall and cannot be seen. The child is ___ the wall.', 'behind'], ['The trophy is displayed on top of the shelf. Choose the precise word.', 'on'], ['The teacher faces the pupils from the front of the room. She stands ___ them.', 'in front of'], ['A bag touches the floor below the table. It is ___ the table.', 'under'],
      ['The red house and blue house share a fence. The red house is ___ the blue house.', 'next to'], ['Which word completes the route: “Wait ___ the cinema, not at the back”?', 'in front of'], ['The toy is hidden inside a closed cupboard. It is ___ the cupboard.', 'in'], ['Mia stands beside Tom for the photograph. She is ___ Tom.', 'next to'], ['A fox disappears at the back of the bushes. It is ___ the bushes.', 'behind'],
    ],
  }, (answer) => `“${answer}” describes the position given in the clue.`),

  'this-that-these-those': makeSimpleBank('demonstrative', ['this', 'that', 'these', 'those'], {
    easy: [
      ['I am holding one cup. ___ cup is warm.', 'this'], ['Point to one tree far away. ___ tree is tall.', 'that'], ['The two pencils in my hand are sharp. ___ pencils are mine.', 'these'], ['Look at the birds far across the lake. ___ birds are ducks.', 'those'], ['Here is one toy for you to examine. ___ toy is new.', 'this'],
      ['Can you see one cloud over the distant hill? ___ cloud is dark.', 'that'], ['The apples here on my plate are sweet. ___ apples are fresh.', 'these'], ['The boats far out at sea look small. ___ boats have sails.', 'those'], ['Touch the book beside you. ___ book has pictures.', 'this'], ['Point to the far playground. ___ playground is busy.', 'that'],
    ],
    normal: [
      ['Mia holds up several shells and says, “___ shells are beautiful.”', 'these'], ['Sam points across the field: “___ horse is running.”', 'that'], ['I pick up one wet sock. “___ sock needs drying.”', 'this'], ['The stars far above us are bright. ___ stars form a pattern.', 'those'], ['Which word fits one nearby sandwich: “___ sandwich is mine”?', 'this'],
      ['The mountains on the horizon have snow. ___ mountains are far away.', 'those'], ['Ben places three cards on the desk in front of him. ___ cards are ready.', 'these'], ['A single kite is high in the distance. ___ kite is red.', 'that'], ['The cookies on this tray smell lovely. ___ cookies are warm.', 'these'], ['Look at one bus at the end of the road. ___ bus is ours.', 'that'],
    ],
    challenge: [
      ['Fix “These pencil in my hand is sharp.” Which word should begin it?', 'this'], ['Several clouds far away look dark. Which word points to them?', 'those'], ['A child points to one nearby puppy. Complete: “___ puppy is friendly.”', 'this'], ['Choose the word for several shoes beside the speaker.', 'these'], ['One lighthouse is visible far across the bay. ___ lighthouse flashes at night.', 'that'],
      ['Fix “That apples here are fresh.” Which word is needed?', 'these'], ['The speaker means many children on the far side of the playground. Choose the word.', 'those'], ['Complete the contrast: “This cup here is mine; ___ cup over there is yours.”', 'that'], ['Complete the contrast: “These crayons here are mine; ___ crayons across the table are yours.”', 'those'], ['A teacher holds several books and asks, “Who needs ___ books?”', 'these'],
    ],
  }, (answer) => `Use “${answer}” for the number of things and whether they are near or far.`),

  'has-or-have': makeSimpleBank('have', ['has', 'have'], {
    easy: [
      ['She ___ a red backpack.', 'has'], ['They ___ two footballs.', 'have'], ['I ___ a new pencil.', 'have'], ['Our dog ___ a long, curly tail.', 'has'], ['We ___ lunch at school.', 'have'],
      ['Ben ___ a blue bicycle.', 'has'], ['You ___ a kind smile.', 'have'], ['The birds ___ small wings.', 'have'], ['My classroom ___ a reading corner.', 'has'], ['Mia and Tom ___ matching sun hats.', 'have'],
    ],
    normal: [
      ['After art class, I ___ paint on my hands.', 'have'], ['The new library ___ hundreds of books.', 'has'], ['Our team members ___ numbers on their shirts.', 'have'], ['Lily ___ piano practice on Saturday.', 'has'], ['You and I ___ similar ideas for the poster.', 'have'],
      ['Each puppy ___ its own bowl.', 'has'], ['The trees ___ bright leaves in spring.', 'have'], ['My brother ___ a loose tooth.', 'has'], ['We ___ enough chairs for everyone.', 'have'], ['The toy car ___ a button underneath.', 'has'],
    ],
    challenge: [
      ['Fix “The children has clean hands.” Which word is needed?', 'have'], ['Complete both ideas: Mia ___ a kite, and her friends ___ one too. Which word fills the first blank?', 'has'], ['A pair of boots ___ a price label. Choose the verb for the subject “pair”.', 'has'], ['Neither choice is about ownership: We ___ dinner at six. Which verb fits?', 'have'], ['Which word agrees with “every child” in “Every child ___ a turn”?', 'has'],
      ['Fix “My dad and mum has tickets.” Which word replaces “has”?', 'have'], ['The news report ___ a weather map. Choose the standard form.', 'has'], ['I ___ a question about the homework. Which form follows “I”?', 'have'], ['The red bicycle, along with two scooters, ___ a bell. Which word agrees with “bicycle”?', 'has'], ['Complete: You ___ two choices in this game.', 'have'],
    ],
  }, (answer) => `Use “${answer}” with the subject in this sentence.`),
};

