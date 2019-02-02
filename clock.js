var instance_skel = require('../../instance_skel');
var debug;
var log;
var OSC     = require('osc')


function instance(system, id, config) {
	var self = this;

	// super-constructor
	instance_skel.apply(this, arguments);

	self.actions(); // export actions

	self.feedbackstate = {
		time: '00:00:00',
		tally: '',
		mode: 'NORMAL'
	};
	return self;
}

instance.prototype.updateConfig = function(config) {
	var self = this;

	self.config = config;
	self.init_osc();
};
instance.prototype.init = function() {
	var self = this;

	self.status(self.STATE_OK);

	debug = self.debug;
	log = self.log;
	self.init_osc();
	self.init_variables();
};

instance.prototype.init_feedbacks = function() {
	var self = this;

	var feedbacks = {
		state_color: {
			label: 'Change color from state',
			description: 'Change the colors of a bank according to the timer state',
			options: [
				{
					type: 'colorpicker',
					label: 'Normal: Foreground color',
					id: 'normal_fg',
					default: self.rgb(255,255,255)
				},
				{
					type: 'colorpicker',
					label: 'Normal: Background color',
					id: 'normal_bg',
					default: self.rgb(255,0,0)
				},
				{
					type: 'colorpicker',
					label: 'Countdown: Foreground color',
					id: 'ct_fg',
					default: self.rgb(255,255,255)
				},
				{
					type: 'colorpicker',
					label: 'Countdown: Background color',
					id: 'ct_bg',
					default: self.rgb(255,0,0)
				},
				{
					type: 'colorpicker',
					label: 'Countup: Foreground color',
					id: 'cu_fg',
					default: self.rgb(255,255,255)
				},
				{
					type: 'colorpicker',
					label: 'Countdown: Background color',
					id: 'cu_bg',
					default: self.rgb(255,0,0)
				}
			]
		}
	};

	self.setFeedbackDefinitions(feedbacks);
};

instance.prototype.init_variables = function() {
	var self = this;

	var variables = [
		{
			label: 'State of timer (NORMAL, COUNTUP, COUNTDOWN, OFF)',
			name: 'state'
		},
		{
			label: 'Current time of timer (hh:mm:ss)',
			name: 'time'
		},
		{
			label: 'Current time of timer (hh:mm)',
			name: 'time_hm'
		},
		{
			label: 'Current time of timer (hours)',
			name: 'time_h'
		},
		{
			label: 'Current time of timer (minutes)',
			name: 'time_m'
		},
		{
			label: 'Current time of timer (seconds)',
			name: 'time_s'
		},
		{
			label: 'Current tally text',
			name: 'tally'
		},
	];

	self.updateState();
	self.setVariableDefinitions(variables);
};

instance.prototype.updateState = function() {
	var self = this;
	var info = self.feedbackstate.time.split(':');

	self.setVariable('time', self.feedbackstate.time);
	self.setVariable('time_hm', info[0] + ':' + info[1]);
	self.setVariable('time_h', info[0]);
	self.setVariable('time_m', info[1]);
	self.setVariable('time_s', info[2]);

	self.setVariable('state', self.feedbackstate.state);
	self.setVariable('tally', self.feedbackstate.tally);
};

instance.prototype.init_osc = function() {
	var self = this;

	if (self.listener) {
		self.listener.close();
	};

	self.listener = new OSC.UDPPort({
		localAddress: "0.0.0.0",
		localPort: self.config.localport,
		metadata: true
	});

	self.listener.open();

	self.listener.on("ready", function () {
		self.ready = true;
	});

	self.listener.on("message", function (message) {
		if (message.address.match(/^\/clock\/state/)) {
			if (message.args.length == 5) {
				var a = message.args;
				var mode = a[0].value;
				if (mode == "0") {
					self.feedbackstate.state = "NORMAL";
				};
				if (mode == "1") {
					self.feedbackstate.state = "COUNTDOWN";
				};
				if (mode == "2") {
					self.feedbackstate.state = "COUNTUP";
				};
				if (mode == "3") {
					self.feedbackstate.state = "OFF";
				};
				self.feedbackstate.time = a[1].value + ":" + a[2].value+ ":" + a[3].value;
				self.feedbackstate.tally = a[4].value;
				self.updateState();
			};
		};
	});
};

// Return config fields for web config
instance.prototype.config_fields = function () {
	var self = this;
	return [
		{
			type: 'textinput',
			id: 'host',
			label: 'Clock IP address (you can also use broadcast)',
			width: 8,
			regex: self.REGEX_IP
		},
		{
			type: 'textinput',
			id: 'port',
			label: 'Target Port',
			width: 4,
			regex: self.REGEX_PORT,
		default: 1245
		},
		{
			type: 'textinput',
			id: 'localport',
			label: 'Local Port',
			width: 4,
			regex: self.REGEX_PORT,
		default: 1245
		}
	]
};

// When module gets deleted
instance.prototype.destroy = function() {
	var self = this;
	debug("destroy");
};

instance.prototype.actions = function(system) {
	var self = this;
	self.system.emit('instance_actions', self.id, {
		'normal_mode': {
			label: 'Display current time',
			options: [
			]
		},
		'kill_display': {
			label: 'Display off',
			options: [
			]
		},
		'start_countup': {
			label: 'Start counting up',
			options: [
			]
		},
		'start_countdown': {
			label: 'Primary countdown: start',
			options: [
				{
					 type: 'textinput',
					 label: 'Timer (seconds)',
					 id: 'int',
					 default: 60,
					 regex: self.REGEX_UNSIGNED_NUMBER
				}
			]
		},
		'modify_countdown': {
			label: 'Primary countdown: modify',
			options: [
				{
					 type: 'textinput',
					 label: 'Timer (seconds)',
					 id: 'int',
					 default: 60,
					 regex: self.REGEX_SIGNED_NUMBER
				}
			]
		},
		'stop_countdown': {
			label: 'Primary countdown: stop',
			options: [
			]
		},
		'start_countdown2': {
			label: 'Secondary countdown: start',
			options: [
				{
					 type: 'textinput',
					 label: 'Timer (seconds)',
					 id: 'int',
					 default: 60,
					 regex: self.REGEX_UNSIGNED_NUMBER
				}
			]
		},
		'modify_countdown2': {
			label: 'Secondary countdown: modify',
			options: [
				{
					 type: 'textinput',
					 label: 'Timer (seconds)',
					 id: 'int',
					 default: 60,
					 regex: self.REGEX_SIGNED_NUMBER
				}
			]
		},
		'stop_countdown2': {
			label: 'Secondary countdown: stop',
			options: [
			]
		},
		'send_text': {
			label: 'Send text',
			options: [
				{
					type: 'textinput',
					label: 'Text',
					id: 'text',
					width: 4,
					default: 'stop'
				},
				{
					 type: 'textinput',
					 label: 'Red',
					 id: 'red',
					 default: 255,
					 regex: self.REGEX_UNSIGNED_FLOAT
				},
				{
					 type: 'textinput',
					 label: 'Green',
					 id: 'green',
					 default: 0,
					 regex: self.REGEX_UNSIGNED_FLOAT
				},
				{
					 type: 'textinput',
					 label: 'Blue',
					 id: 'blue',
					 default: 0,
					 regex: self.REGEX_UNSIGNED_FLOAT
				}
			]
		},
	});
}

instance.prototype.action = function(action) {
	var self = this;

	debug('action: ', action);

	if (action.action == 'send_blank') {
		debug('sending',self.config.host, self.config.port, action.options.path);
		self.system.emit('osc_send', self.config.host, self.config.port, action.options.path, [])
	}

	if (action.action == 'kill_display') {
		self.system.emit('osc_send', self.config.host, self.config.port, "/clock/kill", [])
	}

	if (action.action == 'normal_mode') {
		self.system.emit('osc_send', self.config.host, self.config.port, "/clock/normal", [])
	}

	if (action.action == 'start_countup') {
		self.system.emit('osc_send', self.config.host, self.config.port, "/clock/countup/start", [])
	}

	if (action.action == 'start_countdown') {
		var bol = {
				type: "i",
				value: parseInt(action.options.int)
		};
		self.system.emit('osc_send', self.config.host, self.config.port, "/clock/countdown/start", [ bol ]);
	}

	if (action.action == 'start_countdown2') {
		var bol = {
				type: "i",
				value: parseInt(action.options.int)
		};
		self.system.emit('osc_send', self.config.host, self.config.port, "/clock/countdown2/start", [ bol ]);
	}

	if (action.action == 'modify_countdown') {
		var bol = {
				type: "i",
				value: parseInt(action.options.int)
		};
		self.system.emit('osc_send', self.config.host, self.config.port, "/clock/countdown/modify", [ bol ]);
	}


	if (action.action == 'modify_countdown2') {
		var bol = {
				type: "i",
				value: parseInt(action.options.int)
		};
		self.system.emit('osc_send', self.config.host, self.config.port, "/clock/countdown2/modify", [ bol ]);
	}

	if (action.action == 'stop_countdown') {
		self.system.emit('osc_send', self.config.host, self.config.port, "/clock/countdown/stop", [])
	}

	if (action.action == 'stop_countdown2') {
		self.system.emit('osc_send', self.config.host, self.config.port, "/clock/countdown2/stop", [])
	}


	if (action.action == 'send_text') {
		var red = {
				type: "f",
				value: parseFloat(action.options.red)
		};
		var green = {
				type: "f",
				value: parseFloat(action.options.green)
		};
		var blue = {
				type: "f",
				value: parseFloat(action.options.blue)
		};
		var text = {
				type: "s",
				value: "" + action.options.text
		};

		self.system.emit('osc_send', self.config.host, self.config.port, "/clock/display", [ red,green,blue,text ]);
	}


	if (action.action == 'send_int') {
		var bol = {
				type: "i",
				value: parseInt(action.options.int)
		};
		self.system.emit('osc_send', self.config.host, self.config.port, action.options.path, [ bol ]);
	}

	if (action.action == 'send_float') {
		var bol = {
				type: "f",
				value: parseFloat(action.options.float)
		};
		self.system.emit('osc_send', self.config.host, self.config.port, action.options.path, [ bol ]);
	}

	if (action.action == 'send_string') {
		var bol = {
				type: "s",
				value: "" + action.options.string
		};
		self.system.emit('osc_send', self.config.host, self.config.port, action.options.path, [ bol ]);
	}

};

instance_skel.extendedBy(instance);
exports = module.exports = instance;
