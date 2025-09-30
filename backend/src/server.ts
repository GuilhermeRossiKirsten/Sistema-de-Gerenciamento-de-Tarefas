import { server } from "./app.ts";
import { db } from "../infra/database/client.ts";
import crypto from "crypto";
import { z } from "zod";
import type { FastifyReply, FastifyRequest } from "fastify";
import { csrf_tokens } from "../infra/database/schemas.ts";
import { desc, and, eq } from "drizzle-orm";


// -------------------------
// GET /csrf-token/:user_id
// -------------------------
const TOKEN_EXPIRATION_MS = 5 * 60 * 1000; // 5 minutos

server.get(
  "/csrf-token/:user_id",
  async (request: FastifyRequest, reply: FastifyReply) => {
    const paramsSchema = z.object({
      user_id: z.string(),
    });

    const { user_id } = paramsSchema.parse(request.params);
    const userIdNum = Number(user_id);

    try {
      // Verificar se já existe token válido
      const existingToken = await db
        .select()
        .from(csrf_tokens)
        .where(eq(csrf_tokens.user_id, userIdNum))
        .orderBy(desc(csrf_tokens.created_at))
        .limit(1);

      const now = new Date();

      if (existingToken.length > 0) {
        const createdAt = existingToken[0].created_at;

        if (!createdAt) {
          // Se por algum motivo estiver null, gera um novo token
        } else {
          const tokenAge = now.getTime() - new Date(createdAt).getTime();

          if (tokenAge < TOKEN_EXPIRATION_MS) {
            // Retorna token existente
            return reply
              .status(200)
              .send({ csrfToken: existingToken[0].token });
          } else {
            // Expirou → remover token antigo
            await db
              .delete(csrf_tokens)
              .where(eq(csrf_tokens.id, existingToken[0].id));
          }
        }
      }


      // Gerar novo token
      const token = crypto.randomBytes(32).toString("hex");

      await db.insert(csrf_tokens).values({
        user_id: userIdNum,
        token,
      });

      return reply.status(200).send({ csrfToken: token });
    } catch (err) {
      console.error(err);
      return reply.status(500).send({ error: "Failed to generate CSRF token" });
    }
  }
);

server
  .listen({ port: 3000, host: "0.0.0.0" })
  .then(() => console.log("Server on 3000."))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
