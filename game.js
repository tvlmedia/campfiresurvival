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
    description: "Ramp. Geen effect - regel nog in ontwikkeling.",
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
    description: "Iedere Vis die je aan het einde overhoudt, telt voor 2 punten.",
    effectType: "double_fish",
  },
  {
    key: "forest",
    name: "Het Bos",
    icon: "🌲",
    description: "Ieder Hout dat je aan het einde overhoudt, telt voor 2 punten.",
    effectType: "double_wood",
  },
  {
    key: "stream",
    name: "Het Riviertje",
    icon: "💧",
    description: "Ieder Water dat je aan het einde overhoudt, telt voor 2 punten.",
    effectType: "double_water",
  },
  {
    key: "cave",
    name: "De Grot",
    icon: "🕳️",
    description: "Aan het einde mag je één ramp uit je hand wegleggen voordat rampen werken.",
    effectType: "cave",
  },
  {
    key: "witch",
    name: "De Heksenheuvel",
    icon: "🌙",
    description: "Eén keer tijdens je eigen beurt mag je één ramp aan een andere speler geven.",
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
    description: "Eén keer kun je een ramp die iemand jou geeft weigeren en een ramp teruggeven.",
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
  leak: { resource: null, amount: 0, text: "Geen effect - regel nog in ontwikkeling." },
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
  },
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
      removedByCave: [],
    };
  });
}

function generateDeck() {
  const deck = [];
  CARD_DEFINITIONS.forEach((definition) => {
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
    player.island = islandPool.shift();
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

  if (canComputerUseSabotage(computerPlayer) && Math.random() < 0.5) {
    await computerUseSabotage(computerPlayer);
    await computerPause();
  }

  if (canComputerUseWitchHill(computerPlayer) && Math.random() < 0.35) {
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
  addLog(`${player.name} gebruikte Sabotage tegen ${getPlayer(targetId).name}.`);
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
  addLog(`${computerPlayer.name} gebruikte Sabotage tegen ${target.name}.`);
  await handleMirrorReaction(computerPlayer, target, dangerCard, "Sabotage");
}

async function useHumanWitchHill() {
  const player = getActivePlayer();
  if (!canHumanUseWitchHill(player)) {
    return;
  }

  const dangerCard = await chooseOwnDanger(player, "De Heksenheuvel", "Kies een rampkaart uit je eigen hand.");
  if (!dangerCard) {
    return;
  }
  const targetId = await choosePlayer("De Heksenheuvel", getOtherPlayers(player), "Kies de computerspeler die de ramp krijgt.");
  player.island.used = true;
  await handleMirrorReaction(player, getPlayer(targetId), dangerCard, "De Heksenheuvel");
  addLog(`${player.name} gebruikte De Heksenheuvel.`);
}

async function computerUseWitchHill(computerPlayer) {
  const dangerCard = chooseRandomItem(computerPlayer.hand.filter((card) => card.type === "danger"));
  const target = chooseRandomTarget(computerPlayer, state.players);
  if (!dangerCard || !target) {
    return;
  }

  computerPlayer.island.used = true;
  addLog(`${computerPlayer.name} gebruikte De Heksenheuvel.`);
  await handleMirrorReaction(computerPlayer, target, dangerCard, "De Heksenheuvel");
}

async function handleMirrorReaction(attacker, target, dangerCard, sourceName) {
  state.metrics.disastersPassed += 1;

  if (target.island?.effectType === "mirror" && !target.island.used) {
    const usesMirror = target.isHuman
      ? await askHumanMirrorChoice(attacker, target, dangerCard, sourceName)
      : Math.random() < 0.6;

    if (usesMirror) {
      await resolveMirrorReturn(attacker, target, dangerCard);
      target.island.used = true;
      state.metrics.mirrorUsed += 1;
      return { accepted: false, mirrored: true };
    }
  }

  const transferred = removeCardFromHand(attacker, dangerCard.id);
  if (transferred) {
    target.hand.push(transferred);
    addLog(`${target.name} kreeg een ${transferred.name} van ${attacker.name}.`);
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
      description: "Weiger de ramp en geef een ramp terug.",
      value: "mirror",
    },
  ]);
  return choice === "mirror";
}

async function resolveMirrorReturn(attacker, target, dangerCard) {
  const ownDangers = target.hand.filter((card) => card.type === "danger");
  let returnChoice = { mode: "same" };

  if (target.isHuman) {
    returnChoice = await showChoice("De Spiegel", "Kies welke ramp teruggaat naar de aanvaller.", [
      {
        label: `De aangeboden ${dangerCard.name} teruggeven`,
        description: `${dangerCard.name} blijft bij ${attacker.name}.`,
        value: { mode: "same" },
      },
      ...ownDangers.map((card) => ({
        label: `Eigen ${card.name} teruggeven`,
        description: "Deze ramp verdwijnt uit je hand.",
        value: { mode: "own", cardId: card.id },
      })),
    ]);
  } else if (ownDangers.length > 0 && Math.random() < 0.5) {
    returnChoice = { mode: "own", cardId: chooseRandomItem(ownDangers).id };
  }

  if (returnChoice.mode === "own") {
    const returned = removeCardFromHand(target, returnChoice.cardId);
    if (returned) {
      attacker.hand.push(returned);
      addLog(`${target.name} gebruikte De Spiegel en gaf een ${returned.name} terug aan ${attacker.name}.`);
    }
  } else {
    addLog(`${target.name} gebruikte De Spiegel en gaf de ${dangerCard.name} terug aan ${attacker.name}.`);
  }
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
      continue;
    }

    if (player.isHuman) {
      const choice = await showChoice("De Grot", "Kies eventueel één ramp om weg te leggen voordat rampen worden verwerkt.", [
        {
          label: "Geen ramp wegleggen",
          description: "Alle rampen blijven in je hand.",
          value: null,
        },
        ...dangers.map((card) => ({
          label: card.name,
          description: card.description,
          value: card.id,
        })),
      ]);
      if (choice) {
        removeDangerWithCave(player, choice, state);
      }
    } else {
      removeDangerWithCave(player, chooseRandomItem(dangers).id, state);
    }
  }

  state.finalScores = calculateFinalScore(state, state.metrics);
  state.gameOver = true;
  state.gameStarted = false;
  renderInterface();
}

function removeDangerWithCave(player, cardId, game) {
  const removed = removeCardFromHand(player, cardId);
  if (!removed) {
    return null;
  }
  player.removedByCave.push(removed);
  player.island.used = true;
  game.discard.push(removed);
  game.metrics.caveRemoved += 1;
  addGameLog(game, `${player.name} verwijderde met De Grot een ramp.`);
  return removed;
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

function applyDisasters(startResources, pendingDangers) {
  const remaining = { ...startResources };
  const executed = [];

  pendingDangers.forEach((danger) => {
    const effect = DISASTER_EFFECTS[danger.subtype];
    if (!effect || !effect.resource) {
      executed.push({ danger, effect: effect?.text || "Geen effect." });
      return;
    }

    remaining[effect.resource] = Math.max(0, remaining[effect.resource] - effect.amount);
    executed.push({ danger, effect: effect.text });
  });

  return { remaining, executed };
}

function calculateIslandBonus(player, remainingResources, metrics) {
  let woodScore = remainingResources.wood;
  let fishScore = remainingResources.fish;
  let waterScore = remainingResources.water;
  let bonusPoints = 0;
  let islandBonus = "Geen scorebonus.";

  if (player.island.effectType === "double_wood") {
    woodScore = remainingResources.wood * 2;
    islandBonus = "Hout telt dubbel.";
  }
  if (player.island.effectType === "double_fish") {
    fishScore = remainingResources.fish * 2;
    islandBonus = "Vis telt dubbel.";
  }
  if (player.island.effectType === "double_water") {
    waterScore = remainingResources.water * 2;
    islandBonus = "Water telt dubbel.";
  }
  if (player.island.effectType === "food_bonus") {
    const hasSet = remainingResources.wood >= 1 && remainingResources.fish >= 1 && remainingResources.water >= 1;
    bonusPoints = hasSet ? 3 : 0;
    islandBonus = hasSet ? "Voedselbos geeft 3 bonuspunten." : "Voedselbos bonus niet gehaald.";
    if (hasSet) {
      metrics.foodBonus += 1;
    }
  }

  return {
    woodScore,
    fishScore,
    waterScore,
    bonusPoints,
    islandBonus,
    total: woodScore + fishScore + waterScore + bonusPoints,
  };
}

function calculateFinalScore(game, metrics) {
  return game.players.map((player) => {
    const startResources = countResources(player.hand);
    const { neutralized, pending } = neutralizeDisasters(player, metrics);
    const { remaining, executed } = applyDisasters(startResources, pending);
    const islandScore = calculateIslandBonus(player, remaining, metrics);

    return {
      playerId: player.id,
      playerName: player.name,
      islandKey: player.island.key,
      islandName: player.island.name,
      startResources,
      rampCards: player.hand.filter((card) => card.type === "danger").map((card) => card.name),
      removedByCave: player.removedByCave.map((card) => card.name),
      neutralized,
      executed,
      remaining,
      islandScore,
      total: islandScore.total,
    };
  });
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
          <option value="10">10 potjes simuleren</option>
          <option value="100">100 potjes simuleren</option>
          <option value="1000">1.000 potjes simuleren</option>
        </select>
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
}

function renderSimulationResults() {
  const results = state.simulationResults;
  if (!results) {
    return "";
  }
  const report = buildSimulationReport(results);

  const islandRows = results.islandStats.map((row) => `
    <tr>
      <td>${escapeHtml(row.name)}</td>
      <td>${row.wins}</td>
      <td>${row.winRate}%</td>
      <td>${row.averageScore}</td>
    </tr>
  `).join("");
  const playerRows = results.averageScoreByPlayer.map((row) => `
    <tr>
      <td>${escapeHtml(row.name)}</td>
      <td>${row.averageScore}</td>
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
      <h3>Simulatieresultaten (${results.games} potjes, ${results.playerCount} spelers)</h3>
      <table class="stats-table">
        <thead><tr><th>Eiland</th><th>Wins</th><th>Win%</th><th>Gem. score</th></tr></thead>
        <tbody>${islandRows}</tbody>
      </table>
      <table class="stats-table">
        <thead><tr><th>Spelerpositie</th><th>Gem. score</th></tr></thead>
        <tbody>${playerRows}</tbody>
      </table>
      <table class="stats-table">
        <thead><tr><th>Statistiek</th><th>Waarde</th></tr></thead>
        <tbody>
          <tr><td>Hoogste score</td><td>${results.highestScore}</td></tr>
          <tr><td>Laagste score</td><td>${results.lowestScore}</td></tr>
          <tr><td>Gemiddeld gebruikte Sabotagekaarten</td><td>${results.averageSabotageUsed}</td></tr>
          <tr><td>Gemiddeld doorgegeven rampen</td><td>${results.averageDisastersPassed}</td></tr>
          <tr><td>De Spiegel gebruikt</td><td>${results.mirrorUsed}</td></tr>
          <tr><td>De Grot verwijderde een ramp</td><td>${results.caveRemoved}</td></tr>
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
    const games = Number(state.debug.simulationGames);
    state.simulationResults = simulateGames(games, state.players.length || state.selectedPlayerCount);
    addLog(`Debug: ${games} potjes gesimuleerd voor balanscontrole.`);
  }

  if (action === "debug-run-100-simulation") {
    state.debug.simulationGames = "100";
    state.simulationResults = simulateGames(100, state.players.length || state.selectedPlayerCount);
    addLog("Debug: 100 potjes volledig automatisch gespeeld.");
  }
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
    otherHolder.island = oldIsland ? { ...oldIsland, used: false } : null;
  } else if (unusedIndex >= 0) {
    game.unusedIslands.splice(unusedIndex, 1);
    if (oldIsland) {
      game.unusedIslands.push({ ...oldIsland, used: false });
    }
  }

  player.island = createIsland(islandDefinition);
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
  player.island = { ...newIsland, used: false };
  addGameLog(game, `${player.name} verplaatste het kamp en kreeg een nieuw geheim eiland.`);
}

function simulateGames(gameCount, playerCount) {
  const aggregate = createSimulationAggregate(gameCount, playerCount);

  for (let index = 0; index < gameCount; index += 1) {
    const simulation = createSimulationGame(playerCount);
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
    addSimulationScores(aggregate, scores, simulation.metrics);
  }

  return finalizeSimulationAggregate(aggregate);
}

function createSimulationGame(playerCount) {
  const game = {
    players: createPlayers(playerCount, "Computer 1", true),
    deck: shuffleDeck(generateDeck()),
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
  if (canComputerUseSabotageInGame(computerPlayer) && Math.random() < 0.5) {
    computerUseSabotageInstant(game, computerPlayer);
  }
  if (canComputerUseWitchHillInGame(computerPlayer) && Math.random() < 0.35) {
    computerUseWitchHillInstant(game, computerPlayer);
  }

  const stealTargets = game.players.filter((target) => target.id !== computerPlayer.id && target.hand.length > 0);
  if (stealTargets.length > 0 && Math.random() < 0.35) {
    stealRandomHandCardsInstant(computerPlayer, chooseRandomItem(stealTargets), 1);
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
    stealRandomHandCardsInstant(player, chooseRandomItem(handTargets), 3);
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
  handleMirrorReactionInstant(game, computerPlayer, target, dangerCard);
}

function computerUseWitchHillInstant(game, computerPlayer) {
  const dangerCard = chooseRandomItem(computerPlayer.hand.filter((card) => card.type === "danger"));
  const target = chooseRandomTarget(computerPlayer, game.players);
  if (!dangerCard || !target) {
    return;
  }
  computerPlayer.island.used = true;
  handleMirrorReactionInstant(game, computerPlayer, target, dangerCard);
}

function handleMirrorReactionInstant(game, attacker, target, dangerCard) {
  game.metrics.disastersPassed += 1;
  if (target.island?.effectType === "mirror" && !target.island.used && Math.random() < 0.6) {
    const ownDangers = target.hand.filter((card) => card.type === "danger");
    if (ownDangers.length > 0 && Math.random() < 0.5) {
      const returned = removeCardFromHand(target, chooseRandomItem(ownDangers).id);
      if (returned) {
        attacker.hand.push(returned);
      }
    }
    target.island.used = true;
    game.metrics.mirrorUsed += 1;
    return;
  }

  const transferred = removeCardFromHand(attacker, dangerCard.id);
  if (transferred) {
    target.hand.push(transferred);
  }
}

function stealRandomHandCardsInstant(thief, target, amount) {
  const stealAmount = Math.min(amount, target.hand.length);
  for (let index = 0; index < stealAmount; index += 1) {
    const randomIndex = Math.floor(Math.random() * target.hand.length);
    const [card] = target.hand.splice(randomIndex, 1);
    thief.hand.push(card);
  }
}

function processCavesInstant(game) {
  game.players.forEach((player) => {
    player.removedByCave = [];
    if (player.island?.effectType !== "cave") {
      return;
    }
    const dangers = player.hand.filter((card) => card.type === "danger");
    if (dangers.length > 0) {
      removeDangerWithCave(player, chooseRandomItem(dangers).id, game);
    }
  });
}

function createSimulationAggregate(games, playerCount) {
  return {
    games,
    playerCount,
    islandStats: Object.fromEntries(ISLAND_DEFINITIONS.map((island) => [island.key, {
      key: island.key,
      name: island.name,
      appearances: 0,
      wins: 0,
      totalScore: 0,
    }])),
    scoreByPlayer: Array.from({ length: playerCount }, (_, index) => ({
      name: `Spelerpositie ${index + 1}`,
      totalScore: 0,
      count: 0,
    })),
    highestScore: Number.NEGATIVE_INFINITY,
    lowestScore: Number.POSITIVE_INFINITY,
    sabotageUsed: 0,
    disastersPassed: 0,
    neutralized: { bear: 0, fire: 0, drought: 0, leak: 0 },
    mirrorUsed: 0,
    caveRemoved: 0,
    foodBonus: 0,
  };
}

function addSimulationScores(aggregate, scores, metrics) {
  const highest = Math.max(...scores.map((score) => score.total));
  scores.forEach((score, index) => {
    const island = aggregate.islandStats[score.islandKey];
    island.appearances += 1;
    island.totalScore += score.total;
    if (score.total === highest) {
      island.wins += 1;
    }

    aggregate.scoreByPlayer[index].totalScore += score.total;
    aggregate.scoreByPlayer[index].count += 1;
    aggregate.highestScore = Math.max(aggregate.highestScore, score.total);
    aggregate.lowestScore = Math.min(aggregate.lowestScore, score.total);
  });

  aggregate.sabotageUsed += metrics.sabotageUsed;
  aggregate.disastersPassed += metrics.disastersPassed;
  aggregate.mirrorUsed += metrics.mirrorUsed;
  aggregate.caveRemoved += metrics.caveRemoved;
  aggregate.foodBonus += metrics.foodBonus;
  Object.keys(aggregate.neutralized).forEach((key) => {
    aggregate.neutralized[key] += metrics.neutralized[key] || 0;
  });
}

function finalizeSimulationAggregate(aggregate) {
  return {
    games: aggregate.games,
    playerCount: aggregate.playerCount,
    islandStats: Object.values(aggregate.islandStats).map((island) => ({
      name: island.name,
      wins: island.wins,
      winRate: island.appearances ? formatNumber((island.wins / island.appearances) * 100) : "0.0",
      averageScore: island.appearances ? formatNumber(island.totalScore / island.appearances) : "0.0",
    })),
    highestScore: aggregate.highestScore,
    lowestScore: aggregate.lowestScore,
    averageScoreByPlayer: aggregate.scoreByPlayer.map((player) => ({
      name: player.name,
      averageScore: player.count ? formatNumber(player.totalScore / player.count) : "0.0",
    })),
    averageSabotageUsed: formatNumber(aggregate.sabotageUsed / aggregate.games),
    averageDisastersPassed: formatNumber(aggregate.disastersPassed / aggregate.games),
    neutralized: aggregate.neutralized,
    mirrorUsed: aggregate.mirrorUsed,
    caveRemoved: aggregate.caveRemoved,
    foodBonus: aggregate.foodBonus,
  };
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
  const islandLines = results.islandStats
    .map((row) => `- ${row.name}: ${row.wins} wins, ${row.winRate}% winrate, gemiddelde score ${row.averageScore}`)
    .join("\n");
  const playerLines = results.averageScoreByPlayer
    .map((row) => `- ${row.name}: gemiddelde score ${row.averageScore}`)
    .join("\n");

  return `# Conclusierapport Campfire Survival

## Simulatie-opzet
- Aantal gesimuleerde potjes: ${results.games}
- Aantal spelers per potje: ${results.playerCount}
- Alle spelers werden volledig automatisch bestuurd met vaste JavaScript-regels en willekeurige keuzes.
- Deze simulatie is bedoeld als snelle balanscheck, niet als definitief statistisch bewijs.

## Resultaten per eiland
${islandLines}

## Scoreverdeling
- Hoogste score in de simulatie: ${results.highestScore}
- Laagste score in de simulatie: ${results.lowestScore}
- Beste gemiddelde score: ${bestScore.name} met ${bestScore.averageScore}
- Laagste gemiddelde score: ${lowestScore.name} met ${lowestScore.averageScore}
- Verschil tussen hoogste en laagste gemiddelde eilandscore: ${scoreSpread}
- Hoogste winpercentage: ${bestWinRate.name} met ${bestWinRate.winRate}%
- Laagste winpercentage: ${lowestWinRate.name} met ${lowestWinRate.winRate}%
- Verschil tussen hoogste en laagste winpercentage: ${winRateSpread} procentpunt

## Gemiddelde score per spelerpositie
${playerLines}
- Verschil tussen beste en slechtste spelerpositie: ${playerScoreSpread}

## Interactiekaarten en rampen
- Gemiddeld gebruikte Sabotagekaarten per potje: ${results.averageSabotageUsed}
- Gemiddeld doorgegeven rampen per potje: ${results.averageDisastersPassed}
- De Spiegel werd gebruikt: ${results.mirrorUsed} keer
- De Grot verwijderde een ramp: ${results.caveRemoved} keer
- Het Voedselbos kreeg 3 bonuspunten: ${results.foodBonus} keer

## Tegen gehouden rampen
${neutralizedLines}

## Eerste conclusies
- Als een eiland duidelijk hoger scoort of wint dan de rest, is dat eiland mogelijk te sterk of te makkelijk te benutten.
- Als een eiland structureel lager scoort, is de kracht mogelijk te situationeel of te zwak.
- Een groot verschil tussen spelerposities kan wijzen op beurtvolgordevoordeel.
- Veel gebruikte Sabotage en doorgegeven rampen betekenen dat interactie waarschijnlijk vaak voorkomt.
- Als De Spiegel of De Grot weinig effect heeft, kan de timing of trigger te zeldzaam zijn.

## Vragen aan ChatGPT
1. Beoordeel op basis van deze cijfers welke eilandkaarten waarschijnlijk te sterk of te zwak zijn.
2. Geef concrete balansvoorstellen voor de zwakste en sterkste eilanden.
3. Controleer of de hoeveelheid negatieve interactie via Sabotage, De Heksenheuvel en De Spiegel leuk lijkt of mogelijk frustrerend wordt.
4. Stel eventueel een definitief effect voor Kano lek voor dat past bij deze balans.
5. Geef suggesties voor extra testmetingen die in een volgende simulatie nuttig zijn.
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

function createMetrics() {
  return {
    sabotageUsed: 0,
    disastersPassed: 0,
    neutralized: { bear: 0, fire: 0, drought: 0, leak: 0 },
    mirrorUsed: 0,
    caveRemoved: 0,
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
      <p>Een computerspeler trekt met 65% kans een kaart en steelt met 35% kans een willekeurige handkaart van een geldige tegenstander. Sabotage wordt met 50% kans gebruikt als dat kan. De Heksenheuvel wordt met 35% kans gebruikt als dat kan. De Spiegel wordt met 60% kans gebruikt wanneer een ramp wordt aangeboden.</p>
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
      <p>Het spel eindigt wanneer de trekstapel leeg is. De Grot verwijdert eerst eventueel een ramp. Daarna blokkeren Bijl, Hengel en Regenbui passende rampen. Beer kost 2 Vis, Bosbrand 2 Hout, Droogte 2 Water en Kano lek heeft voorlopig geen effect.</p>
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
