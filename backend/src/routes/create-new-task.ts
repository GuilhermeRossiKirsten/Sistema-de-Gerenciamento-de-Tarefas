import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { db } from "../../infra/database/client.ts";
import { z } from "zod";
import { tasks } from "../../infra/database/schemas.ts";
import { eq, and } from "drizzle-orm";
import { csrfProtection } from "../hooks/check-csrf.ts";

const TaskStatus = ["pending", "in_progress", "completed"] as const;

export const createNewTask: FastifyPluginAsyncZod = async (server) => {
  server.post(
    "/task",
    {
      preHandler: [csrfProtection],
      schema: {
        tags: ["Tasks_API"],
        summary: "Create new task",
        body: z.object({
          user_id: z.number(),
          title: z.string(),
          description: z.string(),
          status: z.enum(TaskStatus),
        }),
        response: {
          201: z.object({ message: z.string() }),
          400: z.object({ error: z.string() }),
          409: z.object({ error: z.string() }),
          500: z.object({ error: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const { user_id, title, description, status } = request.body;

      if (!user_id || !title || !description) {
        return reply.status(400).send({
          error: "user_id, title and description are required.",
        });
      }

      try {
        const alreadyExist = await db
          .select()
          .from(tasks)
          .where(and(eq(tasks.user_id, user_id), eq(tasks.title, title)));

        if (alreadyExist.length > 0) {
          return reply.status(409).send({ error: "Tasks already exist" });
        }

        await db
          .insert(tasks)
          .values({ title, description, user_id, status: status ?? "" });
        return reply.status(201).send({ message: "Task created" });
      } catch {
        return reply.status(500).send({ error: "Internal Server Error" });
      }
    }
  );
};
