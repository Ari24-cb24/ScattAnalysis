# Scatt Analysis

After having worked on [ScattMP4Export](github.com/Ari24-cb24/ScattMP4Export), I decided to step things a bit up and create a small frontend for Scatt files. 
This project is by no means finished and development is being resumed as part of loosing interest in the primary project and having close to no time.

Recently I got the urge to get back to analysing Scatt files and executables again since I'm working on hardware which should directly integrate into Scatt.

## Features

![Homeview](https://b.catgirlsare.sexy/Q8gxsMdckODe.png)

You are greeted with a nice home view but unfortunately, everything is hardcoded at the moment and only the "New Workspace" button works at the moment.

You are then being prompted to select a Scatt pro file and a working directory for exports etc.

![Workspace](https://b.catgirlsare.sexy/T8KbdQL2eVUY.png)

The workspace itself is divided into multiple windows, which can be dragged and sized around, making it quite modular and flexible.

A list on the left containing all shots and their basic infos as well as a custom media player for the shot is being included. The graph on the right is a work-in-progress and 
is supposed to show the current velocity at the given video-time.

## What now?

I think I may rework everything from scratch, since the current code is messy and old. I may also switch to Photino + Vue for a better Backend + Frontend combo.
You may use this project as you want but please give credit where it's due. It's only here for being a resource for others and maybe even myself in the future.
