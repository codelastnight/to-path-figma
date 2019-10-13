interface Point {
	x: number
	y: number
	angle?: number // in degrees
	dist?: number //distance from last point
	totalDist?: number //total length of curve up to this point
}
