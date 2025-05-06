'use client';
import MyResponsiveBar from '@/components/charts/Bar';
import MyResponsivePie from '@/components/charts/Pie';
import MyResponsiveLine from '@/components/charts/Line';
import SumCard from '@/components/SumCard';
import { dataBarChart } from '@/data/dataBarChart';
import { dataLineChart } from '@/data/dataLineChart';
import { dataBoxChart } from '@/data/dataBoxChart';
import { dataScatterChart } from '@/data/dataScatterChart';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState, useMemo } from 'react';
import { SelectGroup, SelectLabel } from '@radix-ui/react-select';
import BarChartSettings from '@/components/chart-settings/BarChartSettings';

import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import { useFilteredBarChartData } from '@/hooks/use-filtered-bar-chart-data';
import { useAggregatedPieData } from '@/hooks/use-aggregated-pie-chart-data';
import MyResponsiveBox from '@/components/charts/Box';
import MyResponsiveScatter from '@/components/charts/Scatter';

const ResponsiveGridLayout = WidthProvider(Responsive);

export default function Home() {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [layout, setLayout] = useState<'horizontal' | 'vertical'>('vertical');
  const [groupMode, setGroupMode] = useState<'stacked' | 'grouped'>('stacked');
  const [colorPalette, setColorPalette] = useState<
    'nivo' | 'accent' | 'paired' | 'spectral'
  >('nivo');
  const [showLabels, setShowLabels] = useState<true | false>(true);

  const allCountries = useMemo(() => {
    return dataBarChart.map((item) => item.country);
  }, []);

  // const filteredData = selectedCountry
  //   ? dataBarChart.filter((item) => item.country === selectedCountry)
  //   : dataBarChart;

  const [pieLimit, setPieLimit] = useState(4);

  const filteredBarChartData = useFilteredBarChartData(selectedCountry);
  const filteredPieChartData = useAggregatedPieData(pieLimit);

  const leftLayout = [
    { i: 'sum1', x: 0, y: 0, w: 2, h: 1.155, minH: 1.155 },
    { i: 'sum2', x: 2, y: 0, w: 2, h: 1.155, minH: 1.155 },
    { i: 'sum3', x: 4, y: 0, w: 2, h: 1.155, minH: 1.155 },
    { i: 'bar', x: 0, y: 1, w: 12, h: 4 },
    { i: 'line', x: 0, y: 2, w: 12, h: 4 },
    { i: 'scatter', x: 0, y: 3, w: 12, h: 4 },
  ];

  const rightLayout = [
    { i: 'pie', x: 0, y: 0, w: 4, h: 4, minH: 3, minW: 3 },
    { i: 'box', x: 0, y: 1, w: 4, h: 4, minH: 3, minW: 3 },
  ];

  return (
    <>
      <h1 className="px-6 mb-4 mt-7 text-4xl text-white font-semibold">
        Dashboard
      </h1>
      <div className="px-4 py-0 flex flex-col lg:flex-row gap-4 mb-10">
        {/* KIRI */}
        <div className="w-full lg:w-2/3">
          <ResponsiveGridLayout
            className="layout"
            layouts={{ lg: leftLayout }}
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480 }}
            cols={{ lg: 12, md: 10, sm: 6, xs: 4 }}
            rowHeight={100}
            autoSize={true}
            isDraggable={true}
            isResizable={true}
            useCSSTransforms={true}
            compactType="vertical"
            draggableCancel="[data-no-drag]"
          >
            <div key="sum1" className="bg-white rounded-xl shadow">
              <SumCard type="Jumlah Audit" year="2025/3" value={6666} />
            </div>
            <div key="sum2" className="bg-white rounded-xl shadow">
              <SumCard type="Jumlah Audit" year="2025/3" value={6666} />
            </div>
            <div key="sum3" className="bg-white rounded-xl shadow">
              <SumCard type="Jumlah Audit" year="2025/3" value={6666} />
            </div>
            <div
              key="bar"
              className="bg-white rounded-xl shadow p-5 relative h-auto"
              data-grid={{ x: 0, y: 1, w: 12, h: 4, minW: 4, minH: 2.5 }}
            >
              <div className="flex flex-col sm:flex-row sm:justify-between mb-3 relative">
                <div className="flex gap-4 items-center" data-no-drag>
                  <h2 className="text-lg font-semibold">Filter By Country</h2>
                  <Select
                    onValueChange={(value) =>
                      setSelectedCountry(value === 'all' ? null : value)
                    }
                    value={selectedCountry || 'all'}
                  >
                    <SelectTrigger className="w-[200px] bg-green-200">
                      <SelectValue placeholder="🌍 All Country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Country</SelectLabel>
                        <SelectItem value="all" data-no-drag>
                          🌍 All Country
                        </SelectItem>
                        {allCountries.map((country) => (
                          <SelectItem
                            key={country}
                            value={country}
                            data-no-drag
                          >
                            {country}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div
                  className="absolute top-15 right-0 z-10 sm:static sm:top-0 sm:right-0 sm:z-0"
                  data-no-drag
                >
                  <BarChartSettings
                    layout={layout}
                    setLayout={setLayout}
                    groupMode={groupMode}
                    setGroupMode={setGroupMode}
                    colorPalette={colorPalette}
                    setColorPalette={setColorPalette}
                    showLabels={showLabels}
                    setShowLabels={setShowLabels}
                  />
                </div>
              </div>

              <div
                className="w-full relative h-[370px] lg:h-[375px]"
                data-no-drag
              >
                <MyResponsiveBar
                  data={filteredBarChartData}
                  layout={layout}
                  groupMode={groupMode}
                  colorPalette={colorPalette}
                  showLabels={showLabels}
                />
              </div>
            </div>
            <div
              key="line"
              className="bg-white rounded-xl shadow p-5 relative h-auto"
              data-grid={{ x: 0, y: 1, w: 12, h: 4, minW: 4, minH: 2.5 }}
            >
              <div
                className="w-full relative h-[370px] lg:h-[375px]"
                data-no-drag
              >
                <MyResponsiveLine data={dataLineChart} />
              </div>
            </div>

            <div
              key="scatter"
              className="bg-white rounded-xl shadow p-5 relative h-auto"
              data-grid={{ x: 0, y: 1, w: 12, h: 4, minW: 4, minH: 2.5 }}
            >
              <div
                className="w-full relative h-[370px] lg:h-[375px]"
                data-no-drag
              >
                <MyResponsiveScatter data={dataScatterChart} />
              </div>
            </div>
          </ResponsiveGridLayout>
        </div>

        {/* KANAN */}
        <div className="w-full lg:w-1/3">
          <ResponsiveGridLayout
            className="layout"
            layouts={{ lg: rightLayout }}
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480 }}
            cols={{ lg: 12, md: 10, sm: 6, xs: 4 }}
            rowHeight={100}
            autoSize={true}
            isDraggable={true}
            isResizable={true}
            useCSSTransforms={true}
            compactType="vertical"
            draggableCancel="[data-no-drag]"
          >
            <div
              key="pie"
              className="h-[400px] bg-white rounded-xl shadow-md p-4"
            >
              <div
                className="flex justify-between items-center mb-4"
                data-no-drag
              >
                <h2 className="text-lg font-semibold">Top Languages</h2>
                <Select
                  value={String(pieLimit)}
                  onValueChange={(val) => setPieLimit(Number(val))}
                >
                  <SelectTrigger className="w-[120px] bg-purple-200 text-sm">
                    <SelectValue placeholder="Top 4" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4].map((num) => (
                      <SelectItem key={num} value={String(num)} data-no-drag>
                        Top {num}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="h-[calc(100%-2.5rem)]" data-no-drag>
                <MyResponsivePie data={filteredPieChartData} />
              </div>
            </div>
            <div
              key="box"
              className="h-[400px] bg-white rounded-xl shadow-md p-4"
            >
              <div className="h-full" data-no-drag>
                <MyResponsiveBox data={dataBoxChart} />
              </div>
            </div>
          </ResponsiveGridLayout>
        </div>
      </div>
    </>
  );
}
