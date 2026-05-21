'use client';

import { Button, InputAdornment, OutlinedInput } from '@mui/material';
import { useEffect, useState } from 'react';

interface CopyableJsonLinkProps {
  path: string;
}

export default function CopyableJsonLink({ path }: CopyableJsonLinkProps) {
  const [origin, setOrigin] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const fullUrl = origin ? `${origin}${path}` : path;

  const handleCopy = async () => {
    if (!origin) return;

    await navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <OutlinedInput
      fullWidth
      value={fullUrl}
      readOnly
      endAdornment={
        <InputAdornment position="end">
          <Button onClick={handleCopy} variant="contained">
            {copied ? 'Copied!' : 'Copy URL'}
          </Button>
        </InputAdornment>
      }
    />
  );
}
