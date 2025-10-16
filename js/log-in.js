// --- Simpel funktionalitet på dansk ---
const kortLogind = document.getElementById("kort-logind");
const kortOpret = document.getElementById("kort-opret");
const formLogind = document.getElementById("form-logind");
const formOpret = document.getElementById("form-opret");
const linkOpret = document.getElementById("link-opret");
const lukLogin = document.getElementById("luk-login");
const lukOpret = document.getElementById("luk-opret");
const forside = document.getElementById("forside");
const tilbageKnap = document.getElementById("tilbage");

// Skjul opret-kort i starten
kortOpret.style.display = "none";

// Når man klikker "Opret konto"
linkOpret.addEventListener("click", () => {
  kortLogind.style.display = "none";
  kortOpret.style.display = "block";
});

// Klik på kryds → til forsiden
lukOpret.addEventListener("click", () => {
  document.querySelector("main").style.display = "none";
  forside.style.display = "block";
});

lukLogin.addEventListener("click", () => {
  document.querySelector("main").style.display = "none";
  forside.style.display = "block";
});

// Når man trykker Log ind
formLogind.addEventListener("submit", (e) => {
  e.preventDefault();
  const brugernavn = document.getElementById("brugernavn").value.trim();
  const kodeord = document.getElementById("kodeord").value.trim();

  if (!brugernavn) {
    alert("Skriv dit brugernavn.");
    return;
  }
  if (!kodeord) {
    alert("Skriv dit password.");
    return;
  }

  // Simuler login → forside
  document.querySelector("main").style.display = "none";
  forside.style.display = "block";
});

// Når man trykker Opret
formOpret.addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = new FormData(formOpret);
  const email = formData.get("email")?.trim();
  const kode1 = formData.get("nyt-kodeord")?.trim();
  const kode2 = formData.get("gentag-kodeord")?.trim();

  if (!email || !kode1 || !kode2) {
    alert("Udfyld de krævede felter.");
    return;
  }
  if (kode1 !== kode2) {
    alert("Kodeordene matcher ikke.");
    return;
  }

  alert("Bruger oprettet (simuleret). Du sendes til forsiden.");
  document.querySelector("main").style.display = "none";
  forside.style.display = "block";
});

// Tilbage fra forside til login
tilbageKnap.addEventListener("click", () => {
  forside.style.display = "none";
  document.querySelector("main").style.display = "flex";
  kortLogind.style.display = "block";
  kortOpret.style.display = "none";
});
