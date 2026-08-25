import {
	combineRgb,
	splitRgb,
	type CompanionPresetDefinitions,
	type CompanionPresetGroup,
	type CompanionPresetSection,
	type CompanionSimplePresetDefinition,
	type SomePresetActionEntry,
	type SomePresetSimpleFeedbackEntry,
} from '@companion-module/base'
import type { ClockConfig } from './config.js'
import type { ClockInstanceTypes } from './types.js'

type ClockPreset = CompanionSimplePresetDefinition<ClockInstanceTypes>
type ClockPresetAction = SomePresetActionEntry<ClockInstanceTypes>
type ClockPresetFeedback = SomePresetSimpleFeedbackEntry<ClockInstanceTypes>
type ClockPresetGroup = CompanionPresetGroup<ClockInstanceTypes>

export interface ClockPresets {
	/** The sections and groups the presets are presented in */
	structure: CompanionPresetSection<ClockInstanceTypes>[]
	/** The presets themselves, referenced by id from the structure */
	presets: CompanionPresetDefinitions<ClockInstanceTypes>
}

export function getPresets(config: ClockConfig): ClockPresets {
	const presets: CompanionPresetDefinitions<ClockInstanceTypes> = {}
	const structure: CompanionPresetSection<ClockInstanceTypes>[] = []
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

	// Presets are stored by id and referenced from the structure, so every one of them is registered
	// through here to keep the two in step
	function register(into: string[], id: string, preset: ClockPreset): void {
		presets[id] = preset
		into.push(id)
	}

	function group(id: string, name: string, presetIds: string[]): ClockPresetGroup {
		return { id: id, type: 'simple', name: name, presets: presetIds }
	}

	function presetButton(
		name: string,
		buttonText: string,
		color: number,
		bgColor: number,
		action?: ClockPresetAction,
		feedback?: ClockPresetFeedback,
	): ClockPreset {
		const btn: ClockPreset = {
			type: 'simple',
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

	function textButton(text: string, buttonText: string, color: number, bgColor: number): ClockPreset {
		const col = splitRgb(color)
		const bg = splitRgb(bgColor)
		return presetButton(text, buttonText, color, bgColor, {
			actionId: 'send_text_v4',
			options: {
				red: String(col.r),
				green: String(col.g),
				blue: String(col.b),
				alpha: '255',
				bg_red: String(bg.r),
				bg_green: String(bg.g),
				bg_blue: String(bg.b),
				bg_alpha: '255',
				duration: '10',
				text: text,
			},
		})
	}

	function timerButton(i: number, name: string, buttonText: string, action?: ClockPresetAction): ClockPreset {
		return presetButton(name, buttonText, timerTextColors[i], timerColors[i], action)
	}

	function sourceButton(i: number, name: string, buttonText: string, action?: ClockPresetAction): ClockPreset {
		return presetButton(name, buttonText, white, sourceColors[i - 1], action)
	}

	if (config.version === '4' || config.version === 'mixed') {
		const timerGroups: ClockPresetGroup[] = []

		for (i = 0; i < timerColors.length; i++) {
			const ids: string[] = []

			register(ids, `timer_${i}_icon`, timerButton(i, 'Icon', `$(label:timer_${i}_icon)`))
			register(ids, `timer_${i}_hours`, timerButton(i, 'Hours', `$(label:timer_${i}_hours)`))
			register(ids, `timer_${i}_minutes`, timerButton(i, 'Minutes', `$(label:timer_${i}_minutes)`))
			register(ids, `timer_${i}_seconds`, timerButton(i, 'Seconds', `$(label:timer_${i}_seconds)`))

			register(
				ids,
				`timer_${i}_5min`,
				timerButton(i, 'Set 5 min countdown', `Start\\n5 min`, {
					actionId: 'start_countdown_v4',
					options: {
						timer: `${i}`,
						secs: '0',
						mins: '5',
						hours: '0',
					},
				}),
			)

			register(
				ids,
				`timer_${i}_10min`,
				timerButton(i, 'Set 10 min countdown', `Start\\n10 min`, {
					actionId: 'start_countdown_v4',
					options: {
						timer: `${i}`,
						secs: '0',
						mins: '10',
						hours: '0',
					},
				}),
			)

			register(
				ids,
				`timer_${i}_30min`,
				timerButton(i, 'Set 30 min countdown', `Start\\n30 min`, {
					actionId: 'start_countdown_v4',
					options: {
						timer: `${i}`,
						secs: '0',
						mins: '30',
						hours: '0',
					},
				}),
			)

			register(
				ids,
				`timer_${i}_up`,
				timerButton(i, 'Start count up', `Start\\ncount`, {
					actionId: 'start_countup_v4',
					options: {
						timer: `${i}`,
					},
				}),
			)

			register(
				ids,
				`timer_${i}_pause`,
				timerButton(i, 'Pause timer', `Pause`, {
					actionId: 'timer_pause_v4',
					options: {
						timer: `${i}`,
					},
				}),
			)

			register(
				ids,
				`timer_${i}_resume`,
				timerButton(i, 'Resume timer', `Resume`, {
					actionId: 'timer_resume_v4',
					options: {
						timer: `${i}`,
					},
				}),
			)

			register(
				ids,
				`timer_${i}_stop`,
				timerButton(i, 'Stop timer', `Stop`, {
					actionId: 'timer_stop_v4',
					options: {
						timer: `${i}`,
					},
				}),
			)

			register(
				ids,
				`timer_${i}_restart`,
				timerButton(i, 'Restart timer', `Restart`, {
					actionId: 'timer_restart_v4',
					options: {
						timer: `${i}`,
					},
				}),
			)

			register(
				ids,
				`timer_${i}_set_zero`,
				timerButton(i, 'Set timer display to 0', `Set\\n0:00`, {
					actionId: 'timer_set_v4',
					options: {
						timer: `${i}`,
						secs: '0',
						mins: '0',
						hours: '0',
					},
				}),
			)

			register(
				ids,
				`timer_${i}_add1m`,
				timerButton(i, 'Add 1 minute', `+1\\nmin`, {
					actionId: 'timer_modify_v4',
					options: {
						timer: `${i}`,
						secs: '0',
						mins: '1',
						hours: '0',
					},
				}),
			)

			register(
				ids,
				`timer_${i}_remove1m`,
				timerButton(i, 'Remove 1 minute', `-1\\nmin`, {
					actionId: 'timer_modify_v4',
					options: {
						timer: `${i}`,
						secs: '0',
						mins: '-1',
						hours: '0',
					},
				}),
			)

			register(
				ids,
				`timer_${i}_add2s`,
				timerButton(i, 'Add 2 seconds', `+2\\nsec`, {
					actionId: 'timer_modify_v4',
					options: {
						timer: `${i}`,
						secs: '2',
						mins: '0',
						hours: '0',
					},
				}),
			)

			register(
				ids,
				`timer_${i}_remove2s`,
				timerButton(i, 'Remove 2 seconds', `-2\\nsec`, {
					actionId: 'timer_modify_v4',
					options: {
						timer: `${i}`,
						secs: '-2',
						mins: '0',
						hours: '0',
					},
				}),
			)

			register(
				ids,
				`timer_${i}_downtarget`,
				timerButton(i, 'Countdown to target', `To\\ntime`, {
					actionId: 'target_countdown_v4',
					options: {
						timer: `${i}`,
						target: '12:00:00',
					},
				}),
			)
			register(
				ids,
				`timer_${i}_uptarget`,
				timerButton(i, 'Countdown from target', `From\\ntime`, {
					actionId: 'target_countup_v4',
					options: {
						timer: `${i}`,
						target: '12:00:00',
					},
				}),
			)

			timerGroups.push(group(`timer_${i}`, `Timer ${i}`, ids))

			const signalIds: string[] = []
			for (j = 0; j < signalColors.length; j++) {
				register(signalIds, `timer_${i}_signal_${j}`, {
					type: 'simple',
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
										red: String(signalColors[j][0]),
										green: String(signalColors[j][1]),
										blue: String(signalColors[j][2]),
										alpha: '255',
									},
								},
							],
							up: [],
						},
					],
					feedbacks: [],
				})
			}
			// End of signal color loop

			register(
				signalIds,
				`timer_${i}_signal_off`,
				presetButton(`Signal ${i} off`, `Signal ${i} off`, white, black, {
					actionId: 'timer_signal_v4',
					options: {
						timer: `${i}`,
						red: '0',
						green: '0',
						blue: '0',
						alpha: '0',
					},
				}),
			)

			timerGroups.push(group(`timer_${i}_signal`, `Timer ${i} signal color`, signalIds))
		}
		// End of timer preset loop

		structure.push({
			id: 'timers',
			name: 'Timers',
			description: 'Control and display of the ten V4 timers',
			definitions: timerGroups,
		})

		const sourceGroups: ClockPresetGroup[] = []
		for (i = 1; i < 4; i++) {
			const ids: string[] = []
			register(ids, `source_${i}_icon`, sourceButton(i, 'Icon', `$(label:source_${i}_icon)`))
			register(ids, `source_${i}_hours`, sourceButton(i, 'Hours', `$(label:source_${i}_hours)`))
			register(ids, `source_${i}_minutes`, sourceButton(i, 'Minutes', `$(label:source_${i}_minutes)`))
			register(ids, `source_${i}_seconds`, sourceButton(i, 'Seconds', `$(label:source_${i}_seconds)`))
			register(
				ids,
				`source_${i}_hide`,
				sourceButton(i, `Hide source ${i}`, `Hide\\nSRC ${i}`, {
					actionId: 'source_hide_v4',
					options: {
						source: `${i}`,
					},
				}),
			)
			register(
				ids,
				`source_${i}_show`,
				sourceButton(i, `Show source ${i}`, `Show\\nSRC ${i}`, {
					actionId: 'source_show_v4',
					options: {
						source: `${i}`,
					},
				}),
			)
			sourceGroups.push(group(`source_${i}`, `Source ${i}`, ids))
		}
		// End of source preset loop

		const allSourceIds: string[] = []
		register(
			allSourceIds,
			'hide_all_sources',
			presetButton('Hide all sources', 'Hide\\nall', black, combineRgb(255, 204, 255), {
				actionId: 'hide_sources_v4',
				options: {},
			}),
		)

		register(
			allSourceIds,
			'show_all_sources',
			presetButton('Show all sources', 'Show\\nall', black, combineRgb(255, 204, 255), {
				actionId: 'show_sources_v4',
				options: {},
			}),
		)
		sourceGroups.push(group('all_sources', 'All sources', allSourceIds))

		structure.push({
			id: 'sources',
			name: 'Time sources',
			description: 'Display and visibility of the V4 time sources',
			definitions: sourceGroups,
		})

		// Cues
		const cueIds: string[] = []
		register(
			cueIds,
			'cue_left',
			presetButton(
				'Cue left',
				'◀',
				combineRgb(200, 0, 0),
				black,
				{
					actionId: 'cue_left_v4',
					options: {},
				},
				{
					feedbackId: 'cue_left_active',
					options: { fg: white, bg: combineRgb(200, 0, 0) },
				},
			),
		)
		register(
			cueIds,
			'cue_right',
			presetButton(
				'Cue right',
				'▶',
				combineRgb(0, 153, 0),
				black,
				{
					actionId: 'cue_right_v4',
					options: {},
				},
				{
					feedbackId: 'cue_right_active',
					options: { fg: white, bg: combineRgb(0, 153, 0) },
				},
			),
		)
		register(
			cueIds,
			'cue_blank',
			presetButton(
				'Toggle blank cue',
				'⬤',
				combineRgb(255, 255, 0),
				black,
				{
					actionId: 'cue_blank_toggle_v4',
					options: {},
				},
				{
					feedbackId: 'cue_blank_active',
					options: { fg: black, bg: combineRgb(255, 255, 0), blink: true },
				},
			),
		)
		structure.push({
			id: 'cues',
			name: 'Cues',
			description: 'Arrow and blank cues, kept in sync with the other panels driving the clock',
			definitions: cueIds,
		})

		// Text presets
		const textIds: string[] = []
		register(textIds, 'text_wrapup', textButton('Wrap up', 'Wrap\\nup', combineRgb(255, 0, 0), black))
		register(textIds, 'text_stop', textButton('Please stop', 'Please\\nstop', combineRgb(255, 0, 0), black))
		register(textIds, 'text_standby', textButton('Stand by', 'Stand\\nby', black, combineRgb(255, 255, 0)))
		register(textIds, 'text_go', textButton('GO', 'GO', black, combineRgb(0, 255, 0)))
		register(textIds, 'text_onair', textButton('On air', 'On\\nair', black, combineRgb(255, 0, 0)))
		register(
			textIds,
			'text_clear',
			presetButton('Clear text', 'Clear\\ntext', white, black, {
				actionId: 'send_text_v4',
				options: {
					red: '0',
					green: '0',
					blue: '0',
					alpha: '0',
					bg_red: '0',
					bg_green: '0',
					bg_blue: '0',
					bg_alpha: '0',
					duration: '1',
					text: '',
				},
			}),
		)
		structure.push({
			id: 'text',
			name: 'Text',
			description: 'Messages shown across the clock face',
			definitions: textIds,
		})

		// Backgrounds
		const backgroundIds: string[] = []
		register(
			backgroundIds,
			'bg_clear',
			presetButton('Clear background', 'BG\\nclear', white, black, {
				actionId: 'background_v4',
				options: {
					bg: '0',
				},
			}),
		)
		for (i = 1; i < 11; i++) {
			register(
				backgroundIds,
				`bg_${i}`,
				presetButton(`Select background ${i}`, `BG ${i}`, black, combineRgb(35, 143, 52), {
					actionId: 'background_v4',
					options: {
						bg: `${i}`,
					},
				}),
			)
		}
		structure.push({
			id: 'backgrounds',
			name: 'Backgrounds',
			definitions: backgroundIds,
		})

		// Hardware signal groups
		const signalGroups: ClockPresetGroup[] = []
		for (i = 1; i < 11; i++) {
			const ids: string[] = []
			for (j = 0; j < signalColors.length; j++) {
				register(
					ids,
					`signal_${i}_${j}`,
					presetButton(
						`Group ${i}`,
						`Group ${i}`,
						signalTextColors[j],
						combineRgb(signalColors[j][0], signalColors[j][1], signalColors[j][2]),
						{
							actionId: 'hardware_signal_v4',
							options: {
								group: `${i}`,
								red: String(signalColors[j][0]),
								green: String(signalColors[j][1]),
								blue: String(signalColors[j][2]),
							},
						},
					),
				)
			}
			// End of signal color loop

			register(
				ids,
				`signal_${i}_off`,
				presetButton(`Group ${i} off`, `Group ${i} off`, white, black, {
					actionId: 'hardware_signal_v4',
					options: {
						group: `${i}`,
						red: '0',
						green: '0',
						blue: '0',
					},
				}),
			)
			signalGroups.push(group(`signal_group_${i}`, `Group ${i}`, ids))
		}
		structure.push({
			id: 'hardware_signals',
			name: 'Hardware signal colors',
			definitions: signalGroups,
		})
	}

	// End of V4 presets

	if (config.version === '3' || config.version === 'mixed') {
		const v3Groups: ClockPresetGroup[] = []

		// Timer 1
		const timer1Ids: string[] = []
		register(
			timer1Ids,
			`timer1_5min`,
			presetButton('Set 5 min countdown', `Start\\n5 min`, white, combineRgb(0, 0, 255), {
				actionId: 'start_countdown',
				options: {
					secs: '0',
					mins: '5',
					hours: '0',
				},
			}),
		)

		register(
			timer1Ids,
			`timer1_10min`,
			presetButton('Set 10 min countdown', `Start\\n10 min`, white, combineRgb(0, 0, 255), {
				actionId: 'start_countdown',
				options: {
					secs: '0',
					mins: '10',
					hours: '0',
				},
			}),
		)

		register(
			timer1Ids,
			`timer1_30min`,
			presetButton('Set 30 min countdown', `Start\\n30 min`, white, combineRgb(0, 0, 255), {
				actionId: 'start_countdown',
				options: {
					secs: '0',
					mins: '30',
					hours: '0',
				},
			}),
		)

		register(
			timer1Ids,
			`timer1_stop`,
			presetButton('Stop', `Stop`, white, combineRgb(0, 0, 255), {
				actionId: 'stop_countdown',
				options: {},
			}),
		)
		register(
			timer1Ids,
			`timer1_add1m`,
			presetButton('Add 1min', `+1\\nmin`, white, combineRgb(0, 0, 255), {
				actionId: 'modify_countdown',
				options: {
					secs: '0',
					mins: '1',
					hours: '0',
				},
			}),
		)
		register(
			timer1Ids,
			`timer1_rem1m`,
			presetButton('Remove 1min', `-1\\nmin`, white, combineRgb(0, 0, 255), {
				actionId: 'modify_countdown',
				options: {
					secs: '0',
					mins: '-1',
					hours: '0',
				},
			}),
		)
		v3Groups.push(group('timer_control', 'Timer control', timer1Ids))

		// Timer 2
		const timer2Ids: string[] = []
		register(
			timer2Ids,
			`timer2_5min`,
			presetButton('Set 5 min countdown', `Start\\n5 min`, white, combineRgb(0, 0, 255), {
				actionId: 'start_countdown2',
				options: {
					secs: '0',
					mins: '5',
					hours: '0',
				},
			}),
		)

		register(
			timer2Ids,
			`timer2_10min`,
			presetButton('Set 10 min countdown', `Start\\n10 min`, white, combineRgb(0, 0, 255), {
				actionId: 'start_countdown2',
				options: {
					secs: '0',
					mins: '10',
					hours: '0',
				},
			}),
		)

		register(
			timer2Ids,
			`timer2_30min`,
			presetButton('Set 30 min countdown', `Start\\n30 min`, white, combineRgb(0, 0, 255), {
				actionId: 'start_countdown2',
				options: {
					secs: '0',
					mins: '30',
					hours: '0',
				},
			}),
		)

		register(
			timer2Ids,
			`timer2_stop`,
			presetButton('Stop', `Stop`, white, combineRgb(0, 0, 255), {
				actionId: 'stop_countdown2',
				options: {},
			}),
		)
		register(
			timer2Ids,
			`timer2_add1m`,
			presetButton('Add 1min', `+1\\nmin`, white, combineRgb(0, 0, 255), {
				actionId: 'modify_countdown2',
				options: {
					secs: '0',
					mins: '1',
					hours: '0',
				},
			}),
		)
		register(
			timer2Ids,
			`timer2_rem1m`,
			presetButton('Remove 1min', `-1\\nmin`, white, combineRgb(0, 0, 255), {
				actionId: 'modify_countdown2',
				options: {
					secs: '0',
					mins: '-1',
					hours: '0',
				},
			}),
		)
		v3Groups.push(group('timer2_control', 'Timer 2 control', timer2Ids))

		// Misc
		const modeIds: string[] = []
		register(
			modeIds,
			`black`,
			presetButton(
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
			),
		)

		register(
			modeIds,
			`timeofday`,
			presetButton(
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
			),
		)

		register(
			modeIds,
			`count_up`,
			presetButton(
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
			),
		)

		register(
			modeIds,
			`pause`,
			presetButton(
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
			),
		)
		register(
			modeIds,
			`resume`,
			presetButton(
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
			),
		)
		v3Groups.push(group('mode', 'Mode', modeIds))

		function timeButton(text: string, buttonText: string): ClockPreset {
			return presetButton(text, buttonText, white, combineRgb(101, 0, 0), undefined, {
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

		const displayIds: string[] = []
		register(displayIds, `time_h`, timeButton('Hours', '$(label:time_h)'))
		register(displayIds, `time_m`, timeButton('Minutes', '$(label:time_m)'))
		register(displayIds, `time_s`, timeButton('Seconds', '$(label:time_s)'))

		register(displayIds, `tally`, timeButton('Tally', '$(label:tally)'))
		register(displayIds, `state`, timeButton('Clock mode', '$(label:state)'))
		register(
			displayIds,
			`paused`,
			presetButton('Pause status', '$(label:paused)', white, combineRgb(101, 0, 0), undefined, {
				feedbackId: 'pause_color',
				options: {
					running_fg: combineRgb(255, 128, 0),
					running_bg: combineRgb(0, 0, 0),
					paused_fg: combineRgb(255, 255, 255),
					paused_bg: combineRgb(0, 0, 255),
				},
			}),
		)
		v3Groups.push(group('display_time', 'Display time', displayIds))

		structure.push({
			id: 'v3',
			name: 'Version 3 protocol',
			description: 'Presets for clocks still speaking the V3 protocol',
			definitions: v3Groups,
		})
	}
	// End of V3 presets

	// Misc, partly version specific and partly shared
	const miscGroups: ClockPresetGroup[] = []

	if (config.version === '4' || config.version === 'mixed') {
		const clockIds: string[] = []
		register(
			clockIds,
			'show_info',
			presetButton('Show info overlay', 'Info', black, combineRgb(153, 255, 204), {
				actionId: 'info_v4',
				options: { duration: '30' },
			}),
		)

		register(
			clockIds,
			'pause_all',
			presetButton('Pause all timers', 'Pause\\nall', black, combineRgb(204, 255, 255), {
				actionId: 'pause_timers',
				options: {},
			}),
		)
		register(
			clockIds,
			'resume_all',
			presetButton('Resume all timers', 'Resume\\nall', black, combineRgb(204, 255, 255), {
				actionId: 'resume_timers',
				options: {},
			}),
		)

		register(
			clockIds,
			'flash',
			presetButton('Flash the screen', 'Flash', black, combineRgb(255, 255, 255), {
				actionId: 'flash_v4',
				options: {},
			}),
		)

		register(
			clockIds,
			'automation_on',
			presetButton('Signal automation on', 'Auto\\non', black, combineRgb(153, 255, 204), {
				actionId: 'automation_v4',
				options: { state: true },
			}),
		)
		register(
			clockIds,
			'automation_off',
			presetButton('Signal automation off', 'Auto\\noff', white, combineRgb(153, 0, 0), {
				actionId: 'automation_v4',
				options: { state: false },
			}),
		)
		miscGroups.push(group('clock_control', 'Clock control', clockIds))
	}

	// Common presets
	const commonIds: string[] = []
	register(
		commonIds,
		'sync',
		presetButton('Sync time', `Sync clock`, white, combineRgb(88, 23, 88), {
			actionId: 'sync_time',
			options: {},
		}),
	)

	register(
		commonIds,
		'hide_sec',
		presetButton('Hide seconds', 'Hide\\nsecs', combineRgb(255, 128, 0), black, {
			actionId: 'seconds_off',
			options: {},
		}),
	)

	register(
		commonIds,
		'show_sec',
		presetButton('Show seconds', 'Show\\nsecs', combineRgb(255, 128, 0), black, {
			actionId: 'seconds_on',
			options: {},
		}),
	)
	miscGroups.push(group('common', 'Common', commonIds))

	structure.push({
		id: 'misc',
		name: 'Misc',
		definitions: miscGroups,
	})

	return { structure, presets }
}
