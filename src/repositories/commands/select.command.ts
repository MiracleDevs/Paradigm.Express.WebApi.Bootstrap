import { MySqlConnection } from "../../mysql/mysql.connection";
import { DbCommand } from "./db.command";

export class SelectDbCommand extends DbCommand {
    constructor(connection: MySqlConnection, tableName: string) {
        super(connection);
        this._query = `SELECT * FROM \`${tableName}\``;
    }
}
