const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'ticketing.db');

// Supprimer l'ancienne base de données si elle existe
if (fs.existsSync(DB_PATH)) {
    fs.unlinkSync(DB_PATH);
    console.log('Ancienne base de données supprimée');
}

// Créer la nouvelle base de données
const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        console.error('Erreur lors de la création de la base de données:', err.message);
        process.exit(1);
    }
    console.log('Base de données créée avec succès');
});

// Fonction pour exécuter un fichier SQL
function executeSqlFile(filename, callback) {
    const sqlPath = path.join(__dirname, filename);
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    db.exec(sql, (err) => {
        if (err) {
            console.error(`Erreur lors de l'exécution de ${filename}:`, err.message);
            callback(err);
        } else {
            console.log(`✓ ${filename} exécuté avec succès`);
            callback(null);
        }
    });
}

// Exécuter les scripts SQL dans l'ordre
console.log('\nInitialisation de la base de données...\n');

executeSqlFile('schema.sql', (err) => {
    if (err) {
        db.close();
        process.exit(1);
    }
    
    executeSqlFile('seed.sql', (err) => {
        if (err) {
            db.close();
            process.exit(1);
        }
        
        console.log('\nBase de données initialisée avec succès !');
        console.log(`Fichier de base de données créé : ${DB_PATH}\n`);
        
        db.close((err) => {
            if (err) {
                console.error('Erreur lors de la fermeture de la base de données:', err.message);
            }
        });
    });
});
