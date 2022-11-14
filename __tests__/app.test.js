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
