import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { db } from "../../infra/database/client.ts";
import { z } from "zod";
import { tasks } from "../../infra/database/schemas.ts";
import { eq, and, type SQL } from "drizzle-orm";

export const deleteTask: FastifyPluginAsyncZod = async (server) => {
  server.delete(
    "/task/:id",
    {
      schema: {
        params: z.object({
          id: z.string(),
        }),
      },
    },
    async (request, reply) => {
      const { id } = request.params;

        try {
          
        const task = await db.select().from(tasks).where(eq(tasks.id, Number(id)));

        if (task.length === 0) {
          return reply.status(404).send({
            error: "No task found",
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
