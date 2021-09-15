import http from 'http';
import fs from 'fs';
import path from 'path';

import dotenv from 'dotenv';

import posts from './posts.json';

dotenv.config();

const {PORT,HOST} = process.env;

function saveUser(newPost) {
    const totalPosts = posts.length;
    
    newPost.id = totalPosts + 1;

    posts.push(newPost);

    fs.writeFile(path.join(__dirname,'posts.json'),JSON.stringify(posts), (error) => {
        if(error)
        {
            console.log('Something went wrong');
        }
        else
        {
            console.log('New Post has been created successfully... ');
        }
    });
};


const server = http.createServer((req,res) => {

    if(req.url === '/' && req.method === 'GET')
    {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
       
        res.end(JSON.stringify(posts));
    }
    else if(req.url === '/newpost' && req.method === 'POST')
    {
        const body = [];

        req.on('data', (chunk) => {

            body.push(chunk);

        });

        req.on('end', () => {

            const user = Buffer.concat(body).toString();

            saveUser(JSON.parse(user));

            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.end(user);
        });
    };
});

server.listen(PORT, () => {
    console.log(`Server is connected at ${HOST}:${PORT}`);
});