import LulusanBekerjaClient from './_components/LulusanBekerjaClient';

export const revalidate = 600; // Cache page for 10 minute

export default function LulusanBekerjaPage() {
  return <LulusanBekerjaClient />;
}
