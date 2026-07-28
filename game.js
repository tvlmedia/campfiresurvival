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
    description: "Ramp. Geen effect — regel nog in ontwikkeling.",
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
    description: "Voordeel. Eén keer gebruiken om een eigen ramp aan een ander te geven.",
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

const PROTECTION_MAP = {
  bear: "rod",
  fire: "axe",
  drought: "rain",
};

const DISASTER_EFFECTS = {
  bear: { resource: "fish", amount: 2, text: "-2 Vis" },
  fire: { resource: "wood", amount: 2, text: "-2 Hout" },
  drought: { resource: "water", amount: 2, text: "-2 Water" },
  leak: { resource: null, amount: 0, text: "Geen effect — regel nog in ontwikkeling." },
};

const CARD_TYPE_LABELS = {
  resource: "Grondstof",
  danger: "Ramp",
  advantage: "Voordeel",
  special: "Speciaal",
  island: "Eiland",
};

let nextCardInstanceId = 1;

const state = {
  selectedPlayerCount: 3,
  gameStarted: false,
  gameOver: false,
  scoringStarted: false,
  players: [],
  deck: [],
  discard: [],
  unusedIslands: [],
  currentPlayerIndex: 0,
  round: 1,
  awaitingHandoff: true,
  processing: false,
  currentTurn: {
    mainActionAvailable: true,
    sabotageUsed: false,
  },
  log: [],
  finalScores: [],
  debug: {
    playerId: "",
    cardKey: "wood",
    randomTargetId: "",
    handPlayerId: "",
    handCardId: "",
    advantageKey: "axe",
    islandKey: "fishpond",
    islandUsed: "false",
    activePlayerId: "",
    topCardKey: "wood",
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
  const names = Array.from(document.querySelectorAll("[data-name-input]")).map((input) => input.value.trim());
  initializeGame(state.selectedPlayerCount, names);
}

function handleDocumentChange(event) {
  const target = event.target;
  if (!target.id || !target.id.startsWith("debug-")) {
    return;
  }
  const key = target.id.replace("debug-", "").replaceAll("-", "");
  const map = {
    player: "playerId",
    card: "cardKey",
    randomplayer: "randomTargetId",
    handplayer: "handPlayerId",
    handcard: "handCardId",
    advantage: "advantageKey",
    island: "islandKey",
    islandused: "islandUsed",
    activeplayer: "activePlayerId",
    topcard: "topCardKey",
  };
  if (map[key]) {
    state.debug[map[key]] = target.value;
  }
  if (["debug-player", "debug-random-player", "debug-hand-player", "debug-active-player"].includes(target.id)) {
    renderInterface();
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

  if (action === "complete-handoff") {
    completeHandoff();
    return;
  }

  if (action === "toggle-island") {
    toggleActiveIsland();
    return;
  }

  if (action === "draw-card") {
    await runLocked(takeDrawAction);
    return;
  }

  if (action === "steal-card") {
    await runLocked(takeStealAction);
    return;
  }

  if (action === "use-sabotage") {
    await runLocked(useSabotage);
    return;
  }

  if (action === "use-witch") {
    await runLocked(useWitchHill);
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
  nameFields.innerHTML = Array.from({ length: state.selectedPlayerCount }, (_, index) => {
    const playerNumber = index + 1;
    return `
      <div class="field">
        <label for="player-name-${playerNumber}">Speler ${playerNumber}</label>
        <input id="player-name-${playerNumber}" data-name-input type="text" placeholder="Speler ${playerNumber}">
      </div>
    `;
  }).join("");
}

function initializeGame(playerCount, names) {
  nextCardInstanceId = 1;
  state.players = createPlayers(playerCount, names);
  state.deck = shuffleDeck(generateDeck());
  state.discard = [];
  state.unusedIslands = [];
  state.currentPlayerIndex = 0;
  state.round = 1;
  state.awaitingHandoff = true;
  state.processing = false;
  state.currentTurn = { mainActionAvailable: true, sabotageUsed: false };
  state.gameStarted = true;
  state.gameOver = false;
  state.scoringStarted = false;
  state.finalScores = [];
  state.log = [];
  dealIslands();
  syncDebugDefaults();
  addLog(`Nieuw spel gestart met ${playerCount} spelers.`);
  renderInterface();
}

function createPlayers(playerCount, names) {
  return Array.from({ length: playerCount }, (_, index) => ({
    id: `player-${index + 1}`,
    name: names[index] || `Speler ${index + 1}`,
    hand: [],
    advantages: [],
    island: null,
    islandRevealed: false,
    removedByCave: [],
  }));
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
  const shuffled = deck;
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
  }
  return shuffled;
}

function dealIslands() {
  const islandPool = shuffleDeck(ISLAND_DEFINITIONS.map(createIsland));
  state.players.forEach((player) => {
    player.island = islandPool.shift();
  });
  state.unusedIslands = islandPool;
}

async function drawCard(player) {
  if (state.deck.length === 0) {
    addLog("De trekstapel is leeg.");
    return false;
  }

  const card = state.deck.shift();
  if (card.type === "resource" || card.type === "danger") {
    addLog(`${player.name} trok een verborgen handkaart.`);
  } else {
    addLog(`${player.name} trok ${card.name}.`);
  }
  await processCard(player, card);
  return true;
}

async function processCard(player, card) {
  if (card.type === "resource" || card.type === "danger") {
    player.hand.push(card);
    return;
  }

  if (card.type === "advantage") {
    player.advantages.push(card);
    addLog(`${player.name} legt ${card.name} open neer.`);
    return;
  }

  if (card.type === "special") {
    addLog(`${card.name} wordt direct uitgevoerd.`);
    await executeSpecialCard(player, card);
    state.discard.push(card);
  }
}

async function executeSpecialCard(player, card) {
  if (card.subtype === "motorboat") {
    await drawCard(player);
    await drawCard(player);
    return;
  }

  if (card.subtype === "raid") {
    await executePlunder(player);
    return;
  }

  if (card.subtype === "move") {
    moveCamp(player);
  }
}

function moveCamp(player) {
  if (!player.island) {
    return;
  }

  const oldIsland = player.island;
  state.unusedIslands.push(oldIsland);
  let options = shuffleDeck([...state.unusedIslands]);
  const differentOptions = options.filter((island) => island.key !== oldIsland.key);
  if (differentOptions.length > 0) {
    options = differentOptions;
  }

  const newIsland = options[0];
  state.unusedIslands = state.unusedIslands.filter((island) => island.key !== newIsland.key);
  player.island = { ...newIsland, used: false };
  player.islandRevealed = false;
  addLog(`${player.name} verplaatst het kamp en krijgt een nieuw geheim eiland.`);
}

async function stealRandomCard(thief, target, amount = 1) {
  const stolenCards = [];
  const stealAmount = Math.min(amount, target.hand.length);
  for (let index = 0; index < stealAmount; index += 1) {
    const randomIndex = Math.floor(Math.random() * target.hand.length);
    const [card] = target.hand.splice(randomIndex, 1);
    thief.hand.push(card);
    stolenCards.push(card);
  }
  if (stolenCards.length === 1) {
    addLog(`${thief.name} stal 1 verborgen handkaart van ${target.name}.`);
  } else {
    addLog(`${thief.name} stal ${stolenCards.length} verborgen handkaarten van ${target.name}.`);
  }
  return stolenCards;
}

async function executePlunder(player) {
  const advantageTargets = state.players
    .filter((target) => target.id !== player.id)
    .flatMap((target) => target.advantages.map((card) => ({ target, card })));
  const handTargets = state.players.filter((target) => target.id !== player.id && target.hand.length > 0);

  if (advantageTargets.length === 0 && handTargets.length === 0) {
    addLog("Plundertocht vindt geen buit.");
    return;
  }

  const plunderMode = await showChoice("Plundertocht", "Kies wat je wilt stelen.", [
    {
      label: "Open voordeelkaart stelen",
      description: `${advantageTargets.length} beschikbare voordeelkaart(en).`,
      value: "advantage",
      disabled: advantageTargets.length === 0,
    },
    {
      label: "Drie handkaarten stelen",
      description: `${handTargets.length} speler(s) met verborgen handkaarten.`,
      value: "hand",
      disabled: handTargets.length === 0,
    },
  ]);

  if (plunderMode === "advantage") {
    const choice = await showChoice("Voordeelkaart stelen", "Kies één open voordeelkaart.", advantageTargets.map(({ target, card }) => ({
      label: `${target.name}: ${card.name}`,
      description: card.description,
      value: { targetId: target.id, cardId: card.id },
    })));
    const target = getPlayer(choice.targetId);
    const cardIndex = target.advantages.findIndex((card) => card.id === choice.cardId);
    if (cardIndex >= 0) {
      const [card] = target.advantages.splice(cardIndex, 1);
      player.advantages.push(card);
      addLog(`${player.name} stal ${card.name} van ${target.name}.`);
    }
    return;
  }

  if (plunderMode === "hand") {
    const targetId = await choosePlayer("Handkaarten stelen", handTargets, "Kies een speler. Je steelt willekeurig maximaal drie handkaarten.");
    const target = getPlayer(targetId);
    await stealRandomCard(player, target, 3);
  }
}

async function useSabotage() {
  const player = getActivePlayer();
  if (!canUseSabotage(player)) {
    return;
  }

  const dangerCard = await chooseOwnDanger(player, "Sabotage", "Kies een rampkaart uit je eigen hand.");
  if (!dangerCard) {
    return;
  }

  const targetId = await choosePlayer("Sabotage", getOtherPlayers(player), "Kies de speler die de ramp krijgt.");
  if (!targetId) {
    return;
  }

  const sabotageIndex = player.advantages.findIndex((card) => card.subtype === "sabotage");
  if (sabotageIndex < 0) {
    return;
  }

  const [sabotageCard] = player.advantages.splice(sabotageIndex, 1);
  state.discard.push(sabotageCard);
  state.currentTurn.sabotageUsed = true;
  await handleMirrorReaction(player, getPlayer(targetId), dangerCard, "Sabotage");
  addLog(`${player.name} gebruikte Sabotage.`);
}

async function useWitchHill() {
  const player = getActivePlayer();
  if (!canUseWitchHill(player)) {
    return;
  }

  const dangerCard = await chooseOwnDanger(player, "De Heksenheuvel", "Kies een rampkaart uit je eigen hand.");
  if (!dangerCard) {
    return;
  }

  const targetId = await choosePlayer("De Heksenheuvel", getOtherPlayers(player), "Kies de speler die de ramp krijgt.");
  if (!targetId) {
    return;
  }

  await handleMirrorReaction(player, getPlayer(targetId), dangerCard, "De Heksenheuvel");
  player.island.used = true;
  addLog(`${player.name} gebruikte De Heksenheuvel.`);
}

async function handleMirrorReaction(attacker, target, dangerCard, sourceName) {
  const targetHasMirror = target.island?.effectType === "mirror" && !target.island.used;
  if (targetHasMirror) {
    const mirrorChoice = await showChoice(`De Spiegel van ${target.name}`, `${sourceName} probeert ${target.name} een ${dangerCard.name} te geven. Geef het scherm aan ${target.name}.`, [
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

    if (mirrorChoice === "mirror") {
      const ownDangers = target.hand.filter((card) => card.type === "danger");
      const returnChoice = await showChoice("De Spiegel", "Kies welke ramp teruggaat naar de aanvaller.", [
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

      target.island.used = true;
      if (returnChoice.mode === "own") {
        const returned = removeCardFromHand(target, returnChoice.cardId);
        if (returned) {
          attacker.hand.push(returned);
          addLog(`${target.name} gebruikte De Spiegel en gaf een eigen ramp terug aan ${attacker.name}.`);
        }
      } else {
        addLog(`${target.name} gebruikte De Spiegel en stuurde de aangeboden ramp terug.`);
      }
      return { accepted: false, mirrored: true };
    }
  }

  const transferred = removeCardFromHand(attacker, dangerCard.id);
  if (transferred) {
    target.hand.push(transferred);
    addLog(`${target.name} kreeg een verborgen rampkaart van ${attacker.name}.`);
    return { accepted: true, mirrored: false };
  }
  return { accepted: false, mirrored: false };
}

async function takeDrawAction() {
  if (!state.currentTurn.mainActionAvailable) {
    return;
  }
  const player = getActivePlayer();
  await drawCard(player);
  state.currentTurn.mainActionAvailable = false;
  await finishMainAction();
}

async function takeStealAction() {
  if (!state.currentTurn.mainActionAvailable) {
    return;
  }
  const player = getActivePlayer();
  const targets = getOtherPlayers(player).filter((target) => target.hand.length > 0);
  if (targets.length === 0) {
    addLog("Niemand heeft handkaarten. De actieve speler moet trekken.");
    await drawCard(player);
  } else {
    const targetId = await choosePlayer("Kaart stelen", targets, "Kies een speler. De kaart wordt willekeurig gekozen.");
    await stealRandomCard(player, getPlayer(targetId), 1);
  }
  state.currentTurn.mainActionAvailable = false;
  await finishMainAction();
}

async function finishMainAction() {
  if (state.deck.length === 0) {
    await startEndgame();
    return;
  }
  endTurn();
}

function endTurn() {
  state.players.forEach((player) => {
    player.islandRevealed = false;
  });
  const previousIndex = state.currentPlayerIndex;
  state.currentPlayerIndex = (state.currentPlayerIndex + 1) % state.players.length;
  if (state.currentPlayerIndex <= previousIndex) {
    state.round += 1;
  }
  state.currentTurn = { mainActionAvailable: true, sabotageUsed: false };
  state.awaitingHandoff = true;
  addLog(`Beurt door naar ${getActivePlayer().name}.`);
  syncDebugDefaults();
  renderInterface();
}

async function startEndgame() {
  if (state.scoringStarted) {
    return;
  }

  state.scoringStarted = true;
  state.awaitingHandoff = false;
  state.players.forEach((player) => {
    player.islandRevealed = false;
    player.removedByCave = [];
  });
  addLog("Het eindspel is gestart.");

  for (const player of state.players) {
    if (player.island?.effectType === "cave") {
      const dangers = player.hand.filter((card) => card.type === "danger");
      if (dangers.length > 0) {
        const choice = await showChoice(`De Grot: ${player.name}`, `Geef het scherm aan ${player.name}. Kies eventueel één ramp om weg te leggen.`, [
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
          const removed = removeCardFromHand(player, choice);
          if (removed) {
            state.discard.push(removed);
            player.removedByCave.push(removed);
            player.island.used = true;
            addLog(`${player.name} legde met De Grot één ramp weg.`);
          }
        }
      }
    }
  }

  state.finalScores = calculateFinalScore();
  state.gameOver = true;
  state.gameStarted = false;
  renderInterface();
}

function neutralizeDisasters(player) {
  const protectionCounts = countBySubtype(player.advantages);
  const dangers = player.hand.filter((card) => card.type === "danger");
  const neutralized = [];
  const pending = [];

  dangers.forEach((danger) => {
    const protectionSubtype = PROTECTION_MAP[danger.subtype];
    if (protectionSubtype && protectionCounts[protectionSubtype] > 0) {
      protectionCounts[protectionSubtype] -= 1;
      neutralized.push({
        danger,
        by: getCardDefinitionBySubtype(protectionSubtype)?.name || "Voordeelkaart",
      });
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
      executed.push({
        danger,
        effect: effect?.text || "Geen effect.",
      });
      return;
    }
    const before = remaining[effect.resource];
    remaining[effect.resource] = Math.max(0, before - effect.amount);
    executed.push({
      danger,
      effect: effect.text,
    });
  });

  return { remaining, executed };
}

function calculateIslandBonus(player, remainingResources) {
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

function calculateFinalScore() {
  return state.players.map((player) => {
    const startResources = countResources(player.hand);
    const { neutralized, pending } = neutralizeDisasters(player);
    const { remaining, executed } = applyDisasters(startResources, pending);
    const islandScore = calculateIslandBonus(player, remaining);

    return {
      playerName: player.name,
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
    renderHandoff();
    renderPrivatePanel();
    renderActionPanel();
    renderPlayersOverview();
    renderLog();
    renderDebugPanel();
  }

  if (state.gameOver) {
    renderScoreScreen();
  }
}

function renderGameStatus() {
  const active = getActivePlayer();
  document.getElementById("game-status").innerHTML = `
    <article class="status-card">
      <span class="status-label">Actieve speler</span>
      <strong class="status-value">${escapeHtml(active.name)}</strong>
    </article>
    <article class="status-card">
      <span class="status-label">Ronde</span>
      <strong class="status-value">${state.round}</strong>
    </article>
    <article class="status-card">
      <span class="status-label">Trekstapel</span>
      <strong class="status-value">${state.deck.length}</strong>
    </article>
    <article class="status-card">
      <span class="status-label">Aflegstapel</span>
      <strong class="status-value">${state.discard.length}</strong>
    </article>
  `;
}

function renderHandoff() {
  const panel = document.getElementById("handoff-panel");
  panel.classList.toggle("is-visible", state.awaitingHandoff);
  if (!state.awaitingHandoff) {
    panel.innerHTML = "";
    return;
  }
  panel.innerHTML = `
    <div class="handoff-card">
      <h2>Geef het scherm aan ${escapeHtml(getActivePlayer().name)}</h2>
      <p>Handkaarten en eilandinformatie blijven verborgen totdat de actieve speler klaar is.</p>
      <button type="button" class="primary-button" data-action="complete-handoff">Ik ben klaar</button>
    </div>
  `;
}

function renderPrivatePanel() {
  const panel = document.getElementById("private-panel");
  panel.classList.toggle("is-hidden", state.awaitingHandoff);
  if (state.awaitingHandoff) {
    panel.innerHTML = "";
    return;
  }

  const player = getActivePlayer();
  const islandHtml = player.islandRevealed
    ? renderCard({ ...player.island, type: "island" })
    : `<div class="card card-island">
        <span class="card-icon">🏝️</span>
        <div class="card-name">Geheim eiland</div>
        <div class="card-type">Eiland</div>
        <p class="card-description">Verborgen totdat jij het bekijkt.</p>
      </div>`;

  panel.innerHTML = `
    <div class="private-grid">
      <section class="private-box">
        <div class="section-heading">
          <h2>Jouw hand</h2>
          <span class="pill">${player.hand.length} kaart(en)</span>
        </div>
        <div class="hand-grid">
          ${player.hand.length ? player.hand.map(renderCard).join("") : `<p class="muted-text">Je hebt nog geen verborgen handkaarten.</p>`}
        </div>
      </section>
      <section class="private-box">
        <div class="section-heading">
          <h2>Jouw eiland</h2>
          <button type="button" class="secondary-button" data-action="toggle-island">
            ${player.islandRevealed ? "Eiland verbergen" : "Bekijk mijn eiland"}
          </button>
        </div>
        <div class="island-grid">${islandHtml}</div>
      </section>
    </div>
  `;
}

function renderActionPanel() {
  const panel = document.getElementById("action-panel");
  panel.classList.toggle("is-hidden", state.awaitingHandoff);
  if (state.awaitingHandoff) {
    panel.innerHTML = "";
    return;
  }

  const player = getActivePlayer();
  const mainDisabled = state.processing || !state.currentTurn.mainActionAvailable;
  const sabotageDisabled = state.processing || !canUseSabotage(player);
  const witchDisabled = state.processing || !canUseWitchHill(player);
  panel.innerHTML = `
    <section class="actions-box">
      <h2>Beschikbare acties</h2>
      <div>
        <h3>Hoofdactie</h3>
        <div class="action-row">
          <button type="button" class="primary-button" data-action="draw-card" ${mainDisabled ? "disabled" : ""}>Kaart trekken</button>
          <button type="button" class="secondary-button" data-action="steal-card" ${mainDisabled ? "disabled" : ""}>Kaart stelen</button>
        </div>
      </div>
      <div>
        <h3>Extra actie</h3>
        <div class="action-row">
          <button type="button" class="secondary-button" data-action="use-sabotage" ${sabotageDisabled ? "disabled" : ""}>Sabotage gebruiken</button>
          <button type="button" class="secondary-button" data-action="use-witch" ${witchDisabled ? "disabled" : ""}>Heksenheuvel gebruiken</button>
        </div>
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
    const islandStatus = player.island?.used ? "Gebruikt" : "Niet gebruikt";
    return `
      <article class="player-card ${isActive ? "is-active" : ""}">
        <h3>
          <span>${escapeHtml(player.name)}</span>
          ${isActive ? `<span class="pill">Actief</span>` : ""}
        </h3>
        <p><strong>${player.hand.length}</strong> verborgen handkaart(en)</p>
        <p>Geheim eiland: verborgen</p>
        <p>Eenmalige eilandkracht: <strong>${islandStatus}</strong></p>
        <ul class="pill-list">${advantages}</ul>
      </article>
    `;
  }).join("");
}

function renderLog() {
  document.getElementById("event-log").innerHTML = state.log
    .slice(-12)
    .reverse()
    .map((entry) => `<li>${escapeHtml(entry)}</li>`)
    .join("");
}

function renderDebugPanel() {
  syncDebugDefaults();
  const playersOptions = state.players.map((player) => `<option value="${player.id}">${escapeHtml(player.name)}</option>`).join("");
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
  const deckList = state.deck.map((card, index) => `${index + 1}. ${card.icon} ${card.name} (${CARD_TYPE_LABELS[card.type]})`).join("\n");

  document.getElementById("debug-content").innerHTML = `
    <div class="debug-grid">
      <section class="debug-group">
        <h3>Kaart geven</h3>
        <select id="debug-player">${playersOptions}</select>
        <select id="debug-card">${cardOptions}</select>
        <div class="debug-actions">
          <button type="button" class="secondary-button" data-action="debug-give-card">Specifieke kaart geven</button>
          <button type="button" class="secondary-button" data-action="debug-give-random">Willekeurige kaart geven</button>
        </div>
      </section>

      <section class="debug-group">
        <h3>Handkaart verwijderen</h3>
        <select id="debug-hand-player">${playersOptions}</select>
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
        <h3>Trekstapel</h3>
        <select id="debug-top-card">${cardOptions}</select>
        <div class="debug-actions">
          <button type="button" class="secondary-button" data-action="debug-top-card">Kaart bovenop leggen</button>
          <button type="button" class="secondary-button" data-action="debug-shuffle-deck">Trekstapel schudden</button>
        </div>
        <pre class="deck-view">${escapeHtml(deckList || "Trekstapel is leeg.")}</pre>
      </section>

      <section class="debug-group">
        <h3>Spel sturen</h3>
        <select id="debug-active-player">${playersOptions}</select>
        <div class="debug-actions">
          <button type="button" class="secondary-button" data-action="debug-set-active-player">Actieve speler wijzigen</button>
          <button type="button" class="danger-button" data-action="debug-start-endgame">Eindspel starten</button>
          <button type="button" class="ghost-button" data-action="debug-reset-game">Reset</button>
        </div>
      </section>
    </div>
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
    const randomDefinition = CARD_DEFINITIONS[Math.floor(Math.random() * CARD_DEFINITIONS.length)];
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
    assignIslandToPlayer(player, state.debug.islandKey);
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
      state.awaitingHandoff = true;
      state.currentTurn = { mainActionAvailable: true, sabotageUsed: false };
      addLog(`Debug: actieve speler is nu ${getActivePlayer().name}.`);
    }
  }

  if (action === "debug-start-endgame") {
    await startEndgame();
  }

  if (action === "debug-reset-game") {
    resetGame();
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

function assignIslandToPlayer(player, islandKey) {
  const islandDefinition = ISLAND_DEFINITIONS.find((island) => island.key === islandKey);
  if (!islandDefinition) {
    return;
  }

  const oldIsland = player.island;
  const otherHolder = state.players.find((candidate) => candidate.id !== player.id && candidate.island?.key === islandKey);
  const unusedIndex = state.unusedIslands.findIndex((island) => island.key === islandKey);
  const newIsland = createIsland(islandDefinition);

  if (otherHolder) {
    otherHolder.island = oldIsland ? { ...oldIsland, used: false } : createIsland(ISLAND_DEFINITIONS[0]);
    otherHolder.islandRevealed = false;
  } else if (unusedIndex >= 0) {
    state.unusedIslands.splice(unusedIndex, 1);
    if (oldIsland) {
      state.unusedIslands.push({ ...oldIsland, used: false });
    }
  }

  player.island = newIsland;
  player.islandRevealed = false;
}

function completeHandoff() {
  state.awaitingHandoff = false;
  getActivePlayer().islandRevealed = false;
  renderInterface();
}

function toggleActiveIsland() {
  const player = getActivePlayer();
  player.islandRevealed = !player.islandRevealed;
  renderInterface();
}

function openRules() {
  showMessage("Spelregels", getRulesHtml(), "Sluiten");
}

function resetGame() {
  state.gameStarted = false;
  state.gameOver = false;
  state.scoringStarted = false;
  state.players = [];
  state.deck = [];
  state.discard = [];
  state.unusedIslands = [];
  state.log = [];
  state.finalScores = [];
  state.processing = false;
  closeModal();
  renderNameFields();
  renderInterface();
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

function showChoice(title, message, options) {
  return new Promise((resolve) => {
    modalRoot.classList.add("is-open");
    modalRoot.setAttribute("aria-hidden", "false");
    const actionButtons = options.map((option, index) => `
      <button type="button" class="choice-button" data-choice-index="${index}" ${option.disabled ? "disabled" : ""}>
        <strong>${escapeHtml(option.label)}</strong>
        <span>${escapeHtml(option.description || "")}</span>
      </button>
    `).join("");

    modalRoot.innerHTML = `
      <section class="modal-card" role="dialog" aria-modal="true" aria-label="${escapeHtml(title)}">
        <h2>${escapeHtml(title)}</h2>
        <p>${escapeHtml(message)}</p>
        <div class="modal-actions">${actionButtons}</div>
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

function choosePlayer(title, players, message) {
  return showChoice(title, message, players.map((player) => ({
    label: player.name,
    description: `${player.hand.length} handkaart(en), ${player.advantages.length} voordeelkaart(en).`,
    value: player.id,
  })));
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

function canUseSabotage(player) {
  return !state.awaitingHandoff
    && state.currentTurn.mainActionAvailable
    && !state.currentTurn.sabotageUsed
    && player.advantages.some((card) => card.subtype === "sabotage")
    && player.hand.some((card) => card.type === "danger");
}

function canUseWitchHill(player) {
  return !state.awaitingHandoff
    && state.currentTurn.mainActionAvailable
    && player.island?.effectType === "witch"
    && !player.island.used
    && player.hand.some((card) => card.type === "danger");
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

function addLog(message) {
  state.log.push(message);
  if (state.log.length > 80) {
    state.log.shift();
  }
}

function syncDebugDefaults() {
  if (!state.players.length) {
    return;
  }
  const active = getActivePlayer();
  const first = state.players[0];
  if (!getPlayer(state.debug.playerId)) {
    state.debug.playerId = active.id;
  }
  if (!getPlayer(state.debug.randomTargetId)) {
    state.debug.randomTargetId = active.id;
  }
  if (!getPlayer(state.debug.handPlayerId)) {
    state.debug.handPlayerId = active.id;
  }
  if (!getPlayer(state.debug.activePlayerId)) {
    state.debug.activePlayerId = active.id;
  }
  const handPlayer = getPlayer(state.debug.handPlayerId) || first;
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

function getRulesHtml() {
  return `
    <section>
      <h3>Doel</h3>
      <p>Verzamel Hout, Vis en Water. Iedere grondstof is 1 punt waard, behalve als jouw geheime eiland dit verandert.</p>
    </section>
    <section>
      <h3>Beurt</h3>
      <ol>
        <li>Geef het scherm aan de actieve speler en druk op Ik ben klaar.</li>
        <li>Gebruik eventueel maximaal één Sabotage en eventueel De Heksenheuvel als je die hebt.</li>
        <li>Kies precies één hoofdactie: kaart trekken of willekeurig één handkaart stelen.</li>
        <li>Na de hoofdactie gaat de beurt naar de volgende speler. Speciale kaarten worden eerst volledig afgehandeld.</li>
      </ol>
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
      <h3>Rampen en bescherming</h3>
      <p>Bijl blokkeert één Bosbrand, Hengel blokkeert één Beer en Regenbui blokkeert één Droogte. Beer kost 2 Vis, Bosbrand 2 Hout, Droogte 2 Water. Kano lek heeft nu geen effect.</p>
    </section>
    <section>
      <h3>Eilanden</h3>
      <p>Visvijver verdubbelt Vis, Het Bos verdubbelt Hout, Het Riviertje verdubbelt Water, De Grot verwijdert bij het eindspel één ramp, De Heksenheuvel geeft één keer een ramp weg, Het Voedselbos geeft 3 punten voor minstens 1 van iedere grondstof, en De Spiegel kan één ramp terugkaatsen.</p>
    </section>
    <section>
      <h3>Einde</h3>
      <p>Het spel eindigt automatisch nadat de trekstapel leeg is en alle effecten klaar zijn. De testknop Spel nu beëindigen start dezelfde eindscore direct.</p>
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
