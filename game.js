// GOLEADOR - Chilean Footballer Endless Runner
// Platanus Hack 25 Arcade Challenge

// =============================================================================
// ARCADE BUTTON MAPPING
// =============================================================================
// Maps arcade button codes to keyboard keys for local testing.
// The arcade cabinet sends codes like 'P1U', 'P1D', etc. when joystick is moved.
//
// WEB PLAY: Use WASD or Arrow keys - joystick directions map to all actions
// ARCADE PLAY: Use joystick OR action buttons for easier/more fun gameplay
//
// NOTE: Single-player game, but both P1 and P2 controls work - play from either side!
//
// CURRENT GAME USAGE (GOLEADOR):
//   - P1U/P2U (Joystick Up) → Jump
//   - P1D/P2D (Joystick Down) → Slide
//   - P1L/P2L (Joystick Left) → Trick
//   - P1R/P2R (Joystick Right) → Shoot Ball
//   - P1A/P2A (Button A - left) → Trick (easier than joystick left)
//   - P1B/P2B (Button B - right) → Shoot Ball (easier than joystick right)
//   - ANY MOVEMENT KEY → Start/Restart Game
// =============================================================================

const ARCADE_CONTROLS = {
  // Joystick controls - WASD and Arrow keys for local testing
  P1U: ["w", "ArrowUp"],
  P1D: ["s", "ArrowDown"],
  P1L: ["a", "ArrowLeft"],
  P1R: ["d", "ArrowRight"],
  P2U: ["w", "ArrowUp"],
  P2D: ["s", "ArrowDown"],
  P2L: ["a", "ArrowLeft"],
  P2R: ["d", "ArrowRight"],
  // Action buttons - easier for arcade play
  P1A: ["a", "ArrowLeft"],
  P1B: ["d", "ArrowRight"],
  P2A: ["a", "ArrowLeft"],
  P2B: ["d", "ArrowRight"],
};

// Build reverse lookup: keyboard key → arcade button code
const KEYBOARD_TO_ARCADE = {};
for (const [arcadeCode, keyboardKeys] of Object.entries(ARCADE_CONTROLS)) {
  const keys = Array.isArray(keyboardKeys) ? keyboardKeys : [keyboardKeys];
  keys.forEach((key) => {
    KEYBOARD_TO_ARCADE[key] = arcadeCode;
  });
}

// ============================================================================
// GAME CONSTANTS
// ============================================================================

const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
const GROUND_Y = 480;
const GRAVITY = 1200;
const SPAWN_X_RIGHT = 850;

// Physics
const JUMP_VELOCITY = -550;
const BALL_BOUNCE_VELOCITY = -250;
const SHOT_BALL_VX = 500;
const SHOT_BALL_VY = -100;

// Timing
const KICK_DURATION = 0.2;
const RUN_ANIM_SPEED = 0.15;
const SLIDE_DURATION = 0.6;
const TRICK_DURATION = 0.5;
const CARD_ANIMATION_DURATION = 1.5;
const BALL_SPAWN_INTERVAL = 5;
const OBSTACLE_MIN_DISTANCE = 200;
const CONFETTI_SPAWN_INTERVAL = 0.1;
const CONFETTI_MAX_DURATION = 7;

// Scoring
const BALL_GRAB_POINTS = 5;
const TRICK_POINTS = 5;
const OBSTACLE_HIT_POINTS = 10;
const GOAL_SCORE_POINTS = 100;
const MILESTONE_INTERVAL = 1000;

// Difficulty scaling (after 5000 points)
const DIFFICULTY_THRESHOLD = 5000;
const SPEED_MULTIPLIER_HARD = 1.5;
const OBSTACLE_INTERVAL_MIN_EASY = 1;
const OBSTACLE_INTERVAL_MIN_HARD = 1;
const OBSTACLE_INTERVAL_MAX = 2.5;

// Score Breakpoints for Progression
const SCORE_BP_1 = 1000;
const SCORE_BP_2 = 2000;
const SCORE_BP_3 = 3000;
const SCORE_BP_4 = 5000;
const SCORE_BP_5 = 10000;

// Multi-Spawn Progression
const MULTI_CHANCE_BASE = 0.1;
const MULTI_CHANCE_BP1 = 0.2;
const MULTI_CHANCE_BP2 = 0.3;
const MULTI_CHANCE_BP3 = 0.45;
const MULTI_CHANCE_BP4 = 0.6;
const MULTI_CHANCE_BP5 = 0.8;

// Multi-Spawn Quantity Thresholds
const MULTI_MAX_COUNT_BASE = 2;
const MULTI_MAX_COUNT_BP1 = 3;
const MULTI_MAX_COUNT_BP4 = 4;

// Flying Obstacle System
const FLYING_SPAWN_CHANCE_BASE = 0.3;
const FLYING_SPAWN_CHANCE_MAX = 0.6;
const FLYING_UNLOCK_DRONES = 1000;

// Dark Cone Progression
const DARK_CONE_UNLOCK = 2000;
const DARK_CONE_MAX_CHANCE = 0.6;

// Day/Night cycle
const NIGHT_START_SCORE = 5000;
const NIGHT_END_SCORE = 10000;

// Colors - Sky
const COLOR_SKY_DAY = 0x87ceeb;
const COLOR_SKY_NIGHT = 0x1a1a3e;

// Colors - Character
const COLOR_SKIN = 0xffdbac;
const COLOR_HAIR = 0x4a3020;

// Randomized appearance options for rival players
const SKIN_TONES = [
  0xffdbac, // light
  0xc68642, // tan
  0x8d5524, // brown
];
const HAIR_COLORS = [
  0x000000, // black
  0x4a3020, // dark brown
  0x8b4513, // brown
];
const HAIR_STYLES = ["short", "tall", "curly", "bald"];

// Colors - Obstacles
const COLOR_CONE_ORANGE = 0xff6600;
const COLOR_CONE_YELLOW = 0xffee00;
const COLOR_CONE_STRIPE = 0xffffff;
const COLOR_CONE_BASE = 0x000000;
const COLOR_DARK_CONE = 0x1a1a1a;
const COLOR_DARK_CONE_STRIPE = 0x333333;
const COLOR_BRAZIL_JERSEY = 0xffdd00;
const COLOR_BRAZIL_GREEN = 0x009b3a;
const COLOR_BRAZIL_BLUE = 0x0033aa;
const COLOR_FRANCE_JERSEY = 0x0055dd;
const COLOR_FRANCE_WHITE = 0xffffff;
const COLOR_FRANCE_RED = 0xff0000;
const COLOR_SHORTS_BLUE = 0x0033aa;
const COLOR_SHOES_BLACK = 0x000000;
const COLOR_BOTTLE_GREEN = 0x006633;
const COLOR_BOTTLE_CAP = 0xcccccc;
const COLOR_BOTTLE_STAR = 0xff0000;
const COLOR_BENCH_SEAT_BLUE = 0x0055dd;
const COLOR_BENCH_SEAT_BLACK = 0x1a1a1a;
const COLOR_BENCH_METAL = 0x888888;
const COLOR_BENCH_WATER = 0x00aaff;
const COLOR_GOAL_NET = 0xcccccc;
const COLOR_GOAL_POST = 0xffffff;
const COLOR_DRONE_BODY = 0x333333;
const COLOR_DRONE_PROPELLER = 0xff0000;

// Colors - Player Character
const COLOR_PLAYER_JERSEY = 0xff0000;
const COLOR_PLAYER_STRIPE = 0xffffff;
const COLOR_PLAYER_SHORTS = 0x0000ff;

// Colors - UI
const COLOR_SCORE_NORMAL = 0xffffff;
const COLOR_SCORE_GOLD = 0xffd700;
const COLOR_SCORE_FLASH = 0xffff00;
const COLOR_MILESTONE = 0x0000ff;
const COLOR_GOAL_TEXT = 0xff0000;

// Colors - Effects
const COLOR_SHADOW = 0x000000;
const ALPHA_SHADOW = 0.3;
const ALPHA_NET = 0.8;

// Ball Types
const BALL_TYPE_CLASSIC = "classic";
const BALL_TYPE_FEVERNOVA = "fevernova";
const BALL_TYPE_JABULANI = "jabulani";
const BALL_TYPES = [BALL_TYPE_CLASSIC, BALL_TYPE_FEVERNOVA, BALL_TYPE_JABULANI];

// Obstacle Dimensions
const CONE_WIDTH = 24;
const CONE_HEIGHT = 40;
const DARK_CONE_HEIGHT = 60;
const CONE_OVERLAP = 5;
const PLAYER_OBS_WIDTH = 20;
const PLAYER_OBS_HEIGHT_FRANCE = 55;
const PLAYER_OBS_HEIGHT_BRAZIL = 65;
const PLAYER_OBS_OVERLAP = 3;
const PLAYER_OBS_HEIGHT_OFFSET_BRAZIL = 10;
const BOTTLE_WIDTH = 10;
const BOTTLE_HEIGHT = 18;
const BENCH_WIDTH = 40;
const BENCH_HEIGHT = 30;
const GOAL_WIDTH = 45;
const GOAL_HEIGHT = 60;
const DRONE_WIDTH = 32;
const DRONE_HEIGHT = 12;

// Obstacle Spawning
const MULTI_SPAWN_RIVAL_SPACING = 40;
const MULTI_SPAWN_CONE_SPACING = 35;
const BRAZIL_SCORE_THRESHOLD = 2000;

// Rendering
const GRASS_BLADE_ITERATIONS = 202;
const GRASS_BLADE_PIXEL_SIZE = 4;
const CROWD_ROWS = 11;
const CROWD_COLUMNS = 50;
const CROWD_COLUMN_WIDTH = 16;
const CROWD_ROW_HEIGHT = 12;
const CROWD_START_Y = 50;
const CROWD_SPRITE_WIDTH = 14;
const CROWD_SPRITE_HEIGHT = 10;
const STAR_COUNT = 50;
const SCORE_PADDING = 5;

// Particles
const EXPLOSION_PARTICLE_COUNT = 15;
const CONFETTI_PARTICLE_COUNT = 5;

// Color Arrays
const CONFETTI_COLORS = [
  0xff0000, 0xffff00, 0x00ff00, 0x0000ff, 0xff00ff, 0x00ffff, 0xffd700,
  0xff8800,
];
const CROWD_COLORS = [
  0xff0000,
  0xff0000,
  0xff0000,
  0xff0000, // Red (60%)
  0xffffff,
  0xffffff, // White (20%)
  0x0000ff, // Blue (10%)
  0xffff00,
  0x00ff00,
  0xff8800, // Other (10%)
];

// ============================================================================
// SHARED LETTER DEFINITIONS FOR GOLEADOR TEXT
// Each letter is an array of rectangles: [x, y, width, height]
// Used by drawFootballLetter() to render title and instructions
// ============================================================================

const LETTER_G = [
  [0, 0, 14, 3],
  [0, 3, 3, 15],
  [0, 15, 14, 3],
  [11, 9, 3, 9],
  [6, 9, 8, 3],
];
const LETTER_O = [
  [0, 0, 14, 3],
  [0, 3, 3, 15],
  [0, 15, 14, 3],
  [11, 3, 3, 15],
];
const LETTER_L = [
  [0, 0, 3, 18],
  [0, 15, 14, 3],
];
const LETTER_E = [
  [0, 0, 14, 3],
  [0, 8, 11, 3],
  [0, 15, 14, 3],
  [0, 0, 3, 18],
];
const LETTER_A = [
  [0, 3, 3, 15],
  [3, 0, 5, 3],
  [8, 3, 3, 15],
  [3, 9, 8, 3],
];
const LETTER_D = [
  [0, 0, 11, 3],
  [0, 3, 3, 15],
  [0, 15, 11, 3],
  [11, 3, 3, 12],
];
const LETTER_R = [
  [0, 0, 11, 3],
  [0, 3, 3, 15],
  [11, 3, 3, 5],
  [3, 8, 11, 3],
  [6, 11, 3, 3],
  [8, 13, 3, 3],
  [10, 15, 3, 3],
];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Returns a random element from an array.
 * @param {Array} array - Array to select from
 * @returns {*} Random element from array
 */
function randomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Safely gets an element from an array with fallback.
 * @param {Array} array - Array to access
 * @param {number} index - Index to retrieve
 * @param {*} fallback - Fallback value if index out of bounds
 * @returns {*} Array element or fallback
 */
function safeArrayGet(array, index, fallback) {
  return array[index] ?? fallback;
}

/**
 * Validates if a value is a valid ball type.
 * @param {string} type - Type to validate
 * @returns {boolean} True if valid ball type
 */
function isValidBallType(type) {
  return BALL_TYPES.includes(type);
}

/**
 * Gets a valid ball type, falling back to classic if invalid.
 * @param {string} type - Type to validate
 * @returns {string} Valid ball type
 */
function getValidBallType(type) {
  if (!isValidBallType(type)) {
    return BALL_TYPE_CLASSIC;
  }
  return type;
}

/**
 * Draws centered pixel text at specified Y position.
 * @param {string} text - Text to draw
 * @param {number} y - Y position
 * @param {number} color - Text color
 * @param {number} scale - Text scale
 */
function drawCenteredPixelText(text, y, color, scale) {
  const width = text.length * 12 * scale;
  drawPixelText(text, 400 - width / 2, y, color, scale);
}

/**
 * Combined fillStyle and fillRect operation.
 * @param {number} color - Fill color
 * @param {number} x - X position
 * @param {number} y - Y position
 * @param {number} w - Width
 * @param {number} h - Height
 * @param {number} alpha - Opacity (default: 1)
 */
function fillRect(color, x, y, w, h, alpha = 1) {
  graphics.fillStyle(color, alpha);
  graphics.fillRect(x, y, w, h);
}

/**
 * Draws a vertical gradient stripe with specified pattern.
 * @param {number} x - X position
 * @param {number} y - Y start position
 * @param {number} width - Stripe width
 * @param {number} height - Stripe height
 * @param {number} color - Base color
 * @param {number} step - Pixel step for gradient resolution
 */
function drawGradientStripe(x, y, width, height, color, step) {
  for (let ty = y; ty < y + height; ty += step) {
    const progress = (ty - y) / height;
    const brightness = 1.0 - progress * 0.1;
    const r = Math.floor(((color >> 16) & 0xff) * brightness);
    const g = Math.floor(((color >> 8) & 0xff) * brightness);
    const b = Math.floor((color & 0xff) * brightness);
    const gradientColor = (r << 16) | (g << 8) | b;
    graphics.fillStyle(gradientColor, 1);
    graphics.fillRect(x, ty, width, step);
  }
}

/**
 * Helper: Draw horizontal stripes at specified Y offsets.
 * @param {number} color - Stripe color
 * @param {number} x - X position
 * @param {number} baseY - Base Y position
 * @param {number} width - Stripe width
 * @param {number} height - Stripe height
 * @param {number[]} yOffsets - Array of Y offsets from baseY
 */
function drawHorizontalStripes(color, x, baseY, width, height, yOffsets) {
  for (let i = 0; i < yOffsets.length; i++) {
    fillRect(color, x, baseY + yOffsets[i], width, height);
  }
}

/**
 * Helper: Draw vertical stripes.
 * @param {number[]} colors - Array of colors for alternating stripes
 * @param {number} x - Starting X position
 * @param {number} y - Y position
 * @param {number} width - Width per stripe
 * @param {number} height - Stripe height
 */
function drawVerticalStripes(colors, x, y, width, height) {
  for (let i = 0; i < colors.length; i++) {
    fillRect(colors[i], x + i * width, y, width, height);
  }
}

/**
 * Helper: Draw vertical posts at specified X offsets.
 * @param {number} color - Post color
 * @param {number} baseX - Base X position
 * @param {number} y - Y position
 * @param {number} width - Post width
 * @param {number} height - Post height
 * @param {number[]} xOffsets - Array of X offsets from baseX
 */
function drawVerticalPosts(color, baseX, y, width, height, xOffsets) {
  for (let i = 0; i < xOffsets.length; i++) {
    fillRect(color, baseX + xOffsets[i], y, width, height);
  }
}

// Restart keys for game over
const RESTART_KEYS = [
  "ArrowUp",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "w",
  "W",
  "a",
  "A",
  "s",
  "S",
  "d",
  "D",
];

// Pixel font definitions (3x5 grid)
const PIXEL_FONT = {
  P: [
    [1, 1, 1],
    [1, 0, 1],
    [1, 1, 0],
    [1, 0, 0],
    [1, 0, 0],
  ],
  L: [
    [1, 0, 0],
    [1, 0, 0],
    [1, 0, 0],
    [1, 0, 0],
    [1, 1, 1],
  ],
  A: [
    [0, 1, 0],
    [1, 0, 1],
    [1, 1, 1],
    [1, 0, 1],
    [1, 0, 1],
  ],
  T: [
    [1, 1, 1],
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
  ],
  N: [
    [1, 0, 1],
    [1, 1, 1],
    [1, 0, 1],
    [1, 0, 1],
    [1, 0, 1],
  ],
  U: [
    [1, 0, 1],
    [1, 0, 1],
    [1, 0, 1],
    [1, 0, 1],
    [1, 1, 1],
  ],
  S: [
    [1, 1, 1],
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 1],
    [1, 1, 1],
  ],
  H: [
    [1, 0, 1],
    [1, 0, 1],
    [1, 1, 1],
    [1, 0, 1],
    [1, 0, 1],
  ],
  C: [
    [1, 1, 1],
    [1, 0, 0],
    [1, 0, 0],
    [1, 0, 0],
    [1, 1, 1],
  ],
  K: [
    [1, 0, 1],
    [1, 1, 0],
    [1, 0, 0],
    [1, 1, 0],
    [1, 0, 1],
  ],
  O: [
    [1, 1, 1],
    [1, 0, 1],
    [1, 0, 1],
    [1, 0, 1],
    [1, 1, 1],
  ],
  R: [
    [1, 1, 0],
    [1, 0, 1],
    [1, 1, 0],
    [1, 0, 1],
    [1, 0, 1],
  ],
  E: [
    [1, 1, 1],
    [1, 0, 0],
    [1, 1, 0],
    [1, 0, 0],
    [1, 1, 1],
  ],
  B: [
    [1, 1, 0],
    [1, 0, 1],
    [1, 1, 0],
    [1, 0, 1],
    [1, 1, 0],
  ],
  I: [
    [1, 1, 1],
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
    [1, 1, 1],
  ],
  M: [
    [1, 0, 1],
    [1, 1, 1],
    [1, 1, 1],
    [1, 0, 1],
    [1, 0, 1],
  ],
  J: [
    [0, 0, 1],
    [0, 0, 1],
    [0, 0, 1],
    [1, 0, 1],
    [1, 1, 1],
  ],
  G: [
    [1, 1, 1],
    [1, 0, 0],
    [1, 0, 1],
    [1, 0, 1],
    [1, 1, 1],
  ],
  V: [
    [1, 0, 1],
    [1, 0, 1],
    [1, 0, 1],
    [1, 0, 1],
    [0, 1, 0],
  ],
  Y: [
    [1, 0, 1],
    [1, 0, 1],
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
  ],
  Z: [
    [1, 1, 1],
    [0, 0, 1],
    [0, 1, 0],
    [1, 0, 0],
    [1, 1, 1],
  ],
  D: [
    [1, 1, 0],
    [1, 0, 1],
    [1, 0, 1],
    [1, 0, 1],
    [1, 1, 0],
  ],
  F: [
    [1, 1, 1],
    [1, 0, 0],
    [1, 1, 0],
    [1, 0, 0],
    [1, 0, 0],
  ],
  W: [
    [1, 0, 1],
    [1, 0, 1],
    [1, 1, 1],
    [1, 1, 1],
    [1, 0, 1],
  ],
  0: [
    [1, 1, 1],
    [1, 0, 1],
    [1, 0, 1],
    [1, 0, 1],
    [1, 1, 1],
  ],
  1: [
    [0, 1, 0],
    [1, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
    [1, 1, 1],
  ],
  2: [
    [1, 1, 1],
    [0, 0, 1],
    [1, 1, 1],
    [1, 0, 0],
    [1, 1, 1],
  ],
  3: [
    [1, 1, 1],
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 1],
    [1, 1, 1],
  ],
  4: [
    [1, 0, 1],
    [1, 0, 1],
    [1, 1, 1],
    [0, 0, 1],
    [0, 0, 1],
  ],
  5: [
    [1, 1, 1],
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 1],
    [1, 1, 1],
  ],
  6: [
    [1, 1, 1],
    [1, 0, 0],
    [1, 1, 1],
    [1, 0, 1],
    [1, 1, 1],
  ],
  7: [
    [1, 1, 1],
    [0, 0, 1],
    [0, 0, 1],
    [0, 0, 1],
    [0, 0, 1],
  ],
  8: [
    [1, 1, 1],
    [1, 0, 1],
    [1, 1, 1],
    [1, 0, 1],
    [1, 1, 1],
  ],
  9: [
    [1, 1, 1],
    [1, 0, 1],
    [1, 1, 1],
    [0, 0, 1],
    [1, 1, 1],
  ],
  " ": [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ],
};

// ============================================================================
// PHASER CONFIGURATION
// ============================================================================

const config = {
  type: Phaser.AUTO,
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  backgroundColor: "#87CEEB",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: GRAVITY },
      debug: false,
    },
  },
  scene: {
    create,
    update,
  },
};

new Phaser.Game(config);

// ============================================================================
// GAME STATE
// ============================================================================
let player;
let graphics;
let gameStarted = false;
let gameOver = false;
let showGrid = false;
let score = 0;
let highScore = 0;
let sessionBest = 0;
let gameSpeed = 3;
const baseSpeed = 3;
let speedIncrement = 0;

// Player state
let isKicking = false;
let kickTimer = 0;
let ballTypesHeld = [BALL_TYPE_CLASSIC]; // Start with one ball to teach mechanic
let runFrame = 0;
let runAnimTimer = 0;
let isCelebrating = false;
let celebrationTimer = 0;
let isSliding = false;
let slideTimer = 0;
let yellowCards = 0;
let slideGaveCard = false;
let cardMessage = "";
let cardMessageTimer = 0;
let cardAppearTime = 0;
let isTricking = false;
let trickTimer = 0;
let currentTrick = 0;
let isCardAnimation = false;
let cardAnimationTimer = 0;
let redCardTimer = 0;

// Game objects
const balls = [];
const obstacles = [];
const shotBalls = [];
const particles = [];
let ballRotation = 0;

// Background
let bgOffset = 0;
let billboardOffset = 0;
const clouds = [];

// Effects
let cameraShake = 0;
let slowMoTimer = 0;
let timeScale = 1;
let scoreFlashTimer = 0;
let milestoneMessage = "";
let milestoneTimer = 0;
let lastMilestone = 0;
let goalMessage = "";
let goalTimer = 0;
let highScoreMessage = "";
let highScoreTimer = 0;
let crowdCheerTimer = 0;
let isNewBest = false;
let confettiTimer = 0;
let confettiDuration = 0; // Track how long confetti has been active

// Timers
let ballSpawnTimer = 0;
let obstacleSpawnTimer = 2.0; // Instant first obstacle spawn
let flyingObstacleSpawnTimer = 0;
let gameTime = 0;
let gameOverDelayTimer = 0;
let lastObstacleDistance = 500; // Instant first obstacle spawn
let lastGroundObstacleType = null; // Track last spawned ground obstacle

// Keyboard controls (initialized in create function)
let cursors; // Arrow keys
let aKey;
let dKey;
let sKey;
let wKey; // WASD keys
let scene;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Checks if the game is currently in night mode based on score.
 * @returns {boolean} True if in night mode, false otherwise
 */
function isNightMode() {
  return score >= NIGHT_START_SCORE && score < NIGHT_END_SCORE;
}

/**
 * Applies a darkening factor to a color.
 * @param {number} color - Hex color value
 * @param {number} factor - Darkening factor (0-1)
 * @returns {number} Darkened hex color
 */
function darkenColor(color, factor) {
  const r = Math.floor(((color >> 16) & 0xff) * factor);
  const g = Math.floor(((color >> 8) & 0xff) * factor);
  const b = Math.floor((color & 0xff) * factor);
  return (r << 16) | (g << 8) | b;
}

/**
 * Draws an elliptical shadow at the specified position.
 * @param {number} x - Center X coordinate
 * @param {number} y - Center Y coordinate
 * @param {number} width - Shadow width
 * @param {number} height - Shadow height
 * @param {number} alpha - Optional alpha value (defaults to ALPHA_SHADOW)
 */
function drawShadow(x, y, width, height, alpha = ALPHA_SHADOW) {
  graphics.fillStyle(COLOR_SHADOW, alpha);
  graphics.fillEllipse(x, y, width, height);
}

/**
 * Draws a realistic player shadow on the ground that scales based on height.
 * Shadow stays on ground and gets smaller/lighter as player goes higher.
 * @param {number} playerX - Player X position
 * @param {number} playerY - Player Y position (can be in air)
 * @param {number} baseWidth - Shadow width when on ground
 * @param {number} baseHeight - Shadow height when on ground
 */
function drawPlayerShadow(playerX, playerY, baseWidth, baseHeight) {
  const height = GROUND_Y - playerY;
  const heightFactor = Math.min(height / 200, 1); // Max at 200px high
  const shadowWidth = baseWidth * (1 - heightFactor * 0.6); // Shrinks up to 60%
  const shadowAlpha = ALPHA_SHADOW * (1 - heightFactor * 0.5); // Fades up to 50%
  drawShadow(
    playerX,
    GROUND_Y,
    shadowWidth,
    baseHeight * (1 - heightFactor * 0.4),
    shadowAlpha
  );
}

/**
 * Draws a football-style letter from rectangle definitions.
 * @param {number} x - X position
 * @param {number} y - Y position
 * @param {Array} rects - Array of [x, y, width, height] rectangle definitions
 * @param {number} scale - Scale factor
 * @param {number} shadowColor - Shadow color (default: blue)
 * @param {number} mainColor - Main letter color (default: red)
 * @param {boolean} highlight - Whether to add white highlight (default: true)
 */
function drawFootballLetter(
  x,
  y,
  rects,
  scale,
  shadowColor = 0x0055dd,
  mainColor = 0xff0000,
  highlight = true
) {
  for (const rect of rects) {
    const [rx, ry, rw, rh] = rect;
    const sx = rx * scale;
    const sy = ry * scale;
    const sw = rw * scale;
    const sh = rh * scale;

    graphics.fillStyle(shadowColor, 1);
    graphics.fillRect(x + sx + 2, y + sy + 2, sw, sh);

    graphics.fillStyle(mainColor, 1);
    graphics.fillRect(x + sx, y + sy, sw, sh);

    if (highlight) {
      graphics.fillStyle(0xffffff, 0.5);
      graphics.fillRect(x + sx, y + sy, sw, sh * 0.25);
    }
  }
}

/**
 * Helper to draw a referee card with glow, shine, and borders
 */
function drawCard(
  x,
  y,
  scale,
  glowColor,
  glowAlpha,
  cardColor,
  shineColor,
  shine
) {
  const cardWidth = 18 * scale;
  const cardHeight = 26 * scale;
  const centerOffsetX = (cardWidth - 18) / 2;
  const centerOffsetY = (cardHeight - 26) / 2;

  graphics.fillStyle(glowColor, glowAlpha);
  graphics.fillRect(
    x - 3 - centerOffsetX,
    y - 3 - centerOffsetY,
    cardWidth + 6,
    cardHeight + 6
  );
  graphics.fillStyle(cardColor, shine);
  graphics.fillRect(
    x - centerOffsetX,
    y - centerOffsetY,
    cardWidth,
    cardHeight
  );
  graphics.fillStyle(shineColor, shine);
  graphics.fillRect(
    x + 2 - centerOffsetX,
    y + 2 - centerOffsetY,
    6 * scale,
    9 * scale
  );
  graphics.fillStyle(0x000000, 0.3);
  graphics.fillRect(
    x + 3 - centerOffsetX,
    y + 3 - centerOffsetY,
    12 * scale,
    20 * scale
  );
}

/**
 * Draws a single leg with skin, shorts, and shoes.
 * @param {number} x - Leg X position
 * @param {number} y - Base Y position
 * @param {number} legY - Leg Y offset from base
 * @param {number} legHeight - Total leg height
 * @param {number} width - Leg width
 * @param {number} shortsHeight - Shorts height
 */
function drawLeg(x, y, legY, legHeight, width, shortsHeight) {
  fillRect(COLOR_SKIN, x, y + legY, width, legHeight);
  fillRect(COLOR_PLAYER_SHORTS, x, y + legY, width, shortsHeight);
  fillRect(COLOR_SHOES_BLACK, x, y - 4, width, 4);
}

/**
 * Draws player legs with shorts and shoes.
 * @param {number} x - Player X position
 * @param {number} y - Player Y position
 * @param {number} leg1Y - First leg Y offset
 * @param {number} leg1Height - First leg height
 * @param {number} leg2Y - Second leg Y offset
 * @param {number} leg2Height - Second leg height
 * @param {number} shortsHeight - Shorts height for both legs
 */
function drawPlayerLegs(
  x,
  y,
  leg1Y,
  leg1Height,
  leg2Y,
  leg2Height,
  shortsHeight
) {
  drawLeg(x + 4, y, leg1Y, leg1Height, 7, shortsHeight);
  drawLeg(x + 13, y, leg2Y, leg2Height, 7, shortsHeight);
}

/**
 * Draws player legs in standing position
 */
function drawStandingLegs(x, y) {
  drawPlayerLegs(x, y, -14, 10, -14, 10, 6);
}

/**
 * Draws basic player body and head (used in many trick animations)
 */
function drawPlayerBody(x, y, bodyOffsetX = 0) {
  fillRect(COLOR_PLAYER_JERSEY, x + 4 + bodyOffsetX, y - 32, 16, 20);
  graphics.fillStyle(COLOR_SKIN, 1);
  graphics.fillCircle(x + 12 + bodyOffsetX, y - 42, 10);
  fillRect(COLOR_HAIR, x + 6 + bodyOffsetX, y - 50, 12, 8);
}

/**
 * Draws a ball with dynamic shadow based on height
 */
function drawBallWithShadow(ball) {
  const ballHeight = GROUND_Y - ball.y;
  const heightFactor = Math.min(ballHeight / 150, 1);
  const shadowWidth = ball.radius * 2 * (1 - heightFactor * 0.5);
  const shadowAlpha = 0.3 * (1 - heightFactor * 0.4);
  drawShadow(ball.x, GROUND_Y, shadowWidth, shadowWidth * 0.4, shadowAlpha);
  drawSpinningBall(ball.x, ball.y, ball.radius, ball.type);
}

// ============================================================================
// PHASER LIFECYCLE
// ============================================================================

/**
 * Initialize game scene, player, controls, and background elements.
 * Called once by Phaser when the game starts.
 */
function create() {
  scene = this;
  graphics = this.add.graphics();

  player = {
    x: 150,
    y: GROUND_Y,
    width: 18,
    height: 46,
    vx: 0,
    vy: 0,
    onGround: true,
  };

  // Initialize keyboard controls (Arrow keys + WASD)
  cursors = this.input.keyboard.createCursorKeys();
  wKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
  aKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
  sKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
  dKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

  // Restart on any game key press when game is over
  this.input.keyboard.on("keydown", (event) => {
    if (gameOver && RESTART_KEYS.includes(event.key)) {
      restartGame();
    }
  });

  this.input.keyboard.on("keydown-G", () => {
    showGrid = !showGrid;
  });

  // Pre-populate clouds to avoid sudden appearance
  for (let i = 0; i < 5; i++) {
    clouds.push({
      x: Math.random() * GAME_WIDTH,
      y: 200 + Math.random() * 150,
      size: 20 + Math.random() * 30,
    });
  }

  // Load high score from localStorage
  loadHighScore();

  // If gameStarted is true, it means we're restarting (not first load)
  if (gameStarted) {
    startBackgroundMusic(this);
  }
}

/**
 * Main game loop called every frame by Phaser.
 * Delegates to specialized update functions based on game state.
 * @param {number} time - Total elapsed time since game start
 * @param {number} delta - Time since last frame in milliseconds
 */
function update(time, delta) {
  const dt = (delta / 1000) * timeScale;

  if (!gameStarted) {
    updateStartScreen(dt, this);
    drawGame();
    return;
  }

  if (!gameOver) {
    updateGameLoop(dt, this);
  }

  drawGame();
}

/**
 * Updates the start screen state (animations, input detection).
 * @param {number} dt - Delta time in seconds
 * @param {Phaser.Scene} sceneRef - Scene reference
 */
function updateStartScreen(dt, sceneRef) {
  // Don't increment gameTime on start screen - it affects game speed
  updateBackground(); // Keep clouds moving

  // Check for any key to start (Arrow keys or WASD)
  if (
    cursors.up.isDown ||
    cursors.down.isDown ||
    cursors.left.isDown ||
    cursors.right.isDown ||
    wKey.isDown ||
    aKey.isDown ||
    sKey.isDown ||
    dKey.isDown
  ) {
    gameStarted = true;
    startBackgroundMusic(sceneRef);
  }
}

/**
 * Main gameplay update loop - coordinates all game systems.
 * @param {number} dt - Delta time in seconds
 * @param {Phaser.Scene} sceneRef - Scene reference
 */
function updateGameLoop(dt, sceneRef) {
  gameTime += dt;

  // Update game-wide effects and state
  updateGameEffects(dt);
  updateGameSpeed();
  updateScore(sceneRef);
  updateTimers(dt);
  spawnConfettiIfNeeded(dt);

  // FREEZE WORLD during card animation
  if (!isCardAnimation) {
    updatePlayerState(dt, sceneRef);
    updateGameWorld(dt, sceneRef);
    updateCollisions(sceneRef);
    updateBackground();
    ballRotation += dt * 5;
  }
}

/**
 * Updates game-wide visual effects (camera shake, slow motion).
 * @param {number} dt - Delta time in seconds
 */
function updateGameEffects(dt) {
  updateSlowMotion(dt * 1000); // Convert back to ms for compatibility
  updateCamera(dt);
}

/**
 * Updates player-related state (input, physics, animation).
 * @param {number} dt - Delta time in seconds
 * @param {Phaser.Scene} sceneRef - Scene reference
 */
function updatePlayerState(dt, sceneRef) {
  handlePlayerInput(sceneRef);
  updatePlayerPhysics(dt);
  updatePlayerAnimation(dt);
}

/**
 * Updates all game world objects (spawning, movement, behavior).
 * @param {number} dt - Delta time in seconds
 * @param {Phaser.Scene} sceneRef - Scene reference
 */
function updateGameWorld(dt, sceneRef) {
  spawnGameObjects(dt);
  updateBalls(dt, sceneRef);
  updateShotBalls(dt, sceneRef);
  updateObstacles(dt, sceneRef);
  updateParticles(dt);
}

/**
 * Checks all collision types (slide, ball hits, player collisions).
 * @param {Phaser.Scene} sceneRef - Scene reference
 */
function updateCollisions(sceneRef) {
  checkSlideCollisions(sceneRef);
  // Note: Ball-obstacle collisions are checked in updateShotBalls()
  // Note: Player-obstacle collisions are checked in updateObstacles()
}

// ============================================================================
// GAME LOOP HELPERS
// ============================================================================

function updateSlowMotion(delta) {
  if (slowMoTimer > 0) {
    slowMoTimer -= delta / 1000;
    if (slowMoTimer <= 0) {
      timeScale = 1;
    }
  }
}

function updateCamera(dt) {
  if (cameraShake > 0) {
    cameraShake -= dt * 10;
    scene.cameras.main.setScroll(
      Math.random() * cameraShake * 2 - cameraShake,
      Math.random() * cameraShake * 2 - cameraShake
    );
  } else {
    scene.cameras.main.setScroll(0, 0);
  }
}

function updateGameSpeed() {
  const speedMultiplier =
    score >= DIFFICULTY_THRESHOLD ? SPEED_MULTIPLIER_HARD : 1.0;
  speedIncrement = Math.floor(gameTime / 15) * 0.3 * speedMultiplier;
  gameSpeed = baseSpeed + speedIncrement;
}

function updateScore(sceneRef) {
  if (Math.floor(gameTime * 10) % 2 === 0) {
    score += 1;

    if (score > sessionBest && !isNewBest) {
      isNewBest = true;
      playCelebrationSound(sceneRef);
      // Only show message if there was a previous high score
      if (sessionBest > 0) {
        highScoreMessage = "NEW HIGH SCORE!";
        highScoreTimer = 3.0;
        // Priority 1: NEW HIGH SCORE interrupts all other messages
        cardMessageTimer = 0;
        goalTimer = 0;
        milestoneTimer = 0;
      }
    }

    checkMilestones(sceneRef);
  }
}

function checkMilestones(sceneRef) {
  const currentMilestone = Math.floor(score / MILESTONE_INTERVAL);
  if (currentMilestone > lastMilestone && score % MILESTONE_INTERVAL < 10) {
    lastMilestone = currentMilestone;
    // Priority 4: MILESTONE only shows if no other message is active
    if (highScoreTimer <= 0 && cardMessageTimer <= 0 && goalTimer <= 0) {
      milestoneMessage = `${currentMilestone * MILESTONE_INTERVAL}!`;
      milestoneTimer = 2;
      playMilestoneSound(sceneRef);
    }
  }
}

/**
 * Helper: Decrements a timer value.
 * @param {number} value - Current timer value
 * @param {number} dt - Delta time
 * @returns {number} Decremented timer value (min 0)
 */
function decTimer(value, dt) {
  return value > 0 ? value - dt : value;
}

/**
 * Helper: Draw scaled animated text centered on screen.
 * @param {string} text - Text to display
 * @param {number} timer - Current timer value
 * @param {number} duration - Animation duration
 * @param {number} startScale - Starting scale
 * @param {number} scaleRange - Scale change range
 * @param {number} color - Text color
 * @returns {number} The calculated scale value
 */
function drawScaledText(text, timer, duration, startScale, scaleRange, color) {
  const t = 1 - timer / duration;
  const easeOut = 1 - Math.pow(1 - t, 3);
  const scale = startScale - easeOut * scaleRange;
  const msgWidth = text.length * 12 * scale;
  drawPixelText(text, 400 - msgWidth / 2, 280, color, scale);
  return scale;
}

function updateTimers(dt) {
  scoreFlashTimer = decTimer(scoreFlashTimer, dt);
  milestoneTimer = decTimer(milestoneTimer, dt);
  goalTimer = decTimer(goalTimer, dt);
  highScoreTimer = decTimer(highScoreTimer, dt);
  crowdCheerTimer = decTimer(crowdCheerTimer, dt);
  cardMessageTimer = decTimer(cardMessageTimer, dt);
  if (cardAppearTime < 1.0) {
    cardAppearTime += dt;
  }

  // Action timers with flag reset
  if (isKicking && (kickTimer -= dt) <= 0) {
    isKicking = false;
  }
  if (isCelebrating && (celebrationTimer -= dt) <= 0) {
    isCelebrating = false;
  }
  if (isSliding && (slideTimer -= dt) <= 0) {
    isSliding = false;
  }
  if (isTricking && (trickTimer -= dt) <= 0) {
    isTricking = false;
    score += TRICK_POINTS;
  }
  if (isCardAnimation) {
    cardAnimationTimer -= dt;
  }
  if (redCardTimer > 0 && (redCardTimer -= dt) <= 0) {
    gameOver = true;
  }
  if (gameOverDelayTimer > 0 && (gameOverDelayTimer -= dt) <= 0) {
    timeScale = 1;
    gameOver = true;
  }
}

function spawnConfettiIfNeeded(dt) {
  if (isNewBest) {
    confettiDuration += dt;
    if (confettiDuration < CONFETTI_MAX_DURATION) {
      confettiTimer += dt;
      if (confettiTimer > CONFETTI_SPAWN_INTERVAL) {
        confettiTimer = 0;
        createConfetti();
      }
    }
  }
}

function handlePlayerInput(sceneRef) {
  // JUMP - UP Arrow or W key
  if (
    !isKicking &&
    !isSliding &&
    !isTricking &&
    player.onGround &&
    (cursors.up.isDown || wKey.isDown)
  ) {
    player.vy = JUMP_VELOCITY;
    player.onGround = false;
  }

  // SHOOT - RIGHT Arrow or D key
  if (
    !isKicking &&
    !isSliding &&
    !isTricking &&
    (Phaser.Input.Keyboard.JustDown(cursors.right) ||
      Phaser.Input.Keyboard.JustDown(dKey))
  ) {
    // Only shoot ball if we have one, but always play kick animation
    if (ballTypesHeld.length > 0) {
      shootBall(sceneRef);
    }
    isKicking = true;
    kickTimer = KICK_DURATION;
  }

  // SLIDE - DOWN Arrow or S key (can slide in air!)
  if (
    !isSliding &&
    !isTricking &&
    (Phaser.Input.Keyboard.JustDown(cursors.down) ||
      Phaser.Input.Keyboard.JustDown(sKey))
  ) {
    isSliding = true;
    slideTimer = SLIDE_DURATION;
    slideGaveCard = false; // Reset card flag for new slide
    playSlideSound(sceneRef);
  }

  // TRICK - LEFT Arrow or A key
  if (
    !isSliding &&
    !isTricking &&
    (Phaser.Input.Keyboard.JustDown(cursors.left) ||
      Phaser.Input.Keyboard.JustDown(aKey))
  ) {
    isTricking = true;
    trickTimer = TRICK_DURATION;

    // Loop through tricks in order based on balls held
    if (ballTypesHeld.length === 0) {
      currentTrick = (currentTrick + 1) % 4; // 4 tricks for no balls
    } else if (ballTypesHeld.length === 1) {
      currentTrick = (currentTrick + 1) % 3; // 3 tricks for 1 ball
    } else {
      currentTrick = (currentTrick + 1) % 3; // 3 tricks for 2 balls
    }

    playTrickSound(sceneRef);
  }
}

function updatePlayerPhysics(dt) {
  if (!player.onGround) {
    player.vy += GRAVITY * dt;
  }
  player.y += player.vy * dt;

  if (player.y >= GROUND_Y) {
    player.y = GROUND_Y;
    player.vy = 0;
    player.onGround = true;
  }
}

function updatePlayerAnimation(dt) {
  if (!isKicking && player.onGround) {
    runAnimTimer += dt;
    if (runAnimTimer > RUN_ANIM_SPEED) {
      runAnimTimer = 0;
      runFrame = (runFrame + 1) % 2;
    }
  }
}

function spawnGameObjects(dt) {
  ballSpawnTimer += dt;
  if (ballSpawnTimer > BALL_SPAWN_INTERVAL) {
    ballSpawnTimer = 0;
    spawnBall();
  }

  spawnObstaclesIfNeeded(dt);
}

function spawnObstaclesIfNeeded(dt) {
  // Ground obstacle spawning
  obstacleSpawnTimer += dt;
  lastObstacleDistance += gameSpeed;

  const minInterval =
    score >= DIFFICULTY_THRESHOLD
      ? OBSTACLE_INTERVAL_MIN_HARD
      : OBSTACLE_INTERVAL_MIN_EASY;
  const maxInterval = OBSTACLE_INTERVAL_MAX - Math.min(gameTime / 100, 1.0);
  const randomInterval =
    minInterval + Math.random() * (maxInterval - minInterval);
  const minDistance = OBSTACLE_MIN_DISTANCE + gameSpeed * 20;

  if (
    obstacleSpawnTimer > randomInterval &&
    lastObstacleDistance > minDistance
  ) {
    obstacleSpawnTimer = 0;
    lastObstacleDistance = 0;
    spawnGroundObstacle();
  }

  // Flying obstacle spawning (independent timer)
  flyingObstacleSpawnTimer += dt;
  const flyingInterval = 2.0 + Math.random() * 1.5; // 2-3.5 seconds
  const flyingChance = getFlyingSpawnChance();

  if (flyingObstacleSpawnTimer > flyingInterval) {
    flyingObstacleSpawnTimer = 0;
    // Only spawn if chance succeeds (30-60% based on score)
    if (Math.random() < flyingChance) {
      spawnFlyingObstacle();
    }
  }
}

function updateBalls(dt, sceneRef) {
  for (let i = balls.length - 1; i >= 0; i--) {
    const ball = balls[i];
    ball.x -= gameSpeed * 1.3;
    ball.vy += 800 * dt;
    ball.y += ball.vy * dt;

    if (ball.y >= GROUND_Y - 5) {
      ball.y = GROUND_Y - 5;
      ball.vy = BALL_BOUNCE_VELOCITY;
    }

    if (tryGrabBall(ball, sceneRef)) {
      balls.splice(i, 1);
      continue;
    }

    if (ball.x < -50) {
      balls.splice(i, 1);
    }
  }
}

function tryGrabBall(ball, sceneRef) {
  if (ballTypesHeld.length >= 2) {
    return false;
  }

  const grabDistance = 30;
  const dx = player.x + 12 - ball.x;
  const dy = player.y - 20 - ball.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance < grabDistance) {
    const ballType = getValidBallType(ball.type || BALL_TYPE_CLASSIC);
    ballTypesHeld.push(ballType);
    score += BALL_GRAB_POINTS;
    playBallCollectionSound(sceneRef);
    return true;
  }
  return false;
}

function updateShotBalls(dt, sceneRef) {
  for (let i = shotBalls.length - 1; i >= 0; i--) {
    const ball = shotBalls[i];
    ball.x += ball.vx * dt;
    ball.y += ball.vy * dt;
    ball.vy += 800 * dt;

    if (ball.y >= GROUND_Y - 5) {
      ball.y = GROUND_Y - 5;
      ball.vy = -ball.vy * 0.6;
    }

    if (ball.x > SPAWN_X_RIGHT || ball.y > 650) {
      shotBalls.splice(i, 1);
      continue;
    }

    if (checkShotBallCollisions(ball, i, sceneRef)) {
      break;
    }
  }
}

function checkShotBallCollisions(ball, ballIndex, sceneRef) {
  for (let j = obstacles.length - 1; j >= 0; j--) {
    const obs = obstacles[j];

    if (obs.type === "goal") {
      if (checkGoalScoring(ball, obs, sceneRef)) {
        obstacles.splice(j, 1);
        shotBalls.splice(ballIndex, 1);
        return true;
      }
      continue;
    }

    if (checkObstacleHit(ball, obs, j, ballIndex, sceneRef)) {
      return true;
    }
  }
  return false;
}

function checkSlideCollisions(sceneRef) {
  if (!isSliding) {
    return;
  }

  const slideLeft = player.x;
  const slideRight = player.x + 40;
  const slideTop = player.y - 20;
  const slideBottom = player.y;

  for (let i = obstacles.length - 1; i >= 0; i--) {
    const obs = obstacles[i];

    // Skip already fallen players
    if (obs.type === "player" && obs.fallen) {
      continue;
    }

    const obsLeft = obs.x;
    const obsRight = obs.x + obs.width;
    const obsTop = obs.y - obs.height;
    const obsBottom = obs.y;

    const hit =
      slideRight > obsLeft &&
      slideLeft < obsRight &&
      slideBottom > obsTop &&
      slideTop < obsBottom;

    if (hit) {
      createExplosion(
        obs.x + obs.width / 2,
        obs.y - obs.height / 2,
        getObstacleColor(obs)
      );

      // BIG IMPACT - camera shake and slow-mo
      cameraShake = 8;
      slowMoTimer = 0.3;
      timeScale = 0.3;

      // Give yellow card ONLY ONCE per slide
      if (!slideGaveCard) {
        yellowCards++;
        slideGaveCard = true;
        cardAppearTime = 0; // Reset animation
        playWhistleSound(sceneRef);

        // Show card message (Priority 2: only if high score is not showing)
        if (highScoreTimer <= 0) {
          if (yellowCards >= 2) {
            cardMessage = "RED CARD";
            cardMessageTimer = 3.0;
            // Priority 2: CARD interrupts goal and milestone
            goalTimer = 0;
            milestoneTimer = 0;

            // FREEZE WORLD AND SHOW ANGRY PLAYER (only for RED CARD)
            isCardAnimation = true;
            cardAnimationTimer = CARD_ANIMATION_DURATION;

            // Delay game over by 2 seconds
            redCardTimer = 2.0;
          } else {
            cardMessage = "YELLOW CARD";
            cardMessageTimer = 2.0;
            // Priority 2: CARD interrupts goal and milestone
            goalTimer = 0;
            milestoneTimer = 0;
          }
        }
      }

      if (obs.type === "player") {
        obs.fallen = true;
        obs.height = 15;
      } else {
        obstacles.splice(i, 1);
      }
    }
  }
}

function checkGoalScoring(ball, goal, sceneRef) {
  const goalInnerLeft = goal.x + 4;
  const goalInnerRight = goal.x + goal.width - 4;
  const goalInnerTop = goal.y - goal.height + 4;
  const goalInnerBottom = goal.y;

  const ballInGoal =
    ball.x > goalInnerLeft &&
    ball.x < goalInnerRight &&
    ball.y > goalInnerTop &&
    ball.y < goalInnerBottom;

  if (ballInGoal) {
    score += GOAL_SCORE_POINTS;
    scoreFlashTimer = 1.0;
    crowdCheerTimer = 2.0;
    // Priority 3: GOAL only shows if high score and card are not showing
    if (highScoreTimer <= 0 && cardMessageTimer <= 0) {
      goalMessage = "GOAL!";
      goalTimer = 2.0;
      milestoneTimer = 0; // Priority 3: GOAL interrupts milestone
    }
    milestoneMessage = "";
    playCrowdCheer(sceneRef);
    playGoalSound(sceneRef);
    cameraShake = 5;
    createFireworks();

    // Trigger celebration animation
    isCelebrating = true;
    celebrationTimer = 0.6; // 600ms celebration

    return true;
  }
  return false;
}

function checkObstacleHit(ball, obs, obsIndex, ballIndex, sceneRef) {
  const ballLeft = ball.x - 8;
  const ballRight = ball.x + 8;
  const ballTop = ball.y - 8;
  const ballBottom = ball.y + 8;

  const obsLeft = obs.x;
  const obsRight = obs.x + obs.width;
  const obsTop = obs.y - obs.height;
  const obsBottom = obs.y;

  const hit =
    ballRight > obsLeft &&
    ballLeft < obsRight &&
    ballBottom > obsTop &&
    ballTop < obsBottom;

  if (hit && !obs.fallen) {
    score += OBSTACLE_HIT_POINTS;
    scoreFlashTimer = 0.3;
    crowdCheerTimer = 0.8;
    playHitSound(sceneRef, obs);
    createExplosion(
      obs.x + obs.width / 2,
      obs.y - obs.height / 2,
      getObstacleColor(obs)
    );
    cameraShake = 3;

    if (obs.type === "player") {
      obs.fallen = true;
      obs.height = 15;
    } else {
      obstacles.splice(obsIndex, 1);
    }
    shotBalls.splice(ballIndex, 1);
    return true;
  }
  return false;
}

function updateObstacles(dt, sceneRef) {
  for (let i = obstacles.length - 1; i >= 0; i--) {
    const obs = obstacles[i];
    obs.x -= gameSpeed;

    updateObstacleAnimation(obs, dt);

    // Check collision (no collision only during sliding)
    if (!isSliding && !obs.fallen && checkCollision(player, obs)) {
      endGame(sceneRef);
      return;
    }

    if (obs.x < -50) {
      obstacles.splice(i, 1);
    }
  }
}

function updateObstacleAnimation(obs, dt) {
  if (obs.type === "bottle") {
    obs.y += Math.sin(obs.x * 0.02) * 2;
    obs.rotation += dt * 8;
  }

  if (obs.type === "drone") {
    obs.propellerRotation = (obs.propellerRotation || 0) + dt * 20;
    // Slight hovering motion
    obs.y += Math.sin(obs.x * 0.05) * 0.5;
  }

  if (obs.type === "player" && !obs.fallen) {
    obs.runAnimTimer += dt;
    if (obs.runAnimTimer > RUN_ANIM_SPEED) {
      obs.runAnimTimer = 0;
      obs.runFrame = (obs.runFrame + 1) % 2;
    }
  }
}

function updateParticles(dt) {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.life -= dt;

    if (p.type === "confetti") {
      p.vx = Math.sin(p.life * 8) * 30;
      p.vy = 80;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.rotation += dt * 10;
      p.alpha = 1;
    } else if (p.type === "firework") {
      p.vx *= 0.95;
      p.vy += 300 * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.alpha = p.life / p.maxLife;
    } else {
      p.vx *= 0.98;
      p.vy += 400 * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.alpha = p.life / p.maxLife;
    }

    if (p.life <= 0) {
      particles.splice(i, 1);
    }
  }
}

function updateBackground() {
  billboardOffset = (billboardOffset + gameSpeed * 0.35) % 1600;
  bgOffset = (bgOffset + gameSpeed * 0.5) % 800;

  for (let i = clouds.length - 1; i >= 0; i--) {
    clouds[i].x -= gameSpeed * 0.15;
    if (clouds[i].x < -100) {
      clouds.splice(i, 1);
    }
  }

  if (Math.random() < 0.005) {
    clouds.push({
      x: SPAWN_X_RIGHT,
      y: 200 + Math.random() * 150,
      size: 20 + Math.random() * 30,
    });
  }
}

// ============================================================================
// RENDERING
// ============================================================================

/**
 * Draws the background layer (sky, stars, clouds, crowd, billboards).
 */
function drawBackground() {
  const isNight = isNightMode();
  const skyColor = isNight ? COLOR_SKY_NIGHT : COLOR_SKY_DAY;

  graphics.fillStyle(skyColor, 1);
  graphics.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

  // Stars (only at night)
  if (isNight) {
    drawStars();
  }

  // Clouds (Mario-style)
  drawClouds();

  // Hills (subtle, behind grass)
  drawHills();

  // Crowd (distant)
  drawCrowd();

  // Billboards
  drawBillboards();
}

/**
 * Draws the ground with scrolling grass texture and depth.
 */
function drawGround() {
  const isNight = isNightMode();

  // Ground - Klimt-style pixelated grass with scrolling and depth
  const greenShades = [
    0x228b22, 0x32cd32, 0x90ee90, 0x3cb371, 0x2e8b57, 0x6b8e23,
  ];
  const nightFactor = isNight ? 0.4 : 1.0; // Darker at night

  // Grass blades above ground line (for texture) - growing/shrinking
  for (let ix = -1; ix < GRASS_BLADE_ITERATIONS; ix++) {
    const x = ix * GRASS_BLADE_PIXEL_SIZE - (bgOffset % GRASS_BLADE_PIXEL_SIZE);
    if (x < -GRASS_BLADE_PIXEL_SIZE || x > GAME_WIDTH) {
      continue;
    }
    const patternX = Math.floor((x + bgOffset) / GRASS_BLADE_PIXEL_SIZE);
    // Random grass blade heights (1-3 pixels above ground)
    if (Math.sin(patternX * 2.5) > 0.3) {
      const baseBladeHeight =
        Math.floor((Math.sin(patternX * 3.7) + 1) * 1.5) + 1;
      // Grow/shrink effect - add up to 1 pixel based on time
      const growthOffset = Math.sin(gameTime * 2 + patternX * 0.3) > 0 ? 1 : 0;
      const bladeHeight = baseBladeHeight + growthOffset;
      const baseColor =
        greenShades[
          Math.floor((Math.sin(patternX * 0.8) + 1) * 3) % greenShades.length
        ];
      // Slightly darker at horizon (0.85 brightness) + night factor
      const darkenedColor = darkenColor(baseColor, 0.85 * nightFactor);
      graphics.fillStyle(darkenedColor, 1);
      graphics.fillRect(
        x,
        GROUND_Y - bladeHeight * GRASS_BLADE_PIXEL_SIZE,
        GRASS_BLADE_PIXEL_SIZE,
        bladeHeight * GRASS_BLADE_PIXEL_SIZE
      );
    }
  }

  // Solid grass below ground line with depth gradient
  for (let y = GROUND_Y; y < GAME_HEIGHT; y += GRASS_BLADE_PIXEL_SIZE) {
    // Depth factor: darker at GROUND_Y (0.8), lighter at bottom (1.0)
    const depthFactor =
      (0.8 + ((y - GROUND_Y) / (GAME_HEIGHT - GROUND_Y)) * 0.2) * nightFactor;

    for (let ix = -1; ix < GRASS_BLADE_ITERATIONS; ix++) {
      const x =
        ix * GRASS_BLADE_PIXEL_SIZE - (bgOffset % GRASS_BLADE_PIXEL_SIZE);
      if (x < -GRASS_BLADE_PIXEL_SIZE || x > GAME_WIDTH) {
        continue;
      }
      const patternX = Math.floor((x + bgOffset) / GRASS_BLADE_PIXEL_SIZE);
      const baseColor =
        greenShades[
          Math.floor((Math.sin(patternX * 0.4 + y * 0.1) + 1) * 3) %
            greenShades.length
        ];

      // Apply depth darkening
      const color = darkenColor(baseColor, depthFactor);

      graphics.fillStyle(color, 1);
      graphics.fillRect(x, y, GRASS_BLADE_PIXEL_SIZE, GRASS_BLADE_PIXEL_SIZE);
    }
  }
}

/**
 * Draws all game objects (obstacles, balls, particles, player).
 */
function drawGameObjects() {
  // Obstacles (with small overlap on ground)
  obstacles.forEach((obs) => {
    if (obs.type === "cone") {
      // Traffic cone - overlaps into ground
      const baseY = GROUND_Y + CONE_OVERLAP;
      const isDark = obs.isDark || false;
      const isYellow = obs.isPurple || false;
      const coneHeight = isDark ? DARK_CONE_HEIGHT : CONE_HEIGHT;

      // Shadow (touching the cone)
      drawShadow(obs.x + 12, baseY, 22, 6);

      // Cone body - randomly orange or yellow
      let coneColor;
      if (isDark) {
        coneColor = COLOR_DARK_CONE;
      } else {
        coneColor = isYellow ? COLOR_CONE_YELLOW : COLOR_CONE_ORANGE;
      }
      graphics.fillStyle(coneColor, 1);
      graphics.fillTriangle(
        obs.x,
        baseY,
        obs.x + CONE_WIDTH,
        baseY,
        obs.x + 12,
        baseY - coneHeight
      );

      // Stripes
      const stripeColor = isDark ? COLOR_DARK_CONE_STRIPE : COLOR_CONE_STRIPE;
      const stripeOffsets = isDark ? [-48, -32, -16] : [-32, -20];
      drawHorizontalStripes(
        stripeColor,
        obs.x + 5,
        baseY,
        14,
        4,
        stripeOffsets
      );

      // Base
      fillRect(COLOR_CONE_BASE, obs.x + 8, baseY, 8, 4);
    } else if (obs.type === "player") {
      // Rival player - overlaps into ground
      const baseY = GROUND_Y + PLAYER_OBS_OVERLAP;
      const isBrazil = obs.country === "brazil";
      const bodyColor = isBrazil ? COLOR_BRAZIL_JERSEY : COLOR_FRANCE_JERSEY;
      const shortsColor = COLOR_SHORTS_BLUE; // Blue for both
      const heightOffset = isBrazil ? PLAYER_OBS_HEIGHT_OFFSET_BRAZIL : 0; // Brazil taller

      if (obs.fallen) {
        // Fallen player (slide tackled)
        const skinColor = obs.skinTone || COLOR_SKIN;
        const hairColor = obs.hairColor || COLOR_HAIR;

        drawShadow(obs.x + 20, GROUND_Y + PLAYER_OBS_OVERLAP, 35, 6);
        fillRect(bodyColor, obs.x, GROUND_Y - 10, 30, 15);
        graphics.fillStyle(skinColor, 1);
        graphics.fillCircle(obs.x + 25, GROUND_Y - 5, 7);

        // Facial hair (vertical since player is lying down)
        if (obs.hasMustache || obs.hasBeard) {
          fillRect(hairColor, obs.x + 24, GROUND_Y - 7, 2, 6);
        }
      } else {
        const skinColor = obs.skinTone || COLOR_SKIN;
        const hairColor = obs.hairColor || COLOR_HAIR;

        // Legs with running animation
        const leg1Y = obs.runFrame === 0 ? -14 : -16;
        const leg1H = obs.runFrame === 0 ? 10 : 12;
        const leg2Y = obs.runFrame === 0 ? -14 : -12;
        const leg2H = obs.runFrame === 0 ? 10 : 8;

        fillRect(
          skinColor,
          obs.x + 4,
          baseY + leg1Y - heightOffset,
          6,
          leg1H + heightOffset
        );
        fillRect(
          skinColor,
          obs.x + 12,
          baseY + leg2Y - heightOffset,
          6,
          leg2H + heightOffset
        );

        // Blue socks (Brazil)
        if (isBrazil) {
          drawVerticalPosts(COLOR_BRAZIL_BLUE, obs.x, baseY - 8, 6, 4, [4, 12]);
        }

        // Shorts
        fillRect(shortsColor, obs.x + 4, baseY + leg1Y - heightOffset, 6, 7);
        fillRect(shortsColor, obs.x + 12, baseY + leg2Y - heightOffset, 6, 7);

        // Black shoes
        drawVerticalPosts(COLOR_SHOES_BLACK, obs.x, baseY - 4, 6, 4, [4, 12]);

        // Shadow (touching the player)
        drawShadow(obs.x + 10, baseY, 14, 5);

        // Arms
        fillRect(skinColor, obs.x - 2, baseY - 32 - heightOffset, 5, 12);
        fillRect(skinColor, obs.x + 17, baseY - 30 - heightOffset, 5, 10);

        // Body jersey
        fillRect(bodyColor, obs.x + 2, baseY - 34 - heightOffset, 16, 20);

        // Jersey details
        if (isBrazil) {
          // Green collar
          fillRect(
            COLOR_BRAZIL_GREEN,
            obs.x + 6,
            baseY - 34 - heightOffset,
            8,
            4
          );
          // Blue dot on chest
          fillRect(
            COLOR_BRAZIL_BLUE,
            obs.x + 5,
            baseY - 29 - heightOffset,
            3,
            3
          );
        } else {
          // White + red stripes (France)
          drawVerticalStripes(
            [COLOR_FRANCE_WHITE, COLOR_FRANCE_RED],
            obs.x + 9,
            baseY - 34 - heightOffset,
            2,
            20
          );
        }

        // Head
        graphics.fillStyle(skinColor, 1);
        graphics.fillCircle(obs.x + 10, baseY - 45 - heightOffset, 10);

        // Hair - randomized styles
        const hairStyle = obs.hairStyle || "short";
        if (hairStyle !== "bald") {
          if (hairStyle === "short") {
            fillRect(hairColor, obs.x + 4, baseY - 57 - heightOffset, 12, 6);
          } else if (hairStyle === "tall") {
            fillRect(hairColor, obs.x + 5, baseY - 62 - heightOffset, 10, 10);
          } else if (hairStyle === "curly") {
            fillRect(hairColor, obs.x + 3, baseY - 59 - heightOffset, 14, 8);
            fillRect(hairColor, obs.x + 4, baseY - 60 - heightOffset, 4, 2);
            fillRect(hairColor, obs.x + 12, baseY - 60 - heightOffset, 4, 2);
          }
        }

        // Facial hair
        if (obs.hasMustache) {
          fillRect(hairColor, obs.x + 6, baseY - 41 - heightOffset, 8, 3);
        }
        if (obs.hasBeard) {
          fillRect(hairColor, obs.x + 6, baseY - 38 - heightOffset, 8, 5);
        }
      }
    } else if (obs.type === "bottle") {
      // Heineken bottle (tumbling end-over-end like a wheel)
      const angle = obs.rotation;
      const centerX = obs.x + 5; // Width center (10px total)
      const centerY = obs.y + 4.5; // Align visual (-18 to +9) with collision box (-14 to +14)

      // Shadow on ground (scales with bottle height)
      const bottleHeight = GROUND_Y - centerY;
      const heightFactor = Math.min(bottleHeight / 150, 1);
      const shadowWidth = BOTTLE_WIDTH * 1.5 * (1 - heightFactor * 0.5);
      const shadowAlpha = ALPHA_SHADOW * (1 - heightFactor * 0.4);
      drawShadow(
        centerX,
        GROUND_Y,
        shadowWidth,
        BOTTLE_WIDTH * 0.6 * (1 - heightFactor * 0.3),
        shadowAlpha
      );

      // Draw bottle rotated around its center
      graphics.save();
      graphics.translateCanvas(centerX, centerY);
      graphics.rotateCanvas(angle);

      // Bottle body (green)
      fillRect(COLOR_BOTTLE_GREEN, -5, -9, 10, 18);

      // Longer neck (more visible)
      fillRect(COLOR_BOTTLE_GREEN, -3, -16, 6, 7);

      // Cap (silver/gray)
      fillRect(COLOR_BOTTLE_CAP, -3, -18, 6, 2);

      // Red star (Heineken logo) in center
      fillRect(COLOR_BOTTLE_STAR, -1, -1, 2, 2);

      // Highlight/shine for 3D effect
      fillRect(COLOR_CONE_STRIPE, -2, -7, 2, 12, 0.5);

      graphics.restore();
    } else if (obs.type === "bench") {
      // Team bench (low obstacle) - randomly blue or black
      const baseY = GROUND_Y + PLAYER_OBS_OVERLAP;
      const isBlack = obs.isRed || false;
      const benchColor = isBlack
        ? COLOR_BENCH_SEAT_BLACK
        : COLOR_BENCH_SEAT_BLUE;

      // Shadow (touching the bench)
      drawShadow(obs.x + 20, baseY, 38, 6);
      // Bench legs (metal)
      drawVerticalPosts(
        COLOR_BENCH_METAL,
        obs.x,
        baseY - 18,
        3,
        18,
        [2, 15, 28, 37]
      );
      // Seat (blue or red)
      fillRect(benchColor, obs.x, baseY - 18, BENCH_WIDTH, 4);
      // Backrest (blue or red)
      fillRect(benchColor, obs.x, baseY - 30, BENCH_WIDTH, 4);
      // Support bars
      drawVerticalPosts(COLOR_BENCH_METAL, obs.x, baseY - 30, 3, 12, [2, 37]);
      // Water bottles on bench (detail)
      drawVerticalPosts(COLOR_BENCH_WATER, obs.x, baseY - 22, 3, 6, [8, 20]);
      drawVerticalPosts(COLOR_CONE_STRIPE, obs.x, baseY - 23, 3, 2, [8, 20]);
    } else if (obs.type === "drone") {
      // Drone - flying obstacle (bigger)
      const centerX = obs.x + obs.width / 2;

      // Shadow on ground
      drawShadow(centerX, GROUND_Y, obs.width - 6, 8);

      // Drone body (dark gray) - bigger
      fillRect(COLOR_DRONE_BODY, obs.x + 8, obs.y - 8, 16, 10);

      // Center module (lighter)
      fillRect(0x555555, obs.x + 13, obs.y - 5, 6, 5);

      // Propeller arms - longer
      fillRect(COLOR_DRONE_BODY, obs.x, obs.y - 3, 8, 3);
      fillRect(COLOR_DRONE_BODY, obs.x + 24, obs.y - 3, 8, 3);

      // Spinning propellers (red) - bigger
      const propAngle = obs.propellerRotation || 0;
      // Left propeller
      fillRect(
        COLOR_DRONE_PROPELLER,
        obs.x + 1,
        obs.y - 2 + Math.sin(propAngle) * 2,
        6,
        2,
        0.7
      );
      fillRect(COLOR_DRONE_PROPELLER, obs.x + 3, obs.y - 3, 2, 5, 0.7);
      // Right propeller
      fillRect(
        COLOR_DRONE_PROPELLER,
        obs.x + 25,
        obs.y - 2 + Math.sin(propAngle + Math.PI) * 2,
        6,
        2,
        0.7
      );
      fillRect(COLOR_DRONE_PROPELLER, obs.x + 27, obs.y - 3, 2, 5, 0.7);
    } else if (obs.type === "goal") {
      // Goal post (soccer goal) - using dynamic size from obstacle
      const baseY = GROUND_Y + PLAYER_OBS_OVERLAP;
      const goalWidth = obs.width;
      const goalHeight = obs.height;

      // Shadow (touching the goal)
      drawShadow(obs.x + goalWidth / 2, baseY, goalWidth - 10, 8);

      // Net (behind posts)
      graphics.fillStyle(COLOR_GOAL_NET, ALPHA_NET);
      for (let i = 0; i < goalWidth; i += 6) {
        graphics.fillRect(obs.x + i, baseY - goalHeight, 2, goalHeight);
      }
      for (let i = 0; i < goalHeight; i += 6) {
        graphics.fillRect(obs.x, baseY - i, goalWidth, 2);
      }

      // Posts (white)
      fillRect(COLOR_GOAL_POST, obs.x, baseY - goalHeight, 4, goalHeight); // Left post
      fillRect(
        COLOR_GOAL_POST,
        obs.x + goalWidth - 4,
        baseY - goalHeight,
        4,
        goalHeight
      ); // Right post
      fillRect(COLOR_GOAL_POST, obs.x, baseY - goalHeight, goalWidth, 4); // Crossbar
    }
  });

  // Bouncing balls (spinning)
  balls.forEach(drawBallWithShadow);

  // Shot balls (spinning)
  shotBalls.forEach(drawBallWithShadow);

  // Particles
  particles.forEach((p) => {
    if (p.type === "confetti") {
      // Draw confetti as small rectangles
      graphics.save();
      graphics.translateCanvas(p.x, p.y);
      graphics.rotateCanvas(p.rotation || 0);
      fillRect(p.color, -2, -3, 4, 6, p.alpha);
      graphics.restore();
    } else if (p.type === "firework") {
      // Draw firework particles as bright circles with glow
      graphics.fillStyle(p.color, p.alpha * 0.3);
      graphics.fillCircle(p.x, p.y, p.size * 2);
      graphics.fillStyle(p.color, p.alpha);
      graphics.fillCircle(p.x, p.y, p.size);
    } else {
      // Draw explosion particles as circles
      graphics.fillStyle(p.color, p.alpha);
      graphics.fillCircle(p.x, p.y, p.size);
    }
  });

  // Player
  drawPlayer();
}

/**
 * Draws the UI layer (score, messages, instructions, grid).
 */
function drawUI() {
  // Game title "GOLEADOR" - Football-style with white, red, and blue
  const titleX = 20;
  const titleY = 15;
  const titleScale = 1.4;

  // Dancing animation when scoring (like the crowd)
  let titleDanceOffset = 0;
  if (crowdCheerTimer > 0) {
    titleDanceOffset = Math.sin(gameTime * 25) * 5;
  }

  const letters = [
    LETTER_G,
    LETTER_O,
    LETTER_L,
    LETTER_E,
    LETTER_A,
    LETTER_D,
    LETTER_O,
    LETTER_R,
  ];
  let offsetX = titleX;

  letters.forEach((letter) => {
    drawFootballLetter(offsetX, titleY + titleDanceOffset, letter, titleScale);
    offsetX += 18 * titleScale;
  });

  // Yellow/Red cards next to GOLEADOR - BIGGER, SHINY, ANIMATED
  if (yellowCards > 0) {
    const cardX = offsetX + 10;
    const cardY = titleY + titleDanceOffset + 2; // Move with GOLEADOR
    const shine = Math.abs(Math.sin(gameTime * 3)) * 0.3 + 0.7;
    const scaleAnim =
      Math.min(1, cardAppearTime / 0.5) < 1
        ? 1 + (1 - Math.min(1, cardAppearTime / 0.5)) * 1.5
        : 1;

    for (let i = 0; i < yellowCards; i++) {
      drawCard(
        cardX + i * 28,
        cardY,
        i === yellowCards - 1 ? scaleAnim : 1,
        0xffff00,
        0.5,
        0xffff00,
        0xffff00,
        shine
      );
    }

    if (yellowCards >= 2) {
      drawCard(
        cardX + 56,
        cardY,
        scaleAnim,
        0xff0000,
        0.4,
        0xff0000,
        0xff5555,
        Math.abs(Math.sin(gameTime * 4)) * 0.4 + 0.6
      );
    }
  }

  // Score UI (top right, Chrome dino style)
  const scoreStr = String(score).padStart(SCORE_PADDING, "0");
  const bestStr = String(sessionBest).padStart(SCORE_PADDING, "0");
  const scoreText = `HI ${bestStr}  ${scoreStr}`;

  // Color: Gold when new best, Yellow when hitting obstacles, White normally
  let scoreColor = COLOR_SCORE_NORMAL;
  if (isNewBest) {
    scoreColor = COLOR_SCORE_GOLD;
  } else if (scoreFlashTimer > 0) {
    scoreColor = COLOR_SCORE_FLASH;
  }

  drawPixelText(scoreText, 380, 15, scoreColor, 2);

  // Milestone message (centered, large) - smooth animation
  if (milestoneTimer > 0) {
    drawScaledText(milestoneMessage, milestoneTimer, 2, 5, 2, COLOR_MILESTONE);
  }

  // GOAL message (centered, huge!)
  if (goalTimer > 0) {
    drawScaledText(goalMessage, goalTimer, 2, 6, 2, COLOR_GOAL_TEXT);
  }

  // NEW HIGH SCORE message (centered, golden)
  if (highScoreTimer > 0) {
    const scale = drawScaledText(
      highScoreMessage,
      highScoreTimer,
      3,
      3,
      1,
      0x0055cc
    );

    // Draw pixelated trophy cup after text (right side)
    const msgWidth = highScoreMessage.length * 12 * scale;
    const msgX = 400 - msgWidth / 2;
    const trophySize = scale * 3;
    const trophyX = msgX + msgWidth + trophySize * 0.5;
    const trophyY = 280 + scale * 6;

    // Gold color for trophy
    graphics.fillStyle(COLOR_SCORE_GOLD, 1);

    // Cup bowl (simple chunky shape)
    graphics.fillRect(
      trophyX,
      trophyY - trophySize * 3,
      trophySize * 4,
      trophySize
    );
    graphics.fillRect(
      trophyX - trophySize,
      trophyY - trophySize * 2,
      trophySize * 6,
      trophySize * 2
    );

    // Handles (simple blocks)
    graphics.fillRect(
      trophyX - trophySize * 2,
      trophyY - trophySize * 2,
      trophySize,
      trophySize
    );
    graphics.fillRect(
      trophyX + trophySize * 5,
      trophyY - trophySize * 2,
      trophySize,
      trophySize
    );

    // Stem
    graphics.fillRect(
      trophyX + trophySize,
      trophyY,
      trophySize * 2,
      trophySize
    );

    // Base
    graphics.fillRect(
      trophyX,
      trophyY + trophySize,
      trophySize * 4,
      trophySize
    );

    // Dark gold accent for depth
    graphics.fillStyle(0xcc9900, 1);
    graphics.fillRect(
      trophyX,
      trophyY - trophySize * 2,
      trophySize * 4,
      trophySize
    );
  }

  // CARD MESSAGE (YELLOW CARD or RED CARD)
  if (cardMessageTimer > 0) {
    const t = 1 - cardMessageTimer / 2;
    const easeOut = 1 - Math.pow(1 - t, 3);
    const scale = 4 - Number(easeOut) * 1; // 4 -> 3

    const msgWidth = cardMessage.length * 12 * scale;
    const msgColor = cardMessage === "RED CARD" ? 0xff0000 : 0xffee00;

    drawPixelText(cardMessage, 400 - msgWidth / 2, 280, msgColor, scale);
  }

  // Instructions at bottom (pixel font for readability)
  const instructText = "UP JUMP | DOWN SLIDE | LEFT TRICK | RIGHT SHOOT";
  const instructX = 35;
  const instructY = 570;
  const instructScale = 1.4;

  // Yellow shadow
  drawPixelText(
    instructText,
    instructX + 2,
    instructY + 2,
    0xffee00,
    instructScale
  );
  // White text on top
  drawPixelText(instructText, instructX, instructY, 0xffffff, instructScale);

  // Development grid
  if (showGrid) {
    graphics.lineStyle(1, COLOR_CONE_STRIPE, 0.2);
    for (let x = 0; x <= GAME_WIDTH; x += 50) {
      graphics.lineBetween(x, 0, x, GAME_HEIGHT);
    }
    for (let y = 0; y <= GAME_HEIGHT; y += 50) {
      graphics.lineBetween(0, y, GAME_WIDTH, y);
    }
  }
}

/**
 * Main rendering function - calls all sub-renderers in correct order.
 * Called every frame from update() loop.
 */
function drawGame() {
  graphics.clear();

  // Main game rendering
  drawBackground();
  drawGround();

  // Only draw game objects if game has started
  if (gameStarted) {
    drawGameObjects();
    drawUI();
  }

  // Show start screen if game hasn't started
  if (!gameStarted) {
    drawStartScreen();
  }

  // Game over UI
  if (gameOver) {
    drawGameOverUI();
  }
}

/**
 * Draws a soccer ball with optional rotation animation and night mode glow.
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @param {number} radius - Ball radius in pixels
 * @param {string} type - Ball design (BALL_TYPE_CLASSIC, BALL_TYPE_FEVERNOVA, or BALL_TYPE_JABULANI)
 * @param {boolean} isStatic - If true, ball doesn't rotate
 */
function drawSpinningBall(
  x,
  y,
  radius,
  type = BALL_TYPE_CLASSIC,
  isStatic = false
) {
  const angle = isStatic ? 0 : ballRotation;
  const isNight = isNightMode();

  // Enhanced visibility during night mode
  if (isNight) {
    graphics.fillStyle(COLOR_CONE_STRIPE, 0.3);
    graphics.fillCircle(x, y, radius + 3);
  }

  // Draw different ball types
  if (type === BALL_TYPE_FEVERNOVA) {
    // Black and white circular pattern ball
    graphics.fillStyle(COLOR_CONE_STRIPE, 1);
    graphics.fillCircle(x, y, radius);

    // White circular patterns (outside)
    graphics.fillStyle(0xffffff, 1);
    for (let i = 0; i < 4; i++) {
      const a = angle + (i * Math.PI * 2) / 4;
      const px = x + Math.cos(a) * radius * 0.6;
      const py = y + Math.sin(a) * radius * 0.6;
      graphics.fillCircle(px, py, radius * 0.4);
    }

    // Black accent circles (inside)
    graphics.fillStyle(0x000000, 1);
    for (let i = 0; i < 4; i++) {
      const a = angle + Math.PI / 4 + (i * Math.PI * 2) / 4;
      const px = x + Math.cos(a) * radius * 0.4;
      const py = y + Math.sin(a) * radius * 0.4;
      graphics.fillCircle(px, py, radius * 0.25);
    }

    graphics.lineStyle(2, 0xffffff, 1);
    graphics.strokeCircle(x, y, radius);
  } else if (type === BALL_TYPE_JABULANI) {
    // South Africa 2010 - Jabulani (white with colorful triangular patterns)
    graphics.fillStyle(COLOR_CONE_STRIPE, 1);
    graphics.fillCircle(x, y, radius);

    // Colorful triangular/curved patterns
    const colors = [0x000000, 0x00ff00, 0xffff00, 0xffffff];
    for (let i = 0; i < 4; i++) {
      const a = angle + (i * Math.PI * 2) / 4;
      graphics.fillStyle(colors[i], 1);

      // Draw curved triangle-like shapes
      const px1 = x + Math.cos(a) * radius * 0.7;
      const py1 = y + Math.sin(a) * radius * 0.7;
      const px2 = x + Math.cos(a + 0.5) * radius * 0.5;
      const py2 = y + Math.sin(a + 0.5) * radius * 0.5;
      const px3 = x + Math.cos(a - 0.5) * radius * 0.5;
      const py3 = y + Math.sin(a - 0.5) * radius * 0.5;

      graphics.fillTriangle(px1, py1, px2, py2, px3, py3);
    }

    graphics.lineStyle(2, COLOR_SHADOW, 1);
    graphics.strokeCircle(x, y, radius);
  } else {
    // Classic white ball with black pentagons
    graphics.fillStyle(COLOR_CONE_STRIPE, 1);
    graphics.fillCircle(x, y, radius);

    graphics.fillStyle(COLOR_SHADOW, 1);
    for (let i = 0; i < 5; i++) {
      const a = angle + (i * Math.PI * 2) / 5;
      const px = x + Math.cos(a) * radius * 0.6;
      const py = y + Math.sin(a) * radius * 0.6;
      graphics.fillCircle(px, py, radius * 0.3);
    }

    graphics.lineStyle(2, COLOR_SHADOW, 1);
    graphics.strokeCircle(x, y, radius);
  }
}

/**
 * Draws twinkling stars for night mode background.
 * Uses deterministic positioning for consistent star field.
 */
function drawStars() {
  graphics.fillStyle(COLOR_CONE_STRIPE, 1);
  for (let i = 0; i < STAR_COUNT; i++) {
    // Deterministic positioning based on index (consistent across frames)
    const x = (i * 37 + 123) % GAME_WIDTH;
    const y = (i * 73 + 47) % 300;
    const twinkle = Math.sin(gameTime * 2 + i) * 0.5 + 0.5;
    const size = twinkle > 0.7 ? 2 : 1;
    graphics.fillRect(x, y, size, size);
  }
}

/**
 * Draws fluffy clouds in the background (day mode only).
 * Each cloud is composed of overlapping circles with subtle gradient.
 */
function drawClouds() {
  if (isNightMode()) {
    return;
  }

  clouds.forEach((cloud) => {
    const s = cloud.size;

    // Bottom parts - slightly blue-grey (Magritte style)
    graphics.fillStyle(0xe8eef2, 0.85);
    graphics.fillCircle(cloud.x, cloud.y, s * 0.5);
    graphics.fillCircle(cloud.x + s * 0.6, cloud.y, s * 0.6);
    graphics.fillCircle(cloud.x + s * 1.2, cloud.y, s * 0.5);

    // Top part - very subtle warm yellow tint
    graphics.fillStyle(0xfcfcf0, 0.8);
    graphics.fillCircle(cloud.x + s * 0.6, cloud.y - s * 0.3, s * 0.4);
  });
}

function drawHills() {
  const isNight = isNightMode();
  const hills = [
    [isNight ? 0x1c1f3d : 0x7fc5e8, 0.3, 40, 0.008, 20],
    [isNight ? 0x1a1d3a : 0x75bbe0, 0.4, 60, 0.01, 25],
    [isNight ? 0x181b37 : 0x6bb1d8, 0.5, 80, 0.012, 30],
  ];
  for (const [color, alpha, offset, freq, amplitude] of hills) {
    graphics.fillStyle(color, alpha);
    graphics.beginPath();
    graphics.moveTo(0, GROUND_Y);
    for (let x = 0; x <= GAME_WIDTH; x += 10) {
      graphics.lineTo(x, GROUND_Y - offset - Math.sin(x * freq) * amplitude);
    }
    graphics.lineTo(GAME_WIDTH, GROUND_Y);
    graphics.closePath();
    graphics.fillPath();
  }
}

function drawCrowd() {
  // Static crowd with animated colors (red predominant) and depth
  const nightFactor = isNightMode() ? 0.5 : 1.0; // Darker at night

  for (let row = 0; row < CROWD_ROWS; row++) {
    // Depth factor: darker at back (row 0 = 0.7), lighter at front (row 9 = 1.0)
    const depthFactor = (0.7 + (row / (CROWD_ROWS - 1)) * 0.3) * nightFactor;

    for (let col = 0; col < CROWD_COLUMNS; col++) {
      const x = col * CROWD_COLUMN_WIDTH;
      const y = CROWD_START_Y + row * CROWD_ROW_HEIGHT;

      // Color animation - shift colors over time (slower)
      const colorOffset =
        Math.floor(gameTime * 0.5 + col * 0.3 + row * 0.2) %
        CROWD_COLORS.length;
      const colorIndex =
        (row * 7 + col * 3 + colorOffset) % CROWD_COLORS.length;
      const baseColor = CROWD_COLORS[colorIndex];

      // Apply depth darkening
      const color = darkenColor(baseColor, depthFactor);

      // Crowd cheer animation - jump up when cheering
      let cheerOffset = 0;
      if (crowdCheerTimer > 0) {
        cheerOffset = Math.sin(col * 0.5 + row * 0.3 + gameTime * 20) * 4;
      }

      graphics.fillStyle(color, 1);
      graphics.fillRect(
        x,
        y + cheerOffset,
        CROWD_SPRITE_WIDTH,
        CROWD_SPRITE_HEIGHT
      );
    }
  }
}

function drawBillboards() {
  const billboards = ["PLATANUS", "HACK"];
  // PLATANUS (260px), HACK (140px) for text fit
  const widths = [260, 140];
  const totalPattern = widths[0] + widths[1]; // 400px per cycle

  for (let i = 0; i < 10; i++) {
    const isPlat = i % 2 === 0;
    const width = widths[i % 2];
    const xOffset = Math.floor(i / 2) * totalPattern + (isPlat ? 0 : widths[0]);
    let x = xOffset - billboardOffset;

    while (x < -width) {
      x += totalPattern * 5;
    }
    while (x > 800) {
      x -= totalPattern * 5;
    }

    const text = billboards[i % 2];
    const bgColor = isPlat ? 0xffff00 : 0x000000;
    const bgColor2 = isPlat ? 0xffee00 : 0x1a1a1a; // Secondary color, very similar
    const textColor = isPlat ? 0x000000 : 0xffff00;

    // Shadow under billboard
    fillRect(COLOR_SHADOW, x, 220, width, 4, 0.25);

    // Billboard with gradient (100% brightness at top, 90% at bottom)
    drawGradientStripe(x, 170, width, 50, bgColor, 2);

    // Secondary color in alternating stripes (with same gradient)
    for (let ty = 170; ty < 220; ty += 4) {
      if ((ty - 170) % 8 < 4) {
        const progress = (ty - 170) / 50;
        const brightness = 1.0 - progress * 0.1;

        const r = ((bgColor2 >> 16) & 0xff) * brightness;
        const g = ((bgColor2 >> 8) & 0xff) * brightness;
        const b = (bgColor2 & 0xff) * brightness;
        const gradientColor =
          (Math.floor(r) << 16) | (Math.floor(g) << 8) | Math.floor(b);

        graphics.fillStyle(gradientColor, 1);
        graphics.fillRect(x, ty, width, 4);
      }
    }

    // Painterly texture - subtle diagonal strokes
    const darkerTone = isPlat ? 0xeeee00 : 0x111111;
    const lighterTone = isPlat ? 0xffff33 : 0x222222;
    graphics.fillStyle(darkerTone, 0.15);
    for (let ty = 170; ty < 220; ty += 8) {
      for (let tx = 0; tx < width; tx += 16) {
        if ((tx + ty) % 32 < 16) {
          graphics.fillRect(x + tx, ty, 8, 4);
        }
      }
    }
    graphics.fillStyle(lighterTone, 0.1);
    for (let ty = 174; ty < 220; ty += 8) {
      for (let tx = 4; tx < width; tx += 16) {
        if ((tx + ty) % 32 >= 16) {
          graphics.fillRect(x + tx, ty, 6, 3);
        }
      }
    }

    if (text === "HACK") {
      // HACK text centered, then banana as J
      const textWidth = 4 * 12 * 2;
      const bananaWidth = 8;
      const spacing = 8;
      const totalWidth = textWidth + bananaWidth + spacing;
      const startX = x + (width - totalWidth) / 2;

      drawPixelText("HACK", startX, 180, textColor, 2); // Higher (180 instead of 190)

      // Draw banana as J shape in yellow
      const bananaX = startX + textWidth + spacing;
      fillRect(0xffff00, bananaX, 180, 4, 20);
      fillRect(0xffff00, bananaX - 4, 200, 8, 4);
      fillRect(0xffff00, bananaX - 4, 200, 4, 8);
      fillRect(0x8b4513, bananaX + 1, 178, 2, 3);
    } else {
      // Center PLATANUS text (higher)
      const textWidth = 8 * 12 * 2;
      const startX = x + (width - textWidth) / 2;
      drawPixelText(text, startX, 180, textColor, 2); // Higher (180 instead of 190)
    }
  }
}

function drawPixelText(text, startX, startY, color, scale = 1) {
  let offsetX = 0;
  for (const char of text) {
    const pattern = PIXEL_FONT[char];
    if (pattern) {
      for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 3; col++) {
          if (pattern[row][col]) {
            graphics.fillStyle(color, 1);
            graphics.fillRect(
              startX + offsetX + col * 3 * scale,
              startY + row * 3 * scale,
              2 * scale,
              2 * scale
            );
          }
        }
      }
      offsetX += 12 * scale;
    }
  }
}

function drawPlayer() {
  // 3/4 view - running towards camera/front
  const { x } = player;
  const { y } = player;

  // ANGRY PLAYER during card animation (RED CARD only)
  if (isCardAnimation) {
    const bodyShake = Math.sin(cardAnimationTimer * 25) * 1.5; // Body shake
    const kickProgress = Math.abs(Math.sin(cardAnimationTimer * 12)); // Subtle kick
    const armWave = Math.sin(cardAnimationTimer * 20); // Arm movement

    // Minimal floor kick
    const kickOffset = kickProgress * 4; // More minimal

    // Legs - subtle kick
    drawLeg(x + 4, y, -14, 10, 7, 6);
    drawLeg(x + 13 + kickOffset, y - kickOffset * 0.5, -14, 10, 7, 6);

    // Body
    fillRect(COLOR_PLAYER_JERSEY, x + 4 + bodyShake, y - 32, 16, 20);

    // Arms - alternating movement (one up, one down)
    const leftArmY = -38 + armWave * 6;
    const rightArmY = -38 - armWave * 6;

    fillRect(COLOR_SKIN, x + bodyShake, y + leftArmY, 4, 12);
    fillRect(COLOR_SKIN, x + bodyShake, y + leftArmY, 5, 5);
    fillRect(COLOR_SKIN, x + 20 + bodyShake, y + rightArmY, 4, 12);
    fillRect(COLOR_SKIN, x + 19 + bodyShake, y + rightArmY, 5, 5);

    // Head (no eyes - just simple head)
    graphics.fillStyle(COLOR_SKIN, 1);
    graphics.fillCircle(x + 12 + bodyShake, y - 42, 10);

    // Hair
    graphics.fillStyle(COLOR_HAIR, 1);
    graphics.fillRect(x + 6 + bodyShake, y - 50, 12, 8);

    // ANGRY MOUTH (shouting)
    fillRect(0x000000, x + 8 + bodyShake, y - 36, 8, 4);

    drawPlayerShadow(x + 12, y, 16, 6);
    return;
  }

  // SLIDE TACKLE ANIMATION - head at the BACK
  if (isSliding) {
    // Head at the back - BIGGER and MORE VISIBLE
    graphics.fillStyle(COLOR_SKIN, 1);
    graphics.fillCircle(x + 8, y - 15, 8); // Circular head
    // Hair
    fillRect(COLOR_HAIR, x + 4, y - 20, 8, 6);
    // Eyes (so you can see the face)
    fillRect(0x000000, x + 6, y - 16, 2, 2);
    fillRect(0x000000, x + 10, y - 16, 2, 2);

    // Arms extended
    fillRect(COLOR_SKIN, x + 14, y - 18, 12, 4);

    // Body lying horizontal
    fillRect(COLOR_PLAYER_JERSEY, x + 14, y - 14, 20, 10);

    // Bent leg (middle)
    fillRect(COLOR_SKIN, x + 20, y - 4, 8, 4);
    fillRect(COLOR_PLAYER_SHORTS, x + 22, y - 8, 8, 6);
    fillRect(COLOR_SHOES_BLACK, x + 20, y - 4, 4, 4);

    // Extended leg (front)
    fillRect(COLOR_SKIN, x + 32, y - 6, 18, 6);
    fillRect(COLOR_SHOES_BLACK, x + 44, y - 6, 6, 6);

    drawPlayerShadow(x + 20, y, 35, 6);
    return;
  }

  // TRICK ANIMATIONS - different moves based on balls held
  if (isTricking) {
    const trickProgress = trickTimer / TRICK_DURATION;

    if (ballTypesHeld.length === 0) {
      // NO BALLS - 4 different show off moves
      if (currentTrick === 0) {
        // 360 spin
        const angle = trickProgress * Math.PI * 2;
        graphics.save();
        graphics.translateCanvas(x + 12, y - 20);
        graphics.rotateCanvas(angle);
        fillRect(COLOR_PLAYER_JERSEY, -8, -12, 16, 20);
        graphics.fillStyle(COLOR_SKIN, 1);
        graphics.fillCircle(0, -22, 8);
        fillRect(COLOR_HAIR, -6, -28, 12, 8);
        graphics.restore();
        drawStandingLegs(x, y);
      } else if (currentTrick === 1) {
        // Elastico (side step)
        const sideStep = Math.sin(trickProgress * Math.PI * 4) * 8;
        drawPlayerBody(x, y, sideStep);
        drawPlayerLegs(x + sideStep, y, -14, 10, -14, 10, 6);
      } else if (currentTrick === 2) {
        // Star pose - open arms and legs
        const starProgress = Math.sin(trickProgress * Math.PI); // 0 to 1 to 0
        const armSpread = 8 * starProgress; // Arms spread
        const legSpread = 6 * starProgress; // Legs spread

        // Legs spread
        drawLeg(x + 4 - legSpread, y, -14, 10, 6, 6); // Left leg
        drawLeg(x + 14 + legSpread, y, -14, 10, 6, 6); // Right leg

        // Body
        fillRect(COLOR_PLAYER_JERSEY, x + 4, y - 32, 16, 20);

        // Arms spread horizontally
        fillRect(COLOR_SKIN, x - armSpread, y - 30, 5, 10); // Left arm
        fillRect(COLOR_SKIN, x + 19 + armSpread, y - 30, 5, 10); // Right arm

        // Head
        graphics.fillStyle(COLOR_SKIN, 1);
        graphics.fillCircle(x + 12, y - 42, 10);
        fillRect(COLOR_HAIR, x + 6, y - 50, 12, 8);
      } else {
        // Jump twist
        const jumpHeight = Math.sin(trickProgress * Math.PI) * 25;
        const twist = trickProgress * Math.PI;
        graphics.save();
        graphics.translateCanvas(x + 12, y - 20 - jumpHeight);
        graphics.rotateCanvas(twist * 0.5);
        fillRect(COLOR_PLAYER_JERSEY, -8, -12, 16, 20);
        graphics.fillStyle(COLOR_SKIN, 1);
        graphics.fillCircle(0, -22, 8);
        fillRect(COLOR_HAIR, -6, -28, 12, 8);
        graphics.restore();
        drawPlayerLegs(x, y - jumpHeight, -14, 10, -14, 10, 6);
      }
    } else if (ballTypesHeld.length === 1) {
      // ONE BALL - 3 different juggling tricks
      if (currentTrick === 0) {
        // Vertical juggling
        const bounceHeight =
          Math.abs(Math.sin(trickProgress * Math.PI * 3)) * 15;
        drawPlayerBody(x, y);
        drawSpinningBall(
          x + 12,
          y - 55 - bounceHeight,
          6,
          safeArrayGet(ballTypesHeld, 0, BALL_TYPE_CLASSIC)
        );
        drawStandingLegs(x, y);
      } else if (currentTrick === 1) {
        // Around the head juggling
        const angle = trickProgress * Math.PI * 2;
        const radius = 18;
        drawPlayerBody(x, y);
        drawSpinningBall(
          x + 12 + Math.cos(angle) * radius,
          y - 42 + Math.sin(angle) * radius,
          6,
          safeArrayGet(ballTypesHeld, 0, BALL_TYPE_CLASSIC)
        );
        drawStandingLegs(x, y);
      } else {
        // Toe tap juggle - ball bounces rapidly between alternating feet
        const tapSpeed = trickProgress * Math.PI * 4; // Fast alternating
        const isLeftFoot = Math.sin(tapSpeed) > 0;

        // Ball bounces low between feet
        const ballBounce = Math.abs(Math.sin(tapSpeed)) * 8;
        const ballX = x + 12 + (isLeftFoot ? -6 : 6); // Alternates left/right
        const ballY = y - 8 - ballBounce; // Low, near feet

        // Foot lifts when touching ball
        const leftFootLift = isLeftFoot ? 6 : 0;
        const rightFootLift = isLeftFoot ? 0 : 6;

        drawPlayerBody(x, y);

        // Draw ball bouncing between feet
        drawSpinningBall(
          ballX,
          ballY,
          6,
          safeArrayGet(ballTypesHeld, 0, BALL_TYPE_CLASSIC)
        );

        // Draw legs with alternating lifts
        drawPlayerLegs(
          x,
          y,
          -14 - leftFootLift,
          10,
          -14 - rightFootLift,
          10,
          6
        );
      }
    } else {
      // TWO BALLS - 3 different advanced juggling tricks
      if (currentTrick === 0) {
        // Orbiting balls
        const ball1Angle = trickProgress * Math.PI * 2;
        const ball2Angle = ball1Angle + Math.PI;
        const orbitRadius = 20;
        drawPlayerBody(x, y);
        drawSpinningBall(
          x + 12 + Math.cos(ball1Angle) * orbitRadius,
          y - 42 + Math.sin(ball1Angle) * orbitRadius,
          6,
          safeArrayGet(ballTypesHeld, 0, BALL_TYPE_CLASSIC)
        );
        drawSpinningBall(
          x + 12 + Math.cos(ball2Angle) * orbitRadius,
          y - 42 + Math.sin(ball2Angle) * orbitRadius,
          6,
          safeArrayGet(ballTypesHeld, 1, BALL_TYPE_CLASSIC)
        );
        drawStandingLegs(x, y);
      } else if (currentTrick === 1) {
        // High toss cascade - balls alternate going high in the air
        // Ball 1 - parabolic arc with delay
        const ball1Phase = Math.max(0, Math.min(1, trickProgress * 1.3)); // First half
        const ball1Arc = Math.sin(ball1Phase * Math.PI); // Parabolic curve
        const ball1Height = ball1Arc * 35; // Goes up to 35px high
        const ball1X = x + 12 - 8;
        const ball1Y = y - 50 - ball1Height;

        // Ball 2 - starts later, goes higher
        const ball2Phase = Math.max(
          0,
          Math.min(1, (trickProgress - 0.3) * 1.3)
        ); // Delayed start
        const ball2Arc = Math.sin(ball2Phase * Math.PI);
        const ball2Height = ball2Arc * 40; // Goes up to 40px high
        const ball2X = x + 12 + 8;
        const ball2Y = y - 50 - ball2Height;

        // Draw player
        drawPlayerBody(x, y);

        // Draw balls with spin
        drawSpinningBall(
          ball1X,
          ball1Y,
          6,
          safeArrayGet(ballTypesHeld, 0, BALL_TYPE_CLASSIC)
        );
        drawSpinningBall(
          ball2X,
          ball2Y,
          6,
          safeArrayGet(ballTypesHeld, 1, BALL_TYPE_CLASSIC)
        );

        drawPlayerLegs(x, y, -14, 10, -14, 10, 6);
      } else {
        // Knee bounce juggle - balls alternate bouncing off knees
        const bounceSpeed = trickProgress * Math.PI * 4; // Fast alternating bounces

        // Ball 1 - bounces on left knee
        const ball1Phase = (Math.sin(bounceSpeed) + 1) / 2; // 0 to 1 oscillation
        const ball1Height = ball1Phase * 25; // Height above knee
        const ball1X = x + 12 - 10;
        const ball1Y = y - 15 - ball1Height; // Knee level

        // Ball 2 - bounces on right knee (opposite phase)
        const ball2Phase = (Math.sin(bounceSpeed + Math.PI) + 1) / 2;
        const ball2Height = ball2Phase * 25;
        const ball2X = x + 12 + 10;
        const ball2Y = y - 15 - ball2Height;

        // Leg animation - lift knee when ball is low
        const leftKneeLift = ball1Phase < 0.3 ? 8 : 0; // Lift when ball near knee
        const rightKneeLift = ball2Phase < 0.3 ? 8 : 0;

        // Draw player body
        drawPlayerBody(x, y);

        // Draw balls bouncing off knees
        drawSpinningBall(
          ball1X,
          ball1Y,
          6,
          safeArrayGet(ballTypesHeld, 0, BALL_TYPE_CLASSIC)
        );
        drawSpinningBall(
          ball2X,
          ball2Y,
          6,
          safeArrayGet(ballTypesHeld, 1, BALL_TYPE_CLASSIC)
        );

        // Draw legs with knee lifts
        drawPlayerLegs(
          x,
          y,
          -14 - leftKneeLift,
          10,
          -14 - rightKneeLift,
          10,
          6
        );
      }
    }

    drawPlayerShadow(x + 12, y, 16, 6);
    return;
  }

  // Legs (running animation) - skin-colored legs with blue shorts and black shoes
  if (isKicking) {
    // Kick pose - one leg extended (custom shoe positions for kick)
    fillRect(COLOR_SKIN, x + 6, y - 16, 6, 12);
    fillRect(COLOR_SKIN, x + 14, y - 22, 8, 18);
    fillRect(COLOR_PLAYER_SHORTS, x + 6, y - 16, 6, 6);
    fillRect(COLOR_PLAYER_SHORTS, x + 14, y - 22, 8, 8);
    fillRect(COLOR_SHOES_BLACK, x + 5, y - 4, 7, 4);
    fillRect(COLOR_SHOES_BLACK, x + 14, y - 4, 10, 4);
  } else if (runFrame === 0) {
    drawStandingLegs(x, y);
  } else {
    drawPlayerLegs(x, y, -16, 12, -12, 8, 6);
  }

  // Shadow on ground (scales with player height)
  drawPlayerShadow(x + 12, y, 16, 6);

  // Arms (celebration pose when scoring)
  graphics.fillStyle(COLOR_SKIN, 1);
  if (isCelebrating) {
    // Both arms raised up in the air
    // Back arm
    graphics.fillRect(x + 20, y - 50, 5, 18);
    // Front arm
    graphics.fillRect(x - 1, y - 50, 5, 18);
  } else if (runFrame === 0) {
    // Normal running arms
    // Back arm
    graphics.fillRect(x + 20, y - 32, 5, 12);
    // Front arm (drawn later to be in front of body)
  } else {
    // Normal running arms
    // Back arm
    graphics.fillRect(x + 20, y - 28, 5, 10);
    // Front arm (drawn later to be in front of body)
  }

  // Body (red jersey - Chile) - centered/front view
  fillRect(COLOR_PLAYER_JERSEY, x + 4, y - 32, 16, 20);

  // Blue neck/collar
  fillRect(COLOR_PLAYER_SHORTS, x + 8, y - 32, 8, 4);

  // White dot in center of collar
  fillRect(COLOR_PLAYER_STRIPE, x + 11, y - 30, 2, 2);

  // White star on left chest (Chilean flag) - bigger
  fillRect(COLOR_PLAYER_STRIPE, x + 7, y - 27, 3, 3);

  // Front arm (normal running - only if not celebrating)
  if (!isCelebrating) {
    graphics.fillStyle(COLOR_SKIN, 1);
    if (runFrame === 0) {
      graphics.fillRect(x - 1, y - 28, 5, 10);
    } else {
      graphics.fillRect(x - 1, y - 32, 5, 12);
    }
  }

  // Head (front view)
  graphics.fillStyle(COLOR_SKIN, 1);
  graphics.fillCircle(x + 12, y - 42, 10);

  // Hair (black, front view)
  fillRect(COLOR_HAIR, x + 4, y - 52, 16, 8);
  fillRect(COLOR_HAIR, x + 6, y - 50, 12, 4);

  // Balls held
  if (ballTypesHeld.length >= 1) {
    drawSpinningBall(
      x + 22,
      y - 6,
      6,
      safeArrayGet(ballTypesHeld, 0, BALL_TYPE_CLASSIC),
      false
    );
  }
  if (ballTypesHeld.length >= 2) {
    drawSpinningBall(
      x - 4,
      y - 36,
      6,
      safeArrayGet(ballTypesHeld, 1, BALL_TYPE_CLASSIC),
      true
    );
  }
}

// ============================================================================
// SPAWNING
// ============================================================================

/**
 * Spawns a bouncing soccer ball from the right side.
 * Balls can be collected by the player for shooting.
 */
function spawnBall() {
  const type = randomElement(BALL_TYPES);

  balls.push({
    x: SPAWN_X_RIGHT,
    y: GROUND_Y - 30,
    vy: -200,
    radius: 8,
    width: 16,
    height: 16,
    type,
  });
}

/**
 * Calculate multi-spawn chance based on score breakpoints.
 */
function getMultiSpawnChance() {
  if (score >= SCORE_BP_5) {
    return MULTI_CHANCE_BP5;
  }
  if (score >= SCORE_BP_4) {
    return MULTI_CHANCE_BP4;
  }
  if (score >= SCORE_BP_3) {
    return MULTI_CHANCE_BP3;
  }
  if (score >= SCORE_BP_2) {
    return MULTI_CHANCE_BP2;
  }
  if (score >= SCORE_BP_1) {
    return MULTI_CHANCE_BP1;
  }
  return MULTI_CHANCE_BASE;
}

/**
 * Calculate maximum multi-spawn count based on score breakpoints.
 */
function getMaxMultiSpawnCount() {
  if (score >= SCORE_BP_4) {
    return MULTI_MAX_COUNT_BP4;
  }
  if (score >= SCORE_BP_1) {
    return MULTI_MAX_COUNT_BP1;
  }
  return MULTI_MAX_COUNT_BASE;
}

/**
 * Calculate flying obstacle spawn chance based on score (30% to 60%).
 */
function getFlyingSpawnChance() {
  const progress = Math.min(score / SCORE_BP_5, 1);
  return (
    FLYING_SPAWN_CHANCE_BASE +
    progress * (FLYING_SPAWN_CHANCE_MAX - FLYING_SPAWN_CHANCE_BASE)
  );
}

/**
 * Calculate dark cone chance based on score (0% at 2000, 60% at 10000).
 */
function getDarkConeChance() {
  if (score < DARK_CONE_UNLOCK) {
    return 0;
  }
  const progress = Math.min(
    (score - DARK_CONE_UNLOCK) / (SCORE_BP_5 - DARK_CONE_UNLOCK),
    1
  );
  return progress * DARK_CONE_MAX_CHANCE;
}

/**
 * Generates random appearance properties for a rival player.
 * @returns {object} Random appearance properties
 */
function getRandomPlayerAppearance() {
  return {
    skinTone: randomElement(SKIN_TONES),
    hairColor: randomElement(HAIR_COLORS),
    hairStyle: randomElement(HAIR_STYLES),
    hasMustache: Math.random() > 0.6,
    hasBeard: Math.random() > 0.8,
  };
}

/**
 * Creates a player obstacle object with given position offset.
 * Adds height variation (±5px) for realistic diversity.
 * @param {number} xOffset - X position offset from SPAWN_X_RIGHT
 * @returns {object} Player obstacle object
 */
function createPlayerObstacle(xOffset = 0) {
  const country = score > BRAZIL_SCORE_THRESHOLD ? "brazil" : "france";
  const appearance = getRandomPlayerAppearance();

  // Add height variation: ±5px around the base height
  const baseHeight =
    country === "brazil" ? PLAYER_OBS_HEIGHT_BRAZIL : PLAYER_OBS_HEIGHT_FRANCE;
  const heightVariation = Math.floor(Math.random() * 11) - 5; // -5 to +5
  const height = baseHeight + heightVariation;

  return {
    type: "player",
    country,
    x: SPAWN_X_RIGHT + xOffset,
    y: GROUND_Y,
    width: PLAYER_OBS_WIDTH,
    height,
    fallen: false,
    runFrame: Math.floor(Math.random() * 2),
    runAnimTimer: 0,
    ...appearance,
  };
}

/**
 * Creates a cone obstacle object with given position offset.
 * @param {number} xOffset - X position offset from SPAWN_X_RIGHT
 * @returns {object} Cone obstacle object
 */
function createConeObstacle(xOffset = 0) {
  const isDark = Math.random() < getDarkConeChance();
  const isPurple = Math.random() < 0.5; // 50% chance of purple
  return {
    type: "cone",
    x: SPAWN_X_RIGHT + xOffset,
    y: GROUND_Y,
    width: CONE_WIDTH,
    height: isDark ? DARK_CONE_HEIGHT : CONE_HEIGHT,
    isDark,
    isPurple,
  };
}

/**
 * Helper: Spawns multiple obstacles with spacing.
 * @param {Function} createFn - Function to create each obstacle
 * @param {number} spacing - Distance between obstacles
 * @param {number} maxCount - Maximum count to spawn
 */
function spawnMultiple(createFn, spacing, maxCount) {
  const count = 2 + Math.floor(Math.random() * (maxCount - 1));
  for (let i = 0; i < count; i++) {
    obstacles.push(createFn(i * spacing));
  }
}

/**
 * Spawns ground obstacles (cones, rivals, goals, benches).
 * Multi-obstacle spawns increase with score.
 */
function spawnGroundObstacle() {
  const multiChance = getMultiSpawnChance();
  const maxCount = getMaxMultiSpawnCount();

  // Available obstacle types: multi-player, multi-cone, cone, player, goal, bench
  const availableTypes = [];

  // Add types only if they differ from last spawned
  if (lastGroundObstacleType !== "multi-player") {
    availableTypes.push({ name: "multi-player", weight: 0.25 * multiChance });
  }
  if (lastGroundObstacleType !== "multi-cone") {
    availableTypes.push({ name: "multi-cone", weight: 0.25 * multiChance });
  }
  if (lastGroundObstacleType !== "cone") {
    availableTypes.push({ name: "cone", weight: 0.2 });
  }
  if (lastGroundObstacleType !== "player") {
    availableTypes.push({ name: "player", weight: 0.2 });
  }
  if (lastGroundObstacleType !== "goal") {
    availableTypes.push({ name: "goal", weight: 0.1 });
  }
  if (lastGroundObstacleType !== "bench") {
    availableTypes.push({ name: "bench", weight: 0.1 });
  }

  // Calculate total weight and pick random type
  const totalWeight = availableTypes.reduce((sum, t) => sum + t.weight, 0);
  let random = Math.random() * totalWeight;
  let selectedType = availableTypes[availableTypes.length - 1].name;

  for (const obstacleType of availableTypes) {
    random -= obstacleType.weight;
    if (random <= 0) {
      selectedType = obstacleType.name;
      break;
    }
  }

  // Store the selected type to avoid repeating
  lastGroundObstacleType = selectedType;

  // Spawn based on selected type
  if (selectedType === "multi-player") {
    spawnMultiple(createPlayerObstacle, MULTI_SPAWN_RIVAL_SPACING, maxCount);
  } else if (selectedType === "multi-cone") {
    spawnMultiple(createConeObstacle, MULTI_SPAWN_CONE_SPACING, maxCount);
  } else if (selectedType === "cone") {
    const obs = createConeObstacle();
    obstacles.push(obs);
  } else if (selectedType === "player") {
    const obs = createPlayerObstacle();
    obstacles.push(obs);
  } else if (selectedType === "goal") {
    obstacles.push({
      type: "goal",
      x: SPAWN_X_RIGHT,
      y: GROUND_Y,
      width: GOAL_WIDTH,
      height: GOAL_HEIGHT,
    });
  } else if (selectedType === "bench") {
    const isRed = Math.random() < 0.5; // 50% chance of red
    obstacles.push({
      type: "bench",
      x: SPAWN_X_RIGHT,
      y: GROUND_Y,
      width: BENCH_WIDTH,
      height: BENCH_HEIGHT,
      isRed,
    });
  }
}

/**
 * Spawns flying obstacles (bottles, drones).
 * Drones unlock at 1000 points.
 */
function spawnFlyingObstacle() {
  const droneUnlocked = score >= FLYING_UNLOCK_DRONES;

  if (droneUnlocked && Math.random() < 0.4) {
    // Spawn drone (40% chance when unlocked)
    obstacles.push({
      type: "drone",
      x: SPAWN_X_RIGHT,
      y: GROUND_Y - 60 - Math.random() * 20,
      width: DRONE_WIDTH,
      height: DRONE_HEIGHT,
      propellerRotation: 0,
    });
  } else {
    // Spawn beer bottle (flying high)
    obstacles.push({
      type: "bottle",
      x: SPAWN_X_RIGHT,
      y: GROUND_Y - 120 - Math.random() * 80,
      width: BOTTLE_WIDTH,
      height: BOTTLE_HEIGHT,
      rotation: 0,
    });
  }
}

// ============================================================================
// COLLISION & PHYSICS
// ============================================================================

/**
 * Fires a ball from the player's position.
 * @param {Phaser.Scene} sceneRef - Scene reference for sound playback
 */
function shootBall(sceneRef) {
  if (ballTypesHeld.length === 0) {
    return;
  }

  const ballType = getValidBallType(ballTypesHeld.shift());

  // Play powerful kick sound
  playBallShootSound(sceneRef);

  shotBalls.push({
    x: player.x + 30,
    y: player.y - 30,
    vx: SHOT_BALL_VX,
    vy: SHOT_BALL_VY,
    radius: 8,
    width: 16,
    height: 16,
    type: ballType,
  });
}

/**
 * Checks AABB collision between two game objects.
 * Handles both ground obstacles and flying obstacles (bottles, drones).
 * @param {Object} a - First object with x, y, width/radius, height
 * @param {Object} b - Second object (obstacle)
 * @returns {boolean} True if objects are colliding
 */
function checkCollision(a, b) {
  const isFlying = b.type === "bottle" || b.type === "drone";

  // For flying obstacles, y is center, so calculate top/bottom from there
  // For ground obstacles, y is bottom
  const bTop = isFlying ? b.y - b.height / 2 : b.y - b.height;
  const bBottom = isFlying ? b.y + b.height / 2 : b.y;

  const aTop = a.y - (a.height || 48);
  const aBottom = a.y;

  return (
    a.x < b.x + b.width &&
    a.x + (a.width || a.radius * 2 || 24) > b.x &&
    aBottom > bTop &&
    aTop < bBottom
  );
}

// ============================================================================
// PARTICLES & EFFECTS
// ============================================================================

/**
 * Gets the primary color for an obstacle type.
 * @param {object} obs - The obstacle object
 * @returns {number} Hex color value
 */
function getObstacleColor(obs) {
  if (obs.type === "player") {
    return obs.country === "brazil" ? COLOR_BRAZIL_JERSEY : COLOR_FRANCE_JERSEY;
  } else if (obs.type === "cone") {
    if (obs.isDark) {
      return COLOR_DARK_CONE;
    }
    return obs.isPurple ? COLOR_CONE_YELLOW : COLOR_CONE_ORANGE;
  } else if (obs.type === "bench") {
    return obs.isRed ? COLOR_BENCH_SEAT_BLACK : COLOR_BENCH_SEAT_BLUE;
  } else if (obs.type === "goal") {
    return COLOR_GOAL_POST;
  } else if (obs.type === "drone") {
    return COLOR_DRONE_BODY;
  } else if (obs.type === "bottle") {
    return COLOR_BOTTLE_GREEN;
  }
  return COLOR_CONE_ORANGE; // default
}

/**
 * Generates color variations from a base color for explosion particles.
 * @param {number} baseColor - Base hex color
 * @returns {number[]} Array of color variations
 */
function getColorVariations(baseColor) {
  const r = (baseColor >> 16) & 0xff;
  const g = (baseColor >> 8) & 0xff;
  const b = baseColor & 0xff;

  return [
    baseColor,
    // Lighter
    (Math.min(255, r + 40) << 16) |
      (Math.min(255, g + 40) << 8) |
      Math.min(255, b + 40),
    // Darker
    (Math.max(0, r - 40) << 16) |
      (Math.max(0, g - 40) << 8) |
      Math.max(0, b - 40),
    // White highlight
    0xffffff,
  ];
}

/**
 * Creates explosion particles when obstacles are destroyed.
 * @param {number} x - X coordinate of explosion center
 * @param {number} y - Y coordinate of explosion center
 * @param {number} baseColor - Base color for the explosion (default: orange)
 */
function createExplosion(x, y, baseColor = COLOR_CONE_ORANGE) {
  const colors = getColorVariations(baseColor);

  for (let i = 0; i < EXPLOSION_PARTICLE_COUNT; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 100 + Math.random() * 200;
    particles.push({
      type: "explosion",
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 100,
      size: 3 + Math.random() * 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: 0.5 + Math.random() * 0.5,
      maxLife: 0.5 + Math.random() * 0.5,
      alpha: 1,
    });
  }
}

/**
 * Creates confetti particles for celebration effects.
 * Spawns from crowd area and floats down slowly.
 */
function createConfetti() {
  for (let i = 0; i < CONFETTI_PARTICLE_COUNT; i++) {
    particles.push({
      type: "confetti",
      x: Math.random() * GAME_WIDTH,
      y: CROWD_START_Y + Math.random() * 120,
      vx: 0,
      vy: 80,
      rotation: Math.random() * Math.PI * 2,
      color:
        CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      life: 4 + Math.random() * 2,
      alpha: 1,
    });
  }
}

/**
 * Creates fireworks particles for goal celebration.
 * Multiple bursts across the top of the screen.
 * Predominantly red, white, and blue (Chilean colors).
 */
function createFireworks() {
  // Chilean flag colors - predominant in fireworks
  const fireworkColors = [
    0xff0000,
    0xff0000,
    0xff0000, // Red (40%)
    0xffffff,
    0xffffff,
    0xffffff, // White (40%)
    0x0000ff,
    0x0000ff, // Blue (20%)
    0xffd700,
    0xff8800, // Gold and orange accents
  ];

  // Create 3 firework bursts at different positions
  const positions = [
    { x: 200, y: 150 },
    { x: 400, y: 100 },
    { x: 600, y: 150 },
  ];

  positions.forEach((pos) => {
    // Each firework has 25 particles for more spectacular effect
    for (let i = 0; i < 25; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 100 + Math.random() * 150;
      particles.push({
        type: "firework",
        x: pos.x,
        y: pos.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 3 + Math.random() * 3,
        color:
          fireworkColors[Math.floor(Math.random() * fireworkColors.length)],
        life: 1.5 + Math.random() * 0.5,
        maxLife: 1.5 + Math.random() * 0.5,
        alpha: 1,
      });
    }
  });
}

// ============================================================================
// GAME OVER & RESTART
// ============================================================================

/**
 * Ends the game and triggers game over sequence.
 * @param {Phaser.Scene} scene - Scene reference for effects
 */
function endGame(sceneRef) {
  gameOver = true;

  if (score > sessionBest) {
    sessionBest = score;
  }

  // Save high score if current score beats it
  if (score > highScore) {
    highScore = score;
    saveHighScore();
  }

  timeScale = 0.3;
  slowMoTimer = 0.5;
  cameraShake = 8;
  createExplosion(player.x + 12, player.y - 20, COLOR_PLAYER_JERSEY);

  playGameOverSound(sceneRef);

  // Schedule game over UI to show after 500ms
  gameOverDelayTimer = 0.5;
}

/**
 * Displays game over UI (called after end game delay).
 * @param {Phaser.Scene} scene - Scene reference
 */
function drawGameOverUI() {
  // Different messages based on score
  let title = "GAME OVER";
  let message = "TRY AGAIN";

  if (score >= 5000) {
    title = "LEGENDARY";
    message = "HALL OF FAME";
  } else if (score >= 3000) {
    title = "AMAZING";
    message = "TOP SCORER";
  } else if (score >= 2000) {
    title = "GREAT JOB";
    message = "KEEP GOING";
  } else if (score >= 1000) {
    title = "NICE RUN";
    message = "GETTING BETTER";
  } else if (score >= 500) {
    title = "NOT BAD";
    message = "KEEP PRACTICING";
  }

  // Semi-transparent black overlay
  graphics.fillStyle(0x000000, 0.75);
  graphics.fillRect(0, 0, 800, 600);

  // Title (centered, smaller, lower - above billboards) - always light blue
  // Possible titles: "GAME OVER", "LEGENDARY", "AMAZING", "GREAT JOB", "NICE RUN", "NOT BAD"
  drawCenteredPixelText(title, 90, 0x00bfff, 4.5);

  // Message (centered, medium) - always red
  drawCenteredPixelText(message, 235, 0xff0000, 2);

  // Score display (centered, lower)
  const scoreStr = String(score).padStart(5, "0");
  const scoreLabel = `SCORE ${scoreStr}`;
  drawCenteredPixelText(scoreLabel, 355, 0xffffff, 3);

  // Best score indicator (lower) - red
  if (score >= sessionBest && score > 0) {
    drawCenteredPixelText("NEW BEST", 420, 0xff0000, 2);
  }

  // Restart instruction (centered)
  drawCenteredPixelText("PRESS ANY ARROW KEY TO START", 500, 0xffff00, 1.5);
}

// ============================================================================
// START SCREEN
// ============================================================================

/**
 * Draw the start screen with title, instructions, and conditional high score
 */
function drawStartScreen() {
  // No overlay - show the game in background

  // Subtitle (centered, blue)
  drawCenteredPixelText(
    "GRAB BALLS DODGE RIVALS SCORE GOALS",
    250,
    0x0000ff,
    1.5
  );

  // GOLEADOR title with football-style letters (centered, bigger)
  const goleadorScale = 2.8;
  const goleadorWidth = 8 * 18 * goleadorScale; // 8 letters, 18 pixels each
  const goleadorX = (800 - goleadorWidth) / 2;
  const goleadorY = 310;

  const letters = [
    LETTER_G,
    LETTER_O,
    LETTER_L,
    LETTER_E,
    LETTER_A,
    LETTER_D,
    LETTER_O,
    LETTER_R,
  ];
  let offsetX = goleadorX;

  letters.forEach((letter) => {
    drawFootballLetter(offsetX, goleadorY, letter, goleadorScale);
    offsetX += 18 * goleadorScale;
  });

  // High score display (centered)
  const scoreStr = String(highScore).padStart(5, "0");
  const scoreLabel = `HIGH SCORE ${scoreStr}`;
  drawCenteredPixelText(scoreLabel, 400, 0xffffff, 2);

  // Restart instruction (centered)
  drawCenteredPixelText("PRESS ANY ARROW KEY TO START", 500, 0xffff00, 1.5);
}

// ============================================================================
// HIGH SCORE PERSISTENCE
// ============================================================================

/**
 * Load high score from localStorage
 */
function loadHighScore() {
  try {
    const saved = localStorage.getItem("goleador-high-score");
    if (saved) {
      highScore = parseInt(saved, 10) || 0;
    }
  } catch {
    // localStorage not available or blocked
    highScore = 0;
  }
}

/**
 * Save high score to localStorage
 */
function saveHighScore() {
  try {
    localStorage.setItem("goleador-high-score", highScore.toString());
  } catch {
    // localStorage not available or blocked - silent fail
  }
}

/**
 * Comprehensive game state reset function.
 * Resets ALL mutable game variables to their initial state.
 * Called by restartGame() to ensure clean slate.
 */
function resetGameState() {
  // === CORE GAME STATE ===
  gameStarted = true; // Start the game immediately
  gameOver = false;
  score = 0;
  gameSpeed = baseSpeed;
  speedIncrement = 0;
  gameTime = 0;

  // === PLAYER STATE ===
  player.x = 150;
  player.y = GROUND_Y;
  player.vx = 0;
  player.vy = 0;
  player.onGround = true;

  // === PLAYER INVENTORY ===
  ballTypesHeld = [BALL_TYPE_CLASSIC]; // Start with one ball to teach mechanic

  // === PLAYER ACTION FLAGS ===
  isKicking = false;
  kickTimer = 0;
  isCelebrating = false;
  celebrationTimer = 0;
  isSliding = false;
  slideTimer = 0;
  slideGaveCard = false;
  isTricking = false;
  trickTimer = 0;
  currentTrick = 0;

  // === PLAYER ANIMATION ===
  runFrame = 0;
  runAnimTimer = 0;

  // === CARD SYSTEM ===
  yellowCards = 0;
  cardMessage = "";
  cardMessageTimer = 0;
  cardAppearTime = 0;
  isCardAnimation = false;
  cardAnimationTimer = 0;
  redCardTimer = 0;

  // === GAME OBJECTS (Clear all arrays) ===
  balls.length = 0;
  obstacles.length = 0;
  shotBalls.length = 0;
  particles.length = 0;
  clouds.length = 0;
  ballRotation = 0;

  // === BACKGROUND ===
  bgOffset = 0;
  billboardOffset = 0;
  // Repopulate clouds for smooth start
  for (let i = 0; i < 5; i++) {
    clouds.push({
      x: Math.random() * GAME_WIDTH,
      y: 200 + Math.random() * 150,
      size: 20 + Math.random() * 30,
    });
  }

  // === EFFECTS ===
  cameraShake = 0;
  slowMoTimer = 0;
  timeScale = 1;
  scoreFlashTimer = 0;
  milestoneMessage = "";
  milestoneTimer = 0;
  lastMilestone = 0;
  goalMessage = "";
  goalTimer = 0;
  highScoreMessage = "";
  highScoreTimer = 0;
  crowdCheerTimer = 0;
  isNewBest = false;
  confettiTimer = 0;
  confettiDuration = 0;

  // === SPAWN TIMERS ===
  ballSpawnTimer = 0;
  obstacleSpawnTimer = 2.0; // Instant first obstacle spawn
  flyingObstacleSpawnTimer = 0;
  gameOverDelayTimer = 0;
  lastObstacleDistance = 500; // Instant first obstacle spawn
  lastGroundObstacleType = null; // Track last spawned ground obstacle
}

/**
 * Resets all game state and restarts the scene.
 */
function restartGame() {
  resetGameState(); // Reset all state variables
  scene.scene.restart(); // Restart Phaser scene
}

// ============================================================================
// SOUND
// ============================================================================

/**
 * Creates and connects an oscillator with gain node.
 * @param {AudioContext} audioContext - Web Audio context
 * @param {string} type - Oscillator type ('square', 'sawtooth', etc)
 * @returns {Object} Object with oscillator and gainNode
 */
function createOscillator(audioContext, type = "square") {
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  oscillator.type = type;

  return { oscillator, gainNode };
}

/**
 * Initializes and plays looping bossa nova background music.
 * Original bossa-style groove with drums and guitar comping.
 * @param {Phaser.Scene} scene - Scene with audio context
 */
function startBackgroundMusic(sceneRef) {
  const ac = sceneRef.sound.context;
  const bpm = 132;
  let step = 0;
  let nextTime = 0;
  const humanize = true;

  // Master + light bus comp
  const master = ac.createGain();
  master.gain.value = 0.12; // Very low volume for background
  const comp = ac.createDynamicsCompressor();
  comp.threshold.value = -20;
  comp.ratio.value = 2.5;
  comp.attack.value = 0.005;
  comp.release.value = 0.2;
  master.connect(comp).connect(ac.destination);

  // Utility functions
  function sixteenth() {
    return 60 / bpm / 4;
  }
  function human(t, amt = 0.006) {
    return humanize ? t + (Math.random() * 2 - 1) * amt : t;
  }
  function midiToFreq(m) {
    return 440 * Math.pow(2, (m - 69) / 12);
  }
  function noise(secs) {
    const len = Math.max(1, Math.floor(ac.sampleRate * secs));
    const buf = ac.createBuffer(1, len, ac.sampleRate);
    const ch = buf.getChannelData(0);
    for (let i = 0; i < len; i++) {
      ch[i] = Math.random() * 2 - 1;
    }
    const src = ac.createBufferSource();
    src.buffer = buf;
    return src;
  }

  // Drums
  function kick(time, lvl = 0.8) {
    const o = ac.createOscillator();
    o.type = "sine";
    const g = ac.createGain();
    o.frequency.setValueAtTime(80, time);
    o.frequency.exponentialRampToValueAtTime(50, time + 0.08);
    g.gain.setValueAtTime(0.0001, time);
    g.gain.exponentialRampToValueAtTime(lvl, time + 0.003);
    g.gain.exponentialRampToValueAtTime(0.0001, time + 0.18);
    o.connect(g).connect(master);
    const n = noise(0.02);
    const hp = ac.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = 1600;
    const ng = ac.createGain();
    ng.gain.value = 0.06 * lvl;
    n.connect(hp).connect(ng).connect(master);
    o.start(time);
    o.stop(time + 0.2);
    n.start(time);
    n.stop(time + 0.03);
  }
  function rim(time, lvl = 0.45) {
    const n = noise(0.05);
    const bp = ac.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = 2500;
    bp.Q.value = 2;
    const g = ac.createGain();
    g.gain.setValueAtTime(0.0001, time);
    g.gain.exponentialRampToValueAtTime(lvl, time + 0.002);
    g.gain.exponentialRampToValueAtTime(0.0001, time + 0.05);
    n.connect(bp).connect(g).connect(master);
    n.start(time);
    n.stop(time + 0.05);
  }
  function hat(time, lvl = 0.28) {
    const n = noise(0.03);
    const hp = ac.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = 6000;
    const g = ac.createGain();
    g.gain.setValueAtTime(0.0001, time);
    g.gain.exponentialRampToValueAtTime(lvl, time + 0.002);
    g.gain.exponentialRampToValueAtTime(0.0001, time + 0.03);
    n.connect(hp).connect(g).connect(master);
    n.start(time);
    n.stop(time + 0.035);
  }

  // Guitar (nylon-ish pluck)
  function pluck(time, midi = 60, lvl = 0.5) {
    const freq = midiToFreq(midi);
    const osc = [0, 1, 2].map((i) => {
      const o = ac.createOscillator();
      o.type = i === 0 ? "triangle" : "sine";
      let ratio = 1;
      if (i === 1) {
        ratio = 2;
      } else if (i === 2) {
        ratio = 3;
      }
      o.frequency.setValueAtTime(freq * ratio, time);
      return o;
    });
    const g = ac.createGain();
    const lp = ac.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 3200;
    lp.Q.value = 0.0001;
    g.gain.setValueAtTime(0.0001, time);
    g.gain.exponentialRampToValueAtTime(0.9 * lvl, time + 0.006);
    g.gain.exponentialRampToValueAtTime(0.0001, time + 0.9);
    osc.forEach((o) => o.connect(lp));
    lp.connect(g).connect(master);
    osc.forEach((o) => {
      o.start(time);
      o.stop(time + 1.0);
    });
  }
  function strum(time, notes, lvl = 0.35, spread = 0.018) {
    notes.forEach((m, i) => pluck(time + i * spread, m, lvl));
  }

  // Chord progression (original), 1 chord per bar (1 bar = 16 steps)
  const progression = [
    { name: "Cmaj9", notes: [48, 55, 60, 64, 71] },
    { name: "D7#11", notes: [50, 57, 62, 66, 73] },
    { name: "Gmaj9", notes: [43, 50, 55, 59, 66] },
    { name: "E7b9", notes: [40, 47, 52, 56, 63] },
    { name: "Am9", notes: [45, 52, 57, 60, 67] },
    { name: "D7b9", notes: [50, 57, 60, 63, 69] },
    { name: "Gmaj9", notes: [43, 50, 55, 59, 66] },
    { name: "Gmaj9", notes: [43, 50, 55, 59, 66] },
    { name: "F#ø7", notes: [42, 54, 57, 60, 66] },
    { name: "B7alt", notes: [47, 54, 58, 61, 65] },
    { name: "Em9", notes: [40, 52, 55, 59, 66] },
    { name: "A7#11", notes: [45, 57, 61, 64, 71] },
    { name: "Dmaj9", notes: [38, 50, 54, 57, 64] },
    { name: "G13", notes: [43, 53, 57, 60, 65] },
    { name: "Cmaj9", notes: [48, 55, 60, 64, 71] },
    { name: "Fmaj9", notes: [53, 60, 65, 69, 76] },
  ];

  // Scheduler
  function scheduler() {
    if (gameOver) {
      return;
    }
    const now = ac.currentTime;
    const lookahead = 0.12;
    while (nextTime < now + lookahead) {
      const s = step % 16;
      const barLen = 16;
      const barIndex = Math.floor(step / barLen) % progression.length;
      const chord = progression[barIndex];

      // Drums: bossa pattern — kick on 1 & 3, rim syncopation, hats eighths
      if (s % 2 === 0) {
        hat(human(nextTime, 0.003), 0.26);
      }
      if (s === 0) {
        kick(human(nextTime, 0.004), 0.9);
      }
      if (s === 7) {
        kick(human(nextTime, 0.004), 0.35);
      }
      if (s === 8) {
        kick(human(nextTime, 0.004), 0.7);
      }
      if ([4, 7, 12, 15].includes(s)) {
        rim(human(nextTime, 0.002), 0.5);
      }

      // Guitar comping: bass on beats 1 & 3, chord pops on the "and" of 2 and 4
      if (s === 0) {
        pluck(human(nextTime, 0.004), chord.notes[0], 0.55);
      }
      if (s === 8) {
        pluck(human(nextTime, 0.004), chord.notes[0], 0.48);
      }
      if (s === 6) {
        strum(human(nextTime, 0.004), chord.notes.slice(1), 0.32, 0.012);
      }
      if (s === 14) {
        strum(human(nextTime, 0.004), chord.notes.slice(1), 0.34, 0.01);
      }

      // Advance transport
      const base = sixteenth();
      nextTime += Math.max(0.0005, base);
      step = (step + 1) % (progression.length * 16);
    }
    scene.time.delayedCall(20, scheduler);
  }

  nextTime = ac.currentTime + 0.08;
  scheduler();
}

/**
 * Helper: Plays white noise crowd effect.
 */
function playCrowdNoise(ctx, dur, vol, filterFreq = 1000) {
  const bufSize = ctx.sampleRate * dur;
  const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < bufSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  const noise = ctx.createBufferSource();
  noise.buffer = buf;
  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = filterFreq;
  filter.Q.value = 2;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(vol, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + dur);
  noise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  noise.start(ctx.currentTime);
  noise.stop(ctx.currentTime + dur);
}

/**
 * Helper: Plays layered multi-oscillator tone for richer sounds.
 * @param {AudioContext} ctx - Audio context
 * @param {Array} layers - Array of {freq, vol, type, dur} objects
 * @param {number} attack - Attack time in seconds
 */
function playLayeredTone(ctx, layers, attack = 0.005) {
  const now = ctx.currentTime;
  layers.forEach((layer) => {
    const { oscillator: osc, gainNode: gain } = createOscillator(
      ctx,
      layer.type || "sine"
    );
    osc.frequency.value = layer.freq;
    if (layer.freqRamp) {
      osc.frequency.exponentialRampToValueAtTime(
        layer.freqRamp,
        now + layer.dur * 0.7
      );
    }
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.exponentialRampToValueAtTime(layer.vol, now + attack);
    gain.gain.exponentialRampToValueAtTime(0.01, now + layer.dur);
    osc.start(now);
    osc.stop(now + layer.dur);
  });
}

/**
 * Helper: Adds noise layer (for transients, texture, whooshes).
 * @param {AudioContext} ctx - Audio context
 * @param {number} dur - Duration in seconds
 * @param {number} vol - Volume
 * @param {string} filterType - 'highpass', 'lowpass', 'bandpass'
 * @param {number} filterFreq - Filter frequency
 * @param {number} freqSweep - Optional frequency sweep target
 */
function playNoiseLayer(
  ctx,
  dur,
  vol,
  filterType = "highpass",
  filterFreq = 2000,
  freqSweep = null
) {
  const now = ctx.currentTime;
  const bufSize = Math.max(ctx.sampleRate * dur, 1);
  const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < bufSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  const noise = ctx.createBufferSource();
  noise.buffer = buf;
  const filter = ctx.createBiquadFilter();
  filter.type = filterType;
  filter.frequency.value = filterFreq;
  if (freqSweep) {
    filter.frequency.exponentialRampToValueAtTime(freqSweep, now + dur);
  }
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(vol, now);
  gain.gain.exponentialRampToValueAtTime(0.01, now + dur);
  noise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  noise.start(now);
  noise.stop(now + dur);
}

/**
 * Plays a simple beep tone using Web Audio API.
 * @param {Phaser.Scene} scene - Scene with audio context
 * @param {number} frequency - Tone frequency in Hz
 * @param {number} duration - Duration in seconds
 */
/**
 * BALL COLLECTION - Rewarding "pling"! 2-tone ascending with sparkle.
 */
function playBallCollectionSound(sceneRef) {
  const ctx = sceneRef.sound.context;

  // 2-tone ascending "pling" (600Hz → 900Hz)
  playLayeredTone(ctx, [
    { freq: 600, vol: 0.12, type: "sine", dur: 0.08, freqRamp: 900 },
    { freq: 1200, vol: 0.08, type: "sine", dur: 0.06 }, // Harmonic sparkle
    { freq: 1800, vol: 0.05, type: "sine", dur: 0.05 }, // High sparkle
  ]);
}

/**
 * MILESTONE REACHED - Achievement! 3-note fanfare snippet.
 */
function playMilestoneSound(sceneRef) {
  const ctx = sceneRef.sound.context;
  const notes = [
    { freq: 1047, time: 0 }, // C6
    { freq: 1319, time: 0.08 }, // E6
    { freq: 1568, time: 0.16 }, // G6
  ];

  notes.forEach((note) => {
    setTimeout(() => {
      playLayeredTone(ctx, [
        { freq: note.freq, vol: 0.14, type: "square", dur: 0.12 },
        { freq: note.freq * 0.5, vol: 0.08, type: "sine", dur: 0.15 }, // Sub octave
      ]);
    }, note.time * 1000);
  });
}

/**
 * Plays crowd cheer sound effect using white noise.
 * Used when hitting obstacles or scoring goals.
 * @param {Phaser.Scene} scene - Scene with audio context
 */
function playCrowdCheer(sceneRef) {
  playCrowdNoise(sceneRef.sound.context, 0.3, 0.15);
}

/**
 * BALL SHOOT - Powerful kick sound! Power, release, "take that!"
 * Layered impact: low thump + mid whack + high whoosh
 */
function playBallShootSound(sceneRef) {
  const ctx = sceneRef.sound.context;

  // 1. Low thump (100Hz, 0.08s) - the impact
  const layers = [
    { freq: 100, vol: 0.15, type: "triangle", dur: 0.08 },
    // 2. Mid "whack" (400Hz, 0.1s) - the contact
    { freq: 400, vol: 0.12, type: "square", dur: 0.1 },
  ];
  playLayeredTone(ctx, layers, 0.003); // Very fast attack for impact

  // 3. High "whoosh" - ball cutting through air
  playNoiseLayer(ctx, 0.15, 0.08, "highpass", 2000, 500);
}

/**
 * GAME OVER - Dramatic defeat! "So close..." Descending tragedy notes.
 */
function playGameOverSound(sceneRef) {
  const ctx = sceneRef.sound.context;
  const notes = [
    { freq: 440, time: 0 }, // A2
    { freq: 349, time: 0.3 }, // F2
    { freq: 262, time: 0.6 }, // C2
  ];

  notes.forEach((note) => {
    setTimeout(() => {
      playLayeredTone(ctx, [
        { freq: note.freq, vol: 0.2, type: "triangle", dur: 0.4 },
        { freq: note.freq * 0.5, vol: 0.15, type: "sine", dur: 0.5 }, // Sub bass
      ]);
    }, note.time * 1000);
  });

  // Stadium "aww" disappointment (delay 0.4s)
  setTimeout(() => {
    playCrowdNoise(ctx, 0.8, 0.15, 400); // Low frequency = disappointment
  }, 400);
}

/**
 * SLIDE TACKLE - Aggressive, risky! Layered impact: thud + scrape + whoosh.
 */
function playSlideSound(sceneRef) {
  const ctx = sceneRef.sound.context;

  // 1. Low thud (80Hz triangle, 0.15s)
  // 2. Mid scrape (200→150Hz sawtooth, 0.25s)
  playLayeredTone(ctx, [
    { freq: 80, vol: 0.15, type: "triangle", dur: 0.15 },
    { freq: 200, vol: 0.12, type: "sawtooth", dur: 0.25, freqRamp: 150 },
  ]);

  // 3. High whoosh (noise sweep from 2000→500Hz)
  playNoiseLayer(ctx, 0.25, 0.1, "highpass", 2000, 500);
}

/**
 * TRICK MOVE - Skillful, flashy! "Style points" swoosh with elasticity.
 */
function playTrickSound(sceneRef) {
  const ctx = sceneRef.sound.context;

  // Swoosh with harmonics and pitch bend
  playLayeredTone(ctx, [
    { freq: 800, vol: 0.14, type: "sine", dur: 0.22, freqRamp: 400 },
    { freq: 1600, vol: 0.08, type: "sine", dur: 0.2, freqRamp: 800 }, // 2nd harmonic
  ]);

  // Quick noise burst for "air cut"
  playNoiseLayer(ctx, 0.05, 0.08, "highpass", 3000);
}

/**
 * YELLOW CARD WHISTLE - Authentic referee! Authority, warning, "watch it!"
 * Reduced from annoying 0.6s to crisp 0.4s with proper tone.
 */
function playWhistleSound(sceneRef) {
  const ctx = sceneRef.sound.context;
  const now = ctx.currentTime;

  // Authentic referee whistle (2800Hz base, not harsh 3000Hz)
  // Quick warble pattern: up-down-up (more realistic)
  const { oscillator: w, gainNode: g } = createOscillator(ctx, "sine");
  w.frequency.setValueAtTime(2800, now);
  w.frequency.linearRampToValueAtTime(3100, now + 0.12); // Up
  w.frequency.linearRampToValueAtTime(2700, now + 0.24); // Down
  w.frequency.linearRampToValueAtTime(2900, now + 0.36); // Up slightly

  // Reduced volume from annoying 0.3 to assertive 0.22
  g.gain.setValueAtTime(0.22, now);
  g.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

  w.start(now);
  w.stop(now + 0.4);

  // Add breath noise for realism
  playNoiseLayer(ctx, 0.4, 0.04, "highpass", 4000);
}

/**
 * Plays obstacle-specific hit sound based on obstacle type.
 * @param {Phaser.Scene} scene - Scene with audio context
 * @param {object} obs - The obstacle that was hit
 */
/**
 * OBSTACLE HITS - Each obstacle has unique personality!
 * Gives audio feedback that matches the visual/physical properties of each obstacle.
 */
function playHitSound(sceneRef, obs) {
  const ctx = sceneRef.sound.context;

  if (obs.type === "cone") {
    // CONE: Plastic, bouncy - "bonk" + rattle
    if (obs.isDark) {
      // Dark cone: Heavy, ominous thunk + reverb tail
      playLayeredTone(ctx, [
        { freq: 300, vol: 0.15, type: "triangle", dur: 0.15 },
        { freq: 150, vol: 0.1, type: "sine", dur: 0.25 }, // Reverb tail
      ]);
    } else {
      // Regular cone: Plastic bonk + multi-oscillator rattle
      playLayeredTone(ctx, [
        { freq: 400, vol: 0.15, type: "square", dur: 0.12 },
        { freq: 800, vol: 0.08, type: "square", dur: 0.08 }, // Harmonic rattle
      ]);
    }
  } else if (obs.type === "player") {
    // PLAYER: Human collision - grunt (formant) + "oof" noise
    playLayeredTone(ctx, [
      { freq: 250, vol: 0.15, type: "sawtooth", dur: 0.18 },
      { freq: 180, vol: 0.1, type: "triangle", dur: 0.2 }, // Body impact
    ]);
    playNoiseLayer(ctx, 0.08, 0.06, "bandpass", 600); // Breath/grunt
  } else if (obs.type === "bench") {
    // BENCH: Metal + wood crash with metallic ring
    playLayeredTone(ctx, [
      { freq: 180, vol: 0.18, type: "triangle", dur: 0.2 }, // Wood thud
      { freq: 1200, vol: 0.12, type: "sine", dur: 0.35, freqRamp: 1100 }, // Metal ring decay
    ]);
    playNoiseLayer(ctx, 0.05, 0.1, "highpass", 2000); // Metal crash transient
  } else if (obs.type === "goal") {
    // GOAL: Hollow metal post - "clang" + long bell-like ring
    playLayeredTone(ctx, [
      { freq: 500, vol: 0.18, type: "square", dur: 0.1 }, // Initial impact
      { freq: 520, vol: 0.1, type: "sine", dur: 0.45, freqRamp: 490 }, // Bell ring
      { freq: 1040, vol: 0.06, type: "sine", dur: 0.4 }, // Harmonic
    ]);
  } else if (obs.type === "drone") {
    // DRONE: High-tech zap + electric crackle
    playLayeredTone(ctx, [
      { freq: 650, vol: 0.18, type: "sawtooth", dur: 0.08 },
      { freq: 1300, vol: 0.1, type: "square", dur: 0.06 }, // Electric overtone
    ]);
    playNoiseLayer(ctx, 0.06, 0.08, "highpass", 4000); // Electric crackle
  } else if (obs.type === "bottle") {
    // BOTTLE: Light hollow plastic - "tink" + flutter
    playLayeredTone(ctx, [
      { freq: 800, vol: 0.15, type: "square", dur: 0.15 },
      { freq: 1600, vol: 0.08, type: "sine", dur: 0.12, freqRamp: 1400 }, // Harmonic flutter
    ]);
  }

  // Add attack transient (5ms noise burst) for ALL impacts
  playNoiseLayer(ctx, 0.005, 0.12, "highpass", 3000);

  // Add quiet crowd reaction for variety
  if (Math.random() > 0.5) {
    playCrowdNoise(ctx, 0.15, 0.05);
  }
}

/**
 * HIGH SCORE CELEBRATION - Personal triumph! "I'M THE BEST"
 * Enhanced fanfare with octave doubling, arpeggio, crowd, and power-up sweep.
 * @param {Phaser.Scene} scene - Scene with audio context
 */
function playCelebrationSound(sceneRef) {
  const ctx = sceneRef.sound.context;

  // Triumphant ascending notes: C - E - G - C (octave up)
  const notes = [
    { freq: 523.25, time: 0, duration: 0.15 }, // C5
    { freq: 659.25, time: 0.12, duration: 0.15 }, // E5
    { freq: 783.99, time: 0.24, duration: 0.15 }, // G5
    { freq: 1046.5, time: 0.36, duration: 0.4 }, // C6 (longer)
  ];

  notes.forEach((note) => {
    setTimeout(() => {
      // Main note + octave doubling (sub + high)
      playLayeredTone(ctx, [
        { freq: note.freq, vol: 0.16, type: "square", dur: note.duration },
        { freq: note.freq * 0.5, vol: 0.1, type: "sine", dur: note.duration }, // Sub octave
        {
          freq: note.freq * 2,
          vol: 0.08,
          type: "sine",
          dur: note.duration * 0.8,
        }, // High octave
      ]);
    }, note.time * 1000);
  });

  // Arpeggio ornament on final note (0.5s delay)
  setTimeout(() => {
    [1046.5, 1319, 1568].forEach((freq, i) => {
      setTimeout(() => {
        playLayeredTone(ctx, [{ freq, vol: 0.1, type: "sine", dur: 0.08 }]);
      }, i * 40);
    });
  }, 500);

  // Subtle crowd cheer underneath
  setTimeout(() => {
    playCrowdNoise(ctx, 0.5, 0.08);
  }, 100);

  // "Power-up" sweep (400→1200Hz) during fanfare
  playLayeredTone(ctx, [
    { freq: 400, vol: 0.08, type: "sine", dur: 0.6, freqRamp: 1200 },
  ]);
}

/**
 * Plays crowd roar sound when scoring a goal.
 * White noise burst simulating crowd excitement.
 * @param {Phaser.Scene} scene - Scene with audio context
 */
/**
 * GOAL SCORED - The climax moment! Euphoria, victory, crowd goes wild!
 * Layered epic sound: crowd roar + samba whistle + rhythm claps
 */
function playGoalSound(sceneRef) {
  const ctx = sceneRef.sound.context;

  // 1. Massive crowd roar (2.0s, bandpass 800Hz)
  playCrowdNoise(ctx, 2.0, 0.28, 800);

  // 2. Samba whistle celebration (2800→3200→2800Hz warble)
  const whistleLayers = [
    { freq: 2800, vol: 0.15, type: "sine", dur: 0.5, freqRamp: 3200 },
  ];
  playLayeredTone(ctx, whistleLayers, 0.01);

  // Add second whistle warble down
  setTimeout(() => {
    const { oscillator: w2, gainNode: g2 } = createOscillator(ctx, "sine");
    w2.frequency.value = 3200;
    w2.frequency.exponentialRampToValueAtTime(2800, ctx.currentTime + 0.3);
    g2.gain.setValueAtTime(0.15, ctx.currentTime);
    g2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    w2.start(ctx.currentTime);
    w2.stop(ctx.currentTime + 0.3);
  }, 300);

  // 3. Stadium rhythm claps (4 hits: boom-boom-BOOM-BOOM)
  [0.6, 0.9, 1.2, 1.5].forEach((time, i) => {
    const vol = i >= 2 ? 0.12 : 0.08; // Last 2 hits louder
    setTimeout(() => {
      // Clap = noise burst (50ms)
      playNoiseLayer(ctx, 0.05, vol, "bandpass", 1200);
      // Add low thump for body
      const { oscillator: thump, gainNode: tg } = createOscillator(
        ctx,
        "triangle"
      );
      thump.frequency.value = 120;
      tg.gain.setValueAtTime(vol * 0.6, ctx.currentTime);
      tg.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
      thump.start(ctx.currentTime);
      thump.stop(ctx.currentTime + 0.08);
    }, time * 1000);
  });

  // 4. Victory "power-up" sweep (adds excitement)
  setTimeout(() => {
    const { oscillator: sweep, gainNode: sg } = createOscillator(ctx, "sine");
    sweep.frequency.value = 400;
    sweep.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.4);
    sg.gain.setValueAtTime(0.08, ctx.currentTime);
    sg.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
    sweep.start(ctx.currentTime);
    sweep.stop(ctx.currentTime + 0.4);
  }, 200);
}
