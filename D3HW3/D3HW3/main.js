//TODO

// Employment Data Functional Bar Chart

// Dimensions and Margins For Chart
const margin = {top: 40, right: 30, bottom: 120, left: 80}, // Margin Values
      width = 800 - margin.left - margin.right, // 800 Width Space
      height = 500 - margin.top - margin.bottom; // 500 Height Space

// Append and SVG Object Functions
const svg = d3.select("#chart")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Tooltip Function
    const tooltip = d3.select("#tooltip");
// ColorMap Function
const colorMap = {
    total: "#2A9D8F", // Teal Color
    men: "#457B9D", // Blue Color
    women: "#E07A5F" // Coral Color
};

// d3.text Function to Clean and Parse CSV
d3.text("employd1.csv").then(function(rawText) {
    let cleanText = rawText.replace(/\//g, "");
    const rows = d3.csvParseRows(cleanText); // Parse Text Into Rows
    let dataset = [];
    rows.forEach(row => {
        // Functions to Match Major Occupations With Normalized Names
        let occ = row[0] ? row[0].replace(/\n/g, " ").replace(/ +/g, " ").trim() : "";
        if (occ.includes("Natural resources") && occ.includes("construction")) { // Original Name(s)
            occ = "Natural Resources & Construction"; // Normalized Name
        } else if (occ === "Management, professional, and related occupations") { // Original Name(s)
            occ = "Management & Professional"; // Normalized Name
        } else if (occ === "Service occupations") { // Original Name(s)
            occ = "Service";// Normalized Name
        } else if (occ === "Sales and office occupations") { // Original Name(s)
            occ = "Sales & Office"; // Normalized Name
        } else if (occ === "Production, transportation, and material moving occupations") { // Original Name(s)
            occ = "Production & Transportation"; // Normalized Name
        }
        // const Function to Validate Occupation Labels
        const validOccs = [
            "Management & Professional", 
            "Service", 
            "Sales & Office", 
            "Natural Resources & Construction", 
            "Production & Transportation"
        ];
        if (validOccs.includes(occ)) {
            dataset.push({
                occupation: occ,
                total: +(row[2].replace(/,/g, '')), // Remove Commas & Index Row 2: Total 2024
                men: +(row[4].replace(/,/g, '')), // Remove Commas & Index Row 4: Men 16+ 2024
                women: +(row[8].replace(/,/g, '')) // Remove Commas & Index Row 8: Women 16+ 2024
            });
        }
    });
    // Function to Initialize Scales
    const x = d3.scaleBand()
      .range([0, width])
      .domain(dataset.map(d => d.occupation))
      .padding(0.2);
    const y = d3.scaleLinear()
      .range([height, 0]);

    // Append X-Axis
    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .attr("class", "x-axis")
      .call(d3.axisBottom(x))
      .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-35)")
        .style("text-anchor", "end")
        .style("font-size", "12px");// Line For 12px Font Size on X-Axis
    
    // Append Y-Axis
    const yAxis = svg.append("g")
      .attr("class", "y-axis");

    // Y-Axis Label
    svg.append("text")
      .attr("class", "axis-label")
      .attr("text-anchor", "end")
      .attr("x", -height / 2 + 50)
      .attr("y", -60)
      .attr("transform", "rotate(-90)")
      .text("Employed Persons (in thousands)");// Line for Label Text

    // Update Function to Maintain Transition When Dropdown is Changed
      function update(selectedMetric) {
        // Function to Update Y Domain
        const maxVal = d3.max(dataset, d => d[selectedMetric]);
        y.domain([0, maxVal * 1.1]);
        // Function to Transition Y-Axis
        yAxis.transition()
            .duration(1000)
            .call(d3.axisLeft(y).ticks(8));
        // Function to Map Data to Existing Bars
        const bars = svg.selectAll("rect")
            .data(dataset);
        // Function to Enter New Bars
        bars.enter()
            .append("rect")
            .attr("x", d => x(d.occupation))
            .attr("y", y(0))
            .attr("width", x.bandwidth())
            .attr("height", 0)
            .attr("fill", colorMap[selectedMetric])
            .attr("rx", 3)
            .on("mouseover", function(event, d) {
                d3.select(this).style("opacity", 0.8);
                tooltip.style("opacity", 1);
            })
            .on("mousemove", function(event, d) {
                const metricName = selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1);
                tooltip
                    .html(`<strong>${d.occupation}</strong><br>
                           ${metricName}: ${d[selectedMetric].toLocaleString()}k`)
                    .style("left", (event.pageX + 15) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", function(event, d) {
                d3.select(this).style("opacity", 1);
                tooltip.style("opacity", 0);
            })
            // Update Selections to Transition Collectively
            .merge(bars)
            .transition()
            .duration(1000)
            .attr("y", d => y(d[selectedMetric]))
            .attr("height", d => height - y(d[selectedMetric]))
            .attr("fill", colorMap[selectedMetric]);

        bars.exit().remove(); // Line to Remove Exit Data
    }

    // Function to Initialize Chart With 'Total' Category
    update("total");

    // Event Listener For Dropdown Interaction
    d3.select("#demographic-select").on("change", function(event) {
        const selectedMetric = d3.select(this).property("value");
        update(selectedMetric);
    });

// Error Catch Function
}).catch(function(error){
    console.log("Error loading the CSV data: ", error);
});