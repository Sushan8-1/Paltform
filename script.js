(function (){
var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.requestAnimationFrame;  window.requestAnimationFrame = requestAnimationFrame;
})();

var canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d"),
    width = 1000,
    height = 400,
    player = {
      x: width / 2,
      y: 200,
      width: 25,
      height: 25,
      speed: 3,
      velX: 0,
      velY: 0,
      jumping: false,
      grounded: false,
      color: '#E6AC27'
    }, 

    keys = [],
    friction = 0.8,
    gravity = 0.4,
    boxes = [],
    powers = [];

powers.push({
  x: 810,
  y: 250,
  width: 20,
  height: 20,
  color: '#BF4D28',
  effect: 'shrink'
});

powers.push({
  x: 400,
  y: 150,
  width: 20,
  height: 20,
  color: '#BF4D28',
  effect: 'gravity'
});

powers.push({
  x: -15,
  y: 88,
  width: 20,
  height: 20,
  color: '#222',
  effect: 'tele',
        rotate: 20,
  px: 20,
  py: 370,
  stay:true
});

powers.push({
  x: 60,
  y: 365,
  width: 20,
  height: 20,
  color: '#2A5D77',
  effect: 'win',
  stay: true
});



    canvas.width = width;
    canvas.height = height;

    function update(){
      if ((keys[38] || keys[32] || keys[87]) && !player.jumping && player.grounded){
          player.jumping = true;
          player.grounded = false;
          player.velY = -player.speed * 2.5;
        }
      }
      if ((keys[39] || keys[68]) && player.velX < player.speed) {
          player.velX++;
        }

      if ((keys[37] || keys[65]) && player.velX > -player.speed) {
        player.velX--;
      }

      player.velX *= friction;
      player.velY += gravity;

      ctx.clearRect(0, 0, width, height);
      ctx.beginPath();

      player.grounded = false;
      for (let i = 0; i < boxes.length; i++) {
        ctx.fillStyle = boxes[i].color;
        ctx.rect(boxes[i].x, boxes[i].y, boxes[i].width, boxes[i].height);

        const dir = colCheck(player, boxes[i]);

        if (dir === "l" || dir === "r"){
          player.velX = 0;
          player.jumping = false;
        }else if (dir === "b"){
          player.grounded = true;
          player.jumping = false;
        }else if (dir === "t"){
          player.velY *= -1;
        }
      }

    if(player.grounded){
      player.velY = 0;
    }

    player.x += player.velX;
    player.y += player.velY;

    ctx.fill();
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);

document.body.addEventListener("keydown", function(e){
  keys[e.keyCode] = true;
});

document.body.addEventListener("keyup", function(e) {
  keys[e.keyCode] = false;
});

window.addEventListener("load", function(){
  update();
});