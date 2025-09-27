import pool from "../db.js";

export const insertConn = async (userId, puzzle, yel, grn, blu, prl) => {
  try {
    const check = await pool.query(
      "UPDATE connections SET yellow = $3, green = $4, blue = $5, purple = $6 WHERE userId = $1 AND puzzle = $2",
      [userId, puzzle, yel, grn, blu, prl]
    );
    if (check.rowCount == 0) {
      const res = await pool.query(
        "INSERT INTO connections (userId, puzzle, date, yellow, green, blue, purple) VALUES ($1, $2, CURRENT_DATE, $3, $4, $5, $6) RETURNING *",
        [userId, puzzle, yel, grn, blu, prl]
      );
      console.log(res.rows);
    }
  } catch (err) {
    console.error("Error executing query", err.stack);
  }
};

export const getConn = async (userId) => {
  try {
    const res = await pool.query(
      "SELECT * FROM connections WHERE userId = $1",
      [userId]
    );
    console.log(res.rows);
    return res;
  } catch (err) {
    console.error("Error executing query", err.stack);
    return err;
  }
};

export default insertConn;
