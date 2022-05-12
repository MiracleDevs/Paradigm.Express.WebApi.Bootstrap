export enum RoleType {
    Guest = 1,
    Developer,
    Manager,
    Admin,
    Member
}

export interface IRole {
    id: number;
    name: string;
    description: string;
}
