const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

let frames = 0;
const DEGREE = Math.PI / 180;

const sprite = new Image();
sprite.src = "image/sprite.png";

// Game states
const state = {
  current: 0,
  getReady: 0,
  game: 1,
  over: 2,
};

// for button
const startBtn = {
  x: 120,
  y: 263,
  w: 83,
  h: 29,
};

window.addEventListener('keydown', e => {
  if (e.code == "Space"){
    switch(state.current){
      case state.getReady:
        state.current = state.game;
        break;
      case state.game:
        bird.flap();
        break;
    }
  }
})

canvas.addEventListener("click", (e) => {
  switch (state.current) {
    case state.getReady:
      state.current = state.game;
      break;
    case state.game:
      bird.flap();
      break;
    case state.over:
      let rect = canvas.getBoundingClientRect();
      let clickX = e.clientX - rect.left;
      let clickY = e.clientY - rect.top;

      if (
        clickX >= startBtn.x &&
        clickX <= startBtn.x + startBtn.w &&
        clickY >= startBtn.y &&
        clickY <= startBtn.y + startBtn.h
      ) {
        pipes.reset();
        bird.speedReset();
        score.reset();
        state.current = state.getReady;
      }
      break;
  }
});

const bg = {
  sX: 0,
  sY: 0,
  w: 275,
  h: 226,
  x: 0,
  y: canvas.height - 226,

  draw: function () {
    c.drawImage(
      sprite,
      this.sX,
      this.sY,
      this.w,
      this.h,
      this.x,
      this.y,
      this.w,
      this.h
    );
    c.drawImage(
      sprite,
      this.sX,
      this.sY,
      this.w,
      this.h,
      this.x + this.w,
      this.y,
      this.w,
      this.h
    );
  },
};

//ground image
const ground = {
  sX: 276,
  sY: 0,
  w: 224,
  h: 112,
  x: 0,
  y: canvas.height - 112,
  dx: 1,

  draw: function () {
    c.drawImage(
      sprite,
      this.sX,
      this.sY,
      this.w,
      this.h,
      this.x,
      this.y,
      this.w,
      this.h
    );
    c.drawImage(
      sprite,
      this.sX,
      this.sY,
      this.w,
      this.h,
      this.x + this.w,
      this.y,
      this.w,
      this.h
    );
  },
  update: function () {
    if (state.current === state.game) {
      this.x = (this.x - this.dx) % (this.w / 2);
    }
  },
};

// Bird
const bird = {
  animation: [
    { sX: 276, sY: 112 },
    { sX: 276, sY: 139 },
    { sX: 276, sY: 164 },
    { sX: 276, sY: 139 },
  ],
  x: 50,
  y: 150,
  w: 34,
  h: 26,
  radius: 12,
  frame: 0,
  gravity: 0.25,
  jump: 4.6,
  speed: 0,
  rotation: 0,

  draw: function () {
    let bird = this.animation[this.frame];

    c.save();
    c.translate(this.x, this.y);
    c.rotate(this.rotation);
    c.drawImage(
      sprite,
      bird.sX,
      bird.sY,
      this.w,
      this.h,
      -this.w / 2,
      -this.h / 2,
      this.w,
      this.h
    );
    c.restore();
  },
  flap: function () {
    this.speed = -this.jump;
  },
  update: function () {
    this.period = state.current == state.getReady ? 10 : 5;
    this.frame += frames % this.period == 0 ? 1 : 0;
    this.frame = this.frame % this.animation.length;

    if (state.current == state.getReady) {
      this.y = 150;
      this.rotation = 0 * DEGREE;
    } else {
      this.speed += this.gravity;
      this.y += this.speed;

      if (this.y + this.h / 2 >= canvas.height - ground.h) {
        this.y = canvas.height - ground.h - this.h / 2;
        if (state.current == state.game) {
          state.current = state.over;
        }
      }
      if (this.speed >= this.jump) {
        this.rotation = 70 * DEGREE;
        this.frame = 1;
      } else {
        this.rotation = -25 * DEGREE;
      }
    }
  },
  speedReset: function () {
    this.speed = 0;
  },
};

// Get ready message
const getReady = {
  sX: 0,
  sY: 228,
  w: 173,
  h: 152,
  x: canvas.width / 2 - 173 / 2,
  y: 80,
  draw: function () {
    if (state.current === state.getReady) {
      c.drawImage(
        sprite,
        this.sX,
        this.sY,
        this.w,
        this.h,
        this.x,
        this.y,
        this.w,
        this.h
      );
    }
  },
};

// Game over message
const gameOver = {
  sX: 175,
  sY: 228,
  w: 225,
  h: 202,
  x: canvas.width / 2 - 225 / 2,
  y: 90,
  draw: function () {
    if (state.current == state.over) {
      c.drawImage(
        sprite,
        this.sX,
        this.sY,
        this.w,
        this.h,
        this.x,
        this.y,
        this.w,
        this.h
      );
    }
  },
};

// Pipes
const pipes = {
  position: [],
  top: {
    sX: 553,
    sY: 0,
  },
  bottom: {
    sX: 502,
    sY: 0,
  },
  w: 53,
  h: 400,
  gap: 100,
  maxYpos: -150,
  dx: 2,

  draw: function () {
    for (let i = 0; i < this.position.length; i++) {
      let p = this.position[i];
      let topYPos = p.y;
      let bottomYpos = p.y + this.h + this.gap;

      // top pipe
      c.drawImage(
        sprite,
        this.top.sX,
        this.top.sY,
        this.w,
        this.h,
        p.x,
        topYPos,
        this.w,
        this.h
      );

      // bottom pipe
      c.drawImage(
        sprite,
        this.bottom.sX,
        this.bottom.sY,
        this.w,
        this.h,
        p.x,
        bottomYpos,
        this.w,
        this.h
      );
    }
  },
  update: function () {
    if (state.current !== state.game) return;
    if (frames % 100 == 0) {
      this.position.push({
        x: canvas.width,
        y: this.maxYpos * (Math.random() + 1),
      });
    }
    for (let i = 0; i < this.position.length; i++) {
      let p = this.position[i];
      let bottomPipeYpos = p.y + this.h + this.gap;

      //top collision detection
      if (bird.y < bird.h / 2) {
        state.current = state.over;
      }
      // Collision detection for top pipe
      if (
        bird.x + bird.radius > p.x &&
        bird.x - bird.radius < p.x + this.w &&
        bird.y + bird.radius > p.y &&
        bird.y - bird.radius < p.y + this.h
      ) {
        state.current = state.over;
      }
      // collision detection for bottom pipe
      if (
        bird.x + bird.radius > p.x &&
        bird.x - bird.radius < p.x + this.w &&
        bird.y + bird.radius > bottomPipeYpos &&
        bird.y - bird.radius < bottomPipeYpos + this.h
      ) {
        state.current = state.over;
      }

      p.x -= this.dx;

      // if pipe exits the play screen
      if (p.x + this.w <= 0) {
        this.position.shift();
        score.value += 1;
        score.best = Math.max(score.value, score.best);
        localStorage.setItem("highscore", score.best);
      }
    }
  },
  reset: function () {
    this.position = [];
  },
};

const score = {
  best: parseInt(localStorage.getItem("highscore")) || 0,
  value: 0,

  draw: function () {
    c.fillStyle = "#FFF";
    c.strokeStyle = "#000";
    if (state.current == state.game) {
      c.lineWidth = 2;
      c.font = "35px Teko";
      c.fillText(this.value, canvas.width / 2, 50);
      c.strokeText(this.value, canvas.width / 2, 50);
    } else if (state.current == state.over) {
      // user score
      c.font = "25px Teko";
      c.fillText(this.value, 225, 186);
      c.strokeText(this.value, 225, 186);
      // high score
      c.fillText(this.best, 225, 228);
      c.strokeText(this.best, 225, 228);
    }
  },
  reset: function () {
    this.value = 0;
  },
};

function draw() {
  c.fillStyle = "#70c5ce";
  c.fillRect(0, 0, canvas.width, canvas.height);

  bg.draw();
  pipes.draw();
  ground.draw();
  bird.draw();
  getReady.draw();
  gameOver.draw();
  score.draw();
}

function update() {
  bird.update();
  ground.update();
  pipes.update();
}

function animateFlappy() {
  update();
  draw();
  frames++;
  requestAnimationFrame(animateFlappy);
}

animateFlappy();
