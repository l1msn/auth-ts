class AuthError extends Error{
    status: number;
    errors: string[];

    constructor(status: number, message: string, errors: string[] = []) {
        super(message);
        this.status = status;
        this.errors = errors;
    }

    static unauthorizedError(): AuthError{
        return new AuthError(401,"User not authorized")
    }

    static badRequest(message: string, errors: string[] = []): AuthError{
        return new AuthError(400, message, errors);
    }
}

export default AuthError;