import { server } from "./app.ts";

server
  .listen({ port: 3000, host: "0.0.0.0" })
  .then(() => console.log("Server on 3000."))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
