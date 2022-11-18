# News Articles API

This repo create the backend functionalities of news articles app. It service different endpoints to search in the database. This repo gives the ability to list the articles,article comments, add comments, get all users in the database, which they are the author for each comment. You can find a description of each point in endpoints.json.

The link for this API can be found here:

https://helpful-foal-tie.cyclic.app/

# Set up

To set up locally, you will need to:

- Clone the repository
- Install dependencies using npm install
- Configure .env files for development and test (see below for more detail).
- Setup your databases using npm run seed-prod
- Run tests using npm test

## Create environments variables

Once you have cloned this repo create .env files to store the database names in testing and development environments:

- create .env.test file and .env.development file.
- add PGDATABASE=nc_news environment variable to develompent file.
- add PGDATABASE=nc_news_test environment variable to test file.

# Minimum system requirements

Minimum versions: Please use Node.js version 18 or above and Postgres version 14 or above
