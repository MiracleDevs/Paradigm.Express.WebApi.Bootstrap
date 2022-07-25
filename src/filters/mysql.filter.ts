import { Injectable, DependencyLifeTime, DependencyContainer } from "@miracledevs/paradigm-web-di";
import { IFilter, HttpContext, RoutingContext } from "@miracledevs/paradigm-express-webapi";
import { MySqlConnector } from "../mysql/mysql.connector";
import { MySqlConnection } from "../mysql/mysql.connection";

/**
 * Requires a mysql connection from the connection pool for the ongoing request.
 */
@Injectable({ lifeTime: DependencyLifeTime.Scoped })
export class MySqlConnectionFilter implements IFilter {
    private connection: MySqlConnection;

    constructor(private readonly dependencyContainer: DependencyContainer, private readonly mysqlConnector: MySqlConnector) {}

    async beforeExecute(httpContext: HttpContext, _: RoutingContext): Promise<void> {
        this.connection = this.dependencyContainer.resolve(MySqlConnection);
        await this.mysqlConnector.createScopedConnection(this.connection);
    }

    async afterExecute(httpContext: HttpContext, routingContext: RoutingContext): Promise<void> {
        this.mysqlConnector.releaseConnection(this.connection);
    }

    async onError(httpContext: HttpContext, _: RoutingContext) {
        this.mysqlConnector.releaseConnection(this.connection);
    }
}
