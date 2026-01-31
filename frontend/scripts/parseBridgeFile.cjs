/**
 * Parse the Nepal Bridge File and create comprehensive mapping
 * This creates a lookup table: "English Municipality" -> "Nepali Municipality, Nepali District"
 */

const fs = require('fs');
const path = require('path');

const bridgeFilePath = path.join(__dirname, '../../nepal_complete_bridge.txt');
const outputPath = path.join(__dirname, '../src/data/municipalityMapping.json');

function parseBridgeFile() {
  const content = fs.readFileSync(bridgeFilePath, 'utf8');
  const lines = content.split('\n');

  const mapping = {
    // Municipality English Name -> { nepali: "नेपाली नाम", district: "जिल्ला", districtEn: "District" }
    municipalities: {},
    districts: {},
    provinces: {}
  };

  let currentDistrictEn = null;
  let currentDistrictNp = null;
  let currentProvinceEn = null;
  let currentProvinceNp = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Parse province
    if (line.startsWith('PROVINCE:')) {
      const parts = line.replace('PROVINCE:', '').trim().split('/');
      if (parts.length === 2) {
        currentProvinceEn = parts[0].trim();
        currentProvinceNp = parts[1].trim();
        mapping.provinces[currentProvinceEn] = currentProvinceNp;
      }
    }

    // Parse district
    if (line.match(/^DISTRICT \d+:/)) {
      const parts = line.replace(/^DISTRICT \d+:/, '').trim().split('/');
      if (parts.length === 2) {
        currentDistrictEn = parts[0].trim();
        currentDistrictNp = parts[1].trim();
        mapping.districts[currentDistrictEn] = currentDistrictNp;
      }
    }

    // Parse municipality (starts with number)
    if (line.match(/^\d+\./)) {
      // Extract English name (remove number, type in parentheses)
      const englishMatch = line.match(/^\d+\.\s+(.+?)\s+\(/);
      if (englishMatch && currentDistrictEn && currentDistrictNp) {
        const englishName = englishMatch[1].trim();
        
        // Next line should be Nepali name
        const nextLine = lines[i + 1]?.trim();
        if (nextLine && !nextLine.startsWith('ID:') && !nextLine.startsWith('===')) {
          const nepaliName = nextLine.trim();
          
          // Create the composite key that matches our statistics format
          const compositeKey = `${nepaliName}, ${currentDistrictNp}`;
          
          mapping.municipalities[englishName] = {
            nepali: nepaliName,
            district: currentDistrictNp,
            districtEn: currentDistrictEn,
            province: currentProvinceNp,
            provinceEn: currentProvinceEn,
            compositeKey: compositeKey
          };
        }
      }
    }
  }

  return mapping;
}

// Generate the mapping
console.log('Parsing Nepal bridge file...');
const mapping = parseBridgeFile();

console.log('\n📊 Mapping Statistics:');
console.log(`  Provinces: ${Object.keys(mapping.provinces).length}`);
console.log(`  Districts: ${Object.keys(mapping.districts).length}`);
console.log(`  Municipalities: ${Object.keys(mapping.municipalities).length}`);

// Save to JSON
fs.writeFileSync(outputPath, JSON.stringify(mapping, null, 2), 'utf8');
console.log(`\n✅ Mapping saved to: ${outputPath}`);

// Show samples
console.log('\n📝 Sample Mappings:');
const munSamples = Object.entries(mapping.municipalities).slice(0, 3);
munSamples.forEach(([en, data]) => {
  console.log(`  "${en}" → "${data.compositeKey}"`);
});
