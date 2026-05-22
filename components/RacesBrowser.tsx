'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

import type { RaceCatalogItem } from '@/lib/dnd/racePresentation';

interface RacesBrowserProps {
  races: RaceCatalogItem[];
  totalRaceCount: number;
  totalSubraceCount: number;
  generatedAt: string;
}

const quickFilters = [
  'Flight',
  'Darkvision',
  'Damage Resistance',
  'Skill Proficiency',
  'Tool Proficiency',
  'Subrace Required',
] as const;

export default function RacesBrowser({
  races,
  totalRaceCount,
  totalSubraceCount,
  generatedAt,
}: RacesBrowserProps) {
  const [query, setQuery] = useState('');
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const normalizedQuery = query.trim().toLowerCase();

  const filteredRaces = useMemo(() => {
    return races.filter((race) => {
      const matchesQuery =
        !normalizedQuery ||
        race.name.toLowerCase().includes(normalizedQuery) ||
        race.summary.toLowerCase().includes(normalizedQuery) ||
        race.traitTags.some((tag) => tag.toLowerCase().includes(normalizedQuery));

      const matchesTag = !activeTag || race.traitTags.includes(activeTag);

      return matchesQuery && matchesTag;
    });
  }, [activeTag, normalizedQuery, races]);

  return (
    <Stack spacing={4}>
      <Stack
        spacing={2}
        sx={{
          borderRadius: 4,
          px: { xs: 3, md: 5 },
          py: { xs: 3, md: 4 },
          background:
            'linear-gradient(135deg, rgba(16,24,40,0.98) 0%, rgba(31,41,55,0.96) 50%, rgba(22,101,52,0.88) 100%)',
          border: '1px solid rgba(148, 163, 184, 0.18)',
        }}
      >
        <Typography variant="overline" sx={{ letterSpacing: '0.12em', opacity: 0.78 }}>
          Homebrew Race Browser
        </Typography>
        <Typography variant="h3" component="h1" sx={{ fontWeight: 700 }}>
          D&D races, organized for actual browsing
        </Typography>
        <Typography variant="body1" sx={{ maxWidth: 900, opacity: 0.92 }}>
          Search by name, skim trait tags, and open a race page that translates the source JSON into a readable reference. The raw files are still available when you need them.
        </Typography>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <StatCard label="Race files" value={String(totalRaceCount)} />
          <StatCard label="Subraces" value={String(totalSubraceCount)} />
          <StatCard
            label="Manifest generated"
            value={new Date(generatedAt).toLocaleString()}
          />
        </Stack>
      </Stack>

      <Stack spacing={2}>
        <TextField
          fullWidth
          label="Search races"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          helperText="Match against race names, summaries, and trait tags."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />
        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
          <Chip
            label="All traits"
            clickable
            color={activeTag === null ? 'primary' : 'default'}
            onClick={() => setActiveTag(null)}
          />
          {quickFilters.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              clickable
              color={activeTag === tag ? 'primary' : 'default'}
              onClick={() => setActiveTag(tag)}
            />
          ))}
        </Stack>
      </Stack>

      <Typography variant="body2" sx={{ opacity: 0.75 }}>
        Showing {filteredRaces.length} of {races.length} races.
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gap: 3,
          gridTemplateColumns: {
            xs: '1fr',
            lg: 'repeat(2, minmax(0, 1fr))',
          },
        }}
      >
        {filteredRaces.map((race) => (
          <Card
            key={race.slug}
            component={Link}
            href={`/races/${race.slug}`}
            sx={{
              textDecoration: 'none',
              borderRadius: 4,
              border: '1px solid rgba(148, 163, 184, 0.18)',
              background:
                'linear-gradient(180deg, rgba(17,24,39,0.95), rgba(10,14,23,0.98))',
              transition: 'transform 120ms ease, border-color 120ms ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                borderColor: 'rgba(110, 231, 183, 0.45)',
              },
              '&:focus-visible': {
                outline: '3px solid rgba(110, 231, 183, 0.8)',
                outlineOffset: '2px',
              },
            }}
          >
            <CardContent sx={{ display: 'grid', gap: 2.5 }}>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={1.5}
                justifyContent="space-between"
              >
                <Box>
                  <Typography variant="h5" component="h2" sx={{ fontWeight: 700 }}>
                    {race.name}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.74 }}>
                    {race.source ?? 'Source unavailable'}
                  </Typography>
                </Box>
                {race.subraceCount > 0 ? (
                  <Chip
                    label={`${race.subraceCount} subrace${race.subraceCount === 1 ? '' : 's'}`}
                    color="secondary"
                    sx={{ alignSelf: 'flex-start' }}
                  />
                ) : null}
              </Stack>

              <Typography variant="body1">{race.summary}</Typography>

              <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                <InfoPill label={`Size: ${race.sizeText}`} />
                <InfoPill label={`Speed: ${race.speedText}`} />
                <InfoPill label={`ASI: ${race.abilityText}`} />
              </Stack>

              <Divider />

              <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                {race.traitTags.length ? (
                  race.traitTags.map((tag) => <Chip key={tag} label={tag} size="small" />)
                ) : (
                  <Typography variant="body2" sx={{ opacity: 0.7 }}>
                    No trait tags listed.
                  </Typography>
                )}
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Stack>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <Box
      sx={{
        minWidth: 180,
        borderRadius: 3,
        px: 2,
        py: 1.5,
        backgroundColor: 'rgba(15, 23, 42, 0.42)',
        border: '1px solid rgba(148, 163, 184, 0.16)',
      }}
    >
      <Typography variant="caption" sx={{ opacity: 0.75 }}>
        {label}
      </Typography>
      <Typography variant="body1" sx={{ fontWeight: 700 }}>
        {value}
      </Typography>
    </Box>
  );
}

function InfoPill({ label }: { label: string }) {
  return (
    <Chip
      label={label}
      variant="outlined"
      sx={{ borderRadius: 2, borderColor: 'rgba(148, 163, 184, 0.25)' }}
    />
  );
}
