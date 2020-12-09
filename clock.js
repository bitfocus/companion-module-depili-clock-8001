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
		mode: '0',
		paused: '0'
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
		},
		pause_color: {
			label: 'Change color from pause',
			description: 'Change the colors of a bank according to the pause state',
			options: [
			{
				type: 'colorpicker',
				label: 'Running: Foreground color',
				id: 'running_fg',
				default: self.rgb(255,255,255)
			},
			{
				type: 'colorpicker',
				label: 'Running: Background color',
				id: 'running_bg',
				default: self.rgb(255,0,0)
			},
			{
				type: 'colorpicker',
				label: 'Paused: Foreground color',
				id: 'paused_fg',
				default: self.rgb(255,255,255)
			},
			{
				type: 'colorpicker',
				label: 'Paused: Background color',
				id: 'paused_bg',
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
		if (self.feedbackstate.state == '0') {
			return {
				color: feedback.options.normal_fg,
				bgcolor: feedback.options.normal_bg
			};
		};
		if (self.feedbackstate.state == '1') {
			return {
				color: feedback.options.countdown_fg,
				bgcolor: feedback.options.countdown_bg
			};
		} else if (self.feedbackstate.state == '2') {
			return {
				color: feedback.options.countup_fg,
				bgcolor: feedback.options.countup_bg
			};
		}
		if (self.feedbackstate.state == '3') {
			return {
				color: feedback.options.off_fg,
				bgcolor: feedback.options.off_bg
			};
		};
	};
	if (feedback.type == 'pause_color') {
		if (self.feedbackstate.paused == '1') {
			return {
				color: feedback.options.paused_fg,
				bgcolor: feedback.options.paused_bg
			};
		} else {
			return {
				color: feedback.options.running_fg,
				bgcolor: feedback.options.running_bg
			};
		}
	};
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
	{
		label: "Pause state",
		name: "paused"
	}
	];
	self.updateState();
	self.setVariableDefinitions(variables);
};

instance.prototype.updateState = function() {
	var self = this;
	var info = self.feedbackstate.time.split(':');
	var states = {
		"0": "NORMAL",
		"1": "COUNTDOWN",
		"2": "COUNTUP",
		"3": "OFF",
		"4": "PAUSED"
	}
	var pause = {
		"0": "Run\\nning",
		"1": "Pau\\nsed"
	}
	if (info[0].length == 0) {
		self.setVariable('time', info[1] + ':' + info[2]);
		self.setVariable('time_hm', '00:' + info[1]);
	} else {
		self.setVariable('time', self.feedbackstate.time);
		self.setVariable('time_hm', info[0] + ':' + info[1]);
	}
	self.setVariable('time_h', info[0]);
	self.setVariable('time_m', info[1]);
	self.setVariable('time_s', info[2]);
	self.setVariable('state', states[self.feedbackstate.state]);
	self.setVariable('tally', self.feedbackstate.tally);
	self.setVariable('paused', pause[self.feedbackstate.paused]);
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
			if (message.args.length >= 5) {
				var a = message.args;
				var mode = a[0].value;
				self.feedbackstate.state = mode;
				self.feedbackstate.time = a[1].value + ":" + a[2].value+ ":" + a[3].value;
				self.feedbackstate.tally = a[4].value;
				self.updateState();
				self.checkFeedbacks('state_color');
			};
			if (message.args.length == 6) {
				self.feedbackstate.paused = message.args[5].value;
				self.checkFeedbacks('pause_color');
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
	if (self.listener) {
		self.listener.close();
	};
	debug("destroy");
};

instance.prototype.actions = function(system) {
	var self = this;
	self.system.emit('instance_actions', self.id, {
		'start_countdown_v4': {
			label: 'Start a countdown timer V4',
			options: [
			{
				type: 'textinput',
				label: 'Timer number',
				id: 'timer',
				default: 1,
				regex: self.REGEX_UNSIGNED_NUMBER
			},
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
		'start_countup_v4': {
			label: 'Start a count up timer V4',
			options: [
			{
				type: 'textinput',
				label: 'Timer number',
				id: 'timer',
				default: 1,
				regex: self.REGEX_UNSIGNED_NUMBER
			},
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
		'timer_modify_v4': {
			label: 'Modify a running timer V4',
			options: [
			{
				type: 'textinput',
				label: 'Timer number',
				id: 'timer',
				default: 1,
				regex: self.REGEX_UNSIGNED_NUMBER
			},
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
		'timer_stop_v4': {
			label: 'Stop a running timer V4',
			options: [
			{
				type: 'textinput',
				label: 'Timer number',
				id: 'timer',
				default: 1,
				regex: self.REGEX_UNSIGNED_NUMBER
			}
			]
		},
		'source_hide_v4': {
			label: 'Hide a time source V4',
			options: [
			{
				type: 'textinput',
				label: 'Source number',
				id: 'source',
				default: 1,
				regex: self.REGEX_UNSIGNED_NUMBER
			}
			]
		},
		'source_show_v4': {
			label: 'Show a time source V4',
			options: [
			{
				type: 'textinput',
				label: 'Source number',
				id: 'source',
				default: 1,
				regex: self.REGEX_UNSIGNED_NUMBER
			}
			]
		},
		'background_v4': {
			label: 'Change background V4',
			options: [
			{
				type: 'textinput',
				label: 'Background number',
				id: 'bg',
				default: 1,
				regex: self.REGEX_UNSIGNED_NUMBER
			}
			]
		},
		'info_v4': {
			label: "Show clock info overlay V4",
			options: [
			{
				type: 'textinput',
				label: 'Duration (seconds)',
				id: 'duration',
				width: 5,
				default: 30,
				regex: self.REGEX_UNSIGNED_INTEGER
			}
			]
		},
		'send_text_v4': {
			label: 'Send text V4',
			options: [
			{
				type: 'textinput',
				label: 'Text',
				id: 'text',
				width: 30,
				default: 'stop'
			},
			{
				type: 'textinput',
				label: 'Duration (seconds)',
				id: 'duration',
				default: 60,
				regex: self.REGEX_UNSIGNED_INTEGER
			},
			{
				type: 'textinput',
				label: 'Red',
				id: 'red',
				default: 255,
				regex: self.REGEX_UNSIGNED_INTEGER
			},
			{
				type: 'textinput',
				label: 'Green',
				id: 'green',
				default: 0,
				regex: self.REGEX_UNSIGNED_INTEGER
			},
			{
				type: 'textinput',
				label: 'Blue',
				id: 'blue',
				default: 0,
				regex: self.REGEX_UNSIGNED_INTEGER
			},
			{
				type: 'textinput',
				label: 'Alpha',
				id: 'alpha',
				default: 255,
				regex: self.REGEX_UNSIGNED_INTEGER
			},
			{
				type: 'textinput',
				label: 'BG Red',
				id: 'bg_red',
				default: 0,
				regex: self.REGEX_UNSIGNED_INTEGER
			},
			{
				type: 'textinput',
				label: 'BG Green',
				id: 'bg_green',
				default: 0,
				regex: self.REGEX_UNSIGNED_INTEGER
			},
			{
				type: 'textinput',
				label: 'BG Blue',
				id: 'bg_blue',
				default: 0,
				regex: self.REGEX_UNSIGNED_INTEGER
			},
			{
				type: 'textinput',
				label: 'BG Alpha',
				id: 'bg_alpha',
				default: 64,
				regex: self.REGEX_UNSIGNED_INTEGER
			},
			]
		},
		'sync_time': {
			label: "Sync clock time with the companion computer",
			options: [

			]
		},
		'normal_mode': {
			label: 'Display current time',
			options: [
			]
		},
		'seconds_off': {
			label: 'Hide seconds number',
			options: [
			]
		},
		'seconds_on': {
			label: 'Show seconds number',
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

instance.prototype.parse_time = function(h, m, s) {
	hours = parseInt(h)
	if (isNaN(hours)) {
		hours = 0
	}
	mins = parseInt(m)
	if (isNaN(mins)) {
		mins = 0
	}
	mins = mins + hours * 60
	secs = parseInt(s)
	if (isNaN(secs)) {
		secs = 0
	}
	secs = secs + mins * 60
	return secs
}

instance.prototype.action = function(action) {
	var self = this;
	if (action.action == "start_countdown_v4") {
		secs = self.parse_time(action.options.hours, action.options.mins, action.options.secs)
		var bol = {
			type: "i",
			value: secs
		};
		self.system.emit('osc_send', self.config.host, self.config.port, "/clock/timer/"+action.options.timer+"/countdown", [ bol ]);
	}
	if (action.action == "start_countup_v4") {
		secs = self.parse_time(action.options.hours, action.options.mins, action.options.secs)
		var bol = {
			type: "i",
			value: secs
		};
		self.system.emit('osc_send', self.config.host, self.config.port, "/clock/timer/"+action.options.timer+"/countup", [ bol ]);
	}
	if (action.action == "timer_modify_v4") {
		secs = self.parse_time(action.options.hours, action.options.mins, action.options.secs)
		var bol = {
			type: "i",
			value: secs
		};
		self.system.emit('osc_send', self.config.host, self.config.port, "/clock/timer/"+action.options.timer+"/modify", [ bol ]);
	}
	if (action.action == "timer_stop_v4") {
		self.system.emit('osc_send', self.config.host, self.config.port, "/clock/timer/"+action.options.timer+"/stop", []);
	}
	if (action.action == "source_hide_v4") {
		self.system.emit('osc_send', self.config.host, self.config.port, "/clock/source/"+action.options.source+"/hide", []);
	}
	if (action.action == "source_show_v4") {
		self.system.emit('osc_send', self.config.host, self.config.port, "/clock/source/"+action.options.source+"/show", []);
	}
	if (action.action == "background_v4") {
		var bol = {
			type: "i",
			value: action.options.bg
		};
		self.system.emit('osc_send', self.config.host, self.config.port, "/clock/background", [ bol ]);
	}
	if (action.action == "info_v4") {
		self.system.emit('osc_send', self.config.host, self.config.port, "/clock/info", [{type: "i", value: action.options.duration}]);
	}
	if (action.action == "send_text_v4") {
		var red = {
			type: "i",
			value: action.options.red
		};
		var green = {
			type: "i",
			value: action.options.green
		};
		var blue = {
			type: "i",
			value: action.options.blue
		};
		var alpha = {
			type: "i",
			value: action.options.alpha
		}
		var bg_red = {
			type: "i",
			value: action.options.bg_red
		};
		var bg_green = {
			type: "i",
			value: action.options.bg_green
		};
		var bg_blue = {
			type: "i",
			value: action.options.bg_blue
		};
		var bg_alpha = {
			type: "i",
			value: action.options.bg_alpha
		}
		var duration = {
			type: "i",
			value: action.options.duration
		}
		var text = {
			type: "s",
			value: "" + action.options.text
		};
		var payload = [
		red, green, blue, alpha,
		bg_red, bg_green, bg_blue, bg_alpha,
		duration, text
		]
		self.system.emit('osc_send', self.config.host, self.config.port, "/clock/text", payload);

	}


	if (action.action == "sync_time") {
		var today = new Date();
		var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
		self.system.emit('osc_send', self.config.host, self.config.port, "/clock/time/set", [{type: "s", value: time}])
	}
	if (action.action == 'kill_display') {
		self.system.emit('osc_send', self.config.host, self.config.port, "/clock/kill", [])
	}
	if (action.action == 'normal_mode') {
		self.system.emit('osc_send', self.config.host, self.config.port, "/clock/normal", [])
	}
	if (action.action == 'seconds_off') {
		self.system.emit('osc_send', self.config.host, self.config.port, "/clock/seconds/off", [])
	}
	if (action.action == 'seconds_on') {
		self.system.emit('osc_send', self.config.host, self.config.port, "/clock/seconds/on", [])
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
		secs = self.parse_time(action.options.hours, action.options.mins, action.options.secs)
		var bol = {
			type: "i",
			value: secs
		};
		self.system.emit('osc_send', self.config.host, self.config.port, "/clock/countdown/start", [ bol ]);
	}
	if (action.action == 'start_countdown2') {
		secs = self.parse_time(action.options.hours, action.options.mins, action.options.secs)
		var bol = {
			type: "i",
			value: secs
		};
		self.system.emit('osc_send', self.config.host, self.config.port, "/clock/countdown2/start", [ bol ]);
	}
	if (action.action == 'modify_countdown') {
		secs = self.parse_time(action.options.hours, action.options.mins, action.options.secs)
		var bol = {
			type: "i",
			value: secs
		};
		self.system.emit('osc_send', self.config.host, self.config.port, "/clock/countdown/modify", [ bol ]);
	}
	if (action.action == 'modify_countdown2') {
		secs = self.parse_time(action.options.hours, action.options.mins, action.options.secs)
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

	var timer_colors = [
	self.rgb(0,0,255),
	self.rgb(0,204,255),
	self.rgb(204,0,255),
	self.rgb(0,255,0),
	self.rgb(0,255,204),
	self.rgb(204,255,0),
	self.rgb(255,0,0),
	self.rgb(255,204,0),
	self.rgb(255,0,204),
	self.rgb(128,128,255)
	]

	for (i=1; i <= timer_colors.length; i++) {
		presets.push({
			category: 'V4 Timer ' + i,
			label: 'Set 5 min countdown',
			bank: {
				style: 'text',
				text: 'Start\\n5 min',
				size: '18',
				color: '16777215',
				bgcolor: timer_colors[i-1]
			},
			actions: [
			{
				action: 'start_countdown_v4',
				options: {
					timer: '' + i,
					secs: '0',
					mins: '5',
					hours: '0'
				}
			}
			]
		});
		presets.push({
			category: 'V4 Timer ' + i,
			label: 'Set 10 min countdown',
			bank: {
				style: 'text',
				text: 'Start\\n10 min',
				size: '18',
				color: '16777215',
				bgcolor: timer_colors[i-1]
			},
			actions: [
			{
				action: 'start_countdown_v4',
				options: {
					timer: ''+i,
					secs: '0',
					mins: '10',
					hours: '0'
				}
			}
			]
		});
		presets.push({
			category: 'V4 Timer ' + i,
			label: 'Set 30 min countdown',
			bank: {
				style: 'text',
				text: 'Start\\n30 min',
				size: '18',
				color: '16777215',
				bgcolor: timer_colors[i-1]
			},
			actions: [
			{
				action: 'start_countdown_v4',
				options: {
					timer: ''+i,
					secs: '0',
					mins: '30',
					hours: '0'
				}
			}
			]
		});
		presets.push({
			category: 'V4 Timer ' + i,
			label: 'Start count up',
			bank: {
				style: 'text',
				text: 'Start\\ncount',
				size: '18',
				color: '16777215',
				bgcolor: timer_colors[i-1]
			},
			actions: [
			{
				action: 'start_countup_v4',
				options: {
					timer: ''+i
				}
			}
			]
		});
		presets.push({
			category: 'V4 Timer ' + i,
			label: 'Stop timer',
			bank: {
				style: 'text',
				text: 'Stop',
				size: '18',
				color: '16777215',
				bgcolor: timer_colors[i-1]
			},
			actions: [
			{
				action: 'timer_stop_v4',
				options: {
					timer: ''+i
				}
			}
			]
		});

		presets.push({
			category: 'V4 Timer ' + i,
			label: 'Add 1 minute',
			bank: {
				style: 'text',
				text: '+1\\nmin',
				size: '18',
				color: '16777215',
				bgcolor: timer_colors[i-1]
			},
			actions: [
			{
				action: 'timer_modify_v4',
				options: {
					timer: ''+i,
					secs: '0',
					mins: '1',
					hours: '0'
				}
			}
			]
		});
		presets.push({
			category: 'V4 Timer ' + i,
			label: 'Remove 1 minute',
			bank: {
				style: 'text',
				text: '-1\\nmin',
				size: '18',
				color: '16777215',
				bgcolor: timer_colors[i-1]
			},
			actions: [
			{
				action: 'timer_modify_v4',
				options: {
					timer: ''+i,
					secs: '0',
					mins: '-1',
					hours: '0'
				}
			}
			]
		});

	}

	for (i = 1; i <4; i++){
		presets.push({
			category: 'V4 Sources',
			label: 'Hide source ' + i,
			bank: {
				style: 'text',
				text: 'Hide\\nSRC ' + i,
				size: '18',
				color: '16777215',
				bgcolor: self.rgb(0,0,255)
			},
			actions: [
			{
				action: 'source_hide_v4',
				options: {
					source: '' + i
				}
			}
			]
		});
		presets.push({
			category: 'V4 Sources',
			label: 'Show source ' + i,
			bank: {
				style: 'text',
				text: 'Show\\nSRC ' + i,
				size: '18',
				color: '16777215',
				bgcolor: self.rgb(0,0,255)
			},
			actions: [
			{
				action: 'source_show_v4',
				options: {
					source: '' + i
				}
			}
			]
		});

	}



	presets.push({
		category: 'V3 Timer control',
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
		category: 'V3 Timer control',
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
		category: 'V3 Timer control',
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
		category: 'V3 Timer control',
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
		category: 'V3 Timer control',
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
		category: 'V3 Timer control',
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
		category: 'V3 Timer 2 control',
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
		category: 'V3 Timer 2 control',
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
		category: 'V3 Timer 2 control',
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
		category: 'V3 Timer 2 control',
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
		category: 'V3 Timer 2 control',
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
		category: 'V3 Timer 2 control',
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
		category: 'V3 Mode',
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
		category: 'V3 Mode',
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
		category: 'V3 Mode',
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
		category: 'V3 Mode',
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
				running_fg: self.rgb(255,128,0),
				running_bg: self.rgb(0,0,0),
				paused_fg: self.rgb(255,255,255),
				paused_bg: self.rgb(0,0,255),
			},
			type: 'pause_color'
		}
		]
	});
	presets.push({
		category: 'V3 Mode',
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
				paused_fg: self.rgb(255,128,0),
				paused_bg: self.rgb(0,0,0),
				running_fg: self.rgb(255,255,255),
				running_bg: self.rgb(0,0,255),
			},
			type: 'pause_color'
		}
		]
	});
	presets.push({
		category: 'V3 Mode',
		label: 'Hide seconds',
		bank: {
			style: 'text',
			text: 'Hide secs',
			size: '18',
			color: self.rgb(255,128,0),
			bgcolor: self.rgb(0,0,0)
		},
		actions: [
		{
			action: 'seconds_off'
		}
		]
	});
	presets.push({
		category: 'V3 Mode',
		label: 'Show seconds',
		bank: {
			style: 'text',
			text: 'Show secs',
			size: '18',
			color: self.rgb(255,128,0),
			bgcolor: self.rgb(0,0,0)
		},
		actions: [
		{
			action: 'seconds_on'
		}
		]
	});

	// Show timer
	presets.push({
		category: 'V3 Display time',
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
		category: 'V3 Display time',
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
		category: 'V3 Display time',
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
		category: 'V3 Display time',
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
		category: 'V3 Display time',
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
	presets.push({
		category: 'V3 Display time',
		label: 'Pause status',
		bank: {
			style: 'text',
			text: '$(label:paused)',
			size: 'auto',
			color: self.rgb(255,255,255),
			bgcolor: 6619136
		},
		actions: [],
		feedbacks: [
		{
			options: {
				running_fg: self.rgb(255,128,0),
				running_bg: self.rgb(0,0,0),
				paused_fg: self.rgb(255,255,255),
				paused_bg: self.rgb(0,0,255),
			},
			type: "pause_color",
		}
		]
	});
	presets.push({
		category: 'Sync',
		label: 'Sync time',
		bank: {
			style: 'text',
			text: 'Sync clock',
			size: 'auto',
			color: self.rgb(255,255,255),
			bgcolor: 6619136
		},
		actions: [
		{
			action: "sync_time"
		}
		],
		feedbacks: []
	});

	self.setPresetDefinitions(presets);
}

instance_skel.extendedBy(instance);
exports = module.exports = instance;
