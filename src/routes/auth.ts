import { FastifyInstance } from "fastify";
import bcrypt from "bcrypt";
import { db } from "../db.js";

export default async function (app: FastifyInstance) {
  app.post("/register", async (req, reply) => {
    const { username, password } = req.body as any;
    
    if (!username || !password) {
      return reply.status(400).send({
        error: "Username and password required!"
      });
    }

    const hash = await bcrypt.hash(password, 10);

    try {
      const result = await db.query(
        `INSERT INTO users (username, password_hash)
        VALUES ($1, $2)
        RETURNING id, username`,
        [username, hash]
      );

      return result.rows[0];
    } catch (err: any) {
      if (err.code === "23505") {
        return reply.status(400).send({
          error: "Username already exists!"
        });
      }
      throw err;
    }
  });

  app.post("/login", async (req, reply) => {
    const { username, password } = req.body as any;

    if (!username || !password) {
      return reply.status(400).send({
        error: "Username and password required!"
      });
    }

    const result = await db.query(
      `SELECT * FROM users WHERE username=$1`,
      [username]
    );

    const user = result.rows[0];

    if (!user) {
      return reply.status(401).send({
        error: "Invalid creds!"
      });
    }

    const valid = await bcrypt.compare(password, user.password_hash);

    if (!valid) {
      return reply.status(401).send({
        error: "Invalid creds!"
      });
    }

    return {
      user_id: user.id,
      username: user.username
    };
  });
}
