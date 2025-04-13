import { Request, Response } from 'express';
import { pool } from '../config/db';

export class SleepPatternController {

  static async createSleepPattern(req: Request, res: Response): Promise<void> {
    const { user_id, date, duration, quality, deep_sleep, rem_sleep } = req.body;

    try {
      const query = `
        INSERT INTO sleep_patterns (user_id, date, duration, quality, deep_sleep, rem_sleep)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
      `;
      const values = [user_id, date, duration, quality, deep_sleep, rem_sleep];
      const result = await pool.query(query, values);
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Error creating sleep pattern:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  static async getSleepPatternsByUserId(req: Request, res: Response): Promise<void> {
    const userId = parseInt(req.params.userId);

    try {
      const query = 'SELECT * FROM sleep_patterns WHERE user_id = $1 ORDER BY date DESC';
      const result = await pool.query(query, [userId]);
      res.status(200).json(result.rows);
    } catch (error) {
      console.error('Error getting sleep patterns:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  static async updateSleepPattern(req: Request, res: Response): Promise<void> {
    const id = req.params.id;
    const { user_id, date, duration, quality, deep_sleep, rem_sleep } = req.body;
    try {
      const query = `
        UPDATE sleep_patterns 
        SET user_id = $1, date = $2, duration = $3, quality = $4, deep_sleep = $5, rem_sleep = $6
        WHERE id = $7
        RETURNING *
      `;
      const values = [user_id, date, duration, quality, deep_sleep, rem_sleep, id];
      const result = await pool.query(query, values);
      
      if (result.rows.length === 0) {
        res.status(404).json({ message: 'Sleep pattern not found' });
        return;
      }
      
      res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error('Error updating sleep pattern:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  static async deleteSleepPattern(req: Request, res: Response): Promise<void> {
    const id = req.params.id;
    try {
      const query = 'DELETE FROM sleep_patterns WHERE id = $1 RETURNING *';
      const result = await pool.query(query, [id]);
      
      if (result.rows.length === 0) {
        res.status(404).json({ message: 'Sleep pattern not found' });
        return;
      }
      
      res.status(200).json({ message: 'Sleep pattern deleted successfully' });
    } catch (error) {
      console.error('Error deleting sleep pattern:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
}