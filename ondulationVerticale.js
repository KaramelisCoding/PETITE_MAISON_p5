// ONDULATION VERTICALE (portage Processing -> p5.js)
// À partir d'une image source N&B avec transparence,
// crée une image ondulée verticalement en fonction du temps.

class OndulationVerticale {
  constructor(source, L, fr, A, col) {
    // source: p5.Image
    this.source = source;
    this.L = L;     // longueur d'onde (px)
    this.fr = fr;   // fréquence (cycles/seconde)
    this.A  = A;    // amplitude (px)
    this.col = col; // p5.Color (nouvelle couleur des points)

    this.w = this.source.width;
    this.h = this.source.height;

    // Image destination avec canal alpha
    this.destination = createImage(this.w, this.h);

    // Pré-calcul de phase selon x
    this.phaseEnSx = new Float32Array(this.w);
    for (let sx = 0; sx < this.w; sx++) {
      this.phaseEnSx[sx] = TWO_PI * sx / this.L;
    }

    // Charger les pixels de la source une fois
    this.source.loadPixels();
  }

  display(t) {
    // t en secondes
    const w = this.w, h = this.h;
    const sp = this.source.pixels; // RGBA interleavé
    this.destination.loadPixels();
    const dp = this.destination.pixels;

    const phaseEnT = TWO_PI * this.fr * t;

    // Couleur finale (C) en RGBA
    const rC = red(this.col);
    const gC = green(this.col);
    const bC = blue(this.col);
    const aC = alpha(this.col);

    // Balayage destination (x, y)
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const sx = x;
        const offset = this.A * Math.sin(this.phaseEnSx[sx] + phaseEnT);
        const sy = Math.round(y - offset);

        const didx = 4 * (x + y * w);

        if (sy >= 0 && sy < h) {
          const sidx = 4 * (sx + sy * w);
          const aSrc = sp[sidx + 3]; // alpha source

          if (aSrc > 0) {
            dp[didx + 0] = rC;
            dp[didx + 1] = gC;
            dp[didx + 2] = bC;
            dp[didx + 3] = aC; // plein alpha (ou garde aC si tu préfères)
          } else {
            // transparent
            dp[didx + 0] = 0;
            dp[didx + 1] = 0;
            dp[didx + 2] = 0;
            dp[didx + 3] = 0;
          }
        } else {
          // en dehors : transparent
          dp[didx + 0] = 0;
          dp[didx + 1] = 0;
          dp[didx + 2] = 0;
          dp[didx + 3] = 0;
        }
      }
    }

    this.destination.updatePixels();
    return this.destination;
  }
}
