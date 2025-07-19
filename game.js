// --- SETUP ---
// Get the canvas element from the HTML file
const canvas = document.getElementById('gameCanvas');
// Get the 2D drawing context, which is the tool we use to draw on the canvas
const ctx = canvas.getContext('2d');

// --- GAME STATE & OBJECTS ---
// This object will hold information about what keys are currently pressed
const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
    Space: false
};

// This object holds the player's information and position
let player = {
    x: 100,
    y: 100,
    width: 40,
    height: 40,
    color: 'blue',
    speed: 4
};

// This object holds our game's "memory", like messages and inventory
let gameState = {
    message: "Find the key to open the chest.",
    inventory: [], // The player starts with nothing
    isChestLocked: true
};

// A list of all the static objects in our room
const objects = [
    { name: 'bookshelf', x: 50, y: 300, width: 50, height: 150, color: '#8B4513' },
    { name: 'table', x: 300, y: 400, width: 200, height: 60, color: '#A0522D' },
    { name: 'chest', x: 650, y: 150, width: 80, height: 60, color: 'gold' }
];

// --- INPUT HANDLING ---
// Listen for keydown events (when a key is pressed)
window.addEventListener('keydown', (e) => {
    if (e.key === ' ' || e.key.startsWith('Arrow')) {
        e.preventDefault(); // Prevents the page from scrolling
        keys[e.key === ' ' ? 'Space' : e.key] = true;
    }
});

// Listen for keyup events (when a key is released)
window.addEventListener('keyup', (e) => {
    if (e.key === ' ' || e.key.startsWith('Arrow')) {
        e.preventDefault();
        keys[e.key === ' ' ? 'Space' : e.key] = false;
    }
});

// --- COLLISION DETECTION ---
// A function to check if two rectangles are overlapping
function isColliding(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

// --- UPDATE FUNCTION (The Brain) ---
// This function runs every frame to update the game's logic
function update() {
    // Move player based on which arrow keys are pressed
    if (keys.ArrowUp) player.y -= player.speed;
    if (keys.ArrowDown) player.y += player.speed;
    if (keys.ArrowLeft) player.x -= player.speed;
    if (keys.ArrowRight) player.x += player.speed;

    // Interaction logic (when spacebar is pressed)
    if (keys.Space) {
        let interacted = false;
        objects.forEach(obj => {
            // Check if player is near an object
            if (isColliding(player, obj)) {
                interacted = true;
                // Bookshelf interaction
                if (obj.name === 'bookshelf') {
                    gameState.message = "One of the books is titled 'Secrets of the Table'.";
                }
                // Table interaction
                if (obj.name === 'table') {
                    if (!gameState.inventory.includes('key')) {
                        gameState.message = "You found a small, rusty key under the table!";
                        gameState.inventory.push('key');
                    } else {
                        gameState.message = "Just an empty table now.";
                    }
                }
                // Chest interaction
                if (obj.name === 'chest') {
                    if (gameState.isChestLocked) {
                        if (gameState.inventory.includes('key')) {
                            gameState.message = "You used the key and opened the chest! You win!";
                            gameState.isChestLocked = false;
                            // Change chest color to show it's open
                            obj.color = 'grey';
                        } else {
                            gameState.message = "The chest is locked. You need a key.";
                        }
                    } else {
                        gameState.message = "The chest is empty.";
                    }
                }
            }
        });

        // If space is pressed but not near anything, reset message
        if (!interacted) {
            gameState.message = "Find the key to open the chest.";
        }
        
        // Set Space to false to prevent repeated interactions from one key press
        keys.Space = false; 
    }
}

// --- DRAW FUNCTION (The Artist) ---
// This function runs every frame to draw everything on the screen
function draw() {
    // Clear the entire canvas with a black rectangle
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw all the objects
    objects.forEach(obj => {
        ctx.fillStyle = obj.color;
        ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
    });

    // Draw the player
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Draw the game text
    ctx.fillStyle = 'white';
    ctx.font = '20px sans-serif';
    ctx.fillText(gameState.message, 20, 30);
    ctx.fillText("Inventory: " + gameState.inventory.join(', '), 20, 580);
}

// --- GAME LOOP (The Heartbeat) ---
// The main function that drives the game
function gameLoop() {
    update(); // Update the logic
    draw();   // Draw the result
    // Ask the browser to run this function again before the next repaint
    requestAnimationFrame(gameLoop);
}

// Start the game loop!
gameLoop();