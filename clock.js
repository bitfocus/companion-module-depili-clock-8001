var instance_skel = require('../../instance_skel');
var debug;
var log;

function instance(system, id, config) {
	var self = this;

	// super-constructor
	instance_skel.apply(this, arguments);

	self.actions(); // export actions

	// Example: When this script was committed, a fix needed to be made
	// this will only be run if you had an instance of an older "version" before.
	// "version" is calculated out from how many upgradescripts your intance config has run.
	// So just add a addUpgradeScript when you commit a breaking change to the config, that fixes
	// the config.

	self.addUpgradeScript(function () {
		// just an example
		if (self.config.host !== undefined) {
			self.config.old_host = self.config.host;
		}
	});

	return self;
}

instance.prototype.updateConfig = function(config) {
	var self = this;

	self.config = config;
};
instance.prototype.init = function() {
	var self = this;

	self.status(self.STATE_OK);

	debug = self.debug;
	log = self.log;
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
