import {
	Regex,
	type CompanionActionDefinitions,
	type CompanionInputFieldTextInput,
	type JsonValue,
	type OSCMetaArgument,
	type OSCSomeArguments,
} from '@companion-module/base'
import type { ClockConfig } from './config.js'

type TimerOption = { timer: string }
type TimeOptions = { secs: string; mins: string; hours: string }
type SourceOption = { source: string }
type RgbOptions = { red: string; green: string; blue: string }
type RgbaOptions = RgbOptions & { alpha: string }
type BgRgbaOptions = { bg_red: string; bg_green: string; bg_blue: string; bg_alpha: string }
type NoOptions = Record<string, never>

/** The options of every action this module can offer, used to type the definitions and the presets */
export type ClockActions = {
	// V4 timers
	start_countdown_v4: { options: TimerOption & TimeOptions }
	target_countdown_v4: { options: TimerOption & { target: string } }
	start_countup_v4: { options: TimerOption }
	target_countup_v4: { options: TimerOption & { target: string } }
	timer_modify_v4: { options: TimerOption & TimeOptions }
	timer_set_v4: { options: TimerOption & TimeOptions }
	timer_pause_v4: { options: TimerOption }
	timer_resume_v4: { options: TimerOption }
	timer_stop_v4: { options: TimerOption }
	timer_restart_v4: { options: TimerOption }
	timer_signal_v4: { options: TimerOption & RgbaOptions }
	hardware_signal_v4: { options: { group: string } & RgbOptions }
	// V4 sources
	source_hide_v4: { options: SourceOption }
	source_show_v4: { options: SourceOption }
	source_title_v4: { options: SourceOption & { title: string } }
	source_colors_v4: { options: SourceOption & RgbaOptions & BgRgbaOptions }
	title_colors_v4: { options: RgbaOptions & BgRgbaOptions }
	hide_sources_v4: { options: NoOptions }
	show_sources_v4: { options: NoOptions }
	// V4 misc
	info_v4: { options: { duration: string } }
	background_v4: { options: { bg: string } }
	send_text_v4: { options: { text: string; duration: string } & RgbaOptions & BgRgbaOptions }
	flash_v4: { options: NoOptions }
	automation_v4: { options: { state: boolean } }
	cue_right_v4: { options: NoOptions }
	cue_left_v4: { options: NoOptions }
	cue_blank_v4: { options: { state: boolean } }
	cue_blank_toggle_v4: { options: NoOptions }
	// V3
	normal_mode: { options: NoOptions }
	kill_display: { options: NoOptions }
	start_countup: { options: NoOptions }
	pause_countdown: { options: NoOptions }
	resume_countdown: { options: NoOptions }
	start_countdown: { options: TimeOptions }
	modify_countdown: { options: TimeOptions }
	stop_countdown: { options: NoOptions }
	start_countdown2: { options: TimeOptions }
	modify_countdown2: { options: TimeOptions }
	stop_countdown2: { options: NoOptions }
	send_text: { options: { text: string } & RgbOptions }
	// Common
	pause_timers: { options: NoOptions }
	resume_timers: { options: NoOptions }
	sync_time: { options: NoOptions }
	seconds_off: { options: NoOptions }
	seconds_on: { options: NoOptions }
}

// Helper functions
//
// Companion resolves variables and expressions in the option fields before handing them over, so the
// values arrive ready to use. A field left in value mode still yields the raw string it was typed as,
// and an expression can evaluate to a number, so both shapes are accepted here.
const getInt = (val: JsonValue | undefined): number => {
	if (typeof val == 'number') {
		return val
	}
	if (typeof val == 'string') {
		const v = parseInt(val)
		if (isNaN(v)) {
			return 0
		}
		return v
	}
	return 0
}

const timePayload = (options: TimeOptions): OSCMetaArgument => {
	const hours = getInt(options.hours)
	const minutes = getInt(options.mins)
	const seconds = getInt(options.secs)
	return {
		type: 'i',
		value: hours * 3600 + minutes * 60 + seconds,
	}
}

const rgbPayload = (options: RgbOptions): OSCMetaArgument[] => {
	return [
		{
			type: 'i',
			value: getInt(options.red),
		},
		{
			type: 'i',
			value: getInt(options.green),
		},
		{
			type: 'i',
			value: getInt(options.blue),
		},
	]
}

const rgbaPayload = (options: RgbaOptions): OSCMetaArgument[] => {
	return [
		...rgbPayload(options),
		{
			type: 'i',
			value: getInt(options.alpha),
		},
	]
}

const bgRgbaPayload = (options: BgRgbaOptions): OSCMetaArgument[] => {
	return [
		{
			type: 'i',
			value: getInt(options.bg_red),
		},
		{
			type: 'i',
			value: getInt(options.bg_green),
		},
		{
			type: 'i',
			value: getInt(options.bg_blue),
		},
		{
			type: 'i',
			value: getInt(options.bg_alpha),
		},
	]
}

const floatPayload = (par: JsonValue | undefined): OSCMetaArgument => {
	if (typeof par == 'number') {
		return { type: 'f', value: par }
	}
	if (typeof par != 'string') {
		return { type: 'f', value: 0.0 }
	}
	return {
		type: 'f',
		value: parseFloat(par),
	}
}

const stringPayload = (par: JsonValue | undefined): OSCMetaArgument => {
	if (typeof par == 'number') {
		return { type: 's', value: par.toString() }
	}
	if (typeof par != 'string') {
		return { type: 's', value: '' }
	}
	return {
		type: 's',
		value: par,
	}
}

// OSCMetaArgument (from @companion-module/base) only declares the 'i' | 'f' | 's' | 'b' OSC types,
// but the clock expects real OSC boolean arguments (type tags 'T'/'F', no value bytes) for options
// like checkboxes. The underlying transport supports this, so we cast around the narrow declared type.
const boolPayload = (value: JsonValue | undefined): OSCMetaArgument => {
	const v = typeof value === 'boolean' ? value : Boolean(value)
	return { type: v ? 'T' : 'F' } as unknown as OSCMetaArgument
}

type sendOscMessage = (path: string, args: OSCSomeArguments) => void
export function getActions(
	config: ClockConfig,
	oscSend: sendOscMessage,
	getState: () => ClockState,
	setCueState: (cue: string) => void,
): CompanionActionDefinitions<ClockActions> {
	const v4 = config.version === '4' || config.version === 'mixed'
	const v3 = config.version === '3' || config.version === 'mixed'

	// Common options
	const timerNumberOption: CompanionInputFieldTextInput<'timer'> = {
		type: 'textinput',
		label: 'Timer number',
		id: 'timer',
		default: '1',
		regex: Regex.NUMBER,
		useVariables: true,
	}
	const timeOptions: CompanionInputFieldTextInput<keyof TimeOptions>[] = [
		{
			type: 'textinput',
			label: 'Timer (seconds)',
			id: 'secs',
			default: '0',
			regex: Regex.NUMBER,
			useVariables: true,
		},
		{
			type: 'textinput',
			label: 'Timer (minutes)',
			id: 'mins',
			default: '1',
			regex: Regex.NUMBER,
			useVariables: true,
		},
		{
			type: 'textinput',
			label: 'Timer (hours)',
			id: 'hours',
			default: '0',
			regex: Regex.NUMBER,
			useVariables: true,
		},
	]
	// Same as timeOptions, but allowing a leading +/- for actions that add or subtract time rather than set it
	const signedTimeOptions: CompanionInputFieldTextInput<keyof TimeOptions>[] = timeOptions.map((option) => ({
		...option,
		regex: Regex.SIGNED_NUMBER,
	}))
	const sourceOption: CompanionInputFieldTextInput<'source'> = {
		type: 'textinput',
		label: 'Source number',
		id: 'source',
		default: '1',
		regex: Regex.NUMBER,
		useVariables: true,
	}
	const rgbOptions: CompanionInputFieldTextInput<keyof RgbOptions>[] = [
		{
			type: 'textinput',
			label: 'Red',
			id: 'red',
			default: '255',
			regex: Regex.NUMBER,
			useVariables: true,
		},
		{
			type: 'textinput',
			label: 'Green',
			id: 'green',
			default: '0',
			regex: Regex.NUMBER,
			useVariables: true,
		},
		{
			type: 'textinput',
			label: 'Blue',
			id: 'blue',
			default: '0',
			regex: Regex.NUMBER,
			useVariables: true,
		},
	]
	const rgbaOptions: CompanionInputFieldTextInput<keyof RgbaOptions>[] = [
		...rgbOptions,
		{
			type: 'textinput',
			label: 'Alpha',
			id: 'alpha',
			default: '255',
			regex: Regex.NUMBER,
			useVariables: true,
		},
	]
	const bgRgbaOptions: CompanionInputFieldTextInput<keyof BgRgbaOptions>[] = [
		{
			type: 'textinput',
			label: 'BG Red',
			id: 'bg_red',
			default: '255',
			regex: Regex.NUMBER,
			useVariables: true,
		},
		{
			type: 'textinput',
			label: 'BG Green',
			id: 'bg_green',
			default: '0',
			regex: Regex.NUMBER,
			useVariables: true,
		},
		{
			type: 'textinput',
			label: 'BG Blue',
			id: 'bg_blue',
			default: '0',
			regex: Regex.NUMBER,
			useVariables: true,
		},
		{
			type: 'textinput',
			label: 'BG Alpha',
			id: 'bg_alpha',
			default: '64',
			regex: Regex.NUMBER,
			useVariables: true,
		},
	]

	// Actions the configured protocol version does not offer are defined as `false`, which tells
	// Companion to hide them while keeping any existing usages of them intact.
	return {
		// V4 only actions

		// Timers
		start_countdown_v4: v4 && {
			name: 'Start a countdown timer V4',
			options: [timerNumberOption, ...timeOptions],
			callback: (event) => {
				const addr = `/clock/timer/${event.options.timer}/countdown`
				const payload: OSCSomeArguments = [timePayload(event.options)]
				oscSend(addr, payload)
			},
		},

		target_countdown_v4: v4 && {
			name: 'Start a countdown to a time V4',
			options: [
				timerNumberOption,
				{
					type: 'textinput',
					label: 'Target time (HH:MM:SS)',
					id: 'target',
					useVariables: true,
				},
			],
			callback: (event) => {
				const addr = `/clock/timer/${event.options.timer}/countdown/target`
				const payload: OSCSomeArguments = [stringPayload(event.options.target)]
				oscSend(addr, payload)
			},
		},

		start_countup_v4: v4 && {
			name: 'Start a count up timer V4',
			options: [timerNumberOption],
			callback: (event) => {
				const addr = `/clock/timer/${event.options.timer}/countup`
				oscSend(addr, [])
			},
		},

		target_countup_v4: v4 && {
			name: 'Start counting up from a time V4',
			options: [
				timerNumberOption,
				{
					type: 'textinput',
					label: 'Target time (HH:MM:SS)',
					id: 'target',
					useVariables: true,
				},
			],
			callback: (event) => {
				const addr = `/clock/timer/${event.options.timer}/countup/target`
				const payload: OSCSomeArguments = [stringPayload(event.options.target)]
				oscSend(addr, payload)
			},
		},

		timer_modify_v4: v4 && {
			name: 'Modify a running timer V4',
			options: [timerNumberOption, ...signedTimeOptions],
			callback: (event) => {
				const addr = `/clock/timer/${event.options.timer}/modify`
				const payload: OSCSomeArguments = [timePayload(event.options)]
				oscSend(addr, payload)
			},
		},

		timer_set_v4: v4 && {
			name: 'Set a timer to an external state V4',
			options: [timerNumberOption, ...timeOptions],
			callback: (event) => {
				const addr = `/clock/timer/${event.options.timer}/set`
				const payload: OSCSomeArguments = [timePayload(event.options)]
				oscSend(addr, payload)
			},
		},

		timer_pause_v4: v4 && {
			name: 'Pause a running timer V4',
			options: [timerNumberOption],
			callback: (event) => {
				const addr = `/clock/timer/${event.options.timer}/pause`
				const payload: OSCSomeArguments = []
				oscSend(addr, payload)
			},
		},

		timer_resume_v4: v4 && {
			name: 'Resume a paused timer V4',
			options: [timerNumberOption],
			callback: (event) => {
				const addr = `/clock/timer/${event.options.timer}/resume`
				const payload: OSCSomeArguments = []
				oscSend(addr, payload)
			},
		},

		timer_stop_v4: v4 && {
			name: 'Stop a running timer V4',
			options: [timerNumberOption],
			callback: (event) => {
				const addr = `/clock/timer/${event.options.timer}/stop`
				const payload: OSCSomeArguments = []
				oscSend(addr, payload)
			},
		},

		timer_restart_v4: v4 && {
			name: 'Restart a timer with its last duration V4',
			options: [timerNumberOption],
			callback: (event) => {
				const addr = `/clock/timer/${event.options.timer}/restart`
				const payload: OSCSomeArguments = []
				oscSend(addr, payload)
			},
		},

		timer_signal_v4: v4 && {
			name: 'Set signal color for timer V4',
			options: [timerNumberOption, ...rgbaOptions],
			callback: (event) => {
				const addr = `/clock/timer/${event.options.timer}/signal`
				const payload: OSCSomeArguments = [...rgbaPayload(event.options)]
				oscSend(addr, payload)
			},
		},

		hardware_signal_v4: v4 && {
			name: 'Set hardware signal color for timer V4',
			options: [
				{
					type: 'textinput',
					label: 'Signal group',
					id: 'group',
					default: '1',
					regex: Regex.NUMBER,
					useVariables: true,
				},
				...rgbOptions,
			],
			callback: (event) => {
				const addr = `/clock/signal/${event.options.group}`
				const payload: OSCSomeArguments = [...rgbPayload(event.options)]
				oscSend(addr, payload)
			},
		},

		// Source commands
		source_hide_v4: v4 && {
			name: 'Hide a time source V4',
			options: [sourceOption],
			callback: (event) => {
				const addr = `/clock/source/${event.options.source}/hide`
				const payload: OSCSomeArguments = []
				oscSend(addr, payload)
			},
		},

		source_show_v4: v4 && {
			name: 'Show a time source V4',
			options: [sourceOption],
			callback: (event) => {
				const addr = `/clock/source/${event.options.source}/show`
				const payload: OSCSomeArguments = []
				oscSend(addr, payload)
			},
		},

		source_title_v4: v4 && {
			name: 'Set source title V4',
			options: [
				sourceOption,
				{
					type: 'textinput',
					label: 'Title',
					id: 'title',
					useVariables: true,
				},
			],
			callback: (event) => {
				const addr = `/clock/source/${event.options.source}/title`
				const payload: OSCSomeArguments = [stringPayload(event.options.title)]
				oscSend(addr, payload)
			},
		},

		source_colors_v4: v4 && {
			name: 'Set source colors V4',
			options: [sourceOption, ...rgbaOptions, ...bgRgbaOptions],
			callback: (event) => {
				const addr = `/clock/source/${event.options.source}/colors`
				const payload: OSCSomeArguments = [...rgbaPayload(event.options), ...bgRgbaPayload(event.options)]
				oscSend(addr, payload)
			},
		},

		title_colors_v4: v4 && {
			name: 'Set source title colors V4',
			options: [...rgbaOptions, ...bgRgbaOptions],
			callback: (event) => {
				const addr = `/clock/titlecolors`
				const payload: OSCSomeArguments = [...rgbaPayload(event.options), ...bgRgbaPayload(event.options)]
				oscSend(addr, payload)
			},
		},

		hide_sources_v4: v4 && {
			name: 'Hide all sources V4',
			options: [],
			callback: () => {
				const addr = `/clock/hide`
				oscSend(addr, [])
			},
		},

		show_sources_v4: v4 && {
			name: 'Show all sources V4',
			options: [],
			callback: () => {
				const addr = `/clock/show`
				oscSend(addr, [])
			},
		},

		// Misc commands
		info_v4: v4 && {
			name: 'Show clock info overlay V4',
			options: [
				{
					type: 'textinput',
					label: 'Duration (seconds)',
					id: 'duration',
					default: '30',
					regex: Regex.NUMBER,
					useVariables: true,
				},
			],
			callback: (event) => {
				const addr = `/clock/info`
				const payload: OSCSomeArguments = [
					{
						type: 'i',
						value: getInt(event.options.duration),
					},
				]
				oscSend(addr, payload)
			},
		},

		background_v4: v4 && {
			name: 'Change background V4',
			options: [
				{
					type: 'textinput',
					label: 'Background number',
					id: 'bg',
					default: '1',
					regex: Regex.NUMBER,
					useVariables: true,
				},
			],
			callback: (event) => {
				const addr = `/clock/background`
				const payload: OSCSomeArguments = [
					{
						type: 'i',
						value: getInt(event.options.bg),
					},
				]
				oscSend(addr, payload)
			},
		},

		send_text_v4: v4 && {
			name: 'Send text V4',
			options: [
				{
					type: 'textinput',
					label:
						'Text (clocks running on raspberries can display 17 characters, too long messages will be replaced with INVALID TEXT)',
					id: 'text',
					default: 'stop',
					useVariables: true,
				},
				{
					type: 'textinput',
					label: 'Duration (seconds)',
					id: 'duration',
					default: '60',
					regex: Regex.NUMBER,
					useVariables: true,
				},
				...rgbaOptions,
				...bgRgbaOptions,
			],
			callback: (event) => {
				const addr = `/clock/text`
				const payload: OSCSomeArguments = [
					...rgbaPayload(event.options),
					...bgRgbaPayload(event.options),
					{
						type: 'i',
						value: getInt(event.options.duration),
					},
					stringPayload(event.options.text),
				]
				oscSend(addr, payload)
			},
		},

		flash_v4: v4 && {
			name: 'Flash the screen V4',
			options: [],
			callback: () => {
				oscSend('/clock/flash', [])
			},
		},

		automation_v4: v4 && {
			name: 'Set hardware signal automation V4',
			options: [
				{
					type: 'checkbox',
					label: 'Automation enabled',
					id: 'state',
					default: true,
				},
			],
			callback: (event) => {
				const payload: OSCSomeArguments = [boolPayload(event.options.state)]
				oscSend('/clock/automation', payload)
			},
		},

		cue_right_v4: v4 && {
			name: 'Show right arrow cue V4',
			options: [],
			callback: () => {
				const payload: OSCSomeArguments = [{ type: 's', value: '' }]
				oscSend('/clock/cue/right', payload)
				setCueState('right')
			},
		},

		cue_left_v4: v4 && {
			name: 'Show left arrow cue V4',
			options: [],
			callback: () => {
				const payload: OSCSomeArguments = [{ type: 's', value: '' }]
				oscSend('/clock/cue/left', payload)
				setCueState('left')
			},
		},

		cue_blank_v4: v4 && {
			name: 'Set blank cue V4',
			options: [
				{
					type: 'checkbox',
					label: 'Blank cue active',
					id: 'state',
					default: true,
				},
			],
			callback: (event) => {
				const active = Boolean(event.options.state)
				const payload: OSCSomeArguments = [{ type: 's', value: '' }, boolPayload(active)]
				oscSend('/clock/cue/blank', payload)
				setCueState(active ? 'blank' : 'none')
			},
		},

		cue_blank_toggle_v4: v4 && {
			name: 'Toggle blank cue V4',
			options: [],
			callback: () => {
				// Sense the currently tracked cue state (kept in sync from the clock's own /clock/cue/blank
				// broadcasts, however they were triggered - by us, or another console/panel) and flip it.
				const active = getState().cue === 'blank'
				const payload: OSCSomeArguments = [{ type: 's', value: '' }, boolPayload(!active)]
				oscSend('/clock/cue/blank', payload)
				setCueState(!active ? 'blank' : 'none')
			},
		},

		// V3 only actions
		normal_mode: v3 && {
			name: 'Display current time',
			options: [],
			callback: () => {
				oscSend('/clock/normal', [])
			},
		},
		kill_display: v3 && {
			name: 'Display off',
			options: [],
			callback: () => {
				oscSend('/clock/kill', [])
			},
		},
		start_countup: v3 && {
			name: 'Start counting up',
			options: [],
			callback: () => {
				oscSend('/clock/countup/start', [])
			},
		},
		pause_countdown: v3 && {
			name: 'Pause countdown(s)',
			options: [],
			callback: () => {
				oscSend('/clock/pause', [])
			},
		},
		resume_countdown: v3 && {
			name: 'Resume countdown(s)',
			options: [],
			callback: () => {
				oscSend('/clock/resume', [])
			},
		},
		start_countdown: v3 && {
			name: 'Primary countdown: start',
			options: [...timeOptions],
			callback: (event) => {
				const addr = `/clock/countdown/start`
				const payload: OSCSomeArguments = [timePayload(event.options)]
				oscSend(addr, payload)
			},
		},

		modify_countdown: v3 && {
			name: 'Primary countdown: modify',
			options: [...signedTimeOptions],
			callback: (event) => {
				const addr = `/clock/countdown/modify`
				const payload: OSCSomeArguments = [timePayload(event.options)]
				oscSend(addr, payload)
			},
		},
		stop_countdown: v3 && {
			name: 'Primary countdown: stop',
			options: [],
			callback: () => {
				oscSend('/clock/countdown/stop', [])
			},
		},

		start_countdown2: v3 && {
			name: 'Secondary countdown: start',
			options: [...timeOptions],
			callback: (event) => {
				const addr = `/clock/countdown2/start`
				const payload: OSCSomeArguments = [timePayload(event.options)]
				oscSend(addr, payload)
			},
		},

		modify_countdown2: v3 && {
			name: 'Secondary countdown: modify',
			options: [...signedTimeOptions],
			callback: (event) => {
				const addr = `/clock/countdown2/modify`
				const payload: OSCSomeArguments = [timePayload(event.options)]
				oscSend(addr, payload)
			},
		},

		stop_countdown2: v3 && {
			name: 'Secondary countdown: stop',
			options: [],
			callback: () => {
				oscSend('/clock/countdown2/stop', [])
			},
		},
		send_text: v3 && {
			name: 'Send text',
			options: [
				{
					type: 'textinput',
					label: 'Text',
					id: 'text',
					default: 'stop',
					useVariables: true,
				},
				...rgbOptions,
			],
			callback: (event) => {
				const addr = `/clock/display`
				const payload: OSCSomeArguments = [
					floatPayload(event.options.red),
					floatPayload(event.options.green),
					floatPayload(event.options.blue),
					stringPayload(event.options.text),
				]
				oscSend(addr, payload)
			},
		},

		// Common actions
		pause_timers: {
			name: 'Pause all timers',
			options: [],
			callback: () => {
				oscSend('/clock/pause', [])
			},
		},

		resume_timers: {
			name: 'Resume all timers',
			options: [],
			callback: () => {
				oscSend('/clock/resume', [])
			},
		},

		sync_time: {
			name: 'Sync clock time with the companion computer',
			options: [],
			callback: () => {
				const now = new Date()
				const h = now.getHours().toString().padStart(2, '0')
				const m = now.getMinutes().toString().padStart(2, '0')
				const s = now.getSeconds().toString().padStart(2, '0')
				const hms = `${h}:${m}:${s}`
				const payload: OSCSomeArguments = [{ type: 's', value: hms }]
				oscSend('/clock/time/set', payload)
			},
		},

		seconds_off: {
			name: 'Hide seconds number',
			options: [],
			callback: () => {
				oscSend('/clock/seconds/off', [])
			},
		},
		seconds_on: {
			name: 'Show seconds number',
			options: [],
			callback: () => {
				oscSend('/clock/seconds/on', [])
			},
		},
	}
}
