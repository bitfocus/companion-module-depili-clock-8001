import { Regex, type SomeCompanionConfigField } from '@companion-module/base'

/** The protocol versions the module knows how to talk, as stored in the config */
export const CLOCK_VERSIONS = ['4', '3', 'mixed'] as const
export type ClockVersion = (typeof CLOCK_VERSIONS)[number]

/** Default port used by clock-8001 for both the command and the feedback direction */
export const DEFAULT_PORT = '1245'
/** Broadcast, so that a stock clock is reachable without knowing its address */
export const DEFAULT_HOST = '255.255.255.255'

export type ClockConfig = {
	version?: ClockVersion
	host?: string
	port?: string
	host2?: string
	port2?: string
	host3?: string
	port3?: string
	localport?: string
}

export function GetConfigFields(): SomeCompanionConfigField[] {
	return [
		{
			type: 'dropdown',
			id: 'version',
			label: 'Clock protocol version',
			width: 6,
			choices: [
				{ id: '4', label: 'Version 4' },
				{ id: '3', label: 'Version 3' },
				{ id: 'mixed', label: 'Versions 3 & 4, not recommended' },
			],
			default: '4',
		},
		{
			type: 'textinput',
			id: 'host',
			label: 'Clock 1 IP address (you can also use broadcast)',
			width: 8,
			regex: Regex.IP,
			default: DEFAULT_HOST,
		},
		{
			type: 'textinput',
			id: 'port',
			label: 'Clock 1 port',
			width: 4,
			regex: Regex.PORT,
			default: DEFAULT_PORT,
		},
		{
			type: 'textinput',
			id: 'host2',
			label: 'Clock 2 IP address, leave blank if not used',
			width: 8,
			default: '',
		},
		{
			type: 'textinput',
			id: 'port2',
			label: 'Clock 2 port',
			width: 4,
			regex: Regex.PORT,
			default: DEFAULT_PORT,
		},
		{
			type: 'textinput',
			id: 'host3',
			label: 'Clock 3 IP address, leave blank if not used',
			width: 8,
			default: '',
		},
		{
			type: 'textinput',
			id: 'port3',
			label: 'Clock 3 port',
			width: 4,
			regex: Regex.PORT,
			default: DEFAULT_PORT,
		},
		{
			type: 'textinput',
			id: 'localport',
			label: 'Local port for OSC feedback',
			width: 4,
			regex: Regex.PORT,
			default: DEFAULT_PORT,
		},
	]
}
