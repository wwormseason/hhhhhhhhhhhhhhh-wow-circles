let pieces = 0,
  radius = 0,
  fft,
  mapMouseX,
  mapMouseY,
  toggleBtn,
  audio,
  upBtn,
  upAudio,
  upAnim;

let pal = ["#FFB997", "#F67E7D", "#843B62", "#0B032D"];

let isUploading = false;

function preload() {
  audio = loadSound("./assets/DEMO_3.mp3");
}

function upload(file) {
  isUploading = true;
  upAudio = loadSound(file.data, upAudioPlay);
}

function upAudioPlay(file) {
  isUploading = false;

  if (audio.isPlaying()) {
    audio.pause();
  }

  audio = file;
  audio.loop();
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  upAnim = select("#uploading-animation");

  toggleBtn = createButton(audio.isPlaying() ? "Pause" : "Play");

  upBtn = createFileInput(upload);

  upBtn.addClass("upload-btn");

  toggleBtn.addClass("toggle-btn");

  toggleBtn.mousePressed(toggleAudio);

  fft = new p5.FFT();

  audio.loop();
}

function draw() {
  if (isUploading) {
    upAnim.addClass("is-visible");
  } else {
    upAnim.removeClass("is-visible");
  }

  background(pal[3]);

  noFill();

  fft.analyze();

  let bass = fft.getEnergy("bass");
  let treble = fft.getEnergy("treble");
  let mid = fft.getEnergy("mid");

  let mBass = map(bass, 0, 255, -radius, radius);
  let mTreble = map(treble, 0, 255, -radius, radius);
  let mMid = map(mid, 0, 255, -radius, radius);

  let sBass = map(bass, 0, 255, 1, 1.5);
  let sTreble = map(treble, 0, 255, 1, 1.5);
  let sMid = map(mid, 0, 255, 1, 1.5);

  piece = map(mouseX, 0, width, 4, 10);
  radius = map(mouseY, 0, innerHeight, windowHeight / 6, windowHeight);

  translate(windowWidth / 2, windowHeight / 2);

  strokeWeight(2);

  for (let i = 0; i < pieces; i += 0.5) {
    rotate(TWO_PI / pieces);

    // Bass
    push();
    strokeWeight(3);
    stroke(pal[2]);
    scale(sBass);
    rotate(frameCount * 0.5);
    line(mBass, radius / 2, radius, radius);
    // arc(mBass, radius, radius / 4, radius / 4, mBass, mBass + 20);
    pop();

    // Treble
    push();
    strokeWeight(2);
    stroke(pal[1]);
    scale(sTreble);
    rotate(frameCount * 2);
    line(mTreble, radius / 5, radius / 2, radius / 2);
    line(mTreble, radius, radius * 2, radius * 2);
    pop();

    // Mid
    push();
    strokeWeight(1);
    stroke(pal[0]);
    scale(sMid);
    rotate(frameCount / 10);
    line(mMid, radius / 2, radius, radius);
    // circle(mMid, radius, radius / 3);
    pop();
  }
}

function toggleAudio() {
  if (audio.isPlaying()) {
    audio.pause();
  } else {
    audio.play();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
