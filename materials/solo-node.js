// Node runner: loads assets/solo-live.js exactly as the browser does and prints the canon as JSON.
// Compare with: python3 materials/solo_reference.py --json
const path = require("path");
const repo = process.argv[2] || path.join(__dirname, "..");
const api = require(path.join(path.resolve(repo), "assets/solo-live.js"));
process.stdout.write(JSON.stringify(api.canon(), null, 1));
