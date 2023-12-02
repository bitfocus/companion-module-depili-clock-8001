import { Regex, SomeCompanionConfigField } from '@companion-module/base'

export interface ClockConfig {
	version?: string,
	host?: string,
	port?: string,
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
        label: 'Clock IP address (you can also use broadcast)',
        width: 8,
        regex: Regex.IP,
      },
      {
        type: 'textinput',
        id: 'port',
        label: 'Target Port',
        width: 4,
        regex: Regex.PORT,
        default: '1245',
      },
      {
        type: 'textinput',
        id: 'localport',
        label: 'Local Port',
        width: 4,
        regex: Regex.PORT,
        default: '1245',
      },
    ];
}
