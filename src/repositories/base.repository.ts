import { DependencyContainer, ObjectType } from "@miracledevs/paradigm-web-di";
import { OkPacket, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { MySqlConnection } from "../mysql/mysql.connection";
import { BatchDbCommand, InsertDbCommand, InsertionResult, ReplaceDbCommand } from "./commands/db.command";

type RowType = RowDataPacket[][] | RowDataPacket[] | OkPacket | OkPacket[] | ResultSetHeader;

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
                if (entity.hasOwnProperty(key)) {
                    (entity as any)[key] = row[key];
                }
            }

            return entity;
        });
    }
}

export abstract class RepositoryBase<TEntity, TId = number> extends ReadonlyRepositoryBase<TEntity, TId> {
    constructor(
        dependencyContainer: DependencyContainer,
        connection: MySqlConnection,
        entityType: ObjectType<TEntity>,
        tableName: string,
        idColumn = "id"
    ) {
        super(dependencyContainer, connection, entityType, tableName, idColumn);
    }

    insertOne(entity: TEntity): Promise<InsertionResult> {
        this.insert(entity);
        return this.apply();
    }

    insert(entity: TEntity): void {
        const insertCommand = new InsertDbCommand(this.connection, this.tableName, [entity]);
        this.batch.addCommand(insertCommand, (x: any) => ((entity as any)[this.idColumn] = x.insertId));
    }

    replace(entity: TEntity): void {
        const replaceCommand = new ReplaceDbCommand(this.connection, this.tableName, [entity]);
        this.batch.addCommand(replaceCommand, (x: any) => ((entity as any)[this.idColumn] = x.insertId));
    }

    async apply(): Promise<InsertionResult> {
        if (this.batch.query) {
            const result = (await this.batch.executeQuery()) as InsertionResult;
            // Clean Batch after apply;
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
