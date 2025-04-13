import { pool } from '../config/db';

export interface MealPlan {
  id: number;
  user_id: number;
  meal_id: number;
  day: string;
  meal_time: string;
  expiration_date: Date;
  created_at: Date;
  updated_at: Date;
}

export interface MealPlanInput {
  user_id: number;
  meal_id: number;
  day: string;
  meal_time: string;
  expiration_date: Date;
}

class MealPlanModel {

  async findAllByUserId(userId: number): Promise<MealPlan[]> {
    const query = `
      SELECT mp.*, m.name, m.calories, m.protein, m.carbs, m.fat
      FROM meal_plans mp
      JOIN meals m ON mp.meal_id = m.id
      WHERE mp.user_id = $1
      ORDER BY mp.day ASC, mp.meal_time ASC
    `;
    
    const result = await pool.query(query, [userId]);
    return result.rows;
  }

  async create(mealPlan: MealPlanInput): Promise<MealPlan> {
    const { user_id, meal_id, day, meal_time, expiration_date } = mealPlan;
    
    const query = `
      INSERT INTO meal_plans (user_id, meal_id, day, meal_time, expiration_date)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    
    const result = await pool.query(query, [user_id, meal_id, day, meal_time, expiration_date]);
    return result.rows[0];
  }

  async findById(id: number): Promise<MealPlan | null> {
    const query = 'SELECT * FROM meal_plans WHERE id = $1';
    const result = await pool.query(query, [id]);
    
    return result.rows.length > 0 ? result.rows[0] : null;
  }

  async update(id: number, mealPlan: Partial<MealPlanInput>): Promise<MealPlan | null> {

    const existingMealPlan = await this.findById(id);
    if (!existingMealPlan) return null;

    const updatedValues = {
      user_id: mealPlan.user_id || existingMealPlan.user_id,
      meal_id: mealPlan.meal_id || existingMealPlan.meal_id,
      day: mealPlan.day || existingMealPlan.day,
      meal_time: mealPlan.meal_time || existingMealPlan.meal_time,
      expiration_date: mealPlan.expiration_date || existingMealPlan.expiration_date
    };
    
    const query = `
      UPDATE meal_plans
      SET user_id = $1, meal_id = $2, day = $3, meal_time = $4, expiration_date = $5, updated_at = CURRENT_TIMESTAMP
      WHERE id = $6
      RETURNING *
    `;
    
    const result = await pool.query(query, [
      updatedValues.user_id,
      updatedValues.meal_id,
      updatedValues.day,
      updatedValues.meal_time,
      updatedValues.expiration_date,
      id
    ]);
    
    return result.rows[0];
  }


  async delete(id: number): Promise<boolean> {
    const query = 'DELETE FROM meal_plans WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    
    return result.rowCount ? result.rowCount > 0 : false;
  }


  async deleteByDayAndUser(userId: number, day: string): Promise<number> {
    const query = 'DELETE FROM meal_plans WHERE user_id = $1 AND day = $2 RETURNING *';
    const result = await pool.query(query, [userId, day]);
    
    return result.rowCount ?? 0;
  }

  async deleteExpiredMealPlans(): Promise<number> {
    const query = 'DELETE FROM meal_plans WHERE expiration_date < CURRENT_TIMESTAMP RETURNING *';
    const result = await pool.query(query);
    
    return result.rowCount ?? 0;
  }

  async calculateNextMonday(): Promise<Date> {
    const now = new Date();
    
    const dayOfWeek = now.getDay();
    
    const daysUntilNextMonday = dayOfWeek === 1 ? 7 : (8 - dayOfWeek) % 7;
    
    const nextMonday = new Date(now);
    nextMonday.setDate(now.getDate() + daysUntilNextMonday);
    nextMonday.setHours(0, 0, 0, 0);
    
    return nextMonday;
  }
}

export default new MealPlanModel(); 