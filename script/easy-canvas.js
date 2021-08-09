(function (canvasId) {

    // --- Begin boiler plate and private code for canvas manipulation

    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');
    window.ctx = ctx;

    loadImages();

    const attributes = {
        fill: "black",
        textSize: 12
    }

    function repeatOften() {
        // If you define a function called `loop` in your program
        // the engine will call it automatically
        if (window.loop) {
            let proceed = window.loop();

            if(proceed) {
                requestAnimationFrame(repeatOften);
            } else {
                window.close();
            }
        }
    }

    // --- Begin boiler plate and private code for keyboard manipulation

    const keyPressed = new Map();

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    function handleKeyDown(eventArgs) {
        if (!keyPressed.has(eventArgs.keyCode)) {
            keyPressed.set(eventArgs.keyCode, eventArgs.keyCode);
        }
    }

    function handleKeyUp(eventArgs) {
        if (keyPressed.has(eventArgs.keyCode)) {
            keyPressed.delete(eventArgs.keyCode);
        }
    }

    // --- Begin public functions (e.g. added to the global window object)
    // --- Feel free to use any of these global constants / functions in your program

    // Put a few constants in the global scope
    window.width = canvas.width;
    window.height = canvas.height;
    window.LEFT_ARROW = 37;
    window.RIGHT_ARROW = 39;
    window.SPACE = 32;

    window.PLAY_AGAIN = 80;
    window.EXIT = 88;


    // Clear the canvas with the specified color
    window.background = function (color) {
        if(window.imgNightSky) {
          ctx.drawImage(imgNightSky, 0, 0);
          return;
        }
      
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Specify the text size of the next drawn text
    window.textSize = function (n) {
        attributes.textSize = n;
    }

    // Write a text at specified coordinates
    window.text = function (txt, x, y) {
        ctx.font = attributes.textSize + "px Consolas";

        ctx.fillStyle = "cyan";
        ctx.fillText(txt, x, y);
    }

    // Returns true if key with specified code is pres       sed
    window.keyIsDown = function (code) {
        if (keyPressed.has(code))
            return true;
    }


    textSize(12);
    window.game = new Game();
  
    requestAnimationFrame(repeatOften);
})("canvas");


function loadImages() {
    // background
    const imgNightSky = new Image();
    imgNightSky.src = "asset/img/red-nebula-800-600.jpg"; // "asset/img/space-sky-800-600.png"; // "asset/img/night-sky-2.jpg";
  
    imgNightSky.onload = function() {
      window.imgNightSky = imgNightSky;
    };
  
  
    // alien ship
    const imgAlienShip = new Image();
    imgAlienShip.src = "asset/img/alien-ship.png";
  
    imgAlienShip.onload = function() {
      window.imgAlienShip = imgAlienShip;
    }
  
  
    // player ship
    const imgPlayerShip = new Image();
    imgPlayerShip.src = "asset/img/player-ship.png";
  
    imgPlayerShip.onload = function() {
      window.imgPlayerShip = imgPlayerShip;
    }


    // explosion
    const imgExplosion = new Image();
    imgExplosion.src = "asset/img/big-flare.png"; // "asset/img/explosion.png"; // "asset/img/burst.png";

    imgExplosion.onload = function() {
        window.imgExplosion = imgExplosion;
    }


    // bullet
    const imgBullet = new Image();
    imgBullet.src = "asset/img/projectile.png";

    imgBullet.onload = function() {
        window.imgBullet = imgBullet;
    }
}
