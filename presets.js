exports.getPresets = function() {
	var presets = [];
	var i;

	var timer_colors = [
	this.rgb(0,0,255),
	this.rgb(0,204,255),
	this.rgb(204,0,255),
	this.rgb(0,255,0),
	this.rgb(0,255,204),
	this.rgb(204,255,0),
	this.rgb(255,0,0),
	this.rgb(255,204,0),
	this.rgb(255,0,204),
	this.rgb(128,128,255)
	];

	if (this.config.version == "4" || this.config.version == "mixed") {
		for (i=1; i <= timer_colors.length; i++) {
			presets.push({
				category: 'Timer ' + i,
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
				category: 'Timer ' + i,
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
				category: 'Timer ' + i,
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
				category: 'Timer ' + i,
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
				category: 'Timer ' + i,
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
				category: 'Timer ' + i,
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
				category: 'Timer ' + i,
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
		};
		// End of timer preset loop

		for (i = 1; i <4; i++){
			presets.push({
				category: 'Sources',
				label: 'Hide source ' + i,
				bank: {
					style: 'text',
					text: 'Hide\\nSRC ' + i,
					size: '18',
					color: '16777215',
					bgcolor: this.rgb(0,0,255)
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
				category: 'Sources',
				label: 'Show source ' + i,
				bank: {
					style: 'text',
					text: 'Show\\nSRC ' + i,
					size: '18',
					color: '16777215',
					bgcolor: this.rgb(0,0,255)
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
		};
		// End of source preset loop
	};
	// End of V4 presets

	if (this.config.version == "3" || this.config.version == "mixed") {
		presets.push({
			category: 'Timer control',
			label: 'Set 5 min',
			bank: {
				style: 'text',
				text: 'Start\\n5 min',
				size: '18',
				color: '16777215',
				bgcolor: this.rgb(0,0,255)
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
				bgcolor: this.rgb(0,0,255)
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
				bgcolor: this.rgb(0,0,255)
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
				bgcolor: this.rgb(0,0,255)
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
				bgcolor: this.rgb(0,0,255)
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
				bgcolor: this.rgb(0,0,255)
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
				bgcolor:this.rgb(0, 204, 255)
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
				bgcolor:this.rgb(0, 204, 255)
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
				bgcolor:this.rgb(0, 204, 255)
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
				bgcolor:this.rgb(0, 204, 255)
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
				bgcolor:this.rgb(0, 204, 255)
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
				bgcolor:this.rgb(0, 204, 255)
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
				color: this.rgb(255,128,0),
				bgcolor: this.rgb(0,0,0)
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
					normal_fg: this.rgb(255,128,0),
					normal_bg: this.rgb(0,0,0),
					countdown_fg: this.rgb(255,128,0),
					countdown_bg: this.rgb(0,0,0),
					countup_fg: this.rgb(255,128,0),
					countup_bg: this.rgb(0,0,0),
					paused_fg: this.rgb(255,128,0),
					paused_bg: this.rgb(0,0,0),
					off_fg: this.rgb(255,255,255),
					off_bg: this.rgb(0,0,255)
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
				color: this.rgb(255,128,0),
				bgcolor: this.rgb(0,0,0)
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
					normal_fg: this.rgb(255,255,255),
					normal_bg: this.rgb(0,0,255),
					paused_fg: this.rgb(255,128,0),
					paused_bg: this.rgb(0,0,0),
					countdown_fg: this.rgb(255,128,0),
					countdown_bg: this.rgb(0,0,0),
					countup_fg: this.rgb(255,128,0),
					countup_bg: this.rgb(0,0,0),
					off_fg: this.rgb(255,128,0),
					off_bg: this.rgb(0,0,0)
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
				color: this.rgb(255,128,0),
				bgcolor: this.rgb(0,0,0)
			},
			actions: [
			{
				action: 'start_countup'
			}
			],
			feedbacks: [
			{
				options: {
					normal_fg: this.rgb(255,128,0),
					normal_bg: this.rgb(0,0,0),
					paused_fg: this.rgb(255,128,0),
					paused_bg: this.rgb(0,0,0),
					countdown_fg: this.rgb(255,128,0),
					countdown_bg: this.rgb(0,0,0),
					countup_bg: this.rgb(0,0,255),
					countup_fg: this.rgb(255,255,255),
					off_fg: this.rgb(255,128,0),
					off_bg: this.rgb(0,0,0)
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
				color: this.rgb(255,128,0),
				bgcolor: this.rgb(0,0,0)
			},
			actions: [
			{
				action: 'pause_countdown'
			}
			],
			feedbacks: [
			{
				options: {
					running_fg: this.rgb(255,128,0),
					running_bg: this.rgb(0,0,0),
					paused_fg: this.rgb(255,255,255),
					paused_bg: this.rgb(0,0,255),
				},
				type: 'pause_color'
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
				color: this.rgb(255,128,0),
				bgcolor: this.rgb(0,0,0)
			},
			actions: [
			{
				action: 'resume_countdown'
			}
			],
			feedbacks: [
			{
				options: {
					paused_fg: this.rgb(255,128,0),
					paused_bg: this.rgb(0,0,0),
					running_fg: this.rgb(255,255,255),
					running_bg: this.rgb(0,0,255),
				},
				type: 'pause_color'
			}
			]
		});
		presets.push({
			category: 'Mode',
			label: 'Hide seconds',
			bank: {
				style: 'text',
				text: 'Hide secs',
				size: '18',
				color: this.rgb(255,128,0),
				bgcolor: this.rgb(0,0,0)
			},
			actions: [
			{
				action: 'seconds_off'
			}
			]
		});
		presets.push({
			category: 'Mode',
			label: 'Show seconds',
			bank: {
				style: 'text',
				text: 'Show secs',
				size: '18',
				color: this.rgb(255,128,0),
				bgcolor: this.rgb(0,0,0)
			},
			actions: [
			{
				action: 'seconds_on'
			}
			]
		});
		presets.push({
			category: 'Display time',
			label: 'Hours',
			bank: {
				style: 'text',
				text: '$(label:time_h)',
				size: 'auto',
				color: this.rgb(255,255,255),
				bgcolor: 6619136
			},
			actions: [],
			feedbacks: [
			{
				options: {
					normal_fg: this.rgb(255,255,255),
					normal_bg: 6619136,
					countup_fg: 16777215,
					countup_bg: 7954688,
					countdown_fg: 16777215,
					countdown_bg: 26112,
					paused_fg: 16777215,
					paused_bg: 7954688,
					off_fg: this.rgb(0,0,0),
					off_bg: this.rgb(0,0,0)
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
				color: this.rgb(255,255,255),
				bgcolor: 6619136
			},
			actions: [],
			feedbacks: [
			{
				options: {
					normal_fg: this.rgb(255,255,255),
					normal_bg: 6619136,
					countup_fg: 16777215,
					countup_bg: 7954688,
					countdown_fg: 16777215,
					countdown_bg: 26112,
					paused_fg: 16777215,
					paused_bg: 7954688,
					off_fg: this.rgb(0,0,0),
					off_bg: this.rgb(0,0,0)
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
				color: this.rgb(255,255,255),
				bgcolor: 6619136
			},
			actions: [],
			feedbacks: [
			{
				options: {
					normal_fg: this.rgb(255,255,255),
					normal_bg: 6619136,
					countup_fg: 16777215,
					countup_bg: 7954688,
					countdown_fg: 16777215,
					countdown_bg: 26112,
					paused_fg: 16777215,
					paused_bg: 7954688,
					off_fg: this.rgb(0,0,0),
					off_bg: this.rgb(0,0,0)
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
				color: this.rgb(255,255,255),
				bgcolor: 6619136
			},
			actions: [],
			feedbacks: [
			{
				options: {
					normal_fg: this.rgb(255,255,255),
					normal_bg: 6619136,
					countup_fg: 16777215,
					countup_bg: 7954688,
					countdown_fg: 16777215,
					countdown_bg: 26112,
					paused_fg: 16777215,
					paused_bg: 7954688,
					off_fg: this.rgb(0,0,0),
					off_bg: this.rgb(0,0,0)
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
				color: this.rgb(255,255,255),
				bgcolor: 6619136
			},
			actions: [],
			feedbacks: [
			{
				options: {
					normal_fg: this.rgb(255,255,255),
					normal_bg: 6619136,
					countup_fg: 16777215,
					countup_bg: 7954688,
					countdown_fg: 16777215,
					countdown_bg: 26112,
					paused_fg: 16777215,
					paused_bg: 7954688,
					off_fg: this.rgb(64,64,64),
					off_bg: this.rgb(0,0,0)
				},
				type: "state_color",
			}
			]
		});
		presets.push({
			category: 'Display time',
			label: 'Pause status',
			bank: {
				style: 'text',
				text: '$(label:paused)',
				size: 'auto',
				color: this.rgb(255,255,255),
				bgcolor: 6619136
			},
			actions: [],
			feedbacks: [
			{
				options: {
					running_fg: this.rgb(255,128,0),
					running_bg: this.rgb(0,0,0),
					paused_fg: this.rgb(255,255,255),
					paused_bg: this.rgb(0,0,255),
				},
				type: "pause_color",
			}
			]
		});
	};
	// End of V3 presets

	// Common presets
	presets.push({
		category: 'Sync',
		label: 'Sync time',
		bank: {
			style: 'text',
			text: 'Sync clock',
			size: 'auto',
			color: this.rgb(255,255,255),
			bgcolor: 6619136
		},
		actions: [
		{
			action: "sync_time"
		}
		],
		feedbacks: []
	});

	return presets;
};