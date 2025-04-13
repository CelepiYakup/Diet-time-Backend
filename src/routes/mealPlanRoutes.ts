import express from 'express';
import { 
  getUserMealPlans, 
  createMealPlan, 
  updateMealPlan, 
  deleteMealPlan,
  deleteMealPlansForDay,
  batchCreateMealPlans
} from '../controllers/mealPlanController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();


router.use(authMiddleware);


router.get('/user/:userId', getUserMealPlans);

router.post('/', createMealPlan);

router.post('/batch', batchCreateMealPlans);

router.patch('/:id', updateMealPlan);

router.delete('/:id', deleteMealPlan);


router.delete('/user/:userId/day/:day', deleteMealPlansForDay);

export default router; 