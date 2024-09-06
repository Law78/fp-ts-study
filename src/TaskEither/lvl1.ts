import * as E from "fp-ts/lib/Either";
import * as TE from "fp-ts/lib/TaskEither";
import * as t from "io-ts";
import { pipe } from "fp-ts/lib/function";
import axios from "axios";
import { isLeft } from "fp-ts/lib/Either";

const Post = t.type({
  userId: t.number,
  id: t.number,
  title: t.string,
  body: t.string,
});

type Post = t.TypeOf<typeof Post>;

const fakeHTTPRequest = () => {
  return Promise.resolve({
    id: 1,
    nome: "Lorenzo",
  });
};

const trueHTTPRequest = async (id: number) => {
  const res = await axios.get(
    `https://jsonplaceholder.typicode.com/posts/${id}`
  );
  return res.data;
};

const fetchPost = (id: number): TE.TaskEither<Error, Post> => {
  return TE.tryCatch(
    () => trueHTTPRequest(id),
    (e: any) => new Error(e)
  );
};

const decodePost = (data: unknown): E.Either<Error, Post> => {
  const result = Post.decode(data);
  if (isLeft(result)) {
    return E.left(new Error("Decodifica errata"));
  }
  return E.right(result.right);
};

const main = (id: number) => {
  pipe(
    fetchPost(id), // ---> TaskEither<Error, Post>  --> Pere
    TE.chain(
      (
        data // ----> TaskEither<Error, number> ----< Peremangiate
      ) =>
        pipe(
          decodePost(data),
          TE.of,
          TE.map((res) => ({
            status: 200,
            data: {
              res,
              num: 100,
            },
          })),
          TE.mapLeft((e) => {
            console.log(e);
            return new Error("errore");
          })
        )
    ),
    TE.map((obj) => console.log(obj))
  )();
};

main(1);
