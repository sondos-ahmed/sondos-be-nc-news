const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const {
  topicData,
  userData,
  articleData,
  commentData,
} = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");

afterAll(() => {
  return db.end();
});

beforeEach(() => {
  return seed({ topicData, userData, articleData, commentData });
});

describe("Error Handeling", () => {
  test("GET - 404 responds with Route not found when requesting non existing page", () => {
    return request(app)
      .get("/api/nonsense")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Route not found");
      });
  });
});
describe("/api/topics", () => {
  test("GET- 200: responds with an array of objects containing slug and description properties", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const { topics } = body;
        expect(topics.length).toBe(3);
        expect(topics).toBeInstanceOf(Array);
        topics.forEach((topic) => {
          expect(topic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
});

describe("/api/articles", () => {
  test("GET- 200: responds with an array of objects. each object proprties should be author,title,article_id,topic, created at, votes and comment_count", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        const expected = [
          "author",
          "title",
          "article_id",
          "topic",
          "created_at",
          "votes",
          "comment_count",
        ];
        expect(articles.length).toBe(12);
        expect(articles).toBeInstanceOf(Array);
        articles.forEach((article) => {
          expect(Object.keys(article)).toEqual(expected);
        });
      });
  });

  test("GET- 200: responds with an array of objects sorted by date in descending order ", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("created_at", { descending: true });
      });
  });
});
describe("/api/articles/:article_id", () => {
  test("GET - 200: responds with an object of the corresponding id ", () => {
    return request(app)
      .get("/api/articles/5")
      .expect(200)
      .then(({ body }) => {
        const article = body.article;

        expect(article).toEqual({
          article_id: 5,
          title: "UNCOVERED: catspiracy to bring down democracy",
          topic: "cats",
          author: "rogersop",
          body: "Bastet walks amongst us, and the cats are taking arms!",
          created_at: "2020-08-03T13:14:00.000Z",
          votes: 0,
        });
      });
  });

  test("GET - 400: responds with bad request when query with invalid id.", () => {
    return request(app)
      .get("/api/articles/fakedata")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Bad request");
      });
  });
});

describe("/api/articles/:article_id/comments", () => {
  test("GET - 200: responds with an array of comments objects for the specified article id ", () => {
    return request(app)
      .get("/api/articles/9/comments")
      .expect(200)
      .then(({ body }) => {
        // Check the number of comments for article_id 9.
        expect(body.comments).toHaveLength(2);

        // Sorted by the most recent comments first.
        expect(body.comments).toBeSortedBy("created_at");

        // Check object properties.
        body.comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
          });
        });
      });
  });

  test("GET - 200: responds with empty array if there isn't any comment on the specified article", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toEqual([]);
      });
  });

  test("GET - 400: responds an error of bad request", () => {
    return request(app)
      .get("/api/articles/article/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toEqual("Bad request");
      });
  });
  test("GET - 404: responds an error route not found", () => {
    return request(app)
      .get("/api/articles/2000/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toEqual("Route not found");
      });
  });

  test("POST - 201: resoponds with created object", () => {
    const newComment = {
      author: "icellusedkars",
      body: "This is a new comment for icellusedkars user",
    };
    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toMatchObject({
          comment_id: expect.any(Number),
          article_id: 2,
          created_at: expect.any(String),
          votes: 0,
          ...newComment,
        });
      });
  });

  test("POST - 400: responds with an error of user not found", () => {
    const newComment = {
      author: "sondos",
      body: "This is a new comment for sondos user",
    };
    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("User not found");
      });
  });

  test("POST - 400: responds with an error when passed an empty body", () => {
    const newComment = {
      author: "icellusedkars",
      body: "",
    };
    return request(app)
      .post("/api/articles/3/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Bad request");
      });
  });
  // This error can work with User not found, but I want it to be bad request if invalid user data.
  test("POST - 400: responds with an error when passed an empty user", () => {
    const newComment = {
      author: " ",
      body: "Any body to fulfill this test",
    };
    return request(app)
      .post("/api/articles/3/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Bad request");
      });
  });

  test("POST - 404: responds with an error of route not found", () => {
    return request(app)
      .post("/api/articles/2000/comments")
      .send({ author: "test", body: "try different test to fil the gap." })
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Route not found");
      });
  });

  test("POST - 400: responds with an error of bad request", () => {
    return request(app)
      .post("/api/articles/banana/comments")
      .send({})
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Bad request");
      });
  });
});

// describe("", () => {
//   test("", () => {});
// });
//describe("",()=>{test("",()=>{})});
