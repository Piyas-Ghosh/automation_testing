import { useLayoutEffect } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5radar from "@amcharts/amcharts5/radar";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

export default function GaugeChart() {
  useLayoutEffect(() => {
    // Create root
    let root = am5.Root.new("gaugeChartDiv");
    root._logo.dispose();       // remove amCharts logo
    root.autoResize = true;

    root.setThemes([am5themes_Animated.new(root)]);

    // Create Radar Chart
    let chart = root.container.children.push(
      am5radar.RadarChart.new(root, { startAngle: 160, endAngle: 380 })
    );

    // Axis
    let axisRenderer = am5radar.AxisRendererCircular.new(root, { innerRadius: -40 });
    let xAxis = chart.xAxes.push(
      am5xy.ValueAxis.new(root, {
        min: -40,
        max: 100,
        strictMinMax: true,
        renderer: axisRenderer,
      })
    );

    // Labels styling: default white
    xAxis.get("renderer").labels.template.setAll({
      fill: am5.color(0x0000000),
      fontWeight: "500",
    });

    // Clock hand
    let axisDataItem = xAxis.makeDataItem({});
    let clockHand = am5radar.ClockHand.new(root, { radius: am5.percent(100) });
    axisDataItem.set("bullet", am5xy.AxisBullet.new(root, { sprite: clockHand }));
    xAxis.createAxisRange(axisDataItem);

    axisDataItem.set("value", 50);

    setInterval(() => {
      axisDataItem.animate({
        key: "value",
        to: Math.round(Math.random() * 100),
        duration: 800,
        easing: am5.ease.out(am5.ease.cubic),
      });
    }, 2000);

    // Bands data
    const bandsData = [
      { title: "Unsustainable", color: "#ee1f25", lowScore: -40, highScore: -20 },
      { title: "Volatile", color: "#f04922", lowScore: -20, highScore: 0 },
      { title: "Foundational", color: "#fdae19", lowScore: 0, highScore: 20 },
      { title: "Developing", color: "#f3eb0c", lowScore: 20, highScore: 40 },
      { title: "Maturing", color: "#b0d136", lowScore: 40, highScore: 60 },
      { title: "Sustainable", color: "#54b947", lowScore: 60, highScore: 80 },
      { title: "High Performing", color: "#0f9747", lowScore: 80, highScore: 100 },
    ];

    // Create bands with white labels
    bandsData.forEach((data) => {
      let axisRange = xAxis.createAxisRange(xAxis.makeDataItem({}));
      axisRange.setAll({ value: data.lowScore, endValue: data.highScore });

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
        fill: am5.color("#ffffff"),
        fontWeight: "500",
      });
    });

    chart.appear(1000, 100);

    return () => {
      root.dispose();
    };
  }, []);

  return (
    <div id="gaugeChartDiv" className="w-[466px] ml-[-33px] h-[300px] md:h-[400px]" />
  );
}