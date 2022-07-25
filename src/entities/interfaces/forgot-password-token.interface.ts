export interface IForgotPasswordToken {
    id: number;
    userName: string;
    roleId: string;
    token: string;
    active: boolean;
    creationDate: Date;
}
