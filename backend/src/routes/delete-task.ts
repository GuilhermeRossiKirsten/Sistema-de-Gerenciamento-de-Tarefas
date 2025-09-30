import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { db } from "../../infra/database/client.ts";
import { z } from "zod";
import { tasks } from "../../infra/database/schemas.ts";
import { eq } from "drizzle-orm";
import { csrfProtection } from "../hooks/check-csrf.ts";

export const deleteTask: FastifyPluginAsyncZod = async (server) => {
  server.delete(
    "/task/:id",
    {
      preHandler: [csrfProtection],
      schema: {
        tags: ["Tasks_API"],
        summary: "delete a task",
        params: z.object({
          id: z.string(),
        }),
        response: {
          200: z.object({ message: z.string() }),
          404: z.object({ message: z.string() }),
          500: z.object({ error: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;

      try {
        const task = await db
          .select()
          .from(tasks)
          .where(eq(tasks.id, Number(id)));

        if (task.length === 0) {
          return reply.status(404).send({
            message: "No task found",
          });
        }

        await db.delete(tasks).where(eq(tasks.id, Number(id)));

        return reply
          .status(200)
          .send({ message: "Task deleted successfully." });
      } catch {
        return reply.status(500).send({ error: "Internal Server Error" });
      }
    }
  );
};
