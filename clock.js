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
	self.init_presets();
};
instance.prototype.init = function() {
	var self = this;

	self.status(self.STATE_OK);

	debug = self.debug;
	log = self.log;
	self.init_osc();
	self.init_variables();
	self.init_presets();
	self.init_feedbacks();
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
					id: 'countdown_fg',
					default: self.rgb(255,255,255)
				},
				{
					type: 'colorpicker',
					label: 'Countdown: Background color',
					id: 'countdown_bg',
					default: self.rgb(255,0,0)
				},
				{
					type: 'colorpicker',
					label: 'Paused countdown: Foreground color',
					id: 'paused_fg',
					default: self.rgb(128,128,128)
				},
				{
					type: 'colorpicker',
					label: 'Paused Countdown: Background color',
					id: 'paused_bg',
					default: self.rgb(128,0,0)
				},
				{
					type: 'colorpicker',
					label: 'Count up: Foreground color',
					id: 'countup_fg',
					default: self.rgb(255,255,255)
				},
				{
					type: 'colorpicker',
					label: 'Count up: Background color',
					id: 'countup_bg',
					default: self.rgb(255,0,0)
				},
				{
					type: 'colorpicker',
					label: 'Off: Foreground color',
					id: 'off_fg',
					default: self.rgb(255,255,255)
				},
				{
					type: 'colorpicker',
					label: 'Off: Background color',
					id: 'off_bg',
					default: self.rgb(0,0,0)
				}
			]
		}
	};
	self.setFeedbackDefinitions(feedbacks);
};

instance.prototype.feedback = function(feedback, bank) {
	var self = this;
	if (feedback.type == 'state_color') {
		if (self.feedbackstate.state == 'NORMAL') {
			return {
				color: feedback.options.normal_fg,
				bgcolor: feedback.options.normal_bg
			};
		}
		if (self.feedbackstate.state == 'COUNTDOWN') {
			return {
				color: feedback.options.countdown_fg,
				bgcolor: feedback.options.countdown_bg
			};
		}
		if (self.feedbackstate.state == 'PAUSED') {
			return {
				color: feedback.options.paused_fg,
				bgcolor: feedback.options.paused_bg
			};
		}
		else if (self.feedbackstate.state == 'COUNTUP') {
			return {
				color: feedback.options.countup_fg,
				bgcolor: feedback.options.countup_bg
			}
		}
		if (self.feedbackstate.state == 'OFF') {
			return {
				color: feedback.options.off_fg,
				bgcolor: feedback.options.off_bg
			};
		}

	}
};

instance.prototype.init_variables = function() {
	var self = this;
	var variables = [
		{
			label: 'State of timer (NORMAL, COUNTUP, COUNTDOWN, PAUSED, OFF)',
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
				var states = {
					"0": "NORMAL",
					"1": "COUNTDOWN",
					"2": "COUNTUP",
					"3": "OFF",
                    "4": "PAUSED"
				}
				var mode = a[0].value;
				self.feedbackstate.state = states[mode];
				self.feedbackstate.time = a[1].value + ":" + a[2].value+ ":" + a[3].value;
				self.feedbackstate.tally = decodeURIComponent(escape(a[4].value));
				self.updateState();
				self.checkFeedbacks('state_color');
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
		'pause_countdown': {
			label: 'Pause countdown(s)',
			options: [
			]
		},
		'resume_countdown': {
			label: 'Resume countdown(s)',
			options: [
			]
		},
		'start_countdown': {
			label: 'Primary countdown: start',
			options: [
				{
					type: 'textinput',
					label: 'Timer (seconds)',
					id: 'secs',
					default: 0,
					regex: self.REGEX_UNSIGNED_NUMBER
				},
				{
					type: 'textinput',
					label: 'Timer (minutes)',
					id: 'mins',
					default: 1,
					regex: self.REGEX_UNSIGNED_NUMBER
				},
				{
					type: 'textinput',
					label: 'Timer (hours)',
					id: 'hours',
					default: 0,
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
					id: 'secs',
					default: 0,
					regex: self.REGEX_SIGNED_NUMBER
				},
				{
					type: 'textinput',
					label: 'Timer (minutes)',
					id: 'mins',
					default: 1,
					regex: self.REGEX_SIGNED_NUMBER
				},
				{
					type: 'textinput',
					label: 'Timer (hours)',
					id: 'hours',
					default: 0,
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
					id: 'secs',
					default: 0,
					regex: self.REGEX_UNSIGNED_NUMBER
				},
				{
					type: 'textinput',
					label: 'Timer (minutes)',
					id: 'mins',
					default: 1,
					regex: self.REGEX_UNSIGNED_NUMBER
				},
				{
					type: 'textinput',
					label: 'Timer (hours)',
					id: 'hours',
					default: 0,
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
					id: 'secs',
					default: 0,
					regex: self.REGEX_SIGNED_NUMBER
				},
				{
					type: 'textinput',
					label: 'Timer (minutes)',
					id: 'mins',
					default: 1,
					regex: self.REGEX_SIGNED_NUMBER
				},
				{
					type: 'textinput',
					label: 'Timer (hours)',
					id: 'hours',
					default: 0,
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
	if (action.action == 'kill_display') {
		self.system.emit('osc_send', self.config.host, self.config.port, "/clock/kill", [])
	}
	if (action.action == 'normal_mode') {
		self.system.emit('osc_send', self.config.host, self.config.port, "/clock/normal", [])
	}
	if (action.action == 'start_countup') {
		self.system.emit('osc_send', self.config.host, self.config.port, "/clock/countup/start", [])
	}
	if (action.action == 'pause_countdown') {
		self.system.emit('osc_send', self.config.host, self.config.port, "/clock/pause", [])
	}
	if (action.action == 'resume_countdown') {
		self.system.emit('osc_send', self.config.host, self.config.port, "/clock/resume", [])
	}
	if (action.action == 'start_countdown') {
		hours = parseInt(action.options.hours)
		mins = parseInt(action.options.mins) + hours * 60
		secs = parseInt(action.options.secs) + mins * 60
		var bol = {
			type: "i",
			value: secs
		};
		self.system.emit('osc_send', self.config.host, self.config.port, "/clock/countdown/start", [ bol ]);
	}
	if (action.action == 'start_countdown2') {
		hours = parseInt(action.options.hours)
		mins = parseInt(action.options.mins) + hours * 60
		secs = parseInt(action.options.secs) + mins * 60
		var bol = {
			type: "i",
			value: secs
		};
		self.system.emit('osc_send', self.config.host, self.config.port, "/clock/countdown2/start", [ bol ]);
	}
	if (action.action == 'modify_countdown') {
		hours = parseInt(action.options.hours)
		mins = parseInt(action.options.mins) + hours * 60
		secs = parseInt(action.options.secs) + mins * 60
		var bol = {
			type: "i",
			value: secs
		};
		self.system.emit('osc_send', self.config.host, self.config.port, "/clock/countdown/modify", [ bol ]);
	}
	if (action.action == 'modify_countdown2') {
		hours = parseInt(action.options.hours)
		mins = parseInt(action.options.mins) + hours * 60
		secs = parseInt(action.options.secs) + mins * 60
		var bol = {
			type: "i",
			value: secs
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
};

instance.prototype.init_presets = function (updates) {
	var self = this;
	var presets = [];
	presets.push({
		category: 'Timer control',
		label: 'Set 5 min',
		bank: {
			style: 'text',
			text: 'Start\\n5 min',
			size: '18',
			color: '16777215',
			bgcolor: self.rgb(0,0,255)
		},
		actions: [
			{
				action: 'start_countdown',
				options: {
					secs: '0',
					mins: '5',
					hours: '0'
				}
			}
		]
	});
	presets.push({
		category: 'Timer control',
		label: 'Set 10 min',
		bank: {
			style: 'text',
			text: 'Start\\n10 min',
			size: '18',
			color: '16777215',
			bgcolor: self.rgb(0,0,255)
		},
		actions: [
			{
				action: 'start_countdown',
				options: {
					secs: '0',
					mins: '10',
					hours: '0'
				}
			}
		]
	});
	presets.push({
		category: 'Timer control',
		label: 'Set 30 min',
		bank: {
			style: 'text',
			text: 'Start\\n30 min',
			size: '18',
			color: '16777215',
			bgcolor: self.rgb(0,0,255)
		},
		actions: [
			{
				action: 'start_countdown',
				options: {
					secs: '0',
					mins: '30',
					hours: '0'
				}
			}
		]
	});
	presets.push({
		category: 'Timer control',
		label: 'Stop',
		bank: {
			style: 'text',
			text: 'Stop',
			size: '18',
			color: '16777215',
			bgcolor: self.rgb(0,0,255)
		},
		actions: [
			{
				action: 'stop_countdown'
			}
		]
	});
	presets.push({
		category: 'Timer control',
		label: 'Add 1min',
		bank: {
			style: 'text',
			text: '+1\\nmin',
			size: '18',
			color: '16777215',
			bgcolor: self.rgb(0,0,255)
		},
		actions: [
			{
				action: 'modify_countdown',
				options: {
					secs: '0',
					mins: '1',
					hours: '0'
				}
			}
		]
	});
	presets.push({
		category: 'Timer control',
		label: 'Remove 1min',
		bank: {
			style: 'text',
			text: '-1\\nmin',
			size: '18',
			color: '16777215',
			bgcolor: self.rgb(0,0,255)
		},
		actions: [
			{
				action: 'modify_countdown',
				options: {
					secs: '0',
					mins: '-1',
					hours: '0'
				}
			}
		]
	});
	presets.push({
		category: 'Timer 2 control',
		label: 'Set 5 min',
		bank: {
			style: 'text',
			text: 'Start\\n5 min',
			size: '18',
			color: '16777215',
			bgcolor:self.rgb(0, 204, 255)
		},
		actions: [
			{
				action: 'start_countdown2',
				options: {
					secs: '0',
					mins: '5',
					hours: '0'
				}
			}
		]
	});
	presets.push({
		category: 'Timer 2 control',
		label: 'Set 10 min',
		bank: {
			style: 'text',
			text: 'Start\\n10 min',
			size: '18',
			color: '16777215',
			bgcolor:self.rgb(0, 204, 255)
		},
		actions: [
			{
				action: 'start_countdown2',
				options: {
					secs: '0',
					mins: '10',
					hours: '0'
				}
			}
		]
	});
	presets.push({
		category: 'Timer 2 control',
		label: 'Set 30 min',
		bank: {
			style: 'text',
			text: 'Start\\n30 min',
			size: '18',
			color: '16777215',
			bgcolor:self.rgb(0, 204, 255)
		},
		actions: [
			{
				action: 'start_countdown2',
				options: {
					secs: '0',
					mins: '30',
					hours: '0'
				}
			}
		]
	});
	presets.push({
		category: 'Timer 2 control',
		label: 'Stop',
		bank: {
			style: 'text',
			text: 'Stop',
			size: '18',
			color: '16777215',
			bgcolor:self.rgb(0, 204, 255)
		},
		actions: [
			{
				action: 'stop_countdown2'
			}
		]
	});
	presets.push({
		category: 'Timer 2 control',
		label: 'Add 1min',
		bank: {
			style: 'text',
			text: '+1\\nmin',
			size: '18',
			color: '16777215',
			bgcolor:self.rgb(0, 204, 255)
		},
		actions: [
			{
				action: 'modify_countdown2',
				options: {
					secs: '0',
					mins: '1',
					hours: '0'
				}
			}
		]
	});
	presets.push({
		category: 'Timer 2 control',
		label: 'Remove 1min',
		bank: {
			style: 'text',
			text: '-1\\nmin',
			size: '18',
			color: '16777215',
			bgcolor:self.rgb(0, 204, 255)
		},
		actions: [
			{
				action: 'modify_countdown2',
				options: {
					secs: '0',
					mins: '-1',
					hours: '0'
				}
			}
		]
	});
	presets.push({
		category: 'Mode',
		label: 'Black',
		bank: {
			style: 'text',
			text: 'Black',
			size: '18',
			color: self.rgb(255,128,0),
			bgcolor: self.rgb(0,0,0)
		},
		actions: [
			{
				action: 'kill_display'
			}
		],
		feedbacks: [
			{
				type: 'state_color',
				options: {
					normal_fg: self.rgb(255,128,0),
					normal_bg: self.rgb(0,0,0),
					countdown_fg: self.rgb(255,128,0),
					countdown_bg: self.rgb(0,0,0),
					countup_fg: self.rgb(255,128,0),
					countup_bg: self.rgb(0,0,0),
					paused_fg: self.rgb(255,128,0),
					paused_bg: self.rgb(0,0,0),
					off_fg: self.rgb(255,255,255),
					off_bg: self.rgb(0,0,255)
				}
			}
		]
	});
	presets.push({
		category: 'Mode',
		label: 'Time of day',
		bank: {
			style: 'text',
			text: 'Time\\nof day',
			size: '18',
			color: self.rgb(255,128,0),
			bgcolor: self.rgb(0,0,0)
		},
		actions: [
			{
				action: 'normal_mode'
			}
		],
		feedbacks: [
			{
				type: 'state_color',
				options: {
					normal_fg: self.rgb(255,255,255),
					normal_bg: self.rgb(0,0,255),
					paused_fg: self.rgb(255,128,0),
					paused_bg: self.rgb(0,0,0),
					countdown_fg: self.rgb(255,128,0),
					countdown_bg: self.rgb(0,0,0),
					countup_fg: self.rgb(255,128,0),
					countup_bg: self.rgb(0,0,0),
					off_fg: self.rgb(255,128,0),
					off_bg: self.rgb(0,0,0)
				}
			}
		]
	});
	presets.push({
		category: 'Mode',
		label: 'Count up',
		bank: {
			style: 'text',
			text: 'Count up',
			size: '18',
			color: self.rgb(255,128,0),
			bgcolor: self.rgb(0,0,0)
		},
		actions: [
			{
				action: 'start_countup'
			}
		],
		feedbacks: [
			{
				options: {
					normal_fg: self.rgb(255,128,0),
					normal_bg: self.rgb(0,0,0),
					paused_fg: self.rgb(255,128,0),
					paused_bg: self.rgb(0,0,0),
					countdown_fg: self.rgb(255,128,0),
					countdown_bg: self.rgb(0,0,0),
					countup_bg: self.rgb(0,0,255),
					countup_fg: self.rgb(255,255,255),
					off_fg: self.rgb(255,128,0),
					off_bg: self.rgb(0,0,0)
				},
				type: 'state_color'
			}
		]
	});
	presets.push({
		category: 'Mode',
		label: 'Pause countdown(s)',
		bank: {
			style: 'text',
			text: 'Pause',
			size: '18',
			color: self.rgb(255,128,0),
			bgcolor: self.rgb(0,0,0)
		},
		actions: [
			{
				action: 'pause_countdown'
			}
		],
		feedbacks: [
			{
				options: {
					normal_fg: self.rgb(255,128,0),
					normal_bg: self.rgb(0,0,0),
					paused_fg: self.rgb(255,255,255),
					paused_bg: self.rgb(0,0,255),
					countdown_fg: self.rgb(255,128,0),
					countdown_bg: self.rgb(0,0,0),
					countup_fg: self.rgb(255,128,0),
					countup_bg: self.rgb(0,0,0),
					off_fg: self.rgb(255,128,0),
					off_bg: self.rgb(0,0,0)
				},
				type: 'state_color'
			}
		]
	});
	presets.push({
		category: 'Mode',
		label: 'Resume countdown(s)',
		bank: {
			style: 'text',
			text: 'Resume',
			size: '18',
			color: self.rgb(255,128,0),
			bgcolor: self.rgb(0,0,0)
		},
		actions: [
			{
				action: 'resume_countdown'
			}
		],
		feedbacks: [
			{
				options: {
					normal_fg: self.rgb(255,128,0),
					normal_bg: self.rgb(0,0,0),
					paused_fg: self.rgb(255,255,255),
					paused_bg: self.rgb(0,0,255),
					countdown_fg: self.rgb(255,128,0),
					countdown_bg: self.rgb(0,0,0),
					countup_fg: self.rgb(255,128,0),
					countup_bg: self.rgb(0,0,0),
					off_fg: self.rgb(255,128,0),
					off_bg: self.rgb(0,0,0)
				},
				type: 'state_color'
			}
		]
	});
	// Show timer
	presets.push({
		category: 'Display time',
		label: 'Hours',
		bank: {
			style: 'text',
			text: '$(label:time_h)',
			size: 'auto',
			color: self.rgb(255,255,255),
			bgcolor: 6619136
		},
		actions: [],
		feedbacks: [
			{
				options: {
					normal_fg: self.rgb(255,255,255),
					normal_bg: 6619136,
					countup_fg: 16777215,
					countup_bg: 7954688,
					countdown_fg: 16777215,
					countdown_bg: 26112,
					paused_fg: 16777215,
					paused_bg: 7954688,
					off_fg: self.rgb(0,0,0),
					off_bg: self.rgb(0,0,0)
				},
				type: "state_color",
			}
		]
	});
	presets.push({
		category: 'Display time',
		label: 'Minutes',
		bank: {
			style: 'text',
			text: '$(label:time_m)',
			size: 'auto',
			color: self.rgb(255,255,255),
			bgcolor: 6619136
		},
		actions: [],
		feedbacks: [
			{
				options: {
					normal_fg: self.rgb(255,255,255),
					normal_bg: 6619136,
					countup_fg: 16777215,
					countup_bg: 7954688,
					countdown_fg: 16777215,
					countdown_bg: 26112,
					paused_fg: 16777215,
					paused_bg: 7954688,
					off_fg: self.rgb(0,0,0),
					off_bg: self.rgb(0,0,0)
				},
				type: "state_color",
			}
		]
	});
	presets.push({
		category: 'Display time',
		label: 'Seconds',
		bank: {
			style: 'text',
			text: '$(label:time_s)',
			size: 'auto',
			color: self.rgb(255,255,255),
			bgcolor: 6619136
		},
		actions: [],
		feedbacks: [
			{
				options: {
					normal_fg: self.rgb(255,255,255),
					normal_bg: 6619136,
					countup_fg: 16777215,
					countup_bg: 7954688,
					countdown_fg: 16777215,
					countdown_bg: 26112,
					paused_fg: 16777215,
					paused_bg: 7954688,
					off_fg: self.rgb(0,0,0),
					off_bg: self.rgb(0,0,0)
				},
				type: "state_color",
			}
		]
	});
	presets.push({
		category: 'Display time',
		label: 'Tally',
		bank: {
			style: 'text',
			text: '$(label:tally)',
			size: 'auto',
			color: self.rgb(255,255,255),
			bgcolor: 6619136
		},
		actions: [],
		feedbacks: [
			{
				options: {
					normal_fg: self.rgb(255,255,255),
					normal_bg: 6619136,
					countup_fg: 16777215,
					countup_bg: 7954688,
					countdown_fg: 16777215,
					countdown_bg: 26112,
					paused_fg: 16777215,
					paused_bg: 7954688,
					off_fg: self.rgb(0,0,0),
					off_bg: self.rgb(0,0,0)
				},
				type: "state_color",
			}
		]
	});
	presets.push({
		category: 'Display time',
		label: 'Clock mode',
		bank: {
			style: 'text',
			text: '$(label:state)',
			size: 'auto',
			color: self.rgb(255,255,255),
			bgcolor: 6619136
		},
		actions: [],
		feedbacks: [
			{
				options: {
					normal_fg: self.rgb(255,255,255),
					normal_bg: 6619136,
					countup_fg: 16777215,
					countup_bg: 7954688,
					countdown_fg: 16777215,
					countdown_bg: 26112,
					paused_fg: 16777215,
					paused_bg: 7954688,
					off_fg: self.rgb(64,64,64),
					off_bg: self.rgb(0,0,0)
				},
				type: "state_color",
			}
		]
	});
	self.setPresetDefinitions(presets);
}

instance_skel.extendedBy(instance);
exports = module.exports = instance;
