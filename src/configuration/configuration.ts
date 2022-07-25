import { MailConfig } from "./MailConfig";
import { MySqlConfiguration } from "./MySqlConfiguration";
import { ThirdpartyConfig } from "./ThirdpartyConfig";

export class Configuration {
    /**
     * Indicates if the application is running in development or production mode.
     */
    development: boolean;

    /**
     * A client secret token for the api clients to make authenticated requests.
     */
    clientSecret: string;

    /**
     * Recaptcha client secret.
     */
    recaptchaSecret: string;

    /**
     * The mysql connection configuration.
     */
    mysql: MySqlConfiguration;

    /**
     * Mail configuration
     */
    mailConfig: MailConfig;

    /**
     * Session timeout
     */
    sessionTimeout: string;

    /**
     * Registration token timeout
     */
    registrationTokenTimeout: string;

    /**
     * Third Party API config
     */
    thirdpartyConfig: ThirdpartyConfig;
}
