import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";

import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";

import { connectDB } from "./config/db.js";
import User from "./models/User.js";
import { typeDefs } from "./graphql/typeDefs.js";
import { resolvers } from "./graphql/resolvers.js";
import uploadRoutes from "./routes/upload.routes.js";
import { connectRedis } from "./config/redis.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5002;

await connectDB();
await connectRedis();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

app.use(cookieParser());
app.use(express.json());

app.use("/api/uploads", uploadRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "SkillTrack GraphQL API running",
  });
});

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
});

await apolloServer.start();

app.use(
  "/graphql",
  expressMiddleware(apolloServer, {
    context: async ({ req, res }) => {
      let user = null;

      const token = req.cookies.token;

      if (token) {
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          user = await User.findById(decoded.userId).select("-password");
        } catch (error) {
          user = null;
        }
      }

      return {
        req,
        res,
        user,
      };
    },
  }),
);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`GraphQL endpoint: http://localhost:${PORT}/graphql`);
});
