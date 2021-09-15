import http from 'http';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

import posts from './posts.json';

dotenv.config();

const { PORT, HOST } = process.env;

function savePost(newPost) {
  const totalPosts = posts.length;
  newPost.id = totalPosts + 1;

  posts.push(newPost);

  fs.writeFile(
    path.join(__dirname, 'posts.json'),
    JSON.stringify(posts),
    (error) => {
      if (error) {
        console.log('Something went wrong');
      } else {
        console.log('New Post has been created successfully... ');
      }
    }
  );
}

const handlePosts = (req, res) => {
  if (req.url === '/posts' && req.method === 'GET') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');

    res.end(JSON.stringify(posts));
  } else if (req.url === '/post' && req.method === 'POST') {
    const body = [];

    req.on('data', (chunk) => {
      body.push(chunk);
    });
    req.on('end', () => {
      const user = Buffer.concat(body).toString();

      const check = JSON.parse(user);

      if (!check.userId) {
        res.statusCode = 206;
        return res.end('UserId not found');
      }
      const duplicatePost = posts.filter((post) => post.userId === check.userId);

      if (duplicatePost.length !== 0) {
        res.statusCode = 400;
        return res.end('UserId already exists');
      }
      savePost(JSON.parse(user));
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(user);
    });
  }
};

const server = http.createServer(handlePosts);

server.listen(PORT, () => {
  console.log(`Server is connected at ${HOST}:${PORT}`);
});
