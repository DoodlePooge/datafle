import pool from "../db.js";

export const insertAngle = async (userId, puzzle, score, dist) => {
  try {
    const check = await pool.query(
      "UPDATE angle SET score = $3, dist = $4 WHERE userId = $1 AND puzzle = $2",
      [userId, puzzle, score, dist]
    );
    if (check.rowCount == 0) {
      const res = await pool.query(
        "INSERT INTO angle (userId, puzzle, date, score, dist) VALUES ($1, $2, CURRENT_DATE, $3, $4) RETURNING *",
        [userId, puzzle, score, dist]
      );
      console.log(res.rows);
    }
  } catch (err) {
    console.error("Error executing query", err.stack);
  }
};

export const getAngle = async (userId) => {
  try {
    const res = await pool.query("SELECT * FROM angle WHERE userId = $1", [
      userId,
    ]);
    console.log(res.rows);
    return res;
  } catch (err) {
    console.error("Error executing query", err.stack);
    return err;
  }
};

export default insertAngle;
