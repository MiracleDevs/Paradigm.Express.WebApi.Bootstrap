import { RowDataPacket, OkPacket, ResultSetHeader } from "mysql2";
import { MySqlConnection } from "../../mysql/mysql.connection";

export type RowType = RowDataPacket[][] | RowDataPacket[] | OkPacket | OkPacket[] | ResultSetHeader;

export type InsertionResult = { insertId: any };

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

export class SelectDbCommand extends DbCommand {
    constructor(connection: MySqlConnection, tableName: string) {
        super(connection);
        this._query = `SELECT * FROM \`${tableName}\``;
    }
}

export class InsertDbCommand extends DbCommand {
    constructor(connection: MySqlConnection, tableName: string, entities: any[]) {
        super(connection);
        this.prepareStatement(tableName, entities);
    }

    private prepareStatement(tableName: string, entities: any[]): void {
        if (!entities || !entities.length) throw new Error("The array of entities can not be null or empty.");

        this._query = `INSERT INTO ${tableName} (${this.getColumnNames(entities)}) VALUES ${this.getValues(
            entities
        )} ON DUPLICATE KEY UPDATE ${this.getUpdateStatement(entities)}`;
        this._parameters = this.getValueArray(entities);
    }

    private getColumnNames(entities: any[]): string {
        const keys = Object.keys(entities[0]).map(x => `\`${x}\``);
        return keys.join(",");
    }

    private getValues(entities: any[]): string {
        const questionMarks = Object.keys(entities[0])
            .map(() => "?")
            .join(",");
        return entities.map(() => `(${questionMarks})`).join(",");
    }

    private getUpdateStatement(entities: any[]): string {
        const keys = Object.keys(entities[0]).map(x => (x !== "id" ? `\`${x}\` = VALUES(${x})` : "id=id"));
        return keys.join(",");
    }

    private getValueArray(entities: any[]): any[] {
        const keys = Object.keys(entities[0]);
        const parameters = [];

        for (const entity of entities) {
            for (const key of keys) {
                parameters.push(entity.hasOwnProperty(key) ? entity[key] : null);
            }
        }

        return parameters;
    }
}

export class ReplaceDbCommand extends DbCommand {
    constructor(connection: MySqlConnection, tableName: string, entities: any[]) {
        super(connection);
        this.prepareStatement(tableName, entities);
    }

    private prepareStatement(tableName: string, entities: any[]): void {
        if (!entities || !entities.length) throw new Error("The array of entities can not be null or empty.");

        this._query = `REPLACE INTO ${tableName} (${this.getColumnNames(entities)}) VALUES ${this.getValues(entities)}`;
        this._parameters = this.getValueArray(entities);
    }

    private getColumnNames(entities: any[]): string {
        const keys = Object.keys(entities[0]).map(x => `\`${x}\``);
        return keys.join(",");
    }

    private getValues(entities: any[]): string {
        const questionMarks = Object.keys(entities[0])
            .map(() => "?")
            .join(",");
        return entities.map(() => `(${questionMarks})`).join(",");
    }

    private getValueArray(entities: any[]): any[] {
        const keys = Object.keys(entities[0]);
        const parameters = [];

        for (const entity of entities) {
            for (const key of keys) {
                parameters.push(entity.hasOwnProperty(key) ? entity[key] : null);
            }
        }

        return parameters;
    }
}

export class BatchDbCommand extends DbCommand {
    private _callbacks: Function[];

    constructor(connection: MySqlConnection) {
        super(connection);
        this._callbacks = [];
    }

    addCommand(command: DbCommand, callback?: Function): void {
        this._callbacks.push(callback);
        this._query += command.query + ";";
        this._parameters = this._parameters.concat(command.parameters);
    }

    public async executeQuery(): Promise<RowType> {
        const results = (await super.executeQuery()) as any;

        if (results && results.length) {
            for (let i = 0; i < results.length; i++) {
                const callback = this._callbacks[i];
                const result = results[i];

                if (callback) {
                    callback(result);
                }
            }
        }

        return results;
    }
}
