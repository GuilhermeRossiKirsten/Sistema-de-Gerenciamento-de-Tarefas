import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { db } from "../../infra/database/client.ts";
import { z } from "zod";
import { tasks } from "../../infra/database/schemas.ts";
import { eq } from "drizzle-orm";

const TaskStatus = ["pending", "in_progress", "completed"] as const;

export const updateTask: FastifyPluginAsyncZod = async (server) => {
  server.put(
    "/task/:id",
    {
      schema: {
        params: z.object({
          id: z.string(),
        }),
        body: z.object({
          title: z.string().optional(),
          description: z.string().optional(),
          status: z.enum(TaskStatus).optional(),
        }),
      },
    },
    async (request, reply) => {
      const { id } = request.params;
      const { title, description, status } = request.body;

      try {
        const [existingTask] = await db
          .select()
          .from(tasks)
          .where(eq(tasks.id, Number(id)));

        if (!existingTask) {
          return reply.status(404).send({ message: "Task not found." });
        }

        await db
          .update(tasks)
          .set({
            ...(title && { title }),
            ...(description && { description }),
            ...(status && { status }),
            updated_at: new Date(),
          })
          .where(eq(tasks.id, Number(id)));

        return reply
          .status(200)
          .send({ message: "Task updated successfully." });
      } catch (error) {
        console.error(error);
        return reply.status(500).send({ message: "Internal Server Error." });
      }
    }
  );
};
