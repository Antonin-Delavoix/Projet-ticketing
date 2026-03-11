-- Données initiales pour le système de ticketing

-- Insertion des rôles
INSERT INTO role (libelle) VALUES ('Admin');
INSERT INTO role (libelle) VALUES ('Utilisateur');

-- Insertion des priorités
INSERT INTO priorite (libelle) VALUES ('Basse');
INSERT INTO priorite (libelle) VALUES ('Moyenne');
INSERT INTO priorite (libelle) VALUES ('Haute');
INSERT INTO priorite (libelle) VALUES ('Urgente');

-- Insertion d'utilisateurs exemples (mot de passe : 'password123')
INSERT INTO utilisateur (nom, prenom, mdp, id_role) VALUES 
    ('Dupont', 'Jean', 'password123', 1),
    ('Martin', 'Sophie', 'password123', 2),
    ('Durand', 'Pierre', 'password123', 2);

-- Insertion de tickets exemples
INSERT INTO Ticket (statut, description, reponse_ticket, id_utilisateur, id_priorite) VALUES 
    ('Ouvert', 'Problème de connexion au système', NULL, 2, 2),
    ('En cours', 'Demande de nouvelle fonctionnalité', 'Nous analysons votre demande', 2, 1),
    ('Fermé', 'Bug dans le module de recherche', 'Problème résolu dans la version 1.2', 2, 3);
