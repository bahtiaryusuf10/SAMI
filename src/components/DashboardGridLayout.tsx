'use client';

import {
  useEffect,
  useState,
  isValidElement,
  Children,
  ReactNode,
  useCallback,
} from 'react';
import { Responsive, WidthProvider, Layouts } from 'react-grid-layout';
import 'react-resizable/css/styles.css';
import 'react-grid-layout/css/styles.css';
import { Loader2 } from 'lucide-react';

const sizeConfigs = {
  small: { w: 4, h: 4, minW: 4, minH: 3 },
  semiMedium: { w: 5, h: 4, minW: 4, minH: 3 },
  medium: { w: 6, h: 4, minW: 4, minH: 3 },
  semiLarge: { w: 7, h: 4, minW: 6, minH: 3 },
  large: { w: 8, h: 4, minW: 6, minH: 3 },
  full: { w: 12, h: 4, minW: 8, minH: 3 },
};
const DEFAULT_TYPE = 'medium';

type Size = keyof typeof sizeConfigs;

interface ChildWithLayoutProps {
  type?: Size;
}

interface DashboardGridLayoutProps {
  pageKey: string;
  children: ReactNode;
}

const ResponsiveGridLayout = WidthProvider(Responsive);

export function DashboardGridLayout({
  pageKey,
  children,
}: DashboardGridLayoutProps) {
  const [layouts, setLayouts] = useState<Layouts | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(`layout-${pageKey}`);
    const finalLayouts: Layouts = {};

    if (saved) {
      try {
        const savedLayouts: Layouts = JSON.parse(saved);
        for (const key in savedLayouts) {
          finalLayouts[key] = savedLayouts[key];
        }

        // console.log('finalLayouts dari storage :  ', finalLayouts);
      } catch (e) {
        console.error(
          'Gagal parse layout dari localStorage, kembali ke default.',
          e
        );
      }
    }

    // console.log(
    //   'Panjang object finalLayouts : ',
    //   Object.keys(finalLayouts).length
    // );

    if (!Object.keys(finalLayouts).length) {
      if (Children.count(children) === 0) {
        return;
      }

      let currentX = 0;
      let currentY = 0;
      let rowMaxH = 0;

      const defaultLayout = Children.toArray(children).map((child) => {
        if (!isValidElement(child) || !child.key) {
          throw new Error(
            "DashboardGridLayout child must have a unique 'key' prop."
          );
        }

        const props = child.props as ChildWithLayoutProps;
        const type = props.type || DEFAULT_TYPE;
        const config = sizeConfigs[type];

        if (currentX + config.w > 12) {
          currentY += rowMaxH;
          currentX = 0;
          rowMaxH = 0;
        }

        const layoutItem = {
          i: child.key.toString(),
          x: currentX,
          y: currentY,
          ...config,
        };

        currentX += config.w;
        if (config.h > rowMaxH) {
          rowMaxH = config.h;
        }

        return layoutItem;
      });

      const breakpoints = ['lg', 'md', 'sm', 'xs', 'xxs'];
      breakpoints.forEach((bp) => {
        finalLayouts[bp] = defaultLayout;
      });

      // console.log('finalLayouts digenerate ulang :  ', finalLayouts);
    }

    setLayouts(finalLayouts);
  }, [children, pageKey]);

  const handleLayoutChange = useCallback(
    (_: Layouts['lg'], allLayouts: Layouts) => {
      setLayouts(allLayouts);
      localStorage.setItem(`layout-${pageKey}`, JSON.stringify(allLayouts));
    },
    [pageKey]
  );

  if (!layouts) {
    return (
      <div className="h-screen">
        <div className="flex justify-center items-center h-3/4">
          <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
          <span className="ml-2 text-white text-xl">Memuat Layout...</span>
        </div>
      </div>
    );
  }

  return (
    // <div>
    //   <button
    //     onClick={() => {
    //       localStorage.removeItem(`layout-${pageKey}`);
    //       window.location.reload();
    //     }}
    //     className="bg-red-500 text-white px-4 py-2 rounded-lg mt-5 ml-3"
    //   >
    //     Reset Layout
    //   </button>
    <ResponsiveGridLayout
      className="layout"
      breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
      cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
      rowHeight={100}
      autoSize={true}
      isDraggable={true}
      isResizable={true}
      useCSSTransforms={true}
      compactType="vertical"
      draggableCancel="[data-no-drag]"
      preventCollision={false}
      margin={[16, 16]}
      layouts={layouts}
      onLayoutChange={handleLayoutChange}
    >
      {Children.toArray(children).map((child, index) => {
        if (!isValidElement(child)) return null;
        return <div key={child.key ?? index}>{child}</div>;
      })}
    </ResponsiveGridLayout>
    // // //{' '}
    // </div>
  );
}
