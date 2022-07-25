import { DependencyContainer, DependencyLifeTime, Injectable } from "@miracledevs/paradigm-web-di";
import { EmailTemplate } from "../entities/models/email-template.model";
import { MySqlConnection } from "../mysql/mysql.connection";
import { RepositoryBase } from "./base.repository";

@Injectable({ lifeTime: DependencyLifeTime.Scoped })
export class EmailTemplatesRepository extends RepositoryBase<EmailTemplate, number> {
    constructor(dependencyContainer: DependencyContainer, connection: MySqlConnection) {
        super(dependencyContainer, connection, EmailTemplate, "email_templates");
    }

    async getByDivisionAndForm(division: number, formName: string): Promise<EmailTemplate> {
        const [rows] = await this.connection.connection.execute(`SELECT * FROM \`${this.tableName}\` WHERE \`division\`=? AND \`formName\`=?`, [
            division,
            formName,
        ]);
        const entities = this.map(rows, this.entityType);

        if (!entities) throw new Error("Unable to retrieve the entity.");

        return entities[0];
    }
}
