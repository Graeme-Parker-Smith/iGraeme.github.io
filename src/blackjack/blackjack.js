import React, { useEffect } from "react";
import cardNames from "./cardNames";
import "./blackjack.css";
import redChip from "./red-chip.png";
const BlackJack = targetId => {
  useEffect(() => {
    document.title = "Blackjack";
  }, []);
  // expand background on window resize
  // center the gameBoard on any window size
  // add cursor trail back in, or possibly touchscreen tap effect
  let firstGame = true;
  let bet = 0;
  let winnings = 0;
  let cards = [];
  let discard = [];
  let cardsDealt = 0;
  let playerHands = [
    { score: 0, hand: [], status: null, standing: false, bet: 0, id: 0 }
  ];
  let dealerHand = { score: 0, hand: [], status: null, standing: false };
  let message = "";

  const changeWinnings = (thisHand, winner, mult = 1) => {
    if (winner) {
      thisHand.status = "win";
      winnings += thisHand.bet * mult;
    } else {
      thisHand.status = "lose";
      winnings -= thisHand.bet * 1;
    }
    winningsD.innerHTML = `Winnings: ${winnings}`;
    betVal = betVal * 1 - thisHand.bet * 1;
  };

  // calculate win or lose hands
  const calcWinner = () => {
    playerHands.forEach(h => {
      if (dealerHand.status === "blackjack" && h.status !== "lose")
        changeWinnings(h, false);
      if (
        dealerHand.status !== "lose" &&
        dealerHand.score > h.score &&
        h.status === null
      ) {
        changeWinnings(h, false);
        setMessage("dealerGreater");
      }
      // Only do this at end of dealer's turn
      if (dealerHand.standing === true) {
        if (dealerHand.score < h.score && h.status === null) {
          changeWinnings(h, true);
          setMessage("playerGreater");
        }
        if (dealerHand.status === "lose") changeWinnings(h, true);
        if (h.status === "blackjack" && dealerHand.status !== "blackjack") {
          setMessage("blackjack");
          changeWinnings(h, true, 1.5);
        }
        if (dealerHand.score === h.score && h.status === null) {
          h.status = "tie";
          setMessage("tie");
          betVal = betVal * 1 - h.bet * 1;
        }
      }
    });
  };

  // stand function
  const stand = thisHand => {
    thisHand.standing = true;
    if (thisHand === dealerHand) {
      calcWinner();
      setTimeout(function() {
        reset();
      }, 1500 / fast);
    } else {
      const thisBox = document.getElementById(thisHand.id);
      thisBox.childNodes.forEach(node => (node.disabled = true));
      if (playerHands.every(hand => hand.standing === true)) {
        setTimeout(function() {
          startDealerTurn();
        }, 300 / fast);
      }
    }
  };

  // calculate score for chosen hand
  function calcHandScore(whichHand) {
    let whichHandValues = whichHand.hand.map(card => {
      if (card.classList.contains("flip")) {
        return card.value;
      }
      return 0;
    });
    // update hand's score
    let whichHandTotal = whichHandValues.reduce((acc, next) => acc + next);
    whichHandValues.forEach(value => {
      if (whichHandTotal > 21 && value === 11) {
        whichHandTotal -= 10;
      }
    });
    whichHand.score = whichHandTotal;
  }

  function startDealerTurn() {
    // begin dealer turn
    const pBoxesC = document.getElementsByClassName("playerBox");
    const pBoxes = [...pBoxesC];
    pBoxes.forEach(box =>
      box.childNodes.forEach(node => (node.disabled = true))
    );
    function dealerTurn() {
      dealCard(dealerHand);
      if (dealerHand.standing === false) {
        setTimeout(() => {
          dealerTurn();
        }, 500 / fast);
      }
    }
    if (dealerHand.hand[1].classList.contains("flip")) {
      dealerHand.hand[1].classList.remove("flip");
    } else {
      dealerHand.hand[1].classList.add("flip");
    }
    calcHandScore(dealerHand);
    dealerScore.innerHTML = dealerHand.score;
    // handle dealer blackjack
    if (dealerHand.score === 21) {
      dealerHand.status = "blackjack";
      setMessage("dealerBJ");
      stand(dealerHand);
    } else if (
      // Does dealer need to draw a third card? If no, then stand
      playerHands.every(h => h.status !== null) ||
      (dealerHand.score >= 17 &&
        dealerHand.hand.every(card => card.value !== 11)) ||
      dealerHand.score >= 18
    ) {
      stand(dealerHand);
    }
    // if dealer is not standing, then draw another card
    if (dealerHand.standing === false) {
      setTimeout(() => {
        dealerTurn();
      }, 500 / fast);
    }
  }

  const setMessage = condition => {
    function setDisplay(text) {
      message = text;
      let newMsg = document.createElement("li");
      newMsg.innerHTML = message;
      newMsg.classList.add("msg-item");
      msgList.appendChild(newMsg);
      if (msgList.childNodes.length > 8) {
        msgList.childNodes[0].style.opacity = 0;
        setTimeout(function() {
          msgList.removeChild(msgList.childNodes[0]);
        }, 600);
      }
    }
    switch (condition) {
      case "bust":
        setDisplay("Player Bust!");
        break;
      case "dealerBust":
        setDisplay("Dealer Bust!");
        break;
      case "playerGreater":
        setDisplay("Your score is greater. You Win!");
        break;
      case "dealerGreater":
        setDisplay("Dealer Score Greater");
        break;
      case "blackjack":
        setDisplay("BlackJack! 1.5x Winnings!");
        break;
      case "dealerBJ":
        setDisplay("Dealer BlackJack! You Lose!");
        break;
      case "tie":
        setDisplay("It's A Tie!");
        break;
      case "surrender":
        setDisplay("Player Surrenders Half of Bet!");
        break;
      default:
        setDisplay("BlackJack");
        break;
    }
  };

  const flipDiscards = idx => {
    for (let i = 0; i < discard.length; i++) {
      discard[i].classList.remove("flip");
      discard[i].classList.remove("dealt");
      discard[i].classList.remove("discard");
    }
  };

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  function shuffleCards(array) {
    for (let i = array.length - 1; i > 0; i--) {
      if (!array[i].classList.contains("dealt")) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
    }
  }

  const assignImages = id => {
    moveDiscards();
    let cardImages = [];
    for (let i = 0; i < deckNum.innerHTML * 1; i++) {
      cardImages.push(...cardNames);
    }
    shuffleArray(cardImages);
    let imgSrc;
    for (let i = 0; i < 52 * deckNum.innerHTML; i++) {
      imgSrc = require(`./PNG/${cardImages[i]}.png`);
      cards[i].firstChild.firstChild.innerHTML = `<img src=${imgSrc} >`;
      cards[i].value = calcVal(cardImages[i]);
      cards[i].style.top = 0;
      cards[i].style.left = 0;
    }
  };

  function stopRedeal() {
    if (cards[cardsDealt].classList.contains("dealt")) {
      cardsDealt++;
      stopRedeal();
    }
  }

  const dealerBJ = () => {
    if (dealerHand.hand[0].value + dealerHand.hand[1].value === 21) {
      stand(playerHands[0]);
    }
  };

  // deal cards
  const dealCard = whichHand => {
    // console.log("cardsDealt: ", cardsDealt);
    let h = whichHand.hand.length;
    if (dealerHand.hand.length === 2) {
      dealerBJ();
    }
    // push card to hand, update
    stopRedeal();
    whichHand.hand.push(cards[cardsDealt]);
    if (cards[cardsDealt] !== dealerHand.hand[1]) {
      flipCard(whichHand);
    }
    h = whichHand.hand.length;
    calcHandScore(whichHand);
    // if dealing card to dealer...
    if (whichHand === dealerHand) {
      // update dealer score display and assign new card positions
      dealerScore.innerHTML = whichHand.score;
      cards[cardsDealt].fromtop = -200 + 160 * Math.floor((h - 1) / 2);
      cards[cardsDealt].fromleft = 300 + 100 * ((h - 1) % 2);
      // handle dealer blackjack
      if (h === 2) {
        surrender.disabled = false;
        if (
          playerHands[0].hand.length === 2 &&
          playerHands[0].score === 21 &&
          playerHands[0].standing === false
        ) {
          playerHands[0].status = "blackjack";
          playerBox.childNodes.forEach(node => (node.disabled = true));
          setTimeout(() => stand(playerHands[0]), 500);
        }
      }
      // handle dealer bust
      if (dealerHand.score > 21) {
        dealerHand.status = "lose";
        setMessage("dealerBust");
        stand(dealerHand);
      } else {
        if (
          (dealerHand.score >= 17 &&
            dealerHand.hand.every(card => card.value !== 11)) ||
          dealerHand.score >= 18 ||
          playerHands.every(h => h.status === "lose")
        )
          stand(dealerHand);
      }
    } else {
      surrender.disabled = true;
      // if dealing card to player...
      // assign player card positions
      cards[cardsDealt].fromtop = 290 + 160 * Math.floor((h - 1) / 2);
      cards[cardsDealt].fromleft =
        15 + 250 * whichHand.id + 100 * ((h - 1) % 2);
      // change hand's score display
      let pBox = document.getElementById(whichHand.id);
      let pScore = pBox.firstChild;
      pScore.innerHTML = whichHand.score;
      // handle player bust
      if (whichHand.score > 21) {
        changeWinnings(whichHand, false);
        whichHand.status = "lose";
        stand(whichHand);
        setMessage("bust");
      }

      if (whichHand.hand[h - 2]) {
        if (whichHand.hand[h - 1].value === whichHand.hand[h - 2].value) {
          pBox.childNodes[4].disabled = false;
        } else {
          pBox.childNodes[4].disabled = true;
        }
      }
      // disable double down button after hitting
      if (h > 2) {
        pBox.childNodes[3].disabled = true;
      }
    }
    cards[cardsDealt].classList.add("dealt");
    // apply css card-dealing animation
    // with (cards[cardsDealt].style) {
    cards[cardsDealt].style.zIndex = "1000";
    cards[cardsDealt].style.top = cards[cardsDealt].fromtop + "px";
    cards[cardsDealt].style.left = cards[cardsDealt].fromleft + "px";
    cards[cardsDealt].style.transform = `rotate(${Math.floor(
      Math.random() * 5
    ) + 178}deg)`;
    cards[cardsDealt].style.zIndex = "0";
    // }
    cardsDealt++;
    if (cards.every(card => card.classList.contains("dealt"))) {
      moveDiscards();
    }
  };

  function moveDiscards() {
    flipDiscards();
    for (let i = discard.length - 1; i >= 0; i--) {
      discard[i].style.top = 0 + "px";
      discard[i].style.left = 0 + "px";
      cards.push(discard[i]);
      discard.splice(i, 1);
    }
    shuffleCards(cards);
  }

  // flips the chosen card
  const flipCard = whichHand => {
    console.trace();
    console.log("cardsDealt is", cardsDealt);
    console.log(whichHand);
    const h = whichHand.hand;
    console.log("h", h);
    if (h[h.length - 1].classList.contains("flip")) {
      h[h.length - 1].classList.remove("flip");
    } else {
      h[h.length - 1].classList.add("flip");
    }
  };

  const reset = () => {
    for (let i = cards.length - 1; i >= 0; i--) {
      cards[i].style.top = 0;
      cards[i].style.left = 0;
      if (cards[i].classList.contains("dealt")) {
        cards[i].classList.remove("dealt");
        cards[i].classList.add("discard");
        cards[i].style.left = 100 + "px";
        discard.push(cards[i]);
        cards.splice(i, 1);
      }
    }
    cardsDealt = 0;
    playerHands = [
      { score: 0, hand: [], status: null, standing: false, bet: 0, id: 0 }
    ];
    dealerHand = { score: 0, hand: [], status: null, standing: false };
    startGameBtn.disabled = false;
    const playerBoxes = document.getElementsByClassName("playerBox");
    while (playerBoxes.length > 1) {
      felt.removeChild(playerBoxes[playerBoxes.length - 1]);
    }
    playerScore.innerHTML = 0;
    dealerScore.innerHTML = 0;
    betNum.innerHTML = bet;
    Array.from(document.getElementsByClassName("chip")).forEach(
      chip => (chip.style.pointerEvents = "auto")
    );
    deckUp.style.pointerEvents = "auto";
    deckDown.style.pointerEvents = "auto";
    surrender.disabled = true;
  };

  // calculate value of card
  const calcVal = cardName => {
    if (cardName[0] === "A") {
      return 11;
    } else if (isNaN(cardName[0])) {
      return 10;
    }
    return parseInt(cardName);
  };

  const startGame = id => {
    // NEW GAME
    playerHands[0].bet = betNum.innerHTML;
    Array.from(document.getElementsByClassName("chip")).forEach(
      chip => (chip.style.pointerEvents = "none")
    );
    if (firstGame) {
      assignImages();
      firstGame = false;
    }
    for (let i = 0; i < 4; i++) {
      if (i < 2) {
        (function(idx) {
          setTimeout(() => {
            dealCard(playerHands[0]);
          }, (idx * 200) / fast);
        })(i);
      }
      // deal dealer's first two cards, but only flip first one
      if (i > 1 && i < 4) {
        (function(idx) {
          setTimeout(() => {
            dealCard(dealerHand);
          }, (idx * 200) / fast);
        })(i);
      }
    }
    startGameBtn.disabled = true;
    playerBox.childNodes.forEach(node => (node.disabled = false));
    splitBtn.disabled = false;
    deckUp.style.pointerEvents = "none";
    deckDown.style.pointerEvents = "none";
  };

  const splitHand = e => {
    let newPlayerBox = playerBox.cloneNode(true);
    newPlayerBox.style.left = playerHands.length * 250 + "px";
    newPlayerBox.num = playerHands.length;
    felt.appendChild(newPlayerBox);
    newPlayerBox.childNodes.forEach(node => (node.disabled = false));
    // assign new hit button
    newPlayerBox.childNodes[1].addEventListener("click", () => {
      dealCard(playerHands[newPlayerBox.num]);
    });
    // assign new stand button
    newPlayerBox.childNodes[2].addEventListener("click", () => {
      stand(playerHands[newPlayerBox.num]);
    });
    // assign new DD button
    newPlayerBox.childNodes[3].addEventListener("click", thisButton => {
      doubleDown(thisButton);
    });
    // assign new split button
    newPlayerBox.childNodes[4].addEventListener("click", thisButton =>
      splitHand(thisButton)
    );
    playerHands.push({
      score: 0,
      hand: [],
      status: null,
      standing: false,
      bet: bet,
      id: playerHands.length
    });
    newPlayerBox.id = playerHands[playerHands.length - 1].id;
    let thisHand;
    if (e.path) {
      thisHand = playerHands[e.path[1].id];
    } else {
      thisHand = playerHands[e.composedPath()[1].id];
    }
    const splitCard = thisHand.hand.pop();
    splitCard.style.left = 15 + 250 * (playerHands.length - 2) + 250 + "px";
    splitCard.style.top = 290 + "px";
    dealCard(thisHand);
    playerHands[playerHands.length - 1].hand.push(splitCard);
    dealCard(playerHands[playerHands.length - 1]);
    betNum.innerHTML = betNum.innerHTML * 1 + bet * 1;
  };

  const doubleDown = e => {
    let thisHand;
    if (e.path) {
      thisHand = playerHands[e.path[1].id];
    } else {
      thisHand = playerHands[e.composedPath()[1].id];
    }
    betNum.innerHTML = betNum.innerHTML * 1 + thisHand.bet * 1;
    thisHand.bet = thisHand.bet * 2;
    dealCard(thisHand);
    stand(thisHand);
  };

  function toggleBet(e, placed = true) {
    let chipValue = e.firstChild.innerHTML * 1;
    if (placed === true) {
      bet += chipValue;
    } else {
      bet -= chipValue;
    }
    playerHands[0].bet = bet;
    betNum.innerHTML = bet;
  }

  function chipMover(c, offset) {
    let topVal = parseInt(c.style.top);
    if (topVal > 500) {
      c.style.top = topVal - 100 - offset * 5 + "px";
      c.style.zIndex = -(offset - 10);
      c.classList.add("placed");
      toggleBet(c, true);
    } else {
      c.style.top = topVal + 100 + offset * 5 + "px";
      c.style.zIndex = offset;
      c.classList.remove("placed");
      toggleBet(c, false);
    }
  }

  const stage = document.createElement("div");
  stage.id = "stage";
  const felt = document.createElement("div");
  // create felt

  const playerBox = document.createElement("div");
  playerBox.classList.add("playerBox");
  playerBox.id = playerHands[playerHands.length - 1].id;
  felt.id = "felt";
  stage.appendChild(felt);
  felt.appendChild(playerBox);

  // create gambling chips
  const chip = document.createElement("div");
  chip.classList.add("chip");
  chip.innerHTML = `<div class="chip-number">100</div>`;
  chip.addEventListener("click", function() {
    if (chip.classList.contains("placed")) {
      chip.classList.remove("placed");
    } else {
      chip.classList.add("placed");
    }
  });
  for (let i = 0; i < 30; i++) {
    let os = i % 10;
    // blue 10 chips
    if (i < 10) {
      let newChip = chip.cloneNode(true);
      newChip.innerHTML = `<div class="chip-number">10</div>`;
      newChip.onclick = e => chipMover(newChip, os);
      newChip.style.top = 600 - 3 * i + "px";
      newChip.style.left = 100 + 100 * Math.floor(i / 10) + "px";
      let blueImg = require(`./blue-chip.png`);
      newChip.style.backgroundImage = `url(${blueImg})`;
      felt.appendChild(newChip);
      // red 100 chips
    } else if (i < 20) {
      let newChip = chip.cloneNode(true);
      newChip.innerHTML = `<div class="chip-number">100</div>`;
      newChip.onclick = e => chipMover(newChip, os);
      newChip.style.top = 630 - 3 * i + "px";
      newChip.style.left = 100 + 100 * Math.floor(i / 10) + "px";
      let redImg = require(`./red-chip.png`);
      newChip.style.backgroundImage = `url(${redImg})`;
      felt.appendChild(newChip);
    } else {
      // green 500 chips
      let newChip = chip.cloneNode(true);
      newChip.innerHTML = `<div class="chip-number">500</div>`;
      newChip.onclick = e => chipMover(newChip, os);
      newChip.style.top = 660 - 3 * i + "px";
      newChip.style.left = 100 + 100 * Math.floor(i / 10) + "px";
      let greenImg = require(`./green_chip.png`);
      newChip.style.backgroundImage = `url(${greenImg})`;
      felt.appendChild(newChip);
    }
  }

  // create bet and winnings display
  const betD = document.createElement("h1");
  const winningsD = document.createElement("h1");
  const betNum = document.createElement("span");
  betNum.innerHTML = bet;
  betD.classList.add("betD");
  winningsD.classList.add("winningsD");
  betD.innerHTML = `Current Bet: `;
  betD.appendChild(betNum);
  winningsD.innerHTML = `Winnings: ${winnings}`;
  felt.appendChild(betD);
  felt.appendChild(winningsD);
  let betVal = betNum.innerHTML;

  // create player score h1s
  const playerScore = document.createElement("h1");
  playerScore.classList.add("player-score");
  playerScore.innerHTML = 0;
  playerBox.appendChild(playerScore);
  const dealerScore = document.createElement("h1");
  dealerScore.classList.add("dealer-score");
  dealerScore.innerHTML = 0;
  felt.appendChild(dealerScore);

  // Start Game and Reset Buttons
  const resetBtn = document.createElement("button");
  resetBtn.classList.add("reset");
  resetBtn.innerHTML = "RESET";
  resetBtn.addEventListener("click", () => reset());
  felt.appendChild(resetBtn);
  const startGameBtn = document.createElement("button");
  startGameBtn.classList.add("start");
  startGameBtn.innerHTML = "START GAME";
  startGameBtn.addEventListener("click", () => startGame());
  felt.appendChild(startGameBtn);

  function sur() {
    playerHands[0].status = "surrender";
    winnings -= playerHands[0].bet * 0.5;
    winningsD.innerHTML = `Winnings: ${winnings}`;
    setMessage("surrender");
    // stand(playerHands[0]);
    playerBox.childNodes.forEach(node => (node.disabled = true));
    if (dealerHand.hand[1].classList.contains("flip")) {
      dealerHand.hand[1].classList.remove("flip");
    } else {
      dealerHand.hand[1].classList.add("flip");
    }
    calcHandScore(dealerHand);
    setTimeout(function() {
      reset();
    }, 1000);
  }

  // create "surrender" button
  const surrender = document.createElement("button");
  surrender.classList.add("surrender");
  surrender.innerHTML = "SURRENDER";
  surrender.onclick = sur;
  felt.appendChild(surrender);
  surrender.disabled = true;

  // create "hit" button
  const hitBtn = document.createElement("button");
  hitBtn.classList.add("hit-btn");
  hitBtn.innerHTML = "HIT";
  hitBtn.addEventListener("click", () => {
    dealCard(playerHands[0]);
  });
  playerBox.appendChild(hitBtn);

  // create "stand" button
  const standBtn = document.createElement("button");
  standBtn.classList.add("stand-btn");
  standBtn.innerHTML = "STAND";
  standBtn.addEventListener("click", () => {
    playerHands[0].standing = true;
    playerBox.childNodes.forEach(node => (node.disabled = true));
    if (playerHands.every(hand => hand.standing === true)) {
      startDealerTurn();
    }
  });
  playerBox.appendChild(standBtn);

  const ddBtn = document.createElement("button");
  ddBtn.classList.add("dd-btn");
  ddBtn.innerHTML = "DOUBLE DOWN";
  ddBtn.addEventListener("click", thisButton => doubleDown(thisButton));
  playerBox.appendChild(ddBtn);

  // create "split" button
  const splitBtn = document.createElement("button");
  splitBtn.classList.add("split-btn");
  splitBtn.id = 0;
  splitBtn.innerHTML = "SPLIT";
  splitBtn.disabled = true;
  splitBtn.addEventListener("click", thisButton => splitHand(thisButton));
  playerBox.appendChild(splitBtn);

  let fast = 1;

  function toggleFaster() {
    if (fast === 1) {
      fast = 3;
      faster.innerHTML = "SLOWER";
      stage.classList.add("fast");
    } else {
      fast = 1;
      faster.innerHTML = "FASTER";
      stage.classList.remove("fast");
    }
  }

  // create "faster" button
  const faster = document.createElement("button");
  faster.classList.add("faster");
  faster.innerHTML = "FASTER";
  faster.onclick = toggleFaster;
  felt.appendChild(faster);

  function changeDeckNumber(e) {
    if (e.composedPath()[0].innerHTML === "▶" && deckNum.innerHTML < 8) {
      deckNum.innerHTML = deckNum.innerHTML * 1 + 1;
      cloneCards();
    } else if (
      e.composedPath()[0].innerHTML === "◀" &&
      deckNum.innerHTML * 1 > 1
    ) {
      deckNum.innerHTML = deckNum.innerHTML * 1 - 1;
      cloneCards();
    }
  }

  // create # of decks selector
  const deckBox = document.createElement("div");
  deckBox.classList.add("deck-box");
  const deckHeader = document.createElement("h1");
  deckHeader.innerHTML = "# of Decks";
  deckBox.appendChild(deckHeader);
  const deckDown = document.createElement("span");
  deckDown.innerHTML = "◀";
  deckDown.onclick = e => changeDeckNumber(e);
  deckBox.appendChild(deckDown);
  const deckNum = document.createElement("span");
  deckNum.innerHTML = 1;
  deckBox.appendChild(deckNum);
  const deckUp = document.createElement("span");
  deckUp.innerHTML = "▶";
  deckUp.onclick = e => changeDeckNumber(e);
  deckBox.appendChild(deckUp);
  felt.appendChild(deckBox);

  // create "Message" display
  const messageD = document.createElement("div");
  messageD.classList.add("message");
  messageD.innerHTML = "The BlackJack Table -- Dealer Hits on Soft 17";
  const msgList = document.createElement("ul");
  msgList.classList.add("msg-list");
  messageD.appendChild(msgList);
  felt.appendChild(messageD);

  // template for card
  const card = document.createElement("div");
  card.classList.add("flip-container");
  // create child elements within card and add flipper classes
  const cardFlipper = document.createElement("div");
  cardFlipper.classList.add("flipper");
  const cardFlipperFront = document.createElement("div");
  cardFlipperFront.classList.add("front");
  cardFlipper.appendChild(cardFlipperFront);
  const cardFlipperBack = document.createElement("div");
  cardFlipperBack.classList.add("back");
  cardFlipperBack.innerHTML = `<img src=${require("./PNG/purple_back.png")} />`;
  cardFlipper.appendChild(cardFlipperBack);
  // add children to card
  card.appendChild(cardFlipper);

  playerBox.childNodes.forEach(node => (node.disabled = true));

  // clone card element 52 times
  function cloneCards() {
    let existingCards = document.getElementsByClassName("flip-container");
    if (existingCards) {
      for (let i = existingCards.length - 1; i > 0; i--) {
        felt.removeChild(existingCards[i]);
      }
    }
    cards = [];
    for (let i = 0; i < 52 * (deckNum.innerHTML * 1); i++) {
      let newCard = card.cloneNode(true);

      // append html element card to felt and push to cards array
      felt.appendChild(newCard);
      cards.push(newCard);
      cards[i].style.transform = `rotate(${Math.floor(Math.random() * 10)}deg)`;
    }

    firstGame = true;
  }
  cloneCards();

  console.log(stage);
  return (
    <div
      ref={nodeElement => {
        nodeElement && nodeElement.appendChild(stage);
      }}
    ></div>
  );
};

export default BlackJack;
