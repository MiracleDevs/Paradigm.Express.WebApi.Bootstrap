import { DependencyContainer, DependencyLifeTime, Injectable } from "@miracledevs/paradigm-web-di";
import { TopLevelDomain } from "../entities/models/top-level-domain.model";
import { MySqlConnection } from "../mysql/mysql.connection";
import { RepositoryBase } from "./base.repository";

@Injectable({ lifeTime: DependencyLifeTime.Scoped })
export class TopLevelDomainsRepository extends RepositoryBase<TopLevelDomain, number> {
    constructor(dependencyContainer: DependencyContainer, connection: MySqlConnection) {
        super(dependencyContainer, connection, TopLevelDomain, "top_level_domains");
    }
}
