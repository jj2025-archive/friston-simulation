# Friston-like Simulator — Hierarchical Bayesian Signal Simulation

<p align="center">
  <img src="assets/demo.gif" alt="Friston-like simulator demo" width="720"/>
</p>

A compact, interactive browser simulation of hierarchical Bayesian (predictive coding) dynamics inspired by Karl Friston's predictive processing ideas. It visualizes how top‑down priors and bottom‑up sensory errors interact across a 5‑level hierarchy (from cellular through cognitive) and lets you tune the relative influence of "mind" (priors) and "body" (sensory noise) in real time.

Exported from CodePen by Josiah Rhys Jacobson (with AI assistance).

Key ideas:
- Top-down signals = priors (expectations) that modulate lower levels.
- Bottom-up signals = sensory errors that update beliefs upward.
- The UI visualizes belief bars at each level and flashing arrows for information flow.

Features
- Real-time interactive simulation rendered to an HTML5 canvas.
- Three sliders to control model behavior: mind dominance (prior bias), body dominance (noise), and update speed (learning rate).
- Visual indicators for top‑down and bottom‑up propagations and simple "glitch" effects when simulated stress thresholds are exceeded.
- Single-file client implementation (index.html + script.js + style.css) — easy to fork and modify.

Quick demo (local)
1. Clone the repository:
   git clone https://github.com/jj2025-archive/friston-simulation.git
2. Serve the files (recommended — some browsers restrict canvas/script behavior on file://):
   - Python 3:
     python -m http.server 8000
     then open http://localhost:8000
   - Or use a static server:
     npx serve .
   - Or open index.html directly in a modern browser (Chrome/Edge/Firefox).

How to use the UI
- MIND DOMINANCE (priorBias slider): 0 = priors highly attend/amplify bottom‑up errors; 1 = priors strongly suppress bottom‑up signals. (Label in code: `priorBias`)
- BODY DOMINANCE (noiseLevel slider): Controls sensory noise injected at the lowest (cellular) level. (Label in code: `noiseLevel`)
- UPDATE SPEED (learningRate slider): How quickly beliefs update in response to prediction errors and priors. (Label in code: `learningRate`)
- Run Simulation / Reset: `Run Simulation` starts/updates the simulation using current slider values. `Reset` restores defaults and clears accumulated stress.

What you'll see in the canvas
- Five horizontal "belief" bars representing:
  1. Existential/Cognitive
  2. Behavioral/Restorative
  3. Sensorimotor/Physiological
  4. Effector/Muscular
  5. Cellular/Subcellular
- Downward teal arrows = top‑down priors influencing lower levels.
- Upward pink arrows = bottom‑up prediction errors.
- If accumulated "bodyStress" or "mindStress" exceed the threshold, the canvas performs a glitch effect and an alert is shown:
  - "Body Crash: Overwhelming somatic errors!"
  - "Mind Overload: Excessive cognitive suppression!"

How it works (implementation notes)
- Main loop: `simulateStep()` in `script.js` runs roughly at `FPS = 45`, injecting bottom‑up noise at the base level and propagating errors upward, then applying priors downward.
- Data model: `levels` array (5 objects with `name`, `y`, `belief`, `prior`).
- Bottom‑up update: error = child.belief − parent.prior; update scaled by `learningRate * precision` where `precision` = 1 − priorBias.
- Top‑down update: each level’s `prior` is computed from the level above and mixed into its `belief` using `priorBias` and `learningRate`.
- Stress accumulators (`bodyStress`, `mindStress`) are increased each frame based on noise, prior bias and update magnitudes, and compared to `STRESS_THRESHOLD` to trigger failure visuals.

Repository layout
```
index.html         — Minimal HTML UI and canvas hook-ups
script.js          — Simulation logic, drawing, controls, main loop
style.css          — Styling, layout, and visual glitch effects
README.md          — (this file) usage, explanation, and development notes
assets/            — place demo.gif here (create this directory if necessary)
LICENSE            — MIT license (added)
```

How to add the demo GIF
1. Create an assets directory at the repository root if it doesn't exist:
   mkdir -p assets
2. Name the GIF `demo.gif` and place it at `assets/demo.gif`.
3. Commit and push:
   git add assets/demo.gif README.md
   git commit -m "Add demo GIF and README update"
   git push

Recommended GIF creation (keeping file size reasonable)
- Keep width ≈ 640–800px and fps ≈ 12–20 to balance clarity and size.
- Example workflow (record a short MP4 then convert to GIF with ffmpeg):
  - Record (use your preferred screen recorder) or export a short MP4 of the canvas.
  - Convert to GIF and optimize:
    ffmpeg -i demo.mp4 -vf "fps=15,scale=720:-1:flags=lanczos" -loop 0 demo.gif
  - Optionally optimize with gifsicle:
    gifsicle -O3 demo.gif -o demo_opt.gif
- Aim for under ~2–3 MB for fast loading on GitHub.

Development tips and customization ideas
- Replace the random noise generator with structured inputs (time series) to simulate specific stimuli.
- Add persistence or logging to capture trajectories for analysis.
- Turn the visual elements into D3 charts or export data as CSV for offline plotting.
- Expose more model parameters (e.g., per-level learning rates or precision) in the UI for finer control.

Attribution, license, and contributions
- Author: Josiah Rhys Jacobson (exported from CodePen).
- License: MIT (LICENSE file added).
- Contributions: open an issue or PR with suggested improvements or fixes.

If you'd like, I can:
- Commit the updated README.md and upload a provided demo GIF into `assets/demo.gif` (tell me to proceed and attach the GIF or a link),
- Or I can create a short demo GIF for you if you want — tell me which screen size and a short script of the actions to record (e.g., move the sliders, run until a crash).
