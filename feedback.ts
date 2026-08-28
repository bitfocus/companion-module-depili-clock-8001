import {
	combineRgb,
	splitRgb,
	type CompanionAdvancedFeedbackResult,
	type CompanionFeedbackDefinitions,
	type CompanionInputFieldNumber,
	type DropdownChoice,
	type JsonValue,
} from '@companion-module/base'

// How long the left/right cue highlight takes to fade back out, in milliseconds. Must match clock.ts.
const CUE_FADE_MS = 2000
// Half-cycle length for the blank cue's optional blink, in milliseconds
const BLINK_PHASE_MS = 500

/**
 * The clock states as reported by the V3 /clock/state message, in the order the protocol numbers
 * them. Shared with clock.ts, which renders the same labels into the 'state' variable.
 */
export const CLOCK_STATES: DropdownChoice[] = [
	{ id: '0', label: 'NORMAL' },
	{ id: '1', label: 'COUNTDOWN' },
	{ id: '2', label: 'COUNTUP' },
	{ id: '3', label: 'OFF' },
	{ id: '4', label: 'PAUSED' },
]

type StateColorOptions = {
	normal_fg: number
	normal_bg: number
	countdown_fg: number
	countdown_bg: number
	paused_fg: number
	paused_bg: number
	countup_fg: number
	countup_bg: number
	off_fg: number
	off_bg: number
}
type PauseColorOptions = {
	running_fg: number
	running_bg: number
	paused_fg: number
	paused_bg: number
}
type CueColorOptions = { fg: number; bg: number }

/** The type and options of every feedback this module offers, used to type the definitions and the presets */
export type ClockFeedbacks = {
	// Boolean feedbacks. These only decide whether they match; the style is the user's to pick, and
	// they can also be used as trigger conditions.
	clock_state: { type: 'boolean'; options: { state: string } }
	clock_paused: { type: 'boolean'; options: Record<string, never> }
	cue_left: { type: 'boolean'; options: Record<string, never> }
	cue_right: { type: 'boolean'; options: Record<string, never> }
	cue_blank: { type: 'boolean'; options: { blink: boolean } }
	timer_active: { type: 'boolean'; options: { timer: number } }
	timer_expired: { type: 'boolean'; options: { timer: number } }
	timer_paused: { type: 'boolean'; options: { timer: number } }
	source_visible: { type: 'boolean'; options: { source: number } }
	source_expired: { type: 'boolean'; options: { source: number } }
	source_paused: { type: 'boolean'; options: { source: number } }
	// The original advanced feedbacks, kept so existing buttons carry on working. Two of them still
	// do something the boolean variants cannot: state_color picks a different colour per state from
	// a single feedback, and the arrow cues fade their highlight back out.
	state_color: { type: 'advanced'; options: StateColorOptions }
	pause_color: { type: 'advanced'; options: PauseColorOptions }
	cue_left_active: { type: 'advanced'; options: CueColorOptions }
	cue_right_active: { type: 'advanced'; options: CueColorOptions }
	cue_blank_active: { type: 'advanced'; options: CueColorOptions & { blink: boolean } }
}

// Colorpicker options normally come back as a color number, but a field switched to expression mode
// can evaluate to a numeric string, so both are accepted
function colorValue(val: JsonValue | undefined, fallback: number): number {
	if (typeof val === 'number') {
		return val
	}
	if (typeof val === 'string') {
		const n = parseInt(val, 10)
		return isNaN(n) ? fallback : n
	}
	return fallback
}

// Fades a color towards black as elapsedMs approaches fadeMs
function fadeColor(color: number, elapsedMs: number, fadeMs: number): number {
	const { r, g, b } = splitRgb(color)
	const t = Math.max(0, 1 - elapsedMs / fadeMs)
	return combineRgb(Math.round(r * t), Math.round(g * t), Math.round(b * t))
}

/**
 * The timer and source pickers are number fields, but an expression can evaluate to anything, so the
 * index is checked against the array before it is used. An out of range pick reports false rather
 * than throwing.
 */
function stateAt<T>(states: T[], option: JsonValue | undefined): T | undefined {
	const index = typeof option === 'number' ? option : typeof option === 'string' ? parseInt(option, 10) : NaN
	if (!Number.isInteger(index) || index < 0 || index >= states.length) {
		return undefined
	}
	return states[index]
}

/** True while the named cue is showing, over the same window the advanced variant fades across */
function cueIsActive(state: ClockState, cue: string): boolean {
	if (state.cue !== cue) {
		return false
	}
	return Date.now() - state.cueTimestamp < CUE_FADE_MS
}

export function getFeedbacks(getState: () => ClockState): CompanionFeedbackDefinitions<ClockFeedbacks> {
	const timerOption: CompanionInputFieldNumber<'timer'> = {
		type: 'number',
		label: 'Timer number',
		id: 'timer',
		default: 1,
		min: 0,
		max: 9,
		asInteger: true,
	}
	const sourceOption: CompanionInputFieldNumber<'source'> = {
		type: 'number',
		label: 'Source number',
		id: 'source',
		default: 1,
		min: 1,
		max: 4,
		asInteger: true,
	}

	return {
		clock_state: {
			type: 'boolean',
			name: 'Clock is in state',
			description: 'True while the clock reports the selected state',
			defaultStyle: {
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 0, 255),
			},
			options: [
				{
					type: 'dropdown',
					label: 'State',
					id: 'state',
					choices: CLOCK_STATES,
					default: '0',
					// Referenced by the feedback itself rather than computed, and the choices are fixed
					disableAutoExpression: true,
				},
			],
			callback: (feedback) => {
				return getState().state === String(feedback.options.state)
			},
		},
		clock_paused: {
			type: 'boolean',
			name: 'Clock is paused',
			description: 'True while the clock reports its timers as paused',
			defaultStyle: {
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 0, 255),
			},
			options: [],
			callback: () => {
				return getState().paused === '1'
			},
		},
		cue_left: {
			type: 'boolean',
			name: 'Cue: left arrow is active',
			description: 'True for a couple of seconds after the left arrow cue is shown',
			defaultStyle: {
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(200, 0, 0),
			},
			options: [],
			callback: () => {
				return cueIsActive(getState(), 'left')
			},
		},
		cue_right: {
			type: 'boolean',
			name: 'Cue: right arrow is active',
			description: 'True for a couple of seconds after the right arrow cue is shown',
			defaultStyle: {
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 153, 0),
			},
			options: [],
			callback: () => {
				return cueIsActive(getState(), 'right')
			},
		},
		cue_blank: {
			type: 'boolean',
			name: 'Cue: blank is active',
			description: 'True while the blank cue is currently active on the clock',
			defaultStyle: {
				color: combineRgb(0, 0, 0),
				bgcolor: combineRgb(255, 255, 0),
			},
			options: [
				{
					type: 'checkbox',
					label: 'Blink',
					id: 'blink',
					default: false,
					// Purely a presentation toggle for this feedback, nothing worth driving from an expression
					disableAutoExpression: true,
				},
			],
			callback: (feedback) => {
				if (getState().cue !== 'blank') {
					return false
				}
				if (feedback.options.blink && Math.floor(Date.now() / BLINK_PHASE_MS) % 2 === 1) {
					return false
				}
				return true
			},
		},
		timer_active: {
			type: 'boolean',
			name: 'Timer is active',
			description: 'True while the selected V4 timer is running',
			defaultStyle: {
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 153, 0),
			},
			options: [timerOption],
			callback: (feedback) => {
				return stateAt(getState().timers, feedback.options.timer)?.active === true
			},
		},
		timer_expired: {
			type: 'boolean',
			name: 'Timer has expired',
			description: 'True while the selected V4 timer has run past zero',
			defaultStyle: {
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(255, 0, 0),
			},
			options: [timerOption],
			callback: (feedback) => {
				return stateAt(getState().timers, feedback.options.timer)?.expired === true
			},
		},
		timer_paused: {
			type: 'boolean',
			name: 'Timer is paused',
			description: 'True while the selected V4 timer is paused',
			defaultStyle: {
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 0, 255),
			},
			options: [timerOption],
			callback: (feedback) => {
				return stateAt(getState().timers, feedback.options.timer)?.paused === true
			},
		},
		source_visible: {
			type: 'boolean',
			name: 'Source is visible',
			description: 'True while the selected V4 time source is shown. Invert it to catch a hidden source',
			defaultStyle: {
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 153, 0),
			},
			options: [sourceOption],
			callback: (feedback) => {
				return stateAt(getState().sources, feedback.options.source)?.hidden === false
			},
		},
		source_expired: {
			type: 'boolean',
			name: 'Source has expired',
			description: 'True while the selected V4 time source has run past zero',
			defaultStyle: {
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(255, 0, 0),
			},
			options: [sourceOption],
			callback: (feedback) => {
				return stateAt(getState().sources, feedback.options.source)?.expired === true
			},
		},
		source_paused: {
			type: 'boolean',
			name: 'Source is paused',
			description: 'True while the selected V4 time source is paused',
			defaultStyle: {
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 0, 255),
			},
			options: [sourceOption],
			callback: (feedback) => {
				return stateAt(getState().sources, feedback.options.source)?.paused === true
			},
		},
		state_color: {
			type: 'advanced',
			name: 'Change color from state (advanced)',
			sortName: 'zz Change color from state',
			description:
				'Sets its own colors, one set per clock state. Prefer the boolean feedback unless you need several states covered by a single feedback',
			affectedProperties: ['color', 'bgcolor'],
			options: [
				{
					type: 'colorpicker',
					label: 'Normal: Foreground color',
					id: 'normal_fg',
					default: combineRgb(255, 255, 255),
				},
				{
					type: 'colorpicker',
					label: 'Normal: Background color',
					id: 'normal_bg',
					default: combineRgb(255, 0, 0),
				},
				{
					type: 'colorpicker',
					label: 'Countdown: Foreground color',
					id: 'countdown_fg',
					default: combineRgb(255, 255, 255),
				},
				{
					type: 'colorpicker',
					label: 'Countdown: Background color',
					id: 'countdown_bg',
					default: combineRgb(255, 0, 0),
				},
				{
					type: 'colorpicker',
					label: 'Paused countdown: Foreground color',
					id: 'paused_fg',
					default: combineRgb(128, 128, 128),
				},
				{
					type: 'colorpicker',
					label: 'Paused Countdown: Background color',
					id: 'paused_bg',
					default: combineRgb(128, 0, 0),
				},
				{
					type: 'colorpicker',
					label: 'Count up: Foreground color',
					id: 'countup_fg',
					default: combineRgb(255, 255, 255),
				},
				{
					type: 'colorpicker',
					label: 'Count up: Background color',
					id: 'countup_bg',
					default: combineRgb(255, 0, 0),
				},
				{
					type: 'colorpicker',
					label: 'Off: Foreground color',
					id: 'off_fg',
					default: combineRgb(255, 255, 255),
				},
				{
					type: 'colorpicker',
					label: 'Off: Background color',
					id: 'off_bg',
					default: combineRgb(0, 0, 0),
				},
			],
			callback: (feedback): CompanionAdvancedFeedbackResult => {
				if (getState().state === '0') {
					return {
						color: colorValue(feedback.options.normal_fg, combineRgb(255, 255, 255)),
						bgcolor: colorValue(feedback.options.normal_bg, combineRgb(255, 0, 0)),
					}
				}
				if (getState().state === '1') {
					return {
						color: colorValue(feedback.options.countdown_fg, combineRgb(255, 255, 255)),
						bgcolor: colorValue(feedback.options.countdown_bg, combineRgb(255, 0, 0)),
					}
				}
				if (getState().state === '2') {
					return {
						color: colorValue(feedback.options.countup_fg, combineRgb(255, 255, 255)),
						bgcolor: colorValue(feedback.options.countup_bg, combineRgb(255, 0, 0)),
					}
				}
				if (getState().state === '3') {
					return {
						color: colorValue(feedback.options.off_fg, combineRgb(255, 255, 255)),
						bgcolor: colorValue(feedback.options.off_bg, combineRgb(0, 0, 0)),
					}
				}
				return {}
			},
		},
		pause_color: {
			type: 'advanced',
			name: 'Change color from pause (advanced)',
			sortName: 'zz Change color from pause',
			description:
				'Sets its own colors for the running and paused states. Prefer the boolean feedback unless you need both states covered by a single feedback',
			affectedProperties: ['color', 'bgcolor'],
			options: [
				{
					type: 'colorpicker',
					label: 'Running: Foreground color',
					id: 'running_fg',
					default: combineRgb(255, 255, 255),
				},
				{
					type: 'colorpicker',
					label: 'Running: Background color',
					id: 'running_bg',
					default: combineRgb(255, 0, 0),
				},
				{
					type: 'colorpicker',
					label: 'Paused: Foreground color',
					id: 'paused_fg',
					default: combineRgb(255, 255, 255),
				},
				{
					type: 'colorpicker',
					label: 'Paused: Background color',
					id: 'paused_bg',
					default: combineRgb(0, 0, 0),
				},
			],
			callback: (feedback): CompanionAdvancedFeedbackResult => {
				if (getState().paused === '1') {
					return {
						color: colorValue(feedback.options.paused_fg, combineRgb(255, 255, 255)),
						bgcolor: colorValue(feedback.options.paused_bg, combineRgb(0, 0, 0)),
					}
				}
				return {
					color: colorValue(feedback.options.running_fg, combineRgb(255, 255, 255)),
					bgcolor: colorValue(feedback.options.running_bg, combineRgb(255, 0, 0)),
				}
			},
		},
		cue_left_active: {
			type: 'advanced',
			name: 'Cue: left arrow active, fading (advanced)',
			sortName: 'zz Cue: left arrow active',
			description: 'Highlights while the left arrow cue is active, fading back out over a couple of seconds',
			affectedProperties: ['color', 'bgcolor'],
			options: [
				{
					type: 'colorpicker',
					label: 'Foreground color',
					id: 'fg',
					default: combineRgb(255, 255, 255),
				},
				{
					type: 'colorpicker',
					label: 'Background color',
					id: 'bg',
					default: combineRgb(200, 0, 0),
				},
			],
			callback: (feedback): CompanionAdvancedFeedbackResult => {
				if (getState().cue !== 'left') {
					return {}
				}
				const elapsed = Date.now() - getState().cueTimestamp
				if (elapsed >= CUE_FADE_MS) {
					return {}
				}
				return {
					color: colorValue(feedback.options.fg, combineRgb(255, 255, 255)),
					bgcolor: fadeColor(colorValue(feedback.options.bg, combineRgb(200, 0, 0)), elapsed, CUE_FADE_MS),
				}
			},
		},
		cue_right_active: {
			type: 'advanced',
			name: 'Cue: right arrow active, fading (advanced)',
			sortName: 'zz Cue: right arrow active',
			description: 'Highlights while the right arrow cue is active, fading back out over a couple of seconds',
			affectedProperties: ['color', 'bgcolor'],
			options: [
				{
					type: 'colorpicker',
					label: 'Foreground color',
					id: 'fg',
					default: combineRgb(255, 255, 255),
				},
				{
					type: 'colorpicker',
					label: 'Background color',
					id: 'bg',
					default: combineRgb(0, 153, 0),
				},
			],
			callback: (feedback): CompanionAdvancedFeedbackResult => {
				if (getState().cue !== 'right') {
					return {}
				}
				const elapsed = Date.now() - getState().cueTimestamp
				if (elapsed >= CUE_FADE_MS) {
					return {}
				}
				return {
					color: colorValue(feedback.options.fg, combineRgb(255, 255, 255)),
					bgcolor: fadeColor(colorValue(feedback.options.bg, combineRgb(0, 153, 0)), elapsed, CUE_FADE_MS),
				}
			},
		},
		cue_blank_active: {
			type: 'advanced',
			name: 'Cue: blank active (advanced)',
			sortName: 'zz Cue: blank active',
			description: 'Highlights while the blank cue is currently active on the clock',
			affectedProperties: ['color', 'bgcolor'],
			options: [
				{
					type: 'colorpicker',
					label: 'Foreground color',
					id: 'fg',
					default: combineRgb(0, 0, 0),
				},
				{
					type: 'colorpicker',
					label: 'Background color',
					id: 'bg',
					default: combineRgb(255, 255, 0),
				},
				{
					type: 'checkbox',
					label: 'Blink',
					id: 'blink',
					default: false,
					// Purely a presentation toggle for this feedback, nothing worth driving from an expression
					disableAutoExpression: true,
				},
			],
			callback: (feedback): CompanionAdvancedFeedbackResult => {
				if (getState().cue !== 'blank') {
					return {}
				}
				if (feedback.options.blink && Math.floor(Date.now() / BLINK_PHASE_MS) % 2 === 1) {
					return {}
				}
				return {
					color: colorValue(feedback.options.fg, combineRgb(0, 0, 0)),
					bgcolor: colorValue(feedback.options.bg, combineRgb(255, 255, 0)),
				}
			},
		},
	}
}
