'use client';

import RacePageJsonRenderer from '@/components/RacePageJsonRenderer';
import React from 'react';

export default function RacePage({ params }: { params: { race: string } }) {
  return (
    <RacePageJsonRenderer title="Awoken Bread Loaf" race="awoken_bread_loaf" />
  );
}
