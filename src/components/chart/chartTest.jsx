// import { useLayoutEffect, useRef } from "react";
// import * as am5 from "@amcharts/amcharts5";
// import * as am5radar from "@amcharts/amcharts5/radar";
// import * as am5xy from "@amcharts/amcharts5/xy";
// import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

// export default function GaugeChartStep({ value = 50, bandsData }) {
//   const chartRef = useRef(null);

//   useLayoutEffect(() => {
//     let root = am5.Root.new(chartRef.current);
//     root._logo.dispose(); // remove amcharts logo
//     root.setThemes([am5themes_Animated.new(root)]);

//     let chart = root.container.children.push(
//       am5radar.RadarChart.new(root, {
//         startAngle: 160,
//         endAngle: 380,
//       })
//     );

//     let axisRenderer = am5radar.AxisRendererCircular.new(root, {
//       innerRadius: -40,
//     });

//     let xAxis = chart.xAxes.push(
//       am5xy.ValueAxis.new(root, {
//         min: -40,
//         max: 100,
//         strictMinMax: true,
//         renderer: axisRenderer,
//       })
//     );

//     // Clock Hand with bigger base
//     let axisDataItem = xAxis.makeDataItem({});
//     let clockHand = am5radar.ClockHand.new(root, {
//       radius: am5.percent(100),
//       bottomWidth: 15,          // base thickness
//       topWidth: 2,              // sharp tip
//       pinRadius: 15,            // circular pin at base
//       fill: am5.color(0xffffff),   // needle color
//       stroke: am5.color(0x000000), // outline
//     });

//     // Optional: style pin separately
//     clockHand.pin.setAll({
//       // fill: am5.color(0xffffff),
//       stroke: am5.color(0x000000),
//       strokeWidth: 2,
//     });

//     let bullet = axisDataItem.set(
//       "bullet",
//       am5xy.AxisBullet.new(root, { sprite: clockHand })
//     );
//     xAxis.createAxisRange(axisDataItem);
//     axisDataItem.set("value", value);

//     // Label in center
//     chart.radarContainer.children.push(
//       am5.Label.new(root, {
//         fill: am5.color(0xffffff),
//         centerX: am5.percent(50),
//         textAlign: "center",
//         centerY: am5.percent(50),
//         fontSize: "1.2em",
//         text: `${value}`,
//       })
//     );

//     // Bands
//     bandsData.forEach((data) => {
//       let axisRange = xAxis.createAxisRange(xAxis.makeDataItem({}));
//       axisRange.setAll({
//         value: data.lowScore,
//         endValue: data.highScore,
//       });
//       axisRange.get("axisFill").setAll({
//         visible: true,
//         fill: am5.color(data.color),
//         fillOpacity: 0.8,
//       });
//       axisRange.get("label").setAll({
//         text: data.title,
//         inside: true,
//         radius: 15,
//         fontSize: "0.7em",
//         fill: am5.color(0xffffff),
//       });
//     });

//     chart.appear(1000, 100);

//     return () => root.dispose();
//   }, [value, bandsData]);

//   return (
//     <div ref={chartRef} className="w-[245%] h-[300px] md:h-[355px]" />
//   );
// }

import { useLayoutEffect, useRef } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5radar from "@amcharts/amcharts5/radar";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

export default function GaugeChartStep({ value = 50, bandsData }) {
  const chartRef = useRef(null);

  useLayoutEffect(() => {
    let root = am5.Root.new(chartRef.current);
    root._logo.dispose(); // remove amcharts logo
    root.setThemes([am5themes_Animated.new(root)]);

    let chart = root.container.children.push(
      am5radar.RadarChart.new(root, {
        startAngle: 160,
        endAngle: 380,
      })
    );

    // Axis
    let axisRenderer = am5radar.AxisRendererCircular.new(root, {
      innerRadius: -40,
    });

    let xAxis = chart.xAxes.push(
      am5xy.ValueAxis.new(root, {
        min: -40,
        max: 100,
        strictMinMax: true,
        renderer: axisRenderer,
        radius: am5.percent(100),
      })
    );

    // Clock Hand with bigger base
    let axisDataItem = xAxis.makeDataItem({});
    let clockHand = am5radar.ClockHand.new(root, {
      radius: am5.percent(100),
      bottomWidth: 15,          // base thickness
      topWidth: 2,              // sharp tip
      pinRadius: 15,            // circular pin at base
      fill: am5.color(0xffffff),   // needle color
      stroke: am5.color(0x000000), // outline
    });

    // Optional: style pin separately
    clockHand.pin.setAll({
      // fill: am5.color(0xffffff),
      stroke: am5.color(0x000000),
      strokeWidth: 2,
    });

    let bullet = axisDataItem.set(
      "bullet",
      am5xy.AxisBullet.new(root, { sprite: clockHand })
    );
    xAxis.createAxisRange(axisDataItem);
    axisDataItem.set("value", value);

    // Label in center
    chart.radarContainer.children.push(
      am5.Label.new(root, {
        fill: am5.color(0xffffff),
        centerX: am5.percent(50),
        textAlign: "center",
        centerY: am5.percent(50),
        fontSize: "1.2em",
        text: `${value}`,
      })
    );

    // Bands
    bandsData.forEach((data) => {
      let axisRange = xAxis.createAxisRange(xAxis.makeDataItem({}));
      axisRange.setAll({
        value: data.lowScore,
        endValue: data.highScore,
      });
      axisRange.get("axisFill").setAll({
        visible: true,
        fill: am5.color(data.color),
        fillOpacity: 0.8,
      });
      axisRange.get("label").setAll({
        text: data.title,
        inside: true,
        radius: 15,
        fontSize: "0.6em",
        fill: am5.color(0xffffff),
      });
    });

    chart.appear(1000, 100);

    return () => root.dispose();
  }, [value, bandsData]);

  return (
    <div ref={chartRef} className="w-[245%] h-[300px] md:h-[355px]" />
  );
}
