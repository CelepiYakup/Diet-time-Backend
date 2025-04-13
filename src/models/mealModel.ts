import { pool } from '../config/db';

export interface Meal {
  id: number;
  user_id: number;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  meal_date: string;
  meal_time: string;
  created_at: Date;
}

export interface MealInput {
  user_id: number;
  name: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  meal_date: string;
  meal_time: string;
}

export class MealModel {

  static async createMeal(mealData: MealInput): Promise<Meal> {
    const { user_id, name, calories, protein, carbs, fat, meal_date, meal_time } = mealData;
    
    const query = `
      INSERT INTO meals (user_id, name, calories, protein, carbs, fat, meal_date, meal_time)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
    
    const values = [user_id, name, calories, protein || 0, carbs || 0, fat || 0, meal_date, meal_time];
    
    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error creating meal:', error);
      throw error;
    }
  }


  static async getMealById(id: number): Promise<Meal | null> {
    const query = 'SELECT * FROM meals WHERE id = $1';
    
    try {
      const result = await pool.query(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error getting meal by ID:', error);
      throw error;
    }
  }

  static async getMealsByUserId(userId: number): Promise<Meal[]> {
    const query = 'SELECT * FROM meals WHERE user_id = $1 ORDER BY meal_date DESC, meal_time DESC';
    
    try {
      const result = await pool.query(query, [userId]);
      return result.rows;
    } catch (error) {
      console.error('Error getting meals by user ID:', error);
      throw error;
    }
  }


  static async getMealsByDateRange(userId: number, startDate: string, endDate: string): Promise<Meal[]> {
    const query = `
      SELECT * FROM meals 
      WHERE user_id = $1 
      AND meal_date BETWEEN $2 AND $3
      ORDER BY meal_date DESC, meal_time DESC
    `;
    
    try {
      const result = await pool.query(query, [userId, startDate, endDate]);
      return result.rows;
    } catch (error) {
      console.error('Error getting meals by date range:', error);
      throw error;
    }
  }


  static async updateMeal(id: number, mealData: Partial<MealInput>): Promise<Meal | null> {
    const { name, calories, protein, carbs, fat, meal_date, meal_time } = mealData;
    

    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;
    
    if (name !== undefined) {
      updates.push(`name = $${paramCount}`);
      values.push(name);
      paramCount++;
    }
    
    if (calories !== undefined) {
      updates.push(`calories = $${paramCount}`);
      values.push(calories);
      paramCount++;
    }
    
    if (protein !== undefined) {
      updates.push(`protein = $${paramCount}`);
      values.push(protein);
      paramCount++;
    }
    
    if (carbs !== undefined) {
      updates.push(`carbs = $${paramCount}`);
      values.push(carbs);
      paramCount++;
    }
    
    if (fat !== undefined) {
      updates.push(`fat = $${paramCount}`);
      values.push(fat);
      paramCount++;
    }
    
    if (meal_date !== undefined) {
      updates.push(`meal_date = $${paramCount}`);
      values.push(meal_date);
      paramCount++;
    }
    
    if (meal_time !== undefined) {
      updates.push(`meal_time = $${paramCount}`);
      values.push(meal_time);
      paramCount++;
    }
    
    if (updates.length === 0) {
      return null; 
    }
    
    values.push(id);
    const query = `
      UPDATE meals
      SET ${updates.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;
    
    try {
      const result = await pool.query(query, values);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error updating meal:', error);
      throw error;
    }
  }


  static async deleteMeal(id: number): Promise<boolean> {
    const query = 'DELETE FROM meals WHERE id = $1 RETURNING id';
    
    try {
      const result = await pool.query(query, [id]);
      return result.rowCount ? result.rowCount > 0 : false;
    } catch (error) {
      console.error('Error deleting meal:', error);
      throw error;
    }
  }
} 