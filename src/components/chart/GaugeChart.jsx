import { useLayoutEffect, useRef } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5radar from "@amcharts/amcharts5/radar";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

export default function GaugeChart({ value = 50, bandsData, ranges = [] }) {
  const chartRef = useRef(null);

  useLayoutEffect(() => {
    // Create root
    let root = am5.Root.new(chartRef.current);
    root._logo.dispose(); // remove amcharts logo
    root.autoResize = true;

    root.setThemes([am5themes_Animated.new(root)]);

    // Create Radar Chart
    let chart = root.container.children.push(
      am5radar.RadarChart.new(root, { 
        startAngle: 160, 
        endAngle: 380 
      })
    );

    // Axis
    let axisRenderer = am5radar.AxisRendererCircular.new(root, { 
      innerRadius: -40 
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

    // Hide the axis labels numbers.........>>>>>
    axisRenderer.labels.template.setAll({ forceHidden: false });

    // Custom range labels using axis ranges (replaces defaults like 0, 50, 100)
    if (ranges.length > 0) {
      ranges.forEach((val) => {
        let axisRange = xAxis.createAxisRange(xAxis.makeDataItem({}));
        axisRange.setAll({
          value: val,
          endValue: val,  // Single point for tick label
        });
        axisRange.get("axisFill").setAll({
          visible: false,  // No fill for just a label
        });
        let rangeLabel = axisRange.get("label");
        rangeLabel.setAll({
          text: val.toString(),
          inside: false,  // Place outside the arc
          radius: 5,     // Adjust offset from axis
          fontSize: "0.6em",
          fill: am5.color(0x000000),  // Black text
          fontWeight: "500",
        });

        rangeLabel.set("forceHidden", false);  // Override template to show this label
        rangeLabel.set("visible", true);       // Ensure visibility
      });
    }

    // Clock hand
    let axisDataItem = xAxis.makeDataItem({});
    let clockHand = am5radar.ClockHand.new(root, { 
      radius: am5.percent(95),
      bottomWidth: 10,          // base thickness
      topWidth: 1,              // sharp tip
      pinRadius: 14,            // circular pin at base
      fill: am5.color(0xffffff),   // needle color
      stroke: am5.color(0x000000), // outline
    });

    // Optional: style pin separately
    clockHand.pin.setAll({
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
        fontSize: "0.9em",
        text: `${value}`,
      })
    );

    // Bands data
    const defaultBandsData = [
      { title: "Unsustainable", color: "#ee1f25", lowScore: -40, highScore: -20 },
      { title: "Volatile", color: "#f04922", lowScore: -20, highScore: 0 },
      { title: "Foundational", color: "#fdae19", lowScore: 0, highScore: 20 },
      { title: "Developing", color: "#f3eb0c", lowScore: 20, highScore: 40 },
      { title: "Maturing", color: "#b0d136", lowScore: 40, highScore: 60 },
      { title: "Sustainable", color: "#54b947", lowScore: 60, highScore: 80 },
      { title: "High Performing", color: "#0f9747", lowScore: 80, highScore: 100 },
    ];

    // Use props if provided, otherwise default
    const bandsToUse = bandsData || defaultBandsData;

    // Create bands
    bandsToUse.forEach((data) => {
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
      let bandLabel = axisRange.get("label");
      bandLabel.setAll({
        text: data.title,
        inside: true,
        radius: 15,
        fontSize: "0.6em",
        fill: am5.color("#ffffff"),
        fontWeight: "500",
      });
      bandLabel.set("forceHidden", false);
      bandLabel.set("visible", true);
    });

    chart.appear(1000, 100);

    return () => {
      root.dispose();
    };
  }, [value, bandsData, ranges]);

  return (
    <div 
      ref={chartRef} 
      className="w-[466px] ml-[-33px] h-[300px] md:h-[400px]" 
    />
  );
}