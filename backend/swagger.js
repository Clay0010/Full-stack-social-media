// swagger.js
import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    title: "Social Media API",
    description: "Auto-generated Swagger documentation",
  },
  host: "localhost:3000",
  schemes: ["http"],
};

const outputFile = "./swagger.json"; // will be generated here
const endpointsFiles = ["./src/server.js"]; // or wherever your routes start

swaggerAutogen()(outputFile, endpointsFiles, doc);
