import cron from 'node-cron';
import MealPlanModel from '../models/mealPlan';
import { pool } from '../config/db';

export class SchedulerService {
  private static instance: SchedulerService;

  private constructor() {
  }

  public static getInstance(): SchedulerService {
    if (!SchedulerService.instance) {
      SchedulerService.instance = new SchedulerService();
    }
    return SchedulerService.instance;
  }

  public initializeScheduledTasks(): void {
    this.scheduleMealPlanReset();
  }


  private scheduleMealPlanReset(): void {
    cron.schedule('0 0 * * 1', async () => {
      try {
        
        const countQuery = await pool.query(`
          SELECT COUNT(*) as count FROM meal_plans 
          WHERE expiration_date < CURRENT_TIMESTAMP
        `);
        const expiredCount = countQuery.rows[0]?.count || 0;

        
        const deletedCount = await MealPlanModel.deleteExpiredMealPlans();

        
        const nextMonday = await MealPlanModel.calculateNextMonday();

      } catch (error) {

      }
    });
  }
}

export default SchedulerService.getInstance(); 