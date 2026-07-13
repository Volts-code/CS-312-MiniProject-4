import pool from "../db.js";

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
      if (!body) return resolve({});

      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(error);
      }
    });
  });
}

export default async function handler(req, res) {
  const url = new URL(req.url, "https://example.com");
  const path = url.pathname.replace(/^\/api/, "") || "/";
  const method = req.method;

  try {
    if (method === "GET" && path === "/") {
      return send(res, 200, {
        message: "Blog API is running"
      });
    }

    if (method === "GET" && path === "/posts") {
      const result = await pool.query(`
        SELECT
          blog_id AS id,
          title,
          body,
          creator_user_id AS author
        FROM blogs
        ORDER BY blog_id DESC
      `);

      return send(res, 200, result.rows);
    }

    if (method === "POST" && path === "/signup") {
      const { user_id, password, name } = await readBody(req);

      const existing = await pool.query(
        "SELECT user_id FROM users WHERE user_id = $1",
        [user_id]
      );

      if (existing.rows.length > 0) {
        return send(res, 200, {
          success: false,
          message: "User already exists"
        });
      }

      await pool.query(
        "INSERT INTO users (user_id, password, name) VALUES ($1, $2, $3)",
        [user_id, password, name]
      );

      return send(res, 200, {
        success: true,
        message: "Account created"
      });
    }

    if (method === "POST" && path === "/signin") {
      const { user_id, password } = await readBody(req);

      const result = await pool.query(
        "SELECT user_id, password, name FROM users WHERE user_id = $1 AND password = $2",
        [user_id, password]
      );

      if (result.rows.length > 0) {
        return send(res, 200, {
          success: true,
          user: result.rows[0]
        });
      }

      return send(res, 200, {
        success: false,
        message: "Invalid username or password"
      });
    }

    const postMatch = path.match(/^\/posts\/([^/]+)$/);

    if (postMatch && method === "GET") {
      const result = await pool.query(
        `
        SELECT
          blog_id AS id,
          title,
          body,
          creator_user_id AS author
        FROM blogs
        WHERE blog_id = $1
        `,
        [postMatch[1]]
      );

      if (result.rows.length === 0) {
        return send(res, 404, {
          message: "Post not found"
        });
      }

      return send(res, 200, result.rows[0]);
    }

    if (method === "POST" && path === "/posts") {
      const { title, body, author } = await readBody(req);

      const userResult = await pool.query(
        "SELECT name FROM users WHERE user_id = $1",
        [author]
      );

      const creatorName =
        userResult.rows.length > 0 ? userResult.rows[0].name : author;

      const result = await pool.query(
        `
        INSERT INTO blogs (creator_name, creator_user_id, title, body)
        VALUES ($1, $2, $3, $4)
        RETURNING blog_id AS id, title, body, creator_user_id AS author
        `,
        [creatorName, author, title, body]
      );

      return send(res, 200, {
        success: true,
        message: "Post created",
        post: result.rows[0]
      });
    }

    if (postMatch && method === "PUT") {
      const { title, body, author } = await readBody(req);

      const existing = await pool.query(
        "SELECT creator_user_id FROM blogs WHERE blog_id = $1",
        [postMatch[1]]
      );

      if (existing.rows.length === 0) {
        return send(res, 200, {
          success: false,
          message: "Post not found"
        });
      }

      if (existing.rows[0].creator_user_id !== author) {
        return send(res, 200, {
          success: false,
          message: "You cannot edit this post"
        });
      }

      await pool.query(
        "UPDATE blogs SET title = $1, body = $2 WHERE blog_id = $3",
        [title, body, postMatch[1]]
      );

      return send(res, 200, {
        success: true,
        message: "Post updated"
      });
    }

    if (postMatch && method === "DELETE") {
      const { author } = await readBody(req);

      const existing = await pool.query(
        "SELECT creator_user_id FROM blogs WHERE blog_id = $1",
        [postMatch[1]]
      );

      if (existing.rows.length === 0) {
        return send(res, 200, {
          success: false,
          message: "Post not found"
        });
      }

      if (existing.rows[0].creator_user_id !== author) {
        return send(res, 200, {
          success: false,
          message: "You cannot delete this post"
        });
      }

      await pool.query("DELETE FROM blogs WHERE blog_id = $1", [postMatch[1]]);

      return send(res, 200, {
        success: true,
        message: "Post deleted"
      });
    }

    return send(res, 404, {
      message: "Route not found"
    });
  } catch (error) {
    return send(res, 500, {
      message: "Server error",
      error: error.message,
      stack: error.stack
    });
  }
}
