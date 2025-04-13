import { Request, Response } from 'express';
import { MealModel, MealInput } from '../models/mealModel';

export class MealController {

  static async createMeal(req: Request, res: Response): Promise<void> {
    try {
      const mealData: MealInput = req.body;
      

      if (!mealData.user_id || !mealData.name || !mealData.calories || !mealData.meal_date || !mealData.meal_time) {
        res.status(400).json({ 
          message: 'Missing required fields',
          details: 'user_id, name, calories, meal_date, and meal_time are required'
        });
        return;
      }

      if (typeof mealData.calories !== 'number' || mealData.calories <= 0) {
        res.status(400).json({ 
          message: 'Invalid calories value',
          details: 'Calories must be a positive number'
        });
        return;
      }

      if (mealData.protein !== undefined && (typeof mealData.protein !== 'number' || mealData.protein < 0)) {
        res.status(400).json({ 
          message: 'Invalid protein value',
          details: 'Protein must be a non-negative number'
        });
        return;
      }

      if (mealData.carbs !== undefined && (typeof mealData.carbs !== 'number' || mealData.carbs < 0)) {
        res.status(400).json({ 
          message: 'Invalid carbs value',
          details: 'Carbs must be a non-negative number'
        });
        return;
      }

      if (mealData.fat !== undefined && (typeof mealData.fat !== 'number' || mealData.fat < 0)) {
        res.status(400).json({ 
          message: 'Invalid fat value',
          details: 'Fat must be a non-negative number'
        });
        return;
      }

      const mealDate = new Date(mealData.meal_date);
      if (isNaN(mealDate.getTime())) {
        res.status(400).json({ 
          message: 'Invalid date format',
          details: 'meal_date must be a valid date'
        });
        return;
      }


      const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/;
      if (!timeRegex.test(mealData.meal_time)) {
        res.status(400).json({ 
          message: 'Invalid time format',
          details: 'meal_time must be in HH:MM or HH:MM:SS format'
        });
        return;
      }

 
      const newMeal = await MealModel.createMeal(mealData);
      
      res.status(201).json({
        message: 'Meal created successfully',
        meal: newMeal
      });
    } catch (error) {
      console.error('Error creating meal:', error);
      res.status(500).json({ 
        message: 'Server error',
        details: 'An unexpected error occurred while creating the meal'
      });
    }
  }


  static async getMealById(req: Request, res: Response): Promise<void> {
    try {
      const mealId = parseInt(req.params.id);
      
      if (isNaN(mealId)) {
        res.status(400).json({ 
          message: 'Invalid meal ID',
          details: 'Meal ID must be a number'
        });
        return;
      }
      
      const meal = await MealModel.getMealById(mealId);
      
      if (!meal) {
        res.status(404).json({ 
          message: 'Meal not found',
          details: `Meal with ID ${mealId} does not exist`
        });
        return;
      }
      
      res.status(200).json(meal);
    } catch (error) {
      console.error('Error getting meal by ID:', error);
      res.status(500).json({ 
        message: 'Server error',
        details: 'An unexpected error occurred while fetching the meal'
      });
    }
  }


  static async getMealsByUserId(req: Request, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.userId);
      
      if (isNaN(userId)) {
        res.status(400).json({ message: 'Geçersiz kullanıcı ID' });
        return;
      }
      

      if (req.user && req.user.id !== userId) {
        res.status(403).json({ message: 'Erişim reddedildi. Sadece kendi yemeklerinize erişebilirsiniz.' });
        return;
      }
      
      const meals = await MealModel.getMealsByUserId(userId);
      
      res.status(200).json(meals);
    } catch (error) {
      console.error('Error getting meals by user ID:', error);
      res.status(500).json({ message: 'Sunucu hatası' });
    }
  }


  static async getMealsByDateRange(req: Request, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.userId);
      const { startDate, endDate } = req.query;
      
      if (isNaN(userId)) {
        res.status(400).json({ message: 'Invalid user ID' });
        return;
      }
      
      if (!startDate || !endDate || typeof startDate !== 'string' || typeof endDate !== 'string') {
        res.status(400).json({ message: 'Start date and end date are required' });
        return;
      }
      
      const meals = await MealModel.getMealsByDateRange(userId, startDate, endDate);
      
      res.status(200).json(meals);
    } catch (error) {
      console.error('Error getting meals by date range:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }


  static async updateMeal(req: Request, res: Response): Promise<void> {
    try {
      const mealId = parseInt(req.params.id);
      const mealData = req.body;
      
      if (isNaN(mealId)) {
        res.status(400).json({ message: 'Geçersiz yemek ID' });
        return;
      }
      

      const existingMeal = await MealModel.getMealById(mealId);
      
      if (!existingMeal) {
        res.status(404).json({ message: 'Yemek bulunamadı' });
        return;
      }
      

      if (req.user && req.user.id !== existingMeal.user_id) {
        res.status(403).json({ message: 'Erişim reddedildi. Sadece kendi yemeklerinizi düzenleyebilirsiniz.' });
        return;
      }
      
      const updatedMeal = await MealModel.updateMeal(mealId, mealData);
      
      res.status(200).json({
        message: 'Yemek başarıyla güncellendi',
        meal: updatedMeal
      });
    } catch (error) {
      console.error('Error updating meal:', error);
      res.status(500).json({ message: 'Sunucu hatası' });
    }
  }

  static async deleteMeal(req: Request, res: Response): Promise<void> {
    try {
      const mealId = parseInt(req.params.id);
      
      if (isNaN(mealId)) {
        res.status(400).json({ message: 'Geçersiz yemek ID' });
        return;
      }

      const existingMeal = await MealModel.getMealById(mealId);
      
      if (!existingMeal) {
        res.status(404).json({ message: 'Yemek bulunamadı' });
        return;
      }
      
      if (req.user && req.user.id !== existingMeal.user_id) {
        res.status(403).json({ message: 'Erişim reddedildi. Sadece kendi yemeklerinizi silebilirsiniz.' });
        return;
      }
      
      const deleted = await MealModel.deleteMeal(mealId);
      
      if (!deleted) {
        res.status(500).json({ message: 'Yemek silinemedi' });
        return;
      }
      
      res.status(200).json({ message: 'Yemek başarıyla silindi' });
    } catch (error) {
      console.error('Error deleting meal:', error);
      res.status(500).json({ message: 'Sunucu hatası' });
    }
  }
} 