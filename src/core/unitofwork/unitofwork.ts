import { DependencyLifeTime, Injectable } from "@miracledevs/paradigm-web-di";
import { MySqlConnection } from "../mysql/mysql.connection";

@Injectable({ lifeTime: DependencyLifeTime.Scoped })
export class UnitOfWork {
    private _connection: MySqlConnection;
    constructor(connection: MySqlConnection) {
        this._connection = connection;
    }

    async beginTransaction(): Promise<void> {
        await this._connection.connection.beginTransaction();
    }

    async rollbackTransaction(): Promise<void> {
        await this._connection.connection.rollback();
    }

    async commitTransaction(): Promise<void> {
        await this._connection.connection.commit();
    }
}
