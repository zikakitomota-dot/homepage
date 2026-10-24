export type LifeClassification = 'living' | 'non-living';
export type LifeState = LifeClassification | 'once-living';
export type LivingQuestionType = 'identify' | 'sorting' | 'evidence' | 'detective';

export type LivingItem = {
  id: string;
  name: string;
  emoji: string;
  classification: LifeClassification;
  lifeState: LifeState;
  explanation: string;
};

type BaseQuestion = {
  id: string;
  type: LivingQuestionType;
  prompt: string;
  explanation: string;
  target: string;
  level: 'level-1';
};

export type ChoiceQuestion = BaseQuestion & {
  type: Exclude<LivingQuestionType, 'sorting'>;
  item: LivingItem;
  choices: readonly LifeClassification[];
  correctAnswer: LifeClassification;
};

export type SortingQuestion = BaseQuestion & {
  type: 'sorting';
  items: readonly LivingItem[];
};

export type LivingQuestion = ChoiceQuestion | SortingQuestion;
type RandomSource = () => number;

const item = (id: string, name: string, emoji: string, lifeState: LifeState, explanation: string): LivingItem => ({
  id, name, emoji, lifeState,
  classification: lifeState === 'living' ? 'living' : 'non-living',
  explanation,
});

const ITEMS = {
  cat: item('cat', 'Cat', '🐈', 'living', 'A cat is an animal. It needs food and water, grows and responds to its surroundings.'),
  oak: item('oak', 'Oak tree', '🌳', 'living', 'An oak is a plant. Plants grow, need water and carry out life processes even though they do not walk.'),
  rock: item('rock', 'Rock', '🪨', 'non-living', 'A rock does not grow through life processes, reproduce or need food and water.'),
  bicycle: item('bicycle', 'Bicycle', '🚲', 'non-living', 'A bicycle can move when someone powers it, but it is not an organism and does not carry out life processes.'),
  sunflower: item('sunflower', 'Sunflower', '🌻', 'living', 'A sunflower is a plant. It grows, uses water and responds to light.'),
  dog: item('dog', 'Dog', '🐕', 'living', 'A dog is an animal that grows, needs energy and responds to its environment.'),
  spoon: item('spoon', 'Metal spoon', '🥄', 'non-living', 'A spoon is manufactured and does not perform life processes.'),
  ball: item('ball', 'Ball', '⚽', 'non-living', 'A ball may roll, but it only moves when a force acts on it.'),
  mushroom: item('mushroom', 'Mushroom', '🍄', 'living', 'A mushroom is the visible part of a fungus. Fungi are living organisms that grow and use nutrients.'),
  butterfly: item('butterfly', 'Butterfly', '🦋', 'living', 'A butterfly is an animal. It grows from an egg and caterpillar and needs energy.'),
  toyCar: item('toy-car', 'Toy car', '🏎️', 'non-living', 'A toy car may move, but it does not grow, reproduce or carry out life processes.'),
  cloud: item('cloud', 'Cloud', '☁️', 'non-living', 'A cloud is made of tiny water droplets or ice crystals. It can change and move, but it is not alive.'),
  seed: item('seed', 'Bean seed', '🌱', 'living', 'A healthy dormant seed contains a living young plant. With suitable water, warmth and air, it can germinate and grow.'),
  coral: item('coral', 'Living coral', '🪸', 'living', 'Living coral colonies are made of tiny animals called polyps.'),
  fire: item('fire', 'Fire', '🔥', 'non-living', 'Fire can spread and use fuel, but it has no cells and is not an organism.'),
  robot: item('robot', 'Toy robot', '🤖', 'non-living', 'A robot can move and make sounds, but movement alone does not make something alive.'),
  fish: item('fish', 'Fish', '🐟', 'living', 'A fish is an animal that grows, uses energy and responds to its surroundings.'),
  cactus: item('cactus', 'Cactus', '🌵', 'living', 'A cactus is a plant. It grows and carries out life processes even though it stays rooted in one place.'),
  kite: item('kite', 'Kite', '🪁', 'non-living', 'A kite moves in the wind, but it is an object rather than an organism.'),
  chair: item('chair', 'Plastic chair', '🪑', 'non-living', 'A plastic chair is manufactured and does not carry out life processes.'),
  leafDead: item('dead-leaf', 'Fallen dead leaf', '🍂', 'once-living', 'The leaf was part of a living plant, but it is no longer alive. It is once-living material.'),
  woodTable: item('wood-table', 'Wooden table', '🪵', 'once-living', 'Wood came from a living tree, but a wooden table is not alive now. It is made from once-living material.'),
  paper: item('paper', 'Paper', '📄', 'once-living', 'Paper is made mostly from wood fibres that came from trees. It is not alive now.'),
  woolJumper: item('wool-jumper', 'Wool jumper', '🧥', 'once-living', 'Wool grew on a living sheep, but the jumper is not alive now.'),
  shell: item('empty-shell', 'Empty seashell', '🐚', 'once-living', 'An empty shell was made by a living animal, but the empty shell is not alive.'),
  feather: item('fallen-feather', 'Fallen feather', '🪶', 'once-living', 'A feather grew on a living bird. Once shed, the feather itself is not alive.'),
  cottonShirt: item('cotton-shirt', 'Cotton shirt', '👕', 'once-living', 'Cotton fibres grew on a living plant, but a cotton shirt is not alive now.'),
  pondPlant: item('pond-plant', 'Pond plant', '🌿', 'living', 'A pond plant is living. It grows and uses light, water and nutrients.'),
  snail: item('snail', 'Snail', '🐌', 'living', 'A snail is an animal that grows, needs food and responds to its surroundings.'),
  book: item('book', 'Book', '📕', 'once-living', 'Paper in a book came from trees, but the book is not alive now.'),
  cup: item('cup', 'Glass cup', '🥛', 'non-living', 'A glass cup is an object and does not carry out life processes.'),
  worm: item('worm', 'Earthworm', '🪱', 'living', 'An earthworm is an animal that grows, needs energy and responds to its environment.'),
  moon: item('moon', 'Moon', '🌙', 'non-living', 'The Moon moves through space, but it is not an organism and does not carry out life processes.'),
  fern: item('fern', 'Fern', '🌿', 'living', 'A fern is a plant that grows, uses water and reproduces.'),
  pencil: item('pencil', 'Wooden pencil', '✏️', 'once-living', 'The wood in a pencil came from a tree, but the pencil is not alive now.'),
  bee: item('bee', 'Bee', '🐝', 'living', 'A bee is an animal that grows, feeds and responds to its surroundings.'),
  river: item('river', 'River', '🌊', 'non-living', 'River water moves and supports life, but the river itself is not an organism.'),
  chick: item('chick', 'Chick', '🐤', 'living', 'A chick is a young animal. It grows, needs food and responds to its surroundings.'),
  lamp: item('lamp', 'Lamp', '💡', 'non-living', 'A lamp can give light when powered, but it does not carry out life processes.'),
  moss: item('moss', 'Moss', '🌱', 'living', 'Moss is a small plant. It grows and reproduces even though it stays in one place.'),
  iceCube: item('ice-cube', 'Ice cube', '🧊', 'non-living', 'An ice cube can melt and change shape, but physical change is not a life process.'),
  ant: item('ant', 'Ant', '🐜', 'living', 'An ant is an animal that grows, feeds and responds to its environment.'),
  boat: item('boat', 'Boat', '⛵', 'non-living', 'A boat can travel, but people, wind or a motor make it move.'),
  flower: item('flower', 'Flowering plant', '🌺', 'living', 'A flowering plant grows, uses water and can reproduce.'),
  brick: item('brick', 'Brick', '🧱', 'non-living', 'A brick is a manufactured object and does not carry out life processes.'),
  penguin: item('penguin', 'Penguin', '🐧', 'living', 'A penguin is an animal that grows, needs food and responds to its environment.'),
  clock: item('clock', 'Clock', '⏰', 'non-living', 'A clock has moving parts, but it is a machine and is not alive.'),
  grass: item('grass', 'Grass', '🌾', 'living', 'Grass is a plant. It grows and uses light, water and nutrients.'),
  car: item('car', 'Car', '🚗', 'non-living', 'A car uses fuel and moves, but it is a machine without cells or independent life processes.'),
  duck: item('duck', 'Duck', '🦆', 'living', 'A duck is an animal that grows, eats and responds to its surroundings.'),
  sand: item('sand', 'Sand', '🏖️', 'non-living', 'Sand grains are non-living mineral pieces. They do not grow through life processes.'),
  spider: item('spider', 'Spider', '🕷️', 'living', 'A spider is an animal that grows, feeds and responds to its environment.'),
  balloon: item('balloon', 'Balloon', '🎈', 'non-living', 'A balloon can rise or move in air, but it is not an organism.'),
  tulip: item('tulip', 'Tulip', '🌷', 'living', 'A tulip is a plant. It grows and responds to light and water.'),
  train: item('train', 'Toy train', '🚂', 'non-living', 'A toy train moves when powered or pushed, but it is not alive.'),
  rabbit: item('rabbit', 'Rabbit', '🐇', 'living', 'A rabbit is an animal that grows, eats and responds to its surroundings.'),
  star: item('star', 'Star', '⭐', 'non-living', 'A star gives off energy and changes over time, but it is not a cellular organism.'),
  ivy: item('ivy', 'Ivy plant', '🌿', 'living', 'Ivy is a plant. It grows and responds to light while remaining rooted.'),
  drum: item('drum', 'Drum', '🥁', 'non-living', 'A drum makes sound when struck, but sound does not make it alive.'),
} as const;

const q = (id: string, type: Exclude<LivingQuestionType, 'sorting'>, subject: LivingItem, prompt: string): ChoiceQuestion => ({
  id, type, item: subject, target: subject.id, prompt, correctAnswer: subject.classification,
  choices: ['living', 'non-living'], explanation: subject.explanation, level: 'level-1',
});

const identify: ChoiceQuestion[] = [
  q('identify-cat', 'identify', ITEMS.cat, 'Is this cat living or non-living?'), q('identify-oak', 'identify', ITEMS.oak, 'Is this oak tree living or non-living?'),
  q('identify-rock', 'identify', ITEMS.rock, 'Is this rock living or non-living?'), q('identify-bicycle', 'identify', ITEMS.bicycle, 'Is this bicycle living or non-living?'),
  q('identify-sunflower', 'identify', ITEMS.sunflower, 'Is this sunflower living or non-living?'), q('identify-dog', 'identify', ITEMS.dog, 'Is this dog living or non-living?'),
  q('identify-spoon', 'identify', ITEMS.spoon, 'Is this metal spoon living or non-living?'), q('identify-ball', 'identify', ITEMS.ball, 'Is this ball living or non-living?'),
  q('identify-mushroom', 'identify', ITEMS.mushroom, 'Is this mushroom living or non-living?'), q('identify-butterfly', 'identify', ITEMS.butterfly, 'Is this butterfly living or non-living?'),
  q('identify-toy-car', 'identify', ITEMS.toyCar, 'Is this toy car living or non-living?'), q('identify-cloud', 'identify', ITEMS.cloud, 'Is this cloud living or non-living?'),
  q('identify-seed', 'identify', ITEMS.seed, 'Is this healthy bean seed living or non-living?'), q('identify-coral', 'identify', ITEMS.coral, 'Is this living coral colony living or non-living?'),
  q('identify-fire', 'identify', ITEMS.fire, 'Is this fire living or non-living?'),
];

const sortingSets: readonly (readonly LivingItem[])[] = [
  [ITEMS.fish, ITEMS.kite, ITEMS.cactus, ITEMS.chair], [ITEMS.snail, ITEMS.book, ITEMS.pondPlant, ITEMS.cup],
  [ITEMS.worm, ITEMS.moon, ITEMS.fern, ITEMS.pencil], [ITEMS.bee, ITEMS.river, ITEMS.chick, ITEMS.lamp],
  [ITEMS.moss, ITEMS.iceCube, ITEMS.ant, ITEMS.boat], [ITEMS.flower, ITEMS.brick, ITEMS.penguin, ITEMS.clock],
  [ITEMS.grass, ITEMS.car, ITEMS.duck, ITEMS.sand], [ITEMS.spider, ITEMS.balloon, ITEMS.tulip, ITEMS.train],
  [ITEMS.rabbit, ITEMS.star, ITEMS.ivy, ITEMS.drum], [ITEMS.cat, ITEMS.rock, ITEMS.sunflower, ITEMS.toyCar],
  [ITEMS.butterfly, ITEMS.cloud, ITEMS.mushroom, ITEMS.bicycle], [ITEMS.seed, ITEMS.spoon, ITEMS.dog, ITEMS.ball],
  [ITEMS.coral, ITEMS.robot, ITEMS.oak, ITEMS.fire], [ITEMS.fish, ITEMS.paper, ITEMS.cactus, ITEMS.shell],
  [ITEMS.snail, ITEMS.feather, ITEMS.fern, ITEMS.woolJumper],
];

const sorting: SortingQuestion[] = sortingSets.map((items, index) => ({
  id: `sorting-${index + 1}`, type: 'sorting', items, target: `sorting-set-${index + 1}`,
  prompt: 'Sort every item into Living or Non-Living.',
  explanation: 'Living things are organisms that carry out life processes. Objects and once-living materials are non-living now.', level: 'level-1',
}));

const evidence: ChoiceQuestion[] = [
  q('evidence-plant-water', 'evidence', ITEMS.pondPlant, 'A pond plant grows and needs water and light. Is it living?'),
  q('evidence-robot-sound', 'evidence', ITEMS.robot, 'A toy robot moves and makes sounds when switched on. Is it living?'),
  q('evidence-seed-germinates', 'evidence', ITEMS.seed, 'A healthy seed is resting. With water and warmth, it can germinate. Is it living?'),
  q('evidence-cloud-moves', 'evidence', ITEMS.cloud, 'A cloud moves across the sky and changes shape. Is it living?'),
  q('evidence-fungus-grows', 'evidence', ITEMS.mushroom, 'A mushroom grows from a living fungus and uses nutrients. Is it living?'),
  q('evidence-fire-spreads', 'evidence', ITEMS.fire, 'A fire spreads when it has heat, oxygen and fuel. Is it living?'),
  q('evidence-coral-polyps', 'evidence', ITEMS.coral, 'This living coral colony is made of tiny feeding animals called polyps. Is it living?'),
  q('evidence-tree-rooted', 'evidence', ITEMS.oak, 'A tree stays rooted in one place but grows and responds to light. Is it living?'),
  q('evidence-river-flows', 'evidence', ITEMS.river, 'A river flows and can get wider after rain. Is the river itself living?'),
  q('evidence-chick-grows', 'evidence', ITEMS.chick, 'A chick eats, breathes and grows. Is it living?'),
  q('evidence-ice-melts', 'evidence', ITEMS.iceCube, 'An ice cube melts and changes shape in warmth. Is it living?'),
  q('evidence-moss-spores', 'evidence', ITEMS.moss, 'Moss grows and can make spores. Is it living?'),
  q('evidence-car-fuel', 'evidence', ITEMS.car, 'A car uses fuel and releases waste gases when its engine runs. Is it living?'),
  q('evidence-bee-responds', 'evidence', ITEMS.bee, 'A bee finds food, grows and responds to its surroundings. Is it living?'),
  q('evidence-clock-moves', 'evidence', ITEMS.clock, 'A clock has hands that move when its mechanism works. Is it living?'),
];

const detective: ChoiceQuestion[] = [
  q('detective-dead-leaf', 'detective', ITEMS.leafDead, 'A dry leaf fell from a tree and is dead. Is the leaf living now?'),
  q('detective-wood-table', 'detective', ITEMS.woodTable, 'A table is made from wood that came from a tree. Is the table living now?'),
  q('detective-paper', 'detective', ITEMS.paper, 'Paper was made using fibres from trees. Is the sheet of paper living now?'),
  q('detective-wool', 'detective', ITEMS.woolJumper, 'Wool grew on a sheep before it became a jumper. Is the jumper living now?'),
  q('detective-shell', 'detective', ITEMS.shell, 'A shell was made by an animal, but the empty shell has no animal inside. Is it living now?'),
  q('detective-feather', 'detective', ITEMS.feather, 'A feather has fallen from a bird. Is the feather living now?'),
  q('detective-cotton-shirt', 'detective', ITEMS.cottonShirt, 'Cotton fibres grew on a plant before they became a shirt. Is the shirt living now?'),
  q('detective-robot', 'detective', ITEMS.robot, 'A toy robot walks and talks when its batteries are on. Is it living?'),
  q('detective-cactus', 'detective', ITEMS.cactus, 'A cactus does not walk, but it grows and makes new cells. Is it living?'),
  q('detective-fire', 'detective', ITEMS.fire, 'A flame gets bigger when more fuel is added. Is it living?'),
  q('detective-cloud', 'detective', ITEMS.cloud, 'A cloud moves, changes and releases rain. Is it living?'),
  q('detective-mushroom', 'detective', ITEMS.mushroom, 'A mushroom cannot walk, but its fungus grows and uses nutrients. Is it living?'),
  q('detective-coral', 'detective', ITEMS.coral, 'A coral colony may look like a rock, but its polyps feed and grow. Is it living?'),
  q('detective-seed', 'detective', ITEMS.seed, 'A healthy seed may look still while it waits for suitable conditions. Is it living?'),
  q('detective-bicycle', 'detective', ITEMS.bicycle, 'A bicycle travels quickly when a rider pedals it. Is it living?'),
];

export const livingQuestions: readonly LivingQuestion[] = [...identify, ...sorting, ...evidence, ...detective];

function shuffle<T>(values: readonly T[], random: RandomSource): T[] {
  const copy = [...values];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1));
    [copy[index], copy[swap]] = [copy[swap], copy[index]];
  }
  return copy;
}

export function generateLivingRound(random: RandomSource = Math.random): LivingQuestion[] {
  const counts: Record<LivingQuestionType, number> = { identify: 3, sorting: 3, evidence: 2, detective: 2 };
  const selected = (Object.entries(counts) as [LivingQuestionType, number][]).flatMap(([type, count]) =>
    shuffle(livingQuestions.filter((question) => question.type === type), random).slice(0, count).map((question) =>
      question.type === 'sorting'
        ? { ...question, items: shuffle(question.items, random) }
        : { ...question, choices: shuffle(question.choices, random) },
    ),
  );
  return shuffle(selected, random);
}
