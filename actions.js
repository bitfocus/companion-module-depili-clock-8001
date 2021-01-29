exports.getActions  = function() {
	let actions = [];
	actions.length = 0;


	if (this.config.version == "4" || this.config.version == "mixed") {
		// V4 only actions
		actions['start_countdown_v4'] = {
			label: 'Start a countdown timer V4',
			options: [
			{
				type: 'textinput',
				label: 'Timer number',
				id: 'timer',
				default: 1,
				regex: this.REGEX_UNSIGNED_NUMBER
			},
			{
				type: 'textinput',
				label: 'Timer (seconds)',
				id: 'secs',
				default: 0,
				regex: this.REGEX_UNSIGNED_NUMBER
			},
			{
				type: 'textinput',
				label: 'Timer (minutes)',
				id: 'mins',
				default: 1,
				regex: this.REGEX_UNSIGNED_NUMBER
			},
			{
				type: 'textinput',
				label: 'Timer (hours)',
				id: 'hours',
				default: 0,
				regex: this.REGEX_UNSIGNED_NUMBER
			}
			]
		};
		actions['start_countup_v4'] = {
			label: 'Start a count up timer V4',
			options: [
			{
				type: 'textinput',
				label: 'Timer number',
				id: 'timer',
				default: 1,
				regex: this.REGEX_UNSIGNED_NUMBER
			},
			{
				type: 'textinput',
				label: 'Timer (seconds)',
				id: 'secs',
				default: 0,
				regex: this.REGEX_UNSIGNED_NUMBER
			},
			{
				type: 'textinput',
				label: 'Timer (minutes)',
				id: 'mins',
				default: 1,
				regex: this.REGEX_UNSIGNED_NUMBER
			},
			{
				type: 'textinput',
				label: 'Timer (hours)',
				id: 'hours',
				default: 0,
				regex: this.REGEX_UNSIGNED_NUMBER
			}
			]
		};
		actions['timer_modify_v4'] = {
			label: 'Modify a running timer V4',
			options: [
			{
				type: 'textinput',
				label: 'Timer number',
				id: 'timer',
				default: 1,
				regex: this.REGEX_UNSIGNED_NUMBER
			},
			{
				type: 'textinput',
				label: 'Timer (seconds)',
				id: 'secs',
				default: 0,
				regex: this.REGEX_SIGNED_NUMBER
			},
			{
				type: 'textinput',
				label: 'Timer (minutes)',
				id: 'mins',
				default: 1,
				regex: this.REGEX_SIGNED_NUMBER
			},
			{
				type: 'textinput',
				label: 'Timer (hours)',
				id: 'hours',
				default: 0,
				regex: this.REGEX_SIGNED_NUMBER
			}
			]
		};
		actions['timer_stop_v4'] = {
			label: 'Stop a running timer V4',
			options: [
			{
				type: 'textinput',
				label: 'Timer number',
				id: 'timer',
				default: 1,
				regex: this.REGEX_UNSIGNED_NUMBER
			}
			]
		};

		actions['source_hide_v4'] = {
			label: 'Hide a time source V4',
			options: [
			{
				type: 'textinput',
				label: 'Source number',
				id: 'source',
				default: 1,
				regex: this.REGEX_UNSIGNED_NUMBER
			}
			]
		};
		actions['source_show_v4'] = {
			label: 'Show a time source V4',
			options: [
			{
				type: 'textinput',
				label: 'Source number',
				id: 'source',
				default: 1,
				regex: this.REGEX_UNSIGNED_NUMBER
			}
			]
		};


		actions['background_v4'] = {
			label: 'Change background V4',
			options: [
			{
				type: 'textinput',
				label: 'Background number',
				id: 'bg',
				default: 1,
				regex: this.REGEX_UNSIGNED_NUMBER
			}
			]
		};
		actions['info_v4'] = {
			label: "Show clock info overlay V4",
			options: [
			{
				type: 'textinput',
				label: 'Duration (seconds)',
				id: 'duration',
				width: 5,
				default: 30,
				regex: this.REGEX_UNSIGNED_INTEGER
			}
			]
		};
		actions['send_text_v4'] = {
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
				regex: this.REGEX_UNSIGNED_INTEGER
			},
			{
				type: 'textinput',
				label: 'Red',
				id: 'red',
				default: 255,
				regex: this.REGEX_UNSIGNED_INTEGER
			},
			{
				type: 'textinput',
				label: 'Green',
				id: 'green',
				default: 0,
				regex: this.REGEX_UNSIGNED_INTEGER
			},
			{
				type: 'textinput',
				label: 'Blue',
				id: 'blue',
				default: 0,
				regex: this.REGEX_UNSIGNED_INTEGER
			},
			{
				type: 'textinput',
				label: 'Alpha',
				id: 'alpha',
				default: 255,
				regex: this.REGEX_UNSIGNED_INTEGER
			},
			{
				type: 'textinput',
				label: 'BG Red',
				id: 'bg_red',
				default: 0,
				regex: this.REGEX_UNSIGNED_INTEGER
			},
			{
				type: 'textinput',
				label: 'BG Green',
				id: 'bg_green',
				default: 0,
				regex: this.REGEX_UNSIGNED_INTEGER
			},
			{
				type: 'textinput',
				label: 'BG Blue',
				id: 'bg_blue',
				default: 0,
				regex: this.REGEX_UNSIGNED_INTEGER
			},
			{
				type: 'textinput',
				label: 'BG Alpha',
				id: 'bg_alpha',
				default: 64,
				regex: this.REGEX_UNSIGNED_INTEGER
			},
			]
		};
	};
	if (this.config.version == "3" || this.config.version == "mixed") {
		// V3 only actions
		actions['normal_mode'] = {
			label: 'Display current time',
			options: [
			]
		};
		actions['kill_display'] = {
			label: 'Display off',
			options: [
			]
		};
		actions['start_countup'] = {
			label: 'Start counting up',
			options: [
			]
		};
		actions['pause_countdown'] = {
			label: 'Pause countdown(s)',
			options: [
			]
		};
		actions['resume_countdown'] = {
			label: 'Resume countdown(s)',
			options: [
			]
		};
		actions['modify_countdown'] = {
			label: 'Primary countdown: modify',
			options: [
			{
				type: 'textinput',
				label: 'Timer (seconds)',
				id: 'secs',
				default: 0,
				regex: this.REGEX_SIGNED_NUMBER
			},
			{
				type: 'textinput',
				label: 'Timer (minutes)',
				id: 'mins',
				default: 1,
				regex: this.REGEX_SIGNED_NUMBER
			},
			{
				type: 'textinput',
				label: 'Timer (hours)',
				id: 'hours',
				default: 0,
				regex: this.REGEX_SIGNED_NUMBER
			}
			]
		};
		actions['stop_countdown'] = {
			label: 'Primary countdown: stop',
			options: [
			]
		};
		actions['start_countdown2'] = {
			label: 'Secondary countdown: start',
			options: [
			{
				type: 'textinput',
				label: 'Timer (seconds)',
				id: 'secs',
				default: 0,
				regex: this.REGEX_UNSIGNED_NUMBER
			},
			{
				type: 'textinput',
				label: 'Timer (minutes)',
				id: 'mins',
				default: 1,
				regex: this.REGEX_UNSIGNED_NUMBER
			},
			{
				type: 'textinput',
				label: 'Timer (hours)',
				id: 'hours',
				default: 0,
				regex: this.REGEX_UNSIGNED_NUMBER
			}
			]
		};
		actions['modify_countdown2'] = {
			label: 'Secondary countdown: modify',
			options: [
			{
				type: 'textinput',
				label: 'Timer (seconds)',
				id: 'secs',
				default: 0,
				regex: this.REGEX_SIGNED_NUMBER
			},
			{
				type: 'textinput',
				label: 'Timer (minutes)',
				id: 'mins',
				default: 1,
				regex: this.REGEX_SIGNED_NUMBER
			},
			{
				type: 'textinput',
				label: 'Timer (hours)',
				id: 'hours',
				default: 0,
				regex: this.REGEX_SIGNED_NUMBER
			}
			]
		};
		actions['stop_countdown2'] = {
			label: 'Secondary countdown: stop',
			options: [
			]
		};
		actions['send_text'] = {
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
				regex: this.REGEX_UNSIGNED_FLOAT
			},
			{
				type: 'textinput',
				label: 'Green',
				id: 'green',
				default: 0,
				regex: this.REGEX_UNSIGNED_FLOAT
			},
			{
				type: 'textinput',
				label: 'Blue',
				id: 'blue',
				default: 0,
				regex: this.REGEX_UNSIGNED_FLOAT
			}
			]
		};
	};


	// Common actions
	actions['sync_time'] = {
		label: "Sync clock time with the companion computer",
		options: [
		]
	};

	actions['seconds_off'] = {
		label: 'Hide seconds number',
		options: [
		]
	};
	actions['seconds_on'] = {
		label: 'Show seconds number',
		options: [
		]
	};


	return actions;
}