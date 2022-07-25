import { ConfigurationBuilder } from "@miracledevs/paradigm-express-webapi";
import { Injectable, DependencyLifeTime } from "@miracledevs/paradigm-web-di";
import { Configuration } from "../../configuration/configuration";
import * as mysql from "mysql2/promise";
import { MySqlConnection } from "./mysql.connection";

@Injectable({ lifeTime: DependencyLifeTime.Singleton })
export class MySqlConnector {
    private pool: mysql.Pool;

    constructor(configurationBuilder: ConfigurationBuilder) {
        const configuration = configurationBuilder.build(Configuration);
        this.pool = mysql.createPool(configuration.mysql);
    }

    async createScopedConnection(connection: MySqlConnection): Promise<MySqlConnection> {
        connection.initialize(await this.pool.getConnection());
        return connection;
    }

    releaseConnection(connection: MySqlConnection): void {
        connection.connection?.release();
    }
}
