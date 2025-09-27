import pool from "../db.js";

export const insertWordle = async (userId, puzzle, score) => {
  try {
    const check = await pool.query(
      "UPDATE wordle SET score = $3 WHERE userId = $1 AND puzzle = $2",
      [userId, puzzle, score]
    );
    if (check.rowCount == 0) {
      const res = await pool.query(
        "INSERT INTO wordle (userId, puzzle, date, score) VALUES ($1, $2, CURRENT_DATE, $3) RETURNING *",
        [userId, puzzle, score]
      );
      console.log(res.rows);
    }
  } catch (err) {
    console.error("Error executing query", err.stack);
  }
};

export const getWordle = async (userId) => {
  try {
    const res = await pool.query("SELECT * FROM wordle WHERE userId = $1", [
      userId,
    ]);
    console.log(res.rows);
    return res;
  } catch (err) {
    console.error("Error executing query", err.stack);
    return err;
  }
};

export default insertWordle;
