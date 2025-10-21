// ############## CANVAS CONFIG ##############

// DOCUMENT ELEMENTS

const canvas = document.getElementById('backgroundCanvas');

// LOADED CONTENT 

const img = new Image();
img.src = 'backgrounds/house.png';

// UTILS

const ctx = canvas.getContext('2d');

// FUNCTIONS 

function resizeCanvas() {
    drawCanvasContent(); 
}

function resizeCanvasAndDrawImage(img) {
  // Set canvas dimensions to fill the window
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

  // Draw the image
  ctx.drawImage(img, x, y, newWidth, newHeight);
}

function drawCanvasContent() {
  // ctx.fillStyle = 'rgba(100, 100, 0, 1)'; // Semi-transparent black background
  // ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  resizeCanvasAndDrawImage(img);
}

// LISTENERS & INTERACTION

window.addEventListener('resize', resizeCanvas);

img.onload = () => {
  resizeCanvas();
}
