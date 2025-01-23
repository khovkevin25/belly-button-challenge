// Build the metadata panel
function buildMetadata(sample) {
  let dropdownMenu = d3.select("#selDataset");

  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    let SampleIDs = data.names;
    for (let i = 0; i < SampleIDs.length; i++) {
      dropdownMenu
        .append("option")
        .text(SampleIDs[i])
        .property("value", SampleIDs[i]);
    }
  });
}

// Function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let AllSamples = data.samples;


    // Filter the samples for the object with the desired sample number
    let FilteredSample = AllSamples.filter(sampleObj => sampleObj.id == SelectedSample);
    let SampleData = FilteredSample[0];

    // Get the otu_ids, otu_labels, and sample_values
    let otuIDs = SampleData.otu_ids;
    let otuLabels = SampleData.otu_labels;
    let SampleValues = SampleData.sample_values;

    // Build a Bubble Chart
    let BubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      margin: { t: 30 },
      hovermode: "closest",
      x_axis: { title: "OTU ID" },
    };

    // Render the Bubble Chart
    let BubbleData = [
      {
        x: otuIDs,
        y: SampleValues,
        text: otuLabels,
        mode: "markers",
        marker: {
          size: SampleValues,
          color: otuIDs,
          colorscale: "Earth"
        }
      }
    ];

    Plotly.newPlot("bubble", BubbleData, BubbleLayout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    let BarYTicks = otuIDs.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();

    // Build a Bar Chart
    let BarData = [
      {
        y: BarYTicks,
        x: SampleValues.slice(0, 10).reverse(),
        text: otuLabels.slice(0, 10).reverse(),
        type: "bar",
        orientation: "h",
      }
    ];

    // Render the Bar Chart
    let BarLayout = {
      title: "Top 10 Bacteria Cultures Found",
      margin: { t: 30, l: 150 }
    };

    Plotly.newPlot("bar", BarData, BarLayout);
  });
}

// Function to run on page load
function init(SelectedSample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let MetadataArray = data.metadata;
    let FilteredMetadata = MetadataArray.filter(sampleObj => sampleObj.id == SelectedSample);
    let SampleMetadata = FilteredMetadata[0];

    // Use d3 to select the dropdown with id of `#selDataset`
    let MetadataPanel = d3.select("#sample-metadata");
    MetadataPanel.html("");

    // Use the list of sample names to populate the select options
    for (let key in SampleMetadata) {
      MetadataPanel.append("h6").text(`${key.toUpperCase()}: ${SampleMetadata[key]}`);
    }
  });
}

// Function for event listener
function optionChanged(NewSample) {
  // Build charts and metadata panel each time a new sample is selected
  createCharts(NewSample);
  populateMetadata(NewSample);
}

// Initialize the dashboard
init();