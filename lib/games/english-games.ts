import { gameDifficulties, type EnglishGame, type GameDifficulty, type GameQuestion } from './types';
import { articleGameQuestions } from './article-questions';
import { levelOneQuestionExpansions } from './level-one-expansions';

const q = (id: string, prompt: string, choices: readonly string[], correctAnswer: string, explanation: string, illustration: string | undefined, difficulty: GameDifficulty): GameQuestion =>
  ({ id, prompt, choices, correctAnswer, explanation, illustration, difficulty });

const oneManyItems = [
  ['1 cat', 'one', '🐱'], ['2 cats', 'many', '🐱🐱'], ['1 apple', 'one', '🍎'], ['3 apples', 'many', '🍎🍎🍎'],
  ['1 book', 'one', '📘'], ['4 books', 'many', '📚'], ['1 star', 'one', '⭐'], ['5 stars', 'many', '⭐⭐⭐'],
  ['1 dog', 'one', '🐶'], ['2 dogs', 'many', '🐶🐶'], ['1 ball', 'one', '⚽'], ['3 balls', 'many', '⚽⚽⚽'],
  ['1 flower', 'one', '🌼'], ['4 flowers', 'many', '🌼🌼🌼'], ['1 pencil', 'one', '✏️'], ['2 pencils', 'many', '✏️✏️'],
  ['1 bird', 'one', '🐦'], ['3 birds', 'many', '🐦🐦🐦'], ['1 cup', 'one', '🥤'], ['5 cups', 'many', '🥤🥤🥤'],
] as const;

const heSheIt = [
  ['Tom has a red cap. ___ likes it.', 'he'], ['Sara is reading. ___ has a book.', 'she'], ['The dog is hungry. ___ wants food.', 'it'], ['Adam can swim. ___ is in the pool.', 'he'],
  ['Maya has a kite. ___ flies it.', 'she'], ['The ball is under the chair. ___ is blue.', 'it'], ['Ben is my friend. ___ is kind.', 'he'], ['Lina can sing. ___ knows this song.', 'she'],
  ['A bird is in the tree. ___ is singing.', 'it'], ['Omar drew a robot. ___ used a blue pencil.', 'he'], ['Aisha is my friend. ___ plays with me.', 'she'], ['The book is on the desk. ___ is new.', 'it'],
  ['Leo is swimming. ___ is fast.', 'he'], ['Nora is smiling. ___ is happy.', 'she'], ['The bus is here. ___ is yellow.', 'it'], ['Sam is kicking the ball. ___ likes football.', 'he'],
  ['Mei is painting. ___ uses bright colours.', 'she'], ['The flower needs water. ___ looks dry.', 'it'], ['Jack is wearing a hat. ___ is ready to go.', 'he'], ['Priya is opening the door. ___ has the key.', 'she'],
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
  ['I am holding a pencil. ___ can write with it.', 'I'], ['I tell Sam, “___ may choose a game.”', 'you'], ['Tom is my brother. ___ is kind.', 'he'],
  ['Mina is reading. ___ likes books.', 'she'], ['The robot is new. ___ can move.', 'it'], ['Sara and I are playing. ___ are a team.', 'we'],
  ['Tom and Ali are friends. ___ play together.', 'they'], ['I am seven. ___ like drawing.', 'I'], ['Mum says to me, “___ are ready.”', 'you'],
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
  ['The apple is ___ the bowl.', 'in'], ['The book is ___ the table.', 'on'], ['The shoes are ___ the bed.', 'under'],
  ['The toy is ___ the box.', 'in'], ['The cup is ___ the tray.', 'on'], ['The ball is ___ the chair.', 'under'],
  ['The fish is ___ the water.', 'in'], ['The cap is ___ the shelf.', 'on'], ['The puppy is ___ the table.', 'under'],
  ['The pencils are ___ the bag.', 'in'], ['The bus is waiting ___ the school.', 'in front of'], ['The pencil is ___ the notebook.', 'next to'],
  ['The toys are ___ the box.', 'in'], ['The picture hangs ___ the wall.', 'on'], ['The cat sleeps ___ the blanket.', 'under'],
  ['The garden is ___ the house.', 'behind'], ['The speaker stands ___ the audience.', 'in front of'], ['The tree is ___ the playground.', 'next to'],
  ['The milk is ___ the fridge.', 'in'], ['The hat is ___ his head.', 'on'],
] as const;

const demonstratives = [
  ['I am holding one pencil. ___ pencil is sharp.', 'this'], ['Look at the one kite high in the distance. ___ kite is red.', 'that'], ['The apples beside me are fresh. ___ apples are for our snack.', 'these'], ['See the stars far above us? ___ stars are bright.', 'those'],
  ['I have one book in my hand. ___ book is mine.', 'this'], ['Look at the tall tree across the field. ___ tree has a nest.', 'that'], ['The shoes by my feet are clean. ___ shoes are new.', 'these'], ['The mountains far away look blue. ___ mountains have snow.', 'those'],
  ['Smell the flower I am holding. ___ flower is lovely.', 'this'], ['The bus at the end of the road is late. ___ bus is ours.', 'that'], ['The cookies on this plate are warm. ___ cookies smell good.', 'these'], ['Can you see the birds across the lake? ___ birds are flying.', 'those'],
  ['I am showing you one toy. ___ toy is new.', 'this'], ['The house on the far hill has a red roof. ___ house is large.', 'that'], ['The crayons here on my desk are colourful. ___ crayons are mine.', 'these'], ['The boats far out at sea look small. ___ boats have white sails.', 'those'],
  ['The cup in my hand is full. ___ cup has milk in it.', 'this'], ['See the dark cloud far over the town? ___ cloud may bring rain.', 'that'], ['The socks beside me are soft. ___ socks are clean.', 'these'], ['The children across the playground are waving. ___ children are my friends.', 'those'],
] as const;

const hasHave = [
  ['She ___ a red bag.', 'has'], ['They ___ two cats.', 'have'], ['I ___ a pencil.', 'have'], ['He ___ a blue bicycle.', 'has'],
  ['We ___ a new teacher.', 'have'], ['The dog ___ a long tail.', 'has'], ['You ___ a lovely smile.', 'have'], ['Maya ___ a storybook.', 'has'],
  ['Tom and Ben ___ football practice.', 'have'], ['My school ___ a library.', 'has'], ['I ___ an orange.', 'have'], ['The children ___ clean hands.', 'have'],
  ['Dad ___ a green car.', 'has'], ['Our classroom ___ twenty chairs.', 'has'], ['You ___ good ideas.', 'have'], ['The bird ___ two wings.', 'has'],
  ['We ___ lunch at noon.', 'have'], ['Sara ___ a little brother.', 'has'], ['The trees ___ green leaves.', 'have'], ['It ___ four legs.', 'has'],
] as const;

const fixed = (prefix: string, rows: readonly (readonly [string, string])[], choices: readonly string[], explanation: (answer: string, prompt: string) => string) =>
  rows.map(([prompt, answer], index) => q(`${prefix}-${index + 1}`, prompt, choices, answer, explanation(answer, prompt), undefined, index < 10 ? 'easy' : 'normal'));

type ChallengeRow = readonly [prompt: string, choices: readonly string[], answer: string];
const challengePool = (prefix: string, rows: readonly ChallengeRow[]) => rows.map(([prompt, choices, answer], index) =>
  q(`${prefix}-challenge-${index + 1}`, prompt, choices, answer, `“${answer}” makes this example correct. Read it once more to hear the pattern.`, undefined, 'challenge'));

const challengeQuestions: Record<string, readonly GameQuestion[]> = {
  'one-or-many': challengePool('number', [
    ['Two dogs are playing. Which phrase names them correctly?', ['Two dog', 'Two dogs'], 'Two dogs'],
    ['Only one cat is sleeping. Choose the correct phrase.', ['One cat', 'One cats'], 'One cat'],
    ['Mia carries three books. Which label belongs on her pile?', ['Three book', 'Three books'], 'Three books'],
    ['There is a single flower in the pot. What should we say?', ['One flower', 'One flowers'], 'One flower'],
    ['Four stars shine in the picture. Choose the matching phrase.', ['Four star', 'Four stars'], 'Four stars'],
    ['Ben needs just one pencil. Which phrase is correct?', ['One pencil', 'One pencils'], 'One pencil'],
    ['You can see two birds in the tree. How do we name them?', ['Two bird', 'Two birds'], 'Two birds'],
    ['There is one cup on the tray. Find the correct phrase.', ['One cup', 'One cups'], 'One cup'],
    ['Five apples are in the bowl. Which answer sounds right?', ['Five apple', 'Five apples'], 'Five apples'],
    ['The box holds one ball. Choose the phrase without a mistake.', ['One ball', 'One balls'], 'One ball'],
  ]),
  'he-she-it': challengePool('pronoun', [
    ['My sister has a book. ___ is reading.', ['he', 'she', 'it'], 'she'],
    ['The red bus is here. ___ is late.', ['he', 'she', 'it'], 'it'],
    ['Omar found his shoes. ___ is ready.', ['he', 'she', 'it'], 'he'],
    ['The kitten is hungry. ___ wants milk.', ['he', 'she', 'it'], 'it'],
    ['Maya rides to school. ___ has a helmet.', ['he', 'she', 'it'], 'she'],
    ['My uncle cooks dinner. ___ makes soup.', ['he', 'she', 'it'], 'he'],
    ['The clock is noisy. ___ rings loudly.', ['he', 'she', 'it'], 'it'],
    ['Aisha has a kite. ___ flies it outside.', ['he', 'she', 'it'], 'she'],
    ['Ben helps his friend. ___ is kind.', ['he', 'she', 'it'], 'he'],
    ['A flower has not been watered. ___ looks dry.', ['he', 'she', 'it'], 'it'],
  ]),
  'is-am-are': challengePool('be', [
    ['Mia and Tom ___ my friends.', ['is', 'am', 'are'], 'are'],
    ['My little brother ___ five.', ['is', 'am', 'are'], 'is'],
    ['I ___ ready, but my shoes are missing.', ['is', 'am', 'are'], 'am'],
    ['The puppies ___ asleep in the basket.', ['is', 'am', 'are'], 'are'],
    ['Our classroom ___ bright and tidy.', ['is', 'am', 'are'], 'is'],
    ['You and I ___ on the same team.', ['is', 'am', 'are'], 'are'],
    ['I ___ happy because it is sunny.', ['is', 'am', 'are'], 'am'],
    ['The red apple ___ beside the bananas.', ['is', 'am', 'are'], 'is'],
    ['Dad and Mum ___ making dinner.', ['is', 'am', 'are'], 'are'],
    ['The children in my class ___ helpful.', ['is', 'am', 'are'], 'are'],
  ]),
  'can-or-cant': challengePool('ability', [
    ['Which bird sentence tells us a real ability?', ['A bird can build a nest.', "A bird can't fly."], 'A bird can build a nest.'],
    ['What can a fish really do?', ['A fish can swim.', 'A fish can ride a bicycle.'], 'A fish can swim.'],
    ['Choose the sensible sentence about a pencil.', ['A pencil can write by itself.', "A pencil can't talk."], "A pencil can't talk."],
    ['A baby is too young to drive. Which sentence matches?', ['A baby can drive a car.', "A baby can't drive a car."], "A baby can't drive a car."],
    ['Which sentence describes something a frog can do?', ['A frog can jump.', "A frog can't move."], 'A frog can jump.'],
    ['A book is not alive. Which sentence makes sense?', ['A book can bark.', "A book can't eat."], "A book can't eat."],
    ['Choose the real ability of a monkey.', ['A monkey can climb.', "A monkey can't see."], 'A monkey can climb.'],
    ['What is true about a chair?', ['A chair can run.', "A chair can't run."], "A chair can't run."],
    ['Which duck sentence makes sense?', ['A duck can swim.', "A duck can't walk."], 'A duck can swim.'],
    ['Children gain skills as they practise. Which sentence fits?', ['A child can learn.', "A child can't speak."], 'A child can learn.'],
  ]),
  'who-is-it': challengePool('who', [
    ['Mina and I share a desk. ___ keep it tidy.', ['I', 'you', 'he', 'she', 'it', 'we', 'they'], 'we'],
    ['The twins have new bikes. ___ ride together.', ['I', 'you', 'he', 'she', 'it', 'we', 'they'], 'they'],
    ['Mum speaks to me: “___ can choose a book.”', ['I', 'you', 'he', 'she', 'it', 'we', 'they'], 'you'],
    ['The puppy found a ball. ___ plays with it.', ['I', 'you', 'he', 'she', 'it', 'we', 'they'], 'it'],
    ['My brother is helping Dad. ___ carries a box.', ['I', 'you', 'he', 'she', 'it', 'we', 'they'], 'he'],
    ['Ava made a card. ___ gives it to Nan.', ['I', 'you', 'he', 'she', 'it', 'we', 'they'], 'she'],
    ['My friends and I practise. ___ want to improve.', ['I', 'you', 'he', 'she', 'it', 'we', 'they'], 'we'],
    ['The birds are on the roof. ___ are singing.', ['I', 'you', 'he', 'she', 'it', 'we', 'they'], 'they'],
    ['I packed my lunch. ___ am ready for school.', ['I', 'you', 'he', 'she', 'it', 'we', 'they'], 'I'],
    ['The coach asks Leo: “Can ___ lead the team?”', ['I', 'you', 'he', 'she', 'it', 'we', 'they'], 'you'],
  ]),
  'whose-is-it': challengePool('whose', [
    ['Lina and I made this poster. It is ___ poster.', ['my', 'your', 'his', 'her', 'our', 'their'], 'our'],
    ['Tom left his cap here. It is ___ cap.', ['my', 'your', 'his', 'her', 'our', 'their'], 'his'],
    ['The children packed lunches. These are ___ lunches.', ['my', 'your', 'his', 'her', 'our', 'their'], 'their'],
    ['Maya owns the red bicycle. It is ___ bicycle.', ['my', 'your', 'his', 'her', 'our', 'their'], 'her'],
    ['I drew both pictures. They are ___ pictures.', ['my', 'your', 'his', 'her', 'our', 'their'], 'my'],
    ['You brought this notebook. It is ___ notebook.', ['my', 'your', 'his', 'her', 'our', 'their'], 'your'],
    ['Dad found his keys. They are ___ keys.', ['my', 'your', 'his', 'her', 'our', 'their'], 'his'],
    ['Our family shares the garden. It is ___ garden.', ['my', 'your', 'his', 'her', 'our', 'their'], 'our'],
    ['The birds built that nest. It is ___ nest.', ['my', 'your', 'his', 'her', 'our', 'their'], 'their'],
    ['Sara packed the bag herself. It is ___ bag.', ['my', 'your', 'his', 'her', 'our', 'their'], 'her'],
  ]),
  'where-is-it': challengePool('where', [
    ['The keys are hidden ___ the cushion where we cannot see them.', ['in', 'on', 'under', 'behind', 'in front of', 'next to'], 'under'],
    ['The teacher stands ___ the board to speak to us.', ['in', 'on', 'under', 'behind', 'in front of', 'next to'], 'in front of'],
    ['The bicycle is parked ___ the garage wall.', ['in', 'on', 'under', 'behind', 'in front of', 'next to'], 'next to'],
    ['The rabbit is hiding ___ the tree trunk.', ['in', 'on', 'under', 'behind', 'in front of', 'next to'], 'behind'],
    ['The fruit is kept ___ the kitchen bowl.', ['in', 'on', 'under', 'behind', 'in front of', 'next to'], 'in'],
    ['The calendar hangs ___ the classroom wall.', ['in', 'on', 'under', 'behind', 'in front of', 'next to'], 'on'],
    ['The school bag is ___ the desk, near my feet.', ['in', 'on', 'under', 'behind', 'in front of', 'next to'], 'under'],
    ['The bus stops ___ the school gate.', ['in', 'on', 'under', 'behind', 'in front of', 'next to'], 'in front of'],
    ['The spoon is ___ the plate on the table.', ['in', 'on', 'under', 'behind', 'in front of', 'next to'], 'next to'],
    ['The toys are packed ___ a large box.', ['in', 'on', 'under', 'behind', 'in front of', 'next to'], 'in'],
  ]),
  'this-that-these-those': challengePool('demonstrative', [
    ['I am holding one sandwich. ___ sandwich is mine.', ['this', 'that', 'these', 'those'], 'this'],
    ['The clouds far across the valley look dark. ___ clouds may bring rain.', ['this', 'that', 'these', 'those'], 'those'],
    ['The pencils here beside me need sharpening. ___ pencils are blunt.', ['this', 'that', 'these', 'those'], 'these'],
    ['Look at the playground across the road. ___ playground is new.', ['this', 'that', 'these', 'those'], 'that'],
    ['The puppy at my feet is friendly. ___ puppy wants to play.', ['this', 'that', 'these', 'those'], 'this'],
    ['The children on the far side of the field are waving. ___ children are my friends.', ['this', 'that', 'these', 'those'], 'those'],
    ['The cookies on this plate smell lovely. ___ cookies are warm.', ['this', 'that', 'these', 'those'], 'these'],
    ['See the kite high above the distant trees? ___ kite is Ben’s.', ['this', 'that', 'these', 'those'], 'that'],
    ['The shoes next to me belong to Mia. ___ shoes are wet.', ['this', 'that', 'these', 'those'], 'these'],
    ['One boat far out at sea has a blue sail. ___ boat is fast.', ['this', 'that', 'these', 'those'], 'that'],
  ]),
  'has-or-have': challengePool('have', [
    ['Mia and Tom ___ matching hats.', ['has', 'have'], 'have'],
    ['My older sister ___ a new library book.', ['has', 'have'], 'has'],
    ['The puppies ___ soft brown fur.', ['has', 'have'], 'have'],
    ['Our school ___ two playgrounds.', ['has', 'have'], 'has'],
    ['You and I ___ the same idea.', ['has', 'have'], 'have'],
    ['The red bicycle ___ a small bell.', ['has', 'have'], 'has'],
    ['My friends ___ lunch at school.', ['has', 'have'], 'have'],
    ['Dad and Mum ___ tickets for the bus.', ['has', 'have'], 'have'],
    ['Each bird ___ two wings.', ['has', 'have'], 'has'],
    ['My brother and I ___ pencils for class.', ['has', 'have'], 'have'],
  ]),
};

const games: EnglishGame[] = [
  {
    id: 'grammar-a-or-an', slug: 'a-or-an', title: 'A or An?', shortDescription: 'Choose the correct article before a noun.',
    seoDescription: 'Practise using “a” and “an” with this free interactive English grammar game for children. Play 10 fun questions on any device.',
    category: 'Grammar', level: 1, access: 'free', icon: '🍎', instructions: 'Choose “a” or “an” to complete each phrase.',
    whatItTeaches: 'Children practise choosing the indefinite articles “a” and “an” by listening to the beginning sound of a familiar noun. The question bank uses simple objects, animals, foods, and people suitable for early primary learners.',
    learningObjective: 'By the end of a session, learners should recognise that “a” comes before a consonant sound and “an” comes before a vowel sound. Each answer includes a short reminder so mistakes become useful practice.',
    parentTip: 'Say each phrase aloud together. Stretch the first sound of the noun and ask whether it begins with a vowel sound. Focus on sound rather than asking children to memorise a list.',
    questions: articleGameQuestions,
  },
  {
    id: 'grammar-one-many', slug: 'one-or-many', title: 'One or Many?', shortDescription: 'Practise singular and plural nouns.',
    seoDescription: 'Help children practise singular and plural nouns with a free One or Many English grammar game containing 10 random questions.',
    category: 'Grammar', level: 1, access: 'free', icon: '🐱', instructions: 'Look at the number and noun, then choose “one” or “many”.',
    whatItTeaches: 'This game connects number clues with singular and regular plural nouns. Children see familiar examples such as one cat and two cats, helping them notice when a noun describes one thing or more than one.',
    learningObjective: 'Learners practise identifying one object as singular and two or more objects as plural. The examples reinforce the common Level 1 pattern of adding “s” to regular plural nouns.',
    parentTip: 'After each question, invite the child to say the phrase aloud. You can point to one nearby object and then a group of objects to make the idea concrete.',
    questions: oneManyItems.map(([item, answer, icon], i) => q(`number-${i + 1}`, i < 10 ? `${item}: one or many?` : `The phrase says “${item}”. Is it one or many?`, ['one', 'many'], answer, `${item} means ${answer} because the number shows ${answer === 'one' ? 'a single thing' : 'more than one thing'}.`, icon, i < 10 ? 'easy' : 'normal')),
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
  game.questions = [...game.questions, ...(challengeQuestions[game.slug] ?? []), ...(levelOneQuestionExpansions[game.slug] ?? [])];
  if (game.slug !== 'a-or-an') {
    game.questions = game.questions.map((question, index) => {
      const correctIndex = question.choices.indexOf(question.correctAnswer);
      const difficultyIndex = gameDifficulties.indexOf(question.difficulty);
      const desiredIndex = (index + difficultyIndex) % question.choices.length;
      const shift = (correctIndex - desiredIndex + question.choices.length) % question.choices.length;
      return { ...question, choices: [...question.choices.slice(shift), ...question.choices.slice(0, shift)] };
    });
  }
  for (const difficulty of gameDifficulties) {
    const count = game.questions.filter((question) => question.difficulty === difficulty).length;
    if (count < 10) throw new Error(`${game.slug} needs at least 10 ${difficulty} questions; found ${count}.`);
  }
  if (new Set(game.questions.map(({ id }) => id)).size !== game.questions.length) throw new Error(`${game.slug} has duplicate question IDs.`);
  const signatures = game.questions.map(({ prompt, choices }) => JSON.stringify([prompt, choices]));
  if (new Set(signatures).size !== game.questions.length) {
    const duplicate = signatures.find((signature, index) => signatures.indexOf(signature) !== index);
    throw new Error(`${game.slug} has a duplicate question: ${duplicate}`);
  }
  if (game.questions.some(({ choices, correctAnswer }) => !choices.includes(correctAnswer))) throw new Error(`${game.slug} has an answer missing from its choices.`);
}

export const englishGames = games;
export const getEnglishGame = (slug: string) => englishGames.find((game) => game.slug === slug);
export const englishGameDifficultyAudit = englishGames.map((game) => ({
  slug: game.slug,
  title: game.title,
  counts: Object.fromEntries(gameDifficulties.map((difficulty) => [difficulty, game.questions.filter((question) => question.difficulty === difficulty).length])) as Record<GameDifficulty, number>,
}));
