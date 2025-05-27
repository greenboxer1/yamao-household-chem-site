const fs = require('fs');
const path = require('path');
const fsPromises = fs.promises;

const DB_PATH = path.join(__dirname, 'database.sqlite');
const BACKUP_DIR = path.join(__dirname, 'db_backups');
const MAX_BACKUPS = 36;
const BACKUP_INTERVAL_MS = 10 * 60 * 1000; // 10 minutes

// Ensure backup directory exists
async function ensureBackupDir() {
  try {
    await fsPromises.mkdir(BACKUP_DIR, { recursive: true });
  } catch (err) {
    if (err.code !== 'EEXIST') {
      throw err;
    }
  }
}

// Create a backup of the database
async function createBackup() {
  try {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const backupPath = path.join(BACKUP_DIR, `backup_${hours}_${minutes}.sqlite`);
    
    await fsPromises.copyFile(DB_PATH, backupPath);
    console.log(`[${new Date().toISOString()}] Created backup: ${backupPath}`);
    
    await cleanupOldBackups();
  } catch (err) {
    console.error('Error creating backup:', err);
  }
}

// Remove old backups if we have more than MAX_BACKUPS
async function cleanupOldBackups() {
  try {
    const files = (await fsPromises.readdir(BACKUP_DIR))
      .filter(file => file.startsWith('backup-') && file.endsWith('.sqlite'))
      .map(file => ({
        name: file,
        time: fs.statSync(path.join(BACKUP_DIR, file)).mtime.getTime()
      }))
      .sort((a, b) => b.time - a.time);

    // Remove oldest backups if we have more than MAX_BACKUPS
    for (let i = MAX_BACKUPS; i < files.length; i++) {
      const filePath = path.join(BACKUP_DIR, files[i].name);
      await fsPromises.unlink(filePath);
      console.log(`[${new Date().toISOString()}] Removed old backup: ${filePath}`);
    }
  } catch (err) {
    console.error('Error cleaning up old backups:', err);
  }
}

// Start the backup process
async function startBackupProcess() {
  await ensureBackupDir();
  
  // Create initial backup
  await createBackup();
  
  // Schedule periodic backups
  const intervalId = setInterval(createBackup, BACKUP_INTERVAL_MS);
  
  console.log(`[${new Date().toISOString()}] Database backup process started. Backups will be created every 10 minutes.`);
  
  // Return function to stop the backup process
  return () => {
    clearInterval(intervalId);
    console.log('Database backup process stopped.');
  };
}

module.exports = {
  startBackupProcess
};
