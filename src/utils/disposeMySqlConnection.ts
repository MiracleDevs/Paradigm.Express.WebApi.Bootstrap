import { DependencyContainer } from "@miracledevs/paradigm-web-di";
import { MySqlConnection } from "../mysql/mysql.connection";
import { MySqlConnector } from "../mysql/mysql.connector";

function disposeConnection(dependencyContainer: DependencyContainer) {
    const connection = dependencyContainer.resolve(MySqlConnection);
    const connector = dependencyContainer.resolve(MySqlConnector);
    connector.releaseConnection(connection);
}

export default disposeConnection;
