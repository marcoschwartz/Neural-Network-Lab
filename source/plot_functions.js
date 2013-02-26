// Create the slider to select neurons
function createNeuronSelect(){
	neuron_control = document.getElementById('neuroncontrol')

	// Create controls
	var control_div = document.createElement("div");
	control_div.setAttribute('id',"neuron_select_div");
  		control_div.innerHTML = "<label for='neuron_select'>Select neuron</label>" +
  		"<input id='neuron_select' type='range' min ='0' max='1' step='1' value='0' />";
		neuron_control.appendChild(control_div);
}

// Create the simulator title
function createSimTitle(title){
	simTitle = document.getElementById('simTitle');
  	simTitle.innerHTML = title;
}

// Create controls for the plot
function createPlotControls(){
	controls = document.getElementById('controls');

	var plotControlsTitle = document.createElement("div");
	plotControlsTitle.innerHTML = "Plot controls:";
	plotControlsTitle.setAttribute("class","plotControlsTitle");
	controls.appendChild(plotControlsTitle);

	buttons = ["Time","Histogram"]

	for(var i = 0; i < buttons.length; i++){

		var the_button = document.createElement("input");
		the_button.setAttribute('type',"button");
		the_button.setAttribute('id',buttons[i]);
		the_button.setAttribute('class',"plotControls");
		the_button.setAttribute('value',buttons[i]);
		controls.appendChild(the_button);
	}
}

// Reset the interface
function resetInterface(){
	document.getElementById("simTitle").innerHTML = "";
	document.getElementById("simSwitch").innerHTML = "";
	document.getElementById("neuroncontrol").innerHTML = "";
	document.getElementById("canvases").innerHTML = "";
	document.getElementById("controls").innerHTML = "";
}

// Create the controllers for one neuron
function createNeuronControls(neuron_id,parameters,parameters_min,parameters_max,parameters_value){
	neuron_control = document.getElementById('neuroncontrol')

	// Put title
	var params_title = document.createElement("div");
	params_title.setAttribute('id','params_title');
	params_title.innerHTML = "Neuron " + neuron_id.toString() + " parameters"
	neuron_control.appendChild(params_title);

	// Create controls
	for(var i = 0; i < parameters.length; i++){
		var control_div = document.createElement("div");
		control_div.setAttribute('id',parameters[i]+"_div");
  		control_div.innerHTML = "<label for='" + parameters[i] + "'>" + parameters[i] + " </label>" +
  		"<input id='" + parameters[i] + "' type='range' min='" + parameters_min[i] + "' max='" + parameters_max[i] + "' step='1' value='" + parameters_value[i] + "' />" +
  		"<input type='text' size='3' id='" + parameters[i] + "_text'>";
		neuron_control.appendChild(control_div);
	}
}

// Create the controllers for the simulation
function createSimControls(){
	// Put title control sim
	var sim_title = document.createElement("div");
	sim_title.setAttribute('class','sim_title');
	sim_title.innerHTML = "Simulation parameters"
	neuron_control.appendChild(sim_title);

	var control_div = document.createElement("div");
	control_div.setAttribute('id','simtime_div');
  	control_div.innerHTML = "<label for='simtime'>" + 'Simulation time' + " </label>" +
  	"<input id='" + "simtime' type='range' min='" + "50" + "' max='" + "800" + "' step='10' value='" + "800" + "' />" +
  	"<input type='text' size='3' id='" + "simtime" + "_text'>";
	neuron_control.appendChild(control_div);
}

// Create the save/load buttons
function createSave(){
	controls = document.getElementById('controls');

	buttons = ["Save","Load"]

	for(var i = 0; i < buttons.length; i++){

		var the_button = document.createElement("input");
		the_button.setAttribute('type',"button");
		the_button.setAttribute('id',buttons[i]);
		the_button.setAttribute('value',buttons[i]);
		controls.appendChild(the_button);
	}
}

// Create the presets buttons
function createPresets(){
	controls = document.getElementById('controls');

	buttons = ["Basic","Exponential","Poisson"]

	for(var i = 0; i < buttons.length; i++){

		var the_button = document.createElement("input");
		the_button.setAttribute('type',"button");
		the_button.setAttribute('id',buttons[i]);
		the_button.setAttribute('value',buttons[i]);
		controls.appendChild(the_button);
	}
}

// Update neuron parameters of the controllers
function updateParameters(parameters, new_parameters){
	for(var i = 0; i < parameters.length; i++){
		document.getElementById(parameters[i] + "_text").value = new_parameters[parameters[i]];
		document.getElementById(parameters[i]).value = new_parameters[parameters[i]];
	}
}

// Get neuron parameters from the controllers
function getNeuronParameters(parameters){
	neuron_parameters = {};
	for(var i = 0; i < parameters.length; i++){
		parameter_value = parseFloat(document.getElementById(parameters[i]).value);
		neuron_parameters[parameters[i]] = parameter_value;
	}
	return neuron_parameters;
}

// Get parameters from a spike source
function getSourceParameters(source_id,parameters){
	new_source_parameters = {};
	for(var i = 0; i < parameters.length; i++){		
		parameter_value = parseFloat(document.getElementById(parameters[i] + "_" + source_id.toString()).value);
		new_source_parameters[parameters[i]] = parameter_value;
	}
	return new_source_parameters;
}

// Update parameters of a spike source
function updateSpikeSource(source, freq, status, type){
	document.getElementById("source_freq_" + source.source_id.toString()).value = freq;
	document.getElementById("source_status_" + source.source_id.toString()).value = status;
	document.getElementById("source_type_" + source.source_id.toString()).value = type;
}

// Update the displayed values of a spike source
function updateDisplaySource(source){
	document.getElementById("source_freq_text_" + source.source_id.toString()).value = source.parameters["source_freq"];
	if (source.parameters["source_status"] == 0){
		document.getElementById("source_status_text_" + source.source_id.toString()).value = "Off";
	}
	else{
		document.getElementById("source_status_text_" + source.source_id.toString()).value = "On";
	}
	if (source.parameters["source_type"] == 0){
		document.getElementById("source_type_text_" + source.source_id.toString()).value = "Off";
	}
	else{
		document.getElementById("source_type_text_" + source.source_id.toString()).value = "On";
	}
}

// Create controllers for a spike source
function createSourceControls(source){
	neuron_control = document.getElementById('neuroncontrol');

	source_id = source.source_id.toString();

	// Title
	var source_title = document.createElement("div");
	source_title.setAttribute('class','source_title');
	if (source.source_action == "exc") {
		source_title.innerHTML = "Excitatory spike source for neuron " + source.target_neuron.toString();
	}
	else {
		source_title.innerHTML = "Inhibitory spike source for neuron " + source.target_neuron.toString();
	}
	neuron_control.appendChild(source_title);

	// Frequency
	var control_div = document.createElement("div");
	control_div.setAttribute('id','spikefreq_div_' + source_id);
  	control_div.innerHTML = "<label for='source_freq_'" + source_id + ">" + 'Frequency' + " </label>" +
  	"<input id='" + "source_freq_" + source_id + "' type='range' min='" + "50" + "' max='" + "200" + "' step='10' value='" + "100" + "' />" +
  	"<input type='text' size='3' id='" + "source_freq" + "_text_" + source_id + "'>";
	neuron_control.appendChild(control_div);

	// On - Off
	var source_status = document.createElement("div");
	source_status.setAttribute('id','source_status_div_' + source_id);
  	source_status.innerHTML = "<label for='source_status_" + source_id + "'>Active</label>" + 
    "<input id='" + "source_status_" + source_id + "' type='range' min='" + "0" + "' max='" + "1" + "' step='1' value='" + "0" + "' />" +
  	"<input type='text' size='3' id='" + "source_status" + "_text_" + source_id + "'>";
	neuron_control.appendChild(source_status);

	// Poisson - Regular
	var source_type = document.createElement("div");
	source_type.setAttribute('id','source_type_div_' + source_id);
  	source_type.innerHTML = "<label for='source_type_" + source_id + "'>Poisson</label>" + 
  	"<input id='" + "source_type_" + source_id + "' type='range' min='" + "0" + "' max='" + "1" + "' step='1' value='" + "0" + "' />" +
  	"<input type='text' size='3' id='" + "source_type" + "_text_" + source_id + "'>";
	neuron_control.appendChild(source_type);

}

// Create source controller for several sources
function createSourcesControls(sources){
	for (var s = 0; s < sources.length; s++){
		createSourceControls(sources[s]);
	}
}

// Get the frequency from a spike source
function getSourceFrequency(source_id){
	return document.getElementById("spikefreq_text_" + source_id.toString()).value = parseFloat(document.getElementById("spikefreq_" + source_id.toString()).value);
}

// Get the status from a spike source
function getSourceStatus(source_id){
	return document.getElementById("source_status_" + source_id.toString()).checked;
}

// Get the type from a spike source
function getSourceType(source_id){	
	return document.getElementById("source_type_" + source_id.toString()).checked;
}

// Check if a spike source as been modified
function isSourceChanged(new_parameters, old_parameters){
	source_changed = false;

	if (new_parameters.source_type != old_parameters.source_type){
		source_changed = true;
	}

	if (new_parameters.source_freq != old_parameters.source_freq){
		source_changed = true;
	}

	if (new_parameters.source_status != old_parameters.source_status){
		source_changed = true;
	}

	return source_changed;
}

// Create canvas to plot the membrane potential
function createCanvasMembrane(width,height){
	canvas_div = document.getElementById("canvases");
	canvas_membrane = document.createElement("canvas");
	canvas_membrane.setAttribute("id","membrane");
	canvas_membrane.setAttribute("width",width.toString());
	canvas_membrane.setAttribute("height",height.toString());

	canvas_div.appendChild(canvas_membrane);
}

// Create canvas to plot spikes
function createCanvasSpikes(canvas_id,width,height){
	canvas_div = document.getElementById("canvases");
	canvas_spikes = document.createElement("canvas");
	canvas_spikes.setAttribute("id","spikes_" + canvas_id);
	canvas_spikes.setAttribute("width",width.toString());
	canvas_spikes.setAttribute("height",height.toString());

	canvas_div.appendChild(canvas_spikes);
	
}

// Clear the area to plot membrane potential
function clear_membrane_plot(canvas,context){
	canvas_width = canvas.width;
	canvas_height = canvas.height;
	context.clearRect (0 , 0 , canvas_width , canvas_height );
}

// Plot the membrane potential
function plot_membrane(canvas,context,membrane,vmin,vmax,color){

	canvas_width = canvas.width;
	canvas_height = canvas.height;

	var a = parseInt(canvas_height/(vmin-vmax));
	var b = parseInt(-canvas_height*vmax/(vmin-vmax));

	context.beginPath();
	context.moveTo(0,a*membrane[0]+b);

	for(var i = 0; i < canvas_width; i++){
		context.lineTo(i,a*membrane[i]+b);
	}

	context.lineWidth = 2;
	context.strokeStyle = color;
	context.stroke();
	context.closePath();
}

// Plot the histogram of the membrane potential
function plot_hist(canvas,context,membrane,vmin,vmax,color){

	var bins = 20;
	var data_min = Math.min.apply(null, membrane);
	var data_max = Math.max.apply(null, membrane);
	var bin_range = data_max - data_min;
	var bin_size = Math.abs(bin_range/bins);
	var max_len_bin = 0;
	var bin_mins = [];
	var bin_lens = [];

	for (i = 0; i < 2*bins; i++){
		var min_bin = data_min + i*bin_size;
		var max_bin = data_min + (i+1)*bin_size;
		var temp_array = [];
		for (e = 0; e < membrane.length; e++){
			if (membrane[e] >= min_bin && membrane[e] <= max_bin)
			{
				temp_array.push(membrane[e]);	
			}
				
		}
		bin_len = temp_array.length;
		if (bin_len > max_len_bin){
			max_len_bin = bin_len;
		}
		bin_mins.push(min_bin);
		bin_lens.push(bin_len);
	}

	var a = parseInt(canvas.width/(vmax-vmin));
	var b = parseInt(-canvas.width*vmin/(vmax-vmin));

	y_scaling = canvas.height*0.9/max_len_bin;

	context.beginPath();
	for (i = 0; i < 2*bins; i++){

		context.fillStyle = color;
		context.fillRect(b+a*bin_mins[i], canvas.height,a*bin_size,-bin_lens[i]*y_scaling);
		context.strokeStyle = "000000";
		context.strokeRect(b+a*bin_mins[i], canvas.height,a*bin_size,-bin_lens[i]*y_scaling);
	}
	context.closePath();
}

// Plot the spikes
function plot_spikes(context_id, spikes , color){

	var canvas_spikes = document.getElementById("spikes_" + context_id);
	var context_spikes = canvas_spikes.getContext("2d");

	if (spikes != []){
		
		context_spikes.fillStyle = color;
		context_spikes.clearRect (0 , 0 , canvas_spikes.width , canvas_spikes.height );
		for (var i=0; i<spikes.length; i++) {
			context_spikes.fillRect(spikes[i],20,1,60);
		}
	}
}

// Create canvas to plot the network
function createCanvasNetwork(width,height){
	canvas_div = document.getElementById("neuroncontrol");
	canvas_network = document.createElement("canvas");
	canvas_network.setAttribute("id","network_canvas");
	canvas_network.setAttribute("width",width.toString());
	canvas_network.setAttribute("height",height.toString());

	canvas_div.appendChild(canvas_network);
	
}

// Plot the neural network
function plot_network(neurons,sources,active_neuron){

	// Create object
	var canvas_network = document.getElementById("network_canvas");
	var context_network = canvas_network.getContext("2d");

 	// Get dimensions
	width = canvas_network.width;
	height = canvas_network.height;

	width_sources = width/3;
	width_neurons = width*2/3;

	pos_neuron_one_x = width_sources + width_neurons*1/5;
	pos_neuron_two_x = width_sources + width_neurons*4/5;
	pos_neuron_y = height/2;
	neuron_radius = height/4;

	pos_source_x = width_sources/5;
	pos_source_one_y = height/9;
	pos_source_two_y = height*5/9;

	source_width = width_sources*3/5;
	source_height = height/3;

	// Draw neurons
	context_network.clearRect (0 , 0 , width , height );
	if (neurons.length == 2) {
		plot_circle_fill(context_network,pos_neuron_one_x,pos_neuron_y,neuron_radius,"green");
		plot_circle_fill(context_network,pos_neuron_two_x,pos_neuron_y,neuron_radius,"red");
		if (active_neuron == 0){
			plot_circle_stroke(context_network,pos_neuron_one_x,pos_neuron_y,neuron_radius,"black");
		}
		else {	
			plot_circle_stroke(context_network,pos_neuron_two_x,pos_neuron_y,neuron_radius,"black");
		}

		// Draw connections
		plot_connection_neurons(context_network,pos_neuron_one_x,pos_neuron_two_x,pos_neuron_y,neuron_radius,"black");
		}
	else {
		plot_circle_fill(context_network,pos_neuron_one_x,pos_neuron_y,neuron_radius,"green");
		plot_circle_stroke(context_network,pos_neuron_one_x,pos_neuron_y,neuron_radius,"black");
	}
	
	
	// Draw sources
	plot_spike_source(context_network, pos_source_x, pos_source_one_y, source_width, source_height, "Excitatory", "lightblue");
	plot_spike_source(context_network, pos_source_x, pos_source_two_y, source_width, source_height, "Inhibitory", "orange");
	plot_connection_sources(context_network, pos_source_x, pos_source_one_y, source_width, source_height, pos_neuron_one_x, pos_neuron_y , neuron_radius, "black");
	plot_connection_sources(context_network, pos_source_x, pos_source_two_y, source_width, source_height, pos_neuron_one_x, pos_neuron_y , neuron_radius, "black");
}

// Plot the spike source
function plot_spike_source(context, pos_source_x, pos_source_y, source_width, source_height, caption, color){
	context.fillStyle = color;
	context.fillRect(pos_source_x,pos_source_y,source_width,source_height);
	context.lineWidth = 2;
	context.strokeRect(pos_source_x,pos_source_y,source_width,source_height);

	context.fillStyle = "black";
  	context.font = "bold 14px Arial";
  	context.fillText(caption, pos_source_x + source_width/20, pos_source_y+source_height*3/5);
}

// Plot connection between neurons
function plot_connection_neurons(context, pos_neuron_one_x, pos_neuron_two_x, pos_neuron_y , neuron_radius, color) {

	var arrow_length = 7;
	var neuron_one_point = pos_neuron_one_x + neuron_radius;
	var neuron_two_point = pos_neuron_two_x - neuron_radius - 2;

	context.strokeStyle = color;
	context.lineWidth = 2;
	context.beginPath();
	context.moveTo(neuron_one_point, pos_neuron_y);
	context.lineTo(neuron_two_point, pos_neuron_y);
	context.closePath();
	context.stroke();

	context.beginPath();
	context.moveTo(neuron_two_point + 1, pos_neuron_y);
	context.lineTo(neuron_two_point + 1 - arrow_length, pos_neuron_y - arrow_length);
	context.lineTo(neuron_two_point + 1, pos_neuron_y);
	context.lineTo(neuron_two_point + 1 - arrow_length, pos_neuron_y + arrow_length);
	context.lineTo(neuron_two_point + 1, pos_neuron_y);
	context.closePath();
	context.stroke();
}

// Plot connection between sources
function plot_connection_sources(context, pos_source_x, pos_source_y, source_width, source_height, pos_neuron_x, pos_neuron_y , neuron_radius, color) {

	var arrow_length = 7;
	var neuron_one_point = pos_neuron_one_x + neuron_radius;
	var neuron_two_point = pos_neuron_two_x - neuron_radius - 2;

	context.strokeStyle = color;
	context.lineWidth = 2;
	context.beginPath();
	context.moveTo(pos_source_x + source_width, pos_source_y + source_height/2);
	context.lineTo(pos_neuron_x - neuron_radius, pos_neuron_y);
	context.closePath();
	context.stroke();

	// context.beginPath();
	// context.moveTo(neuron_two_point + 1, pos_neuron_y);
	// context.lineTo(neuron_two_point + 1 - arrow_length, pos_neuron_y - arrow_length);
	// context.lineTo(neuron_two_point + 1, pos_neuron_y);
	// context.lineTo(neuron_two_point + 1 - arrow_length, pos_neuron_y + arrow_length);
	// context.lineTo(neuron_two_point + 1, pos_neuron_y);
	// context.closePath();
	// context.stroke();
}

// Plot a filled circle
function plot_circle_fill(context, x , y , radius, color) {
	context.fillStyle = color;
	context.beginPath();
	context.arc(x, y, radius, radius, Math.PI*2, true); 
	context.closePath();
	context.fill();

	context.strokeStyle = "black";
	context.lineWidth = 2;
	context.beginPath();
	context.arc(x, y, radius, radius, Math.PI*2, true); 
	context.closePath();
	context.stroke();
}

// Plot a stroked circle
function plot_circle_stroke(context, x , y , radius, color) {
	context.strokeStyle = color;
	context.lineWidth = 4;
	context.beginPath();
	context.arc(x, y, radius, radius, Math.PI*2, true); 
	context.closePath();
	context.stroke();
}

// Plot axis 
function plot_axis_temp(canvas,context,xmin,xmax,ymin,ymax){

	// Start
	context.beginPath();

	// Plot x
	var nb_ticks_x = 10;
	var inter_space_x = canvas_width/nb_ticks_x;
	for(var i = 0; i < nb_ticks_x -1; i++){
		context.moveTo(inter_space_x*(i+1),canvas_height);
		context.lineTo(inter_space_x*(i+1),canvas_height-10);
	}

	// Plot y
	var nb_ticks_y = 10;
	var inter_space_y = canvas_height/nb_ticks_y;

	for(var i = 0; i < nb_ticks_y -1; i++){
		context.moveTo(0,inter_space_y*(i+1));
		context.lineTo(10,inter_space_y*(i+1));
	}

	// Plot ticks
	context.lineWidth = 2;
	context.strokeStyle = "black";
	context.stroke();
	context.closePath();

	context.beginPath();

	// Plot text
	context.font = "bold 14px Helvetica";
	context.fillStyle = "black";

	// Text x
	for(var i = 0; i < nb_ticks_x -1; i++){
 		context.fillText(xmin+(i+1)*(xmax-xmin)/nb_ticks_x,inter_space_x*(i+1)-4,canvas_height-15);
	}

	// Text y
	for(var i = 0; i < nb_ticks_y -1; i++){
 		context.fillText(ymin+(i+2)*(ymax-ymin)/nb_ticks_y,15,inter_space_y*(i+1)+4);
	}

	context.closePath();

	
}

// Plot axis for histogram plot
function plot_axis_hist(canvas,context,xmin,xmax){

	// Start
	context.beginPath();

	// Plot x
	var nb_ticks_x = 10;
	var inter_space_x = canvas_width/nb_ticks_x;
	for(var i = 0; i < nb_ticks_x -1; i++){
		context.moveTo(inter_space_x*(i+1),canvas_height);
		context.lineTo(inter_space_x*(i+1),canvas_height-10);
	}

	// Plot ticks
	context.lineWidth = 2;
	context.strokeStyle = "black";
	context.stroke();
	context.closePath();

	// Plot text
	context.beginPath();
	context.font = "bold 14px Helvetica";
	context.fillStyle = "black";

	// Text x
	for(var i = 0; i < nb_ticks_x -1; i++){
 		context.fillText(xmin+(i+1)*(xmax-xmin)/nb_ticks_x,inter_space_x*(i+1)-4,canvas_height-15);
	}

	context.closePath();

	
}