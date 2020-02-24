
# To-Path: A Figma Plugin

![version badge](https://img.shields.io/badge/dynamic/json?color=ff69b4&label=version&query=version&url=https%3A%2F%2Fraw.githubusercontent.com%2Fcodelastnight%2Fto-path-figma%2Fmaster%2Fpackage.json?style=flat-square)


![logo and info image](wallpaper.png)

Put any objects or text on a path! 

[*EPIC NEW UPDATE!!*]
LIVE PREVIEW IS HERE! now update and change your object and see it happen live!

1. make a curve
2. select an object, group, or text
3. watch the magic* happen!

*not actually magic

built with typscript, react, and my last braincell

### roadmap 

-  [x] switch from polling to event calls for detecting selection change (when figma api updates)
-  [x] live previewing
-  [x] remember previous settings and reset to default
-  [ ] support for vector networks (maybe?)
-  [ ] advanced settings (eg, increase size of object every time its cloned)

## How it Works

1. the plugin generates an array of points (420 between each point but you can also change this in the "about" menu) using castejau's algorithm  that follows the curve, also finding the angle of the tangent of each point. the length from the start of the curve to each point is also generated and stored (find out more here: https://javascript.info/bezier-curve)

2. the nth's object's x position + object width + spacing is calculated
3. the plugin compares the x position of the object with the array of points. 2 points with closest length is picked 
4. then the plugin finds the point between those two points and finds the exact point to place the object. the angle used is just the tangent of the nearest point.
5. the object is placed and the plugin moves onto the next object.

## development setup

1.  install packages:
`npm i` 

2. compile :
`npm run prod`




mfw someone else already put out something similar to my plugin but i spent too much time on this to stop now.
