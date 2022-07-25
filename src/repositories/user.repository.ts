import { DependencyContainer, DependencyLifeTime, Injectable } from "@miracledevs/paradigm-web-di";
import { User } from "../entities/models/user.model";
import { MySqlConnection } from "../mysql/mysql.connection";
import { RepositoryBase } from "./base.repository";

@Injectable({ lifeTime: DependencyLifeTime.Scoped })
export class UserRepository extends RepositoryBase<User, number> {
    constructor(dependencyContainer: DependencyContainer, connection: MySqlConnection) {
        super(dependencyContainer, connection, User, "user");
    }

    async getByUsername(username: string): Promise<User> {
        const [rows] = await this.connection.connection.execute(`SELECT * FROM \`${this.tableName}\` WHERE userName=?`, [username]);
        const entities = this.map(rows, this.entityType);

        if (!entities || entities.length === 0) throw new Error("Unable to retrieve the entity.");

        return entities[0];
    }

    async changePassword(username: string, newPassword: string): Promise<User> {
        const [rows] = await this.connection.connection.query(`UPDATE \`${this.tableName}\` SET passwordHash=? WHERE userName=?`, [
            newPassword,
            username,
        ]);

        const entities = this.map(rows, this.entityType);

        if (!entities || entities.length === 0) throw new Error("Unable to retrieve the entity.");

        return entities[0];
    }
}
