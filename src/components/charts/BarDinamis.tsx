'use client';

import { ResponsiveBar } from '@nivo/bar';
import { getOrdinalColorScale } from '@nivo/colors';
import { useState } from 'react';

type MyResponsiveBarProps = {
  data: any[];
  keys: string[];
  indexBy: string;
  layout?: 'horizontal' | 'vertical';
  groupMode?: 'stacked' | 'grouped';
  colorPalette?: 'nivo' | 'accent' | 'paired' | 'spectral';
  showLabels: boolean;
  legendBottom: string;
  legendLeft: string;
};

const MyResponsiveBar = ({
  data,
  keys,
  indexBy,
  layout = 'vertical',
  groupMode = 'grouped',
  colorPalette = 'nivo',
  showLabels = true,
  legendBottom,
  legendLeft,
}: MyResponsiveBarProps) => {
  const [activeKeys, setActiveKeys] = useState<string[]>(keys);

  const getColor = getOrdinalColorScale({ scheme: colorPalette }, 'id');

  const toggleKey = (key: string) => {
    if (activeKeys.length === 1 && activeKeys.includes(key)) {
      setActiveKeys(keys);
    } else {
      setActiveKeys([key]);
    }
  };

  return (
    <>
      <ResponsiveBar
        data={data}
        keys={activeKeys}
        indexBy={indexBy}
        margin={{ top: 10, right: 130, bottom: 80, left: 60 }}
        padding={0.3}
        groupMode={groupMode}
        layout={layout}
        valueScale={{ type: 'linear' }}
        indexScale={{ type: 'band', round: true }}
        colors={getColor}
        defs={[
          {
            id: 'dots',
            type: 'patternDots',
            background: 'inherit',
            color: '#38bcb2',
            size: 4,
            padding: 1,
            stagger: true,
          },
          {
            id: 'lines',
            type: 'patternLines',
            background: 'inherit',
            color: '#eed312',
            rotation: -45,
            lineWidth: 6,
            spacing: 10,
          },
        ]}
        borderColor={{
          from: 'color',
          modifiers: [['darker', 1.2]],
        }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: layout === 'vertical' ? legendBottom : legendLeft,
          legendPosition: 'middle',
          legendOffset: 40,
          truncateTickAt: 0,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: layout === 'vertical' ? legendLeft : legendBottom,
          legendPosition: 'middle',
          legendOffset: -50,
          truncateTickAt: 0,
        }}
        enableGridX={layout === 'horizontal'}
        enableLabel={showLabels}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={{
          from: 'color',
          modifiers: [['darker', 1.6]],
        }}
        legends={[
          {
            dataFrom: 'keys',
            anchor: 'bottom-right',
            direction: 'column',
            translateX: 120,
            itemWidth: 100,
            itemHeight: 20,
            itemDirection: 'left-to-right',
            symbolSize: 15,
            itemsSpacing: 2,
            itemOpacity: 0.8,
            itemTextColor: '#999',
            effects: [
              {
                on: 'hover',
                style: {
                  itemTextColor: '#000',
                  itemBackground: '#f5f5f5',
                  itemOpacity: 1,
                  symbolSize: 20,
                  symbolBorderColor: '#333',
                },
              },
            ],
            onClick: (data) => toggleKey(data.id as string),
            data: keys.map((key) => ({
              id: key,
              label: key,
              color: getColor({ id: key }),
              opacity: activeKeys.includes(key) ? 1 : 0.3,
            })),
          },
        ]}
        role="application"
        ariaLabel="Nivo bar chart demo"
        barAriaLabel={(e) =>
          e.id + ': ' + e.formattedValue + ' in country: ' + e.indexValue
        }
      />
    </>
  );
};

export default MyResponsiveBar;
