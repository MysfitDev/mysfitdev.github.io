import 'server-only';

import { readFile } from 'node:fs/promises';
import path from 'node:path';

export interface RaceManifestEntry {
  slug: string;
  name: string;
  path: string;
  source: string | null;
}

interface RaceManifestMeta {
  generatedBy: string;
  generatedAt: string;
  sourceDirectory: string;
  fileCount: number;
  documentCount: number;
  raceCount: number;
  subraceCount: number;
}

interface RaceManifestDocument {
  slug: string;
  name: string;
  path: string;
  data: unknown;
}

export interface RaceManifest {
  _meta: RaceManifestMeta;
  index: RaceManifestEntry[];
  documents: RaceManifestDocument[];
  race: unknown[];
  subrace: unknown[];
}

const manifestPath = path.join(
  process.cwd(),
  'public',
  'data',
  'dnd',
  'homebrew',
  'races',
  'all.json'
);

export async function getRaceManifest(): Promise<RaceManifest> {
  const contents = await readFile(manifestPath, 'utf8');

  return JSON.parse(contents) as RaceManifest;
}

export async function getRaceIndex(): Promise<RaceManifestEntry[]> {
  const manifest = await getRaceManifest();

  return manifest.index;
}
