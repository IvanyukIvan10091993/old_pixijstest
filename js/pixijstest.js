// Test variables

/*var
  S = 0,
  E = 0;
var T = function() {console.log(E - S); S = 0; E = 0;};*/


// Global variables

var
  ADDQUANTITY = 100,
  BACKGROUNDCOLORHEX = "0xdedede",
  FOLLOWERS = {},
  FPS = 60,
  POINTER,
  POINTERX = 0,
  POINTERY = 0,
  RENDERER,
  STAGE,
  STATS;
FOLLOWERS.length = 0;


// rgbToHex functions: translate color from rgb to hex format

var componentToHex = function(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

var rgbToHex = function(r, g, b) {
  return "0x" + componentToHex(r) + componentToHex(g) + componentToHex(b);
};


// createFollower function: creates sprite

var createFollower = function(positionX, positionY, sizeX, sizeY, speed, colorR, colorG, colorB, hashOfObjects, stage) {
  var image = new PIXI.Graphics(); // Creates new graphics object
  image.beginFill(rgbToHex(colorR, colorG, colorB)); // Sets color
  image.drawEllipse(0, 0, sizeX, sizeY); // Draws ellipse
  image.endFill(); // Stops fill
  var follower = new PIXI.Sprite(image.generateTexture()); // Creates new sprite with new generated texture
  image.destroy(); // Clears graphics object from memory
  follower.anchor.x = 0.5; // Centers texture on sprite
  follower.anchor.y = 0.5; // Centers texture on sprite
  follower.position.x = positionX; // Sets positionX
  follower.position.y = positionY; // Sets positionY
  follower.speed = speed; // Sets speed
  stage.addChild(follower); // Adds our sprite to the stage
  hashOfObjects[hashOfObjects.length] = follower;
  hashOfObjects.length += 1; // Adjusts length
};


// A function to move objects to passed coordinates

var moveToTarget = function(object, targetX, targetY) {
  var
    xCathetus = targetX - object.position.x, // Required to calculate cosinus
    yCathetus = targetY - object.position.y, // Required to calculate sinus
    hypotenuse = Math.pow(xCathetus * xCathetus + yCathetus * yCathetus, 0.5); // Required to calculate cosinus and sinus
  if (hypotenuse > object.speed) { // Checks if movement should use all movement points
    object.position.x += xCathetus / hypotenuse * object.speed; // Adds speed projection onto the x-asis to object x coordinate
    object.position.y += yCathetus / hypotenuse * object.speed; // Adds speed projection onto the y-asis to object y coordinate
  } else if (hypotenuse > 0) { // Checks if movement is required
    object.position.x = targetX; // Sets object x coordinate to target x coordinate
    object.position.y = targetY; // Sets object y coordinate to target y coordinates
  }
};


// Renderer setup

RENDERER = PIXI.autoDetectRenderer(innerWidth, innerHeight - 4, {backgroundColor : BACKGROUNDCOLORHEX});
document.body.appendChild(RENDERER.view);
STAGE = new PIXI.Container();
POINTER = RENDERER.plugins.interaction.eventData;


// Creates objects on pointer up

var pointerUp = function() {
  /*var
    randomSizeX = 10,
    randomSizeY = 10,
    randomSpeed = 100 / FPS,
    randomColorR = 0,
    randomColorG = 0,
    randomColorB = 0;*/
  for (var i = 0; i < ADDQUANTITY; i++) {
    var
      randomSizeX = 5 + Math.floor(Math.random() * 11),
      randomSizeY = randomSizeX,
      randomSpeed = (10 + Math.floor(Math.random() * 491)) / FPS,
      randomColorR = Math.floor(Math.random() * 256),
      randomColorG = Math.floor(Math.random() * 256),
      randomColorB = Math.floor(Math.random() * 256);
    createFollower(POINTERX, POINTERY, randomSizeX, randomSizeY, randomSpeed, randomColorR, randomColorG, randomColorB, FOLLOWERS, STAGE);
    text.text = "Quantity: " + FOLLOWERS.length;
    text.position.x = (innerWidth - text.width) / 2;
  };
};


// Event listeners

RENDERER.view.addEventListener("mouseup", pointerUp, true);
RENDERER.view.addEventListener("touchend", pointerUp, true);


// Stats setup

STATS = new Stats();
document.body.appendChild(STATS.domElement);
STATS.domElement.style.position = "absolute";
STATS.domElement.style.top = "0px";
var text = new PIXI.Text('Click to add objects',{font : '24px Arial', fill : 0x000000, align : 'center'});
text.position.x = (innerWidth - text.width) / 2;
STAGE.addChild(text);


// Rendering function set

var frame = function() {
  STATS.begin();
  POINTERX = POINTER.data.global.x;
  POINTERY = POINTER.data.global.y;
  //S = performance.now();
  for (var i = 0, l = FOLLOWERS.length; i < l; i++) {
    var follower = FOLLOWERS[i]; // Removes the necessity to find object in hash every time we need its property
    moveToTarget(follower, POINTERX, POINTERY); // Moves
  };
  //E = performance.now();
  //if (FOLLOWERS.length > 0) {T()};
  RENDERER.render(STAGE);
  requestAnimationFrame(frame);
  STATS.end();
};


// Rendering function call

requestAnimationFrame(frame);