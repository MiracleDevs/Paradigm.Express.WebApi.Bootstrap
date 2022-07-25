import { MySqlConfiguration } from "./mysql.configuration";

/**
 * Represents the server api configuration.
 */

export class MailConfig {
    username: string;
    password: string;
    host: string;
    port: number;
    secure: boolean;
}

export class ThirdpartyConfig {
    url: string;
    username: string;
    password: string;
}

export class Configuration {
    /**
     * Indicates if the application is running in development or production mode.
     */
    development: boolean;

    /**
     * A client secret token for the api clients to make authenticated requests.
     */
    clientSecret: string;

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
