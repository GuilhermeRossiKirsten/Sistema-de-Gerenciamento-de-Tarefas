import { db } from "../../infra/database/client.ts";
import type { FastifyRequest, FastifyReply } from "fastify";
import { and, eq } from "drizzle-orm";
import { csrf_tokens } from "../../infra/database/schemas.ts";

const TOKEN_EXPIRATION_MS = 5 * 60 * 1000; // 5 minutos

export async function csrfProtection(
  request: FastifyRequest,
  reply: FastifyReply
) {
  // Pegar token do header ou body
  const token =
    (request.headers["x-csrf-token"] as string | undefined) ||
    (request.body as any)?.csrfToken;
  const userId =
    (request.body as any)?.user_id || Number(request.headers["x-user-id"]);

  if (!token || !userId) {
    return reply.status(403).send({ error: "CSRF token missing" });
  }

  const existingToken = await db
    .select()
    .from(csrf_tokens)
    .where(
      and(eq(csrf_tokens.user_id, Number(userId)), eq(csrf_tokens.token, token))
    );

  if (existingToken.length === 0) {
    return reply.status(403).send({ error: "Invalid CSRF token" });
  }

  const createdAt = existingToken[0].created_at;
  if (
    !createdAt ||
    new Date().getTime() - new Date(createdAt).getTime() > TOKEN_EXPIRATION_MS
  ) {
    // Token expirado → remove do banco
    await db.delete(csrf_tokens).where(eq(csrf_tokens.id, existingToken[0].id));
    return reply.status(403).send({ error: "CSRF token expired" });
  }

  // Se chegar aqui, token válido → permite a rota
}
