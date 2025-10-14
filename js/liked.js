"use strict";

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

function stjerneIkoner(r = 0) {
  const full = Math.floor(r);
  const half = r - full >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  const stjerne = `<svg class="stjerne" viewBox="0 0 24 24" aria-hidden="true"><path fill="#F5C451" d="M12 17.3l6.18 3.7-1.64-7.03L21 9.24l-7.19-.61L12 2 10.19 8.63 3 9.24l4.46 4.73L5.82 21z"/></svg>`;
  const halv = `<svg class="stjerne" viewBox="0 0 24 24"><defs><linearGradient id="g"><stop offset="50%" /><stop offset="50%" stop-color="#ddd"/></linearGradient></defs><path fill="url(#g)" d="M12 17.3l6.18 3.7-1.64-7.03L21 9.24l-7.19-.61L12 2 10.19 8.63 3 9.24l4.46 4.73L5.82 21z"/></svg>`;
  const tom = `<svg class="stjerne" viewBox="0 0 24 24"><path fill="#ddd" d="M12 17.3l6.18 3.7-1.64-7.03L21 9.24l-7.19-.61L12 2 10.19 8.63 3 9.24l4.46 4.73L5.82 21z"/></svg>`;
  return (
    stjerne.repeat(full) +
    halv.repeat(half) +
    tom.repeat(empty) +
    `<small>${r.toFixed(1)}/5</small>`
  );
}

function hjerteIkon(aktiv) {
  return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${
    aktiv
      ? "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5A4.5 4.5 0 0 1 6.5 4 5.4 5.4 0 0 1 12 6a5.4 5.4 0 0 1 5.5-2 4.5 4.5 0 0 1 4.5 4.5c0 3.78-3.4 6.86-8.55 11.54z"
      : "M12.1 8.64 12 8.77l-.1-.13C10.14 6.6 7.1 6.24 5.4 8.03c-1.72 1.77-1.7 4.64.1 6.4L12 20l6.5-5.57c1.8-1.76 1.82-4.63.1-6.4-1.7-1.79-4.74-1.43-6.5.61z"
  }"
  /></svg>`;
}

async function hentOgVisLiked() {
  try {
    const res = await fetch(
      "https://raw.githubusercontent.com/cederdorff/race/refs/heads/master/data/games.json"
    );
    const all = await res.json();

    // Vælg de første 4 spil som liked (kan ændres senere)
    const liked = Array.isArray(all) ? all.slice(0, 4) : [];
    visSpil(liked);
  } catch (err) {
    console.error("Kunne ikke hente data:", err);
    $(
      "#spil-liste"
    ).innerHTML = `<p class="ingen-resultater">Kunne ikke hente spil.</p>`;
  }
}

function visSpil(games) {
  const liste = $("#spil-liste");
  liste.innerHTML = "";
  if (!games.length) {
    liste.innerHTML = `<p class="ingen-resultater">Ingen favoritter.</p>`;
    return;
  }

  for (const game of games) {
    const rating = Number(game.rating ?? 0);
    const img =
      game.image ||
      `https://picsum.photos/seed/${encodeURIComponent(game.title)}/640/360`;
    const html = `
      <article class="kort" tabindex="0" aria-label="${game.title}">
        <img class="miniature" src="${img}" alt="${game.title}">
        <div class="oplysninger">
          <h3 class="titel">${game.title}</h3>
          <p class="genre">${game.genre || ""}</p>
          <div class="stjerner">${stjerneIkoner(rating)}</div>
          <div class="fakta">
            <span class="faktum">${game.players?.min ?? "?"}-${
      game.players?.max ?? "?"
    }</span>
            <span class="faktum">${game.playtime ?? "?"} min</span>
          </div>
        </div>
        <button class="favorit" aria-label="Favorit (visuelt)">${hjerteIkon(
          false
        )}</button>
      </article>
    `;
    liste.insertAdjacentHTML("beforeend", html);

    const kort = liste.lastElementChild;
    const fav = kort.querySelector(".favorit");

    // Åbn detaljer
    kort.addEventListener("click", (e) => {
      if (e.target.closest(".favorit")) return;
      visSpilBoks(game);
    });
    kort.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        visSpilBoks(game);
      }
    });

    // Favorit toggle (kun visuelt)
    fav.addEventListener("click", (e) => {
      e.stopPropagation();
      fav.classList.toggle("aktiv");
      const aktiv = fav.classList.contains("aktiv");
      fav.innerHTML = hjerteIkon(aktiv);
    });
  }
}

function visSpilBoks(game) {
  const dialog = $("#spil-boks");
  const indhold = $("#boks-indhold");
  indhold.innerHTML = `
    <img src="${game.image || ""}" alt="${game.title}">
    <div class="boks-detaljer">
      <h2>${game.title}</h2>
      <p><strong>Genre:</strong> ${game.genre || "Ukendt"}</p>
      <p><strong>Antal spillere:</strong> ${game.players?.min ?? "?"}-${
    game.players?.max ?? "?"
  }</p>
      <p><strong>Varighed:</strong> ${game.playtime ?? "?"} min</p>
      <p><strong>Sprog:</strong> ${game.language || "Ukendt"}</p>
      <p><strong>Rating:</strong> ${Number(game.rating ?? 0).toFixed(1)}/5</p>
      <p>${game.description || "Ingen beskrivelse tilgængelig."}</p>
    </div>
  `;
  dialog.showModal();
}

window.addEventListener("load", () => {
  hentOgVisLiked();

  // Luk-knap
  $("#luk-spil-boks").addEventListener("click", () => $("#spil-boks").close());

  // Simpelt søg
  $("#soeg").addEventListener("input", (e) => {
    const q = e.target.value.trim().toLowerCase();
    $$("#spil-liste .kort").forEach((k) => {
      const t = k.querySelector(".titel").textContent.toLowerCase();
      k.style.display = t.includes(q) ? "" : "none";
    });
  });
});
