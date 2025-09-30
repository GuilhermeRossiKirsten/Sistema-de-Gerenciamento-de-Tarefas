import fastify from "fastify";
import {
  validatorCompiler,
  serializerCompiler,
  type ZodTypeProvider,
  jsonSchemaTransform,
} from "fastify-type-provider-zod";

import { createNewTask } from "./routes/create-new-task.ts";
import { getTasks } from "./routes/get-tasks.ts";
import { deleteTask } from "./routes/delete-task.ts";
import { updateTask } from "./routes/update-task.ts";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";

const server = fastify({
  logger: {
    transport: {
      targets: [
        {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "HH:MM:ss Z",
            ignore: "pid,hostname",
          },
          level: "info",
        },
      ],
    },
  },
}).withTypeProvider<ZodTypeProvider>();

server.register(fastifySwagger, {
  openapi: {
    info: {
      title: "Tasks API",
      version: "1.0.0",
    },
  },
  transform: jsonSchemaTransform,
});

server.register(fastifySwaggerUi, { routePrefix: "/docs" });

server.setValidatorCompiler(validatorCompiler);
server.setSerializerCompiler(serializerCompiler);

//Criar nova tarefa
//POST
server.register(createNewTask);

//Listar todas as tarefas
//GET
server.register(getTasks);

//Atualizar tarefa existente
//PUT
server.register(updateTask);

//Excluir tarefa
//DELETE
server.register(deleteTask);

//TESTE
server.get("/", function (request, reply) {
  request.log.info("Teste logs");
  reply.send({ hello: "world" });
});

export { server };
