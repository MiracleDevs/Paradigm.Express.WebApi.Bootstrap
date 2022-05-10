import { DependencyContainer, DependencyLifeTime, Injectable } from "@miracledevs/paradigm-web-di";
import { MySqlConnection } from "../mysql/mysql.connection";

@Injectable({ lifeTime: DependencyLifeTime.Scoped })
export class UnitOfWork {
    private _connection: MySqlConnection;
    constructor(dependencyContainer: DependencyContainer, connection: MySqlConnection) {
        this._connection = connection;
    }

    async beginTransaction(): Promise<any> {
        return await this._connection.connection.beginTransaction();
    }

    async rollbackTransaction(): Promise<any> {
        return await this._connection.connection.rollback();
    }

    async commitTransaction(): Promise<any> {
        return await this._connection.connection.commit();
    }
}
