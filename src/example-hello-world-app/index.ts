import fastify from "fastify";
import fastifyView from "@fastify/view";
import ejs from "ejs";

const { ADDRESS = "localhost", PORT = "3000" } = process.env;

const server = fastify({
  logger: true,
});

server.register(fastifyView, {
  engine: {
    ejs,
  },
});

server.get("/", (_, reply) => {
  reply.view("index.ejs", { text: "text" });
});

server.listen({ host: ADDRESS, port: parseInt(PORT, 10) }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  console.log(`Server listening at ${address}`);
});
