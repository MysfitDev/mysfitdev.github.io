import { Stack, Typography } from '@mui/material';

import CopyableJsonLink from '@/components/CopyableJsonLink';
import RacesBrowser from '@/components/RacesBrowser';
import { getRaceCatalog } from '@/lib/dnd/raceData';
import { getRaceManifest } from '@/lib/dnd/raceManifest';

export default async function RacePage() {
  const [manifest, races] = await Promise.all([getRaceManifest(), getRaceCatalog()]);

  return (
    <Stack spacing={3}>
      <Stack spacing={1.5}>
        <Typography variant="h3" component="h1" sx={{ fontWeight: 700 }}>
          Dungeons and Dragons Races
        </Typography>
        <Typography variant="body1" sx={{ maxWidth: 900, opacity: 0.88 }}>
          Copy the link above to import the full race collection, including all included subraces. If you only want a specific race or a more tailored import target, choose one of the race pages below.
        </Typography>
      </Stack>
      <CopyableJsonLink path="/data/dnd/homebrew/races/all.json" />
      <RacesBrowser
        races={races}
        totalRaceCount={manifest._meta.raceCount}
        totalSubraceCount={manifest._meta.subraceCount}
        generatedAt={manifest._meta.generatedAt}
      />
    </Stack>
  );
}
