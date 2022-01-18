const nodeMailer = require(`nodemailer`)
const isProduction = process.env.NODE_ENV === 'production';
const API_URL= isProduction ? process.env.API_URL : process.env.DEV_API_URL

class MailService {
    constructor() {
        this.transporter = nodeMailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
            }
        })
    }

    async sendActivationMail(to, linc) {
        await this.transporter.sendMail({
            from: process.env.SMTP_LOGIN,
            to,
            subject: `активация акаунта на` + API_URL,
            text: ``,
            html:`перейдите для активации ${linc}` /*<div>
                    <h1> перейдите для активации</h1>
                    <a href={linc}> {linc} </a>
                </div>*/
        })
    }

}

module.exports = new MailService()
