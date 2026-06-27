const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const levels = [
    { name: 'Existential/Cognitive', y: 50, belief: 0.5, prior: 0.5 },
    { name: 'Behavioral/Restorative', y: 120, belief: 0.5, prior: 0.5 },
    { name: 'Sensorimotor/Physiological', y: 190, belief: 0.5, prior: 0.5 },
    { name: 'Effector/Muscular', y: 260, belief: 0.5, prior: 0.5 },
    { name: 'Cellular/Subcellular', y: 330, belief: 0.5, prior: 0.5 }
];
let priorBias = 0.5; // 0: attend (amplify), 1: ignore (suppress)
let noiseLevel = 0.5;
let learningRate = 0.5;
let animationId;
let bottomUpFlash = new Array(4).fill(0);
let topDownFlash = new Array(4).fill(0);
let lastUpdate = 0;
const FPS = 45; // Tweak this variable to change the target frames per second
let bodyStress = 0; // Accumulator for body crash
let mindStress = 0; // Accumulator for mind overload
const STRESS_THRESHOLD = 75; // Tweakable threshold for crash/overload

function drawLevels() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = '14px Inter'; // Font size controlled here (increased to 16px for bigger text)
    ctx.fillStyle = '#ccd6f6'; // Text color
    ctx.strokeStyle = '#64ffda'; // Default borders
    levels.forEach(level => {
        ctx.fillText(level.name, 20, level.y);
        ctx.fillStyle = '#52d1b8'; // Cool belief bar color
        ctx.fillRect(300, level.y - 10, 200 * level.belief, 20); // Belief bar (0-1)
        ctx.fillStyle = '#ccd6f6'; // Reset for text
        ctx.strokeRect(300, level.y - 10, 200, 20);
        ctx.fillText(`Belief: ${level.belief.toFixed(2)}`, 510, level.y);
    });
    // Draw arrows with flash-based opacity
    for (let i = 0; i < levels.length - 1; i++) {
        // Top-down arrows (downward, teal)
        ctx.strokeStyle = '#64ffda';
        ctx.globalAlpha = 0.2 + 0.8 * topDownFlash[i];
        ctx.beginPath();
        ctx.moveTo(250, levels[i].y + 10);
        ctx.lineTo(250, levels[i+1].y - 10);
        ctx.lineTo(245, levels[i+1].y - 15);
        ctx.moveTo(250, levels[i+1].y - 10);
        ctx.lineTo(255, levels[i+1].y - 15);
        ctx.stroke();

        // Bottom-up arrows (upward, pinkish)
        ctx.strokeStyle = '#ff6584';
        ctx.globalAlpha = 0.2 + 0.8 * bottomUpFlash[i];
        ctx.beginPath();
        ctx.moveTo(280, levels[i+1].y - 10);
        ctx.lineTo(280, levels[i].y + 10);
        ctx.lineTo(275, levels[i].y + 15);
        ctx.moveTo(280, levels[i].y + 10);
        ctx.lineTo(285, levels[i].y + 15);
        ctx.stroke();
    }
    ctx.globalAlpha = 1; // Reset
}

function glitchCanvas() {
    // Draw random glitch lines
    for (let i = 0; i < 50; i++) {
        ctx.strokeStyle = `rgba(255, 0, 0, ${Math.random() * 0.5 + 0.5})`;
        ctx.beginPath();
        ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
        ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
        ctx.stroke();
    }
    // Invert colors briefly (simple filter simulation)
    ctx.globalCompositeOperation = 'difference';
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = 'source-over';
}

function simulateStep() {
    if (performance.now() - lastUpdate < 1000 / FPS) { animationId = requestAnimationFrame(simulateStep); return; } lastUpdate = performance.now();
    // Bottom-up: Inject sensory error at bottom with noise
    const bottomError = Math.random() * noiseLevel - noiseLevel / 2; // Simulated likelihood (sensory input)
    levels[4].belief = clamp(levels[4].belief + bottomError, 0, 1); // Raw update at base

    // Accumulate body stress based on noise and update
//Hack increase body stress
    bodyStress += 3.5 * noiseLevel * learningRate * Math.abs(bottomError);

    let totalError = 0;
    // Bottom-up propagation: Errors ascend, updating beliefs Bayesian-style
    for (let i = levels.length - 2; i >= 0; i--) {
        const error = levels[i+1].belief - levels[i].prior; // Prediction error
        totalError += Math.abs(error);
        const precision = 1 - priorBias; // Higher bias -> lower precision on errors
        const updateAmount = learningRate * precision * error;
        levels[i].belief += updateAmount;
        levels[i].belief = clamp(levels[i].belief, 0, 1);
        bottomUpFlash[i] = Math.min(1, Math.abs(updateAmount) * 10); // Scale for visibility
    }

    // Accumulate mind stress based on prior bias and low error (suppression overload)
  // Hack: reduce mindstress
    mindStress += 0.75 * priorBias * learningRate * (1 - totalError / levels.length);

    // Check for crashes
    if (bodyStress > STRESS_THRESHOLD) {
        glitchCanvas();
        cancelAnimationFrame(animationId);
        alert("Body Crash: Overwhelming somatic errors!");
        return;
    }
    if (mindStress > STRESS_THRESHOLD) {
        glitchCanvas();
        cancelAnimationFrame(animationId);
        alert("Mind Overload: Excessive cognitive suppression!");
        return;
    }

    // Top-down propagation: Priors descend, modulating lower beliefs
    for (let i = 1; i < levels.length; i++) {
        levels[i].prior = levels[i-1].belief * (1 - priorBias) + priorBias * 0.5; // Bias towards suppression
        const priorInfluence = learningRate * priorBias;
        const oldBelief = levels[i].belief;
        levels[i].belief = (1 - priorInfluence) * levels[i].belief + priorInfluence * levels[i].prior;
        levels[i].belief = clamp(levels[i].belief, 0, 1);
        const change = Math.abs(levels[i].belief - oldBelief);
        topDownFlash[i-1] = Math.min(1, change * 10); // Scale for visibility
    }

    drawLevels();

    // Decay flashes for "flash" effect
    bottomUpFlash = bottomUpFlash.map(f => f * 0.9);
    topDownFlash = topDownFlash.map(f => f * 0.9);

    animationId = requestAnimationFrame(simulateStep); // Run infinitely
}

function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
}

function restartSim() {
    priorBias = parseFloat(document.getElementById('priorBias').value);
    noiseLevel = parseFloat(document.getElementById('noiseLevel').value);
    learningRate = parseFloat(document.getElementById('learningRate').value);
    bodyStress = 0; // Reset stress on restart
    mindStress = 0;
    cancelAnimationFrame(animationId);
    simulateStep();
}

document.getElementById('priorBias').addEventListener('change', restartSim);
document.getElementById('noiseLevel').addEventListener('change', restartSim);
document.getElementById('learningRate').addEventListener('change', restartSim);

document.getElementById('runBtn').addEventListener('click', restartSim);

document.getElementById('resetBtn').addEventListener('click', () => {
   // Reset sliders to their default values
    document.getElementById('priorBias').value = 0.5;
    document.getElementById('noiseLevel').value = 0.5;
    document.getElementById('learningRate').value = 0.5; cancelAnimationFrame(animationId);
    levels.forEach(level => { level.belief = 0.5; level.prior = 0.5; });
    bottomUpFlash.fill(0);
    topDownFlash.fill(0);
    bodyStress = 0;
    mindStress = 0;
    drawLevels();
});

drawLevels(); // Initial draw