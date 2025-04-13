import { Request, Response } from 'express';
import { pool } from '../config/db';

export class VitalSignController {

  static async createVitalSign(req: Request, res: Response): Promise<void> {
    const { user_id, date, heart_rate, blood_pressure, temperature, respiratory_rate } = req.body;

    try {
      const query = `
        INSERT INTO vital_signs (user_id, date, heart_rate, blood_pressure, temperature, respiratory_rate)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
      `;
      const values = [user_id, date, heart_rate, blood_pressure, temperature, respiratory_rate];
      const result = await pool.query(query, values);
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Error creating vital sign:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }


  static async getVitalSignsByUserId(req: Request, res: Response): Promise<void> {
    const userId = parseInt(req.params.userId);

    try {
      const query = 'SELECT * FROM vital_signs WHERE user_id = $1 ORDER BY date DESC';
      const result = await pool.query(query, [userId]);
      res.status(200).json(result.rows);
    } catch (error) {
      console.error('Error getting vital signs:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  static async updateVitalSign(req: Request, res: Response): Promise<void> {
    const id = req.params.id;
    const { user_id, date, heart_rate, blood_pressure, temperature, respiratory_rate } = req.body;
    try {
      const query = `
        UPDATE vital_signs 
        SET user_id = $1, date = $2, heart_rate = $3, blood_pressure = $4, temperature = $5, respiratory_rate = $6
        WHERE id = $7
        RETURNING *
      `;
      const values = [user_id, date, heart_rate, blood_pressure, temperature, respiratory_rate, id];
      const result = await pool.query(query, values);
      
      if (result.rows.length === 0) {
        res.status(404).json({ message: 'Vital sign not found' });
        return;
      }
      
      res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error('Error updating vital sign:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  static async deleteVitalSign(req: Request, res: Response): Promise<void> {
    const id = req.params.id;
    try {
      const query = 'DELETE FROM vital_signs WHERE id = $1 RETURNING *';
      const result = await pool.query(query, [id]);
      
      if (result.rows.length === 0) {
        res.status(404).json({ message: 'Vital sign not found' });
        return;
      }
      
      res.status(200).json({ message: 'Vital sign deleted successfully' });
    } catch (error) {
      console.error('Error deleting vital sign:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
}