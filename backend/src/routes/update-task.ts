import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { db } from "../../infra/database/client.ts";
import { z } from "zod";
import { tasks } from "../../infra/database/schemas.ts";
import { eq } from "drizzle-orm";
import { csrfProtection } from "../hooks/check-csrf.ts";

const TaskStatus = ["pending", "in_progress", "completed"] as const;

export const updateTask: FastifyPluginAsyncZod = async (server) => {
  server.patch(
    "/task/:id",
    {
      preHandler: [csrfProtection],
      schema: {
        tags: ["Tasks_API"],
        summary: "Update a task",
        params: z.object({
          id: z.string(),
        }),
        body: z.object({
          title: z.string().optional(),
          description: z.string().optional(),
          status: z.enum(TaskStatus).optional(),
        }),
        response: {
          200: z.object({
            message: z.string(),
          }),
          404: z.object({ message: z.string() }),
          500: z.object({ error: z.string() }),
        },
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
        return reply.status(500).send({ error: "Internal Server Error." });
      }
    }
  );
};
