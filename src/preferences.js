const fs = require('fs');
const path = require('path');

const PREFS_FILE = path.join(__dirname, '../data/preferences.json');
const DATA_DIR = path.join(__dirname, '../data');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function getPreferences() {
  try {
    ensureDataDir();
    if (fs.existsSync(PREFS_FILE)) {
      const data = fs.readFileSync(PREFS_FILE, 'utf-8');
      return JSON.parse(data);
    }
    return null;
  } catch (error) {
    console.error('Error reading preferences:', error.message);
    return null;
  }
}

function savePreferences(prefs) {
  try {
    ensureDataDir();
    fs.writeFileSync(PREFS_FILE, JSON.stringify(prefs, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error saving preferences:', error.message);
  }
}

function resetPreferences() {
  try {
    if (fs.existsSync(PREFS_FILE)) {
      fs.unlinkSync(PREFS_FILE);
      console.log('Preferences reset. Run the CLI again to set new preferences.');
    } else {
      console.log('No preferences found to reset.');
    }
  } catch (error) {
    console.error('Error resetting preferences:', error.message);
  }
}

module.exports = {
  getPreferences,
  savePreferences,
  resetPreferences,
};