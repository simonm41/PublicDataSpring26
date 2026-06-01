//TODO

// Employment Data Lollipop Chart

// Set Chart Dimensions and Margins
const margin = {top: 30, right: 80, bottom: 60, left: 400}, // const Margin Function Dimensions
      width = 1000 - margin.left - margin.right, // 1000 Space Width
      height = 400 - margin.top - margin.bottom; // 400 Space Height

// Function to Append SVG Object
const svg = d3.select("#chart")
  .append("svg")
    .attr("width", width + margin.left + margin.right) // .attr Line For Width
    .attr("height", height + margin.top + margin.bottom) //.attr Line For Height
  .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`); // .attr Line to Transform & Translate

// d3.text Function to Organize and Parse CSV Text
d3.text("employd1.csv").then(function(rawText) {
    let cleanText = rawText.replace(/\//g, ""); // Line to Clean Up Source Brackets
    const rows = d3.csvParseRows(cleanText); // const Function to Parse CSV Rows
    let dataset = [];
    const leafNodes = [ // const leafNodes Function to State Blue-Collar Occupational Categories
        "Building and grounds cleaning and maintenance occupations", // First Category
        "Farming, fishing, and forestry occupations", // Second Category
        "Construction and extraction occupations", // Third Category
        "Installation, maintenance, and repair occupations", // Fourth Category
        "Production occupations", // Fifth Category
        "Transportation and material moving occupations" // Sixth Category
    ];
    rows.forEach(row => {
        // Lines to Clean Whitespace
        let occ = row[0] ? row[0].replace(/\n/g, " ").replace(/ +/g, " ").trim() : "";
        occ = occ.replace(/^"|"$/g, '');
        if (leafNodes.includes(occ)) {
            dataset.push({
                occupation: occ,
                total: +(row[2].replace(/,/g, '')) // Line to Reference Index 2 For The "Total - 2024" Column
            });
        }
    });

    // Line to Sort The Dataset From Highest to Lowest Employment Values
    dataset.sort((a, b) => b.total - a.total);

    // const X Scale Function For Total Number(s)
    const x = d3.scaleLinear()
      .domain([0, d3.max(dataset, d => d.total) * 1.1])
      .range([0, width]);

    // const Y Scale Function For Occupation Names
    const y = d3.scaleBand()
      .domain(dataset.map(d => d.occupation))
      .range([0, height])
      .padding(1); 
     
    // const colorScale Function to Make Color Sequentially Darker as Employment Number Increases
    const colorScale = d3.scaleSequential()
       .interpolator(d3.interpolateBlues) // interpolate Line For Sequential Blue Color Gradient
       .domain([0, d3.max(dataset, d => d.total)]);

    // Function to Append X Axis
    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .attr("class", "x-axis") // .attr to Class X Axis
      .call(d3.axisBottom(x).ticks(8).tickFormat(d => d / 1000)) // call Line to Format Values in Chart
      .selectAll("text")
      .style("font-size", "12px"); // Line For 12px Font Size

    // Function For X Axis Label
    svg.append("text")
      .attr("class", "axis-label") // .attr to Class Axis Label
      .attr("text-anchor", "middle") // Line to Anchor Label Text to Middle
      .attr("x", width / 2) // .attr For X Axis Width
      .attr("y", height + 45) // .attr For X Axis Height
      .text("Total Employed Persons (In Millions)"); // X Axis Label Name Corresponding to Topic

    // Function to Append Y Axis
    svg.append("g")
      .attr("class", "y-axis") // .attr to Class Y Axis 
      .call(d3.axisLeft(y));

    // Function to Draw Lines For Lollipops
    svg.selectAll("lolline")
      .data(dataset)
      .enter()
      .append("line") // .append to State Line
        .attr("x1", 0)
        .attr("x2", d => x(d.total))
        .attr("y1", d => y(d.occupation))
        .attr("y2", d => y(d.occupation))
        .attr("stroke", "lightgray") // Stroke Color of Light Gray
        .attr("stroke-width", 2); // Stroke Width of 2

    // Function to Draw Circles For Lollipops
    svg.selectAll("lolcircle")
      .data(dataset)
      .enter()
      .append("circle") // .append to State Circle
        .attr("cx", d => x(d.total))
        .attr("cy", d => y(d.occupation))
        .attr("r", 7)
        .style("fill", d => colorScale(d.total))
        .attr("stroke", "dimgray") // Stroke Color of Dim Gray
        .attr("stroke-width", 1); // Stroke Width of 1

    // Function to Add State Values Beside Circles
    svg.selectAll("lollabel")
      .data(dataset)
      .enter()
      .append("text")
        .attr("class", "value-label") // .attr to Class Value-Label
        .attr("x", d => x(d.total) + 12) // Line For Value-Label to be Right of Circle
        .attr("y", d => y(d.occupation) + 4) // LIne For Value-Label to be Center Vertically With Circle
        .text(d => d.total < 1000 ? d.total + "k" : (d.total/1000).toFixed(1) + "M");

// Function to Handle Error When Loading Chart
}).catch(function(error){
    console.log("Error loading the CSV data: ", error);
});