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
}

interface StateMap {
	[id: string]: string
}
