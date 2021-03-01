let video;
let poseNet;
let poses = [];

const vW = 640;
const vH = 480;

let waveToggle;

let sensitivity;
let sensitivityVal = 40;
let sensitivityValText;

let waveTimer;
let waveTimerVal = 1500;
let waveTimerValText;

function setup() {
  document.getElementById("status").style.display = "none";
  waveToggle = document.getElementById("wave-toggle");

  sensitivity = document.getElementById("sensitivity");
  sensitivityValText = document.getElementById("sensitivity-val");
  sensitivity.addEventListener('input', updateSensitivity);
  waveTimer = document.getElementById("wave-timer");
  waveTimerValText = document.getElementById("wave-timer-val");
  waveTimer.addEventListener('input', updateWaveTimer);

  createCanvas(vW, vH);
  video = createCapture(VIDEO);
  video.size(vW, vH);

  poseNet = ml5.poseNet(video, modelReady);
  poseNet.on("pose", function (results) {
    poses = results;
  });
  video.hide();
  noStroke();
  fill(255, 0, 0);
}

function updateSensitivity(e) {
  sensitivityVal = parseInt(e.target.value);
  sensitivityValText.textContent = sensitivityVal;
}

function updateWaveTimer(e) {
  waveTimerVal = parseFloat(e.target.value);
  waveTimerValText.textContent = waveTimerVal / 1000;
}

let wavePoints = 0;
let timerRunning = false;
let timer;

async function draw() {
  background(0);
  image(video, 0, 0, vW, vH);

  if (!waveToggle.checked) return;

  for (let i = 0; i < poses.length; i++) {
    let pose = poses[i].pose;
    for (let j = 0; j < pose.keypoints.length; j++) {
      let keypoint = pose.keypoints[j];
      if (keypoint.part == "rightWrist" || keypoint.part == "leftWrist") {
        if (keypoint.score > 0.5) {
          //ellipse(keypoint.position.x, keypoint.position.y, 20, 20);
          //text(keypoint.part, keypoint.position.x, keypoint.position.y);
          //console.log(keypoint.part, " - ", keypoint.score);
          wavePoints++;
          //console.log("WP:", wavePoints, timerRunning);
          if (!timerRunning) {
            timerRunning = true;
            setTimeout(async () => {
              if (wavePoints > sensitivityVal) {
                try {
                  const response = await fetch('/goodbye');
                  const data = await response.json();
                  console.log(data);
                  alert(`Waves: ${wavePoints}`);
                } catch (error) {

                }
              }
              console.log("WP:", wavePoints);
              wavePoints = 0;
              timerRunning = false;
            }, waveTimerVal);
          }
        }
      }
      //ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
    }
  }
}

function modelReady() {
  select("#status").html("Model Loaded");
}
