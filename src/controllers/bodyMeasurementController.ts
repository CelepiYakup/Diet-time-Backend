import { Request, Response } from 'express';
import { pool } from '../config/db';

export class BodyMeasurementController {
  static async createBodyMeasurement(req: Request, res: Response): Promise<void> {
    const { user_id, date, weight, bmi, body_fat, waist } = req.body;
    try {
      const query = `
        INSERT INTO body_measurements (user_id, date, weight, bmi, body_fat, waist)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
      `;
      const values = [user_id, date, weight, bmi, body_fat, waist];
      const result = await pool.query(query, values);
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Error creating body measurement:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  static async getBodyMeasurementsByUserId(req: Request, res: Response): Promise<void> {
    const userId = parseInt(req.params.userId);
    try {
      const query = 'SELECT * FROM body_measurements WHERE user_id = $1 ORDER BY date DESC';
      const result = await pool.query(query, [userId]);
      res.status(200).json(result.rows);
    } catch (error) {
      console.error('Error getting body measurements:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  static async updateBodyMeasurement(req: Request, res: Response): Promise<void> {
    const id = req.params.id;
    const { user_id, date, weight, bmi, body_fat, waist } = req.body;
    try {
      const query = `
        UPDATE body_measurements 
        SET user_id = $1, date = $2, weight = $3, bmi = $4, body_fat = $5, waist = $6
        WHERE id = $7
        RETURNING *
      `;
      const values = [user_id, date, weight, bmi, body_fat, waist, id];
      const result = await pool.query(query, values);
      
      if (result.rows.length === 0) {
        res.status(404).json({ message: 'Body measurement not found' });
        return;
      }
      
      res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error('Error updating body measurement:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  static async deleteBodyMeasurement(req: Request, res: Response): Promise<void> {
    const id = req.params.id;
    try {
      const query = 'DELETE FROM body_measurements WHERE id = $1 RETURNING *';
      const result = await pool.query(query, [id]);
      
      if (result.rows.length === 0) {
        res.status(404).json({ message: 'Body measurement not found' });
        return;
      }
      
      res.status(200).json({ message: 'Body measurement deleted successfully' });
    } catch (error) {
      console.error('Error deleting body measurement:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
}
