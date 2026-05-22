import type { RaceManifestEntry } from '@/lib/dnd/raceManifest';

export type RaceEntryNode =
  | string
  | {
      name?: string;
      entries?: RaceEntryNode[];
      type?: string;
    };

export interface RaceSourceMeta {
  json?: string;
  full?: string;
  abbreviation?: string;
  authors?: string[];
  version?: string;
  url?: string;
}

export interface RaceRecord {
  name: string;
  source: string;
  ability?: Record<string, number>[];
  speed?: Record<string, number | boolean>;
  size?: string[];
  traitTags?: string[];
  entries?: RaceEntryNode[];
  skillProficiencies?: Record<string, boolean>[];
  toolProficiencies?: Record<string, boolean>[];
  languageProficiencies?: Array<Record<string, boolean | { from: string[]; count: number }>>;
  subraces?: Array<{
    name: string;
    ability?: Record<string, number>[];
    speed?: Record<string, number | boolean>;
    entries?: RaceEntryNode[];
  }>;
  fluff?: {
    entries?: RaceEntryNode[];
  };
}

export interface RaceFile {
  _meta?: {
    sources?: RaceSourceMeta[];
    edition?: string;
    dateLastModified?: number;
  };
  race?: RaceRecord[];
}

export interface RaceCatalogItem extends RaceManifestEntry {
  summary: string;
  sizeText: string;
  speedText: string;
  abilityText: string;
  traitTags: string[];
  subraceCount: number;
}

const abilityLabels: Record<string, string> = {
  str: 'Strength',
  dex: 'Dexterity',
  con: 'Constitution',
  int: 'Intelligence',
  wis: 'Wisdom',
  cha: 'Charisma',
};

const sizeLabels: Record<string, string> = {
  T: 'Tiny',
  S: 'Small',
  M: 'Medium',
  L: 'Large',
  H: 'Huge',
  G: 'Gargantuan',
};

const removableTagPrefix = /^@(?:skill|item|creature|condition|sense|spell|filter|dice|hit|damage|book|chance|5etools)/;

export function strip5eTags(value: string): string {
  return value
    .replace(/\{@[^} ]+ ([^|}]+)(?:\|[^}]*)?\}/g, '$1')
    .replace(/\{@[^}]+\}/g, (match) => {
      const inner = match.slice(2, -1);
      if (removableTagPrefix.test(`@${inner}`)) {
        return inner.split(' ')[1] ?? inner;
      }

      return inner;
    })
    .replace(/\s+/g, ' ')
    .trim();
}

export function flattenEntryText(entries: RaceEntryNode[] | undefined): string[] {
  if (!entries) return [];

  return entries.flatMap((entry) => {
    if (typeof entry === 'string') {
      return [strip5eTags(entry)];
    }

    const nested = flattenEntryText(entry.entries);
    if (entry.name && nested.length) {
      return [`${entry.name}: ${nested.join(' ')}`];
    }

    return nested;
  });
}

export function findNamedEntry(
  entries: RaceEntryNode[] | undefined,
  name: string
): Extract<RaceEntryNode, { name?: string }> | null {
  if (!entries) return null;

  for (const entry of entries) {
    if (typeof entry !== 'string' && entry.name === name) {
      return entry;
    }
  }

  return null;
}

export function formatAbilityText(abilities: Record<string, number>[] | undefined): string {
  if (!abilities?.length) return 'Not specified';

  const parts = abilities.flatMap((ability) =>
    Object.entries(ability).map(([key, value]) => {
      const label = abilityLabels[key] ?? key.toUpperCase();
      return `${label} +${value}`;
    })
  );

  return parts.join(', ');
}

export function formatSpeedText(speed: Record<string, number | boolean> | undefined): string {
  if (!speed) return 'Not specified';

  const parts = Object.entries(speed).flatMap(([mode, value]) => {
    if (typeof value !== 'number') return [];
    return [`${mode[0].toUpperCase()}${mode.slice(1)} ${value} ft.`];
  });

  return parts.length ? parts.join(', ') : 'Special movement';
}

export function formatSizeText(size: string[] | undefined): string {
  if (!size?.length) return 'Not specified';
  return size.map((item) => sizeLabels[item] ?? item).join(' or ');
}

export function summarizeRace(record: RaceRecord): string {
  const lead = record.entries?.find((entry) => typeof entry === 'string');
  if (typeof lead === 'string') {
    return strip5eTags(lead);
  }

  const fluffLead = record.fluff?.entries?.find((entry) => typeof entry === 'string');
  if (typeof fluffLead === 'string') {
    return strip5eTags(fluffLead);
  }

  return 'Homebrew playable race.';
}

export function formatLanguageText(
  proficiencies: Array<Record<string, boolean | { from: string[]; count: number }>> | undefined
): string {
  if (!proficiencies?.length) return 'Not specified';

  const parts = proficiencies.flatMap((entry) =>
    Object.entries(entry).flatMap(([key, value]) => {
      if (key === 'choose' && typeof value === 'object' && value !== null) {
        return [`Choose ${value.count} language${value.count === 1 ? '' : 's'} from ${value.from.join(', ')}`];
      }

      return value === true ? [key[0].toUpperCase() + key.slice(1)] : [];
    })
  );

  return parts.join(', ');
}

export function formatProficiencyText(
  proficiencies: Record<string, boolean>[] | undefined
): string {
  if (!proficiencies?.length) return 'None listed';

  const parts = proficiencies.flatMap((entry) =>
    Object.entries(entry).flatMap(([key, value]) =>
      value ? [key[0].toUpperCase() + key.slice(1)] : []
    )
  );

  return parts.join(', ');
}

export function formatSourceLabel(source: RaceSourceMeta | undefined): string {
  if (!source) return 'Unknown source';

  const authorText = source.authors?.length ? ` by ${source.authors.join(', ')}` : '';
  const versionText = source.version ? ` (${source.version})` : '';

  return `${source.full ?? source.json ?? 'Unknown source'}${authorText}${versionText}`;
}

export function toCatalogItem(
  entry: RaceManifestEntry,
  record: RaceRecord
): RaceCatalogItem {
  return {
    ...entry,
    summary: summarizeRace(record),
    sizeText: formatSizeText(record.size),
    speedText: formatSpeedText(record.speed),
    abilityText: formatAbilityText(record.ability),
    traitTags: record.traitTags ?? [],
    subraceCount: record.subraces?.length ?? 0,
  };
}
