

class authError extends Error{
    status;
    errors;

    constructor(status,message,errors = []) {
        super(message);
        this.status = status;
        this.errors = errors;
    }

    static unauthorizedError(){
        return new authError(401,"User not authorized")
    }

    static badRequest(message, errors = []){
        return new authError(400, message, errors);
    }
}

module.exports = authError;