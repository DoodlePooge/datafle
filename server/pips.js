import pool from "../db.js";

export const insertPip = async (userId, puzzle, mode, time, cook) => {
  try {
    const check = await pool.query(
      "UPDATE pips SET time = $4, cookie = $5 WHERE userId = $1 AND puzzle = $2 AND mode = $3",
      [userId, puzzle, mode, time, cook]
    );
    if (check.rowCount == 0) {
      const res = await pool.query(
        "INSERT INTO pips (userId, puzzle, mode, date, time, cookie) VALUES ($1, $2, $3, CURRENT_DATE, $4, $5) RETURNING *",
        [userId, puzzle, mode, time, cook]
      );
      console.log(res.rows);
    }
  } catch (err) {
    console.error("Error executing query", err.stack);
  }
};

export const getPips = async (userId) => {
  try {
    const res = await pool.query("SELECT * FROM pips WHERE userId = $1", [
      userId,
    ]);
    console.log(res.rows);
    return res;
  } catch (err) {
    console.error("Error executing query", err.stack);
    return err;
  }
};

export default insertPip;
