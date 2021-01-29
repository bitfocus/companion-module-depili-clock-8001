var instance_skel = require('../../instance_skel');
var OSC     = require('osc');
var actions = require('./actions');
var presets = require('./presets');
var debug;
var log;

class instance extends instance_skel {
	constructor(system,id,config) {
		super(system,id,config)

		Object.assign(this, {...actions})
		Object.assign(this, {...presets})

		this.feedbackstate = {
			time: '00:00:00',
			tally: '',
			mode: '0',
			paused: '0'
		};

		this.actions();
	}

	// Return config fields for web config
	config_fields = function () {
		return [
		{
			type: 'dropdown',
			id: 'version',
			label: 'Clock protocol version',
			choices: [{id: '4', label: "Version 4"}, {id: '3', label: "Version 3"}, {id: 'mixed', label: "Versions 3 & 4, not recommended"}]
		},
		{
			type: 'textinput',
			id: 'host',
			label: 'Clock IP address (you can also use broadcast)',
			width: 8,
			regex: this.REGEX_IP
		},
		{
			type: 'textinput',
			id: 'port',
			label: 'Target Port',
			width: 4,
			regex: this.REGEX_PORT,
			default: 1245
		},
		{
			type: 'textinput',
			id: 'localport',
			label: 'Local Port',
			width: 4,
			regex: this.REGEX_PORT,
			default: 1245
		}
		]
	};


	updateConfig = function(config) {
		this.config = config;
		this.init_osc();
		this.actions();
		this.init_presets();
	};


	init = function() {
		debug = this.debug;
		log = this.log;
		this.init_osc();
		this.init_variables();
		this.init_presets();
		this.init_feedbacks();
		this.status(this.STATE_OK);
	};

	init_feedbacks = function() {
		var feedbacks = {
			state_color: {
				label: 'Change color from state',
				description: 'Change the colors of a bank according to the timer state',
				options: [
				{
					type: 'colorpicker',
					label: 'Normal: Foreground color',
					id: 'normal_fg',
					default: this.rgb(255,255,255)
				},
				{
					type: 'colorpicker',
					label: 'Normal: Background color',
					id: 'normal_bg',
					default: this.rgb(255,0,0)
				},
				{
					type: 'colorpicker',
					label: 'Countdown: Foreground color',
					id: 'countdown_fg',
					default: this.rgb(255,255,255)
				},
				{
					type: 'colorpicker',
					label: 'Countdown: Background color',
					id: 'countdown_bg',
					default: this.rgb(255,0,0)
				},
				{
					type: 'colorpicker',
					label: 'Paused countdown: Foreground color',
					id: 'paused_fg',
					default: this.rgb(128,128,128)
				},
				{
					type: 'colorpicker',
					label: 'Paused Countdown: Background color',
					id: 'paused_bg',
					default: this.rgb(128,0,0)
				},
				{
					type: 'colorpicker',
					label: 'Count up: Foreground color',
					id: 'countup_fg',
					default: this.rgb(255,255,255)
				},
				{
					type: 'colorpicker',
					label: 'Count up: Background color',
					id: 'countup_bg',
					default: this.rgb(255,0,0)
				},
				{
					type: 'colorpicker',
					label: 'Off: Foreground color',
					id: 'off_fg',
					default: this.rgb(255,255,255)
				},
				{
					type: 'colorpicker',
					label: 'Off: Background color',
					id: 'off_bg',
					default: this.rgb(0,0,0)
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
					default: this.rgb(255,255,255)
				},
				{
					type: 'colorpicker',
					label: 'Running: Background color',
					id: 'running_bg',
					default: this.rgb(255,0,0)
				},
				{
					type: 'colorpicker',
					label: 'Paused: Foreground color',
					id: 'paused_fg',
					default: this.rgb(255,255,255)
				},
				{
					type: 'colorpicker',
					label: 'Paused: Background color',
					id: 'paused_bg',
					default: this.rgb(0,0,0)
				}
				]
			}
		};
		this.setFeedbackDefinitions(feedbacks);
	};

	feedback = function(feedback, bank) {
		if (feedback.type == 'state_color') {
			if (this.feedbackstate.state == '0') {
				return {
					color: feedback.options.normal_fg,
					bgcolor: feedback.options.normal_bg
				};
			};
			if (this.feedbackstate.state == '1') {
				return {
					color: feedback.options.countdown_fg,
					bgcolor: feedback.options.countdown_bg
				};
			} else if (this.feedbackstate.state == '2') {
				return {
					color: feedback.options.countup_fg,
					bgcolor: feedback.options.countup_bg
				};
			}
			if (this.feedbackstate.state == '3') {
				return {
					color: feedback.options.off_fg,
					bgcolor: feedback.options.off_bg
				};
			};
		};
		if (feedback.type == 'pause_color') {
			if (this.feedbackstate.paused == '1') {
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

	init_variables = function() {
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
		this.updateState();
		this.setVariableDefinitions(variables);
	};

	updateState = function() {
		var info = this.feedbackstate.time.split(':');
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
			this.setVariable('time', info[1] + ':' + info[2]);
			this.setVariable('time_hm', '00:' + info[1]);
		} else {
			this.setVariable('time', this.feedbackstate.time);
			this.setVariable('time_hm', info[0] + ':' + info[1]);
		}
		this.setVariable('time_h', info[0]);
		this.setVariable('time_m', info[1]);
		this.setVariable('time_s', info[2]);
		this.setVariable('state', states[this.feedbackstate.state]);
		this.setVariable('tally', this.feedbackstate.tally);
		this.setVariable('paused', pause[this.feedbackstate.paused]);
	};

	init_osc = function() {
		if (this.listener) {
			this.listener.close();
		};
		this.listener = new OSC.UDPPort({
			localAddress: "0.0.0.0",
			localPort: this.config.localport,
			metadata: true
		});
		this.listener.open();
		this.listener.on("ready", function () {
			this.ready = true;
		});
		this.listener.on("message", function (message) {
			if (message.address.match(/^\/clock\/state/)) {
				if (message.args.length >= 5) {
					var a = message.args;
					var mode = a[0].value;
					this.feedbackstate.state = mode;
					this.feedbackstate.time = a[1].value + ":" + a[2].value+ ":" + a[3].value;
					this.feedbackstate.tally = a[4].value;
					this.updateState();
					this.checkFeedbacks('state_color');
				};
				if (message.args.length == 6) {
					this.feedbackstate.paused = message.args[5].value;
					this.checkFeedbacks('pause_color');
				};
			};
		});
	};


	// When module gets deleted
	destroy = function() {
		if (this.listener) {
			this.listener.close();
		};
		debug("destroy");
	};

	actions = function(system) {
		this.setActions(this.getActions());
	};

	parse_time = function(h, m, s) {
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
	};

	action = function(action) {
		if (action.action == "start_countdown_v4") {
			secs = this.parse_time(action.options.hours, action.options.mins, action.options.secs)
			var bol = {
				type: "i",
				value: secs
			};
			this.system.emit('osc_send', this.config.host, this.config.port, "/clock/timer/"+action.options.timer+"/countdown", [ bol ]);
		}
		if (action.action == "start_countup_v4") {
			secs = this.parse_time(action.options.hours, action.options.mins, action.options.secs)
			var bol = {
				type: "i",
				value: secs
			};
			this.system.emit('osc_send', this.config.host, this.config.port, "/clock/timer/"+action.options.timer+"/countup", [ bol ]);
		}
		if (action.action == "timer_modify_v4") {
			secs = this.parse_time(action.options.hours, action.options.mins, action.options.secs)
			var bol = {
				type: "i",
				value: secs
			};
			this.system.emit('osc_send', this.config.host, this.config.port, "/clock/timer/"+action.options.timer+"/modify", [ bol ]);
		}
		if (action.action == "timer_stop_v4") {
			this.system.emit('osc_send', this.config.host, this.config.port, "/clock/timer/"+action.options.timer+"/stop", []);
		}
		if (action.action == "source_hide_v4") {
			this.system.emit('osc_send', this.config.host, this.config.port, "/clock/source/"+action.options.source+"/hide", []);
		}
		if (action.action == "source_show_v4") {
			this.system.emit('osc_send', this.config.host, this.config.port, "/clock/source/"+action.options.source+"/show", []);
		}
		if (action.action == "background_v4") {
			var bol = {
				type: "i",
				value: action.options.bg
			};
			this.system.emit('osc_send', this.config.host, this.config.port, "/clock/background", [ bol ]);
		}
		if (action.action == "info_v4") {
			this.system.emit('osc_send', this.config.host, this.config.port, "/clock/info", [{type: "i", value: action.options.duration}]);
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
			this.system.emit('osc_send', this.config.host, this.config.port, "/clock/text", payload);

		}


		if (action.action == "sync_time") {
			var today = new Date();
			var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
			this.system.emit('osc_send', this.config.host, this.config.port, "/clock/time/set", [{type: "s", value: time}])
		}
		if (action.action == 'kill_display') {
			this.system.emit('osc_send', this.config.host, this.config.port, "/clock/kill", [])
		}
		if (action.action == 'normal_mode') {
			this.system.emit('osc_send', this.config.host, this.config.port, "/clock/normal", [])
		}
		if (action.action == 'seconds_off') {
			this.system.emit('osc_send', this.config.host, this.config.port, "/clock/seconds/off", [])
		}
		if (action.action == 'seconds_on') {
			this.system.emit('osc_send', this.config.host, this.config.port, "/clock/seconds/on", [])
		}
		if (action.action == 'start_countup') {
			this.system.emit('osc_send', this.config.host, this.config.port, "/clock/countup/start", [])
		}
		if (action.action == 'pause_countdown') {
			this.system.emit('osc_send', this.config.host, this.config.port, "/clock/pause", [])
		}
		if (action.action == 'resume_countdown') {
			this.system.emit('osc_send', this.config.host, this.config.port, "/clock/resume", [])
		}
		if (action.action == 'start_countdown') {
			secs = this.parse_time(action.options.hours, action.options.mins, action.options.secs)
			var bol = {
				type: "i",
				value: secs
			};
			this.system.emit('osc_send', this.config.host, this.config.port, "/clock/countdown/start", [ bol ]);
		}
		if (action.action == 'start_countdown2') {
			secs = this.parse_time(action.options.hours, action.options.mins, action.options.secs)
			var bol = {
				type: "i",
				value: secs
			};
			this.system.emit('osc_send', this.config.host, this.config.port, "/clock/countdown2/start", [ bol ]);
		}
		if (action.action == 'modify_countdown') {
			secs = this.parse_time(action.options.hours, action.options.mins, action.options.secs)
			var bol = {
				type: "i",
				value: secs
			};
			this.system.emit('osc_send', this.config.host, this.config.port, "/clock/countdown/modify", [ bol ]);
		}
		if (action.action == 'modify_countdown2') {
			secs = this.parse_time(action.options.hours, action.options.mins, action.options.secs)
			var bol = {
				type: "i",
				value: secs
			};
			this.system.emit('osc_send', this.config.host, this.config.port, "/clock/countdown2/modify", [ bol ]);
		}
		if (action.action == 'stop_countdown') {
			this.system.emit('osc_send', this.config.host, this.config.port, "/clock/countdown/stop", [])
		}
		if (action.action == 'stop_countdown2') {
			this.system.emit('osc_send', this.config.host, this.config.port, "/clock/countdown2/stop", [])
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
			this.system.emit('osc_send', this.config.host, this.config.port, "/clock/display", [ red,green,blue,text ]);
		}
	};

	init_presets = function (updates) {

		this.setPresetDefinitions(this.getPresets());
	};
};

exports = module.exports = instance;