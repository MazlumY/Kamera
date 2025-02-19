// Declare Kinectron
var kinectron = null;
// Create P5 Canvas
var myCanvas = null;

// Create objects to store and access hands
var handColors = {};
var hands = {};

function setup() {
  myCanvas = createCanvas(512, 424);
  background(0);
  noStroke();

  // Define and create an instance of kinectron
  var kinectronIpAddress = "127.0.0.1"; // FILL IN YOUR KINECTRON IP ADDRESS HERE
  kinectron = new Kinectron(kinectronIpAddress);

  // Connect with application over peer
  kinectron.makeConnection();

  // Request right hand and set callback for received hand
  kinectron.startTrackedJoint(kinectron.HANDRIGHT, drawRightHand);
}

function draw() {

}

function drawRightHand(hand) {
  if (hand?.jointType === 11) {
    sendDataToPlate(hand);
  }
  // Use handColors object to store unique colors for each hand  

  // If we already have a color for incoming hand
  if (hand.trackingId in handColors) {
    // Create color property and give the hand its assigned color
    hand.color = handColors[hand.trackingId];
  } else {
    // If we don't have a color for the hand yet
    // Create a random RGB color
    var randomColor = [random(255), random(255), random(255)];
    // Create color property on the hand and assign it a random color
    hand.color = randomColor;
    // Add it to an array for easy look up
    handColors[hand.trackingId] = hand.color;
  }

  // Use hands object to store hands for drawing

  // Update or create the hand in the hands object
  hands[hand.trackingId] = hand;

  // Clear background
  background(0);

  // Draw an ellipse at each hand's location in its designated color 
  for (var key in hands) {
    var trackedHand = hands[key];
    fill(trackedHand.color[0], trackedHand.color[1], trackedHand.color[2]);
    ellipse(trackedHand.depthX * myCanvas.width, trackedHand.depthY * myCanvas.height, 50, 50);
  }
}

// function sendDataToServer(data) {
// //  console.table(data)
//  sendData(data);
// }

