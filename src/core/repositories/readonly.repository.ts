/* eslint-disable @typescript-eslint/no-explicit-any */
import { DependencyContainer, ObjectType } from "@miracledevs/paradigm-web-di";
import { MySqlConnection } from "../mysql/mysql.connection";
import { BatchDbCommand } from "./commands/batch.command";
import { OkPacket, ResultSetHeader, RowDataPacket } from "mysql2/promise";

export type RowType = RowDataPacket[][] | RowDataPacket[] | OkPacket | OkPacket[] | ResultSetHeader;

export abstract class ReadonlyRepositoryBase<TEntity, TId = number> {
    protected batch: BatchDbCommand;
    constructor(
        protected readonly dependencyContainer: DependencyContainer,
        protected readonly connection: MySqlConnection,
        protected readonly entityType: ObjectType<TEntity>,
        protected readonly tableName: string,
        protected readonly idColumn: string = "id"
    ) {
        this.batch = new BatchDbCommand(connection);
    }

    async getAll(): Promise<TEntity[]> {
        const [rows] = await this.connection.connection.execute(`SELECT * FROM \`${this.tableName}\``);
        return this.map(rows, this.entityType);
    }

    async find(where: string, args: any): Promise<TEntity[]> {
        const [rows] = await this.connection.connection.execute(`SELECT * FROM \`${this.tableName}\` WHERE ${where}`, args);
        return this.map(rows, this.entityType);
    }

    async getById(id: TId): Promise<TEntity> {
        const [rows] = await this.connection.connection.execute(`SELECT * FROM \`${this.tableName}\` WHERE \`${this.idColumn}\`=?`, [id]);
        const entities = this.map(rows, this.entityType);

        if (!entities || entities.length === 0) throw new Error("Unable to retrieve the entity.");

        return entities[0];
    }

    protected map<TType>(rows: RowType, entityType: ObjectType<TType>): TType[] {
        return (rows as any[]).map(row => {
            const entity = this.dependencyContainer.resolve(entityType);

            for (const key in row) {
                if (Object.prototype.hasOwnProperty.call(entity, key)) {
                    (entity as any)[key] = row[key];
                }
            }

            return entity;
        });
    }
}
