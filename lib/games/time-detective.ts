export const TIME_GAME_ID = 'time-detective';

export const timeMechanics = ['read', 'set', 'match', 'routine'] as const;
export const timeStages = ['whole', 'half', 'quarter', 'five'] as const;
export type TimeMechanic = typeof timeMechanics[number];
export type TimeStage = typeof timeStages[number];
export type TimeSessionMode = 'intro' | 'full';
export type ClockTime = { hour: number; minute: number };
export type TimeChoice = { id: string; time: ClockTime };
export type TimeChallenge = {
  id: string;
  mechanic: TimeMechanic;
  stage: TimeStage;
  interaction: 'choice' | 'set';
  prompt: string;
  instruction: string;
  answer: ClockTime;
  choices: readonly TimeChoice[];
  correctChoiceId: string | null;
  explanation: string;
};

export const timeMechanicLabels: Record<TimeMechanic, string> = {
  read: 'Read the Clock',
  set: 'Set the Clock',
  match: 'Match the Time',
  routine: 'Daily Routine Detective',
};
export const timeStageLabels: Record<TimeStage, string> = {
  whole: 'Whole hours', half: 'Half hours', quarter: 'Quarter hours', five: 'Five-minute times',
};

export function normalizeClockTime(time: ClockTime): ClockTime {
  const total = ((Math.round(time.hour) % 12 + 12) % 12) * 60 + Math.round(time.minute);
  const normalized = ((total % 720) + 720) % 720;
  return { hour: Math.floor(normalized / 60) || 12, minute: normalized % 60 };
}

export function clockTimeKey(time: ClockTime) {
  const normalized = normalizeClockTime(time);
  return `h${normalized.hour}-m${normalized.minute}`;
}

export function formatClockTime(time: ClockTime) {
  const normalized = normalizeClockTime(time);
  return `${normalized.hour}:${String(normalized.minute).padStart(2, '0')}`;
}

export function clockAngles(time: ClockTime) {
  const normalized = normalizeClockTime(time);
  return {
    minute: normalized.minute * 6,
    hour: (normalized.hour % 12) * 30 + normalized.minute * 0.5,
  };
}

export function adjustClockTime(time: ClockTime, part: 'hour' | 'minute', amount: number) {
  const normalized = normalizeClockTime(time);
  return normalizeClockTime(part === 'hour'
    ? { hour: normalized.hour + amount, minute: normalized.minute }
    : { hour: normalized.hour, minute: normalized.minute + amount });
}

export function describeClockHands(time: ClockTime) {
  const normalized = normalizeClockTime(time);
  const nextHour = normalized.hour === 12 ? 1 : normalized.hour + 1;
  const minuteNumber = normalized.minute === 0 ? 12 : normalized.minute / 5;
  let hourPosition = `points exactly to ${normalized.hour}`;
  if (normalized.minute === 15) hourPosition = `is one quarter of the way from ${normalized.hour} towards ${nextHour}`;
  else if (normalized.minute === 30) hourPosition = `is halfway between ${normalized.hour} and ${nextHour}`;
  else if (normalized.minute === 45) hourPosition = `is three quarters of the way from ${normalized.hour} towards ${nextHour}`;
  else if (normalized.minute > 0) hourPosition = `is just past ${normalized.hour}, moving towards ${nextHour}`;
  return `The shorter hour hand ${hourPosition}. The longer minute hand points to ${minuteNumber}.`;
}

export function isSameClockTime(left: ClockTime, right: ClockTime) {
  return clockTimeKey(left) === clockTimeKey(right);
}

const stageTimes: Record<TimeMechanic, Record<TimeStage, readonly ClockTime[]>> = {
  read: {
    whole: [{ hour: 1, minute: 0 }, { hour: 4, minute: 0 }, { hour: 8, minute: 0 }, { hour: 12, minute: 0 }],
    half: [{ hour: 2, minute: 30 }, { hour: 5, minute: 30 }, { hour: 9, minute: 30 }, { hour: 12, minute: 30 }],
    quarter: [{ hour: 3, minute: 15 }, { hour: 6, minute: 45 }, { hour: 10, minute: 15 }, { hour: 11, minute: 45 }],
    five: [{ hour: 1, minute: 5 }, { hour: 7, minute: 20 }, { hour: 11, minute: 55 }],
  },
  set: {
    whole: [{ hour: 2, minute: 0 }, { hour: 5, minute: 0 }, { hour: 9, minute: 0 }, { hour: 11, minute: 0 }],
    half: [{ hour: 1, minute: 30 }, { hour: 4, minute: 30 }, { hour: 8, minute: 30 }, { hour: 11, minute: 30 }],
    quarter: [{ hour: 2, minute: 15 }, { hour: 5, minute: 45 }, { hour: 9, minute: 15 }, { hour: 12, minute: 45 }],
    five: [{ hour: 3, minute: 10 }, { hour: 6, minute: 35 }, { hour: 10, minute: 50 }],
  },
  match: {
    whole: [{ hour: 3, minute: 0 }, { hour: 6, minute: 0 }, { hour: 10, minute: 0 }, { hour: 12, minute: 0 }],
    half: [{ hour: 3, minute: 30 }, { hour: 6, minute: 30 }, { hour: 10, minute: 30 }, { hour: 12, minute: 30 }],
    quarter: [{ hour: 1, minute: 15 }, { hour: 4, minute: 45 }, { hour: 8, minute: 15 }, { hour: 10, minute: 45 }],
    five: [{ hour: 2, minute: 5 }, { hour: 7, minute: 25 }, { hour: 11, minute: 40 }],
  },
  routine: {
    whole: [{ hour: 7, minute: 0 }, { hour: 9, minute: 0 }, { hour: 11, minute: 0 }, { hour: 2, minute: 0 }],
    half: [{ hour: 8, minute: 30 }, { hour: 10, minute: 30 }, { hour: 1, minute: 30 }, { hour: 4, minute: 30 }],
    quarter: [{ hour: 9, minute: 15 }, { hour: 11, minute: 45 }, { hour: 2, minute: 15 }, { hour: 5, minute: 45 }],
    five: [{ hour: 8, minute: 5 }, { hour: 3, minute: 20 }, { hour: 6, minute: 55 }],
  },
};

const routineContexts = [
  'A family has chosen this time to begin a walk.',
  'A library activity is printed with this start time.',
  'A club meeting is scheduled for this time.',
  'A bus timetable lists this departure time.',
  'A lesson plan shows this time for the next activity.',
  'A museum ticket lists this entry time.',
] as const;

function choiceTimes(answer: ClockTime, stage: TimeStage) {
  const offsets = stage === 'whole' ? [60, -60, 180] : stage === 'half' ? [30, 60, -60] : stage === 'quarter' ? [30, -30, 60] : [5, -5, 30];
  const choices = [answer, ...offsets.map(offset => adjustClockTime(answer, 'minute', offset))];
  return choices.filter((time, index, all) => all.findIndex(candidate => isSameClockTime(candidate, time)) === index)
    .slice(0, 4).map(time => ({ id: clockTimeKey(time), time }));
}

function createChallenge(mechanic: TimeMechanic, stage: TimeStage, time: ClockTime, index: number): TimeChallenge {
  const id = `${mechanic}-${stage}-${index + 1}`;
  const interaction = mechanic === 'set' || mechanic === 'routine' && index % 2 === 1 ? 'set' : 'choice';
  const choices = interaction === 'choice' ? choiceTimes(time, stage) : [];
  const digital = formatClockTime(time);
  const context = routineContexts[index % routineContexts.length];
  const prompt = mechanic === 'read' ? 'What time does this clock show?'
    : mechanic === 'set' ? `Set the clock to ${digital}.`
      : mechanic === 'match' ? `Which clock shows ${digital}?`
        : `${context} ${interaction === 'set' ? `Set the clock to ${digital}.` : `Which clock shows ${digital}?`}`;
  const instruction = interaction === 'set'
    ? 'Adjust the hour and minute controls. Check both hands, then submit your clock.'
    : mechanic === 'read'
      ? 'Use the shorter hour hand and the longer minute hand, then choose the matching digital time.'
      : 'Compare the hand positions on every clock before choosing one.';
  return {
    id, mechanic, stage, interaction, prompt, instruction, answer: normalizeClockTime(time), choices,
    correctChoiceId: interaction === 'choice' ? clockTimeKey(time) : null,
    explanation: `${digital} is correct. ${describeClockHands(time)} The hour hand moves gradually as the minutes pass.`,
  };
}

export const timeChallenges: readonly TimeChallenge[] = timeMechanics.flatMap(mechanic =>
  timeStages.flatMap(stage => stageTimes[mechanic][stage].map((time, index) => createChallenge(mechanic, stage, time, index))),
);

function seededRandom(seed: string | number) {
  let value = 2166136261;
  for (const character of String(seed)) value = Math.imul(value ^ character.charCodeAt(0), 16777619);
  return () => { value += 0x6D2B79F5; let number = value; number = Math.imul(number ^ number >>> 15, number | 1); number ^= number + Math.imul(number ^ number >>> 7, number | 61); return ((number ^ number >>> 14) >>> 0) / 4294967296; };
}

function shuffled<T>(items: readonly T[], random: () => number) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index--) {
    const other = Math.floor(random() * (index + 1));
    [result[index], result[other]] = [result[other], result[index]];
  }
  return result;
}

const sessionSlots: Record<TimeSessionMode, readonly [TimeMechanic, TimeStage][]> = {
  intro: [
    ['read', 'whole'], ['set', 'whole'], ['match', 'whole'], ['routine', 'whole'], ['read', 'whole'],
    ['set', 'half'], ['match', 'half'], ['routine', 'half'], ['read', 'half'], ['set', 'half'],
  ],
  full: [
    ['read', 'whole'], ['set', 'whole'], ['match', 'half'], ['routine', 'half'], ['read', 'quarter'],
    ['set', 'quarter'], ['match', 'quarter'], ['routine', 'five'], ['read', 'five'], ['set', 'five'],
  ],
};

export function generateTimeSession(seed: string | number, mode: TimeSessionMode = 'full') {
  const random = seededRandom(seed);
  const used = new Set<string>();
  return sessionSlots[mode].map(([mechanic, stage]) => {
    const pool = shuffled(timeChallenges.filter(challenge => challenge.mechanic === mechanic && challenge.stage === stage && !used.has(challenge.id)), random);
    const selected = pool[0];
    used.add(selected.id);
    return selected.interaction === 'choice' ? { ...selected, choices: shuffled(selected.choices, random) } : selected;
  });
}

export function initialClockSetting(answer: ClockTime) {
  return isSameClockTime(answer, { hour: 12, minute: 0 }) ? { hour: 1, minute: 0 } : { hour: 12, minute: 0 };
}
