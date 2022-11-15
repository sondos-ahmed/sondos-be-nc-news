\c nc_news_test

  -- SELECT articles.author,articles.title,articles.article_id ,articles.topic,articles.created_at,articles.votes, COUNT(comments.article_id) AS comment_count FROM articles JOIN  users ON articles.author=users.username
  -- LEFT JOIN comments ON articles.article_id=comments.article_id
  -- GROUP BY comments.article_id, articles.article_id
  -- ORDER BY articles.created_at DESC
  -- ;

  -- SELECT * FROM comments WHERE article_id=9;


  INSERT INTO comments (article_id,author,body) VALUES 
  
  (2,'icellusedkars','kjlklkjlk')  RETURNING body;