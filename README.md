# spilcafen

## Ændringer

- Dialogen der viser spil-detaljer er gjort mindre og mere mobilvenlig. Dette opnåedes ved at justere `index.html` id'er så de matcher `app.js` og ved at opdatere `style.css` (`#spil-boks` / `#boks-indhold`) for at:
  - Sætte en lavere max-width (fx 640px) så dialogen ikke fylder hele skærmen på desktop.
  - Gøre backdrop lidt mindre dominerende og reducere skyggen.
  - Give dialogen `max-height: 90vh` og `overflow: auto` så indholdet ruller på små skærme.
  - Tilpasse grid og font-størrelser for smalle skærme (mobil).

Disse ændringer gør popup'en mindre "in your face" og bedre egnet til mobilvisning.
