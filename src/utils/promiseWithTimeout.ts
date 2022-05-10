export const promiseWithTimeout = async <T>(timeoutMs: number, promise: () => Promise<T>, failureMessage?: string) => {
    let timeoutHandle: NodeJS.Timeout;

    const timeoutPromise = new Promise<any>((resolve, reject) => {
        timeoutHandle = setTimeout(() => resolve({ success: false, error: failureMessage || "TimedOut" }), timeoutMs);
    });

    return Promise.race([promise(), timeoutPromise]).then(result => {
        clearTimeout(timeoutHandle);
        return result;
    });
};
