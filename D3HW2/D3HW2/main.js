//TODO

// Employment Data Multi-Line Chart

// const and Global Variables
const w = 600; // Space Width
const h = 500; // Space Height
const margin = 80; // Designated Margin to Accommodate Chart
const parseTime = d3.timeParse("%Y"); // Time Parser for Years

// Load CSV as Raw Text with "d3.text" Due to Multi-Row Header Structure of CSV Data
d3.text("employd1.csv").then(text => {
    const rawRows = d3.csvParseRows(text); // Parse CSV Text Into Rows
    const totalRow = rawRows.find(row => row[0] === "Total");
    // Extract and Clean Data for Men and Women Categories
    const data = [
        {
            year: parseTime("2023"), // Parse For Year 2023
            men: +(totalRow[3].replace(/,/g, '')),
            women: +(totalRow[7].replace(/,/g, ''))
        },
        {
            year: parseTime("2024"), // Parse For Year 2024
            men: +(totalRow[4].replace(/,/g, '')),
            women: +(totalRow[8].replace(/,/g, ''))
        }
    ];
    
    // Console Log Line
    console.log("Parsed Data:", data);

    // xScale Function
    const xScale = d3.scaleTime()
                     .domain(d3.extent(data, d=> d.year))
                     .range([margin, w - margin]);
    
    // yScale Function
                     const yScale = d3.scaleLinear()
                     .domain([70000, 90000])
                     .range([h - margin, margin]);
    
   // Bottom Axis Function
                     const bottomAxis = d3.axisBottom()
                         .scale(xScale)
                         .ticks(d3.timeYear.every(1))
                         .tickFormat(d3.timeFormat("%Y"));
    
    // Left Axis Function
                         const leftAxis = d3.axisLeft()
                       .scale(yScale);

    // SVG Container
                       const svg = d3.select("body")
                  .append("svg")
                  .attr("width", w)
                  .attr("height", h);

    // Line Generator For Men Category
    const lineMen = d3.line()
                      .x(d => xScale(d.year))
                      .y(d => yScale(d.men));
    // Line Generator For Women Category
    const lineWomen = d3.line()
                        .x(d => xScale(d.year))
                        .y(d => yScale(d.women));

    // Function to Draw Line For Men Category
    svg.append("path")
       .data([data])
       .attr("d", lineMen)
       .attr("class", "line-men");
    // Function to Draw Line For Women Category
    svg.append("path")
       .data([data])
       .attr("d", lineWomen)
       .attr("class", "line-women");
    // Call Bottom Axis Function
    svg.append("g")
       .attr("class", "axis")
       .attr("transform", "translate(0," + (h - margin) + ")")
       .call(bottomAxis);
   // Call Left Axis Function
    svg.append("g")
       .attr("class", "axis")
       .attr("transform", "translate(" + margin + ",0)")
       .call(leftAxis);
    // Chart Title
    svg.append("text")
       .attr("x", w / 2)
       .attr("y", margin / 2)
       .attr("text-anchor", "middle")
       .attr("class", "chart-title")
       .text("Total Employment of Men and Women (2023-2024)");
    // Y-Axis Label
    svg.append("text")
       .attr("transform", "rotate(-90)")
       .attr("x", -(h / 2))
       .attr("y", margin / 3)
       .attr("text-anchor", "middle")
       .attr("class", "axis-label")
       .text("Employed Persons (in thousands)");
    // Line Label For Men
    svg.append("text")
       .attr("x", w - margin - 40)
       .attr("y", yScale(data[1].men) - 10)
       .attr("class", "label-men")
       .text("Men");
    // Line Label For Women
    svg.append("text")
       .attr("x", w - margin - 60)
       .attr("y", yScale(data[1].women) + 20)
       .attr("class", "label-women")
       .text("Women");
});