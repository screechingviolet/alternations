// ############## NOTES ##############

// format is a graph
// Location stores a dictionary mapping "up" "down" etc to name of other location
// https://www.geeksforgeeks.org/deep-learning/types-of-convolution-kernels/
// play with convolution of my images and display some of the outputs
// design items, an item class and randomly assign them to different locations.
// have a function 'use(item1, (optional)item2)'
// multiple lookups can correspond tot he nsame thinghh
// "contraption", "ghost hunter"
// ai music, modular components, ai interpreted commands, animating between convolved images through fade or flicker
// flowers in dark_forest
// flashlight and speakers in computer garden
// fishing rod and plugpoint in shed
// rechargeable battery take it from flashlight
// charge it in the light_storm



/* ############## GAME CONFIG ##############

--- USEFUL UTILS ---
addLine(text): adds line to chat history w/o typing effect
async typeLine(text): adds line to chat history w/ typing effect
formatList(arr): takes an array, formats in human-readable, comma-separated string
delay(ms): delay for ms milliseconds

*/

// CLASSES

class Location {
  constructor(path, name, description, navigation, top, left, items, inspectable, ghosts) {
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
    this.ghosts = ghosts;
    this.filter = "none";
  }
}

class Ghost {
  constructor(name, presences, interact_response, peace_response, shoot) {
    this.name = name;
    this.presences = presences;
    this.interact_response = interact_response;
    this.peace_response = peace_response;
  }
}

class Item {
  constructor(name, inspect_result) {
    this.name = name;
    // this.other_names = other_names;
    // this.ghost_name = ghost_name;
    this.inspect_result = inspect_result;
  }
}

/* 

"There is a brief flicker in the air. "
"The air nearby warps slightly. "
"You catch a hint of a figure out of the corner of your eye. "
"You see a flickering figure "


PENNY GIRL


FLOWER HUSBAND
"You hear a faint, low wail. "
"There's a brief flicker in the air, amidst a lonely silence. "
"The air warps for a second, and you see the momentary image of an old man holding a bouquet, as if an afterimage printed on your eyelids. "

FISHING ROD FELLOW
"You hear the bubbling of water and a faint splash. "
"You hear the creaking sound of a reel being drawn. " ?
"A splashing sound, a groan of frustration, . "

*/

// DOCUMENT ELEMENTS

const playerTextarea = document.getElementById('player-textarea');
const chatHistory = document.getElementById('chatHistory');
const canvas = document.getElementById('backgroundCanvas');
const textContainer = document.getElementById('fix');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById("startButton");

// GAME ELEMENTS

const global_ghosts = {
  "penny_girl": new Ghost("penny_girl", ["You hear the faint sound of a child laughing as the air seems to warp slightly. ",
"You hear the faint clinking of metal. Copper? ",
"You catch the hint of a young figure in the air, outlined in dim light. "],
"You see a young girl fade into view slightly by the water, translucent and wavering. Her tears fall and splash into nothingness. ",
"You hear a soft, happy clinking as the young girl fades into view. Her figure shimmers as she watches the penny sink through the water, out of sight. You watch her flicker apart in slow sparkling glints, into a cloud which disperses quickly. A single, tinkling note sounds. "
)};

const item_map = {
  "penny": "penny",
  "coin": "penny", 
  "rod": "fishing rod",
  "fishing rod": "fishing rod",
  "contraption": "metatorch",
  "metatorch": "metatorch",
  "letter": "letter"
}

const item_class_map = {
  "penny": new Item("penny", "It's a slightly rusted penny."),
  "letter": new Item("letter", "The letter is crumpled and folded. Unfolding it, you see that some parts have faded out of visibility, but you can make out a few phrases: '...grounds infested with ghosts...' '...unseen levels of mutation...' 'metatorch?'"),
  "metatorch": new Item("metatorch", "It's a grey metal implement with a dull sheen, sort of like an old torch cast in iron. You feel it pulsing with a gentle green glow.")
}

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
      "items": ["letter", "metatorch"]
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
      },
      "inspectable": ["tombstone"]
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
      },
      "ghosts": ["penny_girl"],
      "inspectable": ["pond"]
    },
    {
      "name": "light_storm",
      "path": "light_storm.jpg",
      "description": "It is very bright out here.",
      "navigation": {

      }
    },
    {
      "name": "garden_shed",
      "path": "garden_shed.jpg",
      "description": "The shed is broken-down, rotted away, but the doorframe still stands and you can make out shapes inside.",
      "navigation": {
        
      },
      "items": ["fishing rod"]
    },
    {
      "name": "fish_pond",
      "path": "fish_pond.jpg",
      "description": "The fish swim around as if in slow motion.",
      "navigation": {
        
      }
    },
    {
      "name": "dark_forest",
      "path": "dark_forest.jpg",
      "description": "Are those shadows moving?",
      "navigation": {
        
      },
      "items": ["flowers"]
    }

  ]
}

const items = ["candle - needs to be snuffed out without setting a fire", 
  "speakers - need to be found in computer garden and made to work again (where is the plugpoint?) to play ghost's favorite music", 
  "penny - shake bush, needs to be thrown into fountain to make a wish for the ghost", 
  "fishing rod - need to catch a fish which the ghost never managed to do when he was alive", 
  "flowers = goal to return to the grave of his wife", 
  "flashlight - figure out how to turn it on to find ghost's diary", 
  "battery - put into flashlight", 
  "diary - needs to be found in brambles to send teenager ghost to peace"];

const possible_filters = ["none", "blur_brighten", "sharpen", "edge_detect"];

// GLOBAL STATE

let inventory = []; // stores truename of item
let pennyFound = false;
let diaryFound = false;
let item_lookup = {};
let loaded_locations = {};

let altmaps = [
{
  "house": {
    "forward": "computer_garden",
    "left": "crossroads",
    "right": "brambles_and_candles"
  },
  "computer_garden": {
    "backward": "house",
    "forward": "white_pond",
    "right": "garden_shed",
    "up": "fish_pond"
  },
  "crossroads": {
    "right": "house",
    "forward": "graveyard",
    "left": "path_into_storm"
  },
  "brambles_and_candles": {
    "left": "house",
    "forward": "weeping_willow_garden",
    "right": "dark_forest"
  },
  "graveyard": {
    "backward": "crossroads",
    "forward": "weeping_willow_garden"
  },
  "path_into_storm": {
    "right": "crossroads",
    "forward": "light_storm",
    "left": "white_pond"
  },
  "weeping_willow_garden": {
    "backward": "graveyard",
    "right": "brambles_and_candles",
    "forward": "white_pond"
  },
  "white_pond": {
    "backward": "weeping_willow_garden",
    "left": "computer_garden",
    "right": "path_into_storm",
    "down": "fish_pond"
  },
  "light_storm": {
    "backward": "path_into_storm",
    "left": "white_pond",
    "right": "fish_pond"
  },
  "garden_shed": {
    "left": "computer_garden",
    "forward": "fish_pond",
    "right": "dark_forest"
  },
  "fish_pond": {
    "backward": "garden_shed",
    "left": "light_storm",
    "up": "white_pond"
  },
  "dark_forest": {
    "left": "brambles_and_candles",
    "up": "garden_shed",
    "right": "graveyard"
  }
},
{
  "house": {
    "forward": "crossroads",
    "left": "garden_shed",
    "right": "dark_forest"
  },
  "crossroads": {
    "backward": "house",
    "left": "weeping_willow_garden",
    "right": "graveyard",
    "diagonally": "brambles_and_candles"
  },
  "garden_shed": {
    "right": "house",
    "forward": "computer_garden"
  },
  "dark_forest": {
    "left": "house",
    "forward": "brambles_and_candles",
    "down": "fish_pond"
  },
  "computer_garden": {
    "backward": "garden_shed",
    "forward": "white_pond",
    "right": "path_into_storm"
  },
  "graveyard": {
    "left": "crossroads",
    "forward": "brambles_and_candles"
  },
  "weeping_willow_garden": {
    "right": "crossroads",
    "forward": "white_pond"
  },
  "brambles_and_candles": {
    "backward": "graveyard",
    "right": "dark_forest",
    "forward": "light_storm"
  },
  "white_pond": {
    "backward": "weeping_willow_garden",
    "left": "computer_garden",
    "right": "fish_pond"
  },
  "fish_pond": {
    "left": "white_pond",
    "up": "dark_forest",
    "forward": "light_storm"
  },
  "path_into_storm": {
    "left": "computer_garden",
    "forward": "light_storm"
  },
  "light_storm": {
    "backward": "path_into_storm",
    "left": "brambles_and_candles",
    "right": "path_into_storm"
  }
},
{
  "house": {
    "right": "crossroads",
    "forward": "garden_shed",
    "left": "white_pond"
  },
  "crossroads": {
    "left": "house",
    "forward": "path_into_storm",
    "right": "graveyard",
    "up": "fish_pond"
  },
  "garden_shed": {
    "backward": "house",
    "right": "computer_garden",
    "forward": "fish_pond"
  },
  "white_pond": {
    "right": "house",
    "forward": "weeping_willow_garden",
    "diagonally": "path_into_storm"
  },
  "computer_garden": {
    "left": "garden_shed",
    "forward": "brambles_and_candles"
  },
  "graveyard": {
    "left": "crossroads",
    "forward": "weeping_willow_garden"
  },
  "path_into_storm": {
    "backward": "crossroads",
    "forward": "light_storm"
  },
  "fish_pond": {
    "backward": "garden_shed",
    "left": "light_storm",
    "right": "weeping_willow_garden"
  },
  "brambles_and_candles": {
    "backward": "computer_garden",
    "forward": "dark_forest"
  },
  "weeping_willow_garden": {
    "backward": "white_pond",
    "left": "graveyard",
    "right": "fish_pond"
  },
  "light_storm": {
    "backward": "path_into_storm",
    "right": "fish_pond",
    "left": "dark_forest"
  },
  "dark_forest": {
    "backward": "brambles_and_candles",
    "up": "graveyard",
    "right": "light_storm"
  }
},
{
  "house": {
    "forward": "brambles_and_candles",
    "left": "crossroads",
    "right": "garden_shed"
  },
  "brambles_and_candles": {
    "backward": "house",
    "forward": "graveyard",
    "right": "computer_garden"
  },
  "crossroads": {
    "right": "house",
    "forward": "weeping_willow_garden",
    "left": "path_into_storm",
    "diagonally": "white_pond"
  },
  "garden_shed": {
    "left": "house",
    "forward": "fish_pond"
  },
  "graveyard": {
    "backward": "brambles_and_candles",
    "forward": "white_pond"
  },
  "computer_garden": {
    "left": "brambles_and_candles",
    "forward": "white_pond"
  },
  "path_into_storm": {
    "right": "crossroads",
    "forward": "light_storm"
  },
  "weeping_willow_garden": {
    "backward": "crossroads",
    "right": "white_pond"
  },
  "white_pond": {
    "backward": "graveyard",
    "left": "computer_garden",
    "right": "weeping_willow_garden",
    "down": "dark_forest"
  },
  "fish_pond": {
    "backward": "garden_shed",
    "forward": "light_storm"
  },
  "light_storm": {
    "backward": "path_into_storm",
    "left": "fish_pond",
    "right": "dark_forest"
  },
  "dark_forest": {
    "up": "white_pond",
    "left": "light_storm"
  }
},
{
  "house": {
    "forward": "weeping_willow_garden",
    "left": "computer_garden",
    "right": "garden_shed"
  },
  "computer_garden": {
    "right": "house",
    "forward": "white_pond",
    "left": "brambles_and_candles",
    "diagonally": "fish_pond"
  },
  "garden_shed": {
    "left": "house",
    "forward": "fish_pond",
    "right": "path_into_storm"
  },
  "weeping_willow_garden": {
    "backward": "house",
    "left": "graveyard",
    "forward": "white_pond"
  },
  "brambles_and_candles": {
    "right": "computer_garden",
    "forward": "dark_forest"
  },
  "graveyard": {
    "right": "weeping_willow_garden",
    "forward": "path_into_storm"
  },
  "white_pond": {
    "backward": "weeping_willow_garden",
    "left": "computer_garden",
    "right": "fish_pond"
  },
  "fish_pond": {
    "backward": "garden_shed",
    "left": "white_pond",
    "forward": "light_storm"
  },
  "path_into_storm": {
    "left": "garden_shed",
    "backward": "graveyard",
    "forward": "light_storm"
  },
  "light_storm": {
    "backward": "fish_pond",
    "left": "path_into_storm",
    "right": "dark_forest"
  },
  "dark_forest": {
    "backward": "brambles_and_candles",
    "right": "light_storm",
    "left": "graveyard",
    "up": "brambles_and_candles"
  },
  "crossroads": {
    "forward": "graveyard",
    "right": "garden_shed",
    "left": "weeping_willow_garden"
  }
},
{
  "house": {
    "forward": "graveyard",
    "left": "weeping_willow_garden",
    "right": "computer_garden"
  },
  "graveyard": {
    "backward": "house",
    "right": "brambles_and_candles",
    "forward": "path_into_storm"
  },
  "weeping_willow_garden": {
    "right": "house",
    "forward": "white_pond",
    "diagonally": "fish_pond"
  },
  "computer_garden": {
    "left": "house",
    "forward": "garden_shed"
  },
  "brambles_and_candles": {
    "left": "graveyard",
    "forward": "dark_forest"
  },
  "path_into_storm": {
    "backward": "graveyard",
    "forward": "light_storm",
    "right": "white_pond"
  },
  "white_pond": {
    "backward": "weeping_willow_garden",
    "left": "path_into_storm",
    "forward": "fish_pond"
  },
  "garden_shed": {
    "backward": "computer_garden",
    "forward": "fish_pond",
    "up": "dark_forest"
  },
  "dark_forest": {
    "backward": "brambles_and_candles",
    "right": "fish_pond",
    "left": "light_storm"
  },
  "fish_pond": {
    "backward": "white_pond",
    "left": "garden_shed",
    "forward": "light_storm"
  },
  "light_storm": {
    "backward": "path_into_storm",
    "left": "fish_pond",
    "right": "dark_forest"
  },
  "crossroads": {
    "forward": "weeping_willow_garden",
    "left": "computer_garden",
    "right": "brambles_and_candles"
  }
}];
let picked_altmap = Math.floor(Math.random() * altmaps.length);

console.log(picked_altmap);
addLocations(input);

let current_location = loaded_locations["house"];

// UTILS

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

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

let myMusic;
// credit, w3schools
function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }    
}

// FUNCTIONS

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

function pick_up(name) {
  // change to lookup[name].name where internal is concerned
    if (inventory.includes(item_map[name])) {
      return "You already have this item in your inventory.";
    } else if (!current_location.items.includes(item_map[name])) {
      return "There is no such thing here...";
    } else {
      inventory.push(item_map[name]);
      current_location.items.splice(current_location.items.indexOf(item_map[name]), 1)
      return "You pick up the " + name + ".";
    }
}

function drop(name) {
  if (!inventory.includes(item_map[name])) {
    return "How can you drop an item you don't have?";
  } else {
    inventory.splice(inventory.indexOf(item_map[name]), 1);
    current_location.items.push(item_map[name]);
    return "You drop the " + name + ".";
    // checks for ghost satisfaction
  }
}

// endings
// convolution and mutation
// gpt locations

function inspectable(name) {
  console.log(name);
  switch (name) {
  case "brambles":
    if (diaryFound) return "You peer through the prickly brambles. It looks dim and dank.";
    else return "You peer through the prickly brambles. You can see a tattered diary lying there in the dim light. "
    break;
  case "candles": 
    return "The candles burn fiercely. Defiantly? ";
    break;
  case "pond": 
    return "The pond is filled with thick, cloudy murk begging to be displaced. "
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

function inspect(name) {
  if (inventory.includes(item_map[name]) || current_location.items.includes(item_map[name])) {
    // lookup item and find desc
    return item_class_map[item_map[name]].inspect_result;
  } else if (current_location.inspectable.includes(name)) {
    return inspectable(name);
  } else {
    return "There's no such item here...";
  }
}

function use(thing1, thing2) {
  if (thing1 == "penny" && thing2 == "pond" && current_location.ghosts.includes("penny_girl") && inventory.includes("penny")) {
    current_location.ghosts.splice(current_location.ghosts.indexOf("penny_girl"), 1);
    return "You drop the penny into the pond. " + global_ghosts["penny_girl"].peace_response;
  } else if (thing1 == "metatorch" && thing2 == "ghost" && current_location.ghosts.includes("penny_girl") && inventory.includes("metatorch")) {
    current_location.ghosts.splice(current_location.ghosts.indexOf("penny_girl"), 1);
    return "The metatorch begins to glow with a stronger green light, viscerally bright. A brief, ghostly green flame ignites at its tip, which sparks to a spot in the air as if connected, outlining a young girl in green fire. There is a brief, agonized flash, and she collapses to a single bright point, which leaves afterimages as it fades. The metatorch snuffs itself. ";
  }
  else {
    return "Nothing happens. ";
  }
}

// COMMAND HANDLING

playerTextarea.addEventListener('keydown', async (e) => {
  if (e.key === 'Enter') { // or e.keyCode === 13
    e.preventDefault();

    let temp = playerTextarea.value.split(" ");
    let command = playerTextarea.value;
    playerTextarea.value = "";
    addLine("> " + command);
    // typeLine("echo: " + playerTextarea.value);

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
      await typeLine(inspect(temp.slice(1).join(" "))); // change to splice all after
    } else if (temp[0] == "move") {
      await typeLine(changeLocation(temp.slice(1).join(" ")));
    } else if (temp[0] == "interact" && temp[1] == "with") {

    } else if (temp[0] == "give") {

    } else if (temp[0] == "use") {
      // if rest contains "with"
      let noWith = true;
      for (let i = 1; i < temp.length; i++) {
        if (temp[i] == "with") {
          await typeLine(use(temp.slice(1, i).join(" "), temp.slice(i+1).join(" ")));
          noWith = false;
          break;
        } 
      }
      if (noWith) await typeLine(use(temp.slice(1).join(" "), ""));
    }
    else { 
      await typeLine("The world does not respond. Type 'help' for a list of commands.");
    }

  }
});


// ############## LOCATION SETUP ##############


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
      // loc.navigation || {},        // navigation
      altmaps[picked_altmap][loc.name] || (loc.navigation || {}),
      loc.top || "85%",
      loc.left || "80%",
      loc.items || [],
      loc.inspectable || [],
      loc.ghosts || []

    );

    // Add it to loaded_locations
    loaded_locations[loc.name] = location;
  }
}

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

  let ghosts = "";
  if (current_location.ghosts.length > 0) {
    let temp_presences = global_ghosts[current_location.ghosts[0]].presences;
    ghosts += temp_presences[Math.floor(Math.random() * (temp_presences.length))];
  }

  let directions = "You feel you could move " + formatList(Object.keys(current_location.navigation)) + ".";
  directions = directions.replace("up", "???");
  directions = directions.replace("diagonally", "???");
  directions = directions.replace("down", "???");
  return "You move " + command + ". " + current_location.description + " " + items + " " + ghosts + " " + directions;

}

current_location.img.onload = async () => {
  startButton.style.display = "block";
};

async function startGame() {
  console.log("pressed");
  startButton.style.display = "none";   // hide the button
  resizeCanvasAndDrawBG();
  window.addEventListener('resize', resizeCanvasAndDrawBG);
  textContainer.style.top = current_location.top;
  textContainer.style.left = current_location.left;
  await runIntroSequence();
  myMusic = new sound("music/Schemawound - You Are Crystal.mp3");
  myMusic.play();

  let directions = "You feel you might be able to move " + formatList(Object.keys(current_location.navigation)) + ".";
  directions = directions.replace("up", "???");
  directions = directions.replace("diagonally", "???");
  directions = directions.replace("down", "???");
  await typeLine(
    current_location.description +
    " On the ground next to you, there is a letter and an odd, wirey contraption. "
    + directions
  );
}


startButton.addEventListener('click', startGame);

