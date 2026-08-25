import type { CompanionVariableValues, InstanceTypes } from '@companion-module/base'
import type { ClockActions } from './actions.js'
import type { ClockConfig } from './config.js'
import type { ClockFeedbacks } from './feedback.js'

/**
 * Describes this module to the base library, so that actions, feedbacks and presets are checked
 * against each other rather than against bare strings.
 *
 * The variables are left loosely typed: they are generated from the timer and source loops rather
 * than written out one by one, so there is nothing to gain from naming all of them here.
 */
export interface ClockInstanceTypes extends InstanceTypes {
	config: ClockConfig
	secrets: undefined
	actions: ClockActions
	feedbacks: ClockFeedbacks
	variables: CompanionVariableValues
}
