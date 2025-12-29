import {
	CompanionButtonPresetDefinition,
	CompanionPresetAction,
	CompanionPresetDefinitions,
	CompanionPresetFeedback,
	combineRgb,
	splitRgb,
} from '@companion-module/base'
import { ClockConfig } from './config'

export function getPresets(config: ClockConfig): CompanionPresetDefinitions {
	const presets: CompanionPresetDefinitions = {}
	let i: number, j: number

	const white = combineRgb(255, 255, 255)
	const black = combineRgb(0, 0, 0)
	const timerColors = [
		black,
		combineRgb(102, 51, 0),
		combineRgb(255, 0, 0),
		combineRgb(255, 102, 0),
		combineRgb(255, 255, 0),
		combineRgb(0, 255, 0),
		combineRgb(0, 0, 255),
		combineRgb(255, 0, 255),
		combineRgb(120, 120, 120),
		white,
	]
	const timerTextColors = [white, white, white, white, black, black, white, white, white, black]
	const sourceColors = [
		combineRgb(15, 82, 141),
		combineRgb(61, 130, 191),
		combineRgb(70, 107, 128),
		combineRgb(138, 153, 163),
	]
	const signalColors = [
		[255, 0, 0],
		[255, 165, 0],
		[255, 255, 0],
		[0, 255, 0],
		[0, 0, 255],
		[75, 0, 130],
		[238, 130, 238],
		[255, 255, 255],
	]
	const signalTextColors = [white, white, black, black, white, white, white, black]

	function presetButton(
		category: string,
		name: string,
		buttonText: string,
		color: number,
		bgColor: number,
		action?: CompanionPresetAction,
		feedback?: CompanionPresetFeedback,
	): CompanionButtonPresetDefinition {
		const btn: CompanionButtonPresetDefinition = {
			type: 'button',
			category: category,
			name: name,
			style: {
				text: buttonText,
				size: 'auto',
				color: color,
				bgcolor: bgColor,
			},
			steps: [],
			feedbacks: [],
		}
		if (action) {
			btn.steps.push({ down: [action], up: [] })
		}
		if (feedback) {
			btn.feedbacks.push(feedback)
		}

		return btn
	}

	function textButton(text: string, buttonText: string, color: number, bgColor: number) {
		const col = splitRgb(color)
		const bg = splitRgb(bgColor)
		return presetButton('Text', text, buttonText, color, bgColor, {
			actionId: 'send_text_v4',
			options: {
				red: col.r,
				green: col.g,
				blue: col.b,
				alpha: 255,
				bg_red: bg.r,
				bg_green: bg.g,
				bg_blue: bg.b,
				bg_alpha: 255,
				duration: 10,
				text: text,
			},
		})
	}

	function timerButton(
		i: number,
		name: string,
		buttonText: string,
		action?: CompanionPresetAction,
	): CompanionButtonPresetDefinition {
		return presetButton(`Timer ${i}`, name, buttonText, timerTextColors[i], timerColors[i], action)
	}

	function sourceButton(
		i: number,
		name: string,
		buttonText: string,
		action?: CompanionPresetAction,
	): CompanionButtonPresetDefinition {
		return presetButton(`Source ${i}`, name, buttonText, white, sourceColors[i - 1], action)
	}

	if (config.version === '4' || config.version === 'mixed') {
		for (i = 0; i < timerColors.length; i++) {
			presets[`timer_${i}_icon`] = timerButton(i, 'Icon', `$(label:timer_${i}_icon)`)
			presets[`timer_${i}_hours`] = timerButton(i, 'Hours', `$(label:timer_${i}_hours)`)
			presets[`timer_${i}_minutes`] = timerButton(i, 'Minutes', `$(label:timer_${i}_minutes)`)
			presets[`timer_${i}_seconds`] = timerButton(i, 'Seconds', `$(label:timer_${i}_seconds)`)

			presets[`timer_${i}_5min`] = timerButton(i, 'Set 5 min countdown', `Start\\n5 min`, {
				actionId: 'start_countdown_v4',
				options: {
					timer: `${i}`,
					secs: '0',
					mins: '5',
					hours: '0',
				},
			})

			presets[`timer_${i}_10min`] = timerButton(i, 'Set 10 min countdown', `Start\\n10 min`, {
				actionId: 'start_countdown_v4',
				options: {
					timer: `${i}`,
					secs: '0',
					mins: '10',
					hours: '0',
				},
			})

			presets[`timer_${i}_30min`] = timerButton(i, 'Set 30 min countdown', `Start\\n30 min`, {
				actionId: 'start_countdown_v4',
				options: {
					timer: `${i}`,
					secs: '0',
					mins: '30',
					hours: '0',
				},
			})

			presets[`timer_${i}_up`] = timerButton(i, 'Start count up', `Start\\ncount`, {
				actionId: 'start_countup_v4',
				options: {
					timer: `${i}`,
				},
			})

			presets[`timer_${i}_pause`] = timerButton(i, 'Pause timer', `Pause`, {
				actionId: 'timer_pause_v4',
				options: {
					timer: `${i}`,
				},
			})

			presets[`timer_${i}_resume`] = timerButton(i, 'Resume timer', `Resume`, {
				actionId: 'timer_resume_v4',
				options: {
					timer: `${i}`,
				},
			})

			presets[`timer_${i}_stop`] = timerButton(i, 'Stop timer', `Stop`, {
				actionId: 'timer_stop_v4',
				options: {
					timer: `${i}`,
				},
			})

			presets[`timer_${i}_add1m`] = timerButton(i, 'Add 1 minute', `+1\\nmin`, {
				actionId: 'timer_modify_v4',
				options: {
					timer: `${i}`,
					secs: '0',
					mins: '1',
					hours: '0',
				},
			})

			presets[`timer_${i}_remove1m`] = timerButton(i, 'Remove 1 minute', `-1\\nmin`, {
				actionId: 'timer_modify_v4',
				options: {
					timer: `${i}`,
					secs: '0',
					mins: '-1',
					hours: '0',
				},
			})

			presets[`timer_${i}_add2s`] = timerButton(i, 'Add 2 seconds', `+2\\nsec`, {
				actionId: 'timer_modify_v4',
				options: {
					timer: `${i}`,
					secs: '2',
					mins: '0',
					hours: '0',
				},
			})

			presets[`timer_${i}_remove2s`] = timerButton(i, 'Remove 2 seconds', `-2\\nsec`, {
				actionId: 'timer_modify_v4',
				options: {
					timer: `${i}`,
					secs: '-2',
					mins: '0',
					hours: '0',
				},
			})

			presets[`timer_${i}_downtarget`] = timerButton(i, 'Countdown to target', `To\\ntime`, {
				actionId: 'target_countdown_v4',
				options: {
					timer: `${i}`,
					target: '12:00:00',
				},
			})
			presets[`timer_${i}_uptarget`] = timerButton(i, 'Countdown from target', `From\\ntime`, {
				actionId: 'target_countup_v4',
				options: {
					timer: `${i}`,
					target: '12:00:00',
				},
			})

			for (j = 0; j < signalColors.length; j++) {
				presets[`timer_${i}_signal_${j}`] = {
					type: 'button',
					category: `Timer ${i} signal color`,
					name: `Signal ${i}`,
					style: {
						text: `Signal ${i}`,
						size: '18',
						color: signalTextColors[j],
						bgcolor: combineRgb(signalColors[j][0], signalColors[j][1], signalColors[j][2]),
					},
					steps: [
						{
							down: [
								{
									actionId: 'timer_signal_v4',
									options: {
										timer: `${i}`,
										red: signalColors[j][0],
										green: signalColors[j][1],
										blue: signalColors[j][2],
										alpha: 255,
									},
								},
							],
							up: [],
						},
					],
					feedbacks: [],
				}
			}
			// End of signal color loop

			presetButton(`Timer ${i} signal color`, `Signal ${i} off`, `Signal ${i} off`, white, black, {
				actionId: 'timer_signal_v4',
				options: {
					timer: `${i}`,
					red: 0,
					green: 0,
					blue: 0,
					alpha: 0,
				},
			})
		}
		// End of timer preset loop

		for (i = 1; i < 4; i++) {
			presets[`source_${i}_icon`] = sourceButton(i, 'Icon', `$(label:source_${i}_icon)`)
			presets[`source_${i}_hours`] = sourceButton(i, 'Hours', `$(label:source_${i}_hours)`)
			presets[`source_${i}_minutes`] = sourceButton(i, 'Minutes', `$(label:source_${i}_minutes)`)
			presets[`source_${i}_seconds`] = sourceButton(i, 'Seconds', `$(label:source_${i}_seconds)`)
			presets[`source_${i}_hide`] = sourceButton(i, `Hide source ${i}`, `Hide\\nSRC ${i}`, {
				actionId: 'source_hide_v4',
				options: {
					source: `${i}`,
				},
			})
			presets[`source_${i}_show`] = sourceButton(i, `Show source ${i}`, `Show\\nSRC ${i}`, {
				actionId: 'source_show_v4',
				options: {
					source: `${i}`,
				},
			})
		}
		// End of source preset loop

		presets['hide_all_sources'] = presetButton(
			'All sources',
			'Hide all sources',
			'Hide\\nall',
			black,
			combineRgb(255, 204, 255),
			{
				actionId: 'hide_sources_v4',
				options: {},
			},
		)

		presets['show_all_sources'] = presetButton(
			'All sources',
			'Show all sources',
			'Show\\nall',
			black,
			combineRgb(255, 204, 255),
			{
				actionId: 'show_sources_v4',
				options: {},
			},
		)

		// Misc commands
		presets['show_info'] = presetButton('Misc', 'Show info overlay', 'Info', black, combineRgb(153, 255, 204), {
			actionId: 'info_v4',
			options: { duration: 30 },
		})

		presets['pause_all'] = presetButton('Misc', 'Pause all timers', 'Pause\\nall', black, combineRgb(204, 255, 255), {
			actionId: 'pause_timers',
			options: {},
		})
		presets['resume_all'] = presetButton(
			'Misc',
			'Resume all timers',
			'Resume\\nall',
			black,
			combineRgb(204, 255, 255),
			{
				actionId: 'resume_timers',
				options: {},
			},
		)

		// Text presets
		presets['text_wrapup'] = textButton('Wrap up', 'Wrap\\nup', combineRgb(255, 0, 0), black)
		presets['text_stop'] = textButton('Please stop', 'Please\\nstop', combineRgb(255, 0, 0), black)
		presets['text_standby'] = textButton('Stand by', 'Stand\\nby', black, combineRgb(255, 255, 0))
		presets['text_go'] = textButton('GO', 'GO', black, combineRgb(0, 255, 0))
		presets['text_onair'] = textButton('On air', 'On\\nair', black, combineRgb(255, 0, 0))
		presets['text_clear'] = presetButton('Text', 'Clear text', 'Clear\\ntext', white, black, {
			actionId: 'send_text_v4',
			options: {
				red: 0,
				green: 0,
				blue: 0,
				alpha: 0,
				bg_red: 0,
				bg_green: 0,
				bg_blue: 0,
				bg_alpha: 0,
				duration: 1,
				text: '',
			},
		})

		// Backgrounds
		for (i = 1; i < 11; i++) {
			presets[`bg_${i}`] = presetButton(
				'Backgrounds',
				`Select background ${i}`,
				`BG ${i}`,
				black,
				combineRgb(35, 143, 52),
				{
					actionId: 'background_v4',
					options: {
						bg: i,
					},
				},
			)
		}

		// Hardware signal groups
		for (i = 1; i < 11; i++) {
			for (j = 0; j < signalColors.length; j++) {
				presets[`signal_${i}_${j}`] = presetButton(
					'Hardware signal colors',
					`Group ${i}`,
					`Group ${i}`,
					signalTextColors[j],
					combineRgb(signalColors[j][0], signalColors[j][1], signalColors[j][2]),
					{
						actionId: 'hardware_signal_v4',
						options: {
							group: `${i}`,
							red: signalColors[j][0],
							green: signalColors[j][1],
							blue: signalColors[j][2],
						},
					},
				)
			}
			// End of signal color loop

			presets[`signal_${i} off`] = presetButton(
				'Hardware signal colors',
				`Group ${i} off`,
				`Group ${i} off`,
				white,
				black,
				{
					actionId: 'hardware_signal_v4',
					options: {
						group: `${i}`,
						red: 0,
						green: 0,
						blue: 0,
					},
				},
			)
		}
	}

	// End of V4 presets

	if (config.version === '3' || config.version === 'mixed') {
		// Timer 1
		presets[`timer1_5min`] = presetButton(
			'Timer control',
			'Set 5 min countdown',
			`Start\\n5 min`,
			white,
			combineRgb(0, 0, 255),
			{
				actionId: 'start_countdown',
				options: {
					secs: '0',
					mins: '5',
					hours: '0',
				},
			},
		)

		presets[`timer1_10min`] = presetButton(
			'Timer control',
			'Set 10 min countdown',
			`Start\\n10 min`,
			white,
			combineRgb(0, 0, 255),
			{
				actionId: 'start_countdown',
				options: {
					secs: '0',
					mins: '10',
					hours: '0',
				},
			},
		)

		presets[`timer1_30min`] = presetButton(
			'Timer control',
			'Set 30 min countdown',
			`Start\\n30 min`,
			white,
			combineRgb(0, 0, 255),
			{
				actionId: 'start_countdown',
				options: {
					secs: '0',
					mins: '30',
					hours: '0',
				},
			},
		)

		presets[`timer1_stop`] = presetButton('Timer control', 'Stop', `Stop`, white, combineRgb(0, 0, 255), {
			actionId: 'stop_countdown',
			options: {},
		})
		presets[`timer1_add1m`] = presetButton('Timer control', 'Add 1min', `+1\\nmin`, white, combineRgb(0, 0, 255), {
			actionId: 'modify_countdown',
			options: {
				secs: '0',
				mins: '1',
				hours: '0',
			},
		})
		presets[`timer1_rem1m`] = presetButton('Timer control', 'Remove 1min', `-1\\nmin`, white, combineRgb(0, 0, 255), {
			actionId: 'modify_countdown',
			options: {
				secs: '0',
				mins: '-1',
				hours: '0',
			},
		})

		// Timer 2
		presets[`timer2_5min`] = presetButton(
			'Timer 2 control',
			'Set 5 min countdown',
			`Start\\n5 min`,
			white,
			combineRgb(0, 0, 255),
			{
				actionId: 'start_countdown2',
				options: {
					secs: '0',
					mins: '5',
					hours: '0',
				},
			},
		)

		presets[`timer2_10min`] = presetButton(
			'Timer 2 control',
			'Set 10 min countdown',
			`Start\\n10 min`,
			white,
			combineRgb(0, 0, 255),
			{
				actionId: 'start_countdown2',
				options: {
					secs: '0',
					mins: '10',
					hours: '0',
				},
			},
		)

		presets[`timer2_30min`] = presetButton(
			'Timer 2 control',
			'Set 30 min countdown',
			`Start\\n30 min`,
			white,
			combineRgb(0, 0, 255),
			{
				actionId: 'start_countdown2',
				options: {
					secs: '0',
					mins: '30',
					hours: '0',
				},
			},
		)

		presets[`timer2_stop`] = presetButton('Timer 2 control', 'Stop', `Stop`, white, combineRgb(0, 0, 255), {
			actionId: 'stop_countdown2',
			options: {},
		})
		presets[`timer2_add1m`] = presetButton('Timer 2 control', 'Add 1min', `+1\\nmin`, white, combineRgb(0, 0, 255), {
			actionId: 'modify_countdown2',
			options: {
				secs: '0',
				mins: '1',
				hours: '0',
			},
		})
		presets[`timer2_rem1m`] = presetButton('Timer 2 control', 'Remove 1min', `-1\\nmin`, white, combineRgb(0, 0, 255), {
			actionId: 'modify_countdown2',
			options: {
				secs: '0',
				mins: '-1',
				hours: '0',
			},
		})

		// Misc
		presets[`black`] = presetButton(
			'Mode',
			'Black',
			'Black',
			combineRgb(255, 128, 0),
			black,
			{
				actionId: 'kill_display',
				options: {},
			},
			{
				feedbackId: 'state_color',
				options: {
					normal_fg: combineRgb(255, 128, 0),
					normal_bg: combineRgb(0, 0, 0),
					countdown_fg: combineRgb(255, 128, 0),
					countdown_bg: combineRgb(0, 0, 0),
					countup_fg: combineRgb(255, 128, 0),
					countup_bg: combineRgb(0, 0, 0),
					paused_fg: combineRgb(255, 128, 0),
					paused_bg: combineRgb(0, 0, 0),
					off_fg: combineRgb(255, 255, 255),
					off_bg: combineRgb(0, 0, 255),
				},
			},
		)

		presets[`timeofday`] = presetButton(
			'Mode',
			'Time of day',
			'Time\\nof day',
			combineRgb(255, 128, 0),
			black,
			{
				actionId: 'normal_mode',
				options: {},
			},
			{
				feedbackId: 'state_color',
				options: {
					normal_fg: combineRgb(255, 255, 255),
					normal_bg: combineRgb(0, 0, 255),
					paused_fg: combineRgb(255, 128, 0),
					paused_bg: combineRgb(0, 0, 0),
					countdown_fg: combineRgb(255, 128, 0),
					countdown_bg: combineRgb(0, 0, 0),
					countup_fg: combineRgb(255, 128, 0),
					countup_bg: combineRgb(0, 0, 0),
					off_fg: combineRgb(255, 128, 0),
					off_bg: combineRgb(0, 0, 0),
				},
			},
		)

		presets[`count_up`] = presetButton(
			'Mode',
			'Count up',
			'Count up',
			combineRgb(255, 128, 0),
			black,
			{
				actionId: 'start_countup',
				options: {},
			},
			{
				feedbackId: 'state_color',
				options: {
					normal_fg: combineRgb(255, 128, 0),
					normal_bg: combineRgb(0, 0, 0),
					paused_fg: combineRgb(255, 128, 0),
					paused_bg: combineRgb(0, 0, 0),
					countdown_fg: combineRgb(255, 128, 0),
					countdown_bg: combineRgb(0, 0, 0),
					countup_bg: combineRgb(0, 0, 255),
					countup_fg: combineRgb(255, 255, 255),
					off_fg: combineRgb(255, 128, 0),
					off_bg: combineRgb(0, 0, 0),
				},
			},
		)

		presets[`pause`] = presetButton(
			'Mode',
			'Pause countdown(s)',
			'Pause',
			combineRgb(255, 128, 0),
			black,
			{
				actionId: 'pause_countdown',
				options: {},
			},
			{
				feedbackId: 'pause_color',
				options: {
					running_fg: combineRgb(255, 128, 0),
					running_bg: combineRgb(0, 0, 0),
					paused_fg: combineRgb(255, 255, 255),
					paused_bg: combineRgb(0, 0, 255),
				},
			},
		)
		presets[`resume`] = presetButton(
			'Mode',
			'Resume countdown(s)',
			'Resume',
			combineRgb(255, 128, 0),
			black,
			{
				actionId: 'resume_countdown',
				options: {},
			},
			{
				feedbackId: 'pause_color',
				options: {
					running_fg: combineRgb(255, 128, 0),
					running_bg: combineRgb(0, 0, 0),
					paused_fg: combineRgb(255, 255, 255),
					paused_bg: combineRgb(0, 0, 255),
				},
			},
		)

		presets[`hide_sec`] = presetButton('Mode', 'Hide seconds', 'Hide secs', combineRgb(255, 128, 0), black, {
			actionId: 'seconds_off',
			options: {},
		})

		presets[`show_sec`] = presetButton('Mode', 'Show seconds', 'Show secs', combineRgb(255, 128, 0), black, {
			actionId: 'seconds_on',
			options: {},
		})

		function timeButton(text: string, buttonText: string) {
			return presetButton('Display time', text, buttonText, white, combineRgb(101, 0, 0), undefined, {
				feedbackId: 'state_color',
				options: {
					normal_fg: combineRgb(255, 255, 255),
					normal_bg: 6619136,
					countup_fg: 16777215,
					countup_bg: 7954688,
					countdown_fg: 16777215,
					countdown_bg: 26112,
					paused_fg: 16777215,
					paused_bg: 7954688,
					off_fg: combineRgb(0, 0, 0),
					off_bg: combineRgb(0, 0, 0),
				},
			})
		}

		presets[`time_h`] = timeButton('Hours', '$(label:time_h)')
		presets[`time_m`] = timeButton('Minutes', '$(label:time_m)')
		presets[`time_s`] = timeButton('Seconds', '$(label:time_s)')

		presets[`tally`] = timeButton('Tally', '$(label:tally)')
		presets[`state`] = timeButton('Clock mode', '$(label:state)')
		presets[`paused`] = presetButton(
			'Display time',
			'Pause status',
			'$(label:paused)',
			white,
			combineRgb(101, 0, 0),
			undefined,
			{
				feedbackId: 'pause_color',
				options: {
					running_fg: combineRgb(255, 128, 0),
					running_bg: combineRgb(0, 0, 0),
					paused_fg: combineRgb(255, 255, 255),
					paused_bg: combineRgb(0, 0, 255),
				},
			},
		)
	}
	// End of V3 presets

	// Common presets
	presets['sync'] = presetButton('Sync', 'Sync time', `Sync clock`, white, combineRgb(88, 23, 88), {
		actionId: 'sync_time',
		options: {},
	})

	return presets
}
