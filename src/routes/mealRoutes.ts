import express from 'express';
import { MealController } from '../controllers/mealController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

router.use(authMiddleware);


router.get('/:id', MealController.getMealById);


router.get('/user/:userId', MealController.getMealsByUserId);


router.get('/user/:userId/date-range', MealController.getMealsByDateRange);


router.post('/', MealController.createMeal);


router.put('/:id', MealController.updateMeal);


router.delete('/:id', MealController.deleteMeal);

export default router; 