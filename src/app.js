// app.js
// import necessary libraries
const fs = require('fs');
const d3 = require('d3');
const plotly = require('plotly.js-dist');


d3.json('/data', (data) => {
 // Group the data by 'districts' and count 'water_source'
const countData = d3.group(data, d => d.districts);
const countArray = Array.from(countData, ([district, values]) => ({ districts: district, value: values.length }));

// Melt the data for the diverging bar chart
const meltedData = countArray.map(d => ({ districts: d.districts, Parameter: 'water_source', Value: d.value }));

// Set up the dimensions and margins for the SVG
const margin = { top: 20, right: 20, bottom: 30, left: 40 };
const width = 600 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

// Create the SVG container
const svg = d3.select("#plot1")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Set up the scales
const xScale = d3.scaleBand()
  .range([0, width])
  .padding(0.1)
  .domain(meltedData.map(d => d.districts));

const yScale = d3.scaleLinear()
  .range([height, 0])
  .domain([0, d3.max(meltedData, d => d.Value)]);

// Create the bars
svg.selectAll(".bar")
  .data(meltedData)
  .enter().append("rect")
  .attr("class", "bar")
  .attr("x", d => xScale(d.districts))
  .attr("width", xScale.bandwidth())
  .attr("y", d => yScale(d.Value))
  .attr("height", d => height - yScale(d.Value))
  .style("fill", "steelblue");

// Add x-axis
svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(xScale));

// Add y-axis
svg.append("g")
  .call(d3.axisLeft(yScale));

// Add chart title
svg.append("text")
  .attr("x", (width / 2))
  .attr("y", 0 - (margin.top / 2))
  .attr("text-anchor", "middle")
  .style("font-size", "16px")
  .text("Number of Water Sources per District");

// Add x-axis label
svg.append("text")
  .attr("x", width / 2)
  .attr("y", height + margin.bottom)
  .attr("text-anchor", "middle")
  .text("Districts");

// Add y-axis label
svg.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - margin.left)
  .attr("x", 0 - (height / 2))
  .attr("dy", "1em")
  .style("text-anchor", "middle")
  .text("Number of Water Sources");



// Group the data by 'districts' and 'water_source' and calculate the count
const groupedData = d3.group(data, d => d.districts, d => d.water_source);
const groupedArray = Array.from(groupedData, ([district, sources]) => {
  const count = Array.from(sources, ([_, values]) => values.length).reduce((a, b) => a + b, 0);
  return { districts: district, count: count, sources: sources };
});

// Flatten the data for the stacked bar chart
const stackedData = groupedArray.flatMap(d => {
  return Array.from(d.sources, ([source, values]) => {
    return { districts: d.districts, water_source: source, count: values.length };
  });
});

// Set up the dimensions and margins for the SVG
const margin = { top: 20, right: 20, bottom: 30, left: 40 };
const width = 600 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

// Create the SVG container
const svg = d3.select("#plot2")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Set up the scales
const xScale = d3.scaleBand()
  .domain(groupedArray.map(d => d.districts))
  .range([0, width])
  .padding(0.1);

const yScale = d3.scaleLinear()
  .domain([0, d3.max(groupedArray, d => d.count)])
  .range([height, 0]);

const colorScale = d3.scaleOrdinal()
  .domain(groupedArray.flatMap(d => d.sources))
  .range(d3.schemeCategory10);

// Create the stacked bars
svg.selectAll(".bar")
  .data(stackedData)
  .enter().append("rect")
  .attr("class", "bar")
  .attr("x", d => xScale(d.districts))
  .attr("width", xScale.bandwidth())
  .attr("y", d => yScale(d.count))
  .attr("height", d => yScale(0) - yScale(d.count))
  .style("fill", d => colorScale(d.water_source));

// Add x-axis
svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(xScale));

// Add y-axis
svg.append("g")
  .call(d3.axisLeft(yScale));

// Add legend
const legend = svg.append("g")
  .attr("class", "legend")
  .attr("transform", "translate(0," + (height + 20) + ")");

const legendItems = legend.selectAll(".legend-item")
  .data(colorScale.domain())
  .enter().append("g")
  .attr("class", "legend-item")
  .attr("transform", (d, i) => "translate(" + (i * 100) + ", 0)");

legendItems.append("rect")
  .attr("x", 0)
  .attr("width", 10)
  .attr("height", 10)
  .style("fill", d => colorScale(d));

legendItems.append("text")
  .attr("x", 15)
  .attr("y", 8)
  .text(d => d);

// Add chart title
svg.append("text")
  .attr("x", (width / 2))
  .attr("y", 0 - (margin.top / 2))
  .attr("text-anchor", "middle")
  .style("font-size", "16px")
  .text("Water Sources by District");

// Add x-axis label
svg.append("text")
  .attr("x", width / 2)
  .attr("y", height + margin.bottom)
  .attr("text-anchor", "middle")
  .text("Districts");

// Add y-axis label
svg.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - margin.left)
  .attr("x", 0 - (height / 2))
  .attr("dy", "1em")
  .style("text-anchor", "middle")
  .text("Count");


// Define the data for each bar
const data = [
  {
    name: 'Hardness',
    x: df.map(d => d.water_source),
    y: df.map(d => d['Total_Hardness (mg/L)']),
    text: df.map(d => d.districts),
  },
  {
    name: 'Calcium',
    x: df.map(d => d.water_source),
    y: df.map(d => d['Calcium_Hardness (mg/L)']),
    text: df.map(d => d.districts),
  },
  {
    name: 'Magnesium',
    x: df.map(d => d.water_source),
    y: df.map(d => d['Magnesium_Hardness (mg/L)']),
    text: df.map(d => d.districts),
  },
];

// Set up the dimensions and margins for the SVG
const margin = { top: 20, right: 20, bottom: 30, left: 40 };
const width = 600 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

// Create the SVG container
const svg = d3.select("#plot3")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Set up the scales
const xScale = d3.scaleBand()
  .domain(df.map(d => d.water_source))
  .range([0, width])
  .padding(0.1);

const yScale = d3.scaleLinear()
  .domain([0, d3.max(data, d => d3.max(d.y))])
  .range([height, 0]);

const colorScale = d3.scaleOrdinal()
  .domain(data.map(d => d.name))
  .range(d3.schemeCategory10);

// Create the stacked bars
const bars = svg.selectAll(".bar")
  .data(data)
  .enter().append("g")
  .attr("class", "bar");

bars.selectAll("rect")
  .data(d => d.y.map((value, index) => ({ value, index })))
  .enter().append("rect")
  .attr("x", d => xScale(df[d.index].water_source))
  .attr("width", xScale.bandwidth())
  .attr("y", d => yScale(d.value))
  .attr("height", d => yScale(0) - yScale(d.value))
  .style("fill", d => colorScale(data[d.index].name));

// Add text labels
bars.selectAll("text")
  .data(d => d.y.map((value, index) => ({ value, index })))
  .enter().append("text")
  .attr("x", d => xScale(df[d.index].water_source) + xScale.bandwidth() / 2)
  .attr("y", d => yScale(d.value) - 5)
  .attr("text-anchor", "middle")
  .style("font-size", "12px")
  .text(d => df[d.index].districts);

// Add x-axis
svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(xScale));

// Add y-axis
svg.append("g")
  .call(d3.axisLeft(yScale));

// Add legend
const legend = svg.append("g")
  .attr("class", "legend")
  .attr("transform", "translate(" + (width - 100) + ", 0)");

legend.selectAll("rect")
  .data(data)
  .enter().append("rect")
  .attr("x", 0)
  .attr("y", (d, i) => i * 20)
  .attr("width", 10)
  .attr("height", 10)
  .style("fill", d => colorScale(d.name));

legend.selectAll("text")
  .data(data)
  .enter().append("text")
  .attr("x", 20)
  .attr("y", (d, i) => i * 20 + 9)
  .attr("dy", ".35em")
  .style("font-size", "12px")
  .text(d => d.name);

// Add chart title
svg.append("text")
  .attr("x", (width / 2))
  .attr("y", 0 - (margin.top / 2))
  .attr("text-anchor", "middle")
  .style("font-size", "16px")
  .text("Distribution of Water Hardness in Each Water Source");

// Add x-axis label
svg.append("text")
  .attr("x", width / 2)
  .attr("y", height + margin.bottom)
  .attr("text-anchor", "middle")
  .text("Water Source");

// Add y-axis label
svg.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - margin.left)
  .attr("x", 0 - (height / 2))
  .attr("dy", "1em")
  .style("text-anchor", "middle")
  .text("Water Hardness (mg/L)");



// Define the data for the bar chart
const data = {
  y: df.map(d => d['Total_Alkalinity (mg/L)']),
  x: Array.from(new Set(df.map(d => d.water_source))),
  text: df.map(d => d.districts),
};

// Set up the dimensions and margins for the SVG
const margin = { top: 20, right: 20, bottom: 30, left: 40 };
const width = 600 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

// Create the SVG container
const svg = d3.select("#plot4")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Set up the scales
const xScale = d3.scaleBand()
  .domain(data.x)
  .range([0, width])
  .padding(0.1);

const yScale = d3.scaleLinear()
  .domain([0, d3.max(data.y)])
  .range([height, 0]);

// Create the bars
svg.selectAll("rect")
  .data(data.y)
  .enter().append("rect")
  .attr("x", (d, i) => xScale(data.x[i]))
  .attr("y", d => yScale(d))
  .attr("width", xScale.bandwidth())
  .attr("height", d => height - yScale(d))
  .style("fill", "#1f77b4");

// Add text labels
svg.selectAll("text")
  .data(data.text)
  .enter().append("text")
  .attr("x", (d, i) => xScale(data.x[i]) + xScale.bandwidth() / 2)
  .attr("y", d => yScale(df.find(entry => entry.districts === d)['Total_Alkalinity (mg/L)']) - 5)
  .attr("text-anchor", "middle")
  .style("font-size", "12px")
  .text(d => d);

// Add x-axis
svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(xScale));

// Add y-axis
svg.append("g")
  .call(d3.axisLeft(yScale));

// Add chart title
svg.append("text")
  .attr("x", (width / 2))
  .attr("y", 0 - (margin.top / 2))
  .attr("text-anchor", "middle")
  .style("font-size", "16px")
  .text("Total Alkalinity among Water Sources");

// Add x-axis label
svg.append("text")
  .attr("x", width / 2)
  .attr("y", height + margin.bottom)
  .attr("text-anchor", "middle")
  .text("Total Alkalinity (mg/l)");

// Add y-axis label
svg.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - margin.left)
  .attr("x", 0 - (height / 2))
  .attr("dy", "1em")
  .style("text-anchor", "middle")
  .text("Water Source");

// Define the data for the bar chart
const data = {
  districts: df.map(d => d.districts),
  nitrates: df.map(d => d['Nitrates-N (mg/L)']),
  nitrites: df.map(d => d['Nitrites (mg/L)']),
  phosphates: df.map(d => d['Phosphates-P (mg/L)']),
  waterSource: df.map(d => d.water_source)
};

// Set up the dimensions and margins for the SVG
const margin = { top: 20, right: 20, bottom: 30, left: 40 };
const width = 600 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

// Create the SVG container
const svg = d3.select("#plot5")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Set up the scales
const xScale = d3.scaleBand()
  .domain(data.districts)
  .range([0, width])
  .padding(0.2);

const yScale = d3.scaleLinear()
  .domain([0, d3.max(data.nitrates.concat(data.nitrites).concat(data.phosphates))])
  .range([height, 0]);

// Create the bars for Nitrates
svg.selectAll(".nitrates")
  .data(data.nitrates)
  .enter().append("rect")
  .attr("class", "bar")
  .attr("x", (d, i) => xScale(data.districts[i]))
  .attr("y", d => yScale(d))
  .attr("width", xScale.bandwidth() / 3)
  .attr("height", d => height - yScale(d))
  .style("fill", "#1f77b4");

// Create the bars for Nitrites
svg.selectAll(".nitrites")
  .data(data.nitrites)
  .enter().append("rect")
  .attr("class", "bar")
  .attr("x", (d, i) => xScale(data.districts[i]) + xScale.bandwidth() / 3)
  .attr("y", d => yScale(d))
  .attr("width", xScale.bandwidth() / 3)
  .attr("height", d => height - yScale(d))
  .style("fill", "#ff7f0e");

// Create the bars for Phosphates
svg.selectAll(".phosphates")
  .data(data.phosphates)
  .enter().append("rect")
  .attr("class", "bar")
  .attr("x", (d, i) => xScale(data.districts[i]) + (2 * xScale.bandwidth() / 3))
  .attr("y", d => yScale(d))
  .attr("width", xScale.bandwidth() / 3)
  .attr("height", d => height - yScale(d))
  .style("fill", "#2ca02c");

// Add text labels for water sources
svg.selectAll(".text")
  .data(data.waterSource)
  .enter().append("text")
  .attr("class", "text")
  .attr("x", (d, i) => xScale(data.districts[i]) + xScale.bandwidth() / 2)
  .attr("y", d => yScale(df.find(entry => entry.water_source === d)['Nitrates-N (mg/L)']) - 5)
  .attr("text-anchor", "middle")
  .style("font-size", "12px")
  .text(d => d);

// Add x-axis
svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(xScale));

// Add y-axis
svg.append("g")
  .call(d3.axisLeft(yScale));

// Add chart title
svg.append("text")
  .attr("x", (width / 2))
  .attr("y", 0 - (margin.top / 2))
  .attr("text-anchor", "middle")
  .style("font-size", "16px")
  .text("Chemical Water Contaminants per District");

// Add x-axis label
svg.append("text")
  .attr("x", width / 2)
  .attr("y", height + margin.bottom)
  .attr("text-anchor", "middle")
  .text("Water Source");

// Add y-axis label
svg.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - margin.left)
  .attr("x", 0 - (height / 2))
  .attr("dy", "1em")
  .style("text-anchor", "middle")
  .text("Concentration");

// Add legend
const legend = svg.selectAll(".legend")
  .data(['Nitrates-N', 'Nitrites', 'Phosphates-P'])
  .enter().append("g")
  .attr("class", "legend")
  .attr("transform", function (d, i) { return "translate(0," + i * 20 + ")"; });

legend.append("rect")
  .attr("x", width - 18)
  .attr("width", 18)
  .attr("height", 18)
  .style("fill", (d, i) => ["#1f77b4", "#ff7f0e", "#2ca02c"][i]);

legend.append("text")
  .attr("x", width - 24)
  .attr("y", 9)
  .attr("dy", ".35em")
  .style("text-anchor", "end")
  .text(function (d) { return d; });

// Define the data for the bar chart
const data = {
  districts: df.map(d => d.districts),
  pH: df.map(d => d.pH),
  turbidity: df.map(d => d['Turbidity_(NTU)']),
  color: df.map(d => d.Color),
  totalChlorine: df.map(d => d['Total Chlorine']),
  electricalConductivity: df.map(d => d.Electrical_Conductivity),
  totalDissolvedSolids: df.map(d => d['Total_Dissolved_Solids (mg/L)']),
  nitrates: df.map(d => d['Nitrates-N (mg/L)']),
  ecoli: df.map(d => d['E.coli (CFU/100ml)']),
  lead: df.map(d => d['Lead (mg/L)']),
  totalHardness: df.map(d => d['Total_Hardness (mg/L)']),
  waterSource: df.map(d => d.water_source)
};

// Set up the dimensions and margins for the SVG
const margin = { top: 20, right: 20, bottom: 30, left: 40 };
const width = 800 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

// Create the SVG container
const svg = d3.select("#plot6")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Set up the scales
const xScale = d3.scaleBand()
  .domain(data.districts)
  .range([0, width])
  .padding(0.2);

const yScale = d3.scaleLinear()
  .domain([0, d3.max(data.pH.concat(data.turbidity).concat(data.color)
    .concat(data.totalChlorine).concat(data.electricalConductivity)
    .concat(data.totalDissolvedSolids).concat(data.nitrates)
    .concat(data.ecoli).concat(data.lead).concat(data.totalHardness))])
  .range([height, 0]);

// Create the bars for each water quality parameter
const parameters = ['pH', 'turbidity', 'color', 'totalChlorine', 'electricalConductivity',
  'totalDissolvedSolids', 'nitrates', 'ecoli', 'lead', 'totalHardness'];

const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

for (let i = 0; i < parameters.length; i++) {
  svg.selectAll(`.${parameters[i]}`)
    .data(data[parameters[i]])
    .enter().append("rect")
    .attr("class", "bar")
    .attr("x", (d, j) => xScale(data.districts[j]) + (i * xScale.bandwidth() / parameters.length))
    .attr("y", d => yScale(d))
    .attr("width", xScale.bandwidth() / parameters.length)
    .attr("height", d => height - yScale(d))
    .style("fill", colorScale(i));
}

// Add text labels for water sources
svg.selectAll(".text")
  .data(data.waterSource)
  .enter().append("text")
  .attr("class", "text")
  .attr("x", (d, i) => xScale(data.districts[i]) + (xScale.bandwidth() / 2))
  .attr("y", d => yScale(data.pH[data.waterSource.indexOf(d)]) - 5)
  .attr("text-anchor", "middle")
  .style("font-size", "12px")
  .text(d => d);

// Add x-axis
svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(xScale));

// Add y-axis
svg.append("g")
  .call(d3.axisLeft(yScale));

// Add chart title
svg.append("text")
  .attr("x", (width / 2))
  .attr("y", 0 - (margin.top / 2))
  .attr("text-anchor", "middle")
  .style("font-size", "16px")
  .text("Key Water Quality Parameter Comparison among Districts");

// Add x-axis label
svg.append("text")
  .attr("x", width / 2)
  .attr("y", height + margin.bottom)
  .attr("text-anchor", "middle")
  .text("Water Source");

// Add y-axis label
svg.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - margin.left)
  .attr("x", 0 - (height / 2))
  .attr("dy", "1em")
  .style("text-anchor", "middle")
  .text("Water Quality Parameters");

// Add legend
const legend = svg.selectAll(".legend")
  .data(parameters)
  .enter().append("g")
  .attr("class", "legend")
  .attr("transform", function (d, i) { return "translate(0," + i * 20 + ")"; });

legend.append("rect")
  .attr("x", width - 18)
  .attr("width", 18)
  .attr("height", 18)
  .style("fill", (d, i) => colorScale(i));

legend.append("text")
  .attr("x", width - 24)
  .attr("y", 9)
  .attr("dy", ".35em")
  .style("text-anchor", "end")
  .text(function (d) { return d; });

// Update the style of the chart
d3.selectAll(".legend text")
  .style("fill", "white")
  .style("font-family", "Arial")
  .style("font-size", "14px");

d3.selectAll("axis text")
  .style("fill", "white")
  .style("font-family", "Arial")
  .style("font-size", "12px");

d3.selectAll("axis .domain, axis .tick line")
  .style("stroke", "white");



// Define the data for the scatter plot
const turbidity = df.map(d => d['Turbidity_(NTU)']);
const silica = df.map(d => d['Silica (mg/L)']);
const boreholes = df.map(d => d.water_source);

// Set up the dimensions and margins for the SVG
const margin = { top: 20, right: 20, bottom: 30, left: 40 };
const width = 800 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

// Create the SVG container
const svg = d3.select("#plot7")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Set up the scales
const xScale = d3.scaleLinear()
  .domain([0, d3.max(turbidity)])
  .range([0, width]);

const yScale = d3.scaleLinear()
  .domain([0, d3.max(silica)])
  .range([height, 0]);

// Create the scatter plot points
for (let i = 0; i < turbidity.length; i++) {
  svg.append("circle")
    .attr("cx", xScale(turbidity[i]))
    .attr("cy", yScale(silica[i]))
    .attr("r", 5)
    .style("fill", "blue")
    .style("opacity", 0.7);

  svg.append("text")
    .attr("x", xScale(turbidity[i]) + 10)
    .attr("y", yScale(silica[i]) + 5)
    .text(boreholes[i])
    .style("fill", "white")
    .style("font-size", "12px");
}

// Add x-axis
svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(xScale));

// Add y-axis
svg.append("g")
  .call(d3.axisLeft(yScale));

// Add chart title
svg.append("text")
  .attr("x", (width / 2))
  .attr("y", 0 - (margin.top / 2))
  .attr("text-anchor", "middle")
  .style("font-size", "16px")
  .text("Relationship between Turbidity and Silica");

// Add x-axis label
svg.append("text")
  .attr("x", width / 2)
  .attr("y", height + margin.bottom)
  .attr("text-anchor", "middle")
  .text("Turbidity (NTU)");

// Add y-axis label
svg.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - margin.left)
  .attr("x", 0 - (height / 2))
  .attr("dy", "1em")
  .style("text-anchor", "middle")
  .text("Silica (mg/l)");



// Set up the dimensions and margins for the SVG
const margin = { top: 20, right: 20, bottom: 30, left: 40 };
const width = 800 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

// Create the SVG container
const svg = d3.select("#plot8")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Set up the scales
const xScale = d3.scaleLinear()
  .domain([d3.min(df, d => d.pH), d3.max(df, d => d.pH)])
  .range([0, width]);

const yScale = d3.scaleLinear()
  .domain([d3.min(df, d => d['Total_Alkalinity (mg/L)']), d3.max(df, d => d['Total_Alkalinity (mg/L)'])])
  .range([height, 0]);

// Create the scatter plot points
df.forEach(d => {
  svg.append("circle")
    .attr("cx", xScale(d.pH))
    .attr("cy", yScale(d['Total_Alkalinity (mg/L)']))
    .attr("r", 5)
    .style("fill", colorScale(d.water_source))
    .style("opacity", 0.7)
    .attr("data-toggle", "tooltip")
    .attr("title", `${d.water_source}<br>pH: ${d.pH}<br>Total Alkalinity: ${d['Total_Alkalinity (mg/L)']}`)
    .on("mouseover", function() {
      d3.select(this).style("opacity", 1);
    })
    .on("mouseout", function() {
      d3.select(this).style("opacity", 0.7);
    });
});

// Add x-axis
svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(xScale));

// Add y-axis
svg.append("g")
  .call(d3.axisLeft(yScale));

// Add chart title
svg.append("text")
  .attr("x", (width / 2))
  .attr("y", 0 - (margin.top / 2))
  .attr("text-anchor", "middle")
  .style("font-size", "16px")
  .text("Relationship between Total Alkalinity (mg/l) and pH");

// Add x-axis label
svg.append("text")
  .attr("x", width / 2)
  .attr("y", height + margin.bottom)
  .attr("text-anchor", "middle")
  .text("pH");

// Add y-axis label
svg.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - margin.left)
  .attr("x", 0 - (height / 2))
  .attr("dy", "1em")
  .style("text-anchor", "middle")
  .text("Total Alkalinity (mg/l)");

// Initialize tooltip
$('[data-toggle="tooltip"]').tooltip();

// Define color scale
const colorScale = d3.scaleOrdinal()
  .domain(df.map(d => d.water_source))
  .range(d3.schemeCategory10);

// Set up the dimensions and margins for the SVG
const margin = { top: 20, right: 20, bottom: 30, left: 40 };
const width = 800 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

// Create the SVG container
const svg = d3.select("#plot9")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Set up the scales
const xScale = d3.scaleBand()
  .domain(df.map(d => d.districts))
  .range([0, width])
  .padding(0.2);

const yScale = d3.scaleLinear()
  .domain([0, d3.max(df, d => Math.max(d['Total_Hardness (mg/L)'], d['Total Dissolved Solids (mg/l)']))])
  .range([height, 0]);

// Create the bars for Total Hardness
svg.selectAll(".bar-hardness")
  .data(df)
  .enter()
  .append("rect")
  .attr("class", "bar-hardness")
  .attr("x", d => xScale(d.districts))
  .attr("y", d => yScale(d['Total_Hardness (mg/L)']))
  .attr("width", xScale.bandwidth() / 2)
  .attr("height", d => height - yScale(d['Total_Hardness (mg/L)']))
  .attr("fill", "#1f77b4");

// Create the bars for Total Dissolved Solids
svg.selectAll(".bar-dissolved-solids")
  .data(df)
  .enter()
  .append("rect")
  .attr("class", "bar-dissolved-solids")
  .attr("x", d => xScale(d.districts) + xScale.bandwidth() / 2)
  .attr("y", d => yScale(d['Total Dissolved Solids (mg/l)']))
  .attr("width", xScale.bandwidth() / 2)
  .attr("height", d => height - yScale(d['Total Dissolved Solids (mg/l)']))
  .attr("fill", "#ff7f0e");

// Add x-axis
svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(xScale));

// Add y-axis
svg.append("g")
  .call(d3.axisLeft(yScale));

// Add chart title
svg.append("text")
  .attr("x", (width / 2))
  .attr("y", 0 - (margin.top / 2))
  .attr("text-anchor", "middle")
  .style("font-size", "16px")
  .text("Comparison of Total Dissolved Solids and Total Hardness per District");

// Add x-axis label
svg.append("text")
  .attr("x", width / 2)
  .attr("y", height + margin.bottom)
  .attr("text-anchor", "middle")
  .text("Districts");

// Add y-axis label
svg.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - margin.left)
  .attr("x", 0 - (height / 2))
  .attr("dy", "1em")
  .style("text-anchor", "middle")
  .text("Concentration (mg/L)");

// Add legend
const legend = svg.append("g")
  .attr("class", "legend")
  .attr("transform", "translate(" + (width - 100) + "," + (height - 100) + ")");

legend.append("rect")
  .attr("width", 10)
  .attr("height", 10)
  .attr("fill", "#1f77b4");

legend.append("text")
  .attr("x", 20)
  .attr("y", 8)
  .text("Water Hardness");

legend.append("rect")
  .attr("width", 10)
  .attr("height", 10)
  .attr("fill", "#ff7f0e")
  .attr("y", 20);

legend.append("text")
  .attr("x", 20)
  .attr("y", 28)
  .text("Dissolved Solids");


// Set up the dimensions and margins for the SVG
const margin = { top: 20, right: 20, bottom: 30, left: 40 };
const width = 800 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

// Create the SVG container
const svg = d3.select("#plot10")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Set up the scales
const xScale = d3.scaleLinear()
  .domain([0, d3.max(df, d => d['Total_Hardness (mg/L)'])])
  .range([0, width]);

const yScale = d3.scaleLinear()
  .domain([0, d3.max(df, d => d['Total Dissolved Solids (mg/l)'])])
  .range([height, 0]);

// Create the scatter plot points
svg.selectAll("circle")
  .data(df)
  .enter()
  .append("circle")
  .attr("cx", d => xScale(d['Total_Hardness (mg/L)']))
  .attr("cy", d => yScale(d['Total Dissolved Solids (mg/l)']))
  .attr("r", 5)
  .attr("fill", d => colorScale(d.water_source));

// Add x-axis
svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(xScale));

// Add y-axis
svg.append("g")
  .call(d3.axisLeft(yScale));

// Add chart title
svg.append("text")
  .attr("x", (width / 2))
  .attr("y", 0 - (margin.top / 2))
  .attr("text-anchor", "middle")
  .style("font-size", "16px")
  .text("Relationship between Dissolved Solids and Water Hardness");

// Add x-axis label
svg.append("text")
  .attr("x", width / 2)
  .attr("y", height + margin.bottom)
  .attr("text-anchor", "middle")
  .text("Total Hardness (mg/L)");

// Add y-axis label
svg.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - margin.left)
  .attr("x", 0 - (height / 2))
  .attr("dy", "1em")
  .style("text-anchor", "middle")
  .text("Total Dissolved Solids (mg/l)");


// Set up the dimensions and margins for the SVG
const margin = { top: 20, right: 20, bottom: 30, left: 40 };
const width = 800 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

// Create the SVG container
const svg = d3.select("#plot11")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Set up the scales
const xScale = d3.scaleLinear()
  .domain([0, d3.max(df, d => d['Total_Hardness (mg/L)'])])
  .range([0, width]);

const yScale = d3.scaleLinear()
  .domain([0, d3.max(df, d => d['Total Dissolved Solids (mg/l)'])])
  .range([height, 0]);

// Create the scatter plot points
svg.selectAll("circle")
  .data(df)
  .enter()
  .append("circle")
  .attr("cx", d => xScale(d['Total_Hardness (mg/L)']))
  .attr("cy", d => yScale(d['Total Dissolved Solids (mg/l)']))
  .attr("r", 5)
  .attr("fill", d => colorScale(d.water_source));

// Add x-axis
svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(xScale))
  .append("text")
  .attr("x", width)
  .attr("dy", "-0.5em")
  .attr("text-anchor", "end")
  .text("Total_Hardness (mg/L)");

// Add y-axis
svg.append("g")
  .call(d3.axisLeft(yScale))
  .append("text")
  .attr("y", 6)
  .attr("dy", "0.71em")
  .attr("text-anchor", "end")
  .text("Total Dissolved Solids (mg/l)");

// Add chart title
svg.append("text")
  .attr("x", (width / 2))
  .attr("y", 0 - (margin.top / 2))
  .attr("text-anchor", "middle")
  .style("font-size", "16px")
  .text("Relationship between Total dissolved solids (mg/l) and Electrical Conductivity");

// Add chart labels
svg.append("text")
  .attr("x", width)
  .attr("y", height + margin.bottom)
  .attr("text-anchor", "end")
  .text("Total_Hardness (mg/L)");

svg.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - margin.left)
  .attr("x", 0 - (height / 2))
  .attr("dy", "1em")
  .style("text-anchor", "middle")
  .text("Total Dissolved Solids (mg/l)");


// Set up the dimensions and margins for the SVG
const margin = { top: 20, right: 20, bottom: 30, left: 40 };
const width = 800 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

// Create the SVG container
const svg = d3.select("#plot12")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Set up the scales
const xScale = d3.scaleLinear()
  .domain([0, d3.max(df, d => d['Chloride (mg/L)'])])
  .range([0, width]);

const yScale = d3.scaleLinear()
  .domain([0, d3.max(df, d => d['Nitrates-N (mg/L)'])])
  .range([height, 0]);

// Create the scatter plot points
svg.selectAll("circle")
  .data(df)
  .enter()
  .append("circle")
  .attr("cx", d => xScale(d['Chloride (mg/L)']))
  .attr("cy", d => yScale(d['Nitrates-N (mg/L)']))
  .attr("r", 5)
  .attr("fill", d => colorScale(d.water_source));

// Add x-axis
svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(xScale))
  .append("text")
  .attr("x", width)
  .attr("dy", "-0.5em")
  .attr("text-anchor", "end")
  .text("Chlorides (mg/l)");

// Add y-axis
svg.append("g")
  .call(d3.axisLeft(yScale))
  .append("text")
  .attr("y", 6)
  .attr("dy", "0.71em")
  .attr("text-anchor", "end")
  .text("Nitrates-N (mg/l)");

// Add chart title
svg.append("text")
  .attr("x", (width / 2))
  .attr("y", 0 - (margin.top / 2))
  .attr("text-anchor", "middle")
  .style("font-size", "16px")
  .text("Chlorides Vs Nitrates");

// Add chart labels
svg.append("text")
  .attr("x", width)
  .attr("y", height + margin.bottom)
  .attr("text-anchor", "end")
  .text("Chlorides (mg/l)");

svg.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - margin.left)
  .attr("x", 0 - (height / 2))
  .attr("dy", "1em")
  .style("text-anchor", "middle")
  .text("Nitrates-N (mg/l)");


// Set up the dimensions and margins for the SVG
const margin = { top: 20, right: 20, bottom: 30, left: 40 };
const width = 800 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

// Create the SVG container
const svg = d3.select("#plot13")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Set up the scales
const xScale = d3.scaleLinear()
  .domain([0, d3.max(df, d => d['Electrical_Conductivity'])])
  .range([0, width]);

const yScale = d3.scaleLinear()
  .domain([0, d3.max(df, d => d['Total Dissolved Solids (mg/l)'])])
  .range([height, 0]);

// Create the scatter plot points
svg.selectAll("circle")
  .data(df)
  .enter()
  .append("circle")
  .attr("cx", d => xScale(d['Electrical_Conductivity']))
  .attr("cy", d => yScale(d['Total Dissolved Solids (mg/l)']))
  .attr("r", 5)
  .attr("fill", d => colorScale(d.water_source));

// Add x-axis
svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(xScale))
  .append("text")
  .attr("x", width)
  .attr("dy", "-0.5em")
  .attr("text-anchor", "end")
  .text("Electrical Conductivity (µS/cm)");

// Add y-axis
svg.append("g")
  .call(d3.axisLeft(yScale))
  .append("text")
  .attr("y", 6)
  .attr("dy", "0.71em")
  .attr("text-anchor", "end")
  .text("Total Dissolved Solids (mg/l)");

// Add chart title
svg.append("text")
  .attr("x", (width / 2))
  .attr("y", 0 - (margin.top / 2))
  .attr("text-anchor", "middle")
  .style("font-size", "16px")
  .text("Relationship between Total dissolved solids (mg/l) and Electrical Conductivity");

// Add chart labels
svg.append("text")
  .attr("x", width)
  .attr("y", height + margin.bottom)
  .attr("text-anchor", "end")
  .text("Electrical Conductivity (µS/cm)");

svg.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - margin.left)
  .attr("x", 0 - (height / 2))
  .attr("dy", "1em")
  .style("text-anchor", "middle")
  .text("Total Dissolved Solids (mg/l)");

// Set up the dimensions and margins for the SVG
const margin = { top: 50, right: 30, bottom: 50, left: 50 };
const width = 800 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

// Create the SVG container
const svg = d3.select("#plot14")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Set up the scales
const xScale = d3.scaleBand()
  .domain(melted_df['variable'].values)
  .range([0, width]);

const yScale = d3.scaleBand()
  .domain(melted_df[df.columns[1]].values)
  .range([height, 0]);

// Set up the colorscale
const colorScale = d3.scaleSequential(d3.interpolateViridis)
  .domain([d3.min(melted_df['value'].values), d3.max(melted_df['value'].values)]);

// Create the heatmap rectangles
svg.selectAll("rect")
  .data(melted_df)
  .enter()
  .append("rect")
  .attr("x", d => xScale(d['variable']))
  .attr("y", d => yScale(d[df.columns[1]]))
  .attr("width", xScale.bandwidth())
  .attr("height", yScale.bandwidth())
  .attr("fill", d => colorScale(d['value']));

// Add x-axis
svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(xScale))
  .append("text")
  .attr("x", width)
  .attr("y", margin.bottom - 10)
  .attr("text-anchor", "end")
  .text("Parameters");

// Add y-axis
svg.append("g")
  .call(d3.axisLeft(yScale))
  .append("text")
  .attr("transform", "rotate(-90)")
  .attr("x", 0 - margin.top)
  .attr("y", -margin.left)
  .attr("dy", "0.71em")
  .attr("text-anchor", "end")
  .text("District");

// Add chart title
svg.append("text")
  .attr("x", (width / 2))
  .attr("y", 0 - (margin.top / 2))
  .attr("text-anchor", "middle")
  .style("font-size", "16px")
  .text("Water Parameters Heatmap");

// Add color legend
const legendScale = d3.scaleLinear()
  .domain([d3.min(melted_df['value'].values), d3.max(melted_df['value'].values)])
  .range([0, width]);

const legendAxis = d3.axisBottom(legendScale)
  .ticks(5);

const legend = svg.append("g")
  .attr("class", "legend")
  .attr("transform", "translate(0," + (height + margin.bottom) + ")");

legend.append("g")
  .call(legendAxis);

// Add legend title
legend.append("text")
  .attr("x", width)
  .attr("y", 25)
  .attr("text-anchor", "end")
  .text("Value");

// Add legend color scale
legend.append("rect")
  .attr("x", 0)
  .attr("y", 0)
  .attr("width", width)
  .attr("height", 20)
  .attr("fill", d => colorScale(d));

// Add chart labels
svg.append("text")
  .attr("x", width)
  .attr("y", height + margin.bottom)
  .attr("text-anchor", "end")
  .text("Parameters");

svg.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - margin.left)
  .attr("x", 0 - (height / 2))
  .attr("dy", "1em")
  .style("text-anchor", "middle")
  .text("District");


// Set up the dimensions and margins for the SVG
const margin = { top: 50, right: 30, bottom: 50, left: 50 };
const width = 800 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

// Create the SVG container
const svg = d3.select("#plot15")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Set up the radial scale
const radialScale = d3.scaleLinear()
  .domain([0, sum_per_district.max().max()])
  .range([0, height / 2]);

// Set up the angle scale
const angleScale = d3.scalePoint()
  .domain(districts)
  .range([0, 2 * Math.PI]);

// Create the radar lines for each parameter
data.forEach((paramData) => {
  const line = d3.lineRadial()
    .angle((d, i) => angleScale(districts[i]))
    .radius((d) => radialScale(d));

  svg.append("path")
    .datum(paramData.r)
    .attr("d", line)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 2)
    .attr("class", "radar-line");
});

// Add axis lines
svg.selectAll(".axis-line")
  .data(districts)
  .enter()
  .append("line")
  .attr("class", "axis-line")
  .attr("x1", 0)
  .attr("y1", 0)
  .attr("x2", (d, i) => radialScale(sum_per_district.max().max()) * Math.sin(angleScale(d)))
  .attr("y2", (d, i) => -radialScale(sum_per_district.max().max()) * Math.cos(angleScale(d)))
  .attr("stroke", "gray")
  .attr("stroke-width", 1)
  .attr("stroke-dasharray", "3,3");

// Add axis labels
svg.selectAll(".axis-label")
  .data(districts)
  .enter()
  .append("text")
  .attr("class", "axis-label")
  .attr("x", (d, i) => radialScale(sum_per_district.max().max()) * 1.1 * Math.sin(angleScale(d)))
  .attr("y", (d, i) => -radialScale(sum_per_district.max().max()) * 1.1 * Math.cos(angleScale(d)))
  .attr("text-anchor", "middle")
  .attr("alignment-baseline", "middle")
  .text((d) => d)
  .style("font-size", "12px");

// Add chart title
svg.append("text")
  .attr("x", (width / 2))
  .attr("y", 0 - (margin.top / 2))
  .attr("text-anchor", "middle")
  .style("font-size", "16px")
  .text("Water Parameters Radar Chart");

// Set up the dimensions and margins for the SVG
const margin = { top: 50, right: 30, bottom: 50, left: 50 };
const width = 800 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

// Create the SVG container
const svg = d3.select("#plot16")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Set up the x-axis scale
const xScale = d3.scalePoint()
  .domain(parameters)
  .range([0, width]);

// Set up the y-axis scale
const yScale = d3.scaleLinear()
  .domain([0, d3.max(df.values.flat())])
  .range([height, 0]);

// Create line generator
const line = d3.line()
  .x((d, i) => xScale(parameters[i]))
  .y((d) => yScale(d))
  .curve(d3.curveMonotoneX);

// Add lines for each borehole
df.forEach((row, borehole) => {
  svg.append("path")
    .datum(row)
    .attr("class", "line")
    .attr("d", line)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 2);
});

// Add markers for each data point
df.forEach((row, borehole) => {
  svg.selectAll(".marker")
    .data(row)
    .enter()
    .append("circle")
    .attr("class", "marker")
    .attr("cx", (d, i) => xScale(parameters[i]))
    .attr("cy", (d) => yScale(d))
    .attr("r", 4)
    .attr("fill", "steelblue");
});

// Add x-axis
svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(xScale))
  .selectAll("text")
  .attr("transform", "rotate(-45)")
  .style("text-anchor", "end");

// Add y-axis
svg.append("g")
  .call(d3.axisLeft(yScale));

// Add chart title
svg.append("text")
  .attr("x", (width / 2))
  .attr("y", 0 - (margin.top / 2))
  .attr("text-anchor", "middle")
  .style("font-size", "16px")
  .text("Water Parameter Trend");


// Set up the dimensions and margins for the SVG
const margin = { top: 50, right: 30, bottom: 50, left: 50 };
const width = 800 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

// Create the SVG container
const svg = d3.select("#plot17")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Set up the x-axis scale
const xScale = d3.scaleBand()
  .domain(districts)
  .range([0, width])
  .padding(0.2);

// Set up the y-axis scale
const yScale = d3.scaleLinear()
  .domain([0, d3.max(averages[parameters.flat()])])
  .range([height, 0]);

// Set up color scale
const colorScale = d3.scaleOrdinal()
  .domain(parameters)
  .range(d3.schemeCategory10);

// Add bars for each parameter
parameters.forEach((parameter, i) => {
  svg.selectAll(".bar")
    .data(averages)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", (d) => xScale(d.districts) + xScale.bandwidth() / parameters.length * i)
    .attr("y", (d) => yScale(d[parameter]))
    .attr("width", xScale.bandwidth() / parameters.length)
    .attr("height", (d) => height - yScale(d[parameter]))
    .attr("fill", colorScale(parameter));
});

// Add x-axis
svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(xScale))
  .selectAll("text")
  .attr("transform", "rotate(-45)")
  .style("text-anchor", "end");

// Add y-axis
svg.append("g")
  .call(d3.axisLeft(yScale));

// Add legend
const legend = svg.append("g")
  .attr("transform", "translate(" + (width - 120) + "," + (-20) + ")");

parameters.forEach((parameter, i) => {
  const legendItem = legend.append("g")
    .attr("transform", "translate(0," + (i * 20) + ")");

  legendItem.append("rect")
    .attr("width", 10)
    .attr("height", 10)
    .attr("fill", colorScale(parameter));

  legendItem.append("text")
    .attr("x", 15)
    .attr("y", 6)
    .attr("dy", "0.35em")
    .text(parameter);
});

// Add chart title
svg.append("text")
  .attr("x", (width / 2))
  .attr("y", 0 - (margin.top / 2))
  .attr("text-anchor", "middle")
  .style("font-size", "16px")
  .text("Parameter Comparison by District");


// Set up the dimensions and margins for the SVG
const margin = { top: 50, right: 30, bottom: 50, left: 50 };
const width = 800 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

// Create the SVG container
const svg = d3.select("#plot18")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Set up the x-axis scale
const xScale = d3.scaleBand()
  .domain(df.water_source)
  .range([0, width])
  .padding(0.2);

// Set up the y-axis scale
const yScale = d3.scaleLinear()
  .domain([0, d3.max(df.Value)])
  .range([height, 0]);

// Set up color scale
const colorScale = d3.scaleOrdinal()
  .domain(df.Parameter)
  .range(d3.schemeCategory10);

// Add initial bars
svg.selectAll(".bar")
  .data(df)
  .enter()
  .append("rect")
  .attr("class", "bar")
  .attr("x", (d) => xScale(d.water_source))
  .attr("y", (d) => yScale(d.Value))
  .attr("width", xScale.bandwidth())
  .attr("height", (d) => height - yScale(d.Value))
  .attr("fill", (d) => colorScale(d.Parameter));

// Add x-axis
svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(xScale))
  .selectAll("text")
  .attr("transform", "rotate(-45)")
  .style("text-anchor", "end");

// Add y-axis
svg.append("g")
  .call(d3.axisLeft(yScale));

// Add chart title
svg.append("text")
  .attr("x", (width / 2))
  .attr("y", 0 - (margin.top / 2))
  .attr("text-anchor", "middle")
  .style("font-size", "16px")
  .text("Water Parameter per Water Source");

// Define the transition function
const transition = (parameter) => {
  // Filter the data based on the selected parameter
  const filteredData = df.filter((d) => d.Parameter === parameter);

  // Update the y-axis scale domain
  yScale.domain([0, d3.max(filteredData, (d) => d.Value)]);

  // Update the bars
  svg.selectAll(".bar")
    .data(filteredData, (d) => d.water_source)
    .transition()
    .duration(1000)
    .attr("y", (d) => yScale(d.Value))
    .attr("height", (d) => height - yScale(d.Value))
    .attr("fill", (d) => colorScale(d.Parameter));
};

// Define the animation frames
const frames = df.map((d) => d.Parameter);

// Add animation buttons
d3.select("#animation")
  .selectAll("button")
  .data(frames)
  .enter()
  .append("button")
  .text((d) => d)
  .on("click", (event, d) => transition(d));


// Set up the dimensions and margins for the SVG
const margin = { top: 50, right: 30, bottom: 50, left: 50 };
const width = 800 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

// Create the SVG container
const svg = d3.select("#plot18")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Set up the x-axis scale
const xScale = d3.scaleLinear()
  .domain([0, d3.max(df1["Mercury (mg/L)"])])
  .range([0, width]);

// Set up the y-axis scale
const yScale = d3.scaleLinear()
  .domain([0, d3.max(df1["Lead (mg/L)"])])
  .range([height, 0]);

// Set up color scale
const colorScale = d3.scaleOrdinal()
  .domain(df1.water_source)
  .range(d3.schemeCategory10);

// Add scatter plot points
svg.selectAll(".point")
  .data(df1)
  .enter()
  .append("circle")
  .attr("class", "point")
  .attr("cx", (d) => xScale(d["Mercury (mg/L)"]))
  .attr("cy", (d) => yScale(d["Lead (mg/L)"]))
  .attr("r", 5)
  .attr("fill", (d) => colorScale(d.water_source))
  .attr("stroke", "black");

// Add x-axis
svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(xScale));

// Add y-axis
svg.append("g")
  .call(d3.axisLeft(yScale));

// Add horizontal line for Mercury limit
svg.append("line")
  .attr("x1", 0)
  .attr("y1", yScale(0.001))
  .attr("x2", width)
  .attr("y2", yScale(0.001))
  .attr("stroke-dasharray", "4")
  .attr("stroke", "grey");

// Add vertical line for Lead limit
svg.append("line")
  .attr("x1", xScale(0.01))
  .attr("y1", 0)
  .attr("x2", xScale(0.01))
  .attr("y2", height)
  .attr("stroke-dasharray", "4")
  .attr("stroke", "grey");

// Add text annotation for Mercury limit
svg.append("text")
  .attr("x", width)
  .attr("y", yScale(0.001))
  .attr("dy", -5)
  .attr("text-anchor", "end")
  .text("Mercury Limit");

// Add text annotation for Lead limit
svg.append("text")
  .attr("x", xScale(0.01))
  .attr("y", 0)
  .attr("dy", -10)
  .attr("text-anchor", "end")
  .text("Lead Limit");

// Add chart title
svg.append("text")
  .attr("x", (width / 2))
  .attr("y", 0 - (margin.top / 2))
  .attr("text-anchor", "middle")
  .style("font-size", "18px")
  .text("Heavy Metals in Water Source");


// Set up the dimensions and margins for the SVG
const margin = { top: 50, right: 30, bottom: 50, left: 50 };
const width = 400 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;
const radius = Math.min(width, height) / 2;

// Create the SVG container
const svg = d3.select("#plot19")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

// Set up color scale
const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

// Create the pie chart layout
const pie = d3.pie()
  .value((d) => d.value)
  .sort(null);

// Generate the arc for each slice
const arc = d3.arc()
  .innerRadius(0)
  .outerRadius(radius);

// Generate the pie chart slices
const slices = svg.selectAll("path")
  .data(pie(df1))
  .enter()
  .append("path")
  .attr("d", arc)
  .attr("fill", (d) => colorScale(d.data.districts))
  .attr("stroke", "white")
  .attr("stroke-width", 2);

// Add labels for each slice
slices.append("text")
  .attr("transform", (d) => "translate(" + arc.centroid(d) + ")")
  .attr("text-anchor", "middle")
  .text((d) => d.data.districts);

// Add a title to the chart
svg.append("text")
  .attr("x", 0)
  .attr("y", -height / 2 - margin.top / 2)
  .attr("text-anchor", "middle")
  .style("font-size", "18px")
  .text("Water Microbial Organisms per District");

// Update the chart template
svg.attr("class", "plotly_dark");

// Set up the dimensions and margins for the SVG
const margin = { top: 50, right: 30, bottom: 50, left: 50 };
const width = 400 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;
const radius = Math.min(width, height) / 2;

// Create the SVG container
const svg = d3.select("#plot20")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

// Set up color scale
const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

// Create the pie chart layout
const pie = d3.pie()
  .value((d) => d.value)
  .sort(null);

// Generate the arc for each slice
const arc = d3.arc()
  .innerRadius(radius * 0.4)
  .outerRadius(radius);

// Generate the pie chart slices
const slices = svg.selectAll("path")
  .data(pie(df1))
  .enter()
  .append("path")
  .attr("d", arc)
  .attr("fill", (d) => colorScale(d.data.districts))
  .attr("stroke", "white")
  .attr("stroke-width", 2);

// Add labels for each slice
slices.append("text")
  .attr("transform", (d) => "translate(" + arc.centroid(d) + ")")
  .attr("text-anchor", "middle")
  .text((d) => d.data.districts);

// Add a title to the chart
svg.append("text")
  .attr("x", 0)
  .attr("y", -height / 2 - margin.top / 2)
  .attr("text-anchor", "middle")
  .style("font-size", "18px")
  .text("Chlorine Levels per District");

// Update the chart template
svg.attr("class", "plotly_dark");


});

