
interface Point {
	x: number
	y: number
	angle?: number // in degrees
	dist?: number //distance from last point
	totalDist?: number //total length of curve up to this point
}

interface SettingData {
	verticalAlign: number
	horizontalAlign: number
	spacing: number
	count: number
	rotCheck?: boolean
	autoWidth: boolean
	totalLength?: number
	isLoop?: boolean
	objWidth?: number
	offset: number
	precision: number
}

interface Pass {
	spacing: number
	pointIndex: number
}

type DataType = "clone" | "text"

interface LinkedData {
	readonly namespace: "topathfigma"
	setting: SettingData
	curve: VectorNode
	other: SceneNode
	curveCloneID?: string
	readonly type: DataType
}

