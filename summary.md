Friston-like Simulator — Non-Technical Summary

This small web app is an interactive illustration of how a hierarchical system (like a brain and body) balances expectations and sensory input.

What it models
- The system has five layers (from tiny cellular processes up to high-level cognition).
- Each layer holds a current "belief" about some internal signal (e.g., fatigue).
- Two forces shape beliefs:
  - Top‑down expectations (priors) — what higher layers expect lower layers to be like.
  - Bottom‑up sensory evidence — the data coming from the body or environment.

What you can do
- Use the "Mind Dominance" slider to make expectations stronger or weaker.
- Use the "Body Dominance" slider to increase or decrease sensory noise.
- Use "Update Speed" to make the system adapt more or less quickly.
- Run the simulation and watch how beliefs and the flow of information change in real time.

Why it’s useful
- It visualizes an abstract concept from cognitive neuroscience (predictive processing) in a compact, interactive form.
- Good for teaching, demos, or exploring how different balances of expectation vs. sensation change system behavior.
- Helps build intuition about how too much suppression (very strong priors) or too much noise (very strong sensations) can destabilize a system.

Who should try it
- Students and instructors in cognitive science, neuroscience, or psychology.
- Developers and researchers curious about predictive-processing concepts.
- Anyone who enjoys interactive, visual simulations of dynamic systems.

How to try it
- Open index.html in a browser or serve the folder with `python -m http.server` and visit the page.
- Tweak sliders and observe how the colored bars and arrows change — small changes can lead to very different outcomes.

Limitations
- This is a demo, not a scientifically validated model — it’s meant to illustrate principles rather than serve as a research tool.
- Results are stochastic (randomized noise), so runs will differ each time.

If you'd like a version aimed at classroom handouts or explanatory slides, I can produce one that includes step‑by‑step screenshots and suggested classroom exercises.
