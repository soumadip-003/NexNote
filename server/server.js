
const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
const { promisify } = require("util");
const db = require("./database/db");

const app = express();
const PORT = process.env.PORT || 3100;
const scrypt = promisify(crypto.scrypt);
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000;

app.use(cors());
app.use(express.json({ limit: "100kb" }));

function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

async function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = await scrypt(password, salt, 64);
  return `${salt}:${derivedKey.toString("hex")}`;
}

async function verifyPassword(password, storedHash) {
  if (typeof storedHash !== "string") return false;

  const [salt, keyHex] = storedHash.split(":");

  if (!salt || !keyHex || !/^[a-f0-9]{128}$/i.test(keyHex)) {
    return false;
  }

  const derivedKey = await scrypt(password, salt, 64);
  const savedKey = Buffer.from(keyHex, "hex");

  return (
    savedKey.length === derivedKey.length &&
    crypto.timingSafeEqual(savedKey, derivedKey)
  );
}

function createSession(userId) {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = Date.now() + SESSION_DURATION;

  db.prepare(`
    INSERT INTO sessions (user_id, token_hash, expires_at)
    VALUES (?, ?, ?)
  `).run(userId, hashToken(token), expiresAt);

  return { token, expiresAt };
}

function requireAuth(req, res, next) {
  const authorization = req.get("authorization") || "";
  const match = authorization.match(/^Bearer ([a-f0-9]{64})$/i);

  if (!match) {
    return res.status(401).json({
      success: false,
      message: "Please log in to continue.",
    });
  }

  try {
    const tokenHash = hashToken(match[1]);

    const session = db.prepare(`
      SELECT
        sessions.id AS session_id,
        users.id AS user_id,
        users.name,
        users.email
      FROM sessions
      JOIN users ON users.id = sessions.user_id
      WHERE sessions.token_hash = ?
        AND sessions.expires_at > ?
    `).get(tokenHash, Date.now());

    if (!session) {
      return res.status(401).json({
        success: false,
        message: "Your session has expired. Please log in again.",
      });
    }

    req.user = {
      id: session.user_id,
      name: session.name,
      email: session.email,
    };

    req.sessionId = session.session_id;
    next();
  } catch (error) {
    console.error("Authentication error:", error);

    return res.status(500).json({
      success: false,
      message: "Could not verify your session.",
    });
  }
}

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "NexNote API is running",
  });
});

// Register
app.post("/api/auth/signup", async (req, res) => {
  try {
    const name =
      typeof req.body.name === "string" ? req.body.name.trim() : "";

    const email =
      typeof req.body.email === "string"
        ? req.body.email.trim().toLowerCase()
        : "";

    const password =
      typeof req.body.password === "string" ? req.body.password : "";

    if (name.length < 2 || name.length > 80) {
      return res.status(400).json({
        success: false,
        message: "Name must be between 2 and 80 characters.",
      });
    }

    if (
      email.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    if (password.length < 8 || password.length > 128) {
      return res.status(400).json({
        success: false,
        message: "Password must be between 8 and 128 characters.",
      });
    }

    const existing = db
      .prepare("SELECT id FROM users WHERE email = ?")
      .get(email);

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    const passwordHash = await hashPassword(password);

    const register = db.transaction(() => {
      const result = db.prepare(`
        INSERT INTO users (name, email, password_hash)
        VALUES (?, ?, ?)
      `).run(name, email, passwordHash);

      const userId = Number(result.lastInsertRowid);

      const userCount = db.prepare(
        "SELECT COUNT(*) AS count FROM users"
      ).get().count;

      // Preserve legacy notes for the first registered user.
      if (userCount === 1) {
        db.prepare(
          "UPDATE notes SET user_id = ? WHERE user_id IS NULL"
        ).run(userId);
      }

      return userId;
    });

    const userId = register();
    const session = createSession(userId);

    return res.status(201).json({
      success: true,
      message: "Account created successfully.",
      token: session.token,
      expiresAt: session.expiresAt,
      user: { id: userId, name, email },
    });
  } catch (error) {
    if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    console.error("Signup error:", error);

    return res.status(500).json({
      success: false,
      message: "Could not create your account.",
    });
  }
});

// Login
app.post("/api/auth/login", async (req, res) => {
  try {
    const email =
      typeof req.body.email === "string"
        ? req.body.email.trim().toLowerCase()
        : "";

    const password =
      typeof req.body.password === "string" ? req.body.password : "";

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const user = db.prepare(`
      SELECT id, name, email, password_hash
      FROM users
      WHERE email = ?
    `).get(email);

    if (!user || !(await verifyPassword(password, user.password_hash))) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const session = createSession(user.id);

    return res.json({
      success: true,
      message: "Logged in successfully.",
      token: session.token,
      expiresAt: session.expiresAt,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Could not log in.",
    });
  }
});

// Get current user
app.get("/api/auth/me", requireAuth, (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});

// Update account name and email
app.patch("/api/auth/profile", requireAuth, (req, res) => {
  try {
    const name =
      typeof req.body.name === "string" ? req.body.name.trim() : "";

    const email =
      typeof req.body.email === "string"
        ? req.body.email.trim().toLowerCase()
        : "";

    if (name.length < 2 || name.length > 80) {
      return res.status(400).json({
        success: false,
        message: "Name must be between 2 and 80 characters.",
      });
    }

    if (
      email.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    const existing = db.prepare(`
      SELECT id
      FROM users
      WHERE email = ? AND id != ?
    `).get(email, req.user.id);

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "That email address is already in use.",
      });
    }

    db.prepare(`
      UPDATE users
      SET name = ?, email = ?
      WHERE id = ?
    `).run(name, email, req.user.id);

    return res.json({
      success: true,
      message: "Account details updated successfully.",
      user: {
        id: req.user.id,
        name,
        email,
      },
    });
  } catch (error) {
    if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return res.status(409).json({
        success: false,
        message: "That email address is already in use.",
      });
    }

    console.error("Profile update error:", error);

    return res.status(500).json({
      success: false,
      message: "Could not update your profile.",
    });
  }
});

// Change password; keep current session and revoke other sessions.
app.patch("/api/auth/password", requireAuth, async (req, res) => {
  try {
    const currentPassword =
      typeof req.body.currentPassword === "string"
        ? req.body.currentPassword
        : "";

    const newPassword =
      typeof req.body.newPassword === "string"
        ? req.body.newPassword
        : "";

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current and new passwords are required.",
      });
    }

    if (newPassword.length < 8 || newPassword.length > 128) {
      return res.status(400).json({
        success: false,
        message: "New password must be between 8 and 128 characters.",
      });
    }

    if (currentPassword === newPassword) {
      return res.status(400).json({
        success: false,
        message: "Choose a password different from your current password.",
      });
    }

    const user = db.prepare(`
      SELECT password_hash
      FROM users
      WHERE id = ?
    `).get(req.user.id);

    if (
      !user ||
      !(await verifyPassword(currentPassword, user.password_hash))
    ) {
      return res.status(400).json({
        success: false,
        message: "Your current password is incorrect.",
      });
    }

    const newHash = await hashPassword(newPassword);

    const updatePassword = db.transaction(() => {
      db.prepare(`
        UPDATE users
        SET password_hash = ?
        WHERE id = ?
      `).run(newHash, req.user.id);

      db.prepare(`
        DELETE FROM sessions
        WHERE user_id = ? AND id != ?
      `).run(req.user.id, req.sessionId);
    });

    updatePassword();

    return res.json({
      success: true,
      message: "Password changed successfully. Other sessions were signed out.",
    });
  } catch (error) {
    console.error("Password change error:", error);

    return res.status(500).json({
      success: false,
      message: "Could not change your password.",
    });
  }
});

// Logout current session
app.post("/api/auth/logout", requireAuth, (req, res) => {
  db.prepare("DELETE FROM sessions WHERE id = ?").run(req.sessionId);

  res.json({
    success: true,
    message: "Logged out successfully.",
  });
});

// All notes routes require authentication.
app.use("/api/notes", requireAuth);

// Fetch current user's notes
app.get("/api/notes", (req, res) => {
  try {
    const search = String(req.query.search || "").trim();

    const notes = search
      ? db.prepare(`
          SELECT *
          FROM notes
          WHERE user_id = ?
            AND (title LIKE ? OR content LIKE ?)
          ORDER BY pinned DESC, updated_at DESC, id DESC
        `).all(req.user.id, `%${search}%`, `%${search}%`)
      : db.prepare(`
          SELECT *
          FROM notes
          WHERE user_id = ?
          ORDER BY pinned DESC, updated_at DESC, id DESC
        `).all(req.user.id);

    res.json({
      success: true,
      notes,
    });
  } catch (error) {
    console.error("Fetch notes error:", error);

    res.status(500).json({
      success: false,
      message: "Could not load notes.",
    });
  }
});

// Create note
app.post("/api/notes", (req, res) => {
  try {
    const title =
      typeof req.body.title === "string" ? req.body.title.trim() : "";

    const content =
      typeof req.body.content === "string" ? req.body.content : "";

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Note title is required.",
      });
    }

    if (title.length > 200 || content.length > 50000) {
      return res.status(400).json({
        success: false,
        message: "Title or content exceeds the allowed length.",
      });
    }

    const result = db.prepare(`
      INSERT INTO notes (title, content, user_id)
      VALUES (?, ?, ?)
    `).run(title, content, req.user.id);

    const note = db.prepare(`
      SELECT *
      FROM notes
      WHERE id = ? AND user_id = ?
    `).get(result.lastInsertRowid, req.user.id);

    res.status(201).json({
      success: true,
      note,
    });
  } catch (error) {
    console.error("Create note error:", error);

    res.status(500).json({
      success: false,
      message: "Could not create note.",
    });
  }
});

// Update note
app.put("/api/notes/:id", (req, res) => {
  try {
    const id = Number(req.params.id);

    const title =
      typeof req.body.title === "string" ? req.body.title.trim() : "";

    const content =
      typeof req.body.content === "string" ? req.body.content : "";

    if (!Number.isSafeInteger(id) || id < 1) {
      return res.status(400).json({
        success: false,
        message: "Invalid note ID.",
      });
    }

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Note title is required.",
      });
    }

    if (title.length > 200 || content.length > 50000) {
      return res.status(400).json({
        success: false,
        message: "Title or content exceeds the allowed length.",
      });
    }

    const result = db.prepare(`
      UPDATE notes
      SET title = ?, content = ?, updated_at = datetime('now')
      WHERE id = ? AND user_id = ?
    `).run(title, content, id, req.user.id);

    if (!result.changes) {
      return res.status(404).json({
        success: false,
        message: "Note not found.",
      });
    }

    const note = db.prepare(`
      SELECT *
      FROM notes
      WHERE id = ? AND user_id = ?
    `).get(id, req.user.id);

    res.json({
      success: true,
      note,
    });
  } catch (error) {
    console.error("Update note error:", error);

    res.status(500).json({
      success: false,
      message: "Could not update note.",
    });
  }
});

// Delete note
app.delete("/api/notes/:id", (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isSafeInteger(id) || id < 1) {
      return res.status(400).json({
        success: false,
        message: "Invalid note ID.",
      });
    }

    const result = db.prepare(`
      DELETE FROM notes
      WHERE id = ? AND user_id = ?
    `).run(id, req.user.id);

    if (!result.changes) {
      return res.status(404).json({
        success: false,
        message: "Note not found.",
      });
    }

    res.json({
      success: true,
      message: "Note deleted successfully.",
    });
  } catch (error) {
    console.error("Delete note error:", error);

    res.status(500).json({
      success: false,
      message: "Could not delete note.",
    });
  }
});

// Pin/unpin note
app.patch("/api/notes/:id/pin", (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isSafeInteger(id) || id < 1) {
      return res.status(400).json({
        success: false,
        message: "Invalid note ID.",
      });
    }

    const note = db.prepare(`
      SELECT id, pinned
      FROM notes
      WHERE id = ? AND user_id = ?
    `).get(id, req.user.id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found.",
      });
    }

    const pinned = note.pinned ? 0 : 1;

    db.prepare(`
      UPDATE notes
      SET pinned = ?
      WHERE id = ? AND user_id = ?
    `).run(pinned, id, req.user.id);

    res.json({
      success: true,
      message: pinned ? "Note pinned." : "Note unpinned.",
      pinned: Boolean(pinned),
    });
  } catch (error) {
    console.error("Pin note error:", error);

    res.status(500).json({
      success: false,
      message: "Could not update pin status.",
    });
  }
});

// API 404 handler
app.use("/api", (req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found.",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`NexNote API running at http://localhost:${PORT}`);
});
