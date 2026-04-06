import { FastifyInstance } from "fastify";
import { db } from "../db.js";

export default async function (app: FastifyInstance) {
  app.get("/users/:userId", async (req) => {
    const { userId } = req.params as any;

    const result = await db.query(
      `SELECT id, username FROM users
      WHERE id = $1`,
      [userId]
    );

    return result.rows[0];
  });
  app.get("/userList/:userId", async (req) => {
    const { userId } = req.params as any;

    const result = await db.query(
      `SELECT id, username FROM users
      WHERE id != $1
      ORDER BY username ASC`,
      [userId]
    );

    return result.rows;
  });
}
