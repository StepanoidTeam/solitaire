function Solitaire() {
  /* Обозначение карточных мастей: 
  h – червы (hеarts), 
  d –бубны (diamonds), 
  c – трефы (clubs), 
  s – пики (spades). 
  Достоинство карт: 
  A – туз (Ace), 
  K – король (King), 
  Q – дама (Queen), 
  J – валет (Jack), 
  T — десятка (Ten), 
  дальше все понятно. */

  // todo(vmyshko): gen cards in loop?
  var cards = [
    { name: "2h" },
    { name: "3h" },
    { name: "4h" },
    { name: "5h" },
    { name: "6h" },
    { name: "7h" },
    { name: "8h" },
    { name: "9h" },
    { name: "Th" },
    { name: "Jh" },
    { name: "Qh" },
    { name: "Kh" },
    { name: "Ah" },
    //
    { name: "2d" },
    { name: "3d" },
    { name: "4d" },
    { name: "5d" },
    { name: "6d" },
    { name: "7d" },
    { name: "8d" },
    { name: "9d" },
    { name: "Td" },
    { name: "Jd" },
    { name: "Qd" },
    { name: "Kd" },
    { name: "Ad" },
    //
    { name: "2c" },
    { name: "3c" },
    { name: "4c" },
    { name: "5c" },
    { name: "6c" },
    { name: "7c" },
    { name: "8c" },
    { name: "9c" },
    { name: "Tc" },
    { name: "Jc" },
    { name: "Qc" },
    { name: "Kc" },
    { name: "Ac" },
    //
    { name: "2s" },
    { name: "3s" },
    { name: "4s" },
    { name: "5s" },
    { name: "6s" },
    { name: "7s" },
    { name: "8s" },
    { name: "9s" },
    { name: "Ts" },
    { name: "Js" },
    { name: "Qs" },
    { name: "Ks" },
    { name: "As" },
  ];

  function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function flipCard(cardEl, isOpen) {
    cardEl.classList.toggle("card_closed", !isOpen);
    cardEl.draggable = isOpen;
  }

  function shuffleCards() {
    const CARDS_IN_COLUMN = [1, 2, 3, 4, 5, 6, 7];
    const CARDS_IN_DECK = 24;

    const holderPiles = document.querySelectorAll(".piles>.holder");

    holderPiles.forEach((holderEl, i) => {
      addRandomCardsToHolder(holderEl, CARDS_IN_COLUMN[i]);
    });

    addRandomCardsToHolder(
      document.querySelector(".deck_close"),
      CARDS_IN_DECK
    );
  }

  function addRandomCardsToHolder(holderEl, cardCount) {
    if (cardCount > cards.length) throw Error("not enough cards");

    for (let i = 0; i < cardCount; i++) {
      const randomCardIndex = random(0, cards.length - 1);
      const [randomCard] = cards.splice(randomCardIndex, 1);

      holderEl.append(randomCard.div);
    }
  }

  function createCard(card) {
    const cardTemplate = document.querySelector("#card-template");
    const cardDiv = cardTemplate.content.cloneNode(true).firstElementChild;

    const [weight, suit] = card.name.split("");
    cardDiv.id = card.name;

    var suitGraph = choiceCardPictures(suit);
    var field = document.querySelector(".field");
    // var cardDiv = document.createElement("div");
    const leftTopCardName = cardDiv.querySelector(".card__corner-top-left");
    const rightBottomCardName = cardDiv.querySelector(
      ".card__corner-bottom-right"
    );
    const centerCardName = cardDiv.querySelector(".card__center");

    cardDiv.dataset.weight = weight;
    cardDiv.dataset.suit = suit;

    flipCard(cardDiv, false);

    leftTopCardName.innerHTML = weight + suitGraph;
    rightBottomCardName.innerHTML = weight + suitGraph;
    centerCardName.innerHTML = suitGraph;

    setupCardEvents(cardDiv);

    field.appendChild(cardDiv);
    return cardDiv;
  }

  // todo(vmyshko): remove this, render symbols in css? svg?
  function choiceCardPictures(suit) {
    var suitGraph;
    switch (suit) {
      case "h":
        suitGraph = "&hearts;";
        break;
      case "d":
        suitGraph = "&diams;";
        break;
      case "c":
        suitGraph = "&clubs;";
        break;
      case "s":
        suitGraph = "&spades;";
        break;
      default:
        console.log("switch suit error");
        break;
    }
    return suitGraph;
  }

  function openLastCardInHolder(holderEl) {
    if (holderEl.childElementCount === 0) return;

    flipCard(holderEl.lastElementChild, true);
  }

  function openAllLastCards() {
    document.querySelectorAll(".piles>.holder").forEach(openLastCardInHolder);
  }

  // deck logic
  document.querySelector(".deck_close").addEventListener("click", (event) => {
    const deckCloseEl = document.querySelector(".deck_close");
    const deckOpenEl = document.querySelector(".deck_open");

    const topCard = deckCloseEl.lastElementChild;

    if (topCard) {
      //do flip
      deckOpenEl.append(topCard);
      flipCard(topCard, true);
    } else {
      //do reroll
      [...deckOpenEl.children].forEach((cardEl) => {
        deckCloseEl.appendChild(cardEl);
        flipCard(cardEl, false);
      });
    }
  });

  function setupCardEvents(card) {
    card.addEventListener("dragstart", (event) => {
      const draggingCard = event.target;

      const currentHolder = draggingCard.parentElement;
      const isPileHolder = currentHolder.classList.contains("holder_pile");
      const cardsInHolder = [...currentHolder.children];

      const currentCardChildIndex = cardsInHolder.indexOf(draggingCard);
      const cardsToDrag = cardsInHolder.splice(currentCardChildIndex);

      if (!isPileHolder && cardsToDrag.length > 1) {
        // disable to drag many cards not from piles
        event.preventDefault();
        return;
      }

      var dragHolder = document.createElement("div");
      dragHolder.classList.add("holder");

      dragHolder.append(...cardsToDrag.map((card) => card.cloneNode(true)));

      event.dataTransfer.setDragImage(
        dragHolder,
        event.layerX * 2,
        event.layerY * 2
      );

      requestAnimationFrame(() => {
        cardsToDrag.forEach((card) => (card.hidden = true));
        dragHolder.hidden = true;
      });

      document.body.append(dragHolder);

      event.dataTransfer.setData(
        "card-ids",
        cardsToDrag.map((card) => card.id)
      );

      function onDragOver(event) {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
      }

      function onDragEnd(event) {
        cardsToDrag.forEach((card) => (card.hidden = false));

        dragHolder.remove();
        unsubscribe();
      }

      function unsubscribe() {
        document.removeEventListener("dragover", onDragOver);
        document.removeEventListener("dragend", onDragEnd);
      }

      document.addEventListener("dragover", onDragOver);
      card.addEventListener("dragend", onDragEnd);
    });

    card.addEventListener("dblclick", (event) => {
      const currentCard = event.target;

      // check if fits to any suit
      const suitHolders = document.querySelectorAll(".holder_suit");

      [...suitHolders].some((holderEl) => {
        const isAce = currentCard.dataset.weight === "A";
        const emptyHolder = holderEl.childElementCount === 0;
        const topCardEl = holderEl.lastElementChild;

        const sameSuit =
          topCardEl && topCardEl.dataset.suit === currentCard.dataset.suit;

        const weightMoreBy1 =
          topCardEl &&
          getCardNumValue(topCardEl.dataset.weight) ===
            getCardNumValue(currentCard.dataset.weight) - 1;

        if (isAce && emptyHolder) {
          holderEl.append(currentCard);
          return true;
        }

        if (topCardEl && sameSuit && weightMoreBy1) {
          holderEl.append(currentCard);
          return true;
        }

        return false;
      });
      // todo(vmyshko): process other possible cases, e.g. put cards on piles

      // todo(vmyshko): process only prev card holder?
      openAllLastCards();
    });
  }

  // todo(vmyshko): put it to card obj
  function getCardNumValue(value) {
    var numValue;
    switch (value) {
      case "A":
        numValue = 1;
        break;
      case "K":
        numValue = 13;
        break;
      case "Q":
        numValue = 12;
        break;
      case "J":
        numValue = 11;
        break;
      case "T":
        numValue = 10;
        break;
      default:
        numValue = +value;
        break;
    }
    return numValue;
  }

  function colorsDiffer(downCardSuit, upCardSuit) {
    return (
      ["h", "d"].includes(downCardSuit) !== ["h", "d"].includes(upCardSuit)
    );
  }

  // todo(vmyshko): is it possible to restart?
  this.init = function () {
    for (let _card of cards) {
      _card.div = createCard(_card);
    }

    const placeholders = document.querySelectorAll(".holder");

    placeholders.forEach((holderEl) => {
      holderEl.addEventListener("dragover", (event) => {
        event.preventDefault();
      });

      holderEl.addEventListener("drop", (event) => {
        const targetEl = event.target;
        const cardIds = event.dataTransfer.getData("card-ids").split(",");

        const dropCards = cardIds.map((cardId) =>
          document.getElementById(cardId)
        );

        const [dropCardEl] = dropCards;

        // rule flags
        const holderIsPile = holderEl.classList.contains("holder_pile");
        const holderIsSuit = holderEl.classList.contains("holder_suit");

        const dropsToHolder = targetEl.classList.contains("holder");
        const dropsToCard = targetEl.classList.contains("card");

        const differentColors = colorsDiffer(
          targetEl.dataset.suit,
          dropCardEl.dataset.suit
        );
        const sameSuit = targetEl.dataset.suit === dropCardEl.dataset.suit;

        const isKing = dropCardEl.dataset.weight === "K";
        const isAce = dropCardEl.dataset.weight === "A";

        const weightLessBy1 =
          getCardNumValue(targetEl.dataset.weight) ===
          getCardNumValue(dropCardEl.dataset.weight) + 1;
        const weightMoreBy1 =
          getCardNumValue(targetEl.dataset.weight) ===
          getCardNumValue(dropCardEl.dataset.weight) - 1;

        // check rules

        if (holderIsPile) {
          if (dropsToHolder && isKing) {
            holderEl.append(...dropCards);
          }

          if (dropsToCard && differentColors && weightLessBy1) {
            holderEl.append(...dropCards);
          }
        }

        if (holderIsSuit && dropCards.length === 1) {
          if (dropsToHolder && isAce) {
            holderEl.append(...dropCards);
          }

          if (dropsToCard && sameSuit && weightMoreBy1) {
            holderEl.append(...dropCards);
          }
        }

        // todo(vmyshko): process only prev card holder?
        openAllLastCards();
      });
    });

    shuffleCards();
    openAllLastCards();
  };
}

// todo(vmyshko): no need for class here
var newSolitaire = new Solitaire();

newSolitaire.init();
