interface TimerState {
	active: boolean
	time: string
	compact: string
	icon: string
	paused: boolean
	expired: boolean
	progress: number
}
interface SourceState {
	hidden: boolean
	time: string
	compact: string
	icon: string
	paused: boolean
	expired: boolean
	progress: number
	mode: number
	title: string
}
interface ClockState {
	time: string
	tally: string
	mode: string
	paused: string
	timers: TimerState[]
	sources: SourceState[]
	uuid: string
	timestamp: number
	state: string
	// Last known cue state, tracked from the clock's own /clock/cue/* broadcasts: 'none' | 'left' | 'right' | 'blank'
	cue: string
	// Timestamp (Date.now()) of the last cue state change, used to fade out the left/right cue highlight
	cueTimestamp: number
}

interface StateMap {
	[id: string]: string
}
