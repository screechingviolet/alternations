class Location {
  constructor(path, name="", description="You are in a place.") {
    this.path = path;
    this.name = name;
    this.description = description;
    this.img = new Image(); 
    this.img.src = this.path;
    // set offset too
  }
}

// ############## CANVAS CONFIG ##############

// DOCUMENT ELEMENTS

const canvas = document.getElementById('backgroundCanvas');

// LOADED CONTENT 

let location_paths = ['house.jpg', 'brambles_and_candles.jpg', 'computer_garden.jpg', 'crossroads.jpg', 'graveyard.jpg', 'path_into_storm.jpg', 'weeping_willow_garden.jpg', 'white_pond.jpg'];
let loaded_locations = [];
for (const path of location_paths) {
  loaded_locations.push(new Location('backgrounds/' + path));
}

// UTILS

const ctx = canvas.getContext('2d');
let current_location = loaded_locations[0];

// FUNCTIONS 

function resizeCanvasAndDrawBG() {
  // Set canvas dimensions to fill the window
  let img = current_location.img;

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Calculate scaling factor to fill the canvas while maintaining aspect ratio
  const scaleFactor = Math.max(canvas.width / img.width, canvas.height / img.height);

  // Calculate new dimensions of the image
  const newWidth = img.width * scaleFactor;
  const newHeight = img.height * scaleFactor;

  // Calculate position to center the image
  const x = (canvas.width - newWidth) / 2;
  const y = (canvas.height - newHeight) / 2;
  ctx.drawImage(img, x, y, newWidth, newHeight);

}

function changeLocation() {
  current_location = loaded_locations[3];
  resizeCanvasAndDrawBG();

}

// LISTENERS & INTERACTION

window.addEventListener('resize', resizeCanvasAndDrawBG);

current_location.img.onload = () => {
  resizeCanvasAndDrawBG();
}
