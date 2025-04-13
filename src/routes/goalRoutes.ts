import express from 'express';
import { GoalController } from '../controllers/goalController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();


router.use(authMiddleware);


router.post('/', GoalController.createGoal);

router.get('/user/:userId', GoalController.getGoalsByUserId);


router.get('/:goalId', GoalController.getGoalById);


router.put('/:goalId', GoalController.updateGoal);


router.delete('/:goalId', GoalController.deleteGoal);


router.get('/user/:userId/category/:category', GoalController.getGoalsByCategory);


router.get('/user/:userId/active', GoalController.getActiveGoals);

export default router; 