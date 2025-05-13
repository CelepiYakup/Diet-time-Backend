import { pool } from '../config/db';

export interface Goal {
  id: number;
  user_id: number;
  title: string;
  description?: string;
  target_value?: number;
  current_value?: number;
  unit?: string;
  category: string;
  start_date: Date;
  target_date: Date;
  status: 'in progress' | 'completed' | 'failed';
  created_at: Date;
  updated_at: Date;
  deadline: Date;
}

export class GoalModel {
  static async createGoal(goalData: Omit<Goal, 'id' | 'created_at' | 'updated_at'>): Promise<Goal> {
    const { 
      user_id, 
      category,
      title,
      description,
      target_value, 
      current_value, 
      unit,
      status,
      start_date,
      target_date,
      deadline 
    } = goalData;

    const query = `
      INSERT INTO goals (
        user_id, category, title, description, target_value, current_value, unit, 
        status, start_date, target_date, deadline
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `;

    const values = [
      user_id, 
      category,
      title || 'My Goal',
      description || '',
      target_value, 
      current_value, 
      unit,
      status || 'in progress',
      start_date || new Date(),
      target_date || deadline,
      deadline
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async getGoalsByUserId(userId: number): Promise<Goal[]> {
    const query = 'SELECT * FROM goals WHERE user_id = $1 ORDER BY created_at DESC';
    const result = await pool.query(query, [userId]);
    return result.rows;
  }

  static async getGoalById(goalId: number): Promise<Goal | null> {
    const query = 'SELECT * FROM goals WHERE id = $1';
    const result = await pool.query(query, [goalId]);
    return result.rows.length ? result.rows[0] : null;
  }

  static async updateGoal(goalId: number, goalData: Partial<Omit<Goal, 'id' | 'created_at' | 'updated_at'>>): Promise<Goal | null> {

    const fields = Object.keys(goalData).filter(key => goalData[key as keyof typeof goalData] !== undefined);
    
    if (fields.length === 0) {
      return this.getGoalById(goalId);
    }

    const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
    const values = fields.map(field => goalData[field as keyof typeof goalData]);

    const query = `
      UPDATE goals 
      SET ${setClause}, updated_at = NOW() 
      WHERE id = $1 
      RETURNING *
    `;

    const result = await pool.query(query, [goalId, ...values]);
    return result.rows.length ? result.rows[0] : null;
  }

  static async deleteGoal(goalId: number): Promise<boolean> {
    const query = 'DELETE FROM goals WHERE id = $1 RETURNING id';
    const result = await pool.query(query, [goalId]);
    return result.rows.length > 0;
  }

  static async getGoalsByCategory(userId: number, category: string): Promise<Goal[]> {
    const query = 'SELECT * FROM goals WHERE user_id = $1 AND category = $2 ORDER BY created_at DESC';
    const result = await pool.query(query, [userId, category]);
    return result.rows;
  }

  static async getActiveGoals(userId: number): Promise<Goal[]> {
    try {
      const query = "SELECT * FROM goals WHERE user_id = $1 AND status = 'in progress' ORDER BY target_date ASC";
      const result = await pool.query(query, [userId]);
      return result.rows;
    } catch (error) {
      console.error('Error fetching active goals with status, falling back to deadline:', error);
      
      const fallbackQuery = 'SELECT * FROM goals WHERE user_id = $1 AND deadline > NOW() ORDER BY deadline ASC';
      const fallbackResult = await pool.query(fallbackQuery, [userId]);
      return fallbackResult.rows;
    }
  }
} 