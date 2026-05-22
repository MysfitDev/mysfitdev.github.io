import Link from 'next/link';
import type { ReactNode } from 'react';
import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography,
} from '@mui/material';

import CopyableJsonLink from '@/components/CopyableJsonLink';
import {
  type RaceEntryNode,
  type RaceFile,
  type RaceRecord,
  findNamedEntry,
  flattenEntryText,
  formatAbilityText,
  formatLanguageText,
  formatProficiencyText,
  formatSizeText,
  formatSourceLabel,
  formatSpeedText,
} from '@/lib/dnd/racePresentation';

interface RaceDetailViewProps {
  slug: string;
  file: RaceFile;
  record: RaceRecord;
}

const overviewSections = [
  'Ability Score Increase',
  'Age',
  'Alignment',
  'Size',
  'Speed',
  'Creature Type',
  'Languages',
] as const;

export default function RaceDetailView({
  slug,
  file,
  record,
}: RaceDetailViewProps) {
  const path = `/data/dnd/homebrew/races/${slug}.json`;
  const source = file._meta?.sources?.[0];
  const baseEntries = record.entries ?? [];
  const flavorText = flattenEntryText(record.fluff?.entries);
  const traitSections = baseEntries.filter(
    (entry) =>
      typeof entry !== 'string' &&
      entry.name &&
      !overviewSections.includes(entry.name as (typeof overviewSections)[number])
  ) as Extract<RaceEntryNode, { name?: string; entries?: RaceEntryNode[] }>[];

  return (
    <Stack spacing={3.5}>
      <Stack spacing={1}>
        <Typography
          component={Link}
          href="/races"
          variant="body2"
          sx={{ width: 'fit-content', textDecoration: 'none', opacity: 0.8 }}
        >
          Back to races
        </Typography>
        <Typography variant="h3" component="h1" sx={{ fontWeight: 700 }}>
          {record.name}
        </Typography>
        <Typography variant="body1" sx={{ maxWidth: 880, opacity: 0.9 }}>
          {flattenEntryText(baseEntries).find(Boolean) ?? 'No overview text available.'}
        </Typography>
      </Stack>

      <Card sx={{ borderRadius: 4 }}>
        <CardContent sx={{ display: 'grid', gap: 2 }}>
          <Typography variant="h5" component="h2" sx={{ fontWeight: 700 }}>
            Quick reference
          </Typography>
          <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
            <Chip label={`Size: ${formatSizeText(record.size)}`} />
            <Chip label={`Speed: ${formatSpeedText(record.speed)}`} />
            <Chip label={`ASI: ${formatAbilityText(record.ability)}`} />
            <Chip label={`Languages: ${formatLanguageText(record.languageProficiencies)}`} />
            {record.traitTags?.map((tag) => <Chip key={tag} label={tag} variant="outlined" />)}
          </Stack>
          <Typography variant="body2" sx={{ opacity: 0.76 }}>
            {formatSourceLabel(source)}
          </Typography>
          {source?.url ? (
            <Typography
              component="a"
              href={source.url}
              target="_blank"
              rel="noreferrer"
              variant="body2"
              sx={{ width: 'fit-content' }}
            >
              View original source reference
            </Typography>
          ) : null}
          <CopyableJsonLink path={path} />
        </CardContent>
      </Card>

      <Box
        sx={{
          display: 'grid',
          gap: 3,
          gridTemplateColumns: {
            xs: '1fr',
            xl: 'minmax(0, 1.2fr) minmax(0, 0.8fr)',
          },
        }}
      >
        <Stack spacing={3}>
          <SectionCard
            title="Core rules"
            description="The core race rules translated from the source data into readable sections."
          >
            <Stack spacing={2}>
              {overviewSections.map((sectionName) => {
                const section = findNamedEntry(baseEntries, sectionName);
                if (!section) return null;

                return (
                  <Box key={sectionName}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                      {sectionName}
                    </Typography>
                    {flattenEntryText(section.entries).map((paragraph) => (
                      <Typography key={paragraph} variant="body2" sx={{ mt: 0.75 }}>
                        {paragraph}
                      </Typography>
                    ))}
                  </Box>
                );
              })}
            </Stack>
          </SectionCard>

          <SectionCard
            title="Distinctive traits"
            description="Special features and standout mechanics."
          >
            <Stack spacing={2}>
              {traitSections.length ? (
                traitSections.map((section) => (
                  <Box key={section.name}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                      {section.name}
                    </Typography>
                    {flattenEntryText(section.entries).map((paragraph) => (
                      <Typography key={paragraph} variant="body2" sx={{ mt: 0.75 }}>
                        {paragraph}
                      </Typography>
                    ))}
                  </Box>
                ))
              ) : (
                <Typography variant="body2">No additional trait sections listed.</Typography>
              )}
            </Stack>
          </SectionCard>

          {record.subraces?.length ? (
            <SectionCard
              title="Subraces"
              description="Each subrace is shown with its stat changes and unique rules."
            >
              <Stack spacing={2.5}>
                {record.subraces.map((subrace) => (
                  <Box key={subrace.name}>
                    <Stack
                      direction={{ xs: 'column', sm: 'row' }}
                      spacing={1}
                      justifyContent="space-between"
                    >
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        {subrace.name}
                      </Typography>
                      <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                        <Chip
                          size="small"
                          label={`ASI: ${formatAbilityText(subrace.ability)}`}
                        />
                        {subrace.speed ? (
                          <Chip
                            size="small"
                            label={`Speed: ${formatSpeedText(subrace.speed)}`}
                          />
                        ) : null}
                      </Stack>
                    </Stack>
                    {flattenEntryText(subrace.entries).map((paragraph) => (
                      <Typography key={paragraph} variant="body2" sx={{ mt: 0.75 }}>
                        {paragraph}
                      </Typography>
                    ))}
                    <Divider sx={{ mt: 2 }} />
                  </Box>
                ))}
              </Stack>
            </SectionCard>
          ) : null}
        </Stack>

        <Stack spacing={3}>
          <SectionCard
            title="Proficiencies"
            description="Pulled from the structured fields rather than the prose."
          >
            <Stack spacing={1.5}>
              <InfoLine label="Skills" value={formatProficiencyText(record.skillProficiencies)} />
              <InfoLine label="Tools" value={formatProficiencyText(record.toolProficiencies)} />
              <InfoLine
                label="Languages"
                value={formatLanguageText(record.languageProficiencies)}
              />
            </Stack>
          </SectionCard>

          <SectionCard
            title="Lore and flavor"
            description="Narrative context, society notes, and naming guidance."
          >
            <Stack spacing={1.25}>
              {flavorText.length ? (
                flavorText.map((paragraph) => (
                  <Typography key={paragraph} variant="body2">
                    {paragraph}
                  </Typography>
                ))
              ) : (
                <Typography variant="body2">No lore section was included.</Typography>
              )}
            </Stack>
          </SectionCard>

          <SectionCard
            title="Raw JSON"
            description="Available when you want the original shape exactly as authored."
          >
            <details>
              <summary>Show source JSON</summary>
              <pre
                style={{
                  marginTop: '1rem',
                  overflowX: 'auto',
                  borderRadius: '16px',
                  padding: '1rem',
                  background: 'rgba(2, 6, 23, 0.92)',
                  fontSize: '0.85rem',
                }}
              >
                {JSON.stringify(file, null, 2)}
              </pre>
            </details>
          </SectionCard>
        </Stack>
      </Box>
    </Stack>
  );
}

function SectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <Card sx={{ borderRadius: 4 }}>
      <CardContent sx={{ display: 'grid', gap: 2 }}>
        <Box>
          <Typography variant="h5" component="h2" sx={{ fontWeight: 700 }}>
            {title}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.72 }}>
            {description}
          </Typography>
        </Box>
        {children}
      </CardContent>
    </Card>
  );
}

function InfoLine({ label, value }: { label: string; value: string }) {
  return (
    <Box>
      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
        {label}
      </Typography>
      <Typography variant="body2">{value}</Typography>
    </Box>
  );
}
