/* eslint-disable @typescript-eslint/no-explicit-any */
import { MySqlConnection } from "../../mysql/mysql.connection";
import { DbCommand } from "./db.command";

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
                parameters.push(Object.prototype.hasOwnProperty.call(entity, key) ? entity[key] : null);
            }
        }

        return parameters;
    }
}
