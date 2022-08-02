import authError from "../../exceptions/authError";

describe("Testing exception authError", ()=> {
    test("Throwing unauthorizedError", ()=> {
       try {
           throw authError.unauthorizedError();
       } catch (error: unknown | any) {
           expect(error.status).toEqual(401);
           expect(error.message).toEqual("User not authorized");
       }
    });
    test("Throwing badRequest", ()=> {
        try {
            throw authError.badRequest("Bad request",["Its bad", "Its just a test"]);
        } catch (error: unknown | any) {
            expect(error.status).toEqual(400);
            expect(error.message).toEqual("Bad request");
            expect(error.errors).toEqual(["Its bad", "Its just a test"]);
        }
    });
});