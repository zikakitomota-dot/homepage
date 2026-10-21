import fs from 'node:fs';

const [inputPath, outputPath] = process.argv.slice(2);
if (!inputPath || !outputPath) {
  throw new Error('Usage: node scripts/generate-continent-map.mjs <input.geojson> <output.ts>');
}

const data = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
const continentIds = {
  Africa: 'africa',
  Antarctica: 'antarctica',
  Asia: 'asia',
  Europe: 'europe',
  'North America': 'north-america',
  'South America': 'south-america',
  Oceania: 'australia',
};

const project = ([longitude, latitude]) => [
  Number(((longitude + 180) * 2.4).toFixed(2)),
  Number(((90 - latitude) * 2.4).toFixed(2)),
];

function ringPath(ring) {
  return ring.map((coordinate, index) => {
    const [x, y] = project(coordinate);
    return `${index === 0 ? 'M' : 'L'}${x} ${y}`;
  }).join('') + 'Z';
}

function geometryPath(geometry) {
  if (geometry.type === 'Polygon') return geometry.coordinates.map(ringPath).join('');
  if (geometry.type === 'MultiPolygon') return geometry.coordinates.flatMap((polygon) => polygon.map(ringPath)).join('');
  return '';
}

const grouped = Object.fromEntries(Object.values(continentIds).map((id) => [id, []]));
for (const feature of data.features) {
  const id = continentIds[feature.properties.CONTINENT];
  if (!id) continue;
  const path = geometryPath(feature.geometry);
  if (path) grouped[id].push(path);
}

const source = `// Generated from Natural Earth 1:110m Admin 0 Countries (public domain).\n// Source: https://www.naturalearthdata.com/\nexport const continentMapPaths = ${JSON.stringify(grouped, null, 2)} as const;\n`;
fs.writeFileSync(outputPath, source);
