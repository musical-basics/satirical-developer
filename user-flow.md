# User Flow & State Machine

## 1. The Confession State (Initial Load)
* User lands on `/`. 
* Sees a massive heading: "Calculate Your Developer ROI."
* User types: "Packing my suitcase" and "15" (minutes).
* Clicks the primary button: "Calculate Automation ROI."

## 2. The Processing State (Loading)
* UI disables inputs.
* A terminal-style window appears.
* Rapidly cycles through fake logs every 800ms:
  * `> npm install @over-engineering/core`
  * `> resolving dependency conflicts...`
  * `> configuring reverse proxy for folding shirts...`
* Meanwhile, the Next.js API route hits Gemini in the background to generate the JSON payload.

## 3. The Reality Check State (Results)
* The terminal window expands into a dashboard.
* **Top Metric:** A massive red number showing "Hours Wasted."
* **Left Column:** The "Proposed Architecture" (e.g., "A microservices cluster using Redis to stream underwear state").
* **Right Column:** The AI's personalized roast. 
* **Call to Action:** A single, giant button that says: "Close Laptop and Go Do It." (Clicking this physically attempts to close the window or redirects to `about:blank`).