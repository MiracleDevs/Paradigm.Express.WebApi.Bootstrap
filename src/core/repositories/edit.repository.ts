/* eslint-disable @typescript-eslint/no-explicit-any */
import { DependencyContainer, ObjectType } from "@miracledevs/paradigm-web-di";
import { MySqlConnection } from "../mysql/mysql.connection";
import { InsertionResult } from "./commands/db.command";
import { BatchDbCommand } from "./commands/batch.command";
import { ReplaceDbCommand } from "./commands/replace.command";
import { InsertDbCommand } from "./commands/insert.command";
import { ReadonlyRepositoryBase, RowType } from "./readonly.repository";

export abstract class EditRepositoryBase<TEntity, TId = number> extends ReadonlyRepositoryBase<TEntity, TId> {
    constructor(dependencyContainer: DependencyContainer, connection: MySqlConnection, entityType: ObjectType<TEntity>, tableName: string, idColumn = "id") {
        super(dependencyContainer, connection, entityType, tableName, idColumn);
    }

    async insertOne(entity: TEntity): Promise<InsertionResult<TId>> {
        this.insert(entity);
        return (await this.apply()) as any;
    }

    insert(entity: TEntity): void {
        const insertCommand = new InsertDbCommand(this.connection, this.tableName, [entity]);
        this.batch.addCommand(insertCommand, (x: any) => ((entity as any)[this.idColumn] = x.insertId));
    }

    replace(entity: TEntity): void {
        const replaceCommand = new ReplaceDbCommand(this.connection, this.tableName, [entity]);
        this.batch.addCommand(replaceCommand, (x: any) => ((entity as any)[this.idColumn] = x.insertId));
    }

    async apply(): Promise<RowType> {
        if (this.batch.query) {
            const result = await this.batch.executeQuery();
            this.batch = new BatchDbCommand(this.connection);
            return result;
        } else {
            throw new Error("Query is null or empty.");
        }
    }

    async update(entity: TEntity): Promise<TEntity> {
        await this.connection.connection.query(`UPDATE \`${this.tableName}\` SET ? WHERE \`${this.idColumn}\`=?`, [entity, (entity as any)[this.idColumn]]);
        return entity;
    }

    async delete(id: TId): Promise<void> {
        await this.connection.connection.query(`DELETE FROM \`${this.tableName}\` WHERE \`${this.idColumn}\`=?`, [id]);
    }

    async truncate(): Promise<void> {
        await this.connection.connection.query(`TRUNCATE \`${this.tableName}\``);
    }
}
