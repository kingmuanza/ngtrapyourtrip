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
admin.initializeApp();

exports.confirmInscription = functions.auth.user()
    .onCreate((user) => {
        // Grab the current value of what was written to the Realtime Database.
        var texte = `<div>
  <h4>TRAP YOUR TRIP</h4>
  <h2>
  Confirmation d'inscription
  </h2>
  <p>
  Bonjour !
  </p>

  <p>Merci de nous faire confiance. Votre inscription a été réalisée avec succès.</p>
</div>`;
        const mailOptions = {
            from: "muanza.kangudie@gmail.com",
            html: texte,
            subject: `Inscription réussie`,
            text: texte,
            to: user.email,
        };

        return transporter.sendMail(mailOptions);
    });
