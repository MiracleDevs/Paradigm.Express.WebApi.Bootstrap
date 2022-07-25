import { DependencyContainer, DependencyLifeTime, Injectable } from "@miracledevs/paradigm-web-di";
import { ForgotPasswordToken } from "../entities/models/forgot-password-token.model";
import { MySqlConnection } from "../mysql/mysql.connection";
import { RepositoryBase } from "./base.repository";

@Injectable({ lifeTime: DependencyLifeTime.Scoped })
export class ForgotPasswordTokenRepository extends RepositoryBase<ForgotPasswordToken, number> {
    constructor(dependencyContainer: DependencyContainer, connection: MySqlConnection) {
        super(dependencyContainer, connection, ForgotPasswordToken, "forgot_password_token");
    }
}
