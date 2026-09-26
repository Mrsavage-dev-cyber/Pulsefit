import type { FoodPreference, Goal } from '../types'

export type DietTier = 'vegan' | 'vegetarian' | 'egg' | 'fish' | 'meat'

export interface IndianFood {
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
  unit: string
  baseQty: number
  diet: DietTier
  containsDairy: boolean
  containsGluten: boolean
}

export type FoodCategory = 'meals' | 'highCalSnacks' | 'lowCalSnacks' | 'desserts'

export const CATEGORY_LABELS: Record<FoodCategory, string> = {
  meals: 'Main meals',
  highCalSnacks: 'High-calorie snacks',
  lowCalSnacks: 'Low-calorie snacks',
  desserts: 'Desserts',
}

type FoodsByGoal = Record<Goal, Record<FoodCategory, IndianFood[]>>

const FOODS: FoodsByGoal = {
  gain_muscle: {
    meals: [
      { name: 'Chicken biryani', calories: 750, protein: 35, carbs: 80, fat: 28, unit: 'g', baseQty: 300, diet: 'meat', containsDairy: true, containsGluten: false },
      { name: 'Mutton biryani', calories: 800, protein: 32, carbs: 75, fat: 38, unit: 'g', baseQty: 300, diet: 'meat', containsDairy: true, containsGluten: false },
      { name: 'Mutton curry', calories: 320, protein: 24, carbs: 8, fat: 22, unit: 'bowl', baseQty: 1, diet: 'meat', containsDairy: true, containsGluten: false },
      { name: 'Butter chicken', calories: 350, protein: 24, carbs: 12, fat: 24, unit: 'bowl', baseQty: 1, diet: 'meat', containsDairy: true, containsGluten: false },
      { name: 'Chicken tikka masala', calories: 320, protein: 26, carbs: 12, fat: 20, unit: 'bowl', baseQty: 1, diet: 'meat', containsDairy: true, containsGluten: false },
      { name: 'Chicken curry', calories: 280, protein: 25, carbs: 10, fat: 16, unit: 'bowl', baseQty: 1, diet: 'meat', containsDairy: true, containsGluten: false },
      { name: 'Fish curry', calories: 220, protein: 22, carbs: 8, fat: 12, unit: 'bowl', baseQty: 1, diet: 'fish', containsDairy: false, containsGluten: false },
      { name: 'Prawn curry', calories: 240, protein: 22, carbs: 8, fat: 14, unit: 'bowl', baseQty: 1, diet: 'fish', containsDairy: false, containsGluten: false },
      { name: 'Egg curry', calories: 260, protein: 16, carbs: 10, fat: 18, unit: 'bowl', baseQty: 1, diet: 'egg', containsDairy: true, containsGluten: false },
      { name: 'Malai kofta', calories: 380, protein: 10, carbs: 25, fat: 28, unit: 'bowl', baseQty: 1, diet: 'vegetarian', containsDairy: true, containsGluten: false },
      { name: 'Paneer butter masala', calories: 320, protein: 14, carbs: 14, fat: 24, unit: 'bowl', baseQty: 1, diet: 'vegetarian', containsDairy: true, containsGluten: false },
      { name: 'Kadai paneer', calories: 300, protein: 15, carbs: 12, fat: 22, unit: 'bowl', baseQty: 1, diet: 'vegetarian', containsDairy: true, containsGluten: false },
      { name: 'Palak paneer', calories: 260, protein: 14, carbs: 10, fat: 18, unit: 'bowl', baseQty: 1, diet: 'vegetarian', containsDairy: true, containsGluten: false },
      { name: 'Dal makhani', calories: 300, protein: 14, carbs: 30, fat: 14, unit: 'bowl', baseQty: 1, diet: 'vegetarian', containsDairy: true, containsGluten: false },
      { name: 'Rajma (kidney bean curry)', calories: 230, protein: 12, carbs: 35, fat: 6, unit: 'bowl', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Chole (chickpea curry)', calories: 250, protein: 12, carbs: 35, fat: 8, unit: 'bowl', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Khichdi', calories: 320, protein: 12, carbs: 55, fat: 6, unit: 'g', baseQty: 300, diet: 'vegetarian', containsDairy: true, containsGluten: false },
      { name: 'Veg pulao', calories: 170, protein: 4, carbs: 28, fat: 5, unit: 'g', baseQty: 100, diet: 'vegetarian', containsDairy: true, containsGluten: false },
      { name: 'Steamed rice', calories: 130, protein: 3, carbs: 28, fat: 0.3, unit: 'g', baseQty: 100, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Butter naan', calories: 260, protein: 7, carbs: 40, fat: 8, unit: 'naan', baseQty: 1, diet: 'vegetarian', containsDairy: true, containsGluten: true },
      { name: 'Roti (chapati)', calories: 90, protein: 3, carbs: 18, fat: 1, unit: 'roti', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: true },
      { name: 'Paneer paratha with butter', calories: 280, protein: 11, carbs: 28, fat: 14, unit: 'paratha', baseQty: 1, diet: 'vegetarian', containsDairy: true, containsGluten: true },
      { name: 'Bhatura', calories: 220, protein: 5, carbs: 28, fat: 10, unit: 'piece', baseQty: 1, diet: 'vegetarian', containsDairy: true, containsGluten: true },
      { name: 'Veg biryani', calories: 550, protein: 12, carbs: 85, fat: 18, unit: 'g', baseQty: 300, diet: 'vegetarian', containsDairy: true, containsGluten: false },
      { name: 'Paneer tikka', calories: 280, protein: 18, carbs: 8, fat: 20, unit: 'plate', baseQty: 1, diet: 'vegetarian', containsDairy: true, containsGluten: false },
      { name: 'Chicken seekh kebab', calories: 320, protein: 28, carbs: 4, fat: 22, unit: 'piece', baseQty: 4, diet: 'meat', containsDairy: true, containsGluten: false },
      { name: 'Mutton keema curry', calories: 340, protein: 26, carbs: 10, fat: 22, unit: 'bowl', baseQty: 1, diet: 'meat', containsDairy: true, containsGluten: false },
      { name: 'Chicken 65', calories: 300, protein: 26, carbs: 10, fat: 18, unit: 'plate', baseQty: 1, diet: 'meat', containsDairy: true, containsGluten: false },
      { name: 'Gobi manchurian', calories: 280, protein: 6, carbs: 30, fat: 14, unit: 'bowl', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: true },
      { name: 'Paneer tikka masala', calories: 330, protein: 16, carbs: 14, fat: 22, unit: 'bowl', baseQty: 1, diet: 'vegetarian', containsDairy: true, containsGluten: false },
      { name: 'Matar paneer', calories: 280, protein: 13, carbs: 16, fat: 18, unit: 'bowl', baseQty: 1, diet: 'vegetarian', containsDairy: true, containsGluten: false },
      { name: 'Paneer bhurji', calories: 260, protein: 15, carbs: 8, fat: 18, unit: 'bowl', baseQty: 1, diet: 'vegetarian', containsDairy: true, containsGluten: false },
      { name: 'Aloo paratha with butter', calories: 220, protein: 5, carbs: 30, fat: 9, unit: 'paratha', baseQty: 1, diet: 'vegetarian', containsDairy: true, containsGluten: true },
      { name: 'Chettinad chicken', calories: 300, protein: 26, carbs: 10, fat: 18, unit: 'bowl', baseQty: 1, diet: 'meat', containsDairy: false, containsGluten: false },
      { name: 'Goan fish curry', calories: 260, protein: 24, carbs: 10, fat: 16, unit: 'bowl', baseQty: 1, diet: 'fish', containsDairy: false, containsGluten: false },
      { name: 'Chingri malai curry (prawn)', calories: 280, protein: 20, carbs: 8, fat: 18, unit: 'bowl', baseQty: 1, diet: 'fish', containsDairy: false, containsGluten: false },
      { name: 'Litti chokha', calories: 380, protein: 10, carbs: 55, fat: 14, unit: 'piece', baseQty: 2, diet: 'vegan', containsDairy: false, containsGluten: true },
      { name: 'Pav bhaji', calories: 450, protein: 10, carbs: 60, fat: 18, unit: 'plate', baseQty: 1, diet: 'vegetarian', containsDairy: true, containsGluten: true },
      { name: 'Misal pav', calories: 400, protein: 14, carbs: 50, fat: 16, unit: 'plate', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: true },
      { name: 'Puttu with kadala curry', calories: 350, protein: 10, carbs: 60, fat: 8, unit: 'plate', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Baati with dal', calories: 380, protein: 8, carbs: 50, fat: 16, unit: 'piece', baseQty: 2, diet: 'vegetarian', containsDairy: true, containsGluten: true },
      { name: 'Egg fried rice', calories: 450, protein: 18, carbs: 60, fat: 12, unit: 'g', baseQty: 300, diet: 'egg', containsDairy: false, containsGluten: true },
      { name: 'Chicken fried rice', calories: 480, protein: 22, carbs: 60, fat: 14, unit: 'g', baseQty: 300, diet: 'meat', containsDairy: false, containsGluten: true },
      { name: 'Avocado toast', calories: 400, protein: 9, carbs: 38, fat: 24, unit: 'slice', baseQty: 2, diet: 'vegan', containsDairy: false, containsGluten: true },
      { name: 'Egg toast', calories: 380, protein: 18, carbs: 32, fat: 20, unit: 'plate', baseQty: 1, diet: 'egg', containsDairy: true, containsGluten: true },
      { name: 'Scrambled eggs (3 eggs, buttered)', calories: 320, protein: 20, carbs: 3, fat: 25, unit: 'egg', baseQty: 3, diet: 'egg', containsDairy: true, containsGluten: false },
      { name: 'Fried egg', calories: 90, protein: 6, carbs: 0, fat: 7, unit: 'egg', baseQty: 1, diet: 'egg', containsDairy: true, containsGluten: false },
      { name: 'Cheese & veggie omelette (3 eggs)', calories: 320, protein: 20, carbs: 4, fat: 24, unit: 'egg', baseQty: 3, diet: 'egg', containsDairy: true, containsGluten: false },
      { name: 'Buttered toast', calories: 220, protein: 5, carbs: 28, fat: 10, unit: 'slice', baseQty: 2, diet: 'vegetarian', containsDairy: true, containsGluten: true },
      { name: 'Toast with jam', calories: 260, protein: 5, carbs: 45, fat: 6, unit: 'slice', baseQty: 2, diet: 'vegan', containsDairy: false, containsGluten: true },
      { name: 'French toast', calories: 350, protein: 12, carbs: 40, fat: 15, unit: 'slice', baseQty: 2, diet: 'egg', containsDairy: true, containsGluten: true },
      { name: 'Bagel with cream cheese', calories: 380, protein: 12, carbs: 50, fat: 15, unit: 'piece', baseQty: 1, diet: 'vegetarian', containsDairy: true, containsGluten: true },
      { name: 'Pancakes with syrup', calories: 420, protein: 8, carbs: 70, fat: 12, unit: 'piece', baseQty: 3, diet: 'egg', containsDairy: true, containsGluten: true },
      { name: 'Waffles with syrup', calories: 400, protein: 7, carbs: 65, fat: 13, unit: 'piece', baseQty: 2, diet: 'egg', containsDairy: true, containsGluten: true },
      { name: 'Bacon', calories: 140, protein: 10, carbs: 0, fat: 11, unit: 'strip', baseQty: 3, diet: 'meat', containsDairy: false, containsGluten: false },
      { name: 'Breakfast sausage', calories: 180, protein: 10, carbs: 2, fat: 15, unit: 'piece', baseQty: 2, diet: 'meat', containsDairy: false, containsGluten: false },
      { name: 'Hash browns', calories: 220, protein: 3, carbs: 28, fat: 12, unit: 'cup', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Mashed potatoes', calories: 210, protein: 4, carbs: 32, fat: 8, unit: 'cup', baseQty: 1, diet: 'vegetarian', containsDairy: true, containsGluten: false },
      { name: 'French fries', calories: 320, protein: 4, carbs: 42, fat: 15, unit: 'cup', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Hummus with pita', calories: 280, protein: 9, carbs: 35, fat: 12, unit: 'plate', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: true },
      { name: 'Oatmeal with peanut butter & banana', calories: 450, protein: 14, carbs: 60, fat: 18, unit: 'bowl', baseQty: 1, diet: 'vegetarian', containsDairy: true, containsGluten: false },
      { name: 'Greek yogurt with granola & honey', calories: 380, protein: 20, carbs: 45, fat: 12, unit: 'bowl', baseQty: 1, diet: 'vegetarian', containsDairy: true, containsGluten: true },
      { name: 'Cereal with whole milk', calories: 320, protein: 10, carbs: 55, fat: 8, unit: 'bowl', baseQty: 1, diet: 'vegetarian', containsDairy: true, containsGluten: true },
      { name: 'Grilled chicken breast', calories: 250, protein: 40, carbs: 0, fat: 9, unit: 'g', baseQty: 150, diet: 'meat', containsDairy: false, containsGluten: false },
      { name: 'Grilled salmon', calories: 350, protein: 34, carbs: 0, fat: 22, unit: 'g', baseQty: 150, diet: 'fish', containsDairy: false, containsGluten: false },
      { name: 'Steak', calories: 480, protein: 42, carbs: 0, fat: 32, unit: 'g', baseQty: 200, diet: 'meat', containsDairy: false, containsGluten: false },
      { name: 'Turkey sandwich', calories: 420, protein: 28, carbs: 40, fat: 16, unit: 'sandwich', baseQty: 1, diet: 'meat', containsDairy: true, containsGluten: true },
      { name: 'Peanut butter banana sandwich', calories: 420, protein: 14, carbs: 55, fat: 18, unit: 'sandwich', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: true },
      { name: 'Pasta alfredo', calories: 600, protein: 18, carbs: 60, fat: 30, unit: 'g', baseQty: 300, diet: 'vegetarian', containsDairy: true, containsGluten: true },
      { name: 'Cheese pizza (2 slices)', calories: 560, protein: 24, carbs: 60, fat: 24, unit: 'slice', baseQty: 2, diet: 'vegetarian', containsDairy: true, containsGluten: true },
      { name: 'Beef burger', calories: 650, protein: 32, carbs: 40, fat: 36, unit: 'piece', baseQty: 1, diet: 'meat', containsDairy: true, containsGluten: true },
      { name: 'Quinoa', calories: 180, protein: 6, carbs: 32, fat: 3, unit: 'g', baseQty: 150, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Brown rice', calories: 165, protein: 4, carbs: 35, fat: 2, unit: 'g', baseQty: 150, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Sweet potato (baked)', calories: 180, protein: 4, carbs: 41, fat: 0, unit: 'piece', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Steel-cut oats', calories: 170, protein: 6, carbs: 30, fat: 3, unit: 'bowl', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Overnight oats with chia & berries', calories: 380, protein: 14, carbs: 55, fat: 12, unit: 'bowl', baseQty: 1, diet: 'vegetarian', containsDairy: true, containsGluten: false },
      { name: 'Whole wheat pasta', calories: 220, protein: 9, carbs: 42, fat: 2, unit: 'g', baseQty: 150, diet: 'vegan', containsDairy: false, containsGluten: true },
      { name: 'Tofu stir-fry', calories: 300, protein: 20, carbs: 18, fat: 16, unit: 'bowl', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Tempeh stir-fry', calories: 330, protein: 25, carbs: 16, fat: 18, unit: 'bowl', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Lentil soup', calories: 240, protein: 16, carbs: 34, fat: 5, unit: 'bowl', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Chickpea salad', calories: 280, protein: 11, carbs: 34, fat: 10, unit: 'cup', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Quinoa salad with vegetables', calories: 320, protein: 9, carbs: 46, fat: 10, unit: 'bowl', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Tuna salad', calories: 260, protein: 28, carbs: 6, fat: 12, unit: 'bowl', baseQty: 1, diet: 'fish', containsDairy: true, containsGluten: false },
      { name: 'Turkey breast (grilled)', calories: 230, protein: 38, carbs: 0, fat: 6, unit: 'g', baseQty: 150, diet: 'meat', containsDairy: false, containsGluten: false },
      { name: 'Egg white omelette', calories: 180, protein: 26, carbs: 6, fat: 3, unit: 'egg', baseQty: 4, diet: 'egg', containsDairy: false, containsGluten: false },
      { name: 'Zucchini noodles with pesto', calories: 220, protein: 7, carbs: 14, fat: 15, unit: 'bowl', baseQty: 1, diet: 'vegetarian', containsDairy: true, containsGluten: false },
    ],
    highCalSnacks: [
      { name: 'Peanut chikki', calories: 350, protein: 10, carbs: 30, fat: 20, unit: 'piece', baseQty: 2, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Protein shake (with milk)', calories: 250, protein: 30, carbs: 15, fat: 6, unit: 'scoop', baseQty: 1, diet: 'vegetarian', containsDairy: true, containsGluten: false },
      { name: 'Protein bar', calories: 280, protein: 20, carbs: 28, fat: 10, unit: 'bar', baseQty: 1, diet: 'vegetarian', containsDairy: true, containsGluten: true },
      { name: 'Peanut butter toast', calories: 320, protein: 10, carbs: 30, fat: 18, unit: 'slice', baseQty: 2, diet: 'vegan', containsDairy: false, containsGluten: true },
      { name: 'Banana peanut butter smoothie', calories: 400, protein: 15, carbs: 45, fat: 18, unit: 'glass', baseQty: 1, diet: 'vegetarian', containsDairy: true, containsGluten: false },
      { name: 'Sattu milkshake', calories: 350, protein: 16, carbs: 45, fat: 10, unit: 'glass', baseQty: 1, diet: 'vegetarian', containsDairy: true, containsGluten: false },
      { name: 'Cheese paratha', calories: 320, protein: 10, carbs: 30, fat: 16, unit: 'paratha', baseQty: 1, diet: 'vegetarian', containsDairy: true, containsGluten: true },
      { name: 'Mixed nuts & dry fruit trail mix', calories: 380, protein: 12, carbs: 20, fat: 28, unit: 'g', baseQty: 40, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Roasted makhana in ghee with nuts', calories: 300, protein: 8, carbs: 25, fat: 18, unit: 'g', baseQty: 30, diet: 'vegetarian', containsDairy: true, containsGluten: false },
      { name: 'Samosa', calories: 260, protein: 5, carbs: 28, fat: 14, unit: 'piece', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: true },
      { name: 'Onion pakora (bhaji)', calories: 300, protein: 6, carbs: 30, fat: 18, unit: 'cup', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Kachori', calories: 220, protein: 4, carbs: 24, fat: 12, unit: 'piece', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: true },
      { name: 'Bread pakora', calories: 200, protein: 5, carbs: 22, fat: 10, unit: 'piece', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: true },
      { name: 'Masala peanuts', calories: 250, protein: 10, carbs: 18, fat: 16, unit: 'cup', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Banana chips', calories: 300, protein: 2, carbs: 32, fat: 20, unit: 'cup', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Sabudana khichdi', calories: 280, protein: 4, carbs: 50, fat: 8, unit: 'bowl', baseQty: 1, diet: 'vegetarian', containsDairy: true, containsGluten: false },
      { name: 'Milk (whole)', calories: 150, protein: 8, carbs: 12, fat: 8, unit: 'glass', baseQty: 1, diet: 'vegetarian', containsDairy: true, containsGluten: false },
      { name: 'Cheese slice', calories: 70, protein: 4, carbs: 1, fat: 6, unit: 'slice', baseQty: 1, diet: 'vegetarian', containsDairy: true, containsGluten: false },
    ],
    lowCalSnacks: [
      { name: 'Roasted chana', calories: 210, protein: 12, carbs: 30, fat: 4, unit: 'cup', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Sprouts chaat', calories: 180, protein: 10, carbs: 25, fat: 3, unit: 'cup', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Boiled eggs (with yolk)', calories: 155, protein: 13, carbs: 1, fat: 11, unit: 'egg', baseQty: 2, diet: 'egg', containsDairy: false, containsGluten: false },
      { name: 'Buttermilk (chaas)', calories: 80, protein: 4, carbs: 6, fat: 3, unit: 'glass', baseQty: 1, diet: 'vegetarian', containsDairy: true, containsGluten: false },
      { name: 'Moong dal chilla', calories: 180, protein: 12, carbs: 20, fat: 5, unit: 'piece', baseQty: 2, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Dhokla', calories: 160, protein: 6, carbs: 24, fat: 4, unit: 'piece', baseQty: 2, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Banana', calories: 105, protein: 1, carbs: 27, fat: 0, unit: 'piece', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Apple', calories: 95, protein: 0, carbs: 25, fat: 0, unit: 'piece', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Cottage cheese bowl', calories: 220, protein: 25, carbs: 8, fat: 9, unit: 'bowl', baseQty: 1, diet: 'vegetarian', containsDairy: true, containsGluten: false },
      { name: 'Steamed broccoli', calories: 55, protein: 4, carbs: 11, fat: 0, unit: 'cup', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Roasted Brussels sprouts', calories: 95, protein: 4, carbs: 13, fat: 4, unit: 'cup', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Spinach salad', calories: 120, protein: 3, carbs: 10, fat: 8, unit: 'bowl', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Kale salad', calories: 130, protein: 4, carbs: 12, fat: 8, unit: 'bowl', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Grilled asparagus', calories: 70, protein: 4, carbs: 7, fat: 4, unit: 'cup', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Cauliflower rice', calories: 45, protein: 3, carbs: 8, fat: 0, unit: 'cup', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Roasted mixed vegetables', calories: 150, protein: 4, carbs: 20, fat: 6, unit: 'cup', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Edamame', calories: 190, protein: 17, carbs: 15, fat: 8, unit: 'cup', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Black bean salad', calories: 220, protein: 12, carbs: 35, fat: 4, unit: 'cup', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Avocado (half)', calories: 120, protein: 1, carbs: 6, fat: 11, unit: 'piece', baseQty: 0.5, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Mixed berries', calories: 70, protein: 1, carbs: 17, fat: 0, unit: 'cup', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Blueberries', calories: 85, protein: 1, carbs: 21, fat: 0, unit: 'cup', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Strawberries', calories: 50, protein: 1, carbs: 12, fat: 0, unit: 'cup', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Orange', calories: 62, protein: 1, carbs: 15, fat: 0, unit: 'piece', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Mango', calories: 100, protein: 1, carbs: 25, fat: 0, unit: 'cup', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Watermelon', calories: 46, protein: 1, carbs: 12, fat: 0, unit: 'cup', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Flaxseed', calories: 55, protein: 2, carbs: 3, fat: 4, unit: 'tbsp', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: false },
    ],
    desserts: [
      { name: 'Chia seed pudding', calories: 180, protein: 6, carbs: 20, fat: 9, unit: 'bowl', baseQty: 1, diet: 'vegetarian', containsDairy: true, containsGluten: false },
      { name: 'Greek yogurt parfait with berries', calories: 280, protein: 18, carbs: 35, fat: 7, unit: 'bowl', baseQty: 1, diet: 'vegetarian', containsDairy: true, containsGluten: false },
      { name: 'Smoothie bowl', calories: 380, protein: 12, carbs: 60, fat: 10, unit: 'bowl', baseQty: 1, diet: 'vegetarian', containsDairy: true, containsGluten: false },
      { name: 'Gulab jamun', calories: 300, protein: 4, carbs: 40, fat: 14, unit: 'piece', baseQty: 2, diet: 'vegetarian', containsDairy: true, containsGluten: true },
      { name: 'Kheer', calories: 280, protein: 7, carbs: 40, fat: 9, unit: 'bowl', baseQty: 1, diet: 'vegetarian', containsDairy: true, containsGluten: false },
      { name: 'Rasmalai', calories: 250, protein: 8, carbs: 28, fat: 11, unit: 'piece', baseQty: 2, diet: 'vegetarian', containsDairy: true, containsGluten: false },
      { name: 'Gajar/suji halwa', calories: 320, protein: 6, carbs: 45, fat: 13, unit: 'bowl', baseQty: 1, diet: 'vegetarian', containsDairy: true, containsGluten: true },
      { name: 'Besan ladoo', calories: 220, protein: 4, carbs: 28, fat: 10, unit: 'piece', baseQty: 2, diet: 'vegetarian', containsDairy: true, containsGluten: false },
      { name: 'Kaju katli', calories: 210, protein: 3, carbs: 26, fat: 10, unit: 'piece', baseQty: 3, diet: 'vegetarian', containsDairy: true, containsGluten: false },
      { name: 'Payasam', calories: 260, protein: 5, carbs: 38, fat: 9, unit: 'bowl', baseQty: 1, diet: 'vegetarian', containsDairy: true, containsGluten: false },
      { name: 'Jalebi', calories: 250, protein: 2, carbs: 45, fat: 8, unit: 'piece', baseQty: 3, diet: 'vegan', containsDairy: false, containsGluten: true },
      { name: 'Modak', calories: 220, protein: 3, carbs: 32, fat: 9, unit: 'piece', baseQty: 2, diet: 'vegetarian', containsDairy: true, containsGluten: false },
      { name: 'Peda', calories: 200, protein: 4, carbs: 26, fat: 9, unit: 'piece', baseQty: 2, diet: 'vegetarian', containsDairy: true, containsGluten: false },
      { name: 'Malpua', calories: 260, protein: 4, carbs: 34, fat: 12, unit: 'piece', baseQty: 2, diet: 'vegetarian', containsDairy: true, containsGluten: true },
      { name: 'Falooda', calories: 300, protein: 6, carbs: 45, fat: 10, unit: 'glass', baseQty: 1, diet: 'vegetarian', containsDairy: true, containsGluten: true },
      { name: 'Sweet lassi', calories: 250, protein: 6, carbs: 35, fat: 9, unit: 'glass', baseQty: 1, diet: 'vegetarian', containsDairy: true, containsGluten: false },
      { name: 'Churma', calories: 300, protein: 4, carbs: 40, fat: 14, unit: 'bowl', baseQty: 1, diet: 'vegetarian', containsDairy: true, containsGluten: true },
    ],
  },
  lose_fat: {
    meals: [
      { name: 'Tandoori chicken', calories: 220, protein: 35, carbs: 3, fat: 8, unit: 'plate', baseQty: 1, diet: 'meat', containsDairy: true, containsGluten: false },
      { name: 'Chicken tikka (skinless)', calories: 280, protein: 38, carbs: 6, fat: 10, unit: 'g', baseQty: 150, diet: 'meat', containsDairy: true, containsGluten: false },
      { name: 'Grilled fish curry (light)', calories: 200, protein: 30, carbs: 6, fat: 8, unit: 'bowl', baseQty: 1, diet: 'fish', containsDairy: false, containsGluten: false },
      { name: 'Fried egg', calories: 90, protein: 6, carbs: 0, fat: 7, unit: 'egg', baseQty: 1, diet: 'egg', containsDairy: true, containsGluten: false },
      { name: 'Dry toast', calories: 90, protein: 3, carbs: 18, fat: 1, unit: 'slice', baseQty: 2, diet: 'vegan', containsDairy: false, containsGluten: true },
      { name: 'Hash browns (small)', calories: 140, protein: 2, carbs: 18, fat: 7, unit: 'cup', baseQty: 0.5, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Baked potato (plain)', calories: 160, protein: 4, carbs: 37, fat: 0, unit: 'piece', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Hummus with pita (small)', calories: 180, protein: 6, carbs: 22, fat: 8, unit: 'plate', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: true },
      { name: 'Chicken curry (light)', calories: 220, protein: 26, carbs: 8, fat: 10, unit: 'bowl', baseQty: 1, diet: 'meat', containsDairy: false, containsGluten: false },
      { name: 'Egg white bhurji', calories: 140, protein: 20, carbs: 4, fat: 4, unit: 'bowl', baseQty: 1, diet: 'egg', containsDairy: false, containsGluten: false },
      { name: 'Dal (light)', calories: 160, protein: 10, carbs: 24, fat: 4, unit: 'bowl', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Sambar', calories: 150, protein: 7, carbs: 22, fat: 4, unit: 'bowl', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Rasam', calories: 90, protein: 4, carbs: 14, fat: 2, unit: 'bowl', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Chana masala (light)', calories: 200, protein: 11, carbs: 30, fat: 5, unit: 'bowl', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Bhindi masala', calories: 150, protein: 4, carbs: 14, fat: 9, unit: 'bowl', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Aloo gobi', calories: 180, protein: 5, carbs: 24, fat: 8, unit: 'bowl', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Baingan bharta', calories: 160, protein: 4, carbs: 16, fat: 9, unit: 'bowl', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Kadhi', calories: 130, protein: 5, carbs: 14, fat: 6, unit: 'bowl', baseQty: 1, diet: 'vegetarian', containsDairy: true, containsGluten: false },
      { name: 'Mixed vegetable curry', calories: 170, protein: 5, carbs: 20, fat: 8, unit: 'bowl', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Vegetable soup with grilled paneer', calories: 250, protein: 18, carbs: 20, fat: 8, unit: 'bowl', baseQty: 1, diet: 'vegetarian', containsDairy: true, containsGluten: false },
      { name: 'Khichdi (light)', calories: 260, protein: 10, carbs: 45, fat: 4, unit: 'g', baseQty: 250, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Steamed rice (small)', calories: 130, protein: 3, carbs: 28, fat: 0.3, unit: 'g', baseQty: 100, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Roti (chapati)', calories: 90, protein: 3, carbs: 18, fat: 1, unit: 'roti', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: true },
      { name: 'Idli', calories: 60, protein: 2, carbs: 12, fat: 0.3, unit: 'idli', baseQty: 2, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Dosa (plain)', calories: 130, protein: 3, carbs: 20, fat: 4, unit: 'dosa', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Masala dosa', calories: 250, protein: 5, carbs: 35, fat: 9, unit: 'dosa', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Pesarattu (moong dal dosa)', calories: 150, protein: 7, carbs: 20, fat: 4, unit: 'dosa', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Idiyappam (string hoppers)', calories: 180, protein: 3, carbs: 38, fat: 2, unit: 'piece', baseQty: 3, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Aloo matar', calories: 160, protein: 5, carbs: 22, fat: 6, unit: 'bowl', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Paneer bhurji (light)', calories: 180, protein: 16, carbs: 6, fat: 10, unit: 'bowl', baseQty: 1, diet: 'vegetarian', containsDairy: true, containsGluten: false },
      { name: 'Vada pav', calories: 290, protein: 7, carbs: 40, fat: 12, unit: 'piece', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: true },
      { name: 'Avocado toast (single slice)', calories: 220, protein: 5, carbs: 20, fat: 13, unit: 'slice', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: true },
      { name: 'Egg white toast', calories: 260, protein: 20, carbs: 30, fat: 4, unit: 'plate', baseQty: 1, diet: 'egg', containsDairy: false, containsGluten: true },
      { name: 'Oatmeal (with water)', calories: 150, protein: 5, carbs: 27, fat: 3, unit: 'bowl', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Greek yogurt with berries', calories: 150, protein: 15, carbs: 15, fat: 3, unit: 'bowl', baseQty: 1, diet: 'vegetarian', containsDairy: true, containsGluten: false },
      { name: 'Grilled chicken breast (plain)', calories: 220, protein: 38, carbs: 0, fat: 6, unit: 'g', baseQty: 150, diet: 'meat', containsDairy: false, containsGluten: false },
      { name: 'Grilled chicken salad', calories: 280, protein: 32, carbs: 12, fat: 10, unit: 'bowl', baseQty: 1, diet: 'meat', containsDairy: false, containsGluten: false },
      { name: 'Grilled salmon (light)', calories: 300, protein: 32, carbs: 0, fat: 18, unit: 'g', baseQty: 150, diet: 'fish', containsDairy: false, containsGluten: false },
      { name: 'Turkey sandwich (light)', calories: 320, protein: 26, carbs: 35, fat: 8, unit: 'sandwich', baseQty: 1, diet: 'meat', containsDairy: true, containsGluten: true },
      { name: 'Veggie burger', calories: 380, protein: 16, carbs: 45, fat: 14, unit: 'piece', baseQty: 1, diet: 'vegetarian', containsDairy: true, containsGluten: true },
      { name: 'Pasta with tomato sauce', calories: 300, protein: 10, carbs: 55, fat: 5, unit: 'g', baseQty: 250, diet: 'vegan', containsDairy: false, containsGluten: true },
      { name: 'Quinoa', calories: 120, protein: 4, carbs: 21, fat: 2, unit: 'g', baseQty: 100, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Brown rice', calories: 110, protein: 3, carbs: 23, fat: 1, unit: 'g', baseQty: 100, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Sweet potato (baked)', calories: 130, protein: 3, carbs: 30, fat: 0, unit: 'piece', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Steel-cut oats', calories: 150, protein: 5, carbs: 27, fat: 3, unit: 'bowl', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Whole wheat pasta (small)', calories: 180, protein: 7, carbs: 34, fat: 2, unit: 'g', baseQty: 120, diet: 'vegan', containsDairy: false, containsGluten: true },
      { name: 'Lentil soup', calories: 200, protein: 14, carbs: 30, fat: 4, unit: 'bowl', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Chickpea salad', calories: 220, protein: 10, carbs: 28, fat: 7, unit: 'cup', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Tuna salad (light)', calories: 200, protein: 28, carbs: 4, fat: 8, unit: 'bowl', baseQty: 1, diet: 'fish', containsDairy: true, containsGluten: false },
      { name: 'Turkey breast (grilled)', calories: 200, protein: 35, carbs: 0, fat: 5, unit: 'g', baseQty: 150, diet: 'meat', containsDairy: false, containsGluten: false },
      { name: 'Egg white omelette', calories: 140, protein: 22, carbs: 4, fat: 2, unit: 'egg', baseQty: 4, diet: 'egg', containsDairy: false, containsGluten: false },
      { name: 'Tofu stir-fry (light)', calories: 220, protein: 18, carbs: 14, fat: 10, unit: 'bowl', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: false },
    ],
    highCalSnacks: [
      { name: 'Roasted makhana', calories: 150, protein: 4, carbs: 18, fat: 6, unit: 'bowl', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Peanut chikki', calories: 150, protein: 5, carbs: 14, fat: 8, unit: 'piece', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Almonds & walnuts', calories: 180, protein: 6, carbs: 6, fat: 16, unit: 'g', baseQty: 20, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Dhokla', calories: 160, protein: 6, carbs: 24, fat: 4, unit: 'piece', baseQty: 2, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Protein shake (with water)', calories: 150, protein: 25, carbs: 6, fat: 2, unit: 'scoop', baseQty: 1, diet: 'vegetarian', containsDairy: true, containsGluten: false },
      { name: 'Protein bar', calories: 200, protein: 18, carbs: 20, fat: 6, unit: 'bar', baseQty: 1, diet: 'vegetarian', containsDairy: true, containsGluten: true },
      { name: 'Almond butter toast', calories: 180, protein: 6, carbs: 16, fat: 10, unit: 'slice', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: true },
    ],
    lowCalSnacks: [
      { name: 'Roasted chana', calories: 110, protein: 7, carbs: 16, fat: 2, unit: 'cup', baseQty: 0.5, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Sprouts salad', calories: 150, protein: 12, carbs: 20, fat: 2, unit: 'cup', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Boiled egg whites', calories: 34, protein: 7, carbs: 0, fat: 0, unit: 'egg', baseQty: 2, diet: 'egg', containsDairy: false, containsGluten: false },
      { name: 'Cucumber & carrot sticks with hung curd dip', calories: 100, protein: 6, carbs: 12, fat: 2, unit: 'g', baseQty: 100, diet: 'vegetarian', containsDairy: true, containsGluten: false },
      { name: 'Buttermilk (chaas)', calories: 60, protein: 3, carbs: 5, fat: 2, unit: 'glass', baseQty: 1, diet: 'vegetarian', containsDairy: true, containsGluten: false },
      { name: 'Vegetable soup', calories: 90, protein: 3, carbs: 14, fat: 2, unit: 'bowl', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Moong dal chilla', calories: 90, protein: 6, carbs: 10, fat: 2.5, unit: 'piece', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Cucumber raita', calories: 70, protein: 3, carbs: 6, fat: 3, unit: 'bowl', baseQty: 1, diet: 'vegetarian', containsDairy: true, containsGluten: false },
      { name: 'Roasted papad', calories: 70, protein: 3, carbs: 10, fat: 2, unit: 'piece', baseQty: 2, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Corn chaat', calories: 150, protein: 4, carbs: 28, fat: 3, unit: 'cup', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Kachumber salad', calories: 60, protein: 2, carbs: 10, fat: 1, unit: 'cup', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Masala chai (light)', calories: 70, protein: 2, carbs: 8, fat: 3, unit: 'glass', baseQty: 1, diet: 'vegetarian', containsDairy: true, containsGluten: false },
      { name: 'Nimbu pani', calories: 60, protein: 0, carbs: 15, fat: 0, unit: 'glass', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Coconut water', calories: 45, protein: 1, carbs: 9, fat: 0, unit: 'glass', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Banana', calories: 105, protein: 1, carbs: 27, fat: 0, unit: 'piece', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Apple', calories: 95, protein: 0, carbs: 25, fat: 0, unit: 'piece', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Cottage cheese bowl', calories: 180, protein: 24, carbs: 6, fat: 6, unit: 'bowl', baseQty: 1, diet: 'vegetarian', containsDairy: true, containsGluten: false },
      { name: 'Milk (skim)', calories: 90, protein: 8, carbs: 12, fat: 0, unit: 'glass', baseQty: 1, diet: 'vegetarian', containsDairy: true, containsGluten: false },
      { name: 'Cheese slice', calories: 70, protein: 4, carbs: 1, fat: 6, unit: 'slice', baseQty: 1, diet: 'vegetarian', containsDairy: true, containsGluten: false },
      { name: 'Steamed broccoli', calories: 55, protein: 4, carbs: 11, fat: 0, unit: 'cup', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Spinach salad', calories: 90, protein: 3, carbs: 8, fat: 5, unit: 'bowl', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Kale salad', calories: 100, protein: 4, carbs: 10, fat: 5, unit: 'bowl', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Grilled asparagus', calories: 60, protein: 4, carbs: 6, fat: 3, unit: 'cup', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Cauliflower rice', calories: 45, protein: 3, carbs: 8, fat: 0, unit: 'cup', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Edamame', calories: 190, protein: 17, carbs: 15, fat: 8, unit: 'cup', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Black bean salad', calories: 200, protein: 11, carbs: 32, fat: 3, unit: 'cup', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Mixed berries', calories: 70, protein: 1, carbs: 17, fat: 0, unit: 'cup', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Blueberries', calories: 85, protein: 1, carbs: 21, fat: 0, unit: 'cup', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Strawberries', calories: 50, protein: 1, carbs: 12, fat: 0, unit: 'cup', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Orange', calories: 62, protein: 1, carbs: 15, fat: 0, unit: 'piece', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Watermelon', calories: 46, protein: 1, carbs: 12, fat: 0, unit: 'cup', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: false },
    ],
    desserts: [
      { name: 'Chia seed pudding', calories: 150, protein: 5, carbs: 16, fat: 7, unit: 'bowl', baseQty: 1, diet: 'vegetarian', containsDairy: true, containsGluten: false },
      { name: 'Greek yogurt parfait with berries', calories: 200, protein: 16, carbs: 24, fat: 5, unit: 'bowl', baseQty: 1, diet: 'vegetarian', containsDairy: true, containsGluten: false },
      { name: 'Fruit chaat (no added sugar)', calories: 120, protein: 2, carbs: 28, fat: 1, unit: 'cup', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Kheer (portion-controlled)', calories: 150, protein: 4, carbs: 22, fat: 5, unit: 'bowl', baseQty: 1, diet: 'vegetarian', containsDairy: true, containsGluten: false },
      { name: 'Dark chocolate', calories: 90, protein: 1, carbs: 8, fat: 6, unit: 'piece', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Baked shrikhand (small)', calories: 140, protein: 6, carbs: 18, fat: 4, unit: 'bowl', baseQty: 1, diet: 'vegetarian', containsDairy: true, containsGluten: false },
      { name: 'Rasgulla', calories: 90, protein: 2, carbs: 18, fat: 1, unit: 'piece', baseQty: 1, diet: 'vegetarian', containsDairy: true, containsGluten: false },
      { name: 'Kulfi (small)', calories: 110, protein: 3, carbs: 14, fat: 5, unit: 'piece', baseQty: 1, diet: 'vegetarian', containsDairy: true, containsGluten: false },
    ],
  },
  maintain: {
    meals: [
      { name: 'Dal tadka', calories: 200, protein: 12, carbs: 28, fat: 6, unit: 'bowl', baseQty: 1, diet: 'vegetarian', containsDairy: true, containsGluten: false },
      { name: 'Dal fry', calories: 210, protein: 11, carbs: 28, fat: 7, unit: 'bowl', baseQty: 1, diet: 'vegetarian', containsDairy: true, containsGluten: false },
      { name: 'Sambar', calories: 150, protein: 7, carbs: 22, fat: 4, unit: 'bowl', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Rajma (kidney bean curry)', calories: 230, protein: 12, carbs: 35, fat: 6, unit: 'bowl', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Chole (chickpea curry)', calories: 250, protein: 12, carbs: 35, fat: 8, unit: 'bowl', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Chicken curry', calories: 280, protein: 25, carbs: 10, fat: 16, unit: 'bowl', baseQty: 1, diet: 'meat', containsDairy: true, containsGluten: false },
      { name: 'Egg curry', calories: 260, protein: 16, carbs: 10, fat: 18, unit: 'bowl', baseQty: 1, diet: 'egg', containsDairy: true, containsGluten: false },
      { name: 'Fish curry', calories: 220, protein: 22, carbs: 8, fat: 12, unit: 'bowl', baseQty: 1, diet: 'fish', containsDairy: false, containsGluten: false },
      { name: 'Bhindi masala', calories: 150, protein: 4, carbs: 14, fat: 9, unit: 'bowl', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Aloo gobi', calories: 180, protein: 5, carbs: 24, fat: 8, unit: 'bowl', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Steamed rice', calories: 130, protein: 3, carbs: 28, fat: 0.3, unit: 'g', baseQty: 100, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Jeera rice', calories: 160, protein: 3, carbs: 28, fat: 4, unit: 'g', baseQty: 100, diet: 'vegetarian', containsDairy: true, containsGluten: false },
      { name: 'Curd rice', calories: 140, protein: 4, carbs: 20, fat: 5, unit: 'g', baseQty: 100, diet: 'vegetarian', containsDairy: true, containsGluten: false },
      { name: 'Lemon rice', calories: 165, protein: 3, carbs: 27, fat: 5, unit: 'g', baseQty: 100, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Khichdi', calories: 320, protein: 12, carbs: 55, fat: 6, unit: 'g', baseQty: 300, diet: 'vegetarian', containsDairy: true, containsGluten: false },
      { name: 'Poha', calories: 250, protein: 6, carbs: 40, fat: 8, unit: 'bowl', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Upma', calories: 260, protein: 6, carbs: 38, fat: 9, unit: 'bowl', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: true },
      { name: 'Roti (chapati)', calories: 90, protein: 3, carbs: 18, fat: 1, unit: 'roti', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: true },
      { name: 'Plain naan', calories: 220, protein: 6, carbs: 38, fat: 5, unit: 'naan', baseQty: 1, diet: 'vegetarian', containsDairy: true, containsGluten: true },
      { name: 'Idli with sambar & chutney', calories: 350, protein: 12, carbs: 55, fat: 8, unit: 'idli', baseQty: 3, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Dosa (plain)', calories: 130, protein: 3, carbs: 20, fat: 4, unit: 'dosa', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Uttapam', calories: 150, protein: 4, carbs: 22, fat: 5, unit: 'piece', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Set dosa', calories: 220, protein: 5, carbs: 32, fat: 7, unit: 'piece', baseQty: 2, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Appam with vegetable stew', calories: 300, protein: 6, carbs: 45, fat: 10, unit: 'plate', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Sarson da saag', calories: 180, protein: 6, carbs: 14, fat: 11, unit: 'bowl', baseQty: 1, diet: 'vegetarian', containsDairy: true, containsGluten: false },
      { name: 'Makki roti', calories: 120, protein: 3, carbs: 22, fat: 2, unit: 'roti', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Aloo posto (poppy seed curry)', calories: 180, protein: 4, carbs: 20, fat: 9, unit: 'bowl', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Shorshe maach (mustard fish)', calories: 240, protein: 24, carbs: 6, fat: 14, unit: 'bowl', baseQty: 1, diet: 'fish', containsDairy: false, containsGluten: false },
      { name: 'Aloo paratha with butter', calories: 220, protein: 5, carbs: 30, fat: 9, unit: 'paratha', baseQty: 1, diet: 'vegetarian', containsDairy: true, containsGluten: true },
      { name: 'Avocado toast', calories: 320, protein: 7, carbs: 33, fat: 18, unit: 'slice', baseQty: 2, diet: 'vegan', containsDairy: false, containsGluten: true },
      { name: 'Egg toast', calories: 340, protein: 16, carbs: 30, fat: 17, unit: 'plate', baseQty: 1, diet: 'egg', containsDairy: true, containsGluten: true },
      { name: 'Scrambled eggs (2 eggs)', calories: 220, protein: 14, carbs: 2, fat: 17, unit: 'egg', baseQty: 2, diet: 'egg', containsDairy: true, containsGluten: false },
      { name: 'Fried egg', calories: 90, protein: 6, carbs: 0, fat: 7, unit: 'egg', baseQty: 1, diet: 'egg', containsDairy: true, containsGluten: false },
      { name: 'Cheese & veggie omelette (2 eggs)', calories: 240, protein: 15, carbs: 3, fat: 18, unit: 'egg', baseQty: 2, diet: 'egg', containsDairy: true, containsGluten: false },
      { name: 'Buttered toast', calories: 200, protein: 4, carbs: 26, fat: 9, unit: 'slice', baseQty: 2, diet: 'vegetarian', containsDairy: true, containsGluten: true },
      { name: 'Toast with jam', calories: 240, protein: 4, carbs: 42, fat: 5, unit: 'slice', baseQty: 2, diet: 'vegan', containsDairy: false, containsGluten: true },
      { name: 'French toast', calories: 320, protein: 11, carbs: 38, fat: 13, unit: 'slice', baseQty: 2, diet: 'egg', containsDairy: true, containsGluten: true },
      { name: 'Bagel with cream cheese', calories: 350, protein: 11, carbs: 46, fat: 14, unit: 'piece', baseQty: 1, diet: 'vegetarian', containsDairy: true, containsGluten: true },
      { name: 'Pancakes with syrup', calories: 380, protein: 7, carbs: 62, fat: 11, unit: 'piece', baseQty: 3, diet: 'egg', containsDairy: true, containsGluten: true },
      { name: 'Waffles with syrup', calories: 360, protein: 6, carbs: 58, fat: 12, unit: 'piece', baseQty: 2, diet: 'egg', containsDairy: true, containsGluten: true },
      { name: 'Bacon', calories: 140, protein: 10, carbs: 0, fat: 11, unit: 'strip', baseQty: 3, diet: 'meat', containsDairy: false, containsGluten: false },
      { name: 'Breakfast sausage', calories: 180, protein: 10, carbs: 2, fat: 15, unit: 'piece', baseQty: 2, diet: 'meat', containsDairy: false, containsGluten: false },
      { name: 'Hash browns', calories: 220, protein: 3, carbs: 28, fat: 12, unit: 'cup', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Mashed potatoes', calories: 210, protein: 4, carbs: 32, fat: 8, unit: 'cup', baseQty: 1, diet: 'vegetarian', containsDairy: true, containsGluten: false },
      { name: 'French fries', calories: 320, protein: 4, carbs: 42, fat: 15, unit: 'cup', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Baked potato (plain)', calories: 160, protein: 4, carbs: 37, fat: 0, unit: 'piece', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Hummus with pita', calories: 280, protein: 9, carbs: 35, fat: 12, unit: 'plate', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: true },
      { name: 'Oatmeal with banana', calories: 280, protein: 8, carbs: 50, fat: 6, unit: 'bowl', baseQty: 1, diet: 'vegetarian', containsDairy: true, containsGluten: false },
      { name: 'Greek yogurt with granola', calories: 300, protein: 16, carbs: 38, fat: 9, unit: 'bowl', baseQty: 1, diet: 'vegetarian', containsDairy: true, containsGluten: true },
      { name: 'Cereal with milk', calories: 300, protein: 9, carbs: 52, fat: 7, unit: 'bowl', baseQty: 1, diet: 'vegetarian', containsDairy: true, containsGluten: true },
      { name: 'Grilled chicken breast', calories: 230, protein: 38, carbs: 0, fat: 7, unit: 'g', baseQty: 150, diet: 'meat', containsDairy: false, containsGluten: false },
      { name: 'Grilled salmon', calories: 300, protein: 32, carbs: 0, fat: 18, unit: 'g', baseQty: 150, diet: 'fish', containsDairy: false, containsGluten: false },
      { name: 'Turkey sandwich', calories: 380, protein: 26, carbs: 38, fat: 12, unit: 'sandwich', baseQty: 1, diet: 'meat', containsDairy: true, containsGluten: true },
      { name: 'Pasta with tomato sauce', calories: 380, protein: 12, carbs: 65, fat: 8, unit: 'g', baseQty: 250, diet: 'vegan', containsDairy: false, containsGluten: true },
      { name: 'Cheese pizza (1 slice)', calories: 280, protein: 12, carbs: 30, fat: 12, unit: 'slice', baseQty: 1, diet: 'vegetarian', containsDairy: true, containsGluten: true },
      { name: 'Quinoa', calories: 150, protein: 5, carbs: 26, fat: 2, unit: 'g', baseQty: 125, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Brown rice', calories: 140, protein: 3, carbs: 29, fat: 1, unit: 'g', baseQty: 125, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Sweet potato (baked)', calories: 160, protein: 4, carbs: 37, fat: 0, unit: 'piece', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Steel-cut oats', calories: 160, protein: 6, carbs: 28, fat: 3, unit: 'bowl', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Overnight oats with chia & berries', calories: 340, protein: 13, carbs: 50, fat: 10, unit: 'bowl', baseQty: 1, diet: 'vegetarian', containsDairy: true, containsGluten: false },
      { name: 'Whole wheat pasta', calories: 200, protein: 8, carbs: 38, fat: 2, unit: 'g', baseQty: 130, diet: 'vegan', containsDairy: false, containsGluten: true },
      { name: 'Tofu stir-fry', calories: 270, protein: 19, carbs: 16, fat: 14, unit: 'bowl', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Lentil soup', calories: 220, protein: 15, carbs: 32, fat: 4, unit: 'bowl', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Chickpea salad', calories: 250, protein: 10, carbs: 32, fat: 8, unit: 'cup', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Tuna salad', calories: 230, protein: 27, carbs: 5, fat: 10, unit: 'bowl', baseQty: 1, diet: 'fish', containsDairy: true, containsGluten: false },
      { name: 'Turkey breast (grilled)', calories: 210, protein: 36, carbs: 0, fat: 5, unit: 'g', baseQty: 150, diet: 'meat', containsDairy: false, containsGluten: false },
      { name: 'Egg white omelette', calories: 160, protein: 24, carbs: 5, fat: 2, unit: 'egg', baseQty: 4, diet: 'egg', containsDairy: false, containsGluten: false },
    ],
    highCalSnacks: [
      { name: 'Roasted makhana with ghee', calories: 220, protein: 6, carbs: 22, fat: 12, unit: 'bowl', baseQty: 1, diet: 'vegetarian', containsDairy: true, containsGluten: false },
      { name: 'Peanut chikki', calories: 200, protein: 6, carbs: 18, fat: 12, unit: 'piece', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Mixed nuts', calories: 250, protein: 8, carbs: 10, fat: 20, unit: 'g', baseQty: 30, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Medu vada', calories: 200, protein: 6, carbs: 22, fat: 10, unit: 'piece', baseQty: 2, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Dhokla', calories: 160, protein: 6, carbs: 24, fat: 4, unit: 'piece', baseQty: 2, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Protein shake', calories: 200, protein: 25, carbs: 10, fat: 4, unit: 'scoop', baseQty: 1, diet: 'vegetarian', containsDairy: true, containsGluten: false },
      { name: 'Protein bar', calories: 220, protein: 18, carbs: 22, fat: 7, unit: 'bar', baseQty: 1, diet: 'vegetarian', containsDairy: true, containsGluten: true },
      { name: 'Granola bar', calories: 150, protein: 3, carbs: 22, fat: 6, unit: 'bar', baseQty: 1, diet: 'vegetarian', containsDairy: true, containsGluten: true },
      { name: 'Peanut butter toast', calories: 260, protein: 8, carbs: 26, fat: 14, unit: 'slice', baseQty: 2, diet: 'vegan', containsDairy: false, containsGluten: true },
    ],
    lowCalSnacks: [
      { name: 'Roasted chana', calories: 110, protein: 7, carbs: 16, fat: 2, unit: 'cup', baseQty: 0.5, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Sprouts chaat', calories: 180, protein: 10, carbs: 25, fat: 3, unit: 'cup', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Buttermilk (chaas)', calories: 80, protein: 4, carbs: 6, fat: 3, unit: 'glass', baseQty: 1, diet: 'vegetarian', containsDairy: true, containsGluten: false },
      { name: 'Vegetable soup', calories: 90, protein: 3, carbs: 14, fat: 2, unit: 'bowl', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Bhel puri', calories: 200, protein: 4, carbs: 32, fat: 6, unit: 'cup', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Corn chaat', calories: 150, protein: 4, carbs: 28, fat: 3, unit: 'cup', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Masala chai', calories: 120, protein: 3, carbs: 14, fat: 5, unit: 'glass', baseQty: 1, diet: 'vegetarian', containsDairy: true, containsGluten: false },
      { name: 'Aam panna', calories: 90, protein: 0, carbs: 22, fat: 0, unit: 'glass', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Banana', calories: 105, protein: 1, carbs: 27, fat: 0, unit: 'piece', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Apple', calories: 95, protein: 0, carbs: 25, fat: 0, unit: 'piece', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Cottage cheese bowl', calories: 200, protein: 24, carbs: 7, fat: 7, unit: 'bowl', baseQty: 1, diet: 'vegetarian', containsDairy: true, containsGluten: false },
      { name: 'Milk (whole)', calories: 150, protein: 8, carbs: 12, fat: 8, unit: 'glass', baseQty: 1, diet: 'vegetarian', containsDairy: true, containsGluten: false },
      { name: 'Cheese slice', calories: 70, protein: 4, carbs: 1, fat: 6, unit: 'slice', baseQty: 1, diet: 'vegetarian', containsDairy: true, containsGluten: false },
      { name: 'Steamed broccoli', calories: 55, protein: 4, carbs: 11, fat: 0, unit: 'cup', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Roasted Brussels sprouts', calories: 95, protein: 4, carbs: 13, fat: 4, unit: 'cup', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Spinach salad', calories: 120, protein: 3, carbs: 10, fat: 8, unit: 'bowl', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Kale salad', calories: 130, protein: 4, carbs: 12, fat: 8, unit: 'bowl', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Grilled asparagus', calories: 70, protein: 4, carbs: 7, fat: 4, unit: 'cup', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Cauliflower rice', calories: 45, protein: 3, carbs: 8, fat: 0, unit: 'cup', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Roasted mixed vegetables', calories: 150, protein: 4, carbs: 20, fat: 6, unit: 'cup', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Edamame', calories: 190, protein: 17, carbs: 15, fat: 8, unit: 'cup', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Black bean salad', calories: 220, protein: 12, carbs: 35, fat: 4, unit: 'cup', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Avocado (half)', calories: 120, protein: 1, carbs: 6, fat: 11, unit: 'piece', baseQty: 0.5, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Mixed berries', calories: 70, protein: 1, carbs: 17, fat: 0, unit: 'cup', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Blueberries', calories: 85, protein: 1, carbs: 21, fat: 0, unit: 'cup', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Strawberries', calories: 50, protein: 1, carbs: 12, fat: 0, unit: 'cup', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Orange', calories: 62, protein: 1, carbs: 15, fat: 0, unit: 'piece', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Mango', calories: 100, protein: 1, carbs: 25, fat: 0, unit: 'cup', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Watermelon', calories: 46, protein: 1, carbs: 12, fat: 0, unit: 'cup', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Flaxseed', calories: 55, protein: 2, carbs: 3, fat: 4, unit: 'tbsp', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: false },
    ],
    desserts: [
      { name: 'Chia seed pudding', calories: 190, protein: 6, carbs: 22, fat: 8, unit: 'bowl', baseQty: 1, diet: 'vegetarian', containsDairy: true, containsGluten: false },
      { name: 'Greek yogurt parfait with berries', calories: 250, protein: 17, carbs: 30, fat: 6, unit: 'bowl', baseQty: 1, diet: 'vegetarian', containsDairy: true, containsGluten: false },
      { name: 'Smoothie bowl', calories: 340, protein: 10, carbs: 55, fat: 8, unit: 'bowl', baseQty: 1, diet: 'vegetarian', containsDairy: true, containsGluten: false },
      { name: 'Kheer', calories: 200, protein: 5, carbs: 30, fat: 6, unit: 'bowl', baseQty: 1, diet: 'vegetarian', containsDairy: true, containsGluten: false },
      { name: 'Gulab jamun', calories: 150, protein: 2, carbs: 20, fat: 7, unit: 'piece', baseQty: 1, diet: 'vegetarian', containsDairy: true, containsGluten: true },
      { name: 'Fruit chaat', calories: 130, protein: 2, carbs: 30, fat: 1, unit: 'cup', baseQty: 1, diet: 'vegan', containsDairy: false, containsGluten: false },
      { name: 'Rasgulla', calories: 90, protein: 2, carbs: 18, fat: 1, unit: 'piece', baseQty: 1, diet: 'vegetarian', containsDairy: true, containsGluten: false },
      { name: 'Barfi', calories: 200, protein: 4, carbs: 24, fat: 10, unit: 'piece', baseQty: 2, diet: 'vegetarian', containsDairy: true, containsGluten: false },
      { name: 'Peda', calories: 200, protein: 4, carbs: 26, fat: 9, unit: 'piece', baseQty: 2, diet: 'vegetarian', containsDairy: true, containsGluten: false },
      { name: 'Sandesh', calories: 160, protein: 6, carbs: 20, fat: 6, unit: 'piece', baseQty: 2, diet: 'vegetarian', containsDairy: true, containsGluten: false },
      { name: 'Coconut ladoo', calories: 200, protein: 3, carbs: 26, fat: 10, unit: 'piece', baseQty: 2, diet: 'vegetarian', containsDairy: true, containsGluten: false },
    ],
  },
}

export function getIndianFoodSections(goal: Goal): Record<FoodCategory, IndianFood[]> {
  return FOODS[goal]
}

export function getAllFoodsForGoal(goal: Goal): IndianFood[] {
  const sections = FOODS[goal]
  return [...sections.meals, ...sections.highCalSnacks, ...sections.lowCalSnacks, ...sections.desserts]
}

export function filterByPreferences(foods: IndianFood[], prefs: FoodPreference[]): IndianFood[] {
  const isVegan = prefs.includes('vegan')
  const isVegetarian = prefs.includes('vegetarian')
  const isPescatarian = prefs.includes('pescatarian')
  const isDairyFree = prefs.includes('dairy_free') || isVegan
  const isGlutenFree = prefs.includes('gluten_free')

  return foods.filter((food) => {
    if (isVegan) {
      if (food.diet !== 'vegan') return false
    } else if (isVegetarian) {
      if (food.diet === 'meat' || food.diet === 'fish' || food.diet === 'egg') return false
    } else if (isPescatarian) {
      if (food.diet === 'meat' || food.diet === 'egg') return false
    }

    if (isDairyFree && food.containsDairy) return false
    if (isGlutenFree && food.containsGluten) return false
    return true
  })
}

export type DietFilter = 'all' | 'veg' | 'vegan' | 'nonveg'

export function filterByDietType(foods: IndianFood[], filter: DietFilter): IndianFood[] {
  if (filter === 'vegan') return foods.filter((f) => f.diet === 'vegan')
  if (filter === 'veg') return foods.filter((f) => f.diet === 'vegan' || f.diet === 'vegetarian')
  if (filter === 'nonveg') return foods.filter((f) => f.diet === 'meat' || f.diet === 'fish' || f.diet === 'egg')
  return foods
}

function matchScore(query: string, name: string): number {
  const q = query.trim().toLowerCase()
  const n = name.toLowerCase()
  if (!q) return 0
  if (n === q) return 100
  if (n.startsWith(q)) return 90
  if (n.includes(q)) return 70

  const qWords = q.split(/\s+/)
  const nWords = n.split(/\s+/)
  const tokenMatches = qWords.filter((w) => nWords.some((nw) => nw.startsWith(w) || nw.includes(w))).length
  if (tokenMatches > 0) return 40 + tokenMatches * 5

  // typo-tolerant fallback: do the query's characters appear in order in the name?
  let qi = 0
  for (let i = 0; i < n.length && qi < q.length; i++) {
    if (n[i] === q[qi]) qi++
  }
  return qi === q.length ? 20 : 0
}

export function searchFoods(query: string, foods: IndianFood[], limit = 4): IndianFood[] {
  return foods
    .map((food) => ({ food, score: matchScore(query, food.name) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.food)
}
