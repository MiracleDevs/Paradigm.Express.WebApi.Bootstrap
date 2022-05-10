export interface IAccessLog {
    id: number;
    method: string;
    message: string;
    json: string;
    type: number;
    creationDate: Date;
    active: boolean;
    processId: string;
}