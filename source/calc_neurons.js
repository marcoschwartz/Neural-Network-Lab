// Create spikes source
spikeSource = function(source_id,target_neuron,source_action){
	this.source_id = source_id;
	this.target_neuron = target_neuron;
	this.source_action = source_action;

	this.parameters = {
		"source_status" : 0,
		"source_type" : 0,
		"source_freq" : 100
	};

	this.spikes = [];
}

// Create neuron
neuron = function(number,targets) {
	this.number = number;
	this.membrane = -70;
	this.parameters = {
		"v_rest" : -70,
		"v_reset" : -70,
		"v_peak" : -40,
		"tau_m" : 20,
		"stimulus" : 0,
		"d_T" : 2,
		"v_th" : 0,
		"e_syn_x" : -20,
		"tau_syn_x" : 10,
		"e_syn_i" : -80,
		"tau_syn_i" : 10,
		"a" : 0,
		"tau_w" : 10,
		"b" : 0,
		"tau_ref" : 0
	};
	this.w = 0;
	this.gsynx = 0;
	this.gsyni = 0;
	this.ref_counter = 0;
	this.targets = targets;

	this.spikes = [];
	this.spike_in = false;
	this.spike_out = false;
	this.membrane_array = [];

	this.resetNeuron = function() {
		this.membrane = -70;
		this.w = 0;
		this.gsynx = 0;
		this.gsyni = 0;
		this.ref_counter = 0;

		this.spikes = [];
		this.spike_in = false;
		this.spike_out = false;
		this.membrane_array = [];
	}
}

// Generate spikes input from a given source
function genSpikeInput(width, dt, source){
	
	spikes_list = [];

	// Get source parameters
	spike_frequency = source.parameters["source_freq"];
	status = source.parameters["source_status"];
	type = source.parameters["source_type"];

	if (source.parameters["source_freq"] != 0 && source.parameters["source_status"] == 1){
		if(type == 0){
			for(var i = 0; i < width; i = i + spike_frequency){
				spikes_list.push(i);
			}
		}

		if(type == 1){
			var i = 0;
			while(i < width){
				next_number = Math.floor(genPoissonNumber(spike_frequency) * 1000);
				i = i + next_number;
				spikes_list.push(i);
			}
		}
	}
	return spikes_list;
}

// Generate a Poisson number given the Poisson rates
function genPoissonNumber(rate){
    return -Math.log(1.0 - Math.random()) / rate;
}

// Calculate the next state of a neuron
function calc_neuron(neuron,t,dt,spikes_input_exc,spikes_input_inh){

	// Update gsyn
	if (spikes_input_exc.indexOf(t) > -1){
		neuron.gsynx = neuron.gsynx + 1;
	}

	if (neuron.spike_in == true){
		neuron.gsynx = neuron.gsynx + 1;
		neuron.spike_in = false;
	}
	neuron.gsynx = neuron.gsynx - neuron.gsynx * dt / neuron.parameters.tau_syn_x;

	if (spikes_input_inh.indexOf(t) > -1){
		neuron.gsyni = neuron.gsyni + 1;
	}
	neuron.gsyni = neuron.gsyni - neuron.gsyni * dt / neuron.parameters.tau_syn_i;
		
	// Update membrane
	if (neuron.ref_counter == 0){
		neuron.membrane = neuron.membrane + (neuron.parameters.stimulus - neuron.w - neuron.gsyni * (neuron.membrane - neuron.parameters.e_syn_i) - neuron.gsynx * (neuron.membrane - neuron.parameters.e_syn_x) + neuron.parameters.d_T*Math.exp((neuron.membrane - neuron.parameters.v_th)/neuron.parameters.d_T) - (neuron.membrane - neuron.parameters.v_rest))/neuron.parameters.tau_m*dt;
	}
	else{
		neuron.ref_counter = neuron.ref_counter - 1;
		neuron.membrane = neuron.membrane;
	}
		
		// Update w
		neuron.w = neuron.w + ((neuron.membrane - neuron.parameters.v_rest)*neuron.parameters.a - neuron.w)*dt/neuron.parameters.tau_w;
		if (neuron.membrane > neuron.parameters.v_peak)
		{
			neuron.ref_counter = neuron.parameters.tau_ref/dt;
			neuron.membrane = neuron.parameters.v_reset;
			neuron.w = neuron.w + neuron.parameters.b;
			neuron.spikes.push(t);
			neuron.spike_out = true;
		}

		neuron.membrane_array.push(neuron.membrane);

}