// * VARIATION SUR UNE IMAGE EN NOIR ET BLANC — p5.js

let imgPetiteMaison;
let petiteMaison;
let creme, rougeChaud, turquoise;

// TEMPS
const FPS = 30;        // images par seconde
const Periode = 5.0;   // secondes
const N = Math.round(Periode * FPS); // nb d'images sur une période

// État Marche / Arrêt
let enMarche = true;
let verrou = false; // false ⇒ pas de verrou

function preload() {
  imgPetiteMaison = loadImage(
    'assets/maison.png',
    () => console.log('Image chargée OK:', imgPetiteMaison.width, 'x', imgPetiteMaison.height),
    (err) => console.error('ÉCHEC loadImage', err)
  );
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  noSmooth();
  frameRate(FPS);

  colorMode(HSB, 360, 100, 100, 255);
  creme      = color(39, 50, 96);  // #f5ca7a
  rougeChaud = color(2, 52, 73);   // #b95b58
  turquoise  = color(182, 53, 74); // #58b9bc

  imageMode(CENTER);

  // NB: fr = 1/Periode doit être en float (en JS c'est déjà le cas)
  petiteMaison = new OndulationVerticale(imgPetiteMaison, 800, 1/Periode, 8, rougeChaud);
}

function draw() {
  marcheArret();

  if (enMarche) {
    const k = frameCount - 1; // compteur à partir de 0
    const t = k * (Periode / N);

    background(creme);
    const frameImg = petiteMaison.display(t);
    image(frameImg, width / 2, height / 2);

    // HUD / export si tu veux :
    // saveFrame équivalent = saveCanvas, mais évitons pour le live.
  }
}

function keyPressed() {
  // Espace : toggle marche/arrêt avec "verrou"
  if (key === ' ') {
    if (!verrou) {
      enMarche = !enMarche;
      verrou = true;
    }
  }
}

function keyReleased() {
  if (key === ' ') {
    verrou = false;
  }
}

// État Marche / Arrêt (version p5)
function marcheArret() {
  // déjà géré par keyPressed / keyReleased ci-dessus
}


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}