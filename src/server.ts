import Fastify from "fastify";
import cors from "@fastify/cors";
import messageRoutes from "./routes/messages.js";
import searchRoutes from "./routes/search.js";
import userRoutes from "./routes/users.js";
import conversationRoutes from "./routes/conversations.js";

const app = Fastify({ logger: true });

await app.register(cors, {
  origin: true,
});

app.register(messageRoutes);
app.register(searchRoutes);
app.register(userRoutes);
app.register(conversationRoutes);

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
