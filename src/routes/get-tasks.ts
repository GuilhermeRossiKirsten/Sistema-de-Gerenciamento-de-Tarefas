import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { db } from "../../infra/database/client.ts";
import { z } from "zod";
import { tasks } from "../../infra/database/schemas.ts";
import { eq, and, type SQL } from "drizzle-orm";
import { csrfProtection } from "../hooks/check-csrf.ts";

export const getTasks: FastifyPluginAsyncZod = async (server) => {
  server.get(
    "/tasks",
    {
      preHandler: [csrfProtection],
      schema: {
        querystring: z.object({
          user_id: z.string().optional(),
        }),
      },
    },
    async (request, reply) => {
      const { user_id } = request.query;
      console.log(user_id);
      const conditions: SQL[] = [];

      if (user_id) {
        conditions.push(eq(tasks.user_id, Number(user_id))); // número
      }
      try {
        const [result, total] = await await Promise.all([
          db
            .select()
            .from(tasks)
            .where(and(...conditions)),
          db.$count(tasks, and(...conditions)),
        ]);

        return reply.status(200).send({ tasks: result, total });
      } catch {
        return reply.status(500).send({ error: "Internal Server Error" });
      }
    }
  );
};
