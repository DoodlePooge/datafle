import pool from '../db.js';

export const insertWordle = async (userId, score) => {
  if(score.length > 1) return;
  try {
    const res = await pool.query('INSERT INTO wordle (userId, date, score) VALUES ($1, CURRENT_DATE, $2) RETURNING *',[userId,score]);
    console.log(res.rows);
  } catch (err) {
    console.error('Error executing query', err.stack);
  }
}

export const getWordle = async (userId) => {
  try {
    const res = await pool.query('SELECT * FROM Wordle WHERE userId = $1', [userId]);
    console.log(res.rows);
    return res;
  } catch (err) {
    console.error('Error executing query', err.stack);
    return err;
  }
}

export default insertWordle;