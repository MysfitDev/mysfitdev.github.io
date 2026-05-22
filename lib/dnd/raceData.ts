import 'server-only';

import { readFile } from 'node:fs/promises';
import path from 'node:path';

import {
  type RaceCatalogItem,
  type RaceFile,
  type RaceRecord,
  toCatalogItem,
} from '@/lib/dnd/racePresentation';
import { getRaceManifest } from '@/lib/dnd/raceManifest';

function getRaceFilePath(slug: string): string {
  return path.join(
    process.cwd(),
    'public',
    'data',
    'dnd',
    'homebrew',
    'races',
    `${slug}.json`
  );
}

export async function getRaceFile(slug: string): Promise<RaceFile> {
  const contents = await readFile(getRaceFilePath(slug), 'utf8');
  return JSON.parse(contents) as RaceFile;
}

export async function getRaceRecord(slug: string): Promise<RaceRecord | null> {
  const file = await getRaceFile(slug);
  return file.race?.[0] ?? null;
}

export async function getRaceCatalog(): Promise<RaceCatalogItem[]> {
  const manifest = await getRaceManifest();

  const items = await Promise.all(
    manifest.races.map(async (entry) => {
      const record = await getRaceRecord(entry.slug);
      if (!record) return null;
      return toCatalogItem(entry, record);
    })
  );

  return items.filter((item): item is RaceCatalogItem => item !== null);
}
