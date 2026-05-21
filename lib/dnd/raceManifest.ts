import 'server-only';

import { readFile } from 'node:fs/promises';
import path from 'node:path';

export interface RaceManifestEntry {
  slug: string;
  name: string;
  path: string;
  source: string | null;
}

interface RaceIndexMeta {
  generatedBy: string;
  generatedAt: string;
  sourceDirectory: string;
  fileCount: number;
  raceCount: number;
  subraceCount: number;
}

export interface RaceManifest {
  _meta: RaceIndexMeta;
  races: RaceManifestEntry[];
}

const manifestPath = path.join(
  process.cwd(),
  'public',
  'data',
  'dnd',
  'homebrew',
  'races',
  'index.json'
);

export async function getRaceManifest(): Promise<RaceManifest> {
  const contents = await readFile(manifestPath, 'utf8');

  return JSON.parse(contents) as RaceManifest;
}

export async function getRaceIndex(): Promise<RaceManifestEntry[]> {
  const manifest = await getRaceManifest();

  return manifest.races;
}
