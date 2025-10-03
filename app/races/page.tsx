'use client';

import React from 'react';
import {
  Button,
  Container,
  InputAdornment,
  OutlinedInput,
} from '@mui/material';

interface RaceEntry {
  name: string;
  pathName: string;
  icon?: React.ReactNode;
}

export default function RacePage({ params }: { params: { race: string } }) {
  const races: RaceEntry[] = [
    {
      name: 'Avilus',
      pathName: 'avilus',
    },
    {
      name: 'Awoken Bread Loaf',
      pathName: 'awoken_bread_loaf',
    },
    {
      name: 'Colossus',
      pathName: 'colossus',
    },
    {
      name: 'House Dragon',
      pathName: 'house_dragon',
    },
    {
      name: 'Kumiho',
      pathName: 'kumiho',
    },
    {
      name: 'Lopunny',
      pathName: 'lopunny',
    },
    {
      name: 'Pipe Fox',
      pathName: 'pipe_fox',
    },
  ];

  return (
    <Container className="flex flex-col gap-2" maxWidth={false}>
      <h1 className="text-3xl font-bold mb-4">Dungeons and Dragons Races</h1>

      {races.map((race) => (
        <Button
          key={race.pathName}
          variant="outlined"
          className="mb-2"
          href={`/races/${race.pathName}`}
          component="a"
        >
          {race.name}
        </Button>
      ))}
    </Container>
  );
}
