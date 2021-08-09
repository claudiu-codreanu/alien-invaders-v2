class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}


class Size {
    constructor(width, height) {
        this.width = width;
        this.height = height;
    }
}


class GameObject {
    constructor(location, sprite) {
        this.location = location;
        this.sprite = sprite;
        this.size = new Size(sprite.width, sprite.height);

        this.speedX = 0;
        this.speedY = 0;
    }

    render() {
        if(this.sprite) {
            ctx.drawImage(this.sprite, this.location.x - this.size.width / 2, this.location.y - this.size.height / 2);
        }
    }

    move() {
        this.location.x += this.speedX;
        this.location.y += this.speedY;
    }
}


class Ship extends GameObject {
}


class PlayerShip extends Ship {
    move() {
        super.move();

        // keep within the horizontal bounds of the canvas
        this.location.x = Math.min(this.location.x, width - this.size.width / 2);
        this.location.x = Math.max(this.location.x, this.size.width / 2);
    }
}


class AlienShip extends Ship {
    constructor(location, sprite) {
        super(location, sprite);
        this.speedX -= 4;
    }

    move() {
        super.move();

        if(this.location.x - this.size.width / 2 <= 0) {
            this.changeDirection();
        } else if (this.location.x + this.size.width / 2 >= width) {
            this.changeDirection();
        }
    }
}


class Bullet extends GameObject {
    constructor(location, sprite) {
        super(location, sprite);
        this.speedY = -9;
      
        let snd = new Audio("asset/snd/weapon-player.wav");
        snd.play();
    }

    move() {
        super.move();

        if (this.location.y <= 0) {
            this.isDestroyed = true;
        }
    }

    checkHit(ship) {
        let dx = this.size.width / 2,
            dy = this.size.height / 2;

        // if any of the four corners collides with the ship, it's a hit
        return this.isCollision(new Point(this.location.x - dx, this.location.y - dy), ship) ||
                this.isCollision(new Point(this.location.x + dx, this.location.y - dy), ship) ||
                this.isCollision(new Point(this.location.x - dx, this.location.y + dy), ship) ||
                this.isCollision(new Point(this.location.x + dx, this.location.y + dy), ship);
    }

    // check if a given point collides with ship rectangle
    isCollision(pt, ship) {
        let {x, y} = ship.location,
        {width, height} = ship.size;

        if(pt.x >= x - width / 2 &&
            pt.x <= x + width / 2 &&
            pt.y >= y - height / 2 &&
            pt.y <= y + height / 2) {

            return true;
        }

        return false;
    }
}


class Explosion extends GameObject {
    constructor(location, sprite) {
        super(location, sprite);
        this.counter = Math.ceil(Math.random() * 3);

        let snd = new Audio("asset/snd/explosion-enemy.wav");
        snd.play();
    }

    render() {
        super.render();
        this.counter--;
    }
}


class Game {
    constructor() {
        this.status = "loading";
    }

    init() {
        this.bulletsShot = 0;
        this.bulletsResolved = 0;

        this.bullets = [];
        this.lastShot = Date.now();

        this.playerShip = new PlayerShip(new Point(width / 2, height - 30), imgPlayerShip);
        this.initAlienShips();

        this.explosions = [];

        this.status = "playing";
        this.timeStart = Date.now();
    }

    initAlienShips() {
        this.alienShips = [];

        let delta = 40,
            x = width - delta, y = delta, margin = 5,
            w = imgAlienShip.width, h = imgAlienShip.height;

        for(let i = 0; i < 10; i++) {
            for(let j = 0; j < 3; j++) {

                let ship = new AlienShip(new Point(x, y), imgAlienShip);
                ship.changeDirection = () => this.changeDirection = true;

                this.alienShips.push(ship);
                y += (h + margin)
            }

            x -= (w + margin);
            y = delta;
        }
    }

    render() {
        background("black");

        if(this.status == "loading") {
            textSize(16);
            text("Loading...", 200, height / 2 - 10);

            textSize(12);
            return;
        }


        if(this.status == "won") {
            this.showMessage("Congratulations, you won!");
            this.displayStatus();

            return;
        }

        if(this.status == "lost") {
            this.showMessage("Sorry, you lost!");
            this.displayStatus();

            return;
        }


        this.playerShip.render();
        this.bullets.forEach(b => b.render());
        this.alienShips.forEach(s => s.render());
        this.explosions.forEach(e => e.render());

        this.displayStatus();
    }

    showMessage(msg) {
        textSize(16);

        text(msg, 200, height / 2 - 30);
        text("Press [P] to play again, press [X] to exit.", 200, height / 2 - 10);

        textSize(12);
    }


    computeState() {
        if(this.status == "won" || this.status == "lost") {
            return;
        }

        if(this.status == "loading") {
            if(window.imgAlienShip && window.imgPlayerShip && window.imgExplosion && window.imgBullet) {
                this.status = "playing";
                this.init();
            }

            return;
        }

        this.explosions = this.explosions.filter(e => e.counter > 0);
        this.checkKeyboardCommands();

        this.playerShip.move();
        this.computeBullets();
        this.computeAlienShips();


        if(this.alienShips.length == 0) {
            this.status = "won";
            this.timeEnd = Date.now();
        }

        this.alienShips.forEach(s => {
            if(s.location.y >= this.playerShip.location.y - this.playerShip.size.height) {
                this.status = "lost";
                this.timeEnd = Date.now();
            }
        })
    }

    checkKeyboardCommands() {
        if (keyIsDown(RIGHT_ARROW)) {
            this.playerShip.speedX++;
        } else if (keyIsDown(LEFT_ARROW)) {
            this.playerShip.speedX--;
        } else {
            this.playerShip.speedX = 0;
        }

        if (keyIsDown(SPACE)) {
            if(Date.now() - this.lastShot > 150) {
                this.lastShot = Date.now();
                this.shoot();
            }
        }
    }

    computeBullets() {
        this.bullets.forEach(b => b.move());

        this.bullets.forEach(bullet => {
            let ship = this.alienShips.find(s => bullet.checkHit(s));

            if(ship) {
                ship.isDestroyed = true;
                bullet.isDestroyed = true;

                this.explosions.push(new Explosion(ship.location, imgExplosion));
            }
        });

        this.bulletsResolved += this.bullets.reduce((acc, b) => acc + (b.isDestroyed ? 1 : 0), 0);
        this.bullets = this.bullets.filter(b => !b.isDestroyed);
    }

    computeAlienShips() {
        this.alienShips = this.alienShips.filter(s => !s.isDestroyed);

        this.changeDirection = false;
        this.alienShips.forEach(s => s.move());

        if(this.changeDirection) {
            this.alienShips.forEach(s => {
                s.speedX = -s.speedX;
                s.location.y += 20;
            });
        }

        this.changeDirection = false;
    }

    shoot() {
        let {x, y} = this.playerShip.location,
            {height} = this.playerShip.size;

        let bullet = new Bullet(new Point(x, y - height / 2 - 1), imgBullet);
        this.bullets.push(bullet);

        this.bulletsShot++;
    }

    displayStatus() {
        text("Click inside the game, then use keyboard", 10, 20);
        text("(arrows to move, and [space] to shoot)", 10, 35);


        let shipsDestroyed = 30 - this.alienShips.length,
            timePlayed = this.timeEnd ? this.timeEnd - this.timeStart : Date.now() - this.timeStart;

        text(`Time played: ${Math.round(timePlayed / 1000)} sec`, 650, 20);
        text(`Bullets shot: ${this.bulletsShot}`, 650, 35);
        text(`Ships destroyed: ${shipsDestroyed}`, 650, 50);

        if(shipsDestroyed > 0) {
            text(`Accuracy: ${Math.round(shipsDestroyed / this.bulletsResolved * 100)}%`, 650, 65);
        }
    }
}

function loop() {
    game.computeState();
    game.render();

    if(game.status == "won" || game.status == "lost") {
        if(keyIsDown(EXIT)) {
            return false;
        }

        if(keyIsDown(PLAY_AGAIN)) {
            game = new Game();
        }
    }

    game.computeState();
    game.render();
    
    return true;
}

