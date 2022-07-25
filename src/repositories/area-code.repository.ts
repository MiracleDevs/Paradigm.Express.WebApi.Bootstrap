import { DependencyContainer, DependencyLifeTime, Injectable } from "@miracledevs/paradigm-web-di";
import { AreaCode } from "../entities/models/area-code.model";
import { MySqlConnection } from "../mysql/mysql.connection";
import { RepositoryBase } from "./base.repository";

@Injectable({ lifeTime: DependencyLifeTime.Scoped })
export class AreaCodeRepository extends RepositoryBase<AreaCode, number> {
    constructor(dependencyContainer: DependencyContainer, connection: MySqlConnection) {
        super(dependencyContainer, connection, AreaCode, "phone_area_codes");
    }
}
