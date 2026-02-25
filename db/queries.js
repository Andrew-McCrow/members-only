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

async function createUser(name, email, hashedPassword) {
  await pool.query(
    "INSERT INTO users (name, email, password, member_status) VALUES ($1, $2, $3, $4)",
    [name, email, hashedPassword, "in_the_cold"],
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

module.exports = { getUserByEmail, getUserById, createUser, updateMemberStatus, createMessage };
