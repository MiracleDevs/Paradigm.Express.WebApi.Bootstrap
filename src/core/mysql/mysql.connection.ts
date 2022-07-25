import { Injectable, DependencyLifeTime } from "@miracledevs/paradigm-web-di";
import * as mysql from "mysql2/promise";

@Injectable({ lifeTime: DependencyLifeTime.Scoped })
export class MySqlConnection {
    private _connection: mysql.PoolConnection;

    public get connection(): mysql.PoolConnection {
        return this._connection;
    }

    public initialize(connection: mysql.PoolConnection): void {
        if (!connection) throw new Error("The pooled connection cannot be null.");
        if (this._connection) throw new Error("Unable to initialize the connection twice.");
        this._connection = connection;
    }
}
