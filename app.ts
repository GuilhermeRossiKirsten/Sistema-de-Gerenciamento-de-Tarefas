import fastify from "fastify";

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
});

//Criar nova tarefa
//POST

//Listar todas as tarefas
//GET

//Atualizar tarefa existente
//PUT

//Excluir tarefa
//DELETE

//TESTE
server.get("/", function (request, reply) {
  request.log.info("Teste logs");
  reply.send({ hello: "world" });
});

export { server };
