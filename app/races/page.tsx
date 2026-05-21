import { Button, Container } from '@mui/material';

import { getRaceIndex } from '@/lib/dnd/raceManifest';

export default async function RacePage() {
  const races = await getRaceIndex();

  return (
    <Container className="flex flex-col gap-2" maxWidth={false}>
      <h1 className="text-3xl font-bold mb-4">Dungeons and Dragons Races</h1>

      {races.map((race) => (
        <Button
          key={race.slug}
          variant="outlined"
          className="mb-2"
          href={`/races/${race.slug}`}
          component="a"
        >
          {race.name}
        </Button>
      ))}
    </Container>
  );
}
