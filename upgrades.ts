import type { CompanionStaticUpgradeScript } from '@companion-module/base'
import { CLOCK_VERSIONS, DEFAULT_PORT, type ClockConfig, type ClockVersion } from './config.js'

/** The port fields, all of which share the same default and the same historical number/string confusion */
const PORT_FIELDS = ['port', 'port2', 'port3', 'localport'] as const

function isClockVersion(value: unknown): value is ClockVersion {
	return CLOCK_VERSIONS.includes(value as ClockVersion)
}

/**
 * Bring configs saved by older releases up to what the current config fields describe.
 *
 * Two things need fixing:
 *
 * - The protocol version dropdown had no default until the Companion v3 port. A connection created
 *   before that has no `version` at all, and since every action is registered behind a check on it,
 *   such a connection offers no actions whatsoever. Those configs are moved to the current default.
 * - The port fields defaulted to the number `1245` in the Companion v2 module, while the textinput
 *   fields now describe them as strings. Old configs therefore hold numbers where strings are
 *   expected, and the clock 2/3 fields are missing entirely, having been added later.
 */
export const NormaliseConfigFields: CompanionStaticUpgradeScript<ClockConfig> = (_context, props) => {
	const config = props.config
	if (!config) {
		return { updatedConfig: null, updatedActions: [], updatedFeedbacks: [] }
	}

	// The stored values predate the current typings, so they are read back untyped
	const stored: Record<string, unknown> = config
	let changed = false

	if (!isClockVersion(config.version)) {
		config.version = '4'
		changed = true
	}

	for (const field of PORT_FIELDS) {
		const value = stored[field]
		if (typeof value === 'number') {
			config[field] = String(value)
			changed = true
		} else if (typeof value !== 'string') {
			config[field] = DEFAULT_PORT
			changed = true
		}
	}

	// The additional clocks were added after the module shipped, so their hosts can be absent
	for (const field of ['host2', 'host3'] as const) {
		if (typeof stored[field] !== 'string') {
			config[field] = ''
			changed = true
		}
	}

	return { updatedConfig: changed ? config : null, updatedActions: [], updatedFeedbacks: [] }
}

export const UpgradeScripts: CompanionStaticUpgradeScript<ClockConfig>[] = [NormaliseConfigFields]
