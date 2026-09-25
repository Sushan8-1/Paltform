(function () {
  const requestAnimationFrame =
    window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.requestAnimationFrame;

  window.requestAnimationFrame = requestAnimationFrame;
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
    color: "#E6AC27",
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
  color: "#BF4D28",
  effect: "shrink",
});

powers.push({
  x: 400,
  y: 150,
  width: 20,
  height: 20,
  color: "#BF4D28",
  effect: "gravity",
});

powers.push({
  x: -15,
  y: 88,
  width: 20,
  height: 20,
  color: "#222",
  effect: "teleport",
  rotate: 20,
  px: 20,
  py: 370,
  stay: true,
});

powers.push({
  x: 60,
  y: 365,
  width: 20,
  height: 20,
  color: "#2A5D77",
  effect: "win",
  stay: true,
});

boxes.push({
  x: 0,
  y: height / 4 + 10,
  width: 10,
  height: height,
  color: "green",
});
boxes.push({
  x: 0,
  y: 0,
  width: 10,
  height: height / 4 - 15,
  color: "green",
});
boxes.push({
  x: 0,
  y: height - 10,
  width: width,
  height: 50,
  color: "orange",
});
boxes.push({
  x: width - 10,
  y: 0,
  width: 50,
  height: height,
  color: "yellow",
});
boxes.push({
  x: 290,
  y: 200,
  width: 260,
  height: 10,
  color: "blue",
});
boxes.push({
  x: 590,
  y: 200,
  width: 80,
  height: 10,
  color: "blue",
});
boxes.push({
  x: 120,
  y: 250,
  width: 150,
  height: 10,
  color: "red",
});
boxes.push({
  x: 220,
  y: 300,
  width: 80,
  height: 10,
  color: "black",
});
boxes.push({
  x: 340,
  y: 350,
  width: 90,
  height: 10,
  color: "#655643",
});
boxes.push({
  x: 740,
  y: 300,
  width: 160,
  height: 10,
  color: "#655543",
});
boxes.push({
  x: 0,
  y: 350,
  width: 90,
  height: 10,
  color: "#655543",
});
boxes.push({
  x: 90,
  y: 350,
  width: 10,
  height: 50,
  color: "#655543",
});

canvas.width = width;
canvas.height = height;

function update() {
  if (
    (keys[38] || keys[32] || keys[87]) &&
    !player.jumping &&
    player.grounded
  ) {
    player.jumping = true;
    player.grounded = false;
    player.velY = -player.speed * 2.5;
  }

  if (keys[39] || keys[68]) {
    if (player.velX < player.speed) {
      player.velX++;
    }
  }

  if (keys[37] || keys[65]) {
    if (player.velX > -player.speed) {
      player.velX--;
    }
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

    if (dir === "l" || dir === "r") {
      player.velX = 0;
      player.jumping = false;
    } else if (dir === "b") {
      player.grounded = true;
      player.jumping = false;
    } else if (dir === "t") {
      player.velY *= -1;
    }
  }

  if (player.grounded) {
    player.velY = 0;
  }

  player.x += player.velX;
  player.y += player.velY;

  ctx.fill();
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);

  for (let j = 0; j < powers.length; j++) {
    ctx.save();
    var cx = powers[j].x + 0.5 * powers[j].width,
      cy = powers[j].y + 0.5 * powers[j].height;
    ctx.translate(cx, cy);
    ctx.rotate((Math.PI / 180) * 45);
    if (powers[j].effect === "teleport") {
      ctx.rotate((Math.PI / 180) * powers[j].rotate);
      powers[j].rotate = (Math.PI / 180) * powers[j].rotate;
    }
    ctx.translate(-cx, -cy);
    ctx.fillStyle = powers[j].color;
    ctx.fillRect(powers[j].x, powers[j].y, powers[j].width, powers[j].height);
    ctx.restore();

    if (colCheck(player, powers[j]) !== null) {
      if (powers[j].effect === "gravity") {
        gravity = 0.4;
        player.speed = 4;
        player.color = "white";
      } else if (powers[j].effect === "shrink") {
        player.width = 10;
        player.height = 10;
        player.speed = 5;
      } else if (powers[j].effect === "teleport") {
        player.x = powers[j].px;
        player.y = powers[j].py;
      } else if (powers[j].effect === "win") {
        const r = confirm("You win! Play again?");
        if (r == false) {
          player.x = 200;
          player.y = 200;
        } else {
          window.location.href = window.location.href;
        }
      }
      if (powers[j].stay !== true) powers[j].width = 0;
    }
  }
  requestAnimationFrame(update);
}

function colCheck(shapeA, shapeB) {
  var vX = shapeA.x + shapeA.width / 2 - (shapeB.x + shapeB.width / 2),
    vY = shapeA.y + shapeA.height / 2 - (shapeB.y + shapeB.height / 2),
    hWidths = shapeA.width / 2 + shapeB.width / 2,
    hHeights = shapeA.height / 2 + shapeB.height / 2,
    colDir = null;

  if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {
    var oX = hWidths - Math.abs(vX),
      oY = hHeights - Math.abs(vY);

    if (oX >= oY) {
      if (vY > 0) {
        colDir = "t";
        shapeA.y += oY;
      } else {
        colDir = "b";
        shapeA.y -= oY;
      }
    } else if (vX > 0) {
      colDir = "l";
      shapeA.x += oX;
    } else {
      colDir = "r";
      shapeA.x -= oX;
    }
  }
  return colDir;
}

document.body.addEventListener("keydown", function (e) {
  keys[e.keyCode] = true;
});

document.body.addEventListener("keyup", function (e) {
  keys[e.keyCode] = false;
});

window.addEventListener("load", function () {
  update();
});
