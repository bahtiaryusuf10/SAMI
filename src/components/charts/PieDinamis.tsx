'use client';

import { ResponsivePie } from '@nivo/pie';
import { getOrdinalColorScale } from '@nivo/colors';

interface MyResponsivePieProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
  colorPalette?: 'nivo' | 'accent' | 'paired' | 'spectral';
  onClickSlice?: (datum: { id: string | number }) => void;
}

const MyResponsivePie = ({
  data,
  colorPalette = 'nivo',
  onClickSlice,
}: MyResponsivePieProps) => {
  const getColor = getOrdinalColorScale({ scheme: colorPalette }, 'id');

  const fill = data.map((item, index) => ({
    match: { id: item.id },
    id: index % 2 === 0 ? 'dots' : 'lines',
  }));

  return (
    <ResponsivePie
      data={data}
      margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
      padAngle={0.7}
      cornerRadius={3}
      activeOuterRadiusOffset={8}
      colors={getColor}
      borderWidth={1}
      borderColor={{
        from: 'color',
        modifiers: [['darker', 0.2]],
      }}
      arcLinkLabelsSkipAngle={10}
      arcLinkLabelsTextColor="#333333"
      arcLinkLabelsThickness={2}
      arcLinkLabelsColor={{ from: 'color' }}
      arcLabelsSkipAngle={10}
      arcLabelsTextColor={{
        from: 'color',
        modifiers: [['darker', 2]],
      }}
      defs={[
        {
          id: 'dots',
          type: 'patternDots',
          background: 'inherit',
          color: 'rgba(255, 255, 255, 0.3)',
          size: 4,
          padding: 1,
          stagger: true,
        },
        {
          id: 'lines',
          type: 'patternLines',
          background: 'inherit',
          color: 'rgba(255, 255, 255, 0.3)',
          rotation: -45,
          lineWidth: 6,
          spacing: 10,
        },
      ]}
      fill={fill}
      legends={[
        {
          anchor: 'bottom',
          direction: 'row',
          justify: false,
          translateX: 0,
          translateY: 56,
          itemsSpacing: 30,
          itemWidth: data.length > 5 ? 60 : 80,
          itemHeight: 18,
          itemTextColor: '#999',
          itemDirection: 'left-to-right',
          itemOpacity: 0.8,
          symbolSize: 15,
          symbolShape: 'circle',
          effects: [
            {
              on: 'hover',
              style: {
                itemTextColor: '#000',
                itemOpacity: 1,
                symbolSize: 18,
                symbolBorderColor: '#333',
              },
            },
          ],
        },
      ]}
      onClick={(datum) => {
        onClickSlice?.(datum);
      }}
    />
  );
};

export default MyResponsivePie;
