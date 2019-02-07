// Pong Clone (Jordan Zdimirovic (C) 2019. All Rights Reserved)

var canvas;

let paddle1;

let paddle2;

// The offset that applies to both paddles, from each side of the screen (measured in pixels).
let paddleOffset = 50;

let multi = 1.5;

// The dimensions of the paddles.
let paddleWidth = 15;

let paddleLength = 90; // 80

// The radius of the ball.
let ballR = 15;

// The movement speed of the paddles (pixels per frame).
let paddleSpeed = 7 * multi;

// Game screen size, refer to canvas initialisation for multipliers.
var canvasSize = 100;

var ballPxpf = 7 * multi;

var maxBallVelocity = 15 * multi;


function PaddleUpdate(thisPaddle){
  // Called on draw: object drawing and movement etc. should be handled here

  // Move the paddle (if keys held)
  if(keyIsDown(thisPaddle.kCode_UP) && thisPaddle.pos.y - paddleLength / 2 > 0){
    thisPaddle.pos.y -= paddleSpeed;
  }

  else if(keyIsDown(thisPaddle.kCode_DOWN) && thisPaddle.pos.y + paddleLength / 2 < height){
    thisPaddle.pos.y += paddleSpeed;
  }

  // Draw the paddle
  fill(thisPaddle.color.r, thisPaddle.color.g, thisPaddle.color.b);

  rect(thisPaddle.pos.x, thisPaddle.pos.y, paddleWidth, paddleLength);
}

function setup(){
  rectMode(CENTER);
  canvas = createCanvas(canvasSize * 10, canvasSize * 5);

  ball = {
    'Ricochet': function(){
      this.vector.i = this.vector.i;
      this.vector.j = -this.vector.j;
    },
    'Update': function(){
      // Check for collision
      // Check first paddle
      if((this.pos.y - ballR <= 0) || this.pos.y + ballR >= height){
        this.Ricochet();
      }

      var coords = paddle1.pos;
      var diffX = abs(coords.x - this.pos.x);
      var diffY = abs(coords.y - this.pos.y);

      if(diffX - ballR <= paddleWidth / 2 && diffY - ballR <= paddleLength / 2){
        // Collision detected.
        this.CollidedWithPaddle(paddle1);
      }

      coords = paddle2.pos;

      var diffX = abs(coords.x - this.pos.x);
      var diffY = abs(coords.y - this.pos.y);

      if((diffX - ballR <= paddleWidth / 2) && (diffY - ballR <= paddleLength / 2)){
        // Collision detected.
        this.CollidedWithPaddle(paddle2);
      }

      // Move the ball
      this.pos.x += this.vector.i;
      this.pos.y += this.vector.j;

      // Done, now, draw the ball.
      fill(0, 255, 0);
      ellipse(this.pos.x, this.pos.y, ballR);

    },

    'CollidedWithPaddle': function(obj){
      console.log("Collided!");
      var v = ball.vector;
      var vLen = sqrt(v.i * v.i + v.j * v.j);
      if(vLen < maxBallVelocity){
        vLen *= 1.1;
      }

      var diffY = obj.pos.y - ball.pos.y;
      var angle = (2 * diffY) / paddleLength * QUARTER_PI + HALF_PI;
      if(obj.no == 1){
        ball.vector = {
          'i': vLen * abs(sin(angle)),
          'j': vLen * cos(angle)
        };
      }

      else if(obj.no == 2){
        ball.vector = {
          'i': vLen * -abs(sin(angle)),
          'j': vLen * cos(angle)
        };
      }


    },

    'pos':{
      'x':width / 2,
      'y':height / 2
    },

    'vector': {
      'i':ballPxpf,
      'j':0
    },

  };

  // Initialise properties / functions that are common to both paddles.
  paddle1 = {
    'no':1,
    'Update': function(){
      PaddleUpdate(this);

    },

    'pos': {
      'x': paddleOffset, // represents the left side of the screen.
      'y': height / 2 // Middle of the screen
    },

    'color': {
      'r': 10,
      'g': 40,
      'b': 200
    },

    'kCode_UP': 87,
    'kCode_DOWN': 83




  };

  paddle2 = {
    'no':2,
    'Update': function(){
      PaddleUpdate(this);
    },

    'pos': {
      'x': width - paddleOffset, // 'width' represents the right side of the screen.
      'y': height / 2 // Middle of the screen
    },

    'color': {
      'r': 200,
      'g': 20,
      'b': 20
    },

    'kCode_UP': UP_ARROW,
    'kCode_DOWN': DOWN_ARROW


  };


}


function draw(){
  background(100);
  paddle1.Update();
  paddle2.Update();
  ball.Update();

}
