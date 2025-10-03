'use client';

import RacePageJsonRenderer from '@/components/RacePageJsonRenderer';
import React from 'react';

export default function RacePage({ params }: { params: { race: string } }) {
  return <RacePageJsonRenderer title="Kumiho" race="kumiho" />;
}
