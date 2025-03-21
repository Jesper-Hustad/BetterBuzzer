const fs = require("fs");
const path = require("path");

const soundsDir = path.join(__dirname, "../public/sounds");
const outputFile = path.join(soundsDir, "sounds.json");

// Ensure directory exists
if (!fs.existsSync(soundsDir)) {
  console.error("Sounds directory not found:", soundsDir);
  process.exit(1);
}

// Read .mp3 files and generate JSON
fs.readdir(soundsDir, (err, files) => {
  if (err) {
    console.error("Error reading directory:", err);
    process.exit(1);
  }

  const mp3Files = files.filter(file => file.endsWith(".mp3"));
  fs.writeFileSync(outputFile, JSON.stringify(mp3Files, null, 2));

  console.log("✅ Sounds JSON generated:", outputFile);
});
