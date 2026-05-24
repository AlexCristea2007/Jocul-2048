// VARIABILE GLOBALE
var tabla = [];
var scor = 0;
var dimensiune = 4;
var dificultate = "easy";
var uniqueIdCounter = 0;
var inputLock = false;

// Contor mutări și cronometru
var numarMutari = 0;
var timpJucat = 0;
var intervalTimer = null;

// Scop câștig
var scopCastig = 2048;
var castigat = false;

// Istoric pentru Anulare (un nivel)
var istoricTabla = null;
var istoricScor = 0;
var istoricMutari = 0;

// Variabile pentru swipe
var startX = 0;
var startY = 0;

/* Functia start - la incarcarea paginii */
window.onload = function () {
  incarcaTema();
  incarcaDificultate();
  incarcaScop();
  // Timer-ul pornit de initiazaJoc e oprit — intro-ul controleaza temporizarea
  if (intervalTimer) {
    clearInterval(intervalTimer);
    intervalTimer = null;
  }
  timpJucat = 0;
  actualizeazaAfisajTimp();
  inputLock = true;

  pornestIntro(function () {
    var stareSalvata = localStorage.getItem("2048-stare-" + dificultate);
    if (stareSalvata) {
      try {
        incarcaStare(JSON.parse(stareSalvata));
      } catch (e) {
        localStorage.removeItem("2048-stare-" + dificultate);
        initiazaTimerJoc();
      }
    } else {
      initiazaTimerJoc();
    }
    ascultaInput();
    inputLock = false;
  });
};

function initiazaTimerJoc() {
  if (intervalTimer) clearInterval(intervalTimer);
  intervalTimer = setInterval(function () {
    timpJucat++;
    actualizeazaAfisajTimp();
  }, 1000);
}

/* Genereaza patratele goale de fundal în DOM */
function creeazaGridBackground() {
  var backgroundContainer = document.getElementById("grid-background");
  for (var i = 0; i < dimensiune * dimensiune; i++) {
    var cell = document.createElement("div");
    cell.classList.add("celula-goala");
    backgroundContainer.appendChild(cell);
  }
}

/* Reseteaza variabilele si porneste un joc nou */
function initiazaJoc() {
  tabla = [];
  for (var r = 0; r < dimensiune; r++) {
    var rand = [];
    for (var c = 0; c < dimensiune; c++) {
      rand.push(0);
    }
    tabla.push(rand);
  }
  document.getElementById("tile-container").innerHTML = "";

  scor = 0;
  actualizeazaScor(0);
  ascundeGameOver();
  document.getElementById("overlay-win").classList.remove("activ");
  castigat = false;
  inputLock = false;

  istoricTabla = null;
  document.getElementById("btn-anulare").classList.remove("activ");

  numarMutari = 0;
  timpJucat = 0;
  actualizeazaAfisajMutari();
  actualizeazaAfisajTimp();
  if (intervalTimer) clearInterval(intervalTimer);
  intervalTimer = setInterval(function () {
    timpJucat++;
    actualizeazaAfisajTimp();
  }, 1000);

  genereazaNumarNou();
  genereazaNumarNou();

  deseneazaTabla();
}

function restartJoc() {
  localStorage.removeItem("2048-stare-" + dificultate);
  initiazaJoc();
}

// LOGICA JOCULUI

/* Gaseste o pozitie libera si adaugă un 2 sau 4. */
function genereazaNumarNou() {
  var pozitiiLibere = [];
  for (var r = 0; r < dimensiune; r++) {
    for (var c = 0; c < dimensiune; c++) {
      if (tabla[r][c] === 0) pozitiiLibere.push({ r: r, c: c });
    }
  }

  if (pozitiiLibere.length > 0) {
    var indexRandom = Math.floor(Math.random() * pozitiiLibere.length);
    var pozitie = pozitiiLibere[indexRandom];

    // Creare obiect cu valoare si ID unic
    tabla[pozitie.r][pozitie.c] = {
      valoare: Math.random() < 0.9 ? 2 : 4,
      id: "tile-" + uniqueIdCounter++,
      nou: true, // flag pentru animatie
    };
  }
}

/* Sincronizeaza matricea cu elementele DOM */
function deseneazaTabla() {
  var container = document.getElementById("tile-container");
  var tileUriValideIds = new Set();

  // 1. Iterare prin matricea si actualizari
  for (var r = 0; r < dimensiune; r++) {
    for (var c = 0; c < dimensiune; c++) {
      var celulaLogica = tabla[r][c];

      if (celulaLogica !== 0) {
        tileUriValideIds.add(celulaLogica.id);

        var selector = `.celula[data-id="${celulaLogica.id}"]`;
        var tileDom = document.querySelector(selector);

        if (!tileDom) {
          // Creare element nou
          tileDom = document.createElement("div");
          tileDom.setAttribute("data-id", celulaLogica.id);
          container.appendChild(tileDom);
        }

        // Stiluri
        tileDom.className = `celula t-${celulaLogica.valoare}`;
        tileDom.innerText = celulaLogica.valoare;

        // Setare pozitii
        tileDom.style.setProperty("--r", r);
        tileDom.style.setProperty("--c", c);

        // Animatia de aparitie
        if (celulaLogica.nou) {
          tileDom.classList.add("animatie-nou");
          celulaLogica.nou = false;
        }

        // Animatia de fuziune
        if (celulaLogica.merged) {
          tileDom.classList.add("merged");
          setTimeout(() => tileDom.classList.remove("merged"), 250);
          celulaLogica.merged = false;
        }
      }
    }
  }

  // 2. Stergere din DOM placile care au fuzionat
  var tileUriDom = Array.from(container.children);
  tileUriDom.forEach((tile) => {
    if (!tileUriValideIds.has(tile.getAttribute("data-id"))) {
      setTimeout(() => {
        if (tile.parentNode === container) container.removeChild(tile);
      }, 150);
    }
  });
}

/* Procesare mutari intr-o anumita directie */
function muta(directie) {
  if (inputLock) return;
  inputLock = true;

  var snapshotTabla = copieAdancaTabla(tabla);
  var snapshotScor = scor;
  var snapshotMutari = numarMutari;

  var saMiscat = false;

  if (directie === "sus" || directie === "jos") {
    for (var c = 0; c < dimensiune; c++) {
      var coloana = [];
      for (var ri = 0; ri < dimensiune; ri++) {
        coloana.push(tabla[ri][c]);
      }
      if (directie === "jos") coloana.reverse();
      var coloanaNoua = proceseazaLinie(coloana);
      if (directie === "jos") coloanaNoua.reverse();

      for (var r = 0; r < dimensiune; r++) {
        var idVechi = tabla[r][c] ? tabla[r][c].id : null;
        var idNou = coloanaNoua[r] ? coloanaNoua[r].id : null;

        if (idVechi !== idNou) {
          tabla[r][c] = coloanaNoua[r];
          saMiscat = true;
        }
      }
    }
  } else if (directie === "stanga" || directie === "dreapta") {
    for (var r = 0; r < dimensiune; r++) {
      var linie = tabla[r].slice();
      if (directie === "dreapta") linie.reverse();
      var linieNoua = proceseazaLinie(linie);
      if (directie === "dreapta") linieNoua.reverse();

      var linieVecheIds = linie.map((x) => (x ? x.id : null)).join(",");
      var linieNouaIds = linieNoua.map((x) => (x ? x.id : null)).join(",");

      if (linieVecheIds !== linieNouaIds) {
        tabla[r] = linieNoua;
        saMiscat = true;
      }
    }
  }

  if (saMiscat) {
    istoricTabla = snapshotTabla;
    istoricScor = snapshotScor;
    istoricMutari = snapshotMutari;
    document.getElementById("btn-anulare").classList.add("activ");

    numarMutari++;
    actualizeazaAfisajMutari();

    genereazaNumarNou();
    deseneazaTabla();
    salveazaStare();
    setTimeout(function () {
      verificaCastig();
      verificaGameOver();
      inputLock = false;
    }, 200);
  } else {
    inputLock = false;
  }
}

/* Proceseaza si combina o serie de numere */
function proceseazaLinie(linie) {
  var linieFaraZero = linie.filter((val) => val !== 0);

  for (var i = 0; i < linieFaraZero.length - 1; i++) {
    if (linieFaraZero[i].valoare === linieFaraZero[i + 1].valoare) {
      linieFaraZero[i].valoare *= 2;
      linieFaraZero[i].merged = true;
      actualizeazaScor(scor + linieFaraZero[i].valoare);

      linieFaraZero[i + 1] = 0;
    }
  }

  var linieFinala = linieFaraZero.filter((val) => val !== 0);
  while (linieFinala.length < dimensiune) {
    linieFinala.push(0);
  }

  return linieFinala;
}

// GESTIONARE SCOR SI STATUS

function getBestScoreKey() {
  return "2048-best-" + dimensiune;
}

function actualizeazaScor(scorNou) {
  scor = scorNou;
  document.getElementById("scor-curent").innerText = scor;
  var best = localStorage.getItem(getBestScoreKey()) || 0;
  if (scor > best) {
    localStorage.setItem(getBestScoreKey(), scor);
    document.getElementById("scor-best").innerText = scor;
  }
}

function incarcaScorBest() {
  var best = localStorage.getItem(getBestScoreKey()) || 0;
  document.getElementById("scor-best").innerText = best;
}

function verificaGameOver() {
  // 1. Verifica locuri libere
  for (var r = 0; r < dimensiune; r++)
    for (var c = 0; c < dimensiune; c++) if (tabla[r][c] === 0) return;

  // 2. Verifica fuziuni posibile
  for (var r = 0; r < dimensiune; r++) {
    for (var c = 0; c < dimensiune; c++) {
      var valoareCurenta = tabla[r][c].valoare;
      if (c < dimensiune - 1 && valoareCurenta === tabla[r][c + 1].valoare)
        return;
      if (r < dimensiune - 1 && valoareCurenta === tabla[r + 1][c].valoare)
        return;
    }
  }
  arataGameOver();
}

// GESTIONARE MODALE SI OVERLAY

function arataGameOver() {
  if (intervalTimer) {
    clearInterval(intervalTimer);
    intervalTimer = null;
  }
  localStorage.removeItem("2048-stare-" + dificultate);
  document.getElementById("btn-anulare").classList.remove("activ");
  document.getElementById("overlay-game-over").classList.add("activ");
}

function ascundeGameOver() {
  document.getElementById("overlay-game-over").classList.remove("activ");
}

window.deschideReguli = function () {
  document.getElementById("modal-reguli").classList.add("activ");
};

window.inchideReguli = function () {
  document.getElementById("modal-reguli").classList.remove("activ");
};

// CONTOR MUTĂRI ȘI CRONOMETRU

function actualizeazaAfisajMutari() {
  document.getElementById("numar-mutari").innerText = numarMutari;
}

function actualizeazaAfisajTimp() {
  var m = Math.floor(timpJucat / 60)
    .toString()
    .padStart(2, "0");
  var s = (timpJucat % 60).toString().padStart(2, "0");
  document.getElementById("timp-jucat").innerText = m + ":" + s;
}

// SCOP CÂȘTIG

function incarcaScop() {
  var salvat = parseInt(localStorage.getItem("2048-scop")) || 2048;
  scopCastig = salvat;
  document.getElementById("scop-curent").innerText = salvat;
  document.querySelectorAll(".scop-dropdown-item").forEach(function (btn) {
    btn.classList.toggle(
      "activ",
      parseInt(btn.getAttribute("data-value")) === salvat,
    );
  });
}

window.schimbaScop = function (valoare) {
  scopCastig = valoare;
  localStorage.setItem("2048-scop", valoare);
  document.getElementById("scop-curent").innerText = valoare;
  document.querySelectorAll(".scop-dropdown-item").forEach(function (btn) {
    btn.classList.toggle(
      "activ",
      parseInt(btn.getAttribute("data-value")) === valoare,
    );
  });
  document.getElementById("scop-dropdown").classList.remove("activ");
};

window.toggleDropdownScop = function () {
  if (numarMutari > 0) {
    arataToastScop();
    return;
  }
  var dropdown = document.getElementById("scop-dropdown");
  dropdown.classList.toggle("activ");
  if (dropdown.classList.contains("activ")) {
    var activeItem = dropdown.querySelector(".scop-dropdown-item.activ");
    if (activeItem) activeItem.scrollIntoView({ block: "nearest" });
  }
};

var _toastTimer = null;
function arataToastScop() {
  var toast = document.getElementById("toast-scop");
  toast.classList.add("activ");
  if (_toastTimer) clearTimeout(_toastTimer);
  _toastTimer = setTimeout(function () {
    toast.classList.remove("activ");
    _toastTimer = null;
  }, 2500);
}

function verificaCastig() {
  if (castigat) return;
  for (var r = 0; r < dimensiune; r++) {
    for (var c = 0; c < dimensiune; c++) {
      if (tabla[r][c] !== 0 && tabla[r][c].valoare === scopCastig) {
        castigat = true;
        if (intervalTimer) {
          clearInterval(intervalTimer);
          intervalTimer = null;
        }
        localStorage.removeItem("2048-stare-" + dificultate);
        document.getElementById("scop-atins").innerText = scopCastig;
        document.getElementById("overlay-win").classList.add("activ");
        return;
      }
    }
  }
}

// ANULARE MUTARE

function copieAdancaTabla(t) {
  return t.map(function (rand) {
    return rand.map(function (celula) {
      return celula === 0
        ? 0
        : { valoare: celula.valoare, id: celula.id, nou: false, merged: false };
    });
  });
}

window.anuleazaMutare = function () {
  if (istoricTabla === null) return;
  tabla = istoricTabla;
  scor = istoricScor;
  numarMutari = istoricMutari;
  actualizeazaScor(scor);
  actualizeazaAfisajMutari();
  deseneazaTabla();
  istoricTabla = null;
  document.getElementById("btn-anulare").classList.remove("activ");
};

// SALVARE / ÎNCĂRCARE STARE JOC

function salveazaStare() {
  var stare = {
    tabla: copieAdancaTabla(tabla),
    scor: scor,
    numarMutari: numarMutari,
    timpJucat: timpJucat,
    uniqueIdCounter: uniqueIdCounter,
  };
  localStorage.setItem("2048-stare-" + dificultate, JSON.stringify(stare));
}

function incarcaStare(stare) {
  tabla = stare.tabla.map(function (rand) {
    return rand.map(function (celula) {
      return celula === 0
        ? 0
        : { valoare: celula.valoare, id: celula.id, nou: false, merged: false };
    });
  });
  uniqueIdCounter = stare.uniqueIdCounter;
  numarMutari = stare.numarMutari;
  timpJucat = stare.timpJucat;
  actualizeazaScor(stare.scor);
  actualizeazaAfisajMutari();
  actualizeazaAfisajTimp();
  deseneazaTabla();
  if (intervalTimer) clearInterval(intervalTimer);
  intervalTimer = setInterval(function () {
    timpJucat++;
    actualizeazaAfisajTimp();
  }, 1000);
}

// GESTIONARE DIFICULTATE

function getDimensiuniDificultate(dif) {
  var smallScreen = window.innerWidth < 400;
  if (dif === "easy") {
    return smallScreen
      ? { gridSize: 4, cellSize: "65px", gapSize: "8px", fontSize: "26px" }
      : { gridSize: 4, cellSize: "80px", gapSize: "10px", fontSize: "30px" };
  } else if (dif === "medium") {
    return smallScreen
      ? { gridSize: 6, cellSize: "50px", gapSize: "6px", fontSize: "18px" }
      : { gridSize: 6, cellSize: "65px", gapSize: "8px", fontSize: "22px" };
  } else {
    return smallScreen
      ? { gridSize: 8, cellSize: "38px", gapSize: "5px", fontSize: "13px" }
      : { gridSize: 8, cellSize: "50px", gapSize: "6px", fontSize: "16px" };
  }
}

function incarcaDificultate() {
  var difSalvata = localStorage.getItem("2048-dificultate") || "easy";
  schimbaDificultate(difSalvata, false);
}

window.schimbaDificultate = function (dif, clearSave) {
  dificultate = dif;
  localStorage.setItem("2048-dificultate", dif);
  if (clearSave !== false) localStorage.removeItem("2048-stare-" + dif);

  var dim = getDimensiuniDificultate(dif);
  dimensiune = dim.gridSize;

  document.documentElement.style.setProperty("--grid-size", dim.gridSize);
  document.documentElement.style.setProperty("--cell-size", dim.cellSize);
  document.documentElement.style.setProperty("--gap-size", dim.gapSize);
  document.documentElement.style.setProperty("--tile-font-size", dim.fontSize);

  // Setare directa a coloanelor/randurilor grilei pentru compatibilitate maxima
  var bg = document.getElementById("grid-background");
  bg.style.gridTemplateColumns =
    "repeat(" + dim.gridSize + ", " + dim.cellSize + ")";
  bg.style.gridTemplateRows =
    "repeat(" + dim.gridSize + ", " + dim.cellSize + ")";
  bg.innerHTML = "";
  creeazaGridBackground();

  incarcaScorBest();
  initiazaJoc();
  inchideSelectorDificultate();
};

window.deschideSelectorDificultate = function () {
  document.querySelectorAll(".dificultate-optiune").forEach(function (btn) {
    btn.classList.remove("activ");
  });
  var activeBtn = document.getElementById("btn-" + dificultate);
  if (activeBtn) activeBtn.classList.add("activ");
  document.getElementById("modal-dificultate").classList.add("activ");
};

window.inchideSelectorDificultate = function () {
  document.getElementById("modal-dificultate").classList.remove("activ");
};

// GESTIONARE TEME

/* Incarca tema din localStorage si o aplica pe elementul <body> */
function incarcaTema() {
  var temaSalvata = localStorage.getItem("2048-tema") || "albastru";
  document.body.className = "tema-" + temaSalvata; // Aplica intotdeauna clasa
}

/* Schimba tema curenta, o salveaza si inchide selectorul */
window.schimbaTema = function (numeTema) {
  localStorage.setItem("2048-tema", numeTema);
  incarcaTema();
  inchideSelectorTema();
};

window.deschideSelectorTema = function () {
  document.getElementById("modal-tema").classList.add("activ");
};

window.inchideSelectorTema = function () {
  document.getElementById("modal-tema").classList.remove("activ");
};

// Inchidere la click in afara ferestrei
window.onclick = function (event) {
  var modalReguli = document.getElementById("modal-reguli");
  var modalTema = document.getElementById("modal-tema");
  var modalDificultate = document.getElementById("modal-dificultate");

  if (event.target == modalReguli) inchideReguli();
  if (event.target == modalTema) inchideSelectorTema();
  if (event.target == modalDificultate) inchideSelectorDificultate();

  if (!event.target.closest(".scop-wrapper")) {
    document.getElementById("scop-dropdown").classList.remove("activ");
  }
};

// EVENIMENTE INPUT (TASTATURĂ & SWIPE)

function ascultaInput() {
  document.addEventListener("keydown", function (e) {
    if (
      ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(e.code) > -1
    )
      e.preventDefault();
    switch (e.key) {
      case "ArrowUp":
        muta("sus");
        break;
      case "ArrowDown":
        muta("jos");
        break;
      case "ArrowLeft":
        muta("stanga");
        break;
      case "ArrowRight":
        muta("dreapta");
        break;
    }
  });

  var zonaJoc = document.getElementById("container-joc");
  zonaJoc.addEventListener(
    "touchstart",
    function (e) {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    },
    { passive: false },
  );

  zonaJoc.addEventListener(
    "touchend",
    function (e) {
      if (!startX || !startY) return;
      var endX = e.changedTouches[0].clientX;
      var endY = e.changedTouches[0].clientY;
      gestioneazaSwipe(endX, endY);
    },
    { passive: false },
  );
}

function gestioneazaSwipe(endX, endY) {
  var diffX = endX - startX;
  var diffY = endY - startY;
  var prag = 30;

  if (Math.abs(diffX) < prag && Math.abs(diffY) < prag) return;

  if (Math.abs(diffX) > Math.abs(diffY)) {
    diffX > 0 ? muta("dreapta") : muta("stanga");
  } else {
    diffY > 0 ? muta("jos") : muta("sus");
  }
  startX = 0;
  startY = 0;
}

// INTRO CINEMATIC

function pornestIntro(callback) {
  var overlay = document.getElementById("intro-overlay");
  var tileMain = document.getElementById("intro-tile-main");
  var tileLeft = document.getElementById("intro-tile-left");
  var tileRgt = document.getElementById("intro-tile-right");

  // Tile "2" apare cu pop
  setTimeout(function () {
    tileMain.style.animation = "introApare 0.4s ease-out forwards";
  }, 400);

  // Puls heartbeat x2
  setTimeout(function () {
    tileMain.style.animation = "introPuls 1000ms ease-in-out 2 forwards";
  }, 900);

  // Cele doua tile "2" laterale apar
  setTimeout(function () {
    tileMain.style.animation = "";
    tileMain.style.opacity = "1";
    tileLeft.style.animation = "introApare 0.3s ease-out forwards";
    tileRgt.style.animation = "introApare 0.3s ease-out forwards";
  }, 2050);

  // Tilele laterale aluneca spre centru
  setTimeout(function () {
    tileLeft.style.animation = "introSlideStg 0.4s ease-in forwards";
    tileRgt.style.animation = "introSlideDrt 0.4s ease-in forwards";
  }, 2650);

  // Fuziune → "4" cu flash
  setTimeout(function () {
    tileMain.innerText = "4";
    tileMain.style.background = "#4d94ff";
    tileMain.style.animation = "introFlash 0.35s ease";
  }, 3100);

  // "4" → "8" cu stralucire aurie
  setTimeout(function () {
    tileMain.innerText = "8";
    tileMain.style.animation = "introGlow 0.75s ease forwards";
  }, 3500);

  // "8" se expandeaza → overlay dispare, UI-ul real se reveleaza
  setTimeout(function () {
    tileMain.style.animation = "introExpand 0.6s ease-in forwards";
    overlay.classList.add("intro-fade-out");
    revealGameUI();
  }, 4300);

  // Flash alb pe grid
  setTimeout(function () {
    var grid = document.getElementById("container-joc");
    grid.classList.add("grid-flash");
    document.body.classList.remove("intro-activ");
  }, 4850);

  // Inlatura overlay-ul si porneste jocul
  setTimeout(function () {
    overlay.style.display = "none";
    if (callback) callback();
  }, 5300);
}

function revealGameUI() {
  var h1 = document.querySelector("h1");
  var scorContainer = document.querySelector(".scor-container");
  var grid = document.getElementById("container-joc");
  var footer = document.querySelector("footer");
  var buttons = document.querySelectorAll(
    ".butoane-joc .btn, .butoane-joc .scop-wrapper",
  );
  var mid = Math.floor(buttons.length / 2);

  // Titlu se scaleza din centru
  h1.classList.add("reveal-h1");

  // Grid materializeaza la 120ms
  setTimeout(function () {
    grid.classList.add("reveal-grid");
  }, 120);

  // Scorboxele coboara din sus la 230ms
  setTimeout(function () {
    scorContainer.classList.add("reveal-drop");
  }, 230);

  // Butoanele aluneca din parti la 340ms
  setTimeout(function () {
    buttons.forEach(function (btn, i) {
      btn.style.animationDelay = i * 45 + "ms";
      btn.classList.add(i < mid ? "reveal-left" : "reveal-right");
    });
  }, 340);

  // Footer apare in fade la 460ms
  setTimeout(function () {
    footer.classList.add("reveal-fade");
  }, 460);
}

function initiazaJoc() {
  //...
  tabla = [];
  for (var r = 0; r < dimensiune; r++) {
    var rand = [];
    for (var c = 0; c < dimensiune; c++) {
      rand.push(0);
    }
    tabla.push(rand);
  }
  scor = 0;
  numarMutari = 0;
  timpJucat = 0;
  //...
  genereazaNumarNou();
  genereazaNumarNou();
  deseneazaTabla();
  //...
}

function proceseazaLinie(linie) {
  var linieFaraZero = linie.filter((val) => val !== 0);
  for (var i = 0; i < linieFaraZero.length - 1; i++) {
    if (linieFaraZero[i].valoare === linieFaraZero[i + 1].valoare) {
      linieFaraZero[i].valoare *= 2;
      linieFaraZero[i].merged = true;
      actualizeazaScor(scor + linieFaraZero[i].valoare);
      linieFaraZero[i + 1] = 0;
    }
  }
  //...
  var linieFinala = linieFaraZero.filter((val) => val !== 0);
  while (linieFinala.length < dimensiune) {
    linieFinala.push(0);
  }
  return linieFinala;
}
