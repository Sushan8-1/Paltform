(function (){
  var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
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
      color: '#E6AC27'
    },
    keys = [],
    friction = 0/8,
    gravity = 0.4,
    boxes = 0.4,
    powerup = [];

powerup.push({
  x: 810,
  y: 250,
  width: 20,
  height: 20,
  color: '#BF4D28',
  effect: 'shrink',
});
