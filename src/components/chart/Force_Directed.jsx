import React, { useLayoutEffect, useRef } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5hierarchy from "@amcharts/amcharts5/hierarchy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

const ForceDirectedChart = () => {
    const chartRef = useRef(null);

    useLayoutEffect(() => {
        const root = am5.Root.new(chartRef.current);
        root._logo.dispose(); // remove amcharts logo

        // Apply themes
        root.setThemes([am5themes_Animated.new(root)]);

        // Create data
        let data = {
            value: 0,
            children: [],
        };

        for (let i = 0; i < 15; i++) {
            data.children.push({ name: "node " + i, value: Math.random() * 20 + 1 });
        }

        // Create wrapper container
        const container = root.container.children.push(
            am5.Container.new(root, {
                width: am5.percent(100),
                height: am5.percent(100),
                layout: root.verticalLayout,
            })
        );

        // Create series
        const series = container.children.push(
            am5hierarchy.ForceDirected.new(root, {
                singleBranchOnly: false,
                downDepth: 2,
                topDepth: 1,
                initialDepth: 1,
                maxRadius: 60,
                minRadius: 20,
                valueField: "value",
                categoryField: "name",
                childDataField: "children",
                manyBodyStrength: -13,
                centerStrength: 0.8,
            })
        );

        // Style colors and links
        series.get("colors").setAll({ step: 1 });
        series.links.template.setAll({ strokeWidth: 2 });
        series.nodes.template.setAll({
            tooltipText: null,
            cursorOverStyle: "pointer",
        });

        // Node linking logic
        let selectedDataItem;

        series.nodes.template.events.on("click", (e) => {
            if (selectedDataItem) {
                let targetDataItem = e.target.dataItem;
                if (targetDataItem === selectedDataItem) {
                    selectedDataItem.get("outerCircle").setPrivate("visible", false);
                    selectedDataItem = undefined;
                } else {
                    if (series.areLinked(selectedDataItem, targetDataItem)) {
                        series.unlinkDataItems(selectedDataItem, targetDataItem);
                    } else {
                        series.linkDataItems(selectedDataItem, targetDataItem, 0.2);
                    }
                }
            } else {
                selectedDataItem = e.target.dataItem;
                selectedDataItem.get("outerCircle").setPrivate("visible", true);
            }
        });

        // Set data
        series.data.setAll([data]);
        series.set("selectedDataItem", series.dataItems[0]);

        // Animate
        series.appear(1000, 100);

        // Cleanup on unmount
        return () => {
            root.dispose();
        };
    }, []);

    return (
        <div
            ref={chartRef}
            id="chartdiv"
            style={{ width: "100%", height: "600px" }}
        ></div>
    );
};

export default ForceDirectedChart;
