const config = require('./mailConfig.json');

module.exports = class Mailer {
    constructor(){
        this.transporter = require('nodemailer').createTransport(config.transport);
    };

    sendPasswordReset(email, token) {
        this.transporter.sendMail({
            from: config.from,
            to: email,
            subject: 'Password reset confirmation',
            html: `You can reset your password by this URL:
            <a href="http://localhost:${config.PORT}/api/auth/passwordReset/${token}">\
            Reset password! </a>`,
            }, (error, info) => {
            if (error) {
                console.log(error);
                return error;
            }
        });
    }

    sendConfirmEmail (email, token) {
        this.transporter.sendMail({
            from: config.from,
            to: email,
            subject: 'Email confirmation',
            html: `You can confirm your email by this URL: (button) \
            <a href="http://localhost:${config.PORT}/api/auth/confirmEmail/${token}">\
            Confirm Email!</a>`,
        }, (error, info) => {
            if (error) {
                console.log(error);
                return error;
            }
        });
    };
}