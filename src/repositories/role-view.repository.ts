import { DependencyContainer, DependencyLifeTime, Injectable } from "@miracledevs/paradigm-web-di";
import { RoleView } from "../entities/views/role.view";
import { MySqlConnection } from "../mysql/mysql.connection";
import { ReadonlyRepositoryBase } from "./base.repository";

@Injectable({ lifeTime: DependencyLifeTime.Scoped })
export class RoleViewRepository extends ReadonlyRepositoryBase<RoleView, number> {
    constructor(dependencyContainer: DependencyContainer, connection: MySqlConnection) {
        super(dependencyContainer, connection, RoleView, "roleView");
    }
}
