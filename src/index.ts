// import { readFileSync } from "fs";
// import gql from "graphql-tag";
// import { buildSubgraphSchema } from "@apollo/subgraph";
// import { ApolloServer, ContextFunction } from "@apollo/server";
// import {
//   StandaloneServerContextFunctionArgument,
//   startStandaloneServer,
// } from "@apollo/server/standalone";
// import resolvers from "./resolvers";
// import { DataSourceContext } from "./types/DataSourceContext";
// import { GraphQLError } from "graphql";
// import { addMocksToSchema } from "@graphql-tools/mock";
// import { makeExecutableSchema } from "@graphql-tools/schema";

// const port = process.env.PORT ?? "4001";
// const subgraphName = require("../package.json").name;
// const routerSecret = process.env.ROUTER_SECRET;

// import { PubSub } from "graphql-subscriptions";

// const context: ContextFunction<
//   [StandaloneServerContextFunctionArgument],
//   DataSourceContext
// > = async ({ req }) => {
//   if (routerSecret && req.headers["router-authorization"] !== routerSecret) {
//     throw new GraphQLError("Missing router authentication", {
//       extensions: {
//         code: "UNAUTHENTICATED",
//         http: { status: 401 },
//       },
//     });
//   }

//   return {
//     auth: req.headers.authorization,
//   };
// };

/*
async function main() {
  let typeDefs = gql(
    readFileSync("schema.graphql", {
      encoding: "utf-8",
    })
  );

  const schema = buildSubgraphSchema({ typeDefs, resolvers });
  const schemaWithMocks = addMocksToSchema({
    schema,
    preserveResolvers: true,
  });

  const server = new ApolloServer({
    schema: schemaWithMocks,
  });
  const { url } = await startStandaloneServer(server, {
    context,
    listen: { port: Number.parseInt(port) },
  });

  console.log(`🚀  Subgraph ${subgraphName} ready at ${url}`);
  console.log(`Run rover dev --url ${url} --name ${subgraphName}`);
}

main();
*/

import { readFileSync } from "fs";
import gql from "graphql-tag";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { createServer } from "http";
import express from "express";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import bodyParser from "body-parser";
import cors from "cors";
import resolvers from "./resolvers";
import { PubSub } from "graphql-subscriptions";
import { buildSubgraphSchema } from "@apollo/subgraph";
import { addMocksToSchema } from "@graphql-tools/mock";

async function main() {
  let typeDefs = gql(
    readFileSync("schema.graphql", {
      encoding: "utf-8",
    })
  );

  // Create the schema, which will be used separately by ApolloServer and
  // the WebSocket server.
  // const schema = makeExecutableSchema({ typeDefs, resolvers });

  const schema = buildSubgraphSchema({ typeDefs, resolvers });
  const schemaWithMocks = addMocksToSchema({
    schema,
    preserveResolvers: true,
  });

  // const server = new ApolloServer({
  //   schema: schemaWithMocks,
  // });

  const pubsub = new PubSub();

  const context = async ({ req }) => {
    return {
      auth: req.headers.authorization,
      pubsub,
    };
  };

  // Create an Express app and HTTP server; we will attach both the WebSocket
  // server and the ApolloServer to this HTTP server.
  const app = express();
  const httpServer = createServer(app);

  // Create our WebSocket server using the HTTP server we just set up.
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/graphql",
  });
  // Save the returned server's info so we can shutdown this server later
  const serverCleanup = useServer(
    {
      schema,
      context: () => {
        return { pubsub };
      },
    },
    wsServer
  );

  // Set up ApolloServer.
  const server = new ApolloServer({
    // schema,
    schema,
    plugins: [
      // Proper shutdown for the HTTP server.
      ApolloServerPluginDrainHttpServer({ httpServer }),

      // Proper shutdown for the WebSocket server.
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });

  await server.start();
  app.use(
    "/graphql",
    cors<cors.CorsRequest>(),
    bodyParser.json(),
    expressMiddleware(server, { context })
  );

  const PORT = process.env.PORT || 4001;

  // Now that our HTTP server is fully set up, we can listen to it.
  httpServer.listen(PORT, () => {
    console.log(`🚀 Query endpoint ready at http://localhost:${PORT}/graphql`);
    console.log(
      `🚀 Subscription endpoint ready at ws://localhost:${PORT}/graphql`
    );
  });
}

main();
