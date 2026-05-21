import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const racesDir = path.join(repoRoot, 'public', 'data', 'dnd', 'homebrew', 'races');
const outputPath = path.join(racesDir, 'all.json');

function humanizeSlug(slug) {
  return slug
    .split('_')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

async function buildRaceManifest() {
  const files = (await readdir(racesDir))
    .filter((file) => file.endsWith('.json') && file !== 'all.json')
    .sort((a, b) => a.localeCompare(b));

  const entries = [];
  const documents = [];
  const races = [];
  const subraces = [];

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

    documents.push({
      slug,
      name: primaryRace?.name ?? source?.full ?? humanizeSlug(slug),
      path: `/data/dnd/homebrew/races/${file}`,
      data: json,
    });

    if (Array.isArray(json.race)) {
      races.push(...json.race);
    }

    if (Array.isArray(json.subrace)) {
      subraces.push(...json.subrace);
    }
  }

  return {
    _meta: {
      generatedBy: 'scripts/generate-race-manifest.mjs',
      generatedAt: new Date().toISOString(),
      sourceDirectory: 'public/data/dnd/homebrew/races',
      fileCount: files.length,
      documentCount: documents.length,
      raceCount: races.length,
      subraceCount: subraces.length,
    },
    index: entries.sort((a, b) => a.name.localeCompare(b.name)),
    documents,
    race: races,
    subrace: subraces,
  };
}

async function main() {
  const manifest = await buildRaceManifest();

  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');

  console.log(
    `Generated ${path.relative(repoRoot, outputPath)} from ${manifest._meta.fileCount} race files.`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
