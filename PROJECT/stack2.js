d3.csv("./Dataset/dataUkrRegion.csv").then(function(data) {
    const margin = { top: 20, right: 30, bottom: 50, left: 60 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg3 = d3.select("#chart3")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom + 25)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top + 20})`);

    const parseDate = d3.timeParse("%Y");

    const keys = ["Americas", "Asia and Pacific", "Europe", "ME and NA", "Southern Africa", "West, Central Africa"];
    const color = d3.scaleLinear()
        .domain([0, keys.length - 1])
        .range(["lightblue", "darkblue"]);
        const parsedData = data.map(d => {
            const newData = { Year: parseDate(d.Years) };
            keys.forEach((key) => {
                newData[key] = +d[key];
            });
            return newData;
        });

    const stack = d3.stack().keys(keys);

    const stackedData = stack(parsedData);

    const x = d3.scaleTime()
        .domain(d3.extent(parsedData, d => d.Year))
        .range([0, width]);

    const y = d3.scaleLinear()
        .domain([0, d3.max(stackedData, d => d3.max(d, d => d[1]))])
        .nice()
        .range([height, 0]);

    const area = d3.area()
        .x(d => x(d.data.Year))
        .y0(d => y(d[0]))
        .y1(d => y(d[1]))
        .curve(d3.curveBasis);

    const areas = svg3.selectAll(".area")
        .data(stackedData)
        .join("path")
        .attr("class", "area")
        .attr("fill", (d, i) => color(i))
        .attr("d", area);

    svg3.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x).ticks(10).tickFormat(d3.timeFormat("%Y")));

    svg3.append("g")
        .call(d3.axisLeft(y));

    const legend = d3.select("#legend2")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", 50)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    let xOffset = 0;

    const legendItems = legend.selectAll("g")
        .data(keys)
        .enter().append("g")
        .attr("transform", (d, i) => {
            const textWidth = d.length * 6; // Adjust the multiplier as needed
            const currentOffset = xOffset;
            xOffset += textWidth + 50; // Adjust the padding between legend items as needed
            return `translate(${currentOffset}, 0)`;
        })
        .on("mouseover", function (event, d) {
            const selectedArea = areas.filter(datum => datum.key === d);
            const otherAreas = areas.filter(datum => datum.key !== d);
            selectedArea.transition().duration(200).style("opacity", 1);
            otherAreas.transition().duration(200).style("opacity", 0.3);
        })
        .on("mouseout", function (event) {
            areas.transition().duration(200).style("opacity", 1);
        });

    legendItems.append("rect")
        .attr("width", 15)
        .attr("height", 15)
        .attr("fill", (d, i) => color(i));

    legendItems.append("text")
        .attr("x", 20)
        .attr("y", 9.5)
        .attr("dy", "0.32em")
        .text(d => d);

    svg3.append("text")
        .attr("x", (width / 2))
        .attr("y", 0 - (margin.top - 5))
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("text-decoration", "underline")
        .text("Title of Your Graph");
});