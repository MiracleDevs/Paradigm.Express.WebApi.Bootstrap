import { DependencyContainer, DependencyLifeTime, Injectable } from "@miracledevs/paradigm-web-di";
import { AccessLog } from "../entities/models/access-log.model";
import { MySqlConnection } from "../mysql/mysql.connection";
import { RepositoryBase } from "./base.repository";

export enum AccessLogType {
    INFO = 1,
    WARNING = 2,
    ERROR = 3
}

@Injectable({ lifeTime: DependencyLifeTime.Scoped })
export class AccessLogRepository extends RepositoryBase<AccessLog, number>
{
    constructor(dependencyContainer: DependencyContainer, connection: MySqlConnection)
    {
        super(dependencyContainer, connection, AccessLog, "access_log");
    }
}