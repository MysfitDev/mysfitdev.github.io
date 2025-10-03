'use client';

import React from 'react';
import {
  OutlinedInput,
  InputAdornment,
  Button,
  Container,
} from '@mui/material';
import { useState, useEffect } from 'react';

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

  const [origin, setOrigin] = useState<string | null>(null);

  const path = `/data/dnd/homebrew/races/${race}.json`;

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

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

  // Client-side copy button
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!origin || !path) return;

    await navigator.clipboard.writeText(`${origin}${path}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (error)
    return (
      <Container className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold mb-4">An Error Occurred</h1>
      </Container>
    );

  return (
    <Container className="flex flex-col gap-2">
      <h1 className="text-3xl font-bold mb-4">{title ?? race}</h1>
      <OutlinedInput
        fullWidth
        endAdornment={
          <InputAdornment position="end">
            <Button onClick={handleCopy} variant="contained">
              {copied ? 'Copied!' : 'Copy URL'}
            </Button>
          </InputAdornment>
        }
        defaultValue={`${origin}${path}`}
      />
      <Container className="bg-neutral-900 rounded-lg">
        <pre className="overflow-x-auto text-sm">{data}</pre>
      </Container>
    </Container>
  );
}
