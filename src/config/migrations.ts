import { pool } from './db';
import MealPlanModel from '../models/mealPlan';

export const migrateGoalsTable = async () => {
  try {
    const tableCheckResult = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'goals'
      );
    `);

    const tableExists = tableCheckResult.rows[0].exists;

    if (tableExists) {
      const columnsCheckResult = await pool.query(`
        SELECT column_name FROM information_schema.columns 
        WHERE table_name = 'goals';
      `);
      
      const existingColumns = columnsCheckResult.rows.map(row => row.column_name);
      
      if (!existingColumns.includes('title')) {
        await pool.query(`ALTER TABLE goals ADD COLUMN title VARCHAR(255) NOT NULL DEFAULT 'My Goal';`);
      }
      
      if (!existingColumns.includes('description')) {
        await pool.query(`ALTER TABLE goals ADD COLUMN description TEXT DEFAULT '';`);
      }
      
      if (!existingColumns.includes('status')) {
        await pool.query(`ALTER TABLE goals ADD COLUMN status VARCHAR(20) DEFAULT 'in progress';`);
      }
      
      if (!existingColumns.includes('start_date')) {
        await pool.query(`ALTER TABLE goals ADD COLUMN start_date DATE DEFAULT CURRENT_DATE;`);
      }
      
      if (!existingColumns.includes('target_date')) {
        await pool.query(`ALTER TABLE goals ADD COLUMN target_date DATE;`);
        await pool.query(`UPDATE goals SET target_date = deadline WHERE target_date IS NULL;`);
      }

    } else {
      await pool.query(`
        CREATE TABLE goals (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES users(id),
          category VARCHAR(50) NOT NULL,
          title VARCHAR(255) NOT NULL DEFAULT 'My Goal',
          description TEXT,
          target_value FLOAT NOT NULL,
          current_value FLOAT NOT NULL,
          unit VARCHAR(50) NOT NULL,
          status VARCHAR(20) DEFAULT 'in progress',
          start_date DATE DEFAULT CURRENT_DATE,
          target_date DATE,
          deadline DATE NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);


      await pool.query(`UPDATE goals SET target_date = deadline WHERE target_date IS NULL;`);
    }

    const statusColumnCheck = await pool.query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'goals' AND column_name = 'status'
    `);

    if (statusColumnCheck.rows.length === 0) {
      await pool.query(`
        ALTER TABLE goals
        ADD COLUMN status VARCHAR(20) DEFAULT 'in progress'
      `);

    }
  } catch (error) {
    console.error('Error during goals table migration:', error);
  }
};

export const migrateMealPlansTable = async () => {
  try {
    const expirationColumnCheck = await pool.query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'meal_plans' AND column_name = 'expiration_date'
    `);

    // If expiration_date column doesn't exist, add it
    if (expirationColumnCheck.rows.length === 0) {
      await pool.query(`
        ALTER TABLE meal_plans
        ADD COLUMN expiration_date TIMESTAMP
      `);
      

      const mealPlanModel = MealPlanModel;
      const nextMonday = await mealPlanModel.calculateNextMonday();

      await pool.query(`
        UPDATE meal_plans
        SET expiration_date = $1
        WHERE expiration_date IS NULL
      `, [nextMonday]);

      
      await pool.query(`
        ALTER TABLE meal_plans
        ALTER COLUMN expiration_date SET NOT NULL
      `);
    }
  } catch (error) {
    console.error('Error during meal plans table migration:', error);
  }
}; 