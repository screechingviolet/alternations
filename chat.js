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

async function typeLine(text) {
  const newLine = document.createElement('p');
  chatHistory.prepend(newLine);

  for (let i = 0; i < text.length; i++) {
    newLine.textContent += text[i];
    await delay(20);
  }
}

// LISTENERS & INTERACTION

playerTextarea.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') { // or e.keyCode === 13
    e.preventDefault();

    addLine("> " + playerTextarea.value);
    typeLine("echo: " + playerTextarea.value);

    playerTextarea.value = "";

  }
});
