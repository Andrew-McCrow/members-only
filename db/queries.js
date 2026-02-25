const pool = require("./pool");

async function getUserByEmail(email) {
  const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  return rows[0];
}

async function getUserById(id) {
  const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
  return rows[0];
}

async function createUser(name, email, hashedPassword, isAdmin) {
  await pool.query(
    "INSERT INTO users (name, email, password, member_status, is_admin) VALUES ($1, $2, $3, $4, $5)",
    [name, email, hashedPassword, "in_the_cold", isAdmin],
  );
}

async function updateMemberStatus(id, status) {
  await pool.query("UPDATE users SET member_status = $1 WHERE id = $2", [
    status,
    id,
  ]);
}

async function createMessage(userId, title, message) {
  await pool.query(
    "INSERT INTO messages (user_id, title, message, timestamp) VALUES ($1, $2, $3, NOW())",
    [userId, title, message],
  );
}

async function getAllMessages() {
  const { rows } = await pool.query(
    `SELECT messages.id, messages.title, messages.message, messages.timestamp,
            users.name AS author_name
     FROM messages
     JOIN users ON messages.user_id = users.id
     ORDER BY messages.timestamp DESC`,
  );
  return rows;
}

async function deleteMessage(id) {
  await pool.query("DELETE FROM messages WHERE id = $1", [id]);
}

module.exports = { getUserByEmail, getUserById, createUser, updateMemberStatus, createMessage, getAllMessages, deleteMessage };
