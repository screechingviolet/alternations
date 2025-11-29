
// ############## CHAT SETUP ##############

// DOCUMENT ELEMENTS

const playerTextarea = document.getElementById('player-textarea');
const chatHistory = document.getElementById('chatHistory');

// UTILS

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// FUNCTIONS

function addLine(text) {
  const newLine = document.createElement('p');
  newLine.textContent = text;
  chatHistory.prepend(newLine);
}

function formatList(arr) {
  if (arr.length === 0) return "";
  if (arr.length === 1) return arr[0];
  if (arr.length === 2) return arr[0] + " and " + arr[1];

  // More than 2
  return arr.slice(0, -1).join(", ") + ", and " + arr[arr.length - 1];
}

async function typeLine(text) {
  const newLine = document.createElement('p');
  chatHistory.prepend(newLine);

  for (let i = 0; i < text.length; i++) {
    newLine.textContent += text[i];
    await delay(20);
  }
}

async function runIntroSequence() {
  document.body.classList.add("fade-start");

  const title = document.getElementById("introTitle");

  // Show title
  title.classList.add("visible");

  // Wait while title is visible
  await delay(2000);

  // Fade out title
  title.classList.remove("visible");

  // Fade in page
  document.body.classList.remove("fade-start");
  document.body.classList.add("fade-end");

  await delay(2500);
}

// format is a graph
// Location stores a dictionary mapping "up" "down" etc to name of other location
// https://www.geeksforgeeks.org/deep-learning/types-of-convolution-kernels/
// play with convolution of my images and display some of the outputs
// design items, an item class and randomly assign them to different locations.


// LISTENERS & INTERACTION

playerTextarea.addEventListener('keydown', async (e) => {
  if (e.key === 'Enter') { // or e.keyCode === 13
    e.preventDefault();

    let temp = playerTextarea.value.split(" ");
    let command = playerTextarea.value;
    playerTextarea.value = "";
    addLine("> " + command);
    // typeLine("echo: " + playerTextarea.value);

    // if (playerTextarea.value == "move") {
    if (temp[0] == "pick" && temp[1] == "up") {
      await typeLine(pick_up(temp[2]));
    } else if (temp[0] == "drop") {
      await typeLine(drop(temp[1]));
    } else if (temp[0] == "inventory") {
      if (inventory.length == 0) await typeLine("You have no items in your inventory.");
      else await typeLine("Your inventory contains a " + formatList(inventory) + ".");
    } else if (temp[0] == "help") {
      await typeLine("Try different commands that might have an effect.")
      await typeLine("For items: pick up __, inspect ___, use ___ [with ___], drop ___.")
      await typeLine("For entities: interact with ___, give ___ to ___.")
      await typeLine("For locations, use keywords such as 'forward', 'backward', 'left', 'right', 'up', ??, ??")
    } else if (temp[0] == "inspect") {
      await typeLine(inspect(temp[1]));
    }
    else { // change so only accepted possible location change words
      await typeLine(changeLocation(command));
    }
    // }

    

  }
});


let inventory = []; // stores indices of item
let pennyFound = false;


class Location {
  constructor(path, name, description, navigation, top, left, items, inspectable) {
    this.path = path;
    this.name = name;
    this.description = description;
    this.navigation = navigation;
    this.img = new Image(); 
    this.img.src = this.path;
    this.top = top;
    this.left = left;
    this.items = items;
    this.inspectable = inspectable;
    this.ghosts = [];
    this.filter = "none";
  }
}

class Ghost {
  constructor(name, item_name, interact_response, give_response, shoot) {

  }
}

// have a function 'use(item1, (optional)item2)'

let item_lookup = {};

class Item {
  constructor(name, ghost_name, inspect_result) {

  }
}

function pick_up(name) {
  // change to lookup[name].name where internal is concerned
    if (inventory.includes(name)) {
      return "You already have this item in your inventory.";
    } else if (!current_location.items.includes(name)) {
      return "There is no such thing here...";
    } else {
      inventory.push(name);
      current_location.items.splice(current_location.items.indexOf(name), 1)
      return "You pick up the " + name + ".";
    }
}

function drop(name) {
  if (!inventory.includes(name)) {
    return "How can you drop an item you don't have?";
  } else {
    inventory.splice(inventory.indexOf(name), 1);
    current_location.items.push(name);
    return "You drop the " + name + ".";
    // checks for ghost satisfaction
  }
}

function inspectable(name) {
  switch (name) {
  case "brambles":
    return "You peer through the prickly brambles. You can see a tattered diary lying there in the dim light. "
    break;
  case "candles": 
    return "The candles burn fiercely. Defiantly? ";
    break;
  case "bush":
    if (pennyFound) {
      return "You shake the bush. It reproaches you silently. ";
    }
    current_location.items.push("penny");
    pennyFound = true;
    return "You shake the bush. A penny spills out and lands on the soft ground. "

    break;
  }
}

// multiple lookups can correspond tot he nsame thinghh
// "contraption", "ghost hunter"

function inspect(name) {
  if (inventory.includes(name) || current_location.items.includes(name)) {
    // lookup item and find desc
  } else if (current_location.inspectable.includes(name)) {
    return inspectable(name);
  } else {
    return "There's no such item here...";
  }
}


// ai music, modular components, ai interpreted commands, animating between convolved images through fade or flicker

// ############## CANVAS CONFIG ##############

// DOCUMENT ELEMENTS

const canvas = document.getElementById('backgroundCanvas');
const textContainer = document.getElementById('fix');


// LOADED CONTENT 
const possible_filters = ["none", "blur_brighten", "sharpen", "edge_detect"];

const input = {
  "locations": [
    {
      "name": "house",
      "path": "house.jpg",
      "description": "You stand in front of a dilapidated yet inviting house.",
      "navigation": {
        "left": "brambles_and_candles",
        "right": "computer_garden",
        "forward": "crossroads"
      },
      "top": "85%",
      "left": "55%",
      "items": ["letter", "contraption"]
    },
    {
      "name": "brambles_and_candles",
      "path": "brambles_and_candles.jpg",
      "description": "The brambles clamor for attention and obscure your sight.",
      "navigation": {
        "right": "house",
        "forward": "weeping_willow_garden"
      },
      "left": "40%",
      "top": "15%",
      "inspectable": ["brambles", "candles"],
      "items": []
    },
    {
      "name": "computer_garden",
      "path": "computer_garden.jpg",
      "description": "You hear the soft clattering of metal in the wind and beeping of a near-dead bundle of circuits.",
      "navigation": {
        "left": "house",
        "forward": "white_pond"
      }
    },
    {
      "name": "crossroads",
      "path": "crossroads.jpg",
      "description": "The light is oddly bright. And also green. There's a bush, too.",
      "navigation": {
        "backward": "house",
        "left": "graveyard",
        "right": "path_into_storm",
        "forward": "weeping_willow_garden"
      },
      "inspectable": ["bush"]
    },
    {
      "name": "graveyard",
      "path": "graveyard.jpg",
      "description": "Isn't it a bit of a cliché for ghosts to hang out in the graveyard?",
      "navigation": {
        "right": "crossroads",
        "forward": "weeping_willow_garden"
      }
    },
    {
      "name": "path_into_storm",
      "path": "path_into_storm.jpg",
      "description": "The storm rumbles sluggishly.",
      "navigation": {
        "left": "crossroads",
        "forward": "white_pond"
      }
    },
    {
      "name": "weeping_willow_garden",
      "path": "weeping_willow_garden.jpg",
      "description": "The strands flutter in the wind unnaturally quickly, back and forth.",
      "navigation": {
        "backward": "crossroads",
        "left": "graveyard",
        "right": "brambles_and_candles",
        "forward": "white_pond"
      }
    },
    {
      "name": "white_pond",
      "path": "white_pond.jpg",
      "description": "The pond is cloudy and swirling slowly.",
      "navigation": {
        "backward": "weeping_willow_garden",
        "left": "computer_garden",
        "right": "path_into_storm"
      }
    }

  ]

  // need to add fountain and shed
}

// flowers in dark_forest
// flashlight and speakers in computer garden
// fishing rod and plugpoint in shed
// rechargeable battery take it from flashlight
// charge it in the light_storm

const items = ["candle - needs to be snuffed out without setting a fire", 
  "speakers - need to be found in computer garden and made to work again (where is the plugpoint?) to play ghost's favorite music", 
  "penny - shake bush, needs to be thrown into fountain to make a wish for the ghost", 
  "fishing rod - need to catch a fish which the ghost never managed to do when he was alive", 
  "flowers = goal to return to the grave of his wife", 
  "flashlight - figure out how to turn it on to find ghost's diary", 
  "battery - put into flashlight", 
  "diary - needs to be found in brambles to send teenager ghost to peace"];

const ghosts = [""];

// let location_paths = ['house.jpg', 'brambles_and_candles.jpg', 'computer_garden.jpg', 'crossroads.jpg', 'graveyard.jpg', 'path_into_storm.jpg', 'weeping_willow_garden.jpg', 'white_pond.jpg'];
// let location_names = ['house', 'brambles_and_candles', 'computer_garden', 'crossroads', 'graveyard', 'path_into_storm', 'weeping_willow_garden', 'white_pond'];
let loaded_locations = {};
// for (const path of location_paths) {
//   loaded_locations.push(new Location('backgrounds/' + path));
// }

function addLocations(input) {

  if (!input.locations || !Array.isArray(input.locations)) return;

  for (const loc of input.locations) {
    // Ensure path is provided
    if (!loc.path) {
      console.warn(`Location "${loc.name || 'Unnamed'}" is missing a path.`);
      continue;
    }

    // Prepend 'backgrounds/' if path looks like just a filename
    const fullPath = loc.path.includes('/') ? loc.path : 'backgrounds/' + loc.path;

    // Create a new Location directly from input object
    const location = new Location(
      fullPath,                   // path
      loc.name || "",             // name
      loc.description || "You are in a place.", // description
      loc.navigation || {},        // navigation
      loc.top || "85%",
      loc.left || "80%",
      loc.items || [],
      loc.inspectable || []

    );

    // Add it to loaded_locations
    loaded_locations[loc.name] = location;
  }
}

addLocations(input);


// UTILS

const ctx = canvas.getContext('2d');
let current_location = loaded_locations["house"];

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

function changeLocation(command) {
  // Math.floor(Math.random() * (7 - 0 + 1))
  if (!(command in current_location.navigation)) {
    return "There is a hedge in your way.";
  }
  current_location = loaded_locations[current_location.navigation[command]];
  // console.log();
  resizeCanvasAndDrawBG();
  textContainer.style.top = current_location.top;
  textContainer.style.left = current_location.left;
  console.log('set position:', textContainer.style.top, textContainer.style.left);
  let items = "";
  if (current_location.items.length > 0) {
    items += "There is a " + formatList(current_location.items) + " here. ";
  }

  return "You move " + command + ". " + current_location.description + " " + items;


}

// LISTENERS & INTERACTION

window.addEventListener('resize', resizeCanvasAndDrawBG);

current_location.img.onload = async () => {
  resizeCanvasAndDrawBG();
  textContainer.style.top = current_location.top;
  textContainer.style.left = current_location.left;
  await runIntroSequence();

  await typeLine(
    current_location.description +
    " On the ground next to you, there is a letter and an odd, wirey contraption."
  );
};
