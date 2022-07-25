import { DependencyContainer, DependencyLifeTime, Injectable } from "@miracledevs/paradigm-web-di";
import { UserView } from "../entities/views/user.view";
import { MySqlConnection } from "../mysql/mysql.connection";
import { ReadonlyRepositoryBase } from "./base.repository";

@Injectable({ lifeTime: DependencyLifeTime.Scoped })
export class UserViewRepository extends ReadonlyRepositoryBase<UserView, number> {
    constructor(dependencyContainer: DependencyContainer, connection: MySqlConnection) {
        super(dependencyContainer, connection, UserView, "userView");
    }
}
