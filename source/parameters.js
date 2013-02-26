// Define parameters list and min, max and default values
var parameters = ["v_rest","v_reset","v_peak","tau_m","d_T","v_th","e_syn_x","tau_syn_x","e_syn_i","tau_syn_i","a","tau_w","b","tau_ref","stimulus"];
var parameters_value = ["-70","-70","-40","20","2","0","-20","10","-80","10","0","10","0","0","0"];
var parameters_min = ["-80","-80","-60","1","1","-70","-100","5","-100","5","0","1","0","0","0"];
var parameters_max = ["-40","-40","0","40","5","0","20","50","20","50","10","100","100","30","100"];
var source_parameters = ["source_status","source_type","source_freq"];

// Parameters for Integrate & Fire neuron
parameters_if = {
		"v_rest" : -70,
		"v_reset" : -70,
		"v_peak" : -50,
		"tau_m" : 20,
		"stimulus" : 25,
		"d_T" : 2,
		"v_th" : 0,
		"e_syn_x" : -20,
		"tau_syn_x" : 10,
		"e_syn_i" : -80,
		"tau_syn_i" : 10,
		"a" : 0,
		"tau_w" : 10,
		"b" : 0
	};

// Parameters for Exponential Integrate & Fire neuron
parameters_ex = {
		"v_rest" : -70,
		"v_reset" : -70,
		"v_peak" : -10,
		"tau_m" : 20,
		"stimulus" : 10,
		"d_T" : 2,
		"v_th" : -60,
		"e_syn_x" : -20,
		"tau_syn_x" : 10,
		"e_syn_i" : -80,
		"tau_syn_i" : 10,
		"a" : 0,
		"tau_w" : 10,
		"b" : 0
	};

// Parameters for Integrate & Fire neuron receiving Poisson stimulus
parameters_poisson = {
		"v_rest" : -70,
		"v_reset" : -70,
		"v_peak" : -50,
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
		"b" : 0
	};