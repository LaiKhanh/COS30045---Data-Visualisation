d3.csv("./Dataset/ukrtrend.csv").then(function(data) {
   // Convert count values to numbers after removing all periods
   data.forEach(function(d) {
      d.Count = +d.Count.replace(/\./g, ''); // Remove all periods and convert to number
   });

   // Set up dimensions
   const margin = { top: 20, right: 30, bottom: 50, left: 60 };
   const width = 800 - margin.left - margin.right;
   const height = 400 - margin.top - margin.bottom;

   // Create SVG element
   const svg5 = d3.select("#chart5")
               .append("svg")
               .attr("width", width + margin.left + margin.right)
               .attr("height", height + margin.top + margin.bottom + 15)
               .append("g")
               .attr("transform", `translate(${margin.left},${margin.top + 10})`);

   // Define scales
   const x = d3.scaleBand()
               .domain(data.map(d => d.Countries))
               .range([0, width])
               .padding(0.5);

   const y = d3.scaleLinear()
               .domain([0, d3.max(data, d => +d.Count)])
               .nice()
               .range([height, 0]);

   // Draw bars
   svg5.selectAll(".bar")
   .data(data)
   .enter().append("rect")
   .attr("class", "bar")
   .attr("x", d => x(d.Countries))
   .attr("y", height) // Start bars at the bottom
   .attr("width", x.bandwidth())
   .attr("height", 0) // Start bars with 0 height
   .style("fill", "steelblue")
   .on("mouseover", function(event, d) {
       // Show data on hover
       d3.select(this)
           .transition()
           .duration(200)
           .style("fill", "darkorange"); // Change color on hover

       const xPos = parseFloat(d3.select(this).attr("x")) + x.bandwidth() / 2;
       const yPos = y(+d.Count) - 5;

       svg5.append("text")
           .attr("class", "hover-text")
           .attr("x", xPos)
           .attr("y", yPos)
           .attr("text-anchor", "middle")
           .text(d.Count)
           .style("font-size", "14px")
           .style("font-weight", "bold");
   })
   .on("mouseout", function() {
       // Remove data and restore color on mouseout
       d3.select(this)
           .transition()
           .duration(200)
           .style("fill", "steelblue"); // Restore color on mouseout

       svg5.select(".hover-text").remove();
   })
   .on("click", function(event, d) {
      // Redirect to different pages based on the data associated with the bar
      const page = d.Page; // Assuming you have a property named "Page" in your data
      window.location.href = `${page}.html`; // Constructing the URL dynamically
   })
   .transition()
   .duration(2000) // Transition duration
   .delay((d, i) => i * 100) // Delay each bar's transition
   .attr("y", d => y(+d.Count)) // Transition bars to actual height
   .attr("height", d => height - y(+d.Count));


   // Add x-axis
   svg5.append("g")
      .attr("class", "axis-x")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("text-anchor", "middle")
      .attr("dy", "1.0em") // Adjust vertical positioning
      .style("font-size", "11px");

   // Add y-axis
   svg5.append("g")
      .attr("class", "axis-y")
      .call(d3.axisLeft(y).ticks(5))
      .style("font-size", "11px");

   // Add chart title
   svg5.append("text")
      .attr("x", width / 2)
      .attr("y", -margin.top / 2)
      .attr("text-anchor", "middle")
      .style("font-size", "18px")
      .style("text-decoration", "underline")
      .text("Ukraine Migrating Countries from 2010 to 2023");
});
 