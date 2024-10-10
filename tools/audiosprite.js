const audiosprite = require('audiosprite');
const path = require('path');
const fs = require('fs');

const soundDir = path.resolve(__dirname, '../assets/sound');
const soundPackName = 'soundpackresult';

const files = fs.readdirSync(soundDir)
  .filter(file => file.endsWith('.mp3'))
  .map(file => path.join(soundDir, file));

const outputDir = path.resolve(__dirname, '../assets/atlas/soundsprite');
const opts = {
  output: path.join(outputDir, soundPackName),
  format: 'mp3',
  export: 'mp3',
};

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}
files.forEach(element => {
  console.log(element);
});

audiosprite(files, opts, function(err, obj) {
  if (err) return console.error('Error creating audiosprite:', err);

  const jsonOutput = {
    spritemap: obj.spritemap,
  };

   fs.writeFileSync(path.join(outputDir, `${soundPackName}.json`), JSON.stringify(jsonOutput, null, 2));
});