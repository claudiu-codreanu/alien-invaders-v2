# Alien Invaders v2

Check [this link](https://claudiu-codreanu.github.io/alien-invaders/) for the original challenge and solution.  
**[This is v2.0](https://claudiu-codreanu.github.io/alien-invaders-v2/main.html)**, which comes with the following improvements:

- Realistic images (2D sprites) for all game objects:
    - Player ship
    - Alien ships
    - Bullets
    - Explosions

<br>

- Sound effects for:
    - Bullets
    - Explosions

<br>

- New background image, helps the other game objects "pop" visually
- Slightly better game statistics
- Refactored JS code

<br>

**[Click here](https://claudiu-codreanu.github.io/alien-invaders-v2/main.html)** to play version 2 of the game.  
By the way, all visual and audio assests are from the [Unity store](https://assetstore.unity.com/).

<br>

## Going forward

There are still lots of "features" on the "roadmap", such as:

- Levels of increasing difficulty:
    - Progressively more dangerous enemy ships:s
        - More numerous
        - Faster
        - Different moving patterns
        - More resislient (require multiple hits to be destroyed)
        - Can shoot back

    - Random asteroids, to limit movement and destroy player ship on collision
    - Limited number of bullets for player

<br>

- "Swooshing" sound when enemy ships change direction
- "Humming" background sound for enemy ships, with a bit of Doppler effect (higher pitch when approaching, lower pitch when going away)
- Variable pitch for bullet and explosion sounds, to make them more realistic
- "Bonus" fallouts, player can pick to gain points, lives, shields, better ammo, etc.
- Full-screen / larger screen, for more immersive experience
- **And most importantly**, movement speed based on time rather than frames-per-second (FPS). Right now the speed is "pixels-per-frame", which makes the game feel faster on higher FPS values, and more sluggish on lower FPS values. Ideally, the speed should feel the same regardless of the FPS rate.

<br>

- Etc. the list is virtually limitless, depending on your imagination and experience from playing other games

<br>

Enjoy playing the game, and stay tuned for "v3.0" and beyond!