import RaceDetailView from '@/components/RaceDetailView';
import { getRaceFile, getRaceRecord } from '@/lib/dnd/raceData';
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

  const [file, record] = await Promise.all([
    getRaceFile(entry.slug),
    getRaceRecord(entry.slug),
  ]);

  if (!record) {
    notFound();
  }

  return <RaceDetailView slug={entry.slug} file={file} record={record} />;
}
