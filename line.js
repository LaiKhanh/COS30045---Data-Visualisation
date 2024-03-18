d3.csv("./Dataset/world.csv").then(function(data) {
    // Convert count values to numbers after removing all periods
    data.forEach(function(d) {
        d.Count = +d.Count.replace(/\./g, ''); // Remove all periods and convert to number
    });

    // Chart dimensions
    let margin = { top: 20, right: 30, bottom: 50, left: 100 };
    let width = 800 - margin.left - margin.right;
    let height = 400 - margin.top - margin.bottom;

    // SVG
    let svg1 = d3.select("#chart1")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom + 25)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top + 20})`);

    // Tooltip
    let tooltip = d3.select(".tooltip");

    // Scales
    let xScale = d3.scaleLinear()
        .domain([d3.min(data, d => +d.Years), d3.max(data, d => +d.Years)])
        .range([0, width]);

    let yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => +d.Count)])
        .range([height, 0]);

    // Line
    let line = d3.line()
        .x(d => xScale(+d.Years))
        .y(d => yScale(+d.Count));

    // Draw line
    svg1.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", line)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", "3px");

    // Draw dots for each data point
    svg1.selectAll(".dot")
        .data(data)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("cx", d => xScale(+d.Years))
        .attr("cy", d => yScale(+d.Count))
        .attr("r", 4)
        .attr("fill", "blue")
        .on("mouseover", function(event, d) {
            // let [x, y] = d3.pointer(d, svg.node()); // Get position relative to SVG container
            let [x, y] = d3.pointer(event, svg1.node());
            
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html(`<strong>Year:</strong> ${d.Years}<br/><strong>Count:</strong> ${d.Count}`)
                .style("left", `${x + 265}px`)
                .style("top", `${y + 295}px`);
        })
        .on("mouseout", function(d) {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });

    // X Axis
    svg1.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(xScale).ticks(10).tickFormat(d3.format("d")));

    // Y Axis
    // svg1.append("g")
    //     .call(d3.axisLeft(yScale));

    // Axis labels
    svg1.append("text")
        .attr("class", "axis-label")
        .attr("transform", `translate(${width / 2},${height + margin.top + 20})`)
        .style("text-anchor", "middle")
        .attr("font-size", "16px")
        .text("Year");

    svg1.append("text")
        .attr("class", "axis-label")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle") 
        .attr("font-size", "16px")    
        .text("Counts");

    svg1.append("text")
        .attr("x", (width / 2))
        .attr("y", 0 - (margin.top - 5))
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("text-decoration", "underline")
        .text("Title of Your Graph");

    // Create y-axis gridlines
    const yAxisGrid = d3.axisLeft(yScale)
        .tickSize(-width) // Specify the size of the gridlines to match the chart's width
        .ticks(10); // Specify the number of gridlines to be displayed

    // Append y-axis gridlines to the SVG
    svg1.append('g')
        .attr('class', 'grid horizontal-grid') // Create a class for the gridlines
        .call(yAxisGrid); // Call the yAxisGrid function to render the gridlines
});