// Global variables
var canvas_width = 800;
var canvas_heigth = 400;
var plotHist = false;

// Neurons
var active_neuron = 0;
var neurons = [];
var colors = ["green","red"];

// Create sources
var exc_source = new spikeSource(0,0,"exc");
var inh_source = new spikeSource(1,0,"inh");
var sources = [exc_source, inh_source];

// Exectuted when loading the page
window.onload = function() {
	
	// Use single neuron by default
	singleNeuron();

	// Link between menu elements and simulation
	document.getElementById("singleNeuron").onmouseup = singleNeuron;
	document.getElementById("twoNeurons").onmouseup = twoNeurons;

}

// Load interface for single neuron simulation
function singleNeuron(){

	// Reset the interface
	resetInterface();

	// Create one neuron
	neurons = [new neuron(0,[])];

	// Create simulation title, and the main plot canvas
	createSimTitle("Single neuron simulator");
	createCanvasNetwork(380,100);

	// Create plot controls
	createPlotControls();

	// Create simulation controls
	createNeuronControls(active_neuron,parameters,parameters_min,parameters_max,parameters_value);
	createSimControls();
	createSourcesControls(sources);

	// Create canvas for drawing
	createCanvasMembrane(canvas_width,canvas_heigth);
	createCanvasSpikes(0,canvas_width,canvas_heigth/4);

	// Link sliders to simulation
	for(var i = 0; i < parameters.length; i++){
		document.getElementById(parameters[i]).onmousemove = sim;
	}

	document.getElementById("simtime").onmousemove = sim;

	document.getElementById("source_freq_0").onmousemove = sim;
	document.getElementById("source_freq_1").onmousemove = sim;

	document.getElementById("source_type_0").onmousemove = sim;
	document.getElementById("source_type_1").onmousemove = sim;

	document.getElementById("source_status_0").onmousemove = sim;
	document.getElementById("source_status_1").onmousemove = sim;

	document.getElementById("Time").onmouseup = temporal;
	document.getElementById("Histogram").onmouseup = histogram;

	// Start a simulation
	sim();
}


function twoNeurons(){

	// Reset interface
	resetInterface();

	// Create two neurons
	neurons = [new neuron(0,[1]), new neuron(1,[])];

	// Create plot areas, and neuron selector
	createSimTitle("Two neurons simulator");
	createCanvasNetwork(380,100);
	createNeuronSelect();

	// Create plot controls
	createPlotControls();

	// Link neuron select
	document.getElementById("neuron_select").onmousemove = changeNeuron;

	// Create controls
	createNeuronControls(active_neuron,parameters,parameters_min,parameters_max,parameters_value);
	createSimControls();
	createSourcesControls(sources);

	// Create canvas for drawing
	createCanvasMembrane(canvas_width,canvas_heigth);
	createCanvasSpikes(0,canvas_width,canvas_heigth/4);
	createCanvasSpikes(1,canvas_width,canvas_heigth/4);

	// Link sliders to simulation
	for(var i = 0; i < parameters.length; i++){
		document.getElementById(parameters[i]).onmousemove = sim;
	}

	document.getElementById("simtime").onmousemove = sim;

	document.getElementById("source_freq_0").onmousemove = sim;
	document.getElementById("source_freq_1").onmousemove = sim;

	document.getElementById("source_type_0").onmousemove = sim;
	document.getElementById("source_type_1").onmousemove = sim;

	document.getElementById("source_status_0").onmousemove = sim;
	document.getElementById("source_status_1").onmousemove = sim;

	document.getElementById("Time").onmouseup = temporal;
	document.getElementById("Histogram").onmouseup = histogram;

	// Start a simulation
	sim();
}

// Change the neuron
function changeNeuron(){

	// Get active neuron
	active_neuron = document.getElementById("neuron_select").value;

	// Change title
	document.getElementById("params_title").innerHTML = "Neuron " + active_neuron.toString() + " parameters"

	// Load neuron parameters
	updateParameters(parameters, neurons[active_neuron].parameters)

	// Plot network
	plot_network(neurons,sources,active_neuron);

}

// Plot temporal evolution
function temporal(){
	plotHist = false;
	sim();
}

// Plot histogram
function histogram(){
	plotHist = true;
	sim();
}


// Main simulation function
function sim(){

	// Measure time
	var start = new Date().getTime();

	// Create context for neuron and spikes
	var canvas = document.getElementById("membrane");
	var context = canvas.getContext("2d");

	// Plot network
	plot_network(neurons,sources,active_neuron);

	// Reset neurons
	for(var n = 0; n < neurons.length; n++){
		neurons[n].resetNeuron();
	}

	// Get parameters from neuron
	neurons[active_neuron].parameters = getNeuronParameters(parameters);

	// Get parameters from sources
	sources_changed = false;
	for (var s = 0; s < sources.length; s++){
		if (isSourceChanged(getSourceParameters(s,source_parameters),sources[s].parameters) == true){
			sources_changed = true;
		}
		sources[s].parameters = getSourceParameters(s,source_parameters);
	}

	// Update text
	for(var i = 0; i < parameters.length; i++){
		document.getElementById(parameters[i] + "_text").value = neurons[active_neuron].parameters[parameters[i]];
	}

	// Update text sources
	for (var s = 0; s < sources.length; s++){
		updateDisplaySource(sources[s]);
	}

	// Get simulation time
	var sim_time = document.getElementById("simtime_text").value = parseFloat(document.getElementById("simtime").value);
	var dt = sim_time/canvas_width;

	// Info from spike source
	if (sources_changed == false && sources[0].spikes != [] && sources[1].spikes != []){
		var spikes_input_exc = sources[0].spikes;
		var spikes_input_inh = sources[1].spikes;
	}
	else {
		var spikes_input_exc = genSpikeInput(sim_time,dt,exc_source);
		var spikes_input_inh = genSpikeInput(sim_time,dt,inh_source);
		sources[0].spikes = spikes_input_exc;
		sources[1].spikes = spikes_input_inh;
	}
	

	// Simulation
	for(var i = 0; i < canvas_width; i++){

		// Spikes ?
		spikes = []
		for(var n = 0; n < neurons.length; n++){
			if(neurons[n].spike_out == true){
				for (var t = 0; t < neurons[n].targets.length; t++){
					spikes.push(neurons[n].targets[t]);
				}
				neurons[n].spike_out = false;
			}
		}

		// Update neurons
		if (spikes != []){
			for(var s = 0; s < spikes.length; s++){s
				neurons[spikes[s]].spike_in = true;
			}
		}

		// Calc neurons
		for(var n = 0; n < neurons.length; n++){
			if (n == 0){
				calc_neuron(neurons[n],i,dt,spikes_input_exc,spikes_input_inh);
			}
			else{
				calc_neuron(neurons[n],i,dt,[],[]);
		}
		}
	}

	// Plot membrane and spikes
	clear_membrane_plot(canvas,context);
	for(var n = 0; n < neurons.length; n++){
		if (plotHist == false){
			plot_membrane(canvas,context,neurons[n].membrane_array, -80, -20, colors[n]);
		}
		else {
			plot_hist(canvas,context,neurons[n].membrane_array, -80, -20, colors[n]);		
		}
		plot_spikes(n,neurons[n].spikes, colors[n]);
	}	

	// Plot the axis
	if (plotHist == false){
		plot_axis_temp(canvas,context,0,sim_time,-20,-80);
	}
	else {
		plot_axis_hist(canvas,context,-80,-20);
	}

	// Measure time
	var end = new Date().getTime();
	var time = end - start;
	//alert('Execution time: ' + time);

}