import {
	CompanionActionDefinitions,
	CompanionOptionValues,
	InputValue,
	OSCMetaArgument,
	OSCSomeArguments,
	Regex,
	SomeCompanionActionInputField,
} from '@companion-module/base'
import { ClockConfig } from './config'

// Helper functions
const getInt = async (val: InputValue | undefined, context: any): Promise<number> => {
	if (typeof val == 'number') {
		return val
	}
	if (typeof val == 'string') {
		const parsedValue = await context.parseVariablesInString(val)
		const v = parseInt(parsedValue)
		if (isNaN(v)) {
			return 0
		}
		return v
	}
	return 0
}

const timePayload = async (options: CompanionOptionValues, context: any): Promise<OSCMetaArgument> => {
	const hours = await getInt(options.hours, context)
	const minutes = await getInt(options.mins, context)
	const seconds = await getInt(options.secs, context)
	return {
		type: 'i',
		value: hours * 3600 + minutes * 60 + seconds,
	}
}

const rgbPayload = async (options: CompanionOptionValues, context: any): Promise<OSCMetaArgument[]> => {
	return [
		{
			type: 'i',
			value: await getInt(options.red, context),
		},
		{
			type: 'i',
			value: await getInt(options.green, context),
		},
		{
			type: 'i',
			value: await getInt(options.blue, context),
		},
	]
}

const rgbaPayload = async (options: CompanionOptionValues, context: any): Promise<OSCMetaArgument[]> => {
	return [
		...(await rgbPayload(options, context)),
		{
			type: 'i',
			value: await getInt(options.alpha, context),
		},
	]
}

const bgRgbaPayload = async (options: CompanionOptionValues, context: any): Promise<OSCMetaArgument[]> => {
	return [
		{
			type: 'i',
			value: await getInt(options.bg_red, context),
		},
		{
			type: 'i',
			value: await getInt(options.bg_green, context),
		},
		{
			type: 'i',
			value: await getInt(options.bg_blue, context),
		},
		{
			type: 'i',
			value: await getInt(options.bg_alpha, context),
		},
	]
}

const floatPayload = async (par: InputValue | undefined, context: any): Promise<OSCMetaArgument> => {
	if (typeof par == 'number') {
		return { type: 'f', value: par }
	}
	if (typeof par != 'string') {
		return { type: 'f', value: 0.0 }
	}
	const parsedValue = await context.parseVariablesInString(par)
	return {
		type: 'f',
		value: parseFloat(parsedValue),
	}
}

const stringPayload = async (par: InputValue | undefined, context: any): Promise<OSCMetaArgument> => {
	if (typeof par == 'number') {
		return { type: 's', value: par.toString() }
	}
	if (typeof par != 'string') {
		return { type: 's', value: '' }
	}
	const parsedValue = await context.parseVariablesInString(par)
	return {
		type: 's',
		value: parsedValue,
	}
}

type sendOscMessage = (path: string, args: OSCSomeArguments) => void
export function getActions(config: ClockConfig, oscSend: sendOscMessage): CompanionActionDefinitions {
	const actions: CompanionActionDefinitions = {}

	// Common options
	const timerNumberOption: SomeCompanionActionInputField = {
		type: 'textinput',
		label: 'Timer number',
		id: 'timer',
		default: '1',
		regex: Regex.NUMBER,
	}
	const timeOptions: SomeCompanionActionInputField[] = [
		{
			type: 'textinput',
			label: 'Timer (seconds)',
			id: 'secs',
			default: '0',
			regex: Regex.NUMBER,
		},
		{
			type: 'textinput',
			label: 'Timer (minutes)',
			id: 'mins',
			default: '1',
			regex: Regex.NUMBER,
		},
		{
			type: 'textinput',
			label: 'Timer (hours)',
			id: 'hours',
			default: '0',
			regex: Regex.NUMBER,
		},
	]
	const sourceOption: SomeCompanionActionInputField = {
		type: 'textinput',
		label: 'Source number',
		id: 'source',
		default: '1',
		regex: Regex.NUMBER,
	}
	const rgbOptions: SomeCompanionActionInputField[] = [
		{
			type: 'textinput',
			label: 'Red',
			id: 'red',
			default: '255',
			regex: Regex.NUMBER,
		},
		{
			type: 'textinput',
			label: 'Green',
			id: 'green',
			default: '0',
			regex: Regex.NUMBER,
		},
		{
			type: 'textinput',
			label: 'Blue',
			id: 'blue',
			default: '0',
			regex: Regex.NUMBER,
		},
	]
	const rgbaOptions: SomeCompanionActionInputField[] = [
		...rgbOptions,
		{
			type: 'textinput',
			label: 'Alpha',
			id: 'alpha',
			default: '255',
			regex: Regex.NUMBER,
		},
	]
	const bgRgbaOptions: SomeCompanionActionInputField[] = [
		{
			type: 'textinput',
			label: 'BG Red',
			id: 'bg_red',
			default: '255',
			regex: Regex.NUMBER,
		},
		{
			type: 'textinput',
			label: 'BG Green',
			id: 'bg_green',
			default: '0',
			regex: Regex.NUMBER,
		},
		{
			type: 'textinput',
			label: 'BG Blue',
			id: 'bg_blue',
			default: '0',
			regex: Regex.NUMBER,
		},
		{
			type: 'textinput',
			label: 'BG Alpha',
			id: 'bg_alpha',
			default: '64',
			regex: Regex.NUMBER,
		},
	]

	if (config.version === '4' || config.version === 'mixed') {
		// V4 only actions

		// Timers
		actions.start_countdown_v4 = {
			name: 'Start a countdown timer V4',
			options: [timerNumberOption, ...timeOptions],
			callback: async (event, context) => {
				const addr = `/clock/timer/${event.options.timer}/countdown`
				const payload: OSCSomeArguments = [await timePayload(event.options, context)]
				oscSend(addr, payload)
			},
		}

		actions.target_countdown_v4 = {
			name: 'Start a countdown to a time V4',
			options: [
				timerNumberOption,
				{
					type: 'textinput',
					label: 'Target time (HH:MM:SS)',
					id: 'target',
				},
			],
			callback: async (event, context) => {
				const addr = `/clock/timer/${event.options.timer}/countdown/target`
				const payload: OSCSomeArguments = [await stringPayload(event.options.target, context)]
				oscSend(addr, payload)
			},
		}

		actions.start_countup_v4 = {
			name: 'Start a count up timer V4',
			options: [timerNumberOption],
			callback: async (event) => {
				const addr = `/clock/timer/${event.options.timer}/countup`
				oscSend(addr, [])
			},
		}

		actions.target_countup_v4 = {
			name: 'Start counting up from a time V4',
			options: [
				timerNumberOption,
				{
					type: 'textinput',
					label: 'Target time (HH:MM:SS)',
					id: 'target',
				},
			],
			callback: async (event, context) => {
				const addr = `/clock/timer/${event.options.timer}/countup/target`
				const payload: OSCSomeArguments = [await stringPayload(event.options.target, context)]
				oscSend(addr, payload)
			},
		}

		actions.timer_modify_v4 = {
			name: 'Modify a running timer V4',
			options: [timerNumberOption, ...timeOptions],
			callback: async (event, context) => {
				const addr = `/clock/timer/${event.options.timer}/modify`
				const payload: OSCSomeArguments = [await timePayload(event.options, context)]
				oscSend(addr, payload)
			},
		}

		actions.timer_pause_v4 = {
			name: 'Pause a running timer V4',
			options: [timerNumberOption],
			callback: async (event) => {
				const addr = `/clock/timer/${event.options.timer}/pause`
				const payload: OSCSomeArguments = []
				oscSend(addr, payload)
			},
		}

		actions.timer_resume_v4 = {
			name: 'Resume a paused timer V4',
			options: [timerNumberOption],
			callback: async (event) => {
				const addr = `/clock/timer/${event.options.timer}/resume`
				const payload: OSCSomeArguments = []
				oscSend(addr, payload)
			},
		}

		actions.timer_stop_v4 = {
			name: 'Stop a running timer V4',
			options: [timerNumberOption],
			callback: async (event) => {
				const addr = `/clock/timer/${event.options.timer}/stop`
				const payload: OSCSomeArguments = []
				oscSend(addr, payload)
			},
		}

		actions.timer_signal_v4 = {
			name: 'Set signal color for timer V4',
			options: [timerNumberOption, ...rgbaOptions],
			callback: async (event, context) => {
				const addr = `/clock/timer/${event.options.timer}/signal`
				const payload: OSCSomeArguments = [...(await rgbaPayload(event.options, context))]
				oscSend(addr, payload)
			},
		}

		actions.hardware_signal_v4 = {
			name: 'Set hardware signal color for timer V4',
			options: [
				{
					type: 'textinput',
					label: 'Signal group',
					id: 'group',
					default: '1',
					regex: Regex.NUMBER,
				},
				...rgbOptions,
			],
			callback: async (event, context) => {
				const addr = `/clock/signal/${event.options.group}`
				const payload: OSCSomeArguments = [...(await rgbPayload(event.options, context))]
				oscSend(addr, payload)
			},
		}

		// Source commands
		actions.source_hide_v4 = {
			name: 'Hide a time source V4',
			options: [sourceOption],
			callback: async (event) => {
				const addr = `/clock/timer/${event.options.source}/hide`
				const payload: OSCSomeArguments = []
				oscSend(addr, payload)
			},
		}

		actions.source_show_v4 = {
			name: 'Show a time source V4',
			options: [sourceOption],
			callback: async (event) => {
				const addr = `/clock/timer/${event.options.source}/show`
				const payload: OSCSomeArguments = []
				oscSend(addr, payload)
			},
		}

		actions.source_title_v4 = {
			name: 'Set source title V4',
			options: [
				sourceOption,
				{
					type: 'textinput',
					label: 'Title',
					id: 'title',
				},
			],
			callback: async (event, context) => {
				const addr = `/clock/timer/${event.options.source}/title`
				const payload: OSCSomeArguments = [await stringPayload(event.options.title, context)]
				oscSend(addr, payload)
			},
		}

		actions.source_colors_v4 = {
			name: 'Set source colors V4',
			options: [sourceOption, ...rgbaOptions, ...bgRgbaOptions],
			callback: async (event, context) => {
				const addr = `/clock/timer/${event.options.source}/colors`
				const payload: OSCSomeArguments = [
					...(await rgbaPayload(event.options, context)),
					...(await bgRgbaPayload(event.options, context)),
				]
				oscSend(addr, payload)
			},
		}

		actions.title_colors_v4 = {
			name: 'Set source title colors V4',
			options: [...rgbaOptions, ...bgRgbaOptions],
			callback: async (event, context) => {
				const addr = `/clock/titlecolors`
				const payload: OSCSomeArguments = [
					...(await rgbaPayload(event.options, context)),
					...(await bgRgbaPayload(event.options, context)),
				]
				oscSend(addr, payload)
			},
		}

		actions.hide_sources_v4 = {
			name: 'Hide all sources V4',
			options: [],
			callback: async (_event) => {
				const addr = `/clock/hide`
				oscSend(addr, [])
			},
		}

		actions.show_sources_v4 = {
			name: 'Show all sources V4',
			options: [],
			callback: async (_event) => {
				const addr = `/clock/show`
				oscSend(addr, [])
			},
		}

		// Misc commands
		actions.info_v4 = {
			name: 'Show clock info overlay V4',
			options: [
				{
					type: 'textinput',
					label: 'Duration (seconds)',
					id: 'duration',
					default: '30',
					regex: Regex.NUMBER,
				},
			],
			callback: async (event, context) => {
				const addr = `/clock/info`
				const payload: OSCSomeArguments = [
					{
						type: 'i',
						value: await getInt(event.options.duration, context),
					},
				]
				oscSend(addr, payload)
			},
		}

		actions.background_v4 = {
			name: 'Change background V4',
			options: [
				{
					type: 'textinput',
					label: 'Background number',
					id: 'bg',
					default: '1',
					regex: Regex.NUMBER,
				},
			],
			callback: async (event, context) => {
				const addr = `/clock/background`
				const payload: OSCSomeArguments = [
					{
						type: 'i',
						value: await getInt(event.options.bg, context),
					},
				]
				oscSend(addr, payload)
			},
		}

		actions.send_text_v4 = {
			name: 'Send text V4',
			options: [
				{
					type: 'textinput',
					label:
						'Text (clocks running on raspberries can display 17 characters, too long messages will be replaced with INVALID TEXT)',
					id: 'text',
					default: 'stop',
				},
				{
					type: 'textinput',
					label: 'Duration (seconds)',
					id: 'duration',
					default: '60',
					regex: Regex.NUMBER,
				},
				...rgbaOptions,
				...bgRgbaOptions,
			],
			callback: async (event, context) => {
				const addr = `/clock/text`
				const payload: OSCSomeArguments = [
					...(await rgbaPayload(event.options, context)),
					...(await bgRgbaPayload(event.options, context)),
					{
						type: 'i',
						value: event.options.duration as number,
					},
					await stringPayload(event.options.text, context),
				]
				oscSend(addr, payload)
			},
		}
	}

	if (config.version === '3' || config.version === 'mixed') {
		// V3 only actions
		actions.normal_mode = {
			name: 'Display current time',
			options: [],
			callback: async (_event) => {
				oscSend('/clock/normal', [])
			},
		}
		actions.kill_display = {
			name: 'Display off',
			options: [],
			callback: async (_event) => {
				oscSend('/clock/kill', [])
			},
		}
		actions.start_countup = {
			name: 'Start counting up',
			options: [],
			callback: async (_event) => {
				oscSend('/clock/countup/start', [])
			},
		}
		actions.pause_countdown = {
			name: 'Pause countdown(s)',
			options: [],
			callback: async (_event) => {
				oscSend('/clock/pause', [])
			},
		}
		actions.resume_countdown = {
			name: 'Resume countdown(s)',
			options: [],
			callback: async (_event) => {
				oscSend('/clock/resume', [])
			},
		}
		actions.start_countdown = {
			name: 'Primary countdown: start',
			options: [...timeOptions],
			callback: async (event, context) => {
				const addr = `/clock/countdown/start`
				const payload: OSCSomeArguments = [await timePayload(event.options, context)]
				oscSend(addr, payload)
			},
		}

		actions.modify_countdown = {
			name: 'Primary countdown: modify',
			options: [...timeOptions],
			callback: async (event, context) => {
				const addr = `/clock/countdown/modify`
				const payload: OSCSomeArguments = [await timePayload(event.options, context)]
				oscSend(addr, payload)
			},
		}
		actions.stop_countdown = {
			name: 'Primary countdown: stop',
			options: [],
			callback: async (_event) => {
				oscSend('/clock/countdown/stop', [])
			},
		}

		actions.start_countdown2 = {
			name: 'Secondary countdown: start',
			options: [...timeOptions],
			callback: async (event, context) => {
				const addr = `/clock/countdown2/start`
				const payload: OSCSomeArguments = [await timePayload(event.options, context)]
				oscSend(addr, payload)
			},
		}

		actions.modify_countdown2 = {
			name: 'Secondary countdown: modify',
			options: [...timeOptions],
			callback: async (event, context) => {
				const addr = `/clock/countdown2/modify`
				const payload: OSCSomeArguments = [await timePayload(event.options, context)]
				oscSend(addr, payload)
			},
		}

		actions.stop_countdown2 = {
			name: 'Secondary countdown: stop',
			options: [],
			callback: async (_event) => {
				oscSend('/clock/countdown2/stop', [])
			},
		}
		actions.send_text = {
			name: 'Send text',
			options: [
				{
					type: 'textinput',
					label: 'Text',
					id: 'text',
					default: 'stop',
				},
				...rgbOptions,
			],
			callback: async (event, context) => {
				const addr = `/clock/display`
				const payload: OSCSomeArguments = [
					await floatPayload(event.options.red, context),
					await floatPayload(event.options.green, context),
					await floatPayload(event.options.blue, context),
					await stringPayload(event.options.text, context),
				]
				oscSend(addr, payload)
			},
		}
	}

	// Common actions
	actions.pause_timers = {
		name: 'Pause all timers',
		options: [],
		callback: async (_event) => {
			oscSend('/clock/pause', [])
		},
	}

	actions.resume_timers = {
		name: 'Resume all timers',
		options: [],
		callback: async (_event) => {
			oscSend('/clock/resume', [])
		},
	}

	actions.sync_time = {
		name: 'Sync clock time with the companion computer',
		options: [],
		callback: async (_event) => {
			const now = new Date()
			const h = now.getHours().toString().padStart(2, '0')
			const m = now.getMinutes().toString().padStart(2, '0')
			const s = now.getSeconds().toString().padStart(2, '0')
			const hms = `${h}:${m}:${s}`
			const payload: OSCSomeArguments = [{ type: 's', value: hms }]
			oscSend('/clock/time/set', payload)
		},
	}

	actions.seconds_off = {
		name: 'Hide seconds number',
		options: [],
		callback: async (_event) => {
			oscSend('/clock/seconds/off', [])
		},
	}
	actions.seconds_on = {
		name: 'Show seconds number',
		options: [],
		callback: async (_event) => {
			oscSend('/clock/seconds/on', [])
		},
	}

	return actions
}
