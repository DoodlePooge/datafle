import pool from "../db.js";

export const insertColorfle = async (userId, puzzle, mode, score, acc) => {
  try {
    const check = await pool.query(
      "UPDATE colorfle SET score = $4, accuracy = $5 WHERE userId = $1 AND puzzle = $2 AND mode = $3",
      [userId, puzzle, mode, score, acc]
    );
    if (check.rowCount == 0) {
      const res = await pool.query(
        "INSERT INTO colorfle (userId, puzzle, mode, date, score, accuracy) VALUES ($1, $2, $3, CURRENT_DATE, $4, $5) RETURNING *",
        [userId, puzzle, mode, score, acc]
      );
      console.log(res.rows);
    }
  } catch (err) {
    console.error("Error executing query", err.stack);
  }
};

export const getColorfle = async (userId) => {
  try {
    const res = await pool.query("SELECT * FROM colorfle WHERE userId = $1", [
      userId,
    ]);
    console.log(res.rows);
    return res;
  } catch (err) {
    console.error("Error executing query", err.stack);
    return err;
  }
};

export default insertColorfle;
