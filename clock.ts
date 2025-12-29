import {
	CompanionVariableDefinition,
	InstanceBase,
	InstanceStatus,
	OSCSomeArguments,
	runEntrypoint,
} from '@companion-module/base'
import OSC from 'osc'

import { ClockConfig, GetConfigFields } from './config'
import { getActions } from './actions'
import { getFeedbacks } from './feedback'
import { getPresets } from './presets'

class ClockInstance extends InstanceBase<ClockConfig> {
	private config: ClockConfig
	private feedbackState: ClockState
	private listener: any // OSC

	constructor(internal: unknown) {
		super(internal)

		let i: number

		this.config = {}

		this.feedbackState = {
			time: '00:00:00',
			tally: '',
			mode: '0',
			paused: '0',
			timers: [],
			sources: [],
			uuid: '',
			timestamp: Date.now(),
			state: '0',
		}

		for (i = 0; i < 10; i++) {
			this.feedbackState.timers.push({
				active: false,
				time: '00:00:00',
				compact: '',
				icon: '',
				paused: false,
				expired: false,
				progress: 1.0,
			})
		}

		// Source array index 0 is unused, only there to help with indexing...
		for (i = 0; i < 5; i++) {
			this.feedbackState.sources.push({
				hidden: true,
				time: '00:00:00',
				compact: '',
				icon: '',
				paused: false,
				expired: false,
				progress: 1.0,
				mode: 0,
				title: '',
			})
		}
	}

	// Return config fields for web config
	getConfigFields() {
		return GetConfigFields()
	}

	setActions() {
		const sendOscMessage = (path: string, args: OSCSomeArguments) => {
			if (this.config.host && this.config.port) {
				this.oscSend(this.config.host, parseInt(this.config.port), path, args)
			}
			if (this.config.host2 && this.config.port2) {
				this.oscSend(this.config.host2, parseInt(this.config.port2), path, args)
			}
			if (this.config.host3 && this.config.port3) {
				this.oscSend(this.config.host3, parseInt(this.config.port3), path, args)
			}
		}
		this.setActionDefinitions(getActions(this.config, sendOscMessage))
	}

	async configUpdated(config: ClockConfig) {
		this.config = config
		this.setActions()
		this.setPresetDefinitions(getPresets(this.config))
		this.init_osc()
	}

	async init(config: ClockConfig) {
		this.log('info', 'Starting initialization')
		this.config = config
		this.init_variables()
		this.setActions()
		this.setPresetDefinitions(getPresets(this.config))
		this.setFeedbackDefinitions(getFeedbacks(() => this.feedbackState))
		this.init_osc()
		this.updateStatus(InstanceStatus.Ok)
		this.log('info', 'Init done')
	}

	init_variables() {
		let i: number
		let variables: CompanionVariableDefinition[] = [
			{
				name: 'State of timer (NORMAL, COUNTUP, COUNTDOWN, OFF)',
				variableId: 'state',
			},
			{
				name: 'Current time of timer (hh:mm:ss)',
				variableId: 'time',
			},
			{
				name: 'Current time of timer (hh:mm)',
				variableId: 'time_hm',
			},
			{
				name: 'Current time of timer (hours)',
				variableId: 'time_h',
			},
			{
				name: 'Current time of timer (minutes)',
				variableId: 'time_m',
			},
			{
				name: 'Current time of timer (seconds)',
				variableId: 'time_s',
			},
			{
				name: 'Current tally text',
				variableId: 'tally',
			},
			{
				name: 'Pause state',
				variableId: 'paused',
			},
		]

		for (i = 0; i < 10; i++) {
			variables = variables.concat([
				{
					name: `Timer ${i} icon`,
					variableId: `timer_${i}_icon`,
				},
				{
					name: `Timer ${i} hours`,
					variableId: `timer_${i}_hours`,
				},
				{
					name: `Timer ${i} minutes`,
					variableId: `timer_${i}_minutes`,
				},
				{
					name: `Timer ${i} seconds`,
					variableId: `timer_${i}_seconds`,
				},
			])
		}

		for (i = 1; i < 5; i++) {
			variables = variables.concat([
				{
					name: `Source ${i} icon`,
					variableId: `source_${i}_icon`,
				},
				{
					name: `Source ${i} hours`,
					variableId: `source_${i}_hours`,
				},
				{
					name: `Source ${i} minutes`,
					variableId: `source_${i}_minutes`,
				},
				{
					name: `Source ${i} seconds`,
					variableId: `source_${i}_seconds`,
				},
			])
		}

		this.setVariableDefinitions(variables)
		this.updateState()
	}

	updateState() {
		let i: number

		// Timers
		for (i = 0; i < 10; i++) {
			this.updateTimerVariables(i)
		}

		// Sources
		for (i = 1; i < 5; i++) {
			this.updateSourceVariables(i)
		}

		this.updateLegacyState()
	}

	updateTimerVariables(timer: number) {
		let hours: string
		let mins: string
		let secs: string
		let icon: string

		if (this.feedbackState.timers[timer].active) {
			const parts = this.feedbackState.timers[timer].time.split(':')
			if (parts.length === 4) {
				// LTC active
				icon = parts[0]
				hours = parts[1]
				mins = parts[2]
				secs = parts[3]
			} else if (parts.length === 3) {
				icon = this.feedbackState.timers[timer].icon
				hours = parts[0]
				mins = parts[1]
				secs = parts[2]
			} else if (parts.length === 2) {
				icon = this.feedbackState.timers[timer].icon
				hours = ''
				mins = parts[0]
				secs = parts[1]
			} else {
				hours = ''
				mins = ''
				secs = ''
				icon = ''
			}
		} else {
			hours = ''
			mins = ''
			secs = ''
			icon = ''
		}

		// Replace the pause symbol with something in the font Companion uses
		icon = icon.replace('Ⅱ', '⏸︎')

		this.setVariableValues({
			[`timer_${timer}_icon`]: icon,
			[`timer_${timer}_hours`]: hours,
			[`timer_${timer}_minutes`]: mins,
			[`timer_${timer}_seconds`]: secs,
		})
	}

	updateSourceVariables(source: number) {
		let hours: string
		let mins: string
		let secs: string
		let icon: string

		if (this.feedbackState.sources[source].hidden === false) {
			const parts = this.feedbackState.sources[source].time.split(':')
			if (parts.length === 4) {
				// LTC active
				icon = parts[0]
				hours = parts[1]
				mins = parts[2]
				secs = parts[3]
			} else if (parts.length === 3) {
				icon = this.feedbackState.sources[source].icon
				hours = parts[0]
				mins = parts[1]
				secs = parts[2]
			} else {
				hours = ''
				mins = ''
				secs = ''
				icon = ''
			}
		} else {
			hours = ''
			mins = ''
			secs = ''
			icon = ''
		}
		// Replace the pause symbol with something in the font Companion uses
		icon = icon.replace('Ⅱ', '⏸︎')

		this.setVariableValues({
			[`source_${source}_icon`]: icon,
			[`source_${source}_hours`]: hours,
			[`source_${source}_minutes`]: mins,
			[`source_${source}_seconds`]: secs,
		})
	}

	updateLegacyState() {
		const info = this.feedbackState.time.split(':')
		const states: StateMap = {
			0: 'NORMAL',
			1: 'COUNTDOWN',
			2: 'COUNTUP',
			3: 'OFF',
			4: 'PAUSED',
		}
		const pause: StateMap = {
			0: 'Run\\nning',
			1: 'Pau\\nsed',
		}

		if (info[0].length === 0) {
			this.setVariableValues({
				time: `${info[1]}:${info[2]}`,
				time_hm: `00:${info[1]}`,
			})
		} else {
			this.setVariableValues({
				time: this.feedbackState.time,
				time_hm: `${info[0]}:${info[1]}`,
			})
		}
		this.setVariableValues({
			time_h: info[0],
			time_m: info[1],
			time_s: info[2],
			state: states[this.feedbackState.state],
			tally: this.feedbackState.tally,
			paused: pause[this.feedbackState.paused],
		})
	}

	init_osc() {
		this.log('info', 'Starting OSC listener')

		const statePattern = /^\/clock\/(timer|source)\/([0-9])\/state/
		const timerPattern = /^\/clock\/timer\/([0-9])\/state/
		const sourcePattern = /^\/clock\/source\/([1-4])\/state/
		if (this.listener) {
			this.listener.close()
		}
		this.listener = new OSC.UDPPort({
			localAddress: '0.0.0.0',
			localPort: this.config.localport,
			metadata: true,
		})

		this.listener.on('error', (_error: any) => {
			this.log('error', 'OSC received low level error, retrying after timeout')
			setTimeout(() => {
				this.init_osc()
			}, 5000)
		})

		this.listener.open()
		this.listener.on('ready', function setReady() {
			// this.ready = true
		})
		this.listener.on('message', (message: any) => {
			let a
			let mode

			// Legacy V3 state message
			if (message.address.match(/^\/clock\/state/)) {
				if (message.args.length >= 5) {
					a = message.args
					mode = a[0].value
					this.feedbackState.state = mode
					this.feedbackState.time = `${a[1].value}:${a[2].value}:${a[3].value}`
					this.feedbackState.tally = a[4].value
					this.updateLegacyState()
					this.checkFeedbacks('state_color')
				}
				if (message.args.length === 6) {
					this.feedbackState.paused = message.args[5].value
					this.updateLegacyState()
					this.checkFeedbacks('pause_color')
				}
			}

			// V4 state messages
			if (message.address.match(statePattern) && message.args.length > 0) {
				if (this.feedbackState.uuid === message.args[0].value || this.feedbackState.timestamp < Date.now() - 1000) {
					this.feedbackState.uuid = message.args[0].value
					this.feedbackState.timestamp = Date.now()
				} else {
					// Missmatched UUID and previous clock hasn't timed out
					return
				}

				// Timer state messages
				if (message.address.match(timerPattern)) {
					if (message.args.length === 8) {
						const timer = message.address.match(timerPattern)[1]
						const args = message.args
						this.feedbackState.timers[timer] = {
							active: args[1].value,
							time: args[2].value,
							compact: args[3].value,
							icon: args[4].value,
							progress: args[5].value,
							expired: args[6].value,
							paused: args[7].value,
						}
						this.updateTimerVariables(timer)
					}
				} else if (message.address.match(sourcePattern)) {
					if (message.args.length === 10) {
						const source = message.address.match(sourcePattern)[1]
						const args = message.args
						this.feedbackState.sources[source] = {
							hidden: args[1].value,
							time: args[2].value,
							compact: args[3].value,
							icon: args[4].value,
							progress: args[5].value,
							expired: args[6].value,
							paused: args[7].value,
							title: args[8].value,
							mode: args[9].value,
						}
						this.updateSourceVariables(source)
					}
				}
			}
		})
	}

	// When module gets deleted
	async destroy() {
		if (this.listener) {
			this.listener.close()
		}
	}
}

runEntrypoint(ClockInstance, [])
// UpgradeScripts)
