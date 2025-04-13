import { Request, Response } from 'express';
import { pool } from '../config/db';

export class BloodWorkController {

  static async createBloodWork(req: Request, res: Response): Promise<void> {
    const { user_id, date, glucose, cholesterol, hdl, ldl, triglycerides } = req.body;
    try {
      const query = `
        INSERT INTO blood_work (user_id, date, glucose, cholesterol, hdl, ldl, triglycerides)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `;
      const values = [user_id, date, glucose, cholesterol, hdl, ldl, triglycerides];
      const result = await pool.query(query, values);
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Error creating blood work:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }


  static async getBloodWorkByUserId(req: Request, res: Response): Promise<void> {
    const userId = parseInt(req.params.userId);
    try {
      const query = 'SELECT * FROM blood_work WHERE user_id = $1 ORDER BY date DESC';
      const result = await pool.query(query, [userId]);
      res.status(200).json(result.rows);
    } catch (error) {
      console.error('Error getting blood work:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  static async updateBloodWork(req: Request, res: Response): Promise<void> {
    const id = req.params.id;
    const { user_id, date, glucose, cholesterol, hdl, ldl, triglycerides } = req.body;
    try {
      const query = `
        UPDATE blood_work 
        SET user_id = $1, date = $2, glucose = $3, cholesterol = $4, hdl = $5, ldl = $6, triglycerides = $7
        WHERE id = $8
        RETURNING *
      `;
      const values = [user_id, date, glucose, cholesterol, hdl, ldl, triglycerides, id];
      const result = await pool.query(query, values);
      
      if (result.rows.length === 0) {
        res.status(404).json({ message: 'Blood work not found' });
        return;
      }
      
      res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error('Error updating blood work:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  static async deleteBloodWork(req: Request, res: Response): Promise<void> {
    const id = req.params.id;
    try {
      const query = 'DELETE FROM blood_work WHERE id = $1 RETURNING *';
      const result = await pool.query(query, [id]);
      
      if (result.rows.length === 0) {
        res.status(404).json({ message: 'Blood work not found' });
        return;
      }
      
      res.status(200).json({ message: 'Blood work deleted successfully' });
    } catch (error) {
      console.error('Error deleting blood work:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
}
