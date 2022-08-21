# Project theme: Petting a dog while you can interact a lot with the whole scene.

`Control Lights`

`Control materials`

`Control position & watching view`

## 1. Goals:
I really like dogs though I never can have one with me. So, I decided to “build” one on my own. This project is formed with a dog named “Peanut” because of his color (not an obj found on the internet, every vertex drawn by myself), a bone, a loop that can rotate, and a randomly floating cloud. 

I want to make Peanut can be pet to sit at any time. He can hear your command to run, walk, or just sit
down. Also, when he is sitting, the loop should stay static. When Peanut is running or walking, the loop will rotate depending on his speed. (You know, as the law of inertia). Meanwhile, the cloud is always floating around the scene randomly.

There will be a bone that you can use to encourage him to run. When the bone is near to Peanut, he will
run so that he thinks he can get the bone. Will the bone is above his head for a long distance, he will forget it and just walk in the loop.
 
You can walk in the world the way they want. I want to make sure users can change the direction they are looking at. Also, they can decide to move forward or move backward (causing zooming in or zooming out).

Also, I used “quaternion” to control the direction.

For materials and shading, I realized 5 kinds of shaders including Cartoonish shader, Phong shader with Blinn-Phong lighting, Phong shader with Phong lighting, Gouraud shader with Blinn-Phong lighting, and Gouraud shader with Phong lighting. Then, make it possible that the program can switch to each other without pausing or reloading. I need to finish them in 5 different shaders.

I also draw a nice sphere (actually I draw two) to feel the different effects of lights.

I finished 2 lights which both can be controlled to change their position and 3 kinds of reflection colors.
 Meanwhile. I need to make sure everything I have done in ProjA and ProjB can still work.

## 2. User’s Instructions:

Please open the `html` file. Here's the list of what you can do:

| Interaction | Reaction |
| -------      |  ------|
|`WASD` keys|Control bone’s position, bone’s position can influence Peanut’s (the dog) running speed. Making bone close to Peanut to let him run. Making bone far away to make Peanut walk. “W/S” move the bone up/down. “A/D” turns the bone left/right.|
|`IJKL` keys|Control the view angle without moving the standing point. “I/K” rotate view up/down. “J/L” rotate view left/right.|
|`←↑→↓` keys|Control the audience’s position. (“↑” Go forward, “↓” go backward, “←” strafe left, “→” strafe right).|
|`b/B` key|Press “b/B” to show the bone. Press again to remove it.|
|`Sit/Run` button| Press this button to pet the dog. |Tell him to sit or run|
|`c/C` key|Press “c/C” to change the left viewport to the cloud’s view. Press again to return. The cloud in the scene always moving randomly.|
|Mouse drag|Drag the mouse on the screen to rotate the bone (rotation direction based on your view direction).|
|`Clear` button|Press “Clear” to clear the accumulation degree for bone (reset the bone).|
|Cartoonish shader
`ON/OFF` button|You can switch different shader immediately to the most original cartoonish shader.|
|Shading method select list|Select one shading method from “Gouraud” and “Phong”.|
|Lighting method select list|Select one shading method from “Blinn-Phong” and “Phong”.|
|Material section|Use select lists to choose different materials for different objects including “Spheres”, “Ring”, “Bone”, “Cloud”, and “Dog”. (Materials including default, red plastic, turquoise, jade, silver shiny)|
|Light section| Use the slider bar to change the light1’s /light2’s position. Use the slider bar to change the light1’s /light2’s the RGB (color) of ambient light, the RGB (color)of diffuse light, and the RGB (color)of specular light. Use the select list to decide the composition of each light. Users can turn off or turn on any kind of reflect light or any light source separately.|


# Relax and Enjoy
