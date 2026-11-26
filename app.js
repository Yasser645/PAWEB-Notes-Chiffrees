
const fs = require("fs");
const crypto = require("crypto");
const readline = require("readline/promises");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const fichier = "notes.enc";

// Chiffrer et sauvegarder les notes
function sauvegarder(notes, password) {
    const salt = crypto.randomBytes(16);
    const iv = crypto.randomBytes(12);

    const key = crypto.scryptSync(password, salt, 32);

    const cipher = crypto.createCipheriv(
        "aes-256-gcm", key, iv
    );

    const texte = JSON.stringify(notes);

    const data = Buffer.concat([
        cipher.update(texte, "utf8"),
        cipher.final()
    ]);

    const resultat = {
        salt: salt.toString("hex"),
        iv: iv.toString("hex"),
        tag: cipher.getAuthTag().toString("hex"),
        data: data.toString("hex")
    };

    fs.writeFileSync(fichier, JSON.stringify(resultat));
}

// Lire et dechiffrer les notes
function charger(password) {
    if (!fs.existsSync(fichier)) {
        return [];
    }

    const info = JSON.parse(
        fs.readFileSync(fichier, "utf8")
    );

    const salt = Buffer.from(info.salt, "hex");
    const iv = Buffer.from(info.iv, "hex");
    const tag = Buffer.from(info.tag, "hex");
    const data = Buffer.from(info.data, "hex");

    const key = crypto.scryptSync(password, salt, 32);

    const decipher = crypto.createDecipheriv(
        "aes-256-gcm", key, iv,
        { authTagLength: 16 }
    );

    decipher.setAuthTag(tag);

    const texte = Buffer.concat([
        decipher.update(data),
        decipher.final()
    ]);

    return JSON.parse(texte.toString("utf8"));
}

// Programme principal
async function main() {
    const commande = process.argv[2];

    // Afficher les commandes
    if (!commande || commande === "help") {
        console.log("=== Gestion des notes ===");
        console.log("node app.js add");
        console.log("node app.js list");
        console.log("node app.js search");
        console.log("node app.js read ID");
        console.log("node app.js delete ID");
        console.log("node app.js help");
        return;
    }

    if (!["add", "list", "search", "read", "delete"].includes(commande)) {
        console.log("Commande inconnue.");
        return;
    }

    const password = await rl.question("Mot de passe : ");

    if (password === "") {
        console.log("Le mot de passe est obligatoire.");
        return;
    }

    let notes;

    try {
        notes = charger(password);
    } catch (erreur) {
        console.log("Mot de passe incorrect ou fichier incompatible.");
        return;
    }

    // Ajouter une note
    if (commande === "add") {
        const titre = await rl.question("Titre : ");
        const contenu = await rl.question("Contenu : ");

        if (!titre.trim() || !contenu.trim()) {
            console.log("Titre et contenu obligatoires.");
            return;
        }

        const id = notes.length === 0
            ? 1
            : Math.max(...notes.map(n => n.id)) + 1;

        notes.push({ id, titre, contenu });

        sauvegarder(notes, password);
        console.log("Note ajoutee et chiffree !");
    }

    // Afficher les notes
    else if (commande === "list") {
        if (notes.length === 0) {
            console.log("Aucune note.");
        }

        notes.forEach(note => {
            console.log(note.id + " - " + note.titre);
        });
    }

    // Rechercher une note
    else if (commande === "search") {
        const mot = await rl.question("Mot a chercher : ");

        const resultat = notes.filter(note =>
            note.titre.toLowerCase().includes(mot.toLowerCase()) ||
            note.contenu.toLowerCase().includes(mot.toLowerCase())
        );

        if (resultat.length === 0) {
            console.log("Aucun resultat.");
        }

        resultat.forEach(note => {
            console.log(note.id + " - " + note.titre);
        });
    }

    // Lire une note
    else if (commande === "read") {
        const id = Number(process.argv[3]);
        const note = notes.find(n => n.id === id);

        if (note) {
            console.log("Titre : " + note.titre);
            console.log("Contenu : " + note.contenu);
        } else {
            console.log("Note introuvable.");
        }
    }

    // Supprimer une note
    else if (commande === "delete") {
        const id = Number(process.argv[3]);
        const note = notes.find(n => n.id === id);

        if (note) {
            notes = notes.filter(n => n.id !== id);
            sauvegarder(notes, password);
            console.log("Note supprimee !");
        } else {
            console.log("Note introuvable.");
        }
    }
}

main()
    .catch(console.error)
    .finally(() => rl.close());
