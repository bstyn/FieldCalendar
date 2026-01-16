const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

const sendConfirmationEmail = async (to, reservation) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: to,
      subject: 'Potwierdzenie Rezerwacji Boiska',
      html: `
        <h1>Rezerwacja Potwierdzona</h1>
        <p>Witaj ${reservation.guest_name},</p>
        <p>Twoja rezerwacja boiska została potwierdzona.</p>
        <h3>Szczegóły rezerwacji:</h3>
        <ul>
          <li><strong>Data rozpoczęcia:</strong> ${new Date(reservation.start_time).toLocaleString('pl-PL')}</li>
          <li><strong>Data zakończenia:</strong> ${new Date(reservation.end_time).toLocaleString('pl-PL')}</li>
          <li><strong>Status:</strong> ${reservation.status === 'confirmed' ? 'Potwierdzona' : reservation.status === 'pending' ? 'Oczekująca' : 'Anulowana'}</li>
          ${reservation.number_of_players ? `<li><strong>Liczba graczy:</strong> ${reservation.number_of_players}</li>` : ''}
        </ul>
        ${reservation.notes ? `<p><strong>Uwagi:</strong> ${reservation.notes}</p>` : ''}
        <p>Dziękujemy za rezerwację!</p>
        <p>Prosimy o punktualne stawienie się na boisku.</p>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

const sendCancellationEmail = async (to, reservation) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: to,
      subject: 'Anulowanie Rezerwacji Boiska',
      html: `
        <h1>Rezerwacja Anulowana</h1>
        <p>Witaj ${reservation.guest_name},</p>
        <p>Twoja rezerwacja boiska została anulowana.</p>
        <h3>Szczegóły anulowanej rezerwacji:</h3>
        <ul>
          <li><strong>Data rozpoczęcia:</strong> ${new Date(reservation.start_time).toLocaleString('pl-PL')}</li>
          <li><strong>Data zakończenia:</strong> ${new Date(reservation.end_time).toLocaleString('pl-PL')}</li>
        </ul>
        <p>Jeśli nie prosiłeś o anulowanie tej rezerwacji, prosimy o natychmiastowy kontakt.</p>
        <p>Zapraszamy ponownie!</p>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Cancellation email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending cancellation email:', error);
    throw error;
  }
};

module.exports = {
  sendConfirmationEmail,
  sendCancellationEmail
};
