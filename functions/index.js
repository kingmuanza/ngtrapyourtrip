const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
const cors = require("cors")({ origin: true });

const transporter = nodemailer.createTransport({
    auth: {
        pass: "xioygswhzrumenkf",
        user: "muanza.kangudie@gmail.com",
    },
    host: "smtp.gmail.com",
    port: 587,
    requireTLS: true,
    secure: false,
    service: "gmail",
});
/*
const transporter = nodemailer.createTransport({
    auth: {
        pass: "Tr@pY0urTr1p",
        user: "contacts@trapyourtrip.com",
    },
    host: "smtp.ionos.fr",
    port: 465,
    // requireTLS: true,
    secure: true,
    // service: "gmail",
});
*/
admin.initializeApp();

exports.bienvenue = functions.firestore.document("utilisateurs-trap/{userId}")
    .onCreate((snap, context) => {
        const user = snap.data();
        // Grab the current value of what was written to the Realtime Database.
        var texte = `<div>
        <img src="https://firebasestorage.googleapis.com/v0/b/trapyourtrip.appspot.com/o/nouveauxassets%2FTrap%20Your%20Trip%20Logo%202.png?alt=media&token=d47152d4-0dc0-4021-b491-9513b1358a51" style="height: 100px; margin-bottom: 20px">
  <h4>Bienvenue chez Trap Your Trip ` + user.prenom + ` ` + user.nom + ` !</h4>
  <p style="margin-top: 20px">
  Nous vous remercions pour votre inscription.
  Trap Your Trip a pour vocation de vous inspirer chaque jour.
  Comment ? En vous proposant les meilleures offres de voyages !
  Que vous ayez besoin de conseils, d’aide ou d’inspiration,
  nos conseillers voyage seront heureux de répondre à vos questions.
  N’hésitez plus, vous n’êtes qu’à un clic de vos prochaines vacances !
  </p>

  <p>
  Plus d’idées de voyage ?
  Rendez-vous sur la plateforme
  <a href="www.trapyourtrip.com">www.trapyourtrip.com</a>
  </p>
  <p style="margin-top: 20px">
  L’équipe Trap Your Trip
  </p>
</div>`;
        const mailOptions = {
            from: "muanza.kangudie@gmail.com",
            html: texte,
            subject: `Bienvenue chez Trap Your Trip`,
            text: texte,
            to: user.login,
        };

        return transporter.sendMail(mailOptions);
    });
