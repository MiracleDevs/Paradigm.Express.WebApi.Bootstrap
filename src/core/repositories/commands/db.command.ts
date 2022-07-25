/* eslint-disable @typescript-eslint/no-explicit-any */
import { RowDataPacket, OkPacket, ResultSetHeader } from "mysql2";
import { MySqlConnection } from "../../mysql/mysql.connection";

export type RowType = RowDataPacket[][] | RowDataPacket[] | OkPacket | OkPacket[] | ResultSetHeader;

export type InsertionResult<TResult = any> = { insertId: TResult };

export type CommandResult = (result: any) => void;

export abstract class DbCommand {
    private connection: MySqlConnection;

    protected _query: string;

    protected _parameters: any[];

    get query(): string {
        return this._query;
    }

    get parameters(): any[] {
        return this._parameters.slice();
    }

    constructor(connection: MySqlConnection) {
        this.connection = connection;
        this._query = "";
        this._parameters = [];
    }

    public async executeQuery(): Promise<RowType> {
        return (await this.connection.connection.query(this._query, this._parameters))[0];
    }
}
