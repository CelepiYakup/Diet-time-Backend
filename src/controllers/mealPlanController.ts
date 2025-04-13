import { Request, Response } from "express";
import MealPlanModel from "../models/mealPlan";

export const getUserMealPlans = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    if (req.user && req.user.id !== parseInt(userId)) {
      return res
        .status(403)
        .json({
          message: "Access denied. You can only view your own meal plans.",
        });
    }

    const mealPlans = await MealPlanModel.findAllByUserId(parseInt(userId));

    return res.status(200).json(mealPlans);
  } catch (error) {
    console.error("Error fetching user meal plans:", error);
    return res.status(500).json({ message: "Failed to fetch meal plans" });
  }
};

export const createMealPlan = async (req: Request, res: Response) => {
  try {
    const { user_id, meal_id, day, meal_time } = req.body;

    if (!user_id || !meal_id || !day || !meal_time) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (req.user && req.user.id !== parseInt(user_id)) {
      return res
        .status(403)
        .json({
          message:
            "Access denied. You can only create meal plans for yourself.",
        });
    }
    const expiration_date = await MealPlanModel.calculateNextMonday();

    const mealPlan = await MealPlanModel.create({
      user_id,
      meal_id,
      day,
      meal_time,
      expiration_date
    });

    return res.status(201).json({
      message: "Meal plan created successfully",
      mealPlan,
    });
  } catch (error) {
    console.error("Error creating meal plan:", error);
    return res.status(500).json({ message: "Failed to create meal plan" });
  }
};


export const batchCreateMealPlans = async (req: Request, res: Response) => {
  try {
    const { userId, mealPlans } = req.body;

    if (!userId || !mealPlans || !Array.isArray(mealPlans) || mealPlans.length === 0) {
      return res.status(400).json({ message: "Invalid request format or empty meal plans array" });
    }

    if (req.user && req.user.id !== parseInt(userId)) {
      return res
        .status(403)
        .json({
          message: "Access denied. You can only create meal plans for yourself.",
        });
    }


    const expiration_date = await MealPlanModel.calculateNextMonday();


    const createdMealPlans = [];
    for (const plan of mealPlans) {
      const meal_id = plan.meal_id || plan.mealId;
      const day = plan.day;
      const meal_time = plan.meal_time || plan.mealTime;
      
      if (!meal_id || !day || !meal_time) {
        console.warn("Skipping invalid meal plan entry:", plan);
        continue;
      }

      const mealPlan = await MealPlanModel.create({
        user_id: parseInt(userId),
        meal_id: parseInt(meal_id),
        day,
        meal_time,
        expiration_date
      });

      createdMealPlans.push(mealPlan);
    }

    return res.status(201).json(createdMealPlans);
  } catch (error) {
    console.error("Error batch creating meal plans:", error);
    return res.status(500).json({ message: "Failed to create meal plans" });
  }
};

export const updateMealPlan = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { user_id, meal_id, day, meal_time } = req.body;

    const existingMealPlan = await MealPlanModel.findById(parseInt(id));

    if (!existingMealPlan) {
      return res.status(404).json({ message: "Meal plan not found" });
    }

    if (req.user && req.user.id !== existingMealPlan.user_id) {
      return res
        .status(403)
        .json({
          message: "Access denied. You can only update your own meal plans.",
        });
    }

    // Calculate the expiration date (next Monday at 00:00)
    const expiration_date = await MealPlanModel.calculateNextMonday();

    const mealPlan = await MealPlanModel.update(parseInt(id), {
      user_id: user_id ? parseInt(user_id) : undefined,
      meal_id: meal_id ? parseInt(meal_id) : undefined,
      day,
      meal_time,
      expiration_date
    });

    if (!mealPlan) {
      return res.status(404).json({ message: "Meal plan not found" });
    }

    return res.status(200).json({
      message: "Meal plan updated successfully",
      mealPlan,
    });
  } catch (error) {
    console.error("Error updating meal plan:", error);
    return res.status(500).json({ message: "Failed to update meal plan" });
  }
};

export const deleteMealPlan = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const existingMealPlan = await MealPlanModel.findById(parseInt(id));

    if (!existingMealPlan) {
      return res.status(404).json({ message: "Meal plan not found" });
    }

    if (req.user && req.user.id !== existingMealPlan.user_id) {
      return res
        .status(403)
        .json({
          message: "Access denied. You can only delete your own meal plans.",
        });
    }

    const deleted = await MealPlanModel.delete(parseInt(id));

    if (!deleted) {
      return res.status(404).json({ message: "Meal plan not found" });
    }

    return res.status(200).json({ message: "Meal plan deleted successfully" });
  } catch (error) {
    console.error("Error deleting meal plan:", error);
    return res.status(500).json({ message: "Failed to delete meal plan" });
  }
};

export const deleteMealPlansForDay = async (req: Request, res: Response) => {
  try {
    const { userId, day } = req.params;

    if (req.user && req.user.id !== parseInt(userId)) {
      return res
        .status(403)
        .json({
          message: "Access denied. You can only delete your own meal plans.",
        });
    }

    const deleted = await MealPlanModel.deleteByDayAndUser(
      parseInt(userId),
      day
    );

    if (deleted === 0) {
      return res
        .status(404)
        .json({ message: `No meal plans found for ${day}` });
    }

    return res.status(200).json({
      message: `Successfully deleted ${deleted} meal plans for  ${day}`,
    });
  } catch (error) {
    console.error(`Error deleting meal plans for day:`, error);
    return res
      .status(500)
      .json({ message: "Failed to delete meal plans for day" });
  }
};
