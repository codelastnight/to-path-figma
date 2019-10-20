# To-Path: A Figma Plugin

![logo and info image](info.png)

Put any objects or text on a path! 

1. make a curve
2. select an object, group, or text
3. watch the magic* happen!

*not actually magic


## How it Works

1. the plugin generates an array of points (280 for now) using castejau's algorithm  that follows the curve, also finding the angle of the tangent of each point. the length from the start of the curve to each point is also generated and stored (find out more here: https://javascript.info/bezier-curve)

2. the nth's object's x position + object width + spacing is calculated
3. the plugin compares the x position of the object with the array of points. 2 points with closest length is picked 
4. then the plugin finds the point between those two points and finds the exact point to place the object. the angle used is just the tangent of the nearest point.
5. the object is placed and the plugin moves onto the next object.

## development setup

1.  install packages:
`npm i` 

2. compile :
`npm run prod`

Helpful resources:


mfw someone else already put out something similar to my plugin but i spent too much time on this to stop now.
