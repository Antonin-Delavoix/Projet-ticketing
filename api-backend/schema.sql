-- Schéma SQLite pour le système de ticketing

-- Création de la table 'role'
CREATE TABLE IF NOT EXISTS role (
    id_role INTEGER PRIMARY KEY AUTOINCREMENT,
    libelle TEXT NOT NULL
);

-- Création de la table 'priorite'
CREATE TABLE IF NOT EXISTS priorite (
    id_priorite INTEGER PRIMARY KEY AUTOINCREMENT,
    libelle TEXT NOT NULL
);

-- Création de la table 'utilisateur'
CREATE TABLE IF NOT EXISTS utilisateur (
    id_utilisateur INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT NOT NULL,
    prenom TEXT NOT NULL,
    mdp TEXT NOT NULL,
    id_role INTEGER NOT NULL,
    CONSTRAINT FK_utilisateur_role FOREIGN KEY (id_role) REFERENCES role(id_role)
);

-- Création de la table 'Ticket'
CREATE TABLE IF NOT EXISTS Ticket (
    id_ticket INTEGER PRIMARY KEY AUTOINCREMENT,
    statut TEXT NOT NULL,
    description TEXT,
    reponse_ticket TEXT,
    id_utilisateur INTEGER NOT NULL,
    id_priorite INTEGER NOT NULL,
    CONSTRAINT FK_Ticket_utilisateur FOREIGN KEY (id_utilisateur) REFERENCES utilisateur(id_utilisateur),
    CONSTRAINT FK_Ticket_priorite FOREIGN KEY (id_priorite) REFERENCES priorite(id_priorite)
);
