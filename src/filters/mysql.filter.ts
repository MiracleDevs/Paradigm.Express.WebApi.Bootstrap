import { Injectable, DependencyLifeTime, DependencyContainer } from "@miracledevs/paradigm-web-di";
import { IFilter, HttpContext } from "@miracledevs/paradigm-express-webapi";
import { MySqlConnector } from "../core/mysql/mysql.connector";
import { MySqlConnection } from "../core/mysql/mysql.connection";

/**
 * Requires a mysql connection from the connection pool for the ongoing request.
 */
@Injectable({ lifeTime: DependencyLifeTime.Scoped })
export class MySqlConnectionFilter implements IFilter {
    private connection: MySqlConnection;

    constructor(private readonly dependencyContainer: DependencyContainer, private readonly mysqlConnector: MySqlConnector) {}

    async beforeExecute(httpContext: HttpContext): Promise<void> {
        try {
            this.connection = this.dependencyContainer.resolve(MySqlConnection);
            await this.mysqlConnector.createScopedConnection(this.connection);
        } catch {
            httpContext.response.sendStatus(500);
        }
    }

    async afterExecute(): Promise<void> {
        this.mysqlConnector.releaseConnection(this.connection);
    }

    async onError() {
        this.mysqlConnector.releaseConnection(this.connection);
    }
}
