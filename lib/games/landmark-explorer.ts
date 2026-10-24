export const landmarkContinents = ['Asia', 'Europe', 'Africa', 'North America', 'South America', 'Oceania'] as const;
export type LandmarkContinent = (typeof landmarkContinents)[number];
export type LandmarkQuestionType = 'recognise-landmark' | 'find-country' | 'match-continent' | 'landmark-detective';

export type Landmark = {
  id: string;
  name: string;
  country: string;
  continent: LandmarkContinent;
  kind: 'built' | 'natural';
  image: string;
  imageDescription: string;
  features: readonly string[];
  clue: string;
  fact: string;
  sourcePage: string;
  licence: string;
};

export type LandmarkQuestion = {
  id: string;
  type: LandmarkQuestionType;
  landmarkId: string;
  prompt: string;
  options: readonly string[];
  correctAnswer: string;
  explanation: string;
  showImage: boolean;
  level: 'level-1';
};

const landmark = (id: string, name: string, country: string, continent: LandmarkContinent, kind: 'built' | 'natural', imageDescription: string, features: string[], clue: string, fact: string, sourcePage: string, licence: string): Landmark => ({ id, name, country, continent, kind, image: `/images/landmarks/${id}.webp`, imageDescription, features, clue, fact, sourcePage, licence });

export const landmarks: readonly Landmark[] = [
  landmark('great-wall', 'Great Wall of China', 'China', 'Asia', 'built', 'A long stone wall winding over green mountain ridges', ['long stone walls', 'watchtowers', 'mountain ridges'], 'I stretch across hills and have many watchtowers.', 'Different sections were built over many centuries to protect routes and borders in northern China.', 'https://commons.wikimedia.org/wiki/File:Badaling_China_Great-Wall-of-China-06.jpg', 'CC BY-SA 3.0'),
  landmark('taj-mahal', 'Taj Mahal', 'India', 'Asia', 'built', 'A white marble building with a large central dome and four tall towers', ['white marble', 'large dome', 'four minarets'], 'My white marble walls and four tall towers stand beside a river.', 'The Taj Mahal was built in the 1600s as a mausoleum and is celebrated for its symmetry.', 'https://commons.wikimedia.org/wiki/File:Taj_Mahal_(Edited).jpeg', 'CC BY-SA 4.0'),
  landmark('petronas-towers', 'Petronas Towers', 'Malaysia', 'Asia', 'built', 'Two silver skyscrapers joined by a high bridge', ['twin towers', 'skybridge', 'silver facade'], 'I am a pair of towers joined by a bridge high above Kuala Lumpur.', 'The Petronas Towers were the world’s tallest buildings from 1998 to 2004.', 'https://commons.wikimedia.org/wiki/File:Kuala_Lumpur_-_panoramio_(18).jpg', 'CC BY-SA 3.0'),
  landmark('angkor-wat', 'Angkor Wat', 'Cambodia', 'Asia', 'built', 'A temple complex with pointed stone towers reflected in water', ['lotus-shaped towers', 'stone galleries', 'moat'], 'My temple towers rise behind a wide moat.', 'Angkor Wat began as a Hindu temple in the 1100s and later became a Buddhist site.', 'https://commons.wikimedia.org/wiki/File:Angkor_Wat.jpg', 'CC BY-SA 4.0'),
  landmark('mount-fuji', 'Mount Fuji', 'Japan', 'Asia', 'natural', 'A tall symmetrical mountain with a snow-covered summit', ['cone shape', 'snowy summit', 'volcano'], 'I am a nearly symmetrical volcano often shown with snow on top.', 'Mount Fuji is Japan’s highest mountain at 3,776 metres.', 'https://commons.wikimedia.org/wiki/File:Kodaki_fuji_frm_shojinko_refurb.jpg', 'CC BY-SA 3.0'),

  landmark('eiffel-tower', 'Eiffel Tower', 'France', 'Europe', 'built', 'A tall iron lattice tower viewed from a broad lawn', ['iron lattice', 'four curved legs', 'tapering tower'], 'I am an iron tower built for a world fair in Paris.', 'The Eiffel Tower opened in 1889 and was designed for the Exposition Universelle.', 'https://commons.wikimedia.org/wiki/File:Tour_Eiffel_Wikimedia_Commons.jpg', 'Public domain'),
  landmark('colosseum', 'Colosseum', 'Italy', 'Europe', 'built', 'A large oval stone arena with rows of arches', ['oval arena', 'stone arches', 'tiered seating'], 'Ancient crowds watched events inside my oval arena in Rome.', 'The Colosseum opened around AD 80 and could hold tens of thousands of spectators.', 'https://commons.wikimedia.org/wiki/File:Colosseo_2020.jpg', 'CC BY-SA 4.0'),
  landmark('elizabeth-tower', 'Elizabeth Tower (Big Ben)', 'United Kingdom', 'Europe', 'built', 'A tall Gothic clock tower beside a grand riverside building', ['four clock faces', 'Gothic tower', 'gold details'], 'People often call me Big Ben, though that name originally belongs to my great bell.', 'Elizabeth Tower stands at the Palace of Westminster in London.', 'https://commons.wikimedia.org/wiki/File:Elizabeth_Tower_and_the_north_front_of_the_Palace_of_Westminster,_London.jpg', 'CC BY-SA 4.0'),
  landmark('sagrada-familia', 'Sagrada Família', 'Spain', 'Europe', 'built', 'A huge basilica with many slender decorated spires', ['tall spires', 'carved facades', 'basilica'], 'My many detailed spires have been rising over Barcelona since the 1800s.', 'Architect Antoni Gaudí devoted much of his career to the Sagrada Família.', 'https://commons.wikimedia.org/wiki/File:SF_maig_2026.jpg', 'CC BY-SA 4.0'),
  landmark('matterhorn', 'Matterhorn', 'Switzerland', 'Europe', 'natural', 'A sharply pointed mountain rising above snowy alpine slopes', ['pyramid peak', 'steep rock faces', 'Alpine snow'], 'My pointed pyramid-shaped peak is one of the Alps’ most recognisable sights.', 'The Matterhorn stands on the border between Switzerland and Italy; this game associates it with its famous Swiss view near Zermatt.', 'https://commons.wikimedia.org/wiki/File:0_106_Walliser_Alpen_-_Matterhorn.jpg', 'CC BY-SA 4.0'),

  landmark('giza-pyramids', 'Pyramids of Giza', 'Egypt', 'Africa', 'built', 'Three large stone pyramids standing on a sandy plateau', ['triangular stone sides', 'desert plateau', 'ancient tombs'], 'Ancient builders shaped millions of stone blocks into my giant triangular forms.', 'The Great Pyramid was built as a tomb for Pharaoh Khufu more than 4,500 years ago.', 'https://commons.wikimedia.org/wiki/File:Pyramids_of_the_Giza_Necropolis.jpg', 'CC BY-SA 4.0'),
  landmark('table-mountain', 'Table Mountain', 'South Africa', 'Africa', 'natural', 'A broad mountain with a strikingly flat top above a coastal city', ['flat summit', 'steep cliffs', 'city below'], 'My summit looks like a giant tabletop above Cape Town.', 'Table Mountain’s flat upper surface is about three kilometres from side to side.', 'https://commons.wikimedia.org/wiki/File:Table_Mountain_DanieVDM.jpg', 'CC BY 2.0'),
  landmark('hassan-ii-mosque', 'Hassan II Mosque', 'Morocco', 'Africa', 'built', 'An ornate seaside mosque with one very tall square minaret', ['tall minaret', 'intricate decoration', 'Atlantic shore'], 'My tall square minaret rises beside the Atlantic Ocean in Casablanca.', 'Part of the Hassan II Mosque was built over the ocean, and its minaret is about 210 metres tall.', 'https://commons.wikimedia.org/wiki/File:Sunshine_on_mosque_Hassan_II_in_Casablanca,_Morocco_-_Flickr_-_Milamber%27s_portfolio.jpg', 'CC BY 2.0'),
  landmark('mount-kilimanjaro', 'Mount Kilimanjaro', 'Tanzania', 'Africa', 'natural', 'A wide isolated mountain with snow and ice near its summit', ['snowy summit', 'free-standing mountain', 'volcanic cones'], 'I rise alone above the plains and am the highest mountain in Africa.', 'Kilimanjaro’s highest point, Uhuru Peak, reaches 5,895 metres.', 'https://commons.wikimedia.org/wiki/File:Mount_Kilimanjaro_Dec_2009_edit1.jpg', 'GFDL 1.2'),
  landmark('mount-kenya', 'Mount Kenya', 'Kenya', 'Africa', 'natural', 'A rugged mountain with several jagged peaks above forested slopes', ['jagged peaks', 'rocky summit', 'equatorial mountain'], 'I share my name with my country and am Africa’s second-highest mountain.', 'Mount Kenya is an extinct volcano whose highest peak is Batian.', 'https://commons.wikimedia.org/wiki/File:Mount_kenya.JPG', 'CC BY-SA 2.5 NL'),

  landmark('statue-of-liberty', 'Statue of Liberty', 'United States', 'North America', 'built', 'A giant green statue holding a torch beside a harbour', ['raised torch', 'seven-point crown', 'green copper'], 'I hold a torch above New York Harbor.', 'France gave the Statue of Liberty to the United States, and it was dedicated in 1886.', 'https://commons.wikimedia.org/wiki/File:Statue_of_Liberty_and_a_sightseeing_boat,_Liberty_Island,_New_York.jpg', 'CC BY-SA 4.0'),
  landmark('golden-gate-bridge', 'Golden Gate Bridge', 'United States', 'North America', 'built', 'A long orange-red suspension bridge crossing blue water', ['orange-red towers', 'suspension cables', 'wide strait'], 'My orange-red towers and long cables cross the entrance to San Francisco Bay.', 'The Golden Gate Bridge opened in 1937 and spans the Golden Gate strait.', 'https://commons.wikimedia.org/wiki/File:GoldenGateBridge-001.jpg', 'CC BY 2.5'),
  landmark('chichen-itza', 'Chichén Itzá', 'Mexico', 'North America', 'built', 'A stepped stone pyramid with stairways on four sides', ['stepped pyramid', 'four stairways', 'Maya stonework'], 'My stepped pyramid was built by the Maya on the Yucatán Peninsula.', 'The famous pyramid is called El Castillo, or the Temple of Kukulcán.', 'https://commons.wikimedia.org/wiki/File:Chichen_Itza_3.jpg', 'CC BY-SA 4.0'),
  landmark('cn-tower', 'CN Tower', 'Canada', 'North America', 'built', 'A very slender concrete tower with a round observation level', ['slender tower', 'round observation deck', 'broadcast antenna'], 'My round observation levels overlook Toronto.', 'The CN Tower is 553.3 metres tall and opened in 1976.', 'https://commons.wikimedia.org/wiki/File:CN_Tower_from_Puente_de_Luz,_Toronto,_Ontario,_2025-08-25_01.jpg', 'CC BY-SA 4.0'),
  landmark('yosemite-half-dome', 'Half Dome', 'United States', 'North America', 'natural', 'A massive pale granite rock with one rounded side and one steep face', ['granite rock', 'rounded top', 'sheer face'], 'One side of my granite peak looks smoothly rounded and the other looks cut away.', 'Half Dome rises in Yosemite National Park in California.', 'https://commons.wikimedia.org/wiki/File:Yosemite_20_bg_090404.jpg', 'Public domain'),

  landmark('christ-the-redeemer', 'Christ the Redeemer', 'Brazil', 'South America', 'built', 'A large pale statue with outstretched arms high above a city', ['outstretched arms', 'mountaintop statue', 'city view'], 'My arms stretch wide above Rio de Janeiro.', 'Christ the Redeemer stands on Corcovado mountain and was completed in 1931.', 'https://commons.wikimedia.org/wiki/File:Christ_the_Redeemer_-_Cristo_Redentor.jpg', 'CC BY-SA 3.0 DE'),
  landmark('machu-picchu', 'Machu Picchu', 'Peru', 'South America', 'built', 'Stone terraces and ruins spread across a green mountain ridge', ['stone terraces', 'mountain ridge', 'Inca ruins'], 'My Inca stone buildings and terraces sit high in the Andes.', 'Machu Picchu was built in the 1400s and brought to wider international attention in 1911.', 'https://commons.wikimedia.org/wiki/File:80_-_Machu_Picchu_-_Juin_2009_-_edit.jpg', 'CC BY-SA 3.0'),
  landmark('angel-falls', 'Angel Falls', 'Venezuela', 'South America', 'natural', 'A very tall narrow waterfall dropping from a flat-topped mountain', ['long single drop', 'tabletop mountain', 'rainforest'], 'I plunge from a flat-topped mountain and am the world’s highest uninterrupted waterfall.', 'Angel Falls has a total height of 979 metres.', 'https://commons.wikimedia.org/wiki/File:SaltoAngel4.jpg', 'CC BY-SA 2.0'),
  landmark('moai', 'Moai of Rapa Nui', 'Chile', 'South America', 'built', 'A row of enormous carved stone figures with long faces', ['large stone heads', 'long faces', 'ceremonial platform'], 'My huge stone figures were carved by the Rapa Nui people on a Pacific island.', 'Nearly 900 moai have been recorded on Rapa Nui, also called Easter Island.', 'https://commons.wikimedia.org/wiki/File:Ahu_Tongariki.jpg', 'CC BY-SA 3.0'),
  landmark('torres-del-paine', 'Torres del Paine', 'Chile', 'South America', 'natural', 'Sharp granite towers rising beyond a blue lake and open grassland', ['three granite towers', 'blue lakes', 'Patagonian landscape'], 'My sharp granite towers rise above lakes in Patagonia.', 'Torres del Paine National Park protects mountains, glaciers, lakes and grasslands.', 'https://commons.wikimedia.org/wiki/File:Torres_del_Paine,_Laguna_Azul_09.jpg', 'CC BY-SA 4.0'),

  landmark('sydney-opera-house', 'Sydney Opera House', 'Australia', 'Oceania', 'built', 'A waterfront building formed from bright white sail-like shells', ['white roof shells', 'harbour setting', 'sail shapes'], 'My white roof shells look like sails beside Sydney Harbour.', 'The Sydney Opera House opened in 1973 and was designed by Jørn Utzon.', 'https://commons.wikimedia.org/wiki/File:00_1375_Sydney_Opera_House_(Australia).jpg', 'CC BY-SA 4.0'),
  landmark('uluru', 'Uluru', 'Australia', 'Oceania', 'natural', 'A huge rounded red sandstone rock rising from a flat plain', ['red sandstone', 'single massive rock', 'desert plain'], 'I am a great red sandstone formation sacred to the Aṉangu people.', 'Uluru rises about 348 metres above the surrounding plain.', 'https://commons.wikimedia.org/wiki/File:Sunset_at_Uluru_on_July_30,_2005.jpg', 'CC BY-SA 3.0'),
  landmark('great-barrier-reef', 'Great Barrier Reef', 'Australia', 'Oceania', 'natural', 'A satellite view of pale coral patterns in bright blue sea', ['coral reefs', 'turquoise water', 'vast marine system'], 'I am the world’s largest coral reef system.', 'The Great Barrier Reef extends for more than 2,300 kilometres along Queensland’s coast.', 'https://commons.wikimedia.org/wiki/File:GreatBarrierReef-EO.JPG', 'Public domain'),
  landmark('sky-tower', 'Sky Tower', 'New Zealand', 'Oceania', 'built', 'A tall concrete tower with a wide circular observation deck', ['circular deck', 'slender mast', 'city skyline'], 'My circular observation deck stands high over Auckland.', 'Auckland’s Sky Tower is 328 metres tall.', 'https://commons.wikimedia.org/wiki/File:Auckland_Sky_Tower_closeup.jpg', 'CC BY-SA 4.0'),
  landmark('aoraki', 'Aoraki / Mount Cook', 'New Zealand', 'Oceania', 'natural', 'A snow-covered mountain peak above a rugged alpine valley', ['snowy peak', 'Southern Alps', 'glacial landscape'], 'I am the highest mountain in New Zealand.', 'Aoraki / Mount Cook reaches 3,724 metres and has special significance to Ngāi Tahu.', 'https://commons.wikimedia.org/wiki/File:Aoraki_-_Mt_Cook,_Aoraki_-_Mount_Cook_National_Park,_New_Zealand.jpg', 'CC BY-SA 4.0'),
];

const questionTypes: readonly LandmarkQuestionType[] = ['recognise-landmark', 'find-country', 'match-continent', 'landmark-detective'];
const uniqueCountries = Array.from(new Set(landmarks.map(({ country }) => country)));

function distractors(values: readonly string[], answer: string, offset: number) {
  const candidates = values.filter((value) => value !== answer);
  return [answer, ...Array.from({ length: 3 }, (_, index) => candidates[(offset * 3 + index * 5) % candidates.length])];
}

function makeQuestion(item: Landmark, type: LandmarkQuestionType, sequence: number): LandmarkQuestion {
  if (type === 'recognise-landmark') return { id: `recognise-${item.id}`, type, landmarkId: item.id, prompt: 'Which landmark is shown in this picture?', options: distractors(landmarks.map(({ name }) => name), item.name, sequence), correctAnswer: item.name, explanation: `${item.name} is in ${item.country}. ${item.fact}`, showImage: true, level: 'level-1' };
  if (type === 'find-country') return { id: `country-${item.id}`, type, landmarkId: item.id, prompt: `Which country is home to ${item.name}?`, options: distractors(uniqueCountries, item.country, sequence), correctAnswer: item.country, explanation: `${item.name} is in ${item.country}. ${item.fact}`, showImage: true, level: 'level-1' };
  if (type === 'match-continent') return { id: `continent-${item.id}`, type, landmarkId: item.id, prompt: `On which continent would you find ${item.name}?`, options: landmarkContinents, correctAnswer: item.continent, explanation: `${item.name} is in ${item.country}, which this game groups in ${item.continent}.`, showImage: false, level: 'level-1' };
  return { id: `detective-${item.id}`, type, landmarkId: item.id, prompt: `Landmark Detective: ${item.clue}`, options: distractors(landmarks.map(({ name }) => name), item.name, sequence + 7), correctAnswer: item.name, explanation: `The clues point to ${item.name} in ${item.country}. ${item.fact}`, showImage: false, level: 'level-1' };
}

export const landmarkQuestions: readonly LandmarkQuestion[] = landmarks.flatMap((item, index) => [
  makeQuestion(item, questionTypes[index % 4], index),
  makeQuestion(item, questionTypes[(index + 2) % 4], index),
]);

function shuffle<T>(items: readonly T[]): T[] {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swap]] = [copy[swap], copy[index]];
  }
  return copy;
}

export function generateLandmarkRound(): LandmarkQuestion[] {
  const requiredTypes = shuffle([...questionTypes, ...questionTypes, ...shuffle(questionTypes).slice(0, 2)]);
  const usedLandmarks = new Set<string>();
  const round = requiredTypes.map((type) => {
    const question = shuffle(landmarkQuestions.filter((candidate) => candidate.type === type)).find((candidate) => !usedLandmarks.has(candidate.landmarkId));
    if (!question) throw new Error(`Unable to create a unique ${type} question.`);
    usedLandmarks.add(question.landmarkId);
    return { ...question, options: shuffle(question.options) };
  });
  return shuffle(round);
}

export function getLandmark(id: string): Landmark {
  const item = landmarks.find((candidate) => candidate.id === id);
  if (!item) throw new Error(`Unknown landmark: ${id}`);
  return item;
}
