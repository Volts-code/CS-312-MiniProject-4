const users = [
  {
    id: 1,
    user_id: "student",
    password: "1234",
    name: "Student User"
  }
];

let posts = [
  {
    id: 1,
    title: "Welcome to My Blog",
    body: "This is my first blog post using React and Node.js.",
    author: "student"
  },
  {
    id: 2,
    title: "Learning React",
    body: "React components make it easier to organize web applications.",
    author: "student"
  }
];

function send(res, statusCode, data) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(data));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      if (!body) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(error);
      }
    });
  });
}

module.exports = async function handler(req, res) {
  const url = new URL(req.url, "https://example.com");
  const path = url.pathname.replace(/^\/api/, "") || "/";
  const method = req.method;

  try {
    if (method === "GET" && path === "/") {
      return send(res, 200, {
        message: "Blog API is running"
      });
    }

    if (method === "POST" && path === "/signup") {
      const { user_id, password, name } = await readBody(req);
      const existingUser = users.find((user) => user.user_id === user_id);

      if (existingUser) {
        return send(res, 200, {
          success: false,
          message: "User already exists"
        });
      }

      const newUser = {
        id: Date.now(),
        user_id,
        password,
        name
      };

      users.push(newUser);
      return send(res, 200, {
        success: true,
        message: "Account created"
      });
    }

    if (method === "POST" && path === "/signin") {
      const { user_id, password } = await readBody(req);
      const user = users.find(
        (item) => item.user_id === user_id && item.password === password
      );

      if (user) {
        return send(res, 200, {
          success: true,
          user
        });
      }

      return send(res, 200, {
        success: false,
        message: "Invalid username or password"
      });
    }

    if (method === "GET" && path === "/posts") {
      return send(res, 200, posts);
    }

    const postMatch = path.match(/^\/posts\/([^/]+)$/);

    if (postMatch && method === "GET") {
      const post = posts.find((item) => item.id == postMatch[1]);

      if (!post) {
        return send(res, 404, {
          message: "Post not found"
        });
      }

      return send(res, 200, post);
    }

    if (method === "POST" && path === "/posts") {
      const { title, body, author } = await readBody(req);
      const newPost = {
        id: Date.now(),
        title,
        body,
        author
      };

      posts.push(newPost);
      return send(res, 200, {
        success: true,
        message: "Post created",
        post: newPost
      });
    }

    if (postMatch && method === "PUT") {
      const body = await readBody(req);
      const post = posts.find((item) => item.id == postMatch[1]);

      if (!post) {
        return send(res, 200, {
          success: false,
          message: "Post not found"
        });
      }

      if (post.author !== body.author) {
        return send(res, 200, {
          success: false,
          message: "You cannot edit this post"
        });
      }

      post.title = body.title;
      post.body = body.body;
      return send(res, 200, {
        success: true,
        message: "Post updated"
      });
    }

    if (postMatch && method === "DELETE") {
      const body = await readBody(req);
      const post = posts.find((item) => item.id == postMatch[1]);

      if (!post) {
        return send(res, 200, {
          success: false,
          message: "Post not found"
        });
      }

      if (post.author !== body.author) {
        return send(res, 200, {
          success: false,
          message: "You cannot delete this post"
        });
      }

      posts = posts.filter((item) => item.id != postMatch[1]);
      return send(res, 200, {
        success: true,
        message: "Post deleted"
      });
    }

    return send(res, 404, {
      message: "Route not found"
    });
  } catch (error) {
    return send(res, 400, {
      message: "Invalid request"
    });
  }
};
