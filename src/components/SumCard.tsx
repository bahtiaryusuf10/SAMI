import { Card, CardContent } from '@/components/ui/card';

interface SumCardProps {
  type: string;
  year: string;
  value: number;
}

export default function SumCard({ type, year, value }: SumCardProps) {
  return (
    // <Card className="flex-1 min-w-[130px] p-4 rounded-2xl odd:bg-amber-200 even:bg-red-200">
    //   <CardContent className="space-y-2">
    //     <span className="text-xs bg-white px-2 py-1 rounded-full text-purple-600">
    //       {year}
    //     </span>
    //     <h1 className="text-2xl font-semibold">{value}</h1>
    //     <h2 className="capitalize text-sm font-medium text-gray-500">{type}</h2>
    //   </CardContent>
    // </Card>

    <Card className="w-full h-full min-h-[120px] min-w-[130px] p-4 rounded-2xl odd:bg-amber-200 even:bg-red-200">
      <CardContent className="w-full flex flex-col justify-between space-y-2 h-auto">
        <span className="text-xs bg-white px-2 py-1 rounded-full text-purple-600">
          {year}
        </span>
        <h1 className="text-2xl font-semibold">{value}</h1>
        <h2 className="capitalize text-sm font-medium text-gray-500 truncate">
          {type}
        </h2>
      </CardContent>
    </Card>
  );
}
