//TODO

// Employment Data Scatterplot

// const and Global Variables
const w = 500; // Width of Space
const h = 500; // Height of Space
const margin = 70; // Margins of 70 to Ensure Reasonable Space and No Overlap

//Load CSV File and Functions to Ensure Rows are Read
d3.text("employd1.csv").then(function(rawText) {
    const allRows = d3.csvParseRows(rawText);
    const data = [];
    for (let i = 11; i < allRows.length; i++) {
        const row = allRows[i];
        if (row[0] && row[1] && row[2] && row[0] !== "Total") {
            let valX = parseInt(row[1].replace(/,/g, "")); // Row 1 Text String to Real Numbers
            let valY = parseInt(row[2].replace(/,/g, "")); // Row 2 Text String to Real Numbers
            if (!isNaN(valX) && !isNaN(valY)) {
                data.push([valX, valY]);
            }
        }
        if (data.length >= 12) break; 
    }

    // Max X and Max Y
    const maxX = d3.max(data, d => d[0]);            
    const maxY = d3.max(data, d => d[1]);
    
    // Console Log Line
    console.log("data", data);

    // X Scales
    const xScale = d3.scaleLinear()
                     .domain([0, maxX]) 
                     .range([margin, w-margin]); 

    // Y Scales
    const yScale = d3.scaleLinear()
                    .domain([0, maxY])
                    .range([h-margin, margin]); 

    // SVG
    const svg = d3.select("body")
                .append("svg")
                .attr("width", w) // Setting Width of SVG to Variable "w"
                .attr("height", h); // Setting Height of SVG to Variable "h"
   // Bottom Axes
    const bottomAxis = d3.axisBottom()
                        .scale(xScale)
                        .ticks(10);
   // Left Axes
    const leftAxis = d3.axisLeft()
                     .scale(yScale)
                     .ticks(10); 

    // Circles Organization
    svg.selectAll("circle") 
        .data(data) 
        .enter()
        .append("circle") 
        .attr("cx", d => xScale(d[0])) 
        .attr("cy", d => yScale(d[1])) 
        .attr("r", 6) 
        .attr("fill", "pink");
   
    // Call Bottom Axes
    svg.append("g")
        .attr("transform", "translate(0," + (h -margin) + ")")
        .call(bottomAxis); // Bottom Axis Call Function

    // Call Left Axes
    svg.append("g")
         .attr("transform", "translate(" + margin + ",0)")
         .call(leftAxis); // Left Axis Call Function

    // X - Axis Title
         svg.append("text")
        .attr("x", w / 2)
        .attr("y", h - 10) 
        .style("text-anchor", "middle") // Text Orientation
        .style("font-family", "sans-serif") // sans-serif Font Designation
        .style("font-size", "14px") // Font Size Designation
        .text("2023 Employment Totals"); // 2023 Title Label

    // Y - Axis Title
    svg.append("text")
        .attr("transform", "rotate(-90)") // Rotate Function
        .attr("y", 20) 
        .attr("x", 0 - (h / 2))
        .style("text-anchor", "middle") // Text Orientation
        .style("font-family", "sans-serif") // sans-serif Font Designation
        .style("font-size", "14px")// Font Size Designation
        .text("2024 Employment Totals"); // 2024 Title Label
});