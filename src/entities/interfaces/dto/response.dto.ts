export interface ResponseDTO<T> {
    success: boolean;
    message: string;
    response: T;
}
