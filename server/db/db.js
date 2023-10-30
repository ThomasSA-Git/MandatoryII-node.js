import faunadb from "faunadb";

const q = faunadb.query;

import dotenv from "dotenv";
dotenv.config();

const client = new faunadb.Client({ secret: process.env.DBAPI });

export async function createUser(username, email, hashedPassword) {
  const result = await client.query(
    q.Create(q.Collection(process.env.COLLECTIONNAME), {
      data: { username, email, password: hashedPassword },
    })
  );
  return result;
}

export async function findUserByUsername(username) {
  const result = await client.query(
    q.Get(q.Match(q.Index('users_by_username'), username))
  );
  return result.data;
}