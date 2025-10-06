import { useLayoutEffect } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

export default function LineChart() {
    useLayoutEffect(() => {
        // Create root
        let root = am5.Root.new("chartdiv");
        root._logo.dispose();
        // Set theme
        root.setThemes([am5themes_Animated.new(root)]);

        // Create chart
        let chart = root.container.children.push(
            am5xy.XYChart.new(root, {
                focusable: true,
                panX: true,
                panY: true,
                wheelX: "panX",
                wheelY: "zoomX",
                pinchZoomX: true,
            })
        );
        chart.get("colors").set("step", 3);
        // Create X Axis
        let xAxis = chart.xAxes.push(
            am5xy.DateAxis.new(root, {
                maxDeviation: 0.1,
                groupData: false,
                baseInterval: { timeUnit: "day", count: 1 },
                renderer: am5xy.AxisRendererX.new(root, {
                    minGridDistance: 80,
                    minorGridEnabled: true,
                }),
                tooltip: am5.Tooltip.new(root, {}),
            })
        );

        // X-axis labels white
        xAxis.get("renderer").labels.template.setAll({
            fill: am5.color(0xffffff), // white text
        });

        // Function to create Y Axis + Series
        function createAxisAndSeries(startValue, opposite) {
            let yRenderer = am5xy.AxisRendererY.new(root, { opposite });
            let yAxis = chart.yAxes.push(
                am5xy.ValueAxis.new(root, {
                    maxDeviation: 1,
                    renderer: yRenderer,
                })
            );

            if (chart.yAxes.indexOf(yAxis) > 0) {
                yAxis.set("syncWithAxis", chart.yAxes.getIndex(0));
            }

            let series = chart.series.push(
                am5xy.LineSeries.new(root, {
                    xAxis,
                    yAxis,
                    valueYField: "value",
                    valueXField: "date",
                    tooltip: am5.Tooltip.new(root, {
                        pointerOrientation: "horizontal",
                        labelText: "{valueY}",
                    }),
                })
            );

            series.strokes.template.setAll({ strokeWidth: 1 });

            yRenderer.grid.template.set("strokeOpacity", 0.05);
            yRenderer.labels.template.set("fill", series.get("fill"));
            yRenderer.setAll({
                stroke: series.get("fill"),
                strokeOpacity: 1,
                opacity: 1,

            });

            // Data Processor
            series.data.processor = am5.DataProcessor.new(root, {
                dateFormat: "yyyy-MM-dd",
                dateFields: ["date"],
            });

            series.data.setAll(generateChartData(startValue));
        }

        // Add Cursor
        let cursor = chart.set(
            "cursor",
            am5xy.XYCursor.new(root, {
                xAxis,
                behavior: "none",
            })
        );
        cursor.lineY.set("visible", false);

        // Add Scrollbar
        chart.set(
            "scrollbarX",
            am5.Scrollbar.new(root, {
                orientation: "horizontal",
            })
        );

        // Create multiple series
        createAxisAndSeries(100, false);
        createAxisAndSeries(1000, true);
        createAxisAndSeries(8000, true);

        // Animate chart
        chart.appear(1000, 100);

        // Generate Data
        function generateChartData(value) {
            let data = [];
            let firstDate = new Date();
            firstDate.setDate(firstDate.getDate() - 100);
            firstDate.setHours(0, 0, 0, 0);

            for (let i = 0; i < 100; i++) {
                let newDate = new Date(firstDate);
                newDate.setDate(newDate.getDate() + i);

                value += Math.round(
                    ((Math.random() < 0.5 ? 1 : -1) * Math.random() * value) / 20
                );

                data.push({ date: newDate, value });
            }
            return data;
        }

        return () => {
            root.dispose();
        };
    }, []);

    return <div id="chartdiv" className="w-full h-[500px]" />;
}
