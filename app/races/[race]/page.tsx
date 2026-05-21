import RacePageJsonRenderer from '@/components/RacePageJsonRenderer';
import { getRaceIndex } from '@/lib/dnd/raceManifest';
import { notFound } from 'next/navigation';

interface RaceDetailPageProps {
  params: Promise<{
    race: string;
  }>;
}

export const dynamicParams = false;

export async function generateStaticParams() {
  const races = await getRaceIndex();

  return races.map(({ slug }) => ({
    race: slug,
  }));
}

export default async function RaceDetailPage({
  params,
}: RaceDetailPageProps) {
  const { race } = await params;
  const races = await getRaceIndex();
  const entry = races.find((candidate) => candidate.slug === race);

  if (!entry) {
    notFound();
  }

  return <RacePageJsonRenderer title={entry.name} race={entry.slug} />;
}
