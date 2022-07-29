import swaggerJSDoc from "swagger-jsdoc";

const options: swaggerJSDoc.Options = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            title: "Auth API",
            version: "1.0.0",
            description: "Endpoints for API",
            contact: {
                name: "Alexandr Sadykov",
                email: "chakachakovich@gmail.com"
            },
            license: {
                name: "Apache 2.0",
                url: "http://apache.org/"
            }
        },
        servers: [
            {
                url: "http://localhost:5000/auth",
                description: "This local server"
            },
        ],
        basePath: "/api",
        host: "localhost:" + process.env.PORT,
        schemes: ["http", "https"],
        consumes: ["application/json"],
        produces: ["application/json"],
        externalDocs: {
            description: "More info on github page",
            url: "https://github.com/l1msn/auth-ts"
        }
    },
    apis: ["./src/server/routes/index.ts", "./src/server/models/*.ts"]
}

export default options;

