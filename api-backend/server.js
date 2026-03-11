const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_PATH = path.join(__dirname, 'ticketing.db');

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connexion à la base de données
const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        console.error('Erreur de connexion à la base de données:', err.message);
        process.exit(1);
    }
    console.log('✓ Connecté à la base de données SQLite');
});

// Route de test
app.get('/', (req, res) => {
    res.json({ message: 'API Ticketing fonctionnelle !' });
});

// ====================== ROUTES ROLES ======================
app.get('/api/roles', (req, res) => {
    db.all('SELECT * FROM role', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ roles: rows });
    });
});

// ====================== ROUTES PRIORITES ======================
app.get('/api/priorites', (req, res) => {
    db.all('SELECT * FROM priorite', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ priorites: rows });
    });
});

// ====================== ROUTES UTILISATEURS ======================
// Récupérer tous les utilisateurs
app.get('/api/utilisateurs', (req, res) => {
    const query = `
        SELECT u.*, r.libelle as role_libelle 
        FROM utilisateur u
        LEFT JOIN role r ON u.id_role = r.id_role
    `;
    
    db.all(query, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ utilisateurs: rows });
    });
});

// Récupérer un utilisateur par ID
app.get('/api/utilisateurs/:id', (req, res) => {
    const query = `
        SELECT u.*, r.libelle as role_libelle 
        FROM utilisateur u
        LEFT JOIN role r ON u.id_role = r.id_role
        WHERE u.id_utilisateur = ?
    `;
    
    db.get(query, [req.params.id], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }
        res.json({ utilisateur: row });
    });
});

// Créer un nouvel utilisateur
app.post('/api/utilisateurs', (req, res) => {
    const { nom, prenom, mdp, id_role } = req.body;
    
    if (!nom || !prenom || !mdp || !id_role) {
        return res.status(400).json({ error: 'Tous les champs sont requis' });
    }
    
    const query = 'INSERT INTO utilisateur (nom, prenom, mdp, id_role) VALUES (?, ?, ?, ?)';
    
    db.run(query, [nom, prenom, mdp, id_role], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ 
            id_utilisateur: this.lastID,
            message: 'Utilisateur créé avec succès'
        });
    });
});

// ====================== ROUTES TICKETS ======================
// Récupérer tous les tickets
app.get('/api/tickets', (req, res) => {
    const query = `
        SELECT 
            t.*,
            u.nom as utilisateur_nom,
            u.prenom as utilisateur_prenom,
            p.libelle as priorite_libelle
        FROM Ticket t
        LEFT JOIN utilisateur u ON t.id_utilisateur = u.id_utilisateur
        LEFT JOIN priorite p ON t.id_priorite = p.id_priorite
        ORDER BY t.id_ticket DESC
    `;
    
    db.all(query, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ tickets: rows });
    });
});

// Récupérer un ticket par ID
app.get('/api/tickets/:id', (req, res) => {
    const query = `
        SELECT 
            t.*,
            u.nom as utilisateur_nom,
            u.prenom as utilisateur_prenom,
            p.libelle as priorite_libelle
        FROM Ticket t
        LEFT JOIN utilisateur u ON t.id_utilisateur = u.id_utilisateur
        LEFT JOIN priorite p ON t.id_priorite = p.id_priorite
        WHERE t.id_ticket = ?
    `;
    
    db.get(query, [req.params.id], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            return res.status(404).json({ error: 'Ticket non trouvé' });
        }
        res.json({ ticket: row });
    });
});

// Créer un nouveau ticket
app.post('/api/tickets', (req, res) => {
    const { statut, description, id_utilisateur, id_priorite } = req.body;
    
    if (!statut || !id_utilisateur || !id_priorite) {
        return res.status(400).json({ error: 'Les champs statut, id_utilisateur et id_priorite sont requis' });
    }
    
    const query = 'INSERT INTO Ticket (statut, description, id_utilisateur, id_priorite) VALUES (?, ?, ?, ?)';
    
    db.run(query, [statut, description || null, id_utilisateur, id_priorite], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ 
            id_ticket: this.lastID,
            message: 'Ticket créé avec succès'
        });
    });
});

// Mettre à jour un ticket
app.put('/api/tickets/:id', (req, res) => {
    const { statut, description, reponse_ticket, id_priorite } = req.body;
    const updates = [];
    const values = [];
    
    if (statut) {
        updates.push('statut = ?');
        values.push(statut);
    }
    if (description !== undefined) {
        updates.push('description = ?');
        values.push(description);
    }
    if (reponse_ticket !== undefined) {
        updates.push('reponse_ticket = ?');
        values.push(reponse_ticket);
    }
    if (id_priorite) {
        updates.push('id_priorite = ?');
        values.push(id_priorite);
    }
    
    if (updates.length === 0) {
        return res.status(400).json({ error: 'Aucun champ à mettre à jour' });
    }
    
    values.push(req.params.id);
    const query = `UPDATE Ticket SET ${updates.join(', ')} WHERE id_ticket = ?`;
    
    db.run(query, values, function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Ticket non trouvé' });
        }
        res.json({ message: 'Ticket mis à jour avec succès' });
    });
});

// Supprimer un ticket
app.delete('/api/tickets/:id', (req, res) => {
    db.run('DELETE FROM Ticket WHERE id_ticket = ?', [req.params.id], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Ticket non trouvé' });
        }
        res.json({ message: 'Ticket supprimé avec succès' });
    });
});

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`\n Serveur démarré sur http://localhost:${PORT}`);
    console.log(` Base de données : ${DB_PATH}\n`);
});

// Gestion de la fermeture propre
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('\n✓ Connexion à la base de données fermée');
        process.exit(0);
    });
});
