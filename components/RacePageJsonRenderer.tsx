'use client';

import React from 'react';
import { Container } from '@mui/material';
import { useState, useEffect } from 'react';

import CopyableJsonLink from '@/components/CopyableJsonLink';

interface RagePageJsonRendererProps {
  title?: string;
  race: string;
}

export default function RagePageJsonRenderer({
  title,
  race,
}: RagePageJsonRendererProps) {
  const [data, setData] = useState<string | null>(null);
  const [error, setError] = useState(false);

  const path = `/data/dnd/homebrew/races/${race}.json`;

  useEffect(() => {
    if (!race) return;

    fetch(path)
      .then((res) => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then((json: string) => setData(JSON.stringify(json, null, 2)))
      .catch(() => setError(true));
  }, [race]);

  if (error)
    return (
      <Container className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold mb-4">An Error Occurred</h1>
      </Container>
    );

  return (
    <Container className="flex flex-col gap-2">
      <h1 className="text-3xl font-bold mb-4">{title ?? race}</h1>
      <CopyableJsonLink path={path} />
      <Container className="bg-neutral-900 rounded-lg">
        <pre className="overflow-x-auto text-sm">{data}</pre>
      </Container>
    </Container>
  );
}
