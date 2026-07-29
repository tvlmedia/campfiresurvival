"use strict";

const RESOURCE_LABELS = {
  wood: "Hout",
  fish: "Vis",
  water: "Water",
};

const CARD_DEFINITIONS = [
  {
    key: "wood",
    name: "Hout",
    type: "resource",
    subtype: "wood",
    quantity: 8,
    icon: "🪵",
    description: "Grondstof. Aan het einde standaard 1 punt waard.",
  },
  {
    key: "fish",
    name: "Vis",
    type: "resource",
    subtype: "fish",
    quantity: 8,
    icon: "🐟",
    description: "Grondstof. Aan het einde standaard 1 punt waard.",
  },
  {
    key: "water",
    name: "Water",
    type: "resource",
    subtype: "water",
    quantity: 8,
    icon: "💧",
    description: "Grondstof. Aan het einde standaard 1 punt waard.",
  },
  {
    key: "bear",
    name: "Beer",
    type: "danger",
    subtype: "bear",
    quantity: 2,
    icon: "🐻",
    description: "Ramp. Aan het einde verlies je 2 Vis, tenzij Hengel beschermt.",
  },
  {
    key: "fire",
    name: "Bosbrand",
    type: "danger",
    subtype: "fire",
    quantity: 2,
    icon: "🔥",
    description: "Ramp. Aan het einde verlies je 2 Hout, tenzij Bijl beschermt.",
  },
  {
    key: "drought",
    name: "Droogte",
    type: "danger",
    subtype: "drought",
    quantity: 2,
    icon: "☀️",
    description: "Ramp. Aan het einde verlies je 2 Water, tenzij Regenbui beschermt.",
  },
  {
    key: "leak",
    name: "Kano lek",
    type: "danger",
    subtype: "leak",
    quantity: 2,
    icon: "🛶",
    description: "Ramp. Aan het einde verlies je 1 resource uit je grootste voorraad.",
  },
  {
    key: "axe",
    name: "Bijl",
    type: "advantage",
    subtype: "axe",
    quantity: 2,
    icon: "🪓",
    description: "Voordeel. Beschermt tegen één Bosbrand.",
  },
  {
    key: "rod",
    name: "Hengel",
    type: "advantage",
    subtype: "rod",
    quantity: 2,
    icon: "🎣",
    description: "Voordeel. Beschermt tegen één Beer.",
  },
  {
    key: "rain",
    name: "Regenbui",
    type: "advantage",
    subtype: "rain",
    quantity: 2,
    icon: "🌧️",
    description: "Voordeel. Beschermt tegen één Droogte.",
  },
  {
    key: "sabotage",
    name: "Sabotage",
    type: "advantage",
    subtype: "sabotage",
    quantity: 3,
    icon: "🧨",
    description: "Voordeel. Gebruik één keer om een eigen ramp aan een ander te geven.",
  },
  {
    key: "motorboat",
    name: "Motorboot",
    type: "special",
    subtype: "motorboat",
    quantity: 2,
    icon: "🚤",
    description: "Speciaal. Trek direct 2 extra kaarten en verwerk kettingreacties.",
  },
  {
    key: "raid",
    name: "Plundertocht",
    type: "special",
    subtype: "raid",
    quantity: 2,
    icon: "🏴",
    description: "Speciaal. Steel één open voordeelkaart of drie willekeurige handkaarten.",
  },
  {
    key: "move",
    name: "Kamp verplaatsen",
    type: "special",
    subtype: "move",
    quantity: 2,
    icon: "⛺",
    description: "Speciaal. Wissel je eiland met een willekeurig beschikbaar ander eiland.",
  },
];

const ISLAND_DEFINITIONS = [
  {
    key: "fishpond",
    name: "De Visvijver",
    icon: "🐟",
    description: "De eerste 3 Vissen tellen dubbel. Extra Vissen tellen normaal.",
    effectType: "double_fish",
  },
  {
    key: "forest",
    name: "Het Bos",
    icon: "🌲",
    description: "De eerste 3 Hout tellen dubbel. Extra Hout telt normaal.",
    effectType: "double_wood",
  },
  {
    key: "stream",
    name: "Het Riviertje",
    icon: "💧",
    description: "De eerste 3 Water tellen dubbel. Extra Water telt normaal.",
    effectType: "double_water",
  },
  {
    key: "cave",
    name: "De Grot",
    icon: "🕳️",
    description: "Aan het einde verwijder je maximaal 2 rampkaarten naar keuze uit je hand.",
    effectType: "cave",
  },
  {
    key: "witch",
    name: "De Heksenheuvel",
    icon: "🌙",
    description: "Eén keer leg je 1 ramp af en mag je daarna eventueel 1 andere ramp doorgeven.",
    effectType: "witch",
  },
  {
    key: "food_forest",
    name: "Het Voedselbos",
    icon: "🍄",
    description: "Heb je na rampen minimaal 1 Hout, 1 Vis en 1 Water over, dan krijg je 3 bonuspunten.",
    effectType: "food_bonus",
  },
  {
    key: "mirror",
    name: "De Spiegel",
    icon: "🪞",
    description: "Eén keer kun je een aangeboden ramp weigeren en dezelfde ramp terugsturen.",
    effectType: "mirror",
  },
];

const CARD_TYPE_LABELS = {
  resource: "Grondstof",
  danger: "Ramp",
  advantage: "Voordeel",
  special: "Speciaal",
  island: "Eiland",
};

const PROTECTION_MAP = {
  bear: { advantage: "rod", label: "Hengel" },
  fire: { advantage: "axe", label: "Bijl" },
  drought: { advantage: "rain", label: "Regenbui" },
};

const DISASTER_EFFECTS = {
  bear: { resource: "fish", amount: 2, text: "-2 Vis" },
  fire: { resource: "wood", amount: 2, text: "-2 Hout" },
  drought: { resource: "water", amount: 2, text: "-2 Water" },
  leak: { resource: null, amount: 1, text: "-1 grootste resourcevoorraad" },
};

const RESOURCE_ISLANDS = {
  double_fish: { resource: "fish", label: "Vis" },
  double_wood: { resource: "wood", label: "Hout" },
  double_water: { resource: "water", label: "Water" },
};

const COMPUTER_SPEED_DELAYS = {
  normal: 500,
  fast: 140,
  instant: 0,
};

let nextCardInstanceId = 1;

const state = {
  selectedPlayerCount: 3,
  computerSpeed: "normal",
  gameStarted: false,
  gameOver: false,
  scoringStarted: false,
  processing: false,
  computerRunning: false,
  humanHandVisible: true,
  humanIslandVisible: true,
  players: [],
  deck: [],
  discard: [],
  unusedIslands: [],
  currentPlayerIndex: 0,
  round: 1,
  currentTurn: {
    mainActionAvailable: true,
    sabotageUsed: false,
  },
  metrics: createMetrics(),
  log: [],
  finalScores: [],
  simulationResults: null,
  debug: {
    playerId: "",
    cardKey: "wood",
    handPlayerId: "",
    handCardId: "",
    advantageKey: "axe",
    islandKey: "fishpond",
    islandUsed: "false",
    activePlayerId: "",
    topCardKey: "wood",
    simulationGames: "100",
    simulationCustomGames: "10000",
    simulationPlayers: "4",
    simulationCampRelocation: "enabled",
  },
  simulationProgress: null,
};

const startScreen = document.getElementById("start-screen");
const gameScreen = document.getElementById("game-screen");
const scoreScreen = document.getElementById("score-screen");
const setupForm = document.getElementById("setup-form");
const nameFields = document.getElementById("name-fields");
const modalRoot = document.getElementById("modal-root");

document.addEventListener("DOMContentLoaded", () => {
  renderNameFields();
  setupForm.addEventListener("submit", handleSetupSubmit);
  document.addEventListener("click", handleDocumentClick);
  document.addEventListener("change", handleDocumentChange);
});

function handleSetupSubmit(event) {
  event.preventDefault();
  const humanName = document.getElementById("human-name")?.value.trim() || "Speler 1";
  initializeGame(state.selectedPlayerCount, humanName);
}

function handleDocumentChange(event) {
  const target = event.target;
  if (target.id === "computer-speed") {
    state.computerSpeed = target.value;
    renderInterface();
    return;
  }

  const map = {
    "debug-player": "playerId",
    "debug-card": "cardKey",
    "debug-hand-player": "handPlayerId",
    "debug-hand-card": "handCardId",
    "debug-advantage": "advantageKey",
    "debug-island": "islandKey",
    "debug-island-used": "islandUsed",
    "debug-active-player": "activePlayerId",
    "debug-top-card": "topCardKey",
    "debug-simulation-games": "simulationGames",
    "debug-simulation-custom-games": "simulationCustomGames",
    "debug-simulation-players": "simulationPlayers",
    "debug-simulation-camp-relocation": "simulationCampRelocation",
  };

  if (map[target.id]) {
    state.debug[map[target.id]] = target.value;
    if (["debug-player", "debug-hand-player", "debug-active-player"].includes(target.id)) {
      renderInterface();
    }
  }
}

async function handleDocumentClick(event) {
  const countButton = event.target.closest("[data-count]");
  if (countButton) {
    state.selectedPlayerCount = Number(countButton.dataset.count);
    renderNameFields();
    document.querySelectorAll("[data-count]").forEach((button) => {
      button.classList.toggle("is-selected", Number(button.dataset.count) === state.selectedPlayerCount);
    });
    return;
  }

  const button = event.target.closest("[data-action]");
  if (!button || button.disabled) {
    return;
  }

  const action = button.dataset.action;
  if (state.processing && !["open-rules"].includes(action)) {
    return;
  }

  if (action === "open-rules") {
    openRules();
    return;
  }
  if (action === "toggle-hand") {
    state.humanHandVisible = !state.humanHandVisible;
    renderInterface();
    return;
  }
  if (action === "toggle-island") {
    state.humanIslandVisible = !state.humanIslandVisible;
    renderInterface();
    return;
  }
  if (action === "draw-card") {
    await runLocked(takeHumanDrawAction);
    return;
  }
  if (action === "steal-card") {
    await runLocked(takeHumanStealAction);
    return;
  }
  if (action === "use-sabotage") {
    await runLocked(useHumanSabotage);
    return;
  }
  if (action === "use-witch") {
    await runLocked(useHumanWitchHill);
    return;
  }
  if (action === "force-endgame") {
    await runLocked(startEndgame);
    return;
  }
  if (action === "reset-game") {
    resetGame();
    return;
  }
  if (action.startsWith("debug-")) {
    await runLocked(() => handleDebugAction(action));
  }
}

function renderNameFields() {
  nameFields.innerHTML = `
    <div class="field">
      <label for="human-name">Jouw naam</label>
      <input id="human-name" data-name-input type="text" placeholder="Speler 1">
    </div>
  `;
}

function initializeGame(playerCount, humanName) {
  nextCardInstanceId = 1;
  state.players = createPlayers(playerCount, humanName, false);
  state.deck = shuffleDeck(generateDeck());
  state.discard = [];
  state.unusedIslands = [];
  state.currentPlayerIndex = 0;
  state.round = 1;
  state.currentTurn = { mainActionAvailable: true, sabotageUsed: false };
  state.gameStarted = true;
  state.gameOver = false;
  state.scoringStarted = false;
  state.processing = false;
  state.computerRunning = false;
  state.humanHandVisible = true;
  state.humanIslandVisible = true;
  state.metrics = createMetrics();
  state.finalScores = [];
  state.simulationResults = null;
  state.simulationProgress = null;
  state.log = [];
  dealIslands(state);
  syncDebugDefaults();
  addLog(`Nieuw singleplayer spel gestart met ${playerCount} spelers.`);
  renderInterface();
}

function createPlayers(playerCount, humanName, allComputers) {
  return Array.from({ length: playerCount }, (_, index) => {
    const isHuman = !allComputers && index === 0;
    return {
      id: `player-${index + 1}`,
      seat: index + 1,
      isHuman,
      name: isHuman ? (humanName || "Speler 1") : `Computer ${allComputers ? index + 1 : index}`,
      hand: [],
      advantages: [],
      island: null,
      startIslandId: null,
      currentIslandId: null,
      islandHistory: [],
      usedCampRelocation: false,
      startingIslandKey: null,
      startingIslandName: null,
      removedByCave: [],
      caveRemovedCount: 0,
      cavePreventedDamage: 0,
      scoreBeforeIslandBonus: 0,
      islandBonusPoints: 0,
      finalScore: 0,
      receivedDisasters: 0,
      stolenCardsLost: 0,
      negativeActionsReceived: 0,
      witchPreventedDamage: 0,
      witchTargetDamage: 0,
      mirrorPreventedDamage: 0,
      mirrorAttackerDamage: 0,
    };
  });
}

function generateDeck(options = {}) {
  const deck = [];
  CARD_DEFINITIONS.forEach((definition) => {
    if (options.disableCampRelocation && definition.subtype === "move") {
      return;
    }
    for (let index = 0; index < definition.quantity; index += 1) {
      deck.push(createCard(definition.key));
    }
  });
  return deck;
}

function shuffleDeck(deck) {
  for (let index = deck.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [deck[index], deck[randomIndex]] = [deck[randomIndex], deck[index]];
  }
  return deck;
}

function dealIslands(game) {
  const islandPool = shuffleDeck(ISLAND_DEFINITIONS.map(createIsland));
  game.players.forEach((player) => {
    setPlayerIsland(player, islandPool.shift(), { asStartingIsland: true });
  });
  game.unusedIslands = islandPool;
}

async function takeHumanDrawAction() {
  const player = getActivePlayer();
  if (!player.isHuman || !state.currentTurn.mainActionAvailable) {
    return;
  }
  await drawCard(player);
  state.currentTurn.mainActionAvailable = false;
  await finishHumanMainAction();
}

async function takeHumanStealAction() {
  const player = getActivePlayer();
  if (!player.isHuman || !state.currentTurn.mainActionAvailable) {
    return;
  }

  const targets = getOtherPlayers(player).filter((target) => target.hand.length > 0);
  if (targets.length === 0) {
    addLog("Niemand heeft handkaarten. Je trekt daarom een kaart.");
    await drawCard(player);
  } else {
    const targetId = await choosePlayer("Kaart stelen", targets, "Kies een computerspeler. De kaart wordt willekeurig gekozen.");
    await stealRandomHandCards(player, getPlayer(targetId), 1);
  }

  state.currentTurn.mainActionAvailable = false;
  await finishHumanMainAction();
}

async function finishHumanMainAction() {
  if (state.deck.length === 0) {
    await startEndgame();
    return;
  }
  endTurn();
  await runComputerTurns();
}

async function runComputerTurns() {
  if (state.computerRunning || state.gameOver) {
    return;
  }

  state.computerRunning = true;
  while (state.gameStarted && !state.gameOver && !getActivePlayer().isHuman) {
    renderInterface();
    await computerPause();
    await executeComputerTurn(getActivePlayer());
    if (state.gameOver || state.scoringStarted) {
      break;
    }
    if (state.deck.length === 0) {
      await startEndgame();
      break;
    }
    endTurn();
    await computerPause();
  }
  state.computerRunning = false;
  renderInterface();
}

async function executeComputerTurn(computerPlayer) {
  addLog(`${computerPlayer.name} voert zijn beurt uit.`);

  if (canComputerUseSabotage(computerPlayer) && Math.random() < getComputerSabotageChance(computerPlayer)) {
    await computerUseSabotage(computerPlayer);
    await computerPause();
  }

  if (canComputerUseWitchHill(computerPlayer) && shouldComputerUseWitchHill(computerPlayer)) {
    await computerUseWitchHill(computerPlayer);
    await computerPause();
  }

  const stealTargets = getOtherPlayers(computerPlayer).filter((target) => target.hand.length > 0);
  const shouldSteal = stealTargets.length > 0 && Math.random() < 0.35;
  if (shouldSteal) {
    const target = chooseRandomItem(stealTargets);
    await stealRandomHandCards(computerPlayer, target, 1);
  } else {
    await drawCard(computerPlayer);
  }
}

async function drawCard(player) {
  if (state.deck.length === 0) {
    addLog("De trekstapel is leeg.");
    return false;
  }

  const card = state.deck.shift();
  logDraw(player, card);
  await processCard(player, card);
  return true;
}

function logDraw(player, card) {
  if (player.isHuman) {
    if (card.type === "resource" || card.type === "danger") {
      addLog(`${player.name} trok een ${card.name}.`);
    } else if (card.type === "advantage") {
      addLog(`${player.name} vond een ${card.name}.`);
    } else {
      addLog(`${player.name} trok ${card.name}.`);
    }
    return;
  }

  if (card.type === "resource" || card.type === "danger") {
    addLog(`${player.name} trok een verborgen kaart.`);
  } else if (card.type === "advantage") {
    addLog(`${player.name} vond een ${card.name}.`);
  } else {
    addLog(`${player.name} trok ${card.name}.`);
  }
}

async function processCard(player, card) {
  if (card.type === "resource" || card.type === "danger") {
    player.hand.push(card);
    return;
  }

  if (card.type === "advantage") {
    player.advantages.push(card);
    return;
  }

  if (card.type === "special") {
    await executeSpecialCard(player, card);
    state.discard.push(card);
  }
}

async function executeSpecialCard(player, card) {
  if (card.subtype === "motorboat") {
    addLog(`${player.name} trekt twee extra kaarten met Motorboot.`);
    await drawCard(player);
    if (!player.isHuman) {
      await computerPause();
    }
    await drawCard(player);
    return;
  }

  if (card.subtype === "raid") {
    await executePlunder(player);
    return;
  }

  if (card.subtype === "move") {
    moveCamp(player, state);
  }
}

async function executePlunder(player) {
  const advantageTargets = getOtherPlayers(player)
    .flatMap((target) => target.advantages.map((card) => ({ target, card })));
  const handTargets = getOtherPlayers(player).filter((target) => target.hand.length > 0);

  if (advantageTargets.length === 0 && handTargets.length === 0) {
    addLog("Plundertocht vindt geen buit.");
    return;
  }

  if (!player.isHuman) {
    await executeComputerPlunder(player, advantageTargets, handTargets);
    return;
  }

  const options = [];
  if (advantageTargets.length > 0) {
    options.push({
      label: "Open voordeelkaart stelen",
      description: `${advantageTargets.length} beschikbare voordeelkaart(en).`,
      value: "advantage",
    });
  }
  if (handTargets.length > 0) {
    options.push({
      label: "Drie handkaarten stelen",
      description: `${handTargets.length} computerspeler(s) met verborgen handkaarten.`,
      value: "hand",
    });
  }

  const choice = await showChoice("Plundertocht", "Kies wat je wilt stelen.", options);
  if (choice === "advantage") {
    const stolen = await showChoice("Voordeelkaart stelen", "Kies één open voordeelkaart.", advantageTargets.map(({ target, card }) => ({
      label: `${target.name}: ${card.name}`,
      description: card.description,
      value: { targetId: target.id, cardId: card.id },
    })));
    stealAdvantageCard(player, getPlayer(stolen.targetId), stolen.cardId);
  } else {
    const targetId = await choosePlayer("Handkaarten stelen", handTargets, "Kies een computerspeler. Je steelt willekeurig maximaal drie handkaarten.");
    await stealRandomHandCards(player, getPlayer(targetId), 3);
  }
}

async function executeComputerPlunder(player, advantageTargets, handTargets) {
  let mode = null;
  if (advantageTargets.length > 0 && handTargets.length > 0) {
    mode = Math.random() < 0.5 ? "advantage" : "hand";
  } else if (advantageTargets.length > 0) {
    mode = "advantage";
  } else {
    mode = "hand";
  }

  if (mode === "advantage") {
    const { target, card } = chooseRandomItem(advantageTargets);
    stealAdvantageCard(player, target, card.id);
  } else {
    const target = chooseRandomItem(handTargets);
    await stealRandomHandCards(player, target, 3);
  }
}

function stealAdvantageCard(thief, target, cardId) {
  const cardIndex = target.advantages.findIndex((card) => card.id === Number(cardId));
  if (cardIndex < 0) {
    return null;
  }
  const [card] = target.advantages.splice(cardIndex, 1);
  thief.advantages.push(card);
  addLog(`${thief.name} stal ${card.name} van ${target.name}.`);
  return card;
}

async function stealRandomHandCards(thief, target, amount) {
  const stolenCards = [];
  const stealAmount = Math.min(amount, target.hand.length);

  for (let index = 0; index < stealAmount; index += 1) {
    const randomIndex = Math.floor(Math.random() * target.hand.length);
    const [card] = target.hand.splice(randomIndex, 1);
    thief.hand.push(card);
    stolenCards.push(card);
  }

  target.stolenCardsLost += stolenCards.length;
  state.metrics.stolenCards += stolenCards.length;

  if (stolenCards.length === 0) {
    addLog(`${thief.name} kon geen handkaart stelen van ${target.name}.`);
  } else if (thief.isHuman) {
    addLog(`${thief.name} stal ${formatCardNames(stolenCards)} van ${target.name}.`);
  } else if (stolenCards.length === 1) {
    addLog(`${thief.name} stal een willekeurige kaart van ${target.name}.`);
  } else {
    addLog(`${thief.name} stal ${stolenCards.length} willekeurige kaarten van ${target.name}.`);
  }

  return stolenCards;
}

async function useHumanSabotage() {
  const player = getActivePlayer();
  if (!canHumanUseSabotage(player)) {
    return;
  }

  const dangerCard = await chooseOwnDanger(player, "Sabotage", "Kies een rampkaart uit je eigen hand.");
  if (!dangerCard) {
    return;
  }
  const targetId = await choosePlayer("Sabotage", getOtherPlayers(player), "Kies de computerspeler die de ramp krijgt.");
  const sabotageCard = removeFirstAdvantage(player, "sabotage");
  if (!sabotageCard) {
    return;
  }

  state.discard.push(sabotageCard);
  state.currentTurn.sabotageUsed = true;
  state.metrics.sabotageUsed += 1;
  await handleMirrorReaction(player, getPlayer(targetId), dangerCard, "Sabotage");
}

async function computerUseSabotage(computerPlayer) {
  const dangerCard = chooseRandomItem(computerPlayer.hand.filter((card) => card.type === "danger"));
  const target = chooseRandomTarget(computerPlayer, state.players);
  const sabotageCard = removeFirstAdvantage(computerPlayer, "sabotage");
  if (!dangerCard || !target || !sabotageCard) {
    return;
  }

  state.discard.push(sabotageCard);
  state.currentTurn.sabotageUsed = true;
  state.metrics.sabotageUsed += 1;
  await handleMirrorReaction(computerPlayer, target, dangerCard, "Sabotage");
}

async function useHumanWitchHill() {
  const player = getActivePlayer();
  if (!canHumanUseWitchHill(player)) {
    return;
  }

  const discarded = await chooseOwnDanger(player, "De Heksenheuvel", "Kies één rampkaart om af te leggen.");
  if (!discarded) {
    return;
  }

  const removed = removeCardFromHand(player, discarded.id);
  if (!removed) {
    return;
  }

  state.discard.push(removed);
  player.island.used = true;
  recordWitchHillDiscard(state, player, removed);
  addLog(`${player.name} gebruikte De Heksenheuvel.`);
  addLog(`${player.name} legde een ${removed.name} af.`);

  const passChoice = await chooseHumanWitchHillPass(player);
  if (!passChoice) {
    state.metrics.witchHillDiscardOnly += 1;
    return;
  }

  state.metrics.witchHillDiscardAndPass += 1;
  state.metrics.witchHillOnePassed += 1;
  await handleMirrorReaction(player, passChoice.target, passChoice.card, "De Heksenheuvel");
}

async function computerUseWitchHill(computerPlayer) {
  const result = chooseComputerWitchHillAction(computerPlayer, state.players);
  if (!result?.discarded) {
    return;
  }

  const discarded = removeCardFromHand(computerPlayer, result.discarded.id);
  if (!discarded) {
    return;
  }

  state.discard.push(discarded);
  computerPlayer.island.used = true;
  recordWitchHillDiscard(state, computerPlayer, discarded);
  addLog(`${computerPlayer.name} gebruikte De Heksenheuvel.`);
  addLog(`${computerPlayer.name} legde een ${discarded.name} af.`);

  if (!result.transfer) {
    state.metrics.witchHillDiscardOnly += 1;
    return;
  }

  state.metrics.witchHillDiscardAndPass += 1;
  state.metrics.witchHillOnePassed += 1;
  await handleMirrorReaction(computerPlayer, result.transfer.target, result.transfer.card, "De Heksenheuvel");
}

async function handleMirrorReaction(attacker, target, dangerCard, sourceName, actionContext = null) {
  const context = actionContext || {
    sourcePlayerId: attacker.id,
    targetPlayerId: target.id,
    disasterCardId: dangerCard.id,
    reflected: false,
  };
  state.metrics.disastersPassed += 1;
  registerNegativeAction(state, target);

  if (target.island?.effectType === "mirror" && !target.island.used && !context.reflected) {
    state.metrics.mirrorAttackMoments += 1;
    state.metrics.mirrorAvailable += 1;
    const usesMirror = target.isHuman
      ? await askHumanMirrorChoice(attacker, target, dangerCard, sourceName)
      : shouldComputerUseMirror(target, dangerCard, context);

    if (usesMirror) {
      context.reflected = true;
      target.island.used = true;
      recordMirrorReturn(state, attacker, target, dangerCard);
      state.metrics.mirrorUsed += 1;
      addLog(`${target.name} gebruikte De Spiegel.`);
      addLog(`De ${dangerCard.name} ging terug naar ${attacker.name}.`);
      return { accepted: false, mirrored: true };
    }

    state.metrics.mirrorAccepted += 1;
  }

  const transferred = removeCardFromHand(attacker, dangerCard.id);
  if (transferred) {
    target.hand.push(transferred);
    target.receivedDisasters += 1;
    recordPassedDisaster(state, sourceName, transferred, target);
    addLog(`${attacker.name} gaf via ${sourceName} een ${transferred.name} aan ${target.name}.`);
    return { accepted: true, mirrored: false };
  }

  return { accepted: false, mirrored: false };
}

async function askHumanMirrorChoice(attacker, target, dangerCard, sourceName) {
  const choice = await showChoice(`De Spiegel van ${target.name}`, `${sourceName} probeert jou een ${dangerCard.name} te geven.`, [
    {
      label: "Nee, ramp accepteren",
      description: `${dangerCard.name} gaat naar je hand.`,
      value: "accept",
    },
    {
      label: "Ja, De Spiegel gebruiken",
      description: "Stuur dezelfde rampkaart terug naar de aanvaller.",
      value: "mirror",
    },
  ]);
  return choice === "mirror";
}

async function chooseHumanWitchHillPass(player) {
  const remainingDangers = player.hand.filter((card) => card.type === "danger");
  if (remainingDangers.length === 0) {
    return null;
  }

  const cardId = await showChoice("De Heksenheuvel", "Wil je nog één andere rampkaart doorgeven?", [
    ...remainingDangers.map((card) => ({
      label: `${card.name} doorgeven`,
      description: card.description,
      value: card.id,
    })),
    {
      label: "Niets doorgeven",
      description: "Alleen de eerste ramp blijft afgelegd.",
      value: null,
    },
  ]);

  if (!cardId) {
    return null;
  }

  const card = player.hand.find((candidate) => candidate.id === cardId);
  const targetId = await choosePlayer("De Heksenheuvel", getOtherPlayers(player), `Kies het doelwit voor ${card.name}.`);
  return { card, target: getPlayer(targetId) };
}

function chooseComputerWitchHillAction(computerPlayer, players) {
  const dangers = computerPlayer.hand.filter((card) => card.type === "danger");
  if (dangers.length === 0) {
    return null;
  }

  const discarded = chooseMostDamagingDangerForPlayer(computerPlayer, dangers);
  const remaining = dangers.filter((card) => card.id !== discarded.id);
  const target = remaining.length > 0 ? chooseComputerWitchTarget(computerPlayer, players) : null;
  const transfer = target ? { card: chooseRandomItem(remaining), target } : null;
  return { discarded, transfer };
}

function chooseComputerWitchTarget(computerPlayer, players) {
  const targets = players.filter((target) => target.id !== computerPlayer.id);
  const highestHandCount = Math.max(...targets.map((target) => target.hand.length));
  return chooseRandomItem(targets.filter((target) => target.hand.length === highestHandCount));
}

function endTurn() {
  const previousIndex = state.currentPlayerIndex;
  state.currentPlayerIndex = (state.currentPlayerIndex + 1) % state.players.length;
  if (state.currentPlayerIndex <= previousIndex) {
    state.round += 1;
  }
  state.currentTurn = { mainActionAvailable: true, sabotageUsed: false };

  const active = getActivePlayer();
  addLog(active.isHuman ? `${active.name} is weer aan de beurt.` : `${active.name} is aan de beurt.`);
  syncDebugDefaults();
  renderInterface();
}

async function startEndgame() {
  if (state.scoringStarted) {
    return;
  }

  state.scoringStarted = true;
  state.computerRunning = false;
  addLog("Het eindspel is gestart.");

  for (const player of state.players) {
    player.removedByCave = [];
    if (player.island?.effectType !== "cave") {
      continue;
    }

    const dangers = player.hand.filter((card) => card.type === "danger");
    if (dangers.length === 0) {
      applyCaveRemoval(player, { mode: "ids", ids: [] }, state);
      continue;
    }

    if (player.isHuman) {
      const choice = await chooseHumanCaveRemoval(player);
      applyCaveRemoval(player, choice, state);
    } else {
      applyCaveRemoval(player, chooseComputerCaveRemoval(player), state);
    }
  }

  state.finalScores = await calculateFinalScoreInteractive(state, state.metrics);
  state.gameOver = true;
  state.gameStarted = false;
  renderInterface();
}

async function chooseHumanCaveRemoval(player) {
  const dangers = player.hand.filter((card) => card.type === "danger");
  const selectedIds = await showMultiCardChoice(
    "De Grot",
    "Selecteer maximaal twee rampkaarten om vóór bescherming en rampschade te verwijderen.",
    dangers,
    2,
  );
  return { mode: "ids", ids: selectedIds };
}

function chooseComputerCaveRemoval(player) {
  const dangers = player.hand.filter((card) => card.type === "danger");
  const selected = [];
  const remaining = [...dangers];
  const damageByCardId = estimateDangerDamageMapForPlayer(player);

  while (selected.length < 2 && remaining.length > 0) {
    const scored = remaining.map((card) => ({
      card,
      damage: damageByCardId[card.id] || 0,
      leakPriority: card.subtype === "leak" ? 1 : 0,
    }));
    const bestDamage = Math.max(...scored.map((item) => item.damage));
    const useful = scored.filter((item) => item.damage === bestDamage && item.damage > 0);
    const pool = useful.length > 0
      ? prioritizeLeakTie(useful)
      : scored;
    const picked = chooseRandomItem(pool).card;
    selected.push(picked.id);
    remaining.splice(remaining.findIndex((card) => card.id === picked.id), 1);
  }

  return { mode: "ids", ids: selected };
}

function applyCaveRemoval(player, choice, game) {
  player.removedByCave = [];
  player.caveRemovedCount = 0;
  player.cavePreventedDamage = 0;

  if (!choice) {
    game.metrics.caveZeroRemoved += 1;
    return [];
  }

  const removed = [];
  const ids = [...new Set(choice.ids || [])].slice(0, 2);
  const damageByCardId = estimateDangerDamageMapForPlayer(player);
  ids.forEach((cardId) => {
    const candidate = player.hand.find((card) => card.id === Number(cardId) && card.type === "danger");
    const preventedDamage = candidate ? damageByCardId[candidate.id] || 0 : 0;
    const removedCard = candidate ? removeCardFromHand(player, candidate.id) : null;
    if (removedCard) {
      removed.push(removedCard);
      player.cavePreventedDamage += preventedDamage;
    }
  });

  if (removed.length === 0) {
    game.metrics.caveZeroRemoved += 1;
    return [];
  }

  player.removedByCave.push(...removed);
  player.caveRemovedCount = removed.length;
  player.island.used = true;
  game.discard.push(...removed);
  game.metrics.caveRemoved += removed.length;
  game.metrics.cavePreventedDamage += player.cavePreventedDamage;
  if (removed.length === 1) {
    game.metrics.caveOneRemoved += 1;
  } else if (removed.length === 2) {
    game.metrics.caveTwoRemoved += 1;
    game.metrics.cavePairRemoved += 1;
  }
  removed.forEach((card) => {
    game.metrics.caveRemovedBySubtype[card.subtype] += 1;
    if (card.subtype === "leak") {
      game.metrics.leakRemovedByCave += 1;
    }
  });
  addGameLog(game, `${player.name} verwijderde met De Grot ${removed.length} rampkaart(en).`);
  return removed;
}

function prioritizeLeakTie(scoredItems) {
  const hasLeak = scoredItems.some((item) => item.card.subtype === "leak");
  return hasLeak ? scoredItems.filter((item) => item.card.subtype === "leak") : scoredItems;
}

function neutralizeDisasters(player, metrics) {
  const protectionCounts = countBySubtype(player.advantages);
  const dangers = player.hand.filter((card) => card.type === "danger");
  const neutralized = [];
  const pending = [];

  dangers.forEach((danger) => {
    const protection = PROTECTION_MAP[danger.subtype];
    if (protection && protectionCounts[protection.advantage] > 0) {
      protectionCounts[protection.advantage] -= 1;
      neutralized.push({ danger, by: protection.label });
      metrics.neutralized[danger.subtype] += 1;
    } else {
      pending.push(danger);
    }
  });

  return { neutralized, pending };
}

function applyDisasters(startResources, pendingDangers, player, metrics) {
  const remaining = { ...startResources };
  const executed = [];

  ["bear", "fire", "drought"].forEach((subtype) => {
    pendingDangers.filter((danger) => danger.subtype === subtype).forEach((danger) => {
    const effect = DISASTER_EFFECTS[danger.subtype];
    remaining[effect.resource] = Math.max(0, remaining[effect.resource] - effect.amount);
    executed.push({ danger, effect: effect.text });
  });
  });

  pendingDangers.filter((danger) => danger.subtype === "leak").forEach((danger) => {
    const result = applyLeakDamage(remaining, player, metrics, chooseLeakResourceSync);
    executed.push({ danger, effect: result.effect, lostResource: result.resource });
  });

  return { remaining, executed };
}

async function applyDisastersInteractive(startResources, pendingDangers, player, metrics) {
  const remaining = { ...startResources };
  const executed = [];

  ["bear", "fire", "drought"].forEach((subtype) => {
    pendingDangers.filter((danger) => danger.subtype === subtype).forEach((danger) => {
      const effect = DISASTER_EFFECTS[danger.subtype];
      remaining[effect.resource] = Math.max(0, remaining[effect.resource] - effect.amount);
      executed.push({ danger, effect: effect.text });
    });
  });

  for (const danger of pendingDangers.filter((candidate) => candidate.subtype === "leak")) {
    const result = await applyLeakDamageInteractive(remaining, player, metrics, danger);
    executed.push({ danger, effect: result.effect, lostResource: result.resource });
  }

  return { remaining, executed };
}

function applyLeakDamage(remaining, player, metrics, chooseResource) {
  const highestResources = getHighestResourceTypes(remaining);
  if (highestResources.length === 0) {
    metrics.leakProcessed += 1;
    return { resource: null, effect: "Geen resource om te verliezen." };
  }

  if (highestResources.length > 1) {
    metrics.leakTieChoices += 1;
  }

  const resource = chooseResource(highestResources, player, remaining);
  remaining[resource] = Math.max(0, remaining[resource] - 1);
  metrics.leakProcessed += 1;
  metrics.leakResourceLoss += 1;
  metrics.leakLossByResource[resource] += 1;
  return { resource, effect: `-1 ${RESOURCE_LABELS[resource]}` };
}

async function applyLeakDamageInteractive(remaining, player, metrics, danger) {
  const highestResources = getHighestResourceTypes(remaining);
  if (highestResources.length === 0) {
    metrics.leakProcessed += 1;
    return { resource: null, effect: "Geen resource om te verliezen." };
  }

  if (highestResources.length > 1) {
    metrics.leakTieChoices += 1;
  }

  const resource = player.isHuman && highestResources.length > 1
    ? await chooseHumanLeakResource(player, highestResources, remaining, danger)
    : chooseLeakResourceSync(highestResources);
  remaining[resource] = Math.max(0, remaining[resource] - 1);
  metrics.leakProcessed += 1;
  metrics.leakResourceLoss += 1;
  metrics.leakLossByResource[resource] += 1;
  return { resource, effect: `-1 ${RESOURCE_LABELS[resource]}` };
}

function getHighestResourceTypes(resources) {
  const highest = Math.max(resources.wood, resources.fish, resources.water);
  if (highest <= 0) {
    return [];
  }
  return Object.keys(resources).filter((resource) => resources[resource] === highest);
}

function chooseLeakResourceSync(highestResources) {
  return chooseRandomItem(highestResources);
}

function chooseHumanLeakResource(player, highestResources, remaining, danger) {
  return showChoice("Kano lek", `${danger.name} raakt je grootste voorraad. Kies welke gedeeld hoogste resource je verliest.`, highestResources.map((resource) => ({
    label: `Verlies 1 ${RESOURCE_LABELS[resource]}`,
    description: `Huidige voorraad: ${remaining[resource]}.`,
    value: resource,
  })));
}

function calculateIslandBonus(player, remainingResources, metrics) {
  const baseScore = sumResources(remainingResources);
  let woodScore = remainingResources.wood;
  let fishScore = remainingResources.fish;
  let waterScore = remainingResources.water;
  let bonusPoints = 0;
  let islandBonus = "Geen scorebonus.";
  let effectHadEffect = false;
  let matchingResourceAmount = 0;
  let maxBonusReached = false;
  let extraResourceBeyondCap = false;

  const resourceIsland = RESOURCE_ISLANDS[player.island.effectType];
  if (resourceIsland) {
    const amount = remainingResources[resourceIsland.resource];
    const cappedScore = calculateCappedDoubleResourceScore(amount);
    matchingResourceAmount = amount;
    bonusPoints = cappedScore - amount;
    effectHadEffect = bonusPoints > 0;
    maxBonusReached = amount >= 3;
    extraResourceBeyondCap = amount >= 4;
    islandBonus = `Eerste 3 ${resourceIsland.label} tellen dubbel: +${bonusPoints}.`;
    if (resourceIsland.resource === "wood") {
      woodScore = cappedScore;
    }
    if (resourceIsland.resource === "fish") {
      fishScore = cappedScore;
    }
    if (resourceIsland.resource === "water") {
      waterScore = cappedScore;
    }
  }
  if (player.island.effectType === "food_bonus") {
    const hasSet = remainingResources.wood >= 1 && remainingResources.fish >= 1 && remainingResources.water >= 1;
    bonusPoints = hasSet ? 3 : 0;
    effectHadEffect = hasSet;
    islandBonus = hasSet ? "Voedselbos geeft 3 bonuspunten." : "Voedselbos bonus niet gehaald.";
    if (hasSet) {
      metrics.foodBonus += 1;
    }
  }

  return {
    baseScore,
    woodScore,
    fishScore,
    waterScore,
    bonusPoints,
    islandBonusPoints: bonusPoints,
    islandBonus,
    effectHadEffect,
    matchingResourceAmount,
    maxBonusReached,
    extraResourceBeyondCap,
    total: woodScore + fishScore + waterScore + bonusPoints,
  };
}

function calculateFinalScore(game, metrics) {
  return game.players.map((player) => {
    const startResources = countResources(player.hand);
    const { neutralized, pending } = neutralizeDisasters(player, metrics);
    const { remaining, executed } = applyDisasters(startResources, pending, player, metrics);
    return buildFinalScoreEntry(player, startResources, neutralized, executed, remaining, metrics);
  });
}

async function calculateFinalScoreInteractive(game, metrics) {
  const scores = [];
  for (const player of game.players) {
    const startResources = countResources(player.hand);
    const { neutralized, pending } = neutralizeDisasters(player, metrics);
    const { remaining, executed } = await applyDisastersInteractive(startResources, pending, player, metrics);
    scores.push(buildFinalScoreEntry(player, startResources, neutralized, executed, remaining, metrics));
  }
  return scores;
}

function buildFinalScoreEntry(player, startResources, neutralized, executed, remaining, metrics) {
  const islandScore = calculateIslandBonus(player, remaining, metrics);
  const islandEffectValue = calculateIslandEffectValue(player, islandScore);
  const total = islandScore.total;

  player.scoreBeforeIslandBonus = islandScore.baseScore;
  player.islandBonusPoints = islandEffectValue;
  player.finalScore = total;

  return {
    playerId: player.id,
    playerName: player.name,
    islandKey: player.island.key,
    islandName: player.island.name,
    startIslandKey: player.startingIslandKey,
    startIslandName: player.startingIslandName,
    usedCampRelocation: player.usedCampRelocation,
    islandHistory: [...player.islandHistory],
    startResources,
    rampCards: player.hand.filter((card) => card.type === "danger").map((card) => card.name),
    leakCards: player.hand.filter((card) => card.subtype === "leak").length,
    handSize: player.hand.length,
    receivedDisasters: player.receivedDisasters,
    stolenCardsLost: player.stolenCardsLost,
    removedByCave: player.removedByCave.map((card) => card.name),
    caveRemovedCount: player.caveRemovedCount,
    cavePreventedDamage: player.cavePreventedDamage,
    neutralized,
    executed,
    remaining,
    scoreBeforeIslandBonus: islandScore.baseScore,
    islandBonusPoints: islandEffectValue,
    scoringBonusPoints: islandScore.bonusPoints,
    islandEffectHadEffect: islandScore.effectHadEffect || islandEffectValue > 0,
    matchingResourceAmount: islandScore.matchingResourceAmount,
    maxBonusReached: islandScore.maxBonusReached,
    extraResourceBeyondCap: islandScore.extraResourceBeyondCap,
    islandScore,
    total,
  };
}

function renderInterface() {
  startScreen.classList.toggle("screen-active", !state.gameStarted && !state.gameOver);
  gameScreen.classList.toggle("screen-active", state.gameStarted && !state.gameOver);
  scoreScreen.classList.toggle("screen-active", state.gameOver);

  if (state.gameStarted && !state.gameOver) {
    renderGameStatus();
    renderTurnPanel();
    renderPrivatePanel();
    renderActionPanel();
    renderPlayersOverview();
    renderLog();
    renderDebugPanel();
    setSelectValue("computer-speed", state.computerSpeed);
  }

  if (state.gameOver) {
    renderScoreScreen();
  }
}

function renderGameStatus() {
  const active = getActivePlayer();
  const phase = active.isHuman ? "Jouw beurt" : "Computerbeurten";
  document.getElementById("game-status").innerHTML = `
    <article class="status-card">
      <span class="status-label">Actieve speler</span>
      <strong class="status-value">${escapeHtml(active.name)}</strong>
    </article>
    <article class="status-card">
      <span class="status-label">Fase</span>
      <strong class="status-value">${phase}</strong>
    </article>
    <article class="status-card">
      <span class="status-label">Trekstapel</span>
      <strong class="status-value">${state.deck.length}</strong>
    </article>
    <article class="status-card">
      <span class="status-label">Ronde ${state.round}</span>
      <strong class="status-value">${state.discard.length} afgelegd</strong>
    </article>
  `;
}

function renderTurnPanel() {
  const active = getActivePlayer();
  const panel = document.getElementById("turn-panel");
  if (active.isHuman) {
    panel.innerHTML = `
      <h2>${escapeHtml(active.name)}, jij bent aan zet</h2>
      <p>Kies eventueel een extra actie en daarna precies één hoofdactie.</p>
    `;
  } else {
    panel.innerHTML = `
      <h2>${escapeHtml(active.name)} speelt automatisch</h2>
      <p>Computerbeurten worden achter elkaar uitgevoerd totdat jij weer aan de beurt bent.</p>
    `;
  }
}

function renderPrivatePanel() {
  const human = state.players.find((player) => player.isHuman);
  if (!human) {
    return;
  }

  const handHtml = state.humanHandVisible
    ? (human.hand.length ? human.hand.map(renderCard).join("") : `<p class="muted-text">Je hebt nog geen handkaarten.</p>`)
    : `<div class="card"><span class="card-icon">🂠</span><div class="card-name">Hand verborgen</div><div class="card-type">Privé</div><p class="card-description">${human.hand.length} kaart(en).</p></div>`;
  const islandHtml = state.humanIslandVisible
    ? renderCard({ ...human.island, type: "island" })
    : `<div class="card card-island"><span class="card-icon">🏝️</span><div class="card-name">Eiland verborgen</div><div class="card-type">Eiland</div><p class="card-description">Gebruik de knop om je eiland te bekijken.</p></div>`;
  const advantagesHtml = human.advantages.length
    ? human.advantages.map(renderCard).join("")
    : `<p class="muted-text">Je hebt nog geen open voordeelkaarten.</p>`;

  document.getElementById("private-panel").innerHTML = `
    <div class="private-grid">
      <section class="private-box">
        <div class="section-heading">
          <h2>Jouw hand</h2>
          <button type="button" class="secondary-button" data-action="toggle-hand">${state.humanHandVisible ? "Hand verbergen" : "Bekijk mijn hand"}</button>
        </div>
        <div class="hand-grid">${handHtml}</div>
      </section>
      <section class="private-box">
        <div class="section-heading">
          <h2>Jouw eiland</h2>
          <button type="button" class="secondary-button" data-action="toggle-island">${state.humanIslandVisible ? "Eiland verbergen" : "Bekijk mijn eiland"}</button>
        </div>
        <div class="island-grid">${islandHtml}</div>
      </section>
    </div>
    <section class="private-box" style="margin-top: 16px;">
      <div class="section-heading">
        <h2>Jouw voordeelkaarten</h2>
        <span class="pill">${human.advantages.length} open</span>
      </div>
      <div class="advantage-grid">${advantagesHtml}</div>
    </section>
  `;
}

function renderActionPanel() {
  const panel = document.getElementById("action-panel");
  const player = getActivePlayer();

  if (!player.isHuman) {
    panel.innerHTML = `
      <section class="actions-box">
        <h2>Computerbeurten bezig</h2>
        <p class="muted-text">Volg de gebeurtenissen in het logboek.</p>
      </section>
    `;
    return;
  }

  const mainActions = [];
  if (state.currentTurn.mainActionAvailable && state.deck.length > 0) {
    mainActions.push(`<button type="button" class="primary-button" data-action="draw-card">Trek een kaart</button>`);
  }
  if (state.currentTurn.mainActionAvailable && getOtherPlayers(player).some((target) => target.hand.length > 0)) {
    mainActions.push(`<button type="button" class="secondary-button" data-action="steal-card">Steel een kaart</button>`);
  }

  const extraActions = [];
  if (canHumanUseSabotage(player)) {
    extraActions.push(`<button type="button" class="secondary-button" data-action="use-sabotage">Gebruik Sabotage</button>`);
  }
  if (canHumanUseWitchHill(player)) {
    extraActions.push(`<button type="button" class="secondary-button" data-action="use-witch">Gebruik De Heksenheuvel</button>`);
  }

  panel.innerHTML = `
    <section class="actions-box">
      <h2>Acties</h2>
      <div>
        <h3>Hoofdactie</h3>
        <div class="action-row">${mainActions.join("") || `<p class="muted-text">Geen hoofdactie beschikbaar.</p>`}</div>
      </div>
      <div>
        <h3>Extra actie</h3>
        <div class="action-row">${extraActions.join("") || `<p class="muted-text">Geen extra actie beschikbaar.</p>`}</div>
      </div>
    </section>
  `;
}

function renderPlayersOverview() {
  document.getElementById("players-overview").innerHTML = state.players.map((player, index) => {
    const isActive = index === state.currentPlayerIndex;
    const advantages = player.advantages.length
      ? player.advantages.map((card) => `<li class="pill">${escapeHtml(card.icon)} ${escapeHtml(card.name)}</li>`).join("")
      : `<li class="pill">Geen voordeelkaarten</li>`;
    const islandLabel = player.isHuman ? player.island.name : "Verborgen";
    const powerStatus = getIslandPowerStatus(player);

    return `
      <article class="player-card ${isActive ? "is-active" : ""}">
        <h3>
          <span>${escapeHtml(player.name)}</span>
          ${player.isHuman ? `<span class="pill">Jij</span>` : ""}
          ${isActive ? `<span class="pill">Actief</span>` : ""}
        </h3>
        <p><strong>${player.hand.length}</strong> handkaart(en)</p>
        <p>Eiland: <strong>${escapeHtml(islandLabel)}</strong></p>
        <p>Eilandkracht: <strong>${escapeHtml(powerStatus)}</strong></p>
        <ul class="pill-list">${advantages}</ul>
      </article>
    `;
  }).join("");
}

function renderLog() {
  document.getElementById("event-log").innerHTML = state.log
    .slice(-18)
    .reverse()
    .map((entry) => `<li>${escapeHtml(entry)}</li>`)
    .join("");
}

function renderDebugPanel() {
  syncDebugDefaults();
  const playerOptions = state.players.map((player) => `<option value="${player.id}">${escapeHtml(player.name)}</option>`).join("");
  const cardOptions = CARD_DEFINITIONS.map((card) => `<option value="${card.key}">${escapeHtml(card.name)} (${CARD_TYPE_LABELS[card.type]})</option>`).join("");
  const advantageOptions = CARD_DEFINITIONS
    .filter((card) => card.type === "advantage")
    .map((card) => `<option value="${card.key}">${escapeHtml(card.name)}</option>`)
    .join("");
  const islandOptions = ISLAND_DEFINITIONS.map((island) => `<option value="${island.key}">${escapeHtml(island.name)}</option>`).join("");
  const handPlayer = getPlayer(state.debug.handPlayerId) || getActivePlayer();
  const handOptions = handPlayer.hand.length
    ? handPlayer.hand.map((card) => `<option value="${card.id}">${escapeHtml(card.name)} (${card.id})</option>`).join("")
    : `<option value="">Geen handkaarten</option>`;

  document.getElementById("debug-content").innerHTML = `
    <div class="debug-grid">
      <section class="debug-group">
        <h3>Kaart geven</h3>
        <select id="debug-player">${playerOptions}</select>
        <select id="debug-card">${cardOptions}</select>
        <div class="debug-actions">
          <button type="button" class="secondary-button" data-action="debug-give-card">Specifieke kaart geven</button>
          <button type="button" class="secondary-button" data-action="debug-give-random">Willekeurige kaart geven</button>
        </div>
      </section>

      <section class="debug-group">
        <h3>Handkaart verwijderen</h3>
        <select id="debug-hand-player">${playerOptions}</select>
        <select id="debug-hand-card">${handOptions}</select>
        <button type="button" class="secondary-button" data-action="debug-remove-hand-card" ${handPlayer.hand.length ? "" : "disabled"}>Kaart uit hand verwijderen</button>
      </section>

      <section class="debug-group">
        <h3>Voordeelkaart geven</h3>
        <select id="debug-advantage">${advantageOptions}</select>
        <button type="button" class="secondary-button" data-action="debug-give-advantage">Voordeelkaart geven</button>
      </section>

      <section class="debug-group">
        <h3>Eiland aanpassen</h3>
        <select id="debug-island">${islandOptions}</select>
        <button type="button" class="secondary-button" data-action="debug-assign-island">Eiland toewijzen</button>
        <select id="debug-island-used">
          <option value="false">Kracht ongebruikt</option>
          <option value="true">Kracht gebruikt</option>
        </select>
        <button type="button" class="secondary-button" data-action="debug-set-island-used">Krachtstatus zetten</button>
      </section>

      <section class="debug-group">
        <h3>Trekstapel sturen</h3>
        <p class="muted-text">Trekstapel: ${state.deck.length} kaart(en). De volgorde blijft in de normale interface verborgen.</p>
        <select id="debug-top-card">${cardOptions}</select>
        <div class="debug-actions">
          <button type="button" class="secondary-button" data-action="debug-top-card">Kaart bovenop leggen</button>
          <button type="button" class="secondary-button" data-action="debug-shuffle-deck">Trekstapel schudden</button>
        </div>
      </section>

      <section class="debug-group">
        <h3>Spel sturen</h3>
        <select id="debug-active-player">${playerOptions}</select>
        <div class="debug-actions">
          <button type="button" class="secondary-button" data-action="debug-set-active-player">Actieve speler wijzigen</button>
          <button type="button" class="danger-button" data-action="debug-start-endgame">Eindspel starten</button>
          <button type="button" class="ghost-button" data-action="debug-reset-game">Reset</button>
        </div>
      </section>

      <section class="debug-group">
        <h3>Simulatiemodus</h3>
        <p class="muted-text">Laat het spel volledig automatisch spelen met dezelfde vaste computerregels.</p>
        <select id="debug-simulation-games">
          <option value="100">100 potjes simuleren</option>
          <option value="1000">1.000 potjes simuleren</option>
          <option value="10000">10.000 potjes simuleren</option>
          <option value="custom">Zelfgekozen aantal</option>
        </select>
        <input id="debug-simulation-custom-games" type="number" min="1" step="1" value="${escapeHtml(state.debug.simulationCustomGames)}" aria-label="Zelfgekozen aantal simulaties">
        <select id="debug-simulation-players">
          <option value="3">3 spelers</option>
          <option value="4">4 spelers</option>
          <option value="5">5 spelers</option>
        </select>
        <select id="debug-simulation-camp-relocation">
          <option value="enabled">Kamp verplaatsen normaal gebruiken</option>
          <option value="disabled">Kamp verplaatsen uitschakelen</option>
        </select>
        ${state.simulationProgress ? `<p class="muted-text">Simulatie bezig: ${state.simulationProgress.done} / ${state.simulationProgress.total} potjes.</p>` : ""}
        <div class="debug-actions">
          <button type="button" class="primary-button" data-action="debug-run-100-simulation">100 potjes automatisch spelen</button>
          <button type="button" class="secondary-button" data-action="debug-run-simulation">Gekozen aantal draaien</button>
        </div>
      </section>
    </div>
    ${renderSimulationResults()}
  `;

  setSelectValue("debug-player", state.debug.playerId);
  setSelectValue("debug-card", state.debug.cardKey);
  setSelectValue("debug-hand-player", state.debug.handPlayerId);
  setSelectValue("debug-hand-card", state.debug.handCardId);
  setSelectValue("debug-advantage", state.debug.advantageKey);
  setSelectValue("debug-island", state.debug.islandKey);
  setSelectValue("debug-island-used", state.debug.islandUsed);
  setSelectValue("debug-active-player", state.debug.activePlayerId);
  setSelectValue("debug-top-card", state.debug.topCardKey);
  setSelectValue("debug-simulation-games", state.debug.simulationGames);
  setSelectValue("debug-simulation-custom-games", state.debug.simulationCustomGames);
  setSelectValue("debug-simulation-players", state.debug.simulationPlayers);
  setSelectValue("debug-simulation-camp-relocation", state.debug.simulationCampRelocation);
}

function renderSimulationResults() {
  const results = state.simulationResults;
  if (!results) {
    return "";
  }
  const report = buildSimulationReport(results);

  const startIslandRows = results.startIslandStats.map((row) => `
    <tr>
      <td>${escapeHtml(row.name)}</td>
      <td>${row.appearances}</td>
      <td>${row.wins}</td>
      <td>${row.winRate}%</td>
      <td>${row.averageScore}</td>
      <td>${row.averageIslandBonus}</td>
      <td>${row.relocationRate}%</td>
    </tr>
  `).join("");
  const finalIslandRows = results.finalIslandStats.map((row) => `
    <tr>
      <td>${escapeHtml(row.name)}</td>
      <td>${row.appearances}</td>
      <td>${row.wins}</td>
      <td>${row.winRate}%</td>
      <td>${row.averageScore}</td>
      <td>${row.averageIslandBonus}</td>
    </tr>
  `).join("");
  const pureIslandRows = results.pureIslandStats.map((row) => `
    <tr>
      <td>${escapeHtml(row.name)}</td>
      <td>${row.appearances}</td>
      <td>${row.wins}</td>
      <td>${row.winRate}%</td>
      <td>${row.averageScore}</td>
      <td>${row.averageIslandBonus}</td>
    </tr>
  `).join("");
  const playerRows = results.averageScoreByPlayer.map((row) => `
    <tr>
      <td>${escapeHtml(row.name)}</td>
      <td>${row.wins}</td>
      <td>${row.winRate}%</td>
      <td>${row.averageScore}</td>
      <td>${row.averageHandSize}</td>
      <td>${row.averageReceivedDisasters}</td>
      <td>${row.averageStolenCardsLost}</td>
      <td>${row.averageIslandBonus}</td>
      <td>${escapeHtml(row.mostWinningStartingIsland)}</td>
      <td>${escapeHtml(row.mostWinningFinalIsland)}</td>
    </tr>
  `).join("");
  const startCombinationRows = results.topStartCombinations.map((row) => `
    <tr>
      <td class="combo-cell">${escapeHtml(row.combination)}</td>
      <td>${row.games}</td>
      <td>${row.gameRate}%</td>
      <td>${row.winnerCount}</td>
      <td>${row.averageWinningScore}</td>
      <td>${escapeHtml(row.topWinnerPosition)}</td>
    </tr>
  `).join("");
  const finalCombinationRows = results.topFinalCombinations.map((row) => `
    <tr>
      <td class="combo-cell">${escapeHtml(row.combination)}</td>
      <td>${row.games}</td>
      <td>${row.gameRate}%</td>
      <td>${row.winnerCount}</td>
      <td>${row.averageWinningScore}</td>
      <td>${escapeHtml(row.topWinnerPosition)}</td>
    </tr>
  `).join("");
  const neutralizedRows = Object.entries(results.neutralized).map(([key, value]) => `
    <tr>
      <td>${escapeHtml(getCardDefinitionBySubtype(key)?.name || key)}</td>
      <td>${value}</td>
    </tr>
  `).join("");

  return `
    <section class="simulation-results">
      <h3>Simulatieresultaten (${results.games} potjes, ${results.playerCount} spelers, Kamp verplaatsen ${results.campRelocationEnabled ? "aan" : "uit"})</h3>
      <table class="stats-table">
        <thead><tr><th>Start-eiland</th><th>Gestart</th><th>Wins</th><th>Win%</th><th>Gem. eindscore</th><th>Gem. eilandbonus</th><th>Verhuisd</th></tr></thead>
        <tbody>${startIslandRows}</tbody>
      </table>
      <table class="stats-table">
        <thead><tr><th>Eind-eiland</th><th>Geeindigd</th><th>Wins</th><th>Win%</th><th>Gem. eindscore</th><th>Gem. eilandbonus</th></tr></thead>
        <tbody>${finalIslandRows}</tbody>
      </table>
      <table class="stats-table">
        <thead><tr><th>Zonder Kamp verplaatsen</th><th>Waarnemingen</th><th>Wins</th><th>Win%</th><th>Gem. eindscore</th><th>Gem. eilandbonus</th></tr></thead>
        <tbody>${pureIslandRows}</tbody>
      </table>
      <table class="stats-table">
        <thead><tr><th>Spelerpositie</th><th>Wins</th><th>Win%</th><th>Gem. score</th><th>Gem. hand</th><th>Gem. ontvangen rampen</th><th>Gem. gestolen kaarten</th><th>Gem. eilandbonus</th><th>Win-start eiland</th><th>Win-eind eiland</th></tr></thead>
        <tbody>${playerRows}</tbody>
      </table>
      <table class="stats-table">
        <thead><tr><th>Start-eilandcombinatie</th><th>Potjes</th><th>Potjes %</th><th>Win-count</th><th>Gem. winnende score</th><th>Meest winnende positie</th></tr></thead>
        <tbody>${startCombinationRows}</tbody>
      </table>
      <table class="stats-table">
        <thead><tr><th>Eind-eilandcombinatie</th><th>Potjes</th><th>Potjes %</th><th>Win-count</th><th>Gem. winnende score</th><th>Meest winnende positie</th></tr></thead>
        <tbody>${finalCombinationRows}</tbody>
      </table>
      <table class="stats-table">
        <thead><tr><th>Statistiek</th><th>Waarde</th></tr></thead>
        <tbody>
          <tr><td>Hoogste score</td><td>${results.highestScore}</td></tr>
          <tr><td>Laagste score</td><td>${results.lowestScore}</td></tr>
          <tr><td>Gemiddeld gebruikte Sabotagekaarten</td><td>${results.averageSabotageUsed}</td></tr>
          <tr><td>Gemiddeld doorgegeven rampen</td><td>${results.averageDisastersPassed}</td></tr>
          <tr><td>Heksenheuvel gebruikt</td><td>${results.witchHillUsed}</td></tr>
          <tr><td>Heksenheuvel alleen afgelegd</td><td>${results.witchHillDiscardOnly}</td></tr>
          <tr><td>Heksenheuvel ook doorgegeven</td><td>${results.witchHillDiscardAndPass}</td></tr>
          <tr><td>De Spiegel aanvalsmomenten</td><td>${results.mirrorAttackMoments}</td></tr>
          <tr><td>De Spiegel gebruikt</td><td>${results.mirrorUsed}</td></tr>
          <tr><td>De Spiegel aanval geaccepteerd</td><td>${results.mirrorAccepted}</td></tr>
          <tr><td>De Grot verwijderde rampkaarten</td><td>${results.caveRemoved}</td></tr>
          <tr><td>De Grot verwijderde 0 rampen</td><td>${results.caveZeroRemoved}</td></tr>
          <tr><td>De Grot verwijderde 1 ramp</td><td>${results.caveOneRemoved}</td></tr>
          <tr><td>De Grot verwijderde 2 rampen</td><td>${results.caveTwoRemoved}</td></tr>
          <tr><td>Kano lek verwerkt</td><td>${results.leakProcessed}</td></tr>
          <tr><td>Kano lek door De Grot verwijderd</td><td>${results.leakRemovedByCave}</td></tr>
          <tr><td>Voedselbos kreeg 3 bonuspunten</td><td>${results.foodBonus}</td></tr>
        </tbody>
      </table>
      <table class="stats-table">
        <thead><tr><th>Tegengehouden ramp</th><th>Aantal</th></tr></thead>
        <tbody>${neutralizedRows}</tbody>
      </table>
      <div>
        <h3>Conclusierapport voor ChatGPT</h3>
        <textarea class="report-box" readonly>${escapeHtml(report)}</textarea>
      </div>
    </section>
  `;
}

function renderScoreScreen() {
  const highestScore = Math.max(...state.finalScores.map((score) => score.total));
  const winners = state.finalScores.filter((score) => score.total === highestScore).map((score) => score.playerName);
  const scoreCards = state.finalScores.map((score) => `
    <article class="score-card">
      <h2>
        <span>${escapeHtml(score.playerName)}</span>
        <span class="score-total">${score.total} punten</span>
      </h2>
      <ul class="score-list">
        <li><span>Eiland</span><strong>${escapeHtml(score.islandName)}</strong></li>
        <li><span>Begin Hout</span><strong>${score.startResources.wood}</strong></li>
        <li><span>Begin Vis</span><strong>${score.startResources.fish}</strong></li>
        <li><span>Begin Water</span><strong>${score.startResources.water}</strong></li>
        <li><span>Rampkaarten</span><strong>${escapeHtml(formatList(score.rampCards))}</strong></li>
        <li><span>Grot weggegooid</span><strong>${escapeHtml(formatList(score.removedByCave))}</strong></li>
        <li><span>Tegen gehouden rampen</span><strong>${escapeHtml(formatNeutralized(score.neutralized))}</strong></li>
        <li><span>Uitgevoerde rampen</span><strong>${escapeHtml(formatExecuted(score.executed))}</strong></li>
        <li><span>Over Hout</span><strong>${score.remaining.wood}</strong></li>
        <li><span>Over Vis</span><strong>${score.remaining.fish}</strong></li>
        <li><span>Over Water</span><strong>${score.remaining.water}</strong></li>
        <li><span>Houtscore</span><strong>${score.islandScore.woodScore}</strong></li>
        <li><span>Visscore</span><strong>${score.islandScore.fishScore}</strong></li>
        <li><span>Waterscore</span><strong>${score.islandScore.waterScore}</strong></li>
        <li><span>Eilandbonus</span><strong>${escapeHtml(score.islandScore.islandBonus)}</strong></li>
        <li><span>Bonuspunten</span><strong>${score.islandScore.bonusPoints}</strong></li>
      </ul>
    </article>
  `).join("");

  document.getElementById("score-content").innerHTML = `
    <div class="winner-banner">
      <h2>Winnaar${winners.length > 1 ? "s" : ""}: ${escapeHtml(winners.join(", "))}</h2>
      <p>Hoogste score: ${highestScore} punten.</p>
    </div>
    <div class="score-grid">${scoreCards}</div>
  `;
}

function renderCard(card) {
  const className = card.type === "island" ? "card-island" : `card-${card.type}`;
  return `
    <article class="card ${className}">
      <span class="card-icon">${escapeHtml(card.icon)}</span>
      <div class="card-name">${escapeHtml(card.name)}</div>
      <div class="card-type">${escapeHtml(CARD_TYPE_LABELS[card.type])}</div>
      <p class="card-description">${escapeHtml(card.description)}</p>
    </article>
  `;
}

async function handleDebugAction(action) {
  if (action === "debug-give-card") {
    const player = getPlayer(state.debug.playerId);
    await giveCardToPlayer(player, createCard(state.debug.cardKey), true);
    addLog(`Debug: kaart gegeven aan ${player.name}.`);
  }

  if (action === "debug-give-random") {
    const player = getPlayer(state.debug.playerId);
    const randomDefinition = chooseRandomItem(CARD_DEFINITIONS);
    await giveCardToPlayer(player, createCard(randomDefinition.key), true);
    addLog(`Debug: willekeurige kaart gegeven aan ${player.name}.`);
  }

  if (action === "debug-remove-hand-card") {
    const player = getPlayer(state.debug.handPlayerId);
    const removed = removeCardFromHand(player, Number(state.debug.handCardId));
    if (removed) {
      state.discard.push(removed);
      addLog(`Debug: handkaart verwijderd bij ${player.name}.`);
    }
  }

  if (action === "debug-give-advantage") {
    const player = getPlayer(state.debug.playerId);
    player.advantages.push(createCard(state.debug.advantageKey));
    addLog(`Debug: voordeelkaart gegeven aan ${player.name}.`);
  }

  if (action === "debug-assign-island") {
    const player = getPlayer(state.debug.playerId);
    assignIslandToPlayer(player, state.debug.islandKey, state);
    addLog(`Debug: eiland toegewezen aan ${player.name}.`);
  }

  if (action === "debug-set-island-used") {
    const player = getPlayer(state.debug.playerId);
    player.island.used = state.debug.islandUsed === "true";
    addLog(`Debug: eilandkrachtstatus gewijzigd voor ${player.name}.`);
  }

  if (action === "debug-top-card") {
    state.deck.unshift(createCard(state.debug.topCardKey));
    addLog("Debug: kaart bovenop de trekstapel gelegd.");
  }

  if (action === "debug-shuffle-deck") {
    shuffleDeck(state.deck);
    addLog("Debug: trekstapel geschud.");
  }

  if (action === "debug-set-active-player") {
    const index = state.players.findIndex((player) => player.id === state.debug.activePlayerId);
    if (index >= 0) {
      state.currentPlayerIndex = index;
      state.currentTurn = { mainActionAvailable: true, sabotageUsed: false };
      addLog(`Debug: actieve speler is nu ${getActivePlayer().name}.`);
      if (!getActivePlayer().isHuman) {
        await runComputerTurns();
      }
    }
  }

  if (action === "debug-start-endgame") {
    await startEndgame();
  }

  if (action === "debug-reset-game") {
    resetGame();
  }

  if (action === "debug-run-simulation") {
    const config = getSimulationConfig();
    state.simulationResults = await runSimulationInBatches(config.games, config.playerCount, config.options);
    addLog(`Debug: ${config.games} potjes gesimuleerd voor balanscontrole.`);
  }

  if (action === "debug-run-100-simulation") {
    state.debug.simulationGames = "100";
    const config = getSimulationConfig(100);
    state.simulationResults = await runSimulationInBatches(config.games, config.playerCount, config.options);
    addLog("Debug: 100 potjes volledig automatisch gespeeld.");
  }
}

function getSimulationConfig(forcedGames = null) {
  const selectedGames = state.debug.simulationGames === "custom"
    ? Number(state.debug.simulationCustomGames)
    : Number(state.debug.simulationGames);
  const games = Math.max(1, Math.floor(forcedGames || selectedGames || 100));
  const playerCount = Math.min(5, Math.max(3, Number(state.debug.simulationPlayers) || state.players.length || state.selectedPlayerCount));
  const options = {
    disableCampRelocation: state.debug.simulationCampRelocation === "disabled",
  };
  return { games, playerCount, options };
}

async function giveCardToPlayer(player, card, executeSpecials) {
  if (card.type === "resource" || card.type === "danger") {
    player.hand.push(card);
    return;
  }
  if (card.type === "advantage") {
    player.advantages.push(card);
    return;
  }
  if (executeSpecials) {
    await processCard(player, card);
  } else {
    state.discard.push(card);
  }
}

function assignIslandToPlayer(player, islandKey, game) {
  const islandDefinition = ISLAND_DEFINITIONS.find((island) => island.key === islandKey);
  if (!islandDefinition) {
    return;
  }

  const oldIsland = player.island;
  const otherHolder = game.players.find((candidate) => candidate.id !== player.id && candidate.island?.key === islandKey);
  const unusedIndex = game.unusedIslands.findIndex((island) => island.key === islandKey);

  if (otherHolder) {
    setPlayerIsland(otherHolder, oldIsland ? { ...oldIsland, used: false } : null);
  } else if (unusedIndex >= 0) {
    game.unusedIslands.splice(unusedIndex, 1);
    if (oldIsland) {
      game.unusedIslands.push({ ...oldIsland, used: false });
    }
  }

  setPlayerIsland(player, createIsland(islandDefinition));
}

function moveCamp(player, game) {
  if (!player.island) {
    return;
  }

  const oldIsland = player.island;
  game.unusedIslands.push({ ...oldIsland, used: false });
  let options = shuffleDeck([...game.unusedIslands]);
  const differentOptions = options.filter((island) => island.key !== oldIsland.key);
  if (differentOptions.length > 0) {
    options = differentOptions;
  }

  const newIsland = options[0];
  game.unusedIslands = game.unusedIslands.filter((island) => island.key !== newIsland.key);
  player.usedCampRelocation = true;
  setPlayerIsland(player, { ...newIsland, used: false });
  addGameLog(game, `${player.name} verplaatste het kamp en kreeg een nieuw geheim eiland.`);
}

function simulateGames(gameCount, playerCount, options = {}) {
  const aggregate = createSimulationAggregate(gameCount, playerCount, options);

  for (let index = 0; index < gameCount; index += 1) {
    simulateSingleGameIntoAggregate(aggregate, playerCount, options);
  }

  return finalizeSimulationAggregate(aggregate);
}

async function runSimulationInBatches(totalGames, playerCount, options = {}, batchSize = 250) {
  const aggregate = createSimulationAggregate(totalGames, playerCount, options);

  for (let index = 0; index < totalGames; index += batchSize) {
    const gamesInBatch = Math.min(batchSize, totalGames - index);
    for (let gameIndex = 0; gameIndex < gamesInBatch; gameIndex += 1) {
      simulateSingleGameIntoAggregate(aggregate, playerCount, options);
    }
    state.simulationProgress = {
      done: index + gamesInBatch,
      total: totalGames,
    };
    renderInterface();
    await new Promise((resolve) => window.setTimeout(resolve, 0));
  }

  state.simulationProgress = null;
  return finalizeSimulationAggregate(aggregate);
}

function simulateSingleGameIntoAggregate(aggregate, playerCount, options) {
  const simulation = createSimulationGame(playerCount, options);
  let guard = 0;

  while (simulation.deck.length > 0 && guard < 300) {
    const computerPlayer = simulation.players[simulation.currentPlayerIndex];
    executeComputerTurnInstant(simulation, computerPlayer);
    if (simulation.deck.length === 0) {
      break;
    }
    advanceGameTurn(simulation);
    guard += 1;
  }

  processCavesInstant(simulation);
  const scores = calculateFinalScore(simulation, simulation.metrics);
  addSimulationScores(aggregate, scores, simulation);
}

function createSimulationGame(playerCount, options = {}) {
  const game = {
    players: createPlayers(playerCount, "Computer 1", true),
    deck: shuffleDeck(generateDeck({ disableCampRelocation: options.disableCampRelocation })),
    discard: [],
    unusedIslands: [],
    currentPlayerIndex: 0,
    round: 1,
    metrics: createMetrics(),
    log: [],
  };
  dealIslands(game);
  return game;
}

function executeComputerTurnInstant(game, computerPlayer) {
  if (canComputerUseSabotageInGame(computerPlayer) && Math.random() < getComputerSabotageChance(computerPlayer)) {
    computerUseSabotageInstant(game, computerPlayer);
  }
  if (canComputerUseWitchHillInGame(computerPlayer) && shouldComputerUseWitchHill(computerPlayer)) {
    computerUseWitchHillInstant(game, computerPlayer);
  }

  const stealTargets = game.players.filter((target) => target.id !== computerPlayer.id && target.hand.length > 0);
  if (stealTargets.length > 0 && Math.random() < 0.35) {
    stealRandomHandCardsInstant(game, computerPlayer, chooseRandomItem(stealTargets), 1);
  } else {
    drawCardInstant(game, computerPlayer);
  }
}

function drawCardInstant(game, player) {
  if (game.deck.length === 0) {
    return false;
  }

  const card = game.deck.shift();
  if (card.type === "resource" || card.type === "danger") {
    player.hand.push(card);
  } else if (card.type === "advantage") {
    player.advantages.push(card);
  } else if (card.subtype === "motorboat") {
    drawCardInstant(game, player);
    drawCardInstant(game, player);
    game.discard.push(card);
  } else if (card.subtype === "raid") {
    executePlunderInstant(game, player);
    game.discard.push(card);
  } else if (card.subtype === "move") {
    moveCamp(player, game);
    game.discard.push(card);
  }
  return true;
}

function executePlunderInstant(game, player) {
  const advantageTargets = game.players
    .filter((target) => target.id !== player.id)
    .flatMap((target) => target.advantages.map((card) => ({ target, card })));
  const handTargets = game.players.filter((target) => target.id !== player.id && target.hand.length > 0);

  if (advantageTargets.length === 0 && handTargets.length === 0) {
    return;
  }

  let mode = null;
  if (advantageTargets.length > 0 && handTargets.length > 0) {
    mode = Math.random() < 0.5 ? "advantage" : "hand";
  } else if (advantageTargets.length > 0) {
    mode = "advantage";
  } else {
    mode = "hand";
  }

  if (mode === "advantage") {
    const { target, card } = chooseRandomItem(advantageTargets);
    const cardIndex = target.advantages.findIndex((candidate) => candidate.id === card.id);
    if (cardIndex >= 0) {
      const [stolen] = target.advantages.splice(cardIndex, 1);
      player.advantages.push(stolen);
    }
  } else {
    stealRandomHandCardsInstant(game, player, chooseRandomItem(handTargets), 3);
  }
}

function computerUseSabotageInstant(game, computerPlayer) {
  const dangerCard = chooseRandomItem(computerPlayer.hand.filter((card) => card.type === "danger"));
  const target = chooseRandomTarget(computerPlayer, game.players);
  const sabotageCard = removeFirstAdvantage(computerPlayer, "sabotage");
  if (!dangerCard || !target || !sabotageCard) {
    return;
  }
  game.discard.push(sabotageCard);
  game.metrics.sabotageUsed += 1;
  handleMirrorReactionInstant(game, computerPlayer, target, dangerCard, "Sabotage");
}

function computerUseWitchHillInstant(game, computerPlayer) {
  const result = chooseComputerWitchHillAction(computerPlayer, game.players);
  if (!result?.discarded) {
    return;
  }

  const discarded = removeCardFromHand(computerPlayer, result.discarded.id);
  if (!discarded) {
    return;
  }
  game.discard.push(discarded);
  computerPlayer.island.used = true;
  recordWitchHillDiscard(game, computerPlayer, discarded);

  if (!result.transfer) {
    game.metrics.witchHillDiscardOnly += 1;
    return;
  }

  game.metrics.witchHillDiscardAndPass += 1;
  game.metrics.witchHillOnePassed += 1;
  handleMirrorReactionInstant(game, computerPlayer, result.transfer.target, result.transfer.card, "De Heksenheuvel");
}

function handleMirrorReactionInstant(game, attacker, target, dangerCard, sourceName = "Sabotage", actionContext = null) {
  const context = actionContext || {
    sourcePlayerId: attacker.id,
    targetPlayerId: target.id,
    disasterCardId: dangerCard.id,
    reflected: false,
  };
  game.metrics.disastersPassed += 1;
  registerNegativeAction(game, target);
  if (target.island?.effectType === "mirror" && !target.island.used && !context.reflected) {
    game.metrics.mirrorAttackMoments += 1;
    game.metrics.mirrorAvailable += 1;
    if (shouldComputerUseMirror(target, dangerCard, context)) {
      context.reflected = true;
      target.island.used = true;
      recordMirrorReturn(game, attacker, target, dangerCard);
      game.metrics.mirrorUsed += 1;
      return;
    }
    game.metrics.mirrorAccepted += 1;
  }

  const transferred = removeCardFromHand(attacker, dangerCard.id);
  if (transferred) {
    target.hand.push(transferred);
    target.receivedDisasters += 1;
    recordPassedDisaster(game, sourceName, transferred, target);
  }
}

function stealRandomHandCardsInstant(game, thief, target, amount) {
  const stealAmount = Math.min(amount, target.hand.length);
  for (let index = 0; index < stealAmount; index += 1) {
    const randomIndex = Math.floor(Math.random() * target.hand.length);
    const [card] = target.hand.splice(randomIndex, 1);
    thief.hand.push(card);
    target.stolenCardsLost += 1;
    game.metrics.stolenCards += 1;
  }
}

function processCavesInstant(game) {
  game.players.forEach((player) => {
    player.removedByCave = [];
    if (player.island?.effectType !== "cave") {
      return;
    }
    const dangers = player.hand.filter((card) => card.type === "danger");
    applyCaveRemoval(player, dangers.length > 0 ? chooseComputerCaveRemoval(player) : { mode: "ids", ids: [] }, game);
  });
}

function createSimulationAggregate(games, playerCount, options = {}) {
  return {
    games,
    playerCount,
    campRelocationEnabled: !options.disableCampRelocation,
    startIslandStats: createIslandStatsMap(),
    finalIslandStats: createIslandStatsMap(),
    pureIslandStats: createIslandStatsMap(),
    resourceIslandStats: createResourceIslandStatsMap(),
    scoreByPlayer: Array.from({ length: playerCount }, (_, index) => ({
      name: `Spelerpositie ${index + 1}`,
      totalScore: 0,
      totalHandSize: 0,
      totalReceivedDisasters: 0,
      totalStolenCardsLost: 0,
      totalIslandBonus: 0,
      count: 0,
      wins: 0,
      startingIslandWins: {},
      finalIslandWins: {},
    })),
    startCombinationStats: {},
    finalCombinationStats: {},
    highestScore: Number.NEGATIVE_INFINITY,
    lowestScore: Number.POSITIVE_INFINITY,
    totalWinningScore: 0,
    oneWinnerGames: 0,
    twoWinnerGames: 0,
    threePlusWinnerGames: 0,
    sharedWinGames: 0,
    sabotageUsed: 0,
    disastersPassed: 0,
    stolenCards: 0,
    neutralized: { bear: 0, fire: 0, drought: 0, leak: 0 },
    witchHillUsed: 0,
    witchHillDiscardOnly: 0,
    witchHillDiscardAndPass: 0,
    witchDiscardedBySubtype: createSubtypeCounter(),
    witchPassedBySubtype: createSubtypeCounter(),
    witchPreventedDamage: 0,
    witchTargetDamage: 0,
    witchHillOnePassed: 0,
    witchHillTwoPassed: 0,
    mirrorAttackMoments: 0,
    mirrorAccepted: 0,
    mirrorAvailable: 0,
    mirrorUnavailableNoDanger: 0,
    mirrorUsed: 0,
    mirrorReturnedBySubtype: createSubtypeCounter(),
    mirrorPreventedDamage: 0,
    mirrorAttackerDamage: 0,
    caveRemoved: 0,
    caveZeroRemoved: 0,
    caveOneRemoved: 0,
    caveTwoRemoved: 0,
    cavePairRemoved: 0,
    caveRemovedBySubtype: createSubtypeCounter(),
    cavePreventedDamage: 0,
    caveTwoRemovedWins: 0,
    leakProcessed: 0,
    leakRemovedByCave: 0,
    leakResourceLoss: 0,
    leakLossByResource: { wood: 0, fish: 0, water: 0 },
    leakTieChoices: 0,
    leakScoreBuckets: {
      "0": { count: 0, totalScore: 0 },
      "1": { count: 0, totalScore: 0 },
      "2": { count: 0, totalScore: 0 },
    },
    maxNegativeActionsOnePlayerRoundTotal: 0,
    repeatedTargetRounds: 0,
    foodBonus: 0,
  };
}

function addSimulationScores(aggregate, scores, simulation) {
  const metrics = simulation.metrics;
  const highest = Math.max(...scores.map((score) => score.total));
  const winners = scores.filter((score) => score.total === highest);
  const winnerCount = winners.length;
  const startCombination = createIslandCombination(simulation.players, "starting");
  const finalCombination = createIslandCombination(simulation.players, "final");

  addCombinationResult(aggregate.startCombinationStats, startCombination, scores, winners);
  addCombinationResult(aggregate.finalCombinationStats, finalCombination, scores, winners);
  aggregate.totalWinningScore += highest;
  if (winnerCount === 1) {
    aggregate.oneWinnerGames += 1;
  } else if (winnerCount === 2) {
    aggregate.twoWinnerGames += 1;
    aggregate.sharedWinGames += 1;
  } else {
    aggregate.threePlusWinnerGames += 1;
    aggregate.sharedWinGames += 1;
  }

  scores.forEach((score, index) => {
    const isWinner = score.total === highest;
    addIslandObservation(aggregate.startIslandStats, score.startIslandKey, score, isWinner, { trackRelocation: true });
    addIslandObservation(aggregate.finalIslandStats, score.islandKey, score, isWinner);
    if (!score.usedCampRelocation) {
      addIslandObservation(aggregate.pureIslandStats, score.islandKey, score, isWinner);
    }
    addResourceIslandObservation(aggregate.resourceIslandStats, score);

    const playerStats = aggregate.scoreByPlayer[index];
    const simulationPlayer = simulation.players[index];
    playerStats.totalScore += score.total;
    playerStats.totalHandSize += score.handSize;
    playerStats.totalReceivedDisasters += score.receivedDisasters;
    playerStats.totalStolenCardsLost += score.stolenCardsLost;
    playerStats.totalIslandBonus += score.islandBonusPoints;
    playerStats.count += 1;
    if (isWinner) {
      playerStats.wins += 1;
      incrementCounter(playerStats.startingIslandWins, simulationPlayer.startingIslandName || score.islandName);
      incrementCounter(playerStats.finalIslandWins, score.islandName);
      if (score.islandKey === "cave" && score.caveRemovedCount === 2) {
        aggregate.caveTwoRemovedWins += 1;
      }
    }
    const leakBucket = String(Math.min(2, score.leakCards));
    aggregate.leakScoreBuckets[leakBucket].count += 1;
    aggregate.leakScoreBuckets[leakBucket].totalScore += score.total;
    aggregate.highestScore = Math.max(aggregate.highestScore, score.total);
    aggregate.lowestScore = Math.min(aggregate.lowestScore, score.total);
  });

  aggregate.sabotageUsed += metrics.sabotageUsed;
  aggregate.disastersPassed += metrics.disastersPassed;
  aggregate.stolenCards += metrics.stolenCards;
  aggregate.witchHillUsed += metrics.witchHillUsed;
  aggregate.witchHillDiscardOnly += metrics.witchHillDiscardOnly;
  aggregate.witchHillDiscardAndPass += metrics.witchHillDiscardAndPass;
  mergeCounters(aggregate.witchDiscardedBySubtype, metrics.witchDiscardedBySubtype);
  mergeCounters(aggregate.witchPassedBySubtype, metrics.witchPassedBySubtype);
  aggregate.witchPreventedDamage += metrics.witchPreventedDamage;
  aggregate.witchTargetDamage += metrics.witchTargetDamage;
  aggregate.witchHillOnePassed += metrics.witchHillOnePassed;
  aggregate.witchHillTwoPassed += metrics.witchHillTwoPassed;
  aggregate.mirrorAttackMoments += metrics.mirrorAttackMoments;
  aggregate.mirrorAccepted += metrics.mirrorAccepted;
  aggregate.mirrorAvailable += metrics.mirrorAvailable;
  aggregate.mirrorUnavailableNoDanger += metrics.mirrorUnavailableNoDanger;
  aggregate.mirrorUsed += metrics.mirrorUsed;
  mergeCounters(aggregate.mirrorReturnedBySubtype, metrics.mirrorReturnedBySubtype);
  aggregate.mirrorPreventedDamage += metrics.mirrorPreventedDamage;
  aggregate.mirrorAttackerDamage += metrics.mirrorAttackerDamage;
  aggregate.caveRemoved += metrics.caveRemoved;
  aggregate.caveZeroRemoved += metrics.caveZeroRemoved;
  aggregate.caveOneRemoved += metrics.caveOneRemoved;
  aggregate.caveTwoRemoved += metrics.caveTwoRemoved;
  aggregate.cavePairRemoved += metrics.cavePairRemoved;
  mergeCounters(aggregate.caveRemovedBySubtype, metrics.caveRemovedBySubtype);
  aggregate.cavePreventedDamage += metrics.cavePreventedDamage;
  aggregate.leakProcessed += metrics.leakProcessed;
  aggregate.leakRemovedByCave += metrics.leakRemovedByCave;
  aggregate.leakResourceLoss += metrics.leakResourceLoss;
  mergeCounters(aggregate.leakLossByResource, metrics.leakLossByResource);
  aggregate.leakTieChoices += metrics.leakTieChoices;
  aggregate.maxNegativeActionsOnePlayerRoundTotal += metrics.maxNegativeActionsOnePlayerRound;
  aggregate.repeatedTargetRounds += metrics.repeatedTargetRounds;
  aggregate.foodBonus += metrics.foodBonus;
  Object.keys(aggregate.neutralized).forEach((key) => {
    aggregate.neutralized[key] += metrics.neutralized[key] || 0;
  });
}

function createIslandStatsMap() {
  return Object.fromEntries(ISLAND_DEFINITIONS.map((island) => [island.key, {
    key: island.key,
    name: island.name,
    appearances: 0,
    wins: 0,
    totalScore: 0,
    totalScoreBeforeBonus: 0,
    totalIslandBonus: 0,
    relocated: 0,
    effectHadCount: 0,
    effectHadWins: 0,
    effectNoCount: 0,
    effectNoWins: 0,
  }]));
}

function createResourceIslandStatsMap() {
  return Object.fromEntries(["fishpond", "forest", "stream"].map((key) => [key, {
    key,
    name: ISLAND_DEFINITIONS.find((island) => island.key === key).name,
    observations: 0,
    totalMatchingResources: 0,
    totalBonus: 0,
    maxBonusReached: 0,
    extraBeyondCap: 0,
  }]));
}

function addIslandObservation(targetStats, islandKey, score, isWinner, options = {}) {
  const island = targetStats[islandKey];
  if (!island) {
    return;
  }
  island.appearances += 1;
  island.totalScore += score.total;
  island.totalScoreBeforeBonus += score.scoreBeforeIslandBonus;
  island.totalIslandBonus += score.islandBonusPoints;
  if (options.trackRelocation && score.usedCampRelocation) {
    island.relocated += 1;
  }
  if (isWinner) {
    island.wins += 1;
  }
  if (score.islandEffectHadEffect) {
    island.effectHadCount += 1;
    if (isWinner) {
      island.effectHadWins += 1;
    }
  } else {
    island.effectNoCount += 1;
    if (isWinner) {
      island.effectNoWins += 1;
    }
  }
}

function addResourceIslandObservation(resourceStats, score) {
  if (!resourceStats[score.islandKey]) {
    return;
  }
  const stats = resourceStats[score.islandKey];
  stats.observations += 1;
  stats.totalMatchingResources += score.matchingResourceAmount;
  stats.totalBonus += score.scoringBonusPoints;
  if (score.maxBonusReached) {
    stats.maxBonusReached += 1;
  }
  if (score.extraResourceBeyondCap) {
    stats.extraBeyondCap += 1;
  }
}

function createIslandCombination(players, mode) {
  const parts = players.map((player, index) => {
    const islandName = mode === "starting"
      ? player.startingIslandName || player.island?.name || "Onbekend"
      : player.island?.name || "Onbekend";
    return `P${index + 1}: ${islandName}`;
  });

  const label = parts.join(" | ");
  return {
    key: label,
    label,
  };
}

function addCombinationResult(targetStats, combination, scores, winners) {
  if (!targetStats[combination.key]) {
    targetStats[combination.key] = {
      label: combination.label,
      games: 0,
      winnerCount: 0,
      totalWinningScore: 0,
      winnerPositions: {},
    };
  }

  const entry = targetStats[combination.key];
  entry.games += 1;
  winners.forEach((winner) => {
    const playerIndex = scores.findIndex((score) => score.playerId === winner.playerId);
    entry.winnerCount += 1;
    entry.totalWinningScore += winner.total;
    incrementCounter(entry.winnerPositions, `Spelerpositie ${playerIndex + 1}`);
  });
}

function finalizeCombinationStats(stats, totalGames) {
  return Object.values(stats)
    .map((entry) => ({
      combination: entry.label,
      games: entry.games,
      gameRate: formatNumber((entry.games / totalGames) * 100),
      winnerCount: entry.winnerCount,
      averageWinningScore: entry.winnerCount ? formatNumber(entry.totalWinningScore / entry.winnerCount) : "0.0",
      topWinnerPosition: getTopCounterLabel(entry.winnerPositions),
    }))
    .sort((left, right) => right.winnerCount - left.winnerCount || right.games - left.games)
    .slice(0, 8);
}

function incrementCounter(target, key) {
  target[key] = (target[key] || 0) + 1;
}

function mergeCounters(target, source) {
  Object.entries(source || {}).forEach(([key, value]) => {
    target[key] = (target[key] || 0) + value;
  });
}

function getTopCounterLabel(counter) {
  const entries = Object.entries(counter).sort((left, right) => right[1] - left[1]);
  if (!entries.length) {
    return "Geen wins";
  }

  const [label, count] = entries[0];
  return `${label} (${count})`;
}

function finalizeSimulationAggregate(aggregate) {
  const finalIslandStats = finalizeIslandStats(aggregate.finalIslandStats, false);
  const result = {
    games: aggregate.games,
    playerCount: aggregate.playerCount,
    campRelocationEnabled: aggregate.campRelocationEnabled,
    islandStats: finalIslandStats,
    startIslandStats: finalizeIslandStats(aggregate.startIslandStats, true),
    finalIslandStats,
    pureIslandStats: finalizeIslandStats(aggregate.pureIslandStats, false),
    resourceIslandStats: finalizeResourceIslandStats(aggregate.resourceIslandStats),
    highestScore: aggregate.highestScore,
    lowestScore: aggregate.lowestScore,
    tieStats: {
      oneWinnerGames: aggregate.oneWinnerGames,
      twoWinnerGames: aggregate.twoWinnerGames,
      threePlusWinnerGames: aggregate.threePlusWinnerGames,
      averageWinningScore: formatNumber(aggregate.totalWinningScore / aggregate.games),
      sharedWinRate: formatNumber((aggregate.sharedWinGames / aggregate.games) * 100),
    },
    averageScoreByPlayer: aggregate.scoreByPlayer.map((player) => ({
      name: player.name,
      wins: player.wins,
      winRate: formatNumber((player.wins / aggregate.games) * 100),
      averageScore: player.count ? formatNumber(player.totalScore / player.count) : "0.0",
      averageHandSize: player.count ? formatNumber(player.totalHandSize / player.count) : "0.0",
      averageReceivedDisasters: player.count ? formatNumber(player.totalReceivedDisasters / player.count) : "0.0",
      averageStolenCardsLost: player.count ? formatNumber(player.totalStolenCardsLost / player.count) : "0.0",
      averageIslandBonus: player.count ? formatNumber(player.totalIslandBonus / player.count) : "0.0",
      mostWinningStartingIsland: getTopCounterLabel(player.startingIslandWins),
      mostWinningFinalIsland: getTopCounterLabel(player.finalIslandWins),
    })),
    topStartCombinations: finalizeCombinationStats(aggregate.startCombinationStats, aggregate.games),
    topFinalCombinations: finalizeCombinationStats(aggregate.finalCombinationStats, aggregate.games),
    averageSabotageUsed: formatNumber(aggregate.sabotageUsed / aggregate.games),
    averageDisastersPassed: formatNumber(aggregate.disastersPassed / aggregate.games),
    averageStolenCards: formatNumber(aggregate.stolenCards / aggregate.games),
    neutralized: aggregate.neutralized,
    witchHillUsed: aggregate.witchHillUsed,
    witchHillDiscardOnly: aggregate.witchHillDiscardOnly,
    witchHillDiscardAndPass: aggregate.witchHillDiscardAndPass,
    witchDiscardedBySubtype: aggregate.witchDiscardedBySubtype,
    witchPassedBySubtype: aggregate.witchPassedBySubtype,
    averageWitchPreventedDamage: aggregate.witchHillUsed ? formatNumber(aggregate.witchPreventedDamage / aggregate.witchHillUsed) : "0.0",
    averageWitchTargetDamage: aggregate.witchHillDiscardAndPass ? formatNumber(aggregate.witchTargetDamage / aggregate.witchHillDiscardAndPass) : "0.0",
    witchHillOnePassed: aggregate.witchHillOnePassed,
    witchHillTwoPassed: aggregate.witchHillTwoPassed,
    mirrorAttackMoments: aggregate.mirrorAttackMoments,
    mirrorAccepted: aggregate.mirrorAccepted,
    mirrorAvailable: aggregate.mirrorAvailable,
    mirrorUnavailableNoDanger: aggregate.mirrorUnavailableNoDanger,
    mirrorUsed: aggregate.mirrorUsed,
    mirrorReturnedBySubtype: aggregate.mirrorReturnedBySubtype,
    averageMirrorPreventedDamage: aggregate.mirrorUsed ? formatNumber(aggregate.mirrorPreventedDamage / aggregate.mirrorUsed) : "0.0",
    averageMirrorAttackerDamage: aggregate.mirrorUsed ? formatNumber(aggregate.mirrorAttackerDamage / aggregate.mirrorUsed) : "0.0",
    caveRemoved: aggregate.caveRemoved,
    caveZeroRemoved: aggregate.caveZeroRemoved,
    caveOneRemoved: aggregate.caveOneRemoved,
    caveTwoRemoved: aggregate.caveTwoRemoved,
    cavePairRemoved: aggregate.cavePairRemoved,
    caveRemovedBySubtype: aggregate.caveRemovedBySubtype,
    averageCavePreventedDamage: (aggregate.caveZeroRemoved + aggregate.caveOneRemoved + aggregate.caveTwoRemoved)
      ? formatNumber(aggregate.cavePreventedDamage / (aggregate.caveZeroRemoved + aggregate.caveOneRemoved + aggregate.caveTwoRemoved))
      : "0.0",
    caveTwoRemovedWinRate: aggregate.caveTwoRemoved ? formatNumber((aggregate.caveTwoRemovedWins / aggregate.caveTwoRemoved) * 100) : "0.0",
    leakProcessed: aggregate.leakProcessed,
    leakRemovedByCave: aggregate.leakRemovedByCave,
    averageLeakResourceLoss: aggregate.leakProcessed ? formatNumber(aggregate.leakResourceLoss / aggregate.leakProcessed) : "0.0",
    leakLossByResource: aggregate.leakLossByResource,
    leakTieChoices: aggregate.leakTieChoices,
    leakScoreBuckets: finalizeLeakScoreBuckets(aggregate.leakScoreBuckets),
    interactionStats: {
      averageSabotageUsed: formatNumber(aggregate.sabotageUsed / aggregate.games),
      averageWitchHillUsed: formatNumber(aggregate.witchHillUsed / aggregate.games),
      averageMirrorUsed: formatNumber(aggregate.mirrorUsed / aggregate.games),
      averageDisastersPassed: formatNumber(aggregate.disastersPassed / aggregate.games),
      averageMaxNegativeActionsOnePlayerRound: formatNumber(aggregate.maxNegativeActionsOnePlayerRoundTotal / aggregate.games),
      averageNegativeActionsPerPlayer: formatNumber(aggregate.disastersPassed / (aggregate.games * aggregate.playerCount)),
      repeatedTargetRounds: aggregate.repeatedTargetRounds,
    },
    foodBonus: aggregate.foodBonus,
  };
  result.balanceAssessment = buildAutomaticBalanceAssessment(result);
  return result;
}

function finalizeIslandStats(stats, includeRelocationRate) {
  return Object.values(stats).map((island) => ({
    name: island.name,
    appearances: island.appearances,
    wins: island.wins,
    winRate: island.appearances ? formatNumber((island.wins / island.appearances) * 100) : "0.0",
    averageScore: island.appearances ? formatNumber(island.totalScore / island.appearances) : "0.0",
    averageScoreBeforeBonus: island.appearances ? formatNumber(island.totalScoreBeforeBonus / island.appearances) : "0.0",
    averageIslandBonus: island.appearances ? formatNumber(island.totalIslandBonus / island.appearances) : "0.0",
    relocationRate: includeRelocationRate && island.appearances ? formatNumber((island.relocated / island.appearances) * 100) : "0.0",
    effectWinRate: island.effectHadCount ? formatNumber((island.effectHadWins / island.effectHadCount) * 100) : "0.0",
    noEffectWinRate: island.effectNoCount ? formatNumber((island.effectNoWins / island.effectNoCount) * 100) : "0.0",
  }));
}

function finalizeResourceIslandStats(stats) {
  return Object.values(stats).map((entry) => ({
    name: entry.name,
    observations: entry.observations,
    averageMatchingResources: entry.observations ? formatNumber(entry.totalMatchingResources / entry.observations) : "0.0",
    averageBonus: entry.observations ? formatNumber(entry.totalBonus / entry.observations) : "0.0",
    maxBonusReached: entry.maxBonusReached,
    extraBeyondCap: entry.extraBeyondCap,
  }));
}

function finalizeLeakScoreBuckets(buckets) {
  return Object.entries(buckets).map(([leakCount, entry]) => ({
    leakCount,
    observations: entry.count,
    averageScore: entry.count ? formatNumber(entry.totalScore / entry.count) : "0.0",
  }));
}

function buildAutomaticBalanceAssessment(results) {
  const islandWinRates = results.finalIslandStats.map((row) => Number(row.winRate));
  const islandScores = results.finalIslandStats.map((row) => Number(row.averageScore));
  const playerWinRates = results.averageScoreByPlayer.map((row) => Number(row.winRate));
  const playerScores = results.averageScoreByPlayer.map((row) => Number(row.averageScore));
  const islandWinSpread = Math.max(...islandWinRates) - Math.min(...islandWinRates);
  const islandScoreSpread = Math.max(...islandScores) - Math.min(...islandScores);
  const playerWinSpread = Math.max(...playerWinRates) - Math.min(...playerWinRates);
  const playerScoreSpread = Math.max(...playerScores) - Math.min(...playerScores);

  return {
    reliability: results.games >= 10000
      ? "Aantal simulaties is voldoende voor sterkere balansconclusies."
      : "Deze resultaten zijn indicatief. Voer minimaal 10.000 simulaties uit voor betrouwbaardere balansconclusies.",
    islandWinrate: assessWinrateSpread(islandWinSpread, "Eilanden"),
    islandScore: assessScoreSpread(islandScoreSpread),
    playerWinrate: assessWinrateSpread(playerWinSpread, "Spelerposities"),
    playerScore: assessScoreSpread(playerScoreSpread),
    islandWinSpread: formatNumber(islandWinSpread),
    islandScoreSpread: formatNumber(islandScoreSpread),
    playerWinSpread: formatNumber(playerWinSpread),
    playerScoreSpread: formatNumber(playerScoreSpread),
  };
}

function assessWinrateSpread(spread, subject) {
  if (spread < 5) {
    return `${subject} lijken qua winrate dicht bij elkaar te liggen.`;
  }
  if (spread <= 10) {
    return "Er is een merkbaar balansverschil.";
  }
  return "Er is waarschijnlijk een serieus balansprobleem.";
}

function assessScoreSpread(spread) {
  if (spread < 0.5) {
    return "Het verschil in gemiddelde score is klein.";
  }
  if (spread <= 1) {
    return "Het verschil in gemiddelde score is merkbaar.";
  }
  return "Het verschil in gemiddelde score is groot.";
}

function buildSimulationReport(results) {
  const islandsByWinRate = [...results.islandStats].sort((left, right) => Number(right.winRate) - Number(left.winRate));
  const islandsByScore = [...results.islandStats].sort((left, right) => Number(right.averageScore) - Number(left.averageScore));
  const bestWinRate = islandsByWinRate[0];
  const lowestWinRate = islandsByWinRate[islandsByWinRate.length - 1];
  const bestScore = islandsByScore[0];
  const lowestScore = islandsByScore[islandsByScore.length - 1];
  const winRateSpread = formatNumber(Number(bestWinRate.winRate) - Number(lowestWinRate.winRate));
  const scoreSpread = formatNumber(Number(bestScore.averageScore) - Number(lowestScore.averageScore));
  const playerScores = results.averageScoreByPlayer.map((row) => Number(row.averageScore));
  const playerScoreSpread = formatNumber(Math.max(...playerScores) - Math.min(...playerScores));
  const neutralizedLines = Object.entries(results.neutralized)
    .map(([key, value]) => `- ${getCardDefinitionBySubtype(key)?.name || key}: ${value}`)
    .join("\n");
  const startIslandLines = results.startIslandStats
    .map((row) => `- ${row.name}: ${row.appearances} keer gestart, ${row.wins} wins, ${row.winRate}% winrate, gemiddelde eindscore ${row.averageScore}, gemiddelde eilandbonus ${row.averageIslandBonus}, ${row.relocationRate}% later verhuisd`)
    .join("\n");
  const finalIslandLines = results.finalIslandStats
    .map((row) => `- ${row.name}: ${row.appearances} keer geeindigd, ${row.wins} wins, ${row.winRate}% winrate, gemiddelde eindscore ${row.averageScore}, score voor eilandbonus ${row.averageScoreBeforeBonus}, gemiddelde eilandbonus/voorkomen schade ${row.averageIslandBonus}, winrate met effect ${row.effectWinRate}%, winrate zonder effect ${row.noEffectWinRate}%`)
    .join("\n");
  const pureIslandLines = results.pureIslandStats
    .map((row) => `- ${row.name}: ${row.appearances} waarnemingen, ${row.wins} wins, ${row.winRate}% winrate, gemiddelde eindscore ${row.averageScore}, gemiddelde eilandbonus ${row.averageIslandBonus}`)
    .join("\n");
  const resourceIslandLines = results.resourceIslandStats
    .map((row) => `- ${row.name}: gemiddeld ${row.averageMatchingResources} passende resources, gemiddelde bonus ${row.averageBonus}, maximale +3 bereikt ${row.maxBonusReached} keer, vierde/vijfde passende resource aanwezig ${row.extraBeyondCap} keer`)
    .join("\n");
  const playerLines = results.averageScoreByPlayer
    .map((row) => `- ${row.name}: ${row.wins} wins, ${row.winRate}% winrate, gemiddelde score ${row.averageScore}, gemiddelde handgrootte ${row.averageHandSize}, gemiddeld ontvangen rampen ${row.averageReceivedDisasters}, gemiddeld gestolen kaarten ${row.averageStolenCardsLost}, gemiddelde eilandbonus ${row.averageIslandBonus}, vaakst winnend start-eiland: ${row.mostWinningStartingIsland}, vaakst winnend eind-eiland: ${row.mostWinningFinalIsland}`)
    .join("\n");
  const startCombinationLines = results.topStartCombinations
    .map((row) => `- ${row.combination}: ${row.games} potjes (${row.gameRate}%), ${row.winnerCount} win-count, gemiddelde winnende score ${row.averageWinningScore}, meest winnende positie: ${row.topWinnerPosition}`)
    .join("\n");
  const finalCombinationLines = results.topFinalCombinations
    .map((row) => `- ${row.combination}: ${row.games} potjes (${row.gameRate}%), ${row.winnerCount} win-count, gemiddelde winnende score ${row.averageWinningScore}, meest winnende positie: ${row.topWinnerPosition}`)
    .join("\n");
  const leakBucketLines = results.leakScoreBuckets
    .map((row) => `- Spelers met ${row.leakCount} Kano-lek-kaart(en): ${row.observations} waarnemingen, gemiddelde score ${row.averageScore}`)
    .join("\n");
  const subtypeLines = (counter) => Object.entries(counter)
    .map(([key, value]) => `- ${getCardDefinitionBySubtype(key)?.name || key}: ${value}`)
    .join("\n");

  return `# Conclusierapport Campfire Survival

## Simulatie-opzet
- Aantal gesimuleerde potjes: ${results.games}
- Aantal spelers per potje: ${results.playerCount}
- Kamp verplaatsen: ${results.campRelocationEnabled ? "normaal gebruikt" : "uitgeschakeld"}
- Alle spelers werden volledig automatisch bestuurd met vaste JavaScript-regels en willekeurige keuzes.
- Deze simulatie is bedoeld als snelle balanscheck, niet als definitief statistisch bewijs.
- Bij gelijke hoogste score telt iedere winnaar mee in de win-count.
- ${results.balanceAssessment.reliability}

## Resultaten per start-eiland
${startIslandLines}

## Resultaten per eind-eiland
${finalIslandLines}

## Zuivere resultaten zonder Kamp verplaatsen
${pureIslandLines}

## Scoreverdeling
- Hoogste score in de simulatie: ${results.highestScore}
- Laagste score in de simulatie: ${results.lowestScore}
- Beste gemiddelde score: ${bestScore.name} met ${bestScore.averageScore}
- Laagste gemiddelde score: ${lowestScore.name} met ${lowestScore.averageScore}
- Verschil tussen hoogste en laagste gemiddelde eilandscore: ${scoreSpread}
- Hoogste winpercentage: ${bestWinRate.name} met ${bestWinRate.winRate}%
- Laagste winpercentage: ${lowestWinRate.name} met ${lowestWinRate.winRate}%
- Verschil tussen hoogste en laagste winpercentage: ${winRateSpread} procentpunt

## Wins per spelerpositie
${playerLines}
- Verschil tussen beste en slechtste spelerpositie: ${playerScoreSpread}

## Winnende start-eilandcombinaties
${startCombinationLines}

## Winnende eind-eilandcombinaties
${finalCombinationLines}

## Resource-eilanden
${resourceIslandLines}

## De Grot
- 0 rampen verwijderd: ${results.caveZeroRemoved} keer
- 1 ramp verwijderd: ${results.caveOneRemoved} keer
- 2 rampen verwijderd: ${results.caveTwoRemoved} keer
- Verwijderde rampsoorten:
${subtypeLines(results.caveRemovedBySubtype)}
- Gemiddelde voorkomen schade: ${results.averageCavePreventedDamage}
- Winrate wanneer 2 rampen verwijderd werden: ${results.caveTwoRemovedWinRate}%

## De Heksenheuvel
- Kracht gebruikt: ${results.witchHillUsed} keer
- Alleen een ramp afgelegd: ${results.witchHillDiscardOnly} keer
- Ramp afgelegd en ramp doorgegeven: ${results.witchHillDiscardAndPass} keer
- Afgelegde rampsoorten:
${subtypeLines(results.witchDiscardedBySubtype)}
- Doorgegeven rampsoorten:
${subtypeLines(results.witchPassedBySubtype)}
- Gemiddelde voorkomen schade: ${results.averageWitchPreventedDamage}
- Gemiddelde schade bij het doelwit: ${results.averageWitchTargetDamage}

## De Spiegel
- Geldige aanvalsmomenten: ${results.mirrorAttackMoments}
- De Spiegel gebruikt: ${results.mirrorUsed}
- Aanval geaccepteerd: ${results.mirrorAccepted}
- Teruggestuurde rampsoorten:
${subtypeLines(results.mirrorReturnedBySubtype)}
- Gemiddelde voorkomen schade: ${results.averageMirrorPreventedDamage}
- Gemiddelde schade bij oorspronkelijke aanvaller: ${results.averageMirrorAttackerDamage}

## Kano lek
- Verwerkte Kano-lek-kaarten: ${results.leakProcessed}
- Door De Grot verwijderde Kano-lek-kaarten: ${results.leakRemovedByCave}
- Gemiddeld resourceverlies per Kano lek: ${results.averageLeakResourceLoss}
- Verloren resources:
- Hout: ${results.leakLossByResource.wood}
- Vis: ${results.leakLossByResource.fish}
- Water: ${results.leakLossByResource.water}
- Keuze door gelijke hoogste voorraad: ${results.leakTieChoices} keer
${leakBucketLines}

## Interactiekaarten en rampen
- Gemiddeld gebruikte Sabotagekaarten per potje: ${results.averageSabotageUsed}
- Gemiddeld gebruikte Heksenheuvelkrachten per potje: ${results.interactionStats.averageWitchHillUsed}
- Gemiddeld gebruikte Spiegelreacties per potje: ${results.interactionStats.averageMirrorUsed}
- Gemiddeld doorgegeven rampen per potje: ${results.interactionStats.averageDisastersPassed}
- Hoogste aantal negatieve acties op één speler in één ronde, gemiddeld per potje: ${results.interactionStats.averageMaxNegativeActionsOnePlayerRound}
- Gemiddeld aantal negatieve acties per speler: ${results.interactionStats.averageNegativeActionsPerPlayer}
- Zelfde speler meer dan één keer in dezelfde ronde geraakt: ${results.interactionStats.repeatedTargetRounds} keer
- Gemiddeld gestolen kaarten per potje: ${results.averageStolenCards}
- Het Voedselbos kreeg 3 bonuspunten: ${results.foodBonus} keer

## Tegen gehouden rampen
${neutralizedLines}

## Gelijke eindstand
- Potjes met één winnaar: ${results.tieStats.oneWinnerGames}
- Potjes met twee winnaars: ${results.tieStats.twoWinnerGames}
- Potjes met drie of meer winnaars: ${results.tieStats.threePlusWinnerGames}
- Gemiddelde winnende score: ${results.tieStats.averageWinningScore}
- Percentage potjes met gedeelde overwinning: ${results.tieStats.sharedWinRate}%

## Automatische balansbeoordeling
- Betrouwbaarheid: ${results.balanceAssessment.reliability}
- Eilandwinrate-spreiding: ${results.balanceAssessment.islandWinSpread} procentpunt. ${results.balanceAssessment.islandWinrate}
- Eilandscore-spreiding: ${results.balanceAssessment.islandScoreSpread} punt. ${results.balanceAssessment.islandScore}
- Spelerpositie-winrate-spreiding: ${results.balanceAssessment.playerWinSpread} procentpunt. ${results.balanceAssessment.playerWinrate}
- Spelerpositie-score-spreiding: ${results.balanceAssessment.playerScoreSpread} punt. ${results.balanceAssessment.playerScore}

## Eerste conclusies
- Als een eiland duidelijk hoger scoort of wint dan de rest, is dat eiland mogelijk te sterk of te makkelijk te benutten.
- Als een eiland structureel lager scoort, is de kracht mogelijk te situationeel of te zwak.
- Een groot verschil tussen spelerposities kan wijzen op beurtvolgordevoordeel.
- Veel gebruikte Sabotage en doorgegeven rampen betekenen dat interactie waarschijnlijk vaak voorkomt.
- Als De Spiegel vaak terugstuurt, kan interactie minder hard aankomen bij de verdediger maar zwaarder bij aanvallers.
- Als De Grot vaak twee rampen verwijdert, kan die kracht sterker zijn dan voorheen.
- Verschil tussen start- en eindcombinaties laat zien hoeveel invloed Kamp verplaatsen heeft op de balansmeting.

## Vragen aan ChatGPT
1. Beoordeel op basis van deze cijfers welke eilandkaarten waarschijnlijk te sterk of te zwak zijn.
2. Geef concrete balansvoorstellen voor de zwakste en sterkste eilanden.
3. Controleer of de hoeveelheid negatieve interactie via Sabotage, De Heksenheuvel en De Spiegel leuk lijkt of mogelijk frustrerend wordt.
4. Controleer of er een spelerpositie- of beurtvolgordevoordeel zichtbaar is.
5. Vergelijk start- en eind-eilandcombinaties en beoordeel of Kamp verplaatsen de balansmeting vertekent.
6. Beoordeel of het definitieve effect van Kano lek hard genoeg is.
7. Geef suggesties voor extra testmetingen die in een volgende simulatie nuttig zijn.
`;
}

function advanceGameTurn(game) {
  const previousIndex = game.currentPlayerIndex;
  game.currentPlayerIndex = (game.currentPlayerIndex + 1) % game.players.length;
  if (game.currentPlayerIndex <= previousIndex) {
    game.round += 1;
  }
}

function canHumanUseSabotage(player) {
  return player?.isHuman
    && state.currentTurn.mainActionAvailable
    && !state.currentTurn.sabotageUsed
    && player.advantages.some((card) => card.subtype === "sabotage")
    && player.hand.some((card) => card.type === "danger");
}

function canHumanUseWitchHill(player) {
  return player?.isHuman
    && state.currentTurn.mainActionAvailable
    && player.island?.effectType === "witch"
    && !player.island.used
    && player.hand.some((card) => card.type === "danger");
}

function canComputerUseSabotage(computerPlayer) {
  return canComputerUseSabotageInGame(computerPlayer) && !state.currentTurn.sabotageUsed;
}

function canComputerUseSabotageInGame(computerPlayer) {
  return computerPlayer.advantages.some((card) => card.subtype === "sabotage")
    && computerPlayer.hand.some((card) => card.type === "danger");
}

function canComputerUseWitchHill(computerPlayer) {
  return canComputerUseWitchHillInGame(computerPlayer);
}

function canComputerUseWitchHillInGame(computerPlayer) {
  return computerPlayer.island?.effectType === "witch"
    && !computerPlayer.island.used
    && computerPlayer.hand.some((card) => card.type === "danger");
}

function getComputerSabotageChance(computerPlayer) {
  const dangerCount = computerPlayer.hand.filter((card) => card.type === "danger").length;
  if (dangerCount >= 3) {
    return 0.75;
  }
  if (dangerCount === 2) {
    return 0.55;
  }
  if (dangerCount === 1) {
    return 0.35;
  }
  return 0;
}

function shouldComputerUseWitchHill(computerPlayer) {
  const dangerCount = computerPlayer.hand.filter((card) => card.type === "danger").length;
  if (dangerCount === 1) {
    return Math.random() < 0.7;
  }
  if (dangerCount >= 2) {
    return Math.random() < 0.85;
  }
  return false;
}

function shouldComputerUseMirror(player, dangerCard, actionContext) {
  if (actionContext.reflected) {
    return false;
  }
  if (dangerCard.subtype === "leak") {
    return true;
  }
  return Math.random() < 0.75;
}

function chooseRandomTarget(player, players) {
  return chooseRandomItem(players.filter((target) => target.id !== player.id));
}

function chooseRandomItem(items) {
  if (!items.length) {
    return null;
  }
  return items[Math.floor(Math.random() * items.length)];
}

function countResources(cards) {
  return cards.reduce((totals, card) => {
    if (card.type === "resource") {
      totals[card.subtype] += 1;
    }
    return totals;
  }, { wood: 0, fish: 0, water: 0 });
}

function countBySubtype(cards) {
  return cards.reduce((totals, card) => {
    totals[card.subtype] = (totals[card.subtype] || 0) + 1;
    return totals;
  }, {});
}

function createSubtypeCounter() {
  return { bear: 0, fire: 0, drought: 0, leak: 0 };
}

function calculateCappedDoubleResourceScore(amount) {
  const doubledAmount = Math.min(amount, 3);
  const normalAmount = Math.max(0, amount - 3);
  return doubledAmount * 2 + normalAmount;
}

function sumResources(resources) {
  return resources.wood + resources.fish + resources.water;
}

function chooseMostDamagingDangerForPlayer(player, dangers) {
  const damageByCardId = estimateDangerDamageMapForPlayer(player);
  const scored = dangers.map((card) => ({
    card,
    damage: damageByCardId[card.id] || 0,
  }));
  const highestDamage = Math.max(...scored.map((item) => item.damage));
  return chooseRandomItem(scored.filter((item) => item.damage === highestDamage)).card;
}

function estimateDangerDamageMapForPlayer(player) {
  const damageByCardId = {};
  const resources = countResources(player.hand);
  const protectionCounts = countBySubtype(player.advantages);
  const dangers = player.hand.filter((card) => card.type === "danger");

  ["bear", "fire", "drought"].forEach((subtype) => {
    dangers.filter((card) => card.subtype === subtype).forEach((card) => {
      const protection = PROTECTION_MAP[subtype];
      const effect = DISASTER_EFFECTS[subtype];
      if (protection && protectionCounts[protection.advantage] > 0) {
        protectionCounts[protection.advantage] -= 1;
        damageByCardId[card.id] = 0;
      } else {
        damageByCardId[card.id] = Math.min(effect.amount, resources[effect.resource]);
      }
    });
  });

  dangers.filter((card) => card.subtype === "leak").forEach((card) => {
    damageByCardId[card.id] = getHighestResourceTypes(resources).length > 0 ? 1 : 0;
  });

  return damageByCardId;
}

function estimateDangerDamageForPlayer(card, player, resources = countResources(player.hand)) {
  if (!card) {
    return 0;
  }
  if (card.subtype === "leak") {
    return getHighestResourceTypes(resources).length > 0 ? 1 : 0;
  }

  const effect = DISASTER_EFFECTS[card.subtype];
  const protection = PROTECTION_MAP[card.subtype];
  if (!effect?.resource) {
    return 0;
  }
  if (protection && player.advantages.some((advantage) => advantage.subtype === protection.advantage)) {
    return 0;
  }
  return Math.min(effect.amount, resources[effect.resource]);
}

function calculateIslandEffectValue(player, islandScore) {
  if (RESOURCE_ISLANDS[player.island.effectType] || player.island.effectType === "food_bonus") {
    return islandScore.bonusPoints;
  }
  if (player.island.effectType === "cave") {
    return player.cavePreventedDamage;
  }
  if (player.island.effectType === "witch") {
    return player.witchPreventedDamage;
  }
  if (player.island.effectType === "mirror") {
    return player.mirrorPreventedDamage;
  }
  return 0;
}

function recordWitchHillDiscard(game, player, discarded) {
  game.metrics.witchHillUsed += 1;
  game.metrics.witchDiscardedBySubtype[discarded.subtype] += 1;
  const preventedDamage = estimateDangerDamageForPlayer(discarded, player);
  player.witchPreventedDamage += preventedDamage;
  game.metrics.witchPreventedDamage += preventedDamage;
}

function recordPassedDisaster(game, sourceName, card, target) {
  if (sourceName === "De Heksenheuvel") {
    game.metrics.witchPassedBySubtype[card.subtype] += 1;
    const targetDamage = estimateDangerDamageForPlayer(card, target);
    target.witchTargetDamage += targetDamage;
    game.metrics.witchTargetDamage += targetDamage;
  }
}

function recordMirrorReturn(game, attacker, target, dangerCard) {
  game.metrics.mirrorReturnedBySubtype[dangerCard.subtype] += 1;
  const preventedDamage = estimateDangerDamageForPlayer(dangerCard, target);
  const attackerDamage = estimateDangerDamageForPlayer(dangerCard, attacker);
  target.mirrorPreventedDamage += preventedDamage;
  attacker.mirrorAttackerDamage += attackerDamage;
  game.metrics.mirrorPreventedDamage += preventedDamage;
  game.metrics.mirrorAttackerDamage += attackerDamage;
}

function registerNegativeAction(game, target) {
  target.negativeActionsReceived += 1;
  const roundKey = `${game.round || 1}:${target.id}`;
  const previous = game.metrics.negativeActionsByRound[roundKey] || 0;
  const next = previous + 1;
  game.metrics.negativeActionsByRound[roundKey] = next;
  game.metrics.maxNegativeActionsOnePlayerRound = Math.max(game.metrics.maxNegativeActionsOnePlayerRound, next);
  if (next === 2) {
    game.metrics.repeatedTargetRounds += 1;
  }
}

function removeCardFromHand(player, cardId) {
  const index = player.hand.findIndex((card) => card.id === Number(cardId));
  if (index < 0) {
    return null;
  }
  const [card] = player.hand.splice(index, 1);
  return card;
}

function removeFirstAdvantage(player, subtype) {
  const index = player.advantages.findIndex((card) => card.subtype === subtype);
  if (index < 0) {
    return null;
  }
  const [card] = player.advantages.splice(index, 1);
  return card;
}

function getActivePlayer() {
  return state.players[state.currentPlayerIndex];
}

function getPlayer(playerId) {
  return state.players.find((player) => player.id === playerId);
}

function getOtherPlayers(player) {
  return state.players.filter((candidate) => candidate.id !== player.id);
}

function getCardDefinition(key) {
  return CARD_DEFINITIONS.find((definition) => definition.key === key);
}

function getCardDefinitionBySubtype(subtype) {
  return CARD_DEFINITIONS.find((definition) => definition.subtype === subtype);
}

function createCard(key) {
  const definition = getCardDefinition(key);
  return {
    id: nextCardInstanceId += 1,
    name: definition.name,
    type: definition.type,
    subtype: definition.subtype,
    description: definition.description,
    effect: definition.subtype,
    icon: definition.icon,
  };
}

function createIsland(definition) {
  return {
    id: `island-${definition.key}`,
    key: definition.key,
    name: definition.name,
    type: "island",
    description: definition.description,
    effectType: definition.effectType,
    icon: definition.icon,
    used: false,
  };
}

function setPlayerIsland(player, island, options = {}) {
  player.island = island;
  player.currentIslandId = island?.key || null;
  if (island) {
    player.islandHistory.push(island.key);
  }

  if (options.asStartingIsland && island) {
    player.startIslandId = island.key;
    player.startingIslandKey = island.key;
    player.startingIslandName = island.name;
  }
}

function createMetrics() {
  return {
    sabotageUsed: 0,
    disastersPassed: 0,
    stolenCards: 0,
    neutralized: { bear: 0, fire: 0, drought: 0, leak: 0 },
    witchHillUsed: 0,
    witchHillDiscardOnly: 0,
    witchHillDiscardAndPass: 0,
    witchDiscardedBySubtype: createSubtypeCounter(),
    witchPassedBySubtype: createSubtypeCounter(),
    witchPreventedDamage: 0,
    witchTargetDamage: 0,
    witchHillOnePassed: 0,
    witchHillTwoPassed: 0,
    mirrorAttackMoments: 0,
    mirrorAccepted: 0,
    mirrorAvailable: 0,
    mirrorUnavailableNoDanger: 0,
    mirrorUsed: 0,
    mirrorReturnedBySubtype: createSubtypeCounter(),
    mirrorPreventedDamage: 0,
    mirrorAttackerDamage: 0,
    caveRemoved: 0,
    caveZeroRemoved: 0,
    caveOneRemoved: 0,
    caveTwoRemoved: 0,
    cavePairRemoved: 0,
    caveRemovedBySubtype: createSubtypeCounter(),
    cavePreventedDamage: 0,
    leakProcessed: 0,
    leakRemovedByCave: 0,
    leakResourceLoss: 0,
    leakLossByResource: { wood: 0, fish: 0, water: 0 },
    leakTieChoices: 0,
    negativeActionsByRound: {},
    maxNegativeActionsOnePlayerRound: 0,
    repeatedTargetRounds: 0,
    foodBonus: 0,
  };
}

function addLog(message) {
  addGameLog(state, message);
}

function addGameLog(game, message) {
  if (!game.log) {
    return;
  }
  game.log.push(message);
  if (game.log.length > 100) {
    game.log.shift();
  }
}

function getIslandPowerStatus(player) {
  if (!isOneTimeIsland(player.island)) {
    return "Niet eenmalig";
  }
  return player.island.used ? "Gebruikt" : "Ongebruikt";
}

function isOneTimeIsland(island) {
  return ["cave", "witch", "mirror"].includes(island?.effectType);
}

async function chooseOwnDanger(player, title, message) {
  const dangers = player.hand.filter((card) => card.type === "danger");
  if (dangers.length === 0) {
    addLog(`${player.name} heeft geen rampkaart om te kiezen.`);
    return null;
  }
  const choice = await showChoice(title, message, [
    ...dangers.map((card) => ({
      label: card.name,
      description: card.description,
      value: card.id,
    })),
    {
      label: "Annuleren",
      description: "Gebruik deze extra actie nu niet.",
      value: null,
    },
  ]);
  return choice ? player.hand.find((card) => card.id === choice) : null;
}

function choosePlayer(title, players, message) {
  return showChoice(title, message, players.map((player) => ({
    label: player.name,
    description: `${player.hand.length} handkaart(en), ${player.advantages.length} voordeelkaart(en).`,
    value: player.id,
  })));
}

function showChoice(title, message, options) {
  return new Promise((resolve) => {
    modalRoot.classList.add("is-open");
    modalRoot.setAttribute("aria-hidden", "false");
    modalRoot.innerHTML = `
      <section class="modal-card" role="dialog" aria-modal="true" aria-label="${escapeHtml(title)}">
        <h2>${escapeHtml(title)}</h2>
        <p>${escapeHtml(message)}</p>
        <div class="modal-actions">
          ${options.map((option, index) => `
            <button type="button" class="choice-button" data-choice-index="${index}" ${option.disabled ? "disabled" : ""}>
              <strong>${escapeHtml(option.label)}</strong>
              <span>${escapeHtml(option.description || "")}</span>
            </button>
          `).join("")}
        </div>
      </section>
    `;

    modalRoot.querySelectorAll("[data-choice-index]").forEach((button) => {
      button.addEventListener("click", () => {
        const option = options[Number(button.dataset.choiceIndex)];
        closeModal();
        resolve(option.value);
      }, { once: true });
    });
  });
}

function showMultiCardChoice(title, message, cards, maxSelection) {
  return new Promise((resolve) => {
    modalRoot.classList.add("is-open");
    modalRoot.setAttribute("aria-hidden", "false");
    modalRoot.innerHTML = `
      <section class="modal-card" role="dialog" aria-modal="true" aria-label="${escapeHtml(title)}">
        <h2>${escapeHtml(title)}</h2>
        <p>${escapeHtml(message)}</p>
        <div class="modal-actions">
          ${cards.map((card) => `
            <label class="choice-button multi-choice">
              <input type="checkbox" data-card-id="${card.id}">
              <strong>${escapeHtml(card.name)}</strong>
              <span>${escapeHtml(card.description)}</span>
            </label>
          `).join("")}
        </div>
        <div class="modal-actions">
          <button type="button" class="primary-button" data-confirm-multi>Bevestigen</button>
          <button type="button" class="secondary-button" data-skip-multi>Geen rampen verwijderen</button>
        </div>
      </section>
    `;

    const checkboxes = [...modalRoot.querySelectorAll("[data-card-id]")];
    const updateDisabledState = () => {
      const checkedCount = checkboxes.filter((checkbox) => checkbox.checked).length;
      checkboxes.forEach((checkbox) => {
        checkbox.disabled = !checkbox.checked && checkedCount >= maxSelection;
      });
    };

    checkboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", updateDisabledState);
    });

    modalRoot.querySelector("[data-confirm-multi]").addEventListener("click", () => {
      const selectedIds = checkboxes
        .filter((checkbox) => checkbox.checked)
        .map((checkbox) => Number(checkbox.dataset.cardId))
        .slice(0, maxSelection);
      closeModal();
      resolve(selectedIds);
    }, { once: true });

    modalRoot.querySelector("[data-skip-multi]").addEventListener("click", () => {
      closeModal();
      resolve([]);
    }, { once: true });
  });
}

function showMessage(title, html, closeLabel) {
  modalRoot.classList.add("is-open");
  modalRoot.setAttribute("aria-hidden", "false");
  modalRoot.innerHTML = `
    <section class="modal-card" role="dialog" aria-modal="true" aria-label="${escapeHtml(title)}">
      <h2>${escapeHtml(title)}</h2>
      <div class="rules-content">${html}</div>
      <div class="modal-actions">
        <button type="button" class="primary-button" data-close-modal>${escapeHtml(closeLabel)}</button>
      </div>
    </section>
  `;
  modalRoot.querySelector("[data-close-modal]").addEventListener("click", closeModal, { once: true });
}

function closeModal() {
  modalRoot.classList.remove("is-open");
  modalRoot.setAttribute("aria-hidden", "true");
  modalRoot.innerHTML = "";
}

async function runLocked(task) {
  if (state.processing) {
    return;
  }
  state.processing = true;
  renderInterface();
  try {
    await task();
  } finally {
    state.processing = false;
    renderInterface();
  }
}

function resetGame() {
  state.gameStarted = false;
  state.gameOver = false;
  state.scoringStarted = false;
  state.processing = false;
  state.computerRunning = false;
  state.players = [];
  state.deck = [];
  state.discard = [];
  state.unusedIslands = [];
  state.log = [];
  state.finalScores = [];
  state.simulationResults = null;
  closeModal();
  renderNameFields();
  renderInterface();
}

function openRules() {
  showMessage("Spelregels", getRulesHtml(), "Sluiten");
}

function computerPause() {
  const delay = COMPUTER_SPEED_DELAYS[state.computerSpeed] || 0;
  if (delay === 0) {
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    window.setTimeout(resolve, delay);
  });
}

function syncDebugDefaults() {
  if (!state.players.length) {
    return;
  }
  const active = getActivePlayer();
  if (!getPlayer(state.debug.playerId)) {
    state.debug.playerId = active.id;
  }
  if (!getPlayer(state.debug.handPlayerId)) {
    state.debug.handPlayerId = active.id;
  }
  if (!getPlayer(state.debug.activePlayerId)) {
    state.debug.activePlayerId = active.id;
  }
  const handPlayer = getPlayer(state.debug.handPlayerId) || active;
  if (!handPlayer.hand.some((card) => card.id === Number(state.debug.handCardId))) {
    state.debug.handCardId = handPlayer.hand[0]?.id ? String(handPlayer.hand[0].id) : "";
  }
}

function setSelectValue(id, value) {
  const element = document.getElementById(id);
  if (element) {
    element.value = value;
  }
}

function formatList(items) {
  return items.length ? items.join(", ") : "Geen";
}

function formatCardNames(cards) {
  return cards.map((card) => card.name).join(", ");
}

function formatNeutralized(items) {
  if (!items.length) {
    return "Geen";
  }
  return items.map((item) => `${item.danger.name} door ${item.by}`).join(", ");
}

function formatExecuted(items) {
  if (!items.length) {
    return "Geen";
  }
  return items.map((item) => `${item.danger.name} (${item.effect})`).join(", ");
}

function formatNumber(value) {
  return Number(value).toFixed(1);
}

function getRulesHtml() {
  return `
    <section>
      <h3>Singleplayer</h3>
      <p>Jij bestuurt Speler 1. Alle andere spelers zijn computerspelers met vaste JavaScript-regels en willekeurige keuzes.</p>
    </section>
    <section>
      <h3>Beurt</h3>
      <ol>
        <li>Tijdens jouw beurt kies je eventueel Sabotage of De Heksenheuvel als extra actie.</li>
        <li>Daarna kies je één hoofdactie: trek een kaart of steel een willekeurige handkaart.</li>
        <li>Na jouw hoofdactie voeren alle computerspelers hun beurten automatisch uit totdat jij weer aan de beurt bent.</li>
      </ol>
    </section>
    <section>
      <h3>Computerregels</h3>
      <p>Een computerspeler trekt met 65% kans een kaart en steelt met 35% kans een willekeurige handkaart van een geldige tegenstander. Sabotage gebruikt hij alleen met rampkaarten: 35% kans bij één ramp, 55% bij twee rampen en 75% bij drie of meer. De Heksenheuvel legt eerst één ramp af en geeft daarna maximaal één andere ramp door. De Spiegel wordt met 75% kans gebruikt en altijd tegen Kano lek.</p>
    </section>
    <section>
      <h3>Kaarten</h3>
      <ul>
        <li>Grondstoffen: Hout x8, Vis x8, Water x8.</li>
        <li>Rampen: Beer x2, Bosbrand x2, Droogte x2, Kano lek x2.</li>
        <li>Voordelen: Bijl x2, Hengel x2, Regenbui x2, Sabotage x3.</li>
        <li>Speciaal: Motorboot x2, Plundertocht x2, Kamp verplaatsen x2.</li>
      </ul>
    </section>
    <section>
      <h3>Einde en score</h3>
      <p>Het spel eindigt wanneer de trekstapel leeg is. De Grot verwijdert eerst maximaal twee rampkaarten. Daarna blokkeren Bijl, Hengel en Regenbui passende rampen. Beer kost 2 Vis, Bosbrand 2 Hout en Droogte 2 Water. Iedere Kano lek kost daarna afzonderlijk 1 resource uit de grootste voorraad. De Visvijver, Het Bos en Het Riviertje verdubbelen alleen de eerste drie passende resources.</p>
    </section>
  `;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
