import {
	CompanionFeedbackDefinitions,
	combineRgb,
	CompanionAdvancedFeedbackResult,
	InputValue,
} from '@companion-module/base'

function numberize(val: InputValue | undefined): number {
	if (typeof val != 'string') {
		return 0
	}
	return parseInt(val)
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
	}
}
