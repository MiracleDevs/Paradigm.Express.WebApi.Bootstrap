export class MySqlConfiguration {
    /**
     * The database server host address.
     */
    host: string;

    /**
     * The database server host address port, if null the default 3306 port will be used.
     */
    port?: number;

    /**
     * The name of the database.
     */
    database: string;

    /**
     * The name of the user.
     */
    user: string;

    /**
     * The password of the user.
     */
    password?: string;

    /**
     * A connection timeout limit in milliseconds.
     */
    connectTimeout?: number;

    /**
     * The limit of maximum parallel connections at the same time.
     */
    connectionLimit?: number;

    /**
     * Indicates if it should allow multiple statements at the same time.
     */
    multipleStatements?: boolean;
}
