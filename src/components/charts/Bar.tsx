'use client';

import { ComputedDatum, ResponsiveBar } from '@nivo/bar';
import { getOrdinalColorScale } from '@nivo/colors';
import { useState } from 'react';
import { BarDatum } from '@/types/charts/bar';

type MyResponsiveBarProps = {
  data: BarDatum[];
  layout: 'horizontal' | 'vertical';
  groupMode: 'stacked' | 'grouped';
  colorPalette: 'nivo' | 'accent' | 'paired' | 'spectral';
  showLabels: boolean;
};

const initialKeys = [
  'hot dog',
  'burger',
  'sandwich',
  'kebab',
  'fries',
  'donut',
];

const MyResponsiveBar = ({
  data,
  layout,
  groupMode,
  colorPalette,
  showLabels,
}: MyResponsiveBarProps) => {
  const [selected, setSelected] = useState<ComputedDatum<BarDatum> | null>(
    null
  );

  const [activeKeys, setActiveKeys] = useState<string[]>(initialKeys);

  const getColor = getOrdinalColorScale({ scheme: colorPalette }, 'id');

  const toggleKey = (key: string) => {
    // setActiveKeys(
    //   (prev) =>
    //     prev.includes(key)
    //       ? prev.filter((k) => k !== key) // remove current bar
    //       : [...prev, key] // add
    // );

    if (activeKeys.length === 1 && activeKeys.includes(key)) {
      setActiveKeys(initialKeys); // show all the data
    } else {
      setActiveKeys([key]); // show selected data
    }
  };

  return (
    <>
      <ResponsiveBar
        data={data}
        keys={activeKeys}
        indexBy="country"
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
        fill={[
          {
            match: {
              id: 'fries',
            },
            id: 'dots',
          },
          {
            match: {
              id: 'sandwich',
            },
            id: 'lines',
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
          legend: layout === 'vertical' ? 'Country' : 'Total',
          legendPosition: 'middle',
          legendOffset: 40,
          truncateTickAt: 0,
          // renderTick: (tick) => (
          //   <g transform={`translate(${tick.x},${tick.y})`}>
          //     <text
          //       textAnchor="end"
          //       dominantBaseline="alphabetic"
          //       style={{ fontSize: 11 }}
          //       transform="rotate(-20)"
          //     >
          //       {tick.value}
          //     </text>
          //   </g>
          // ),
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: layout === 'vertical' ? 'Total' : 'Country',
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
        // labelPosition="end"
        // labelOffset={-10}
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
            data: initialKeys.map((key) => ({
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
        // onClick={(data, event) => {
        //   console.log('Clicked bar data:', data);
        //   alert(`${data.id} in ${data.indexValue}: ${data.value}`);
        // }}

        onClick={(bar) => {
          if (
            selected &&
            selected.id === bar.id &&
            selected.indexValue === bar.indexValue
          ) {
            setSelected(null);
          } else {
            setSelected(bar);
          }
        }}
      />

      {selected && (
        <div className="p-4 bg-gray-100 rounded shadow">
          <h2 className="font-bold text-lg mb-2">📌 Detail Bar</h2>
          <p>
            <strong>Makanan:</strong> {selected.id}
          </p>
          <p>
            <strong>Negara:</strong> {selected.indexValue}
          </p>
          <p>
            <strong>Jumlah:</strong>{' '}
            {selected.data[selected.id as keyof BarDatum]}
          </p>
        </div>
      )}
    </>
  );
};

export default MyResponsiveBar;
