import type { Request, Response } from "express";

import { PrismaClient } from "@prisma/client";
import express from "express";
import { status } from "http-status";

const prisma = new PrismaClient();
const app = express();

app.use(express.json());

const port = process.env.PORT || 8080;

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`The server is running at ${process.env.SERVER_ADDRESS} on port: ${port}`);
});

app.post(`/*`, async (req: Request, res: Response) => {
  const body = req.body;
  const feed = req.params[0];
  const id = crypto.randomUUID();
  const selfHref = `${process.env.SERVER_ADDRESS}${feed}?=${id}`;

  const results = await prisma.entry.create({
    data: {
      id,
      body,
      feed,
      selfHref,
    },
  });
  res.status(status.CREATED).json(results);
});

app.get(`/*`, async (req: Request, res: Response) => {
  const id = req.query.id;

  if (req.query.id === undefined) {
    const limit = (req.query.limit === undefined) ? process.env.LIMIT : req.query.limit;
    const skip = (req.query.skip === undefined) ? process.env.SKIP : req.query.skip;

    const results = await prisma.entry.findMany({
      skip: Number(skip),
      take: Number(limit),
      orderBy: {
        entryDate: "asc",
      },
    });

    if (results === null) {
      res.status(status.NOT_FOUND).json({ Error: "No results were found" });
    }
    else {
      res.status(status.OK).json(results);
    }
  }
  else {
    const result = await prisma.entry.findUnique({
      where: { id: String(id) },
    });

    if (result !== null) {
      res.status(status.OK).json(result);
    }
    else {
      res.status(status.NOT_FOUND).json({ Error: "The id specified was not found" });
    }
  }
});
