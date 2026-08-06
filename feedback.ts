import {
	CompanionFeedbackDefinitions,
	combineRgb,
	splitRgb,
	CompanionAdvancedFeedbackResult,
	InputValue,
} from '@companion-module/base'

// How long the left/right cue highlight takes to fade back out, in milliseconds. Must match clock.ts.
const CUE_FADE_MS = 2000
// Half-cycle length for the blank cue's optional blink, in milliseconds
const BLINK_PHASE_MS = 500

function numberize(val: InputValue | undefined): number {
	if (typeof val != 'string') {
		return 0
	}
	return parseInt(val)
}

// Colorpicker options can come back as either a color number or a numeric string, depending on configuration
function colorValue(val: InputValue | undefined, fallback: number): number {
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

export function getFeedbacks(getState: () => ClockState): CompanionFeedbackDefinitions {
	return {
		state_color: {
			type: 'advanced',
			name: 'Change color from state',
			description: 'Change the colors of a bank according to the timer state',
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
						color: numberize(feedback.options.normal_fg),
						bgcolor: numberize(feedback.options.normal_bg),
					}
				}
				if (getState().state === '1') {
					return {
						color: numberize(feedback.options.countdown_fg),
						bgcolor: numberize(feedback.options.countdown_bg),
					}
				}
				if (getState().state === '2') {
					return {
						color: numberize(feedback.options.countup_fg),
						bgcolor: numberize(feedback.options.countup_bg),
					}
				}
				if (getState().state === '3') {
					return {
						color: numberize(feedback.options.off_fg),
						bgcolor: numberize(feedback.options.off_bg),
					}
				}
				return {}
			},
		},
		pause_color: {
			type: 'advanced',
			name: 'Change color from pause',
			description: 'Change the colors of a bank according to the pause state',
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
						color: numberize(feedback.options.paused_fg),
						bgcolor: numberize(feedback.options.paused_bg),
					}
				}
				return {
					color: numberize(feedback.options.running_fg),
					bgcolor: numberize(feedback.options.running_bg),
				}
			},
		},
		cue_left_active: {
			type: 'advanced',
			name: 'Cue: left arrow active',
			description: 'Highlights while the left arrow cue is active, fading back out over a couple of seconds',
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
			name: 'Cue: right arrow active',
			description: 'Highlights while the right arrow cue is active, fading back out over a couple of seconds',
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
			name: 'Cue: blank active',
			description: 'Highlights while the blank cue is currently active on the clock',
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
