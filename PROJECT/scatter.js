d3.csv("./Dataset/scatter.csv").then(function(data) {
    data.forEach(function(d) {
        d.Count = +d.Count;
        d.Distance = +d.Distance;
    });

    const svgWidth = 1000;
    const svgHeight = 600;
    const margin = { top: 20, right: 150, bottom: 50, left: 60, legend: 100 };

    const svg1 = d3.select("#chart1")
        .attr("width", svgWidth)
        .attr("height", svgHeight + 30)
        .style("font-family", "Arial, sans-serif");

    const width = svgWidth - margin.left - margin.right - margin.legend;
    const height = svgHeight - margin.top - margin.bottom;

    const g = svg1.append("g").attr("transform", `translate(${margin.left},${margin.top + 30})`);

    const xScale = d3.scaleBand().range([0, width]).padding(0.1);
    const yScale = d3.scaleLinear().range([height, 10]);
    const sizeScale = d3.scaleLog().range([3, 35]); // Using logarithmic scale for size
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    const tooltip = d3.select(".tooltip");

    xScale.domain(data.map(d => d.Year));
    yScale.domain([0, d3.max(data, d => d.Distance)]);
    sizeScale.domain([1, d3.max(data, d => d.Count)]); // Adjust domain for logarithmic scale

    g.selectAll(".bubble")
        .data(data)
        .enter().append("circle")
        .attr("class", "bubble")
        .attr("cx", d => xScale(d.Year) + xScale.bandwidth() / 2)
        .attr("cy", d => yScale(d.Distance))
        .attr("r", d => sizeScale(d.Count)) // Scale the radius based on count
        .attr("fill", d => colorScale(d.Region))
        .on("mouseover", function(event, d) {
            const [x, y] = d3.pointer(event, svg1.node());
            tooltip.style("display", "block")
                .style("left", `${x + 30}px`)
                .style("top", `${y + 180}px`)
                .html(`<strong>Year:</strong> ${d.Year}<br/><strong>Region:</strong> ${d.Region}<br/><strong>Distance:</strong> ${d.Distance}<br/><strong>Count:</strong> ${d.Count}`);
        })
        .on("mouseout", function() {
            tooltip.style("display", "none");
        });

    g.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(xScale));

    g.append("g")
        .call(d3.axisLeft(yScale));

    g.append("text")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom - 10)
        .attr("text-anchor", "middle")
        .text("Year");

    g.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left + 20)
        .attr("x", -height / 2)
        .attr("text-anchor", "middle")
        .text("Distance");

    const legendRegion = g.selectAll(".legend")
        .data(colorScale.domain())
        .enter().append("g")
        .attr("class", "legend")
        .style("font-size", "14px")
        .attr("transform", function(d, i) {
            return "translate(" + (width + margin.legend) + "," + i * 20 + ")";
        });

    legendRegion.append("rect")
        .attr("x", 0)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", colorScale);

    legendRegion.append("text")
        .attr("x", 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "start")
        .text(function(d) { return d; });

    const legendSize = g.append("g")
        .attr("class", "legend")
        .attr("transform", "translate(" + (width + margin.legend) + "," + (colorScale.domain().length * 20 + 20) + ")");

    legendSize.append("circle")
        .attr("cx", 9)
        .attr("cy", 9)
        .attr("r", 10)
        .style("fill", "none")
        .style("stroke", "black");

    legendSize.append("text")
        .attr("x", 24)
        .attr("y", 9)
        .style("font-size", "14px")
        .attr("dy", ".35em")
        .style("text-anchor", "start")
        .text("Count");

    // Title
    svg1.append("text")
        .attr("x", (width + margin.left + margin.right) / 2)
        .attr("y", margin.top)
        .attr("text-anchor", "middle")
        .style("text-decoration", "underline")
        .style("font-size", "18px")
        .text("Number and Distance of Migration from Ukraine between 2010 and 2023");
});
