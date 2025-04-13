import { Request, Response } from 'express';
import { GoalModel } from '../models/goalModel';

export class GoalController {
  static async createGoal(req: Request, res: Response): Promise<void> {
    try {
      const goalData = req.body;
      

      if (!goalData.user_id || !goalData.category || !goalData.target_value || !goalData.current_value || !goalData.unit || !goalData.deadline) {
        res.status(400).json({ 
          message: 'Missing required fields',
          details: 'user_id, category, target_value, current_value, unit, and deadline are required'
        });
        return;
      }

 
      if (typeof goalData.target_value !== 'number' || typeof goalData.current_value !== 'number') {
        res.status(400).json({ 
          message: 'Invalid data types',
          details: 'target_value and current_value must be numbers'
        });
        return;
      }

      const deadline = new Date(goalData.deadline);
      if (deadline <= new Date()) {
        res.status(400).json({ 
          message: 'Invalid deadline',
          details: 'Deadline must be in the future'
        });
        return;
      }

      if (!goalData.title) {
        goalData.title = 'My Goal';
      }
      
      if (!goalData.status) {
        goalData.status = 'in progress';
      }
      
      if (!goalData.start_date) {
        goalData.start_date = new Date();
      }
      
      if (!goalData.target_date) {
        goalData.target_date = deadline;
      }

      const goal = await GoalModel.createGoal(goalData);
      res.status(201).json(goal);
    } catch (error) {
      console.error('Error creating goal:', error);
      res.status(500).json({ 
        message: 'Server error',
        details: 'An unexpected error occurred while creating the goal'
      });
    }
  }

  static async getGoalsByUserId(req: Request, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.userId);
      
      if (isNaN(userId)) {
        res.status(400).json({ 
          message: 'Invalid user ID',
          details: 'User ID must be a number'
        });
        return;
      }

      const goals = await GoalModel.getGoalsByUserId(userId);
      res.status(200).json(goals);
    } catch (error) {
      console.error('Error getting goals:', error);
      res.status(500).json({ 
        message: 'Server error',
        details: 'An unexpected error occurred while fetching goals'
      });
    }
  }

  static async getGoalById(req: Request, res: Response): Promise<void> {
    try {
      const goalId = parseInt(req.params.goalId);
      
      if (isNaN(goalId)) {
        res.status(400).json({ 
          message: 'Invalid goal ID',
          details: 'Goal ID must be a number'
        });
        return;
      }
      
      const goal = await GoalModel.getGoalById(goalId);
      
      if (!goal) {
        res.status(404).json({ 
          message: 'Goal not found',
          details: `Goal with ID ${goalId} does not exist`
        });
        return;
      }
      
      res.status(200).json(goal);
    } catch (error) {
      console.error('Error getting goal:', error);
      res.status(500).json({ 
        message: 'Server error',
        details: 'An unexpected error occurred while fetching the goal'
      });
    }
  }

  static async updateGoal(req: Request, res: Response): Promise<void> {
    try {
      const goalId = parseInt(req.params.goalId);
      const goalData = req.body;
      
      if (isNaN(goalId)) {
        res.status(400).json({ 
          message: 'Invalid goal ID',
          details: 'Goal ID must be a number'
        });
        return;
      }


      if (goalData.target_value !== undefined && typeof goalData.target_value !== 'number') {
        res.status(400).json({ 
          message: 'Invalid data type',
          details: 'target_value must be a number'
        });
        return;
      }

      if (goalData.current_value !== undefined && typeof goalData.current_value !== 'number') {
        res.status(400).json({ 
          message: 'Invalid data type',
          details: 'current_value must be a number'
        });
        return;
      }

      const updatedGoal = await GoalModel.updateGoal(goalId, goalData);
      
      if (!updatedGoal) {
        res.status(404).json({ 
          message: 'Goal not found',
          details: `Goal with ID ${goalId} does not exist`
        });
        return;
      }
      
      res.status(200).json(updatedGoal);
    } catch (error) {
      console.error('Error updating goal:', error);
      res.status(500).json({ 
        message: 'Server error',
        details: 'An unexpected error occurred while updating the goal'
      });
    }
  }

  static async deleteGoal(req: Request, res: Response): Promise<void> {
    try {
      const goalId = parseInt(req.params.goalId);
      
      if (isNaN(goalId)) {
        res.status(400).json({ 
          message: 'Invalid goal ID',
          details: 'Goal ID must be a number'
        });
        return;
      }
      
      const deleted = await GoalModel.deleteGoal(goalId);
      
      if (!deleted) {
        res.status(404).json({ 
          message: 'Goal not found',
          details: `Goal with ID ${goalId} does not exist`
        });
        return;
      }
      
      res.status(200).json({ message: 'Goal deleted successfully' });
    } catch (error) {
      console.error('Error deleting goal:', error);
      res.status(500).json({ 
        message: 'Server error',
        details: 'An unexpected error occurred while deleting the goal'
      });
    }
  }

  static async getGoalsByCategory(req: Request, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.userId);
      const category = req.params.category;
      
      if (isNaN(userId)) {
        res.status(400).json({ 
          message: 'Invalid user ID',
          details: 'User ID must be a number'
        });
        return;
      }

      if (!category) {
        res.status(400).json({ 
          message: 'Invalid category',
          details: 'Category is required'
        });
        return;
      }
      
      const goals = await GoalModel.getGoalsByCategory(userId, category);
      res.status(200).json(goals);
    } catch (error) {
      console.error('Error getting goals by category:', error);
      res.status(500).json({ 
        message: 'Server error',
        details: 'An unexpected error occurred while fetching goals by category'
      });
    }
  }

  static async getActiveGoals(req: Request, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.userId);
      
      if (isNaN(userId)) {
        res.status(400).json({ 
          message: 'Invalid user ID',
          details: 'User ID must be a number'
        });
        return;
      }

      const goals = await GoalModel.getActiveGoals(userId);
      res.status(200).json(goals);
    } catch (error) {
      console.error('Error getting active goals:', error);
      res.status(500).json({ 
        message: 'Server error',
        details: 'An unexpected error occurred while fetching active goals'
      });
    }
  }
} 