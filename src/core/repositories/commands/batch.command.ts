/* eslint-disable @typescript-eslint/no-explicit-any */
import { MySqlConnection } from "../../mysql/mysql.connection";
import { DbCommand, CommandResult, RowType } from "./db.command";

export class BatchDbCommand extends DbCommand {
    private _callbacks: CommandResult[];

    constructor(connection: MySqlConnection) {
        super(connection);
        this._callbacks = [];
    }

    addCommand(command: DbCommand, callback?: CommandResult): void {
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
