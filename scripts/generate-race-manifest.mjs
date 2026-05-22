import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const racesDir = path.join(repoRoot, 'public', 'data', 'dnd', 'homebrew', 'races');
const combinedOutputPath = path.join(racesDir, 'all.json');
const indexOutputPath = path.join(racesDir, 'index.json');

function humanizeSlug(slug) {
  return slug
    .split('_')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function getUniqueAuthors(sources) {
  return [...new Set(sources.flatMap((source) => source.authors ?? []))].sort(
    (a, b) => a.localeCompare(b)
  );
}

function normalizeCombinedRace(race) {
  return {
    ...race,
    source: 'MYSF:AllRaces',
  };
}

function normalizeCombinedSubrace(subrace) {
  return {
    ...subrace,
    source: 'MYSF:AllRaces',
    raceSource: 'MYSF:AllRaces',
  };
}

async function buildRaceManifest() {
  const files = (await readdir(racesDir))
    .filter(
      (file) =>
        file.endsWith('.json') && file !== 'all.json' && file !== 'index.json'
    )
    .sort((a, b) => a.localeCompare(b));

  const entries = [];
  const races = [];
  const subraces = [];
  const sources = [];
  let latestModified = 0;
  let latestVersion = '2026.05.20';

  for (const file of files) {
    const slug = path.basename(file, '.json');
    const fullPath = path.join(racesDir, file);
    const raw = await readFile(fullPath, 'utf8');
    const json = JSON.parse(raw);

    const primaryRace = Array.isArray(json.race) ? json.race[0] : null;
    const source = json?._meta?.sources?.[0];

    entries.push({
      slug,
      name: primaryRace?.name ?? source?.full ?? humanizeSlug(slug),
      path: `/data/dnd/homebrew/races/${file}`,
      source: primaryRace?.source ?? source?.json ?? null,
    });

    if (Array.isArray(json?._meta?.sources)) {
      sources.push(...json._meta.sources);
    }

    latestModified = Math.max(latestModified, json?._meta?.dateLastModified ?? 0);
    latestVersion =
      source?.version && source.version > latestVersion
        ? source.version
        : latestVersion;

    if (Array.isArray(json.race)) {
      races.push(...json.race.map(normalizeCombinedRace));
    }

    if (Array.isArray(json.subrace)) {
      subraces.push(...json.subrace.map(normalizeCombinedSubrace));
    }
  }

  return {
    combined: {
      _meta: {
        sources: [
          {
            json: 'MYSF:AllRaces',
            full: 'All Races',
            abbreviation: 'MYSF',
            authors: getUniqueAuthors(sources),
            version: latestVersion,
            url: 'https://mysfitdev.github.io/races',
          },
        ],
        dateAdded: Math.floor(Date.now() / 1000),
        dateLastModified: latestModified || Math.floor(Date.now() / 1000),
        _dateLastModifiedHash: `allraces${new Date().toISOString().slice(0, 10).replaceAll('-', '')}`,
        edition: 'classic',
      },
      race: races,
      ...(subraces.length ? { subrace: subraces } : {}),
    },
    index: {
      _meta: {
        generatedBy: 'scripts/generate-race-manifest.mjs',
        generatedAt: new Date().toISOString(),
        sourceDirectory: 'public/data/dnd/homebrew/races',
        fileCount: files.length,
        raceCount: races.length,
        subraceCount: subraces.length,
      },
      races: entries.sort((a, b) => a.name.localeCompare(b.name)),
    },
  };
}

async function main() {
  const manifest = await buildRaceManifest();

  await mkdir(path.dirname(combinedOutputPath), { recursive: true });
  await writeFile(
    combinedOutputPath,
    `${JSON.stringify(manifest.combined, null, 2)}\n`,
    'utf8'
  );
  await writeFile(
    indexOutputPath,
    `${JSON.stringify(manifest.index, null, 2)}\n`,
    'utf8'
  );

  console.log(
    `Generated ${path.relative(repoRoot, combinedOutputPath)} and ${path.relative(repoRoot, indexOutputPath)} from ${manifest.index._meta.fileCount} race files.`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
