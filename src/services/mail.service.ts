import { ConfigurationBuilder } from "@miracledevs/paradigm-express-webapi";
import { Configuration } from "../configuration/configuration";
import { DependencyLifeTime, Injectable } from "@miracledevs/paradigm-web-di";
import * as nodemailer from "nodemailer";
import { Transporter } from "nodemailer";

export class Mail {
    from: string;
    to: string;
    subject: string;
    text: string;
    html: string = null;
}

@Injectable({ lifeTime: DependencyLifeTime.Transient })
export class MailService {
    private readonly transporter: Transporter;

    constructor(private readonly configurationBuilder: ConfigurationBuilder) {
        const configuration = configurationBuilder.build(Configuration).mailConfig;
        this.transporter = nodemailer.createTransport({
            host: configuration.host,
            port: configuration.port,
            secure: configuration.secure,
            auth: {
                user: configuration.username,
                pass: configuration.password,
            },
        });
    }

    public async sendEmail(emailData: Mail): Promise<any> {
        let info = await this.transporter.sendMail({
            from: emailData.from,
            to: emailData.to,
            subject: emailData.subject,
            text: emailData.text,
            html: emailData.html,
        });

        console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

        return info;
    }
}
