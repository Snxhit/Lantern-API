import Fastify from "fastify";
import messageRoutes from "./routes/messages.js";
import searchRoutes from "./routes/search.js";

const app = Fastify({ logger: true });

app.register(messageRoutes);
app.register(searchRoutes);

async function start() {
  try {
    await app.listen({ port: 9393 });
    console.log("Server running on 9393!");
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

start();
