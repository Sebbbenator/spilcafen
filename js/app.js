"use strict";

let allGames = [];

const state = {
  query: "",
  genre: "",
  language: "",
  minPlayers: "",
  minRating: 0,
  location: "",
};


const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

function langFlag(lang = "") {
  const t = (lang || "").toLowerCase();
  if (["da", "dk", "dansk", "danish"].some((k) => t.includes(k))) return "🇩🇰";
  if (["en", "engelsk", "english"].some((k) => t.includes(k))) return "🇬🇧";
}

function stjerneIkoner(r = 0) {
  const full = Math.floor(r);
  const half = r - full >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  const stjerne = `<svg class="stjerne" viewBox="0 0 24 24" aria-hidden="true"><path fill="#F5C451" d="M12 17.3l6.18 3.7-1.64-7.03L21 9.24l-7.19-.61L12 2 10.19 8.63 3 9.24l4.46 4.73L5.82 21z"/></svg>`;
  const halv = `<svg class="stjerne" viewBox="0 0 24 24"><defs><linearGradient id="g"><stop offset="50%" /><stop offset="50%" stop-color="#ddd"/></linearGradient></defs><path fill="url(#g)" d="M12 17.3l6.18 3.7-1.64-7.03L21 9.24l-7.19-.61L12 2 10.19 8.63 3 9.24l4.46 4.73L5.82 21z"/><path fill="#F5C451" d="M12 17.3l0 0 0 0"/></svg>`;
  const tom = `<svg class="stjerne" viewBox="0 0 24 24"><path fill="#ddd" d="M12 17.3l6.18 3.7-1.64-7.03L21 9.24l-7.19-.61L12 2 10.19 8.63 3 9.24l4.46 4.73L5.82 21z"/></svg>`;
  return (
    stjerne.repeat(full) +
    halv.repeat(half) +
    tom.repeat(empty) +
    `<small>${r.toFixed(1)}/5</small>`
  );
}

function personIkon() {
  return `<svg class="ikon" viewBox="0 0 24 24"><path fill="currentColor" d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4.42 0-8 2.24-8 5v1h16v-1c0-2.76-3.58-5-8-5Z"/></svg>`;
}
function urIkon() {
  return `<svg class="ikon" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2Zm1 11h-5V11h4V6h2Z"/></svg>`;
}
function hjerteIkon(aktiv) {
  return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${
    aktiv
      ? "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5A4.5 4.5 0 0 1 6.5 4 5.4 5.4 0 0 1 12 6a5.4 5.4 0 0 1 5.5-2 4.5 4.5 0 0 1 4.5 4.5c0 3.78-3.4 6.86-8.55 11.54z"
      : "M12.1 8.64 12 8.77l-.1-.13C10.14 6.6 7.1 6.24 5.4 8.03c-1.72 1.77-1.7 4.64.1 6.4L12 20l6.5-5.57c1.8-1.76 1.82-4.63.1-6.4-1.7-1.79-4.74-1.43-6.5.61z"
  }"/></svg>`;
}

/* ===== Init ===== */
function initApp() {
  hentSpil();

  // Søgning
  $("#soeg").addEventListener("input", (e) => {
    state.query = e.target.value.trim().toLowerCase();
    anvendFiltre();
  });

  // Lokation
  $("#lokation").addEventListener("change", (e) => {
    state.location = e.target.value;
    anvendFiltre();
  });

  // Filtre dialog
  $("#filter-knap").addEventListener("click", () =>
    $("#filter-boks").showModal()
  );
  $("#luk-boks").addEventListener("click", () => $("#filter-boks").close());
  $("#filter-mindstrating").addEventListener("input", (e) => {
    $("#rating-ud").textContent = Number(e.target.value).toFixed(1);
  });
  $("#anvend-filtre").addEventListener("click", () => {
    state.genre = $("#filter-genre").value;
    state.language = $("#filter-sprog").value;
    state.minPlayers = $("#filter-mindstspillere").value;
    state.minRating = Number($("#filter-mindstrating").value);
    anvendFiltre();
  });
  $("#nulstil-filtre").addEventListener("click", () => {
    $("#filter-formular").reset();
    $("#rating-ud").textContent = "0.0";
    state.genre = state.language = state.minPlayers = "";
    state.minRating = 0;
    anvendFiltre();
  });

  // Game dialog close
  $("#luk-spil-boks").addEventListener("click", () => $("#spil-boks").close());
}

/* ===== Data ===== */
async function hentSpil() {
  try {
    const res = await fetch(
      "https://raw.githubusercontent.com/cederdorff/race/refs/heads/master/data/games.json"
    );
    allGames = await res.json();

    udfyldFilterValg(allGames);
    visSpil(allGames);
  } catch (err) {
    console.error("Kunne ikke hente data:", err);
    $(
      "#spil-liste"
    ).innerHTML = `<p class="ingen-resultater">Kunne ikke hente data.</p>`;
  }
}

function udfyldFilterValg(games) {
  const unik = (a) =>
    [...new Set(a.filter(Boolean))].sort((x, y) => x.localeCompare(y, "da"));
  const genrer = unik(games.map((g) => g.genre));
  const sprog = unik(games.map((g) => g.language));

  const genreSel = $("#filter-genre");
  const sprogSel = $("#filter-sprog");
  genrer.forEach((g) =>
    genreSel.insertAdjacentHTML("beforeend", `<option>${g}</option>`)
  );
  sprog.forEach((l) =>
    sprogSel.insertAdjacentHTML("beforeend", `<option>${l}</option>`)
  );
}

/* ===== Render ===== */
function visSpil(games) {
  const liste = $("#spil-liste");
  liste.innerHTML = "";

  if (!games.length) {
    liste.innerHTML = `<p class="ingen-resultater">Ingen spil matchede dine filtre 😢</p>`;
    return;
  }

  for (const game of games) {
    const flag = langFlag(game.language);
    const rating = Number(game.rating ?? 0);

    const html = `
      <article class="kort" tabindex="0" aria-label="${game.title}">
        <img class="miniature" src="${game.image}" alt="${game.title}">
        <div class="oplysninger">
          <h3 class="titel">${game.title}</h3>
          <p class="genre">${game.genre || ""}</p>
          <div class="stjerner">${stjerneIkoner(rating)}</div>
          <div class="fakta">
            <span class="faktum">${personIkon()} ${game.players?.min ?? "?"}-${
      game.players?.max ?? "?"
    }</span>
            <span class="faktum">${urIkon()} ${game.playtime ?? "?"} min</span>
            ${
              flag
                ? `<span class="flag" title="${game.language}">${flag}</span>`
                : ""
            }
          </div>
        </div>
        <button class="favorit" aria-label="Favorit (visuelt)">
          ${hjerteIkon(false)}
        </button>
      </article>
    `;
    liste.insertAdjacentHTML("beforeend", html);

    const kort = liste.lastElementChild;

    // Åbn detaljer
    kort.addEventListener("click", (e) => {
      if (e.target.closest(".favorit")) return; // klik på hjerte skal ikke åbne dialog
      visSpilBoks(game);
    });
    kort.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        visSpilBoks(game);
      }
    });

    // Ren visuel favorit-toggle (ingen storage)
    const favKnap = kort.querySelector(".favorit");
    favKnap.addEventListener("click", (e) => {
      e.stopPropagation();
      favKnap.classList.toggle("aktiv");
      const aktiv = favKnap.classList.contains("aktiv");
      favKnap.innerHTML = hjerteIkon(aktiv);
    });
  }
}

/* ===== Filter logic ===== */
function anvendFiltre() {
  const q = state.query;

  const filtreret = allGames.filter((game) => {
    if (q && !game.title?.toLowerCase().includes(q)) return false;

    if (state.genre && game.genre !== state.genre) return false;
    if (state.language && game.language !== state.language) return false;

    if (state.minPlayers) {
      const need = Number(state.minPlayers);
      const maxP = game.players?.max ?? 0;
      if (maxP < need) return false;
    }

    const rating = Number(game.rating ?? 0);
    if (rating < state.minRating) return false;

    if (state.location) {
      // bruger shelf fra data som "lokation"
      const shelf = (game.shelf || "").toString();
      if (!shelf.toLowerCase().includes(state.location.toLowerCase()))
        return false;
    }

    return true;
  });

  visSpil(filtreret);
}

/* ===== Dialog ===== */
function visSpilBoks(game) {
  const dialog = $("#spil-boks");
  const indhold = $("#boks-indhold");

  indhold.innerHTML = `
    <img src="${game.image}" alt="${game.title}">
    <div class="boks-detaljer">
      <h2>${game.title}</h2>
      <p><strong>Genre:</strong> ${game.genre || "Ukendt"}</p>
      <p><strong>Antal spillere:</strong> ${game.players?.min ?? "?"}-${
    game.players?.max ?? "?"
  }</p>
      <p><strong>Varighed:</strong> ${game.playtime || "?"} min</p>
      <p><strong>Sprog:</strong> ${game.language || "Ukendt"} ${langFlag(
    game.language
  )}</p>
      <p><strong>Rating:</strong> ${Number(game.rating ?? 0).toFixed(1)}/5</p>
      <p><strong>Hyldeplacering:</strong> ${game.shelf || "Ikke angivet"}</p>
      <p>${game.description || "Ingen beskrivelse tilgængelig."}</p>
      ${
        game.rules
          ? `<div><h3>📘 Spilleregler</h3><p>${game.rules}</p></div>`
          : ""
      }
    </div>
  `;
  dialog.showModal();
}

/* ===== Start ===== */
(function init() {
  initApp();
})();
