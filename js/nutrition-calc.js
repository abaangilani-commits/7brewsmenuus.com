/**
 * 7 BREW INTERACTIVE NUTRITION & MACRO CALCULATOR
 * Real-time calculations for calories, macros, caffeine, price, and verbal order script
 */

(function () {
  'use strict';

  // Drink Presets Database
  const DRINK_PRESETS = {
    // 7 ORIGINALS
    'blondie': {
      name: 'The Blondie',
      category: '7 Originals',
      defaultMilk: 'breve',
      defaultTemp: 'Iced',
      flavors: 'Caramel & Vanilla',
      cal: { small: 280, medium: 480, large: 560 },
      fat: { small: 16, medium: 26, large: 32 },
      carbs: { small: 23, medium: 44, large: 46 },
      sugar: { small: 20, medium: 38, large: 39 },
      protein: { small: 5, medium: 8, large: 10 },
      caffeine: { small: 120, medium: 120, large: 240 },
      price: { small: 4.50, medium: 5.25, large: 6.25 }
    },
    'brunette': {
      name: 'The Brunette',
      category: '7 Originals',
      defaultMilk: 'breve',
      defaultTemp: 'Iced',
      flavors: 'Caramel & Hazelnut Mocha',
      cal: { small: 250, medium: 370, large: 500 },
      fat: { small: 7, medium: 11, large: 14 },
      carbs: { small: 42, medium: 58, large: 84 },
      sugar: { small: 39, medium: 55, large: 79 },
      protein: { small: 7, medium: 13, large: 14 },
      caffeine: { small: 120, medium: 120, large: 240 },
      price: { small: 4.50, medium: 5.25, large: 6.25 }
    },
    'smooth7': {
      name: 'Smooth 7',
      category: '7 Originals',
      defaultMilk: 'breve',
      defaultTemp: 'Iced',
      flavors: 'White Chocolate & Irish Cream',
      cal: { small: 300, medium: 520, large: 600 },
      fat: { small: 15, medium: 25, large: 31 },
      carbs: { small: 29, medium: 56, large: 58 },
      sugar: { small: 26, medium: 51, large: 52 },
      protein: { small: 6, medium: 9, large: 11 },
      caffeine: { small: 120, medium: 120, large: 240 },
      price: { small: 4.50, medium: 5.25, large: 6.25 }
    },
    'cinnamon-roll': {
      name: 'Cinnamon Roll Breve',
      category: '7 Originals',
      defaultMilk: 'breve',
      defaultTemp: 'Iced',
      flavors: 'White Chocolate & Brown Sugar Cinnamon',
      cal: { small: 290, medium: 500, large: 580 },
      fat: { small: 15, medium: 25, large: 31 },
      carbs: { small: 27, medium: 52, large: 54 },
      sugar: { small: 24, medium: 47, large: 49 },
      protein: { small: 6, medium: 9, large: 11 },
      caffeine: { small: 120, medium: 120, large: 240 },
      price: { small: 4.50, medium: 5.25, large: 6.25 }
    },
    'white-choc-mocha': {
      name: 'White Chocolate Mocha',
      category: '7 Originals',
      defaultMilk: 'breve',
      defaultTemp: 'Iced',
      flavors: 'White Chocolate',
      cal: { small: 260, medium: 370, large: 430 },
      fat: { small: 6, medium: 11, large: 13 },
      carbs: { small: 44, medium: 60, large: 68 },
      sugar: { small: 42, medium: 57, large: 64 },
      protein: { small: 8, medium: 14, large: 16 },
      caffeine: { small: 120, medium: 120, large: 240 },
      price: { small: 4.50, medium: 5.25, large: 6.25 }
    },
    'german-choc': {
      name: 'German Chocolate',
      category: '7 Originals',
      defaultMilk: 'breve',
      defaultTemp: 'Iced',
      flavors: 'Caramel, Coconut & Dark Chocolate',
      cal: { small: 250, medium: 370, large: 430 },
      fat: { small: 7, medium: 11, large: 14 },
      carbs: { small: 44, medium: 59, large: 67 },
      sugar: { small: 41, medium: 56, large: 64 },
      protein: { small: 7, medium: 13, large: 15 },
      caffeine: { small: 120, medium: 120, large: 240 },
      price: { small: 4.50, medium: 5.25, large: 6.25 }
    },
    'sweet-salty': {
      name: 'Sweet & Salty',
      category: '7 Originals',
      defaultMilk: 'breve',
      defaultTemp: 'Iced',
      flavors: 'Salted Caramel & White Chocolate',
      cal: { small: 300, medium: 520, large: 600 },
      fat: { small: 15, medium: 25, large: 31 },
      carbs: { small: 30, medium: 58, large: 60 },
      sugar: { small: 27, medium: 52, large: 54 },
      protein: { small: 6, medium: 9, large: 11 },
      caffeine: { small: 120, medium: 120, large: 240 },
      price: { small: 4.50, medium: 5.25, large: 6.25 }
    },
    'triple7': {
      name: 'Triple 7 Breve (6 Shots)',
      category: '7 Originals',
      defaultMilk: 'breve',
      defaultTemp: 'Iced',
      flavors: 'White Chocolate & Irish Cream',
      cal: { small: 110, medium: 160, large: 210 },
      fat: { small: 0, medium: 0, large: 0 },
      carbs: { small: 28, medium: 42, large: 56 },
      sugar: { small: 26, medium: 39, large: 52 },
      protein: { small: 0, medium: 0, large: 0 },
      caffeine: { small: 76, medium: 114, large: 152 },
      price: { small: 5.50, medium: 6.25, large: 7.25 }
    },

    // CLASSICS & COLD BREW
    'cold-brew': {
      name: 'Craft Cold Brew',
      category: 'Classics',
      defaultMilk: 'none',
      defaultTemp: 'Iced',
      flavors: 'Unsweetened',
      cal: { small: 10, medium: 20, large: 30 },
      fat: { small: 0, medium: 0, large: 0 },
      carbs: { small: 3, medium: 4, large: 5 },
      sugar: { small: 0, medium: 0, large: 0 },
      protein: { small: 0, medium: 1, large: 1 },
      caffeine: { small: 179, medium: 268, large: 357 },
      price: { small: 3.75, medium: 4.50, large: 5.25 }
    },
    'cold-brew-foam': {
      name: 'Cold Brew with Sweet Cream Foam',
      category: 'Classics',
      defaultMilk: 'none',
      defaultTemp: 'Iced',
      flavors: 'Vanilla Cream Foam',
      cal: { small: 115, medium: 120, large: 125 },
      fat: { small: 7, medium: 7, large: 7 },
      carbs: { small: 12, medium: 12, large: 12 },
      sugar: { small: 12, medium: 12, large: 12 },
      protein: { small: 1.5, medium: 2, large: 2.5 },
      caffeine: { small: 160, medium: 240, large: 320 },
      price: { small: 4.75, medium: 5.50, large: 6.25 }
    },
    'classic-latte': {
      name: 'Classic Latte',
      category: 'Classics',
      defaultMilk: 'whole',
      defaultTemp: 'Hot',
      flavors: 'Unsweetened',
      cal: { small: 160, medium: 220, large: 250 },
      fat: { small: 8, medium: 12, large: 13 },
      carbs: { small: 12, medium: 17, large: 19 },
      sugar: { small: 12, medium: 17, large: 19 },
      protein: { small: 8, medium: 12, large: 13 },
      caffeine: { small: 120, medium: 120, large: 240 },
      price: { small: 4.00, medium: 4.75, large: 5.50 }
    },
    'classic-breve': {
      name: 'Classic Breve (Plain)',
      category: 'Classics',
      defaultMilk: 'breve',
      defaultTemp: 'Iced',
      flavors: 'Unsweetened',
      cal: { small: 290, medium: 420, large: 550 },
      fat: { small: 26, medium: 36, large: 48 },
      carbs: { small: 9, medium: 13, large: 18 },
      sugar: { small: 8, medium: 12, large: 16 },
      protein: { small: 6, medium: 8, large: 11 },
      caffeine: { small: 150, medium: 225, large: 300 },
      price: { small: 4.25, medium: 5.00, large: 5.75 }
    },
    'classic-mocha': {
      name: 'Classic Mocha',
      category: 'Classics',
      defaultMilk: 'whole',
      defaultTemp: 'Iced',
      flavors: 'Dark Chocolate Mocha',
      cal: { small: 180, medium: 300, large: 350 },
      fat: { small: 7, medium: 11, large: 14 },
      carbs: { small: 24, medium: 39, large: 47 },
      sugar: { small: 23, medium: 38, large: 45 },
      protein: { small: 8, medium: 14, large: 17 },
      caffeine: { small: 120, medium: 120, large: 240 },
      price: { small: 4.50, medium: 5.25, large: 6.00 }
    },
    'americano': {
      name: 'Iced or Hot Americano',
      category: 'Classics',
      defaultMilk: 'none',
      defaultTemp: 'Iced',
      flavors: 'Unsweetened',
      cal: { small: 0, medium: 0, large: 0 },
      fat: { small: 0, medium: 0, large: 0 },
      carbs: { small: 0, medium: 0, large: 0 },
      sugar: { small: 0, medium: 0, large: 0 },
      protein: { small: 0, medium: 0, large: 0 },
      caffeine: { small: 120, medium: 180, large: 240 },
      price: { small: 3.25, medium: 3.75, large: 4.25 }
    },

    // 7 ENERGY DRINKS
    'ocean-breeze': {
      name: 'Ocean Breeze 7 Energy',
      category: '7 Energy',
      defaultMilk: 'none',
      defaultTemp: 'Iced',
      flavors: 'Blue Raspberry & Coconut',
      cal: { small: 180, medium: 240, large: 360 },
      fat: { small: 0, medium: 0, large: 0 },
      carbs: { small: 47, medium: 61, large: 94 },
      sugar: { small: 45, medium: 58, large: 91 },
      protein: { small: 0, medium: 0, large: 0 },
      caffeine: { small: 67, medium: 105, large: 133 },
      price: { small: 4.50, medium: 5.25, large: 6.25 }
    },
    'pixie-stick': {
      name: 'Pixie Stick 7 Energy',
      category: '7 Energy',
      defaultMilk: 'none',
      defaultTemp: 'Iced',
      flavors: 'Orange, Almond & Pomegranate',
      cal: { small: 170, medium: 230, large: 350 },
      fat: { small: 0, medium: 0, large: 0 },
      carbs: { small: 45, medium: 59, large: 90 },
      sugar: { small: 43, medium: 56, large: 86 },
      protein: { small: 0, medium: 0, large: 0 },
      caffeine: { small: 67, medium: 105, large: 133 },
      price: { small: 4.50, medium: 5.25, large: 6.25 }
    },
    'tigers-blood': {
      name: 'Tigers Blood 7 Energy',
      category: '7 Energy',
      defaultMilk: 'none',
      defaultTemp: 'Iced',
      flavors: 'Strawberry & Coconut',
      cal: { small: 160, medium: 220, large: 290 },
      fat: { small: 0, medium: 0, large: 0 },
      carbs: { small: 40, medium: 55, large: 72 },
      sugar: { small: 38, medium: 52, large: 68 },
      protein: { small: 0, medium: 0, large: 0 },
      caffeine: { small: 160, medium: 240, large: 320 },
      price: { small: 4.50, medium: 5.25, large: 6.25 }
    },
    'sf-energy-base': {
      name: 'Sugar-Free 7 Energy Base',
      category: '7 Energy',
      defaultMilk: 'none',
      defaultTemp: 'Iced',
      flavors: 'Zero Sugar Energy Formula',
      cal: { small: 0, medium: 10, large: 10 },
      fat: { small: 0, medium: 0, large: 0 },
      carbs: { small: 2, medium: 3, large: 4 },
      sugar: { small: 0, medium: 0, large: 0 },
      protein: { small: 0, medium: 0, large: 0 },
      caffeine: { small: 76, medium: 114, large: 152 },
      price: { small: 4.50, medium: 5.25, large: 6.25 }
    },

    // 7 FIZZ SODAS
    'pink-mermaid': {
      name: 'Pink Mermaid 7 Fizz',
      category: '7 Fizz Sodas',
      defaultMilk: 'none',
      defaultTemp: 'Iced',
      flavors: 'Watermelon, Strawberry & Coconut',
      cal: { small: 160, medium: 240, large: 320 },
      fat: { small: 0, medium: 0, large: 0 },
      carbs: { small: 41, medium: 62, large: 82 },
      sugar: { small: 41, medium: 61, large: 81 },
      protein: { small: 0, medium: 0, large: 0 },
      caffeine: { small: 0, medium: 0, large: 0 },
      price: { small: 3.50, medium: 4.25, large: 5.00 }
    },

    // TEAS & MATCHA
    'strawberry-matcha': {
      name: 'Strawberry Matcha Latte',
      category: 'Teas & Matcha',
      defaultMilk: 'whole',
      defaultTemp: 'Iced',
      flavors: 'Matcha Tea & Strawberry',
      cal: { small: 220, medium: 300, large: 380 },
      fat: { small: 5, medium: 8, large: 11 },
      carbs: { small: 41, medium: 52, large: 64 },
      sugar: { small: 40, medium: 52, large: 63 },
      protein: { small: 5, medium: 8, large: 11 },
      caffeine: { small: 11, medium: 17, large: 22 },
      price: { small: 4.75, medium: 5.50, large: 6.50 }
    },
    'chai-latte': {
      name: 'Spiced Chai Tea Latte',
      category: 'Teas & Matcha',
      defaultMilk: 'whole',
      defaultTemp: 'Hot',
      flavors: 'Spiced Chai Concentrate',
      cal: { small: 190, medium: 250, large: 310 },
      fat: { small: 5, medium: 7, large: 8 },
      carbs: { small: 31, medium: 41, large: 51 },
      sugar: { small: 30, medium: 41, large: 51 },
      protein: { small: 5, medium: 7, large: 8 },
      caffeine: { small: 16, medium: 21, large: 26 },
      price: { small: 4.25, medium: 5.00, large: 5.75 }
    },
    'iced-tea': {
      name: 'Iced Black or Green Tea',
      category: 'Teas & Matcha',
      defaultMilk: 'none',
      defaultTemp: 'Iced',
      flavors: 'Fresh Steeped Tea Leaves',
      cal: { small: 0, medium: 0, large: 0 },
      fat: { small: 0, medium: 0, large: 0 },
      carbs: { small: 0, medium: 0, large: 0 },
      sugar: { small: 0, medium: 0, large: 0 },
      protein: { small: 0, medium: 0, large: 0 },
      caffeine: { small: 45, medium: 70, large: 95 },
      price: { small: 2.75, medium: 3.25, large: 3.75 }
    },

    // SMOOTHIES & SHAKES (official guide values, added 2026-10-29)
    'peach-smoothie': {
      name: 'Peach Smoothie',
      category: 'Smoothies & Shakes',
      defaultMilk: 'none',
      defaultTemp: 'Blended Chiller',
      flavors: 'Peach',
      cal: { small: 250, medium: 370, large: 500 },
      fat: { small: 3, medium: 5, large: 7 },
      carbs: { small: 54, medium: 81, large: 109 },
      sugar: { small: 51, medium: 77, large: 102 },
      protein: { small: 2, medium: 3, large: 4 },
      caffeine: { small: 0, medium: 0, large: 0 },
      price: { small: 5.25, medium: 6.25, large: 7.25 }
    },
    'mango-smoothie': {
      name: 'Mango Smoothie',
      category: 'Smoothies & Shakes',
      defaultMilk: 'none',
      defaultTemp: 'Blended Chiller',
      flavors: 'Mango',
      cal: { small: 290, medium: 430, large: 580 },
      fat: { small: 3, medium: 5, large: 7 },
      carbs: { small: 62, medium: 93, large: 125 },
      sugar: { small: 51, medium: 77, large: 102 },
      protein: { small: 2, medium: 3, large: 4 },
      caffeine: { small: 0, medium: 0, large: 0 },
      price: { small: 5.25, medium: 6.25, large: 7.25 }
    },
    'strawberry-smoothie': {
      name: 'Strawberry Smoothie',
      category: 'Smoothies & Shakes',
      defaultMilk: 'none',
      defaultTemp: 'Blended Chiller',
      flavors: 'Strawberry',
      cal: { small: 310, medium: 460, large: 620 },
      fat: { small: 3, medium: 5, large: 7 },
      carbs: { small: 70, medium: 105, large: 141 },
      sugar: { small: 65, medium: 98, large: 130 },
      protein: { small: 2, medium: 3, large: 4 },
      caffeine: { small: 0, medium: 0, large: 0 },
      price: { small: 5.25, medium: 6.25, large: 7.25 }
    },
    'wildberry-smoothie': {
      name: 'Wildberry Smoothie',
      category: 'Smoothies & Shakes',
      defaultMilk: 'none',
      defaultTemp: 'Blended Chiller',
      flavors: 'Mixed Wild Berries',
      cal: { small: 310, medium: 460, large: 620 },
      fat: { small: 3, medium: 5, large: 7 },
      carbs: { small: 70, medium: 105, large: 141 },
      sugar: { small: 59, medium: 89, large: 118 },
      protein: { small: 2, medium: 3, large: 4 },
      caffeine: { small: 0, medium: 0, large: 0 },
      price: { small: 5.25, medium: 6.25, large: 7.25 }
    },
    'blueberry-pom-smoothie': {
      name: 'Blueberry Pomegranate Smoothie',
      category: 'Smoothies & Shakes',
      defaultMilk: 'none',
      defaultTemp: 'Blended Chiller',
      flavors: 'Blueberry & Pomegranate',
      cal: { small: 310, medium: 470, large: 630 },
      fat: { small: 3, medium: 5, large: 7 },
      carbs: { small: 73, medium: 109, large: 145 },
      sugar: { small: 69, medium: 103, large: 138 },
      protein: { small: 2, medium: 3, large: 4 },
      caffeine: { small: 0, medium: 0, large: 0 },
      price: { small: 5.25, medium: 6.25, large: 7.25 }
    },
    'tiki-tango-smoothie': {
      name: 'Tiki Tango Mango Smoothie',
      category: 'Smoothies & Shakes',
      defaultMilk: 'none',
      defaultTemp: 'Blended Chiller',
      flavors: 'Pineapple & Passion Fruit',
      cal: { small: 330, medium: 470, large: 650 },
      fat: { small: 3, medium: 5, large: 7 },
      carbs: { small: 73, medium: 104, large: 146 },
      sugar: { small: 63, medium: 89, large: 126 },
      protein: { small: 2, medium: 3, large: 4 },
      caffeine: { small: 0, medium: 0, large: 0 },
      price: { small: 5.25, medium: 6.25, large: 7.25 }
    },
    'strawberry-banana-smoothie': {
      name: 'Strawberry Banana Smoothie',
      category: 'Smoothies & Shakes',
      defaultMilk: 'none',
      defaultTemp: 'Blended Chiller',
      flavors: 'Strawberry & Banana',
      cal: { small: 340, medium: 500, large: 690 },
      fat: { small: 3, medium: 5, large: 7 },
      carbs: { small: 79, medium: 115, large: 159 },
      sugar: { small: 75, medium: 107, large: 150 },
      protein: { small: 2, medium: 3, large: 4 },
      caffeine: { small: 0, medium: 0, large: 0 },
      price: { small: 5.25, medium: 6.25, large: 7.25 }
    },
    'blackberry-cobbler-smoothie': {
      name: 'Blackberry Cobbler Wildberry Smoothie',
      category: 'Smoothies & Shakes',
      defaultMilk: 'none',
      defaultTemp: 'Blended Chiller',
      flavors: 'Blackberry & Wildberry',
      cal: { small: 360, medium: 510, large: 720 },
      fat: { small: 3, medium: 5, large: 7 },
      carbs: { small: 83, medium: 118, large: 165 },
      sugar: { small: 72, medium: 101, large: 144 },
      protein: { small: 2, medium: 3, large: 5 },
      caffeine: { small: 0, medium: 0, large: 0 },
      price: { small: 5.25, medium: 6.25, large: 7.25 }
    },
    'pina-colada-smoothie': {
      name: 'Piña Colada Smoothie',
      category: 'Smoothies & Shakes',
      defaultMilk: 'none',
      defaultTemp: 'Blended Chiller',
      flavors: 'Pineapple & Coconut',
      cal: { small: 470, medium: 700, large: 940 },
      fat: { small: 15, medium: 23, large: 31 },
      carbs: { small: 80, medium: 120, large: 161 },
      sugar: { small: 75, medium: 113, large: 150 },
      protein: { small: 4, medium: 6, large: 8 },
      caffeine: { small: 0, medium: 0, large: 0 },
      price: { small: 5.25, medium: 6.25, large: 7.25 }
    },
    'tigers-blood-smoothie': {
      name: 'Tiger\'s Blood Piña Colada Smoothie',
      category: 'Smoothies & Shakes',
      defaultMilk: 'none',
      defaultTemp: 'Blended Chiller',
      flavors: 'Tiger\'s Blood, Pineapple & Coconut',
      cal: { small: 480, medium: 720, large: 970 },
      fat: { small: 13, medium: 21, large: 27 },
      carbs: { small: 90, medium: 130, large: 180 },
      sugar: { small: 85, medium: 122, large: 170 },
      protein: { small: 4, medium: 5, large: 7 },
      caffeine: { small: 0, medium: 0, large: 0 },
      price: { small: 5.25, medium: 6.25, large: 7.25 }
    },
    'classic-shake': {
      name: 'Classic Shake',
      category: 'Smoothies & Shakes',
      defaultMilk: 'none',
      defaultTemp: 'Blended Chiller',
      flavors: 'Classic Ice Cream Base',
      cal: { small: 270, medium: 410, large: 540 },
      fat: { small: 13, medium: 20, large: 26 },
      carbs: { small: 41, medium: 62, large: 82 },
      sugar: { small: 36, medium: 54, large: 72 },
      protein: { small: 8, medium: 11, large: 15 },
      caffeine: { small: 0, medium: 0, large: 0 },
      price: { small: 5.25, medium: 6.25, large: 7.25 }
    },
    'birthday-cake-shake': {
      name: 'Birthday Cake Shake',
      category: 'Smoothies & Shakes',
      defaultMilk: 'none',
      defaultTemp: 'Blended Chiller',
      flavors: 'Birthday Cake',
      cal: { small: 400, medium: 600, large: 800 },
      fat: { small: 10, medium: 15, large: 21 },
      carbs: { small: 79, medium: 118, large: 158 },
      sugar: { small: 72, medium: 108, large: 144 },
      protein: { small: 7, medium: 10, large: 14 },
      caffeine: { small: 0, medium: 0, large: 0 },
      price: { small: 5.25, medium: 6.25, large: 7.25 }
    },
    'cookies-cream-shake': {
      name: 'Cookies & Cream Shake',
      category: 'Smoothies & Shakes',
      defaultMilk: 'none',
      defaultTemp: 'Blended Chiller',
      flavors: 'Cookies & Cream',
      cal: { small: 400, medium: 600, large: 800 },
      fat: { small: 11, medium: 16, large: 21 },
      carbs: { small: 79, medium: 119, large: 158 },
      sugar: { small: 72, medium: 108, large: 144 },
      protein: { small: 7, medium: 10, large: 14 },
      caffeine: { small: 0, medium: 0, large: 0 },
      price: { small: 5.25, medium: 6.25, large: 7.25 }
    },
    'orange-sherbet-shake': {
      name: 'Orange Sherbet Shake',
      category: 'Smoothies & Shakes',
      defaultMilk: 'none',
      defaultTemp: 'Blended Chiller',
      flavors: 'Orange Sherbet',
      cal: { small: 370, medium: 560, large: 750 },
      fat: { small: 10, medium: 15, large: 20 },
      carbs: { small: 74, medium: 112, large: 149 },
      sugar: { small: 70, medium: 105, large: 140 },
      protein: { small: 6, medium: 8, large: 11 },
      caffeine: { small: 0, medium: 0, large: 0 },
      price: { small: 5.25, medium: 6.25, large: 7.25 }
    },
    'rocky-road-shake': {
      name: 'Rocky Road Shake',
      category: 'Smoothies & Shakes',
      defaultMilk: 'none',
      defaultTemp: 'Blended Chiller',
      flavors: 'Chocolate, Toasted Marshmallow & Hazelnut',
      cal: { small: 470, medium: 700, large: 940 },
      fat: { small: 11, medium: 17, large: 23 },
      carbs: { small: 95, medium: 143, large: 191 },
      sugar: { small: 88, medium: 133, large: 177 },
      protein: { small: 6, medium: 9, large: 12 },
      caffeine: { small: 0, medium: 0, large: 0 },
      price: { small: 5.25, medium: 6.25, large: 7.25 }
    },
    'sf-rocky-road-shake': {
      name: 'Sugar-Free Rocky Road Shake',
      category: 'Smoothies & Shakes',
      defaultMilk: 'none',
      defaultTemp: 'Blended Chiller',
      flavors: 'Sugar-Free Chocolate, Marshmallow & Hazelnut',
      cal: { small: 260, medium: 390, large: 520 },
      fat: { small: 11, medium: 17, large: 22 },
      carbs: { small: 44, medium: 66, large: 88 },
      sugar: { small: 27, medium: 41, large: 55 },
      protein: { small: 6, medium: 9, large: 11 },
      caffeine: { small: 0, medium: 0, large: 0 },
      price: { small: 5.25, medium: 6.25, large: 7.25 }
    }
  };

  DRINK_PRESETS['cookie-butter'] = {
    name: 'Cookie Butter',
    category: '7 Originals',
    defaultMilk: 'breve',
    defaultTemp: 'Iced',
    flavors: 'Toasted Marshmallow, Hazelnut & White Chocolate',
    cal: { small: 290, medium: 490, large: 570 },
    fat: { small: 15, medium: 24, large: 30 },
    carbs: { small: 26, medium: 50, large: 52 },
    sugar: { small: 24, medium: 46, large: 47 },
    protein: { small: 5, medium: 9, large: 11 },
    caffeine: { small: 120, medium: 120, large: 240 },
    price: { small: 4.50, medium: 5.25, large: 6.25 }
  };
  DRINK_PRESETS['banana-bread'] = {
    name: 'Banana Bread',
    category: '7 Originals',
    defaultMilk: 'breve',
    defaultTemp: 'Iced',
    flavors: 'Banana & Hazelnut Mocha',
    cal: { small: 220, medium: 340, large: 450 },
    fat: { small: 6, medium: 10, large: 11 },
    carbs: { small: 39, medium: 54, large: 77 },
    sugar: { small: 38, medium: 53, large: 76 },
    protein: { small: 7, medium: 12, large: 14 },
    caffeine: { small: 120, medium: 120, large: 240 },
    price: { small: 4.50, medium: 5.25, large: 6.25 }
  };

  // Milk Adjustments Relative to Breve Half-and-Half
  const MILK_DIFF_FROM_BREVE = {
    'breve': {
      cal: { small: 0, medium: 0, large: 0 },
      fat: { small: 0, medium: 0, large: 0 },
      carbs: { small: 0, medium: 0, large: 0 },
      protein: { small: 0, medium: 0, large: 0 }
    },
    'whole': {
      cal: { small: -130, medium: -190, large: -255 },
      fat: { small: -19, medium: -27, large: -36 },
      carbs: { small: 2, medium: 3, large: 4 },
      protein: { small: 1, medium: 2, large: 3 }
    },
    'skim': {
      cal: { small: -175, medium: -260, large: -345 },
      fat: { small: -26, medium: -36, large: -48 },
      carbs: { small: 3, medium: 4, large: 5 },
      protein: { small: 1, medium: 2, large: 3 }
    },
    'oat': {
      cal: { small: -140, medium: -215, large: -285 },
      fat: { small: -22, medium: -31, large: -41 },
      carbs: { small: 7, medium: 11, large: 14 },
      protein: { small: -4, medium: -5, large: -7 }
    },
    'almond': {
      cal: { small: -210, medium: -315, large: -420 },
      fat: { small: -23, medium: -32, large: -43 },
      carbs: { small: -7, medium: -10, large: -13 },
      protein: { small: -5, medium: -6, large: -9 }
    },
    'coconut': {
      cal: { small: -185, medium: -280, large: -375 },
      fat: { small: -22, medium: -30, large: -40 },
      carbs: { small: -2, medium: -3, large: -4 },
      protein: { small: -6, medium: -8, large: -11 }
    },
    'heavy-cream': {
      cal: { small: -80, medium: -120, large: -150 },
      fat: { small: -12, medium: -18, large: -22 },
      carbs: { small: -6, medium: -8, large: -11 },
      protein: { small: -4, medium: -6, large: -8 }
    },
    'none': {
      cal: { small: -240, medium: -360, large: -480 },
      fat: { small: -26, medium: -36, large: -48 },
      carbs: { small: -8, medium: -12, large: -16 },
      protein: { small: -6, medium: -8, large: -11 }
    }
  };

  // Add-ons Nutrition specs
  const ADDONS = {
    'cold-foam': { name: 'Sweet Cream Cold Foam', cal: 110, fat: 7, carbs: 12, sugar: 12, protein: 1, price: 1.00, caffeine: 0 },
    'whipped-cream': { name: 'Whipped Cream', cal: 70, fat: 7, carbs: 2, sugar: 2, protein: 0.5, price: 0.00, caffeine: 0 },
    'caramel-drizzle': { name: 'Caramel Drizzle Wall', cal: 45, fat: 0, carbs: 11, sugar: 10, protein: 0, price: 0.50, caffeine: 0 },
    'mocha-drizzle': { name: 'Mocha Chocolate Drizzle', cal: 40, fat: 1, carbs: 9, sugar: 8, protein: 0, price: 0.50, caffeine: 0 },
    'extra-shot': { name: 'Extra Espresso Shot', cal: 5, fat: 0, carbs: 1, sugar: 0, protein: 0.5, price: 0.75, caffeine: 75 },
    'protein-boost': { name: 'Protein Boost', cal: 90, fat: 0, carbs: 4, sugar: 0, protein: 15, price: 2.00, caffeine: 0 }
  };

  // DOM Elements
  document.addEventListener('DOMContentLoaded', () => {
    const drinkSelect = document.getElementById('calcDrinkSelect');
    const sizePills = document.querySelectorAll('[data-calc-size]');
    const tempPills = document.querySelectorAll('[data-calc-temp]');
    const milkSelect = document.getElementById('calcMilkSelect');
    const sweetnessSelect = document.getElementById('calcSweetnessSelect');
    const addonCheckboxes = document.querySelectorAll('.calc-addon-check');

    // Output Elements
    const caloriesVal = document.getElementById('calcOutputCalories');
    const fatVal = document.getElementById('calcOutputFat');
    const carbsVal = document.getElementById('calcOutputCarbs');
    const netCarbsVal = document.getElementById('calcOutputNetCarbs');
    const sugarVal = document.getElementById('calcOutputSugar');
    const proteinVal = document.getElementById('calcOutputProtein');
    const caffeineVal = document.getElementById('calcOutputCaffeine');
    const priceVal = document.getElementById('calcOutputPrice');
    const dietTagsContainer = document.getElementById('calcDietTags');
    const scriptText = document.getElementById('calcScriptText');
    const copyBtn = document.getElementById('calcCopyBtn');

    if (!drinkSelect) return;

    // State
    let currentDrinkId = 'blondie';
    let currentSize = 'medium';
    let currentTemp = 'Iced';
    let currentMilk = 'breve';
    let currentSweetness = 'standard';
    let selectedAddons = [];

    // Size Pill Click
    sizePills.forEach(pill => {
      pill.addEventListener('click', () => {
        sizePills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        currentSize = pill.dataset.calcSize;
        calculateNutrition();
      });
    });

    // Temp Pill Click
    tempPills.forEach(pill => {
      pill.addEventListener('click', () => {
        tempPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        currentTemp = pill.dataset.calcTemp;
        calculateNutrition();
      });
    });

    // Drink Select Change
    drinkSelect.addEventListener('change', (e) => {
      currentDrinkId = e.target.value;
      const preset = DRINK_PRESETS[currentDrinkId];
      if (preset && preset.defaultMilk) {
        currentMilk = preset.defaultMilk;
        if (milkSelect) milkSelect.value = currentMilk;
      }
      calculateNutrition();
    });

    // Milk Select Change
    if (milkSelect) {
      milkSelect.addEventListener('change', (e) => {
        currentMilk = e.target.value;
        calculateNutrition();
      });
    }

    // Sweetness Select Change
    if (sweetnessSelect) {
      sweetnessSelect.addEventListener('change', (e) => {
        currentSweetness = e.target.value;
        calculateNutrition();
      });
    }

    // Addons Change
    addonCheckboxes.forEach(cb => {
      cb.addEventListener('change', () => {
        selectedAddons = Array.from(addonCheckboxes)
          .filter(c => c.checked)
          .map(c => c.value);
        calculateNutrition();
      });
    });

    // Calculate Function
    function calculateNutrition() {
      const drink = DRINK_PRESETS[currentDrinkId] || DRINK_PRESETS['blondie'];
      const size = currentSize; // 'small', 'medium', 'large'

      let cal = drink.cal[size];
      let fat = drink.fat[size];
      let carbs = drink.carbs[size];
      let sugar = drink.sugar[size];
      let protein = drink.protein[size];
      let caffeine = drink.caffeine[size];
      let price = drink.price[size];
      const officialNames = {'blondie':'Blondie Breve','cookie-butter':'Cookie Butter Breve','banana-bread':'Banana Bread Mocha','brunette':'Brunette Mocha','smooth7':'Smooth 7 Breve','cinnamon-roll':'Cinnamon Roll Breve','sweet-salty':'Sweet & Salty Breve'};
      const officialName = officialNames[currentDrinkId];
      const officialTemp = currentTemp === 'Blended Chiller' ? 'Frozen Chiller' : currentTemp;
      const lookupName = (currentSweetness === 'sugar-free' ? 'Sugar-Free ' : '') + officialName;
      const official = typeof OFFICIAL_NUTRITION !== 'undefined' && OFFICIAL_NUTRITION.find(r => r.name === lookupName && r.size === size && r.temperature === officialTemp);
      if (official) { cal=official.calories;fat=official.fat;carbs=official.carbs;sugar=official.sugar;protein=official.protein;caffeine=official.caffeine; }


      // Milk Adjustments
      if (drink.defaultMilk === 'breve' && currentMilk !== 'breve') {
        const diff = MILK_DIFF_FROM_BREVE[currentMilk];
        if (diff) {
          cal += diff.cal[size];
          fat += diff.fat[size];
          carbs += diff.carbs[size];
          protein += diff.protein[size];
        }
      } else if (drink.defaultMilk === 'whole' && currentMilk !== 'whole') {
        if (currentMilk === 'almond') {
          cal -= (size === 'small' ? 80 : size === 'medium' ? 125 : 165);
          fat -= (size === 'small' ? 4 : size === 'medium' ? 6 : 8);
          carbs -= (size === 'small' ? 8 : size === 'medium' ? 12 : 16);
        } else if (currentMilk === 'oat') {
          cal += (size === 'small' ? 10 : size === 'medium' ? 15 : 20);
          carbs += (size === 'small' ? 4 : size === 'medium' ? 6 : 8);
        } else if (currentMilk === 'skim') {
          cal -= (size === 'small' ? 50 : size === 'medium' ? 80 : 110);
          fat -= (size === 'small' ? 7 : size === 'medium' ? 11 : 15);
        } else if (currentMilk === 'breve') {
          cal += (size === 'small' ? 130 : size === 'medium' ? 190 : 255);
          fat += (size === 'small' ? 19 : size === 'medium' ? 27 : 36);
        }
      } else if (drink.defaultMilk === 'none' && currentMilk !== 'none') {
        if (currentMilk === 'heavy-cream') {
          cal += 100;
          fat += 11;
          carbs += 1;
          protein += 1;
        } else if (currentMilk === 'almond') {
          cal += 30;
          fat += 2.5;
          carbs += 1;
        } else if (currentMilk === 'oat') {
          cal += 60;
          fat += 2;
          carbs += 9;
        } else if (currentMilk === 'breve') {
          cal += 160;
          fat += 14;
          carbs += 5;
          protein += 3;
        }
      }

      // Sweetness & Syrup Adjustments
      if (currentSweetness === 'half') {
        const deduction = (size === 'small' ? 20 : size === 'medium' ? 30 : 40);
        const carbDeduct = (size === 'small' ? 5 : size === 'medium' ? 7.5 : 10);
        cal = Math.max(10, cal - deduction);
        carbs = Math.max(1, carbs - carbDeduct);
        sugar = Math.max(0, sugar - carbDeduct);
      } else if (currentSweetness === 'quarter') {
        const deduction = (size === 'small' ? 30 : size === 'medium' ? 45 : 60);
        const carbDeduct = (size === 'small' ? 7.5 : size === 'medium' ? 11 : 15);
        cal = Math.max(10, cal - deduction);
        carbs = Math.max(1, carbs - carbDeduct);
        sugar = Math.max(0, sugar - carbDeduct);
      } else if (currentSweetness === 'sugar-free' && !official) {
        const deduction = (size === 'small' ? 40 : size === 'medium' ? 60 : 80);
        const carbDeduct = (size === 'small' ? 10 : size === 'medium' ? 15 : 20);
        cal = Math.max(10, cal - deduction);
        carbs = Math.max(1, carbs - carbDeduct);
        sugar = Math.max(0, sugar - carbDeduct);
      } else if (currentSweetness === 'unsweetened') {
        const deduction = (size === 'small' ? 40 : size === 'medium' ? 60 : 80);
        const carbDeduct = (size === 'small' ? 10 : size === 'medium' ? 15 : 20);
        cal = Math.max(5, cal - deduction);
        carbs = Math.max(0, carbs - carbDeduct);
        sugar = Math.max(0, sugar - carbDeduct);
      }

      // Temperature adjustment (Chiller)
      if (currentTemp === 'Blended Chiller' && !official) {
        cal += 40;
        carbs += 8;
        sugar += 8;
        price += 0.50;
      }

      // Add-ons
      selectedAddons.forEach(addonId => {
        const addon = ADDONS[addonId];
        if (addon) {
          cal += addon.cal;
          fat += addon.fat;
          carbs += addon.carbs;
          sugar += addon.sugar;
          protein += addon.protein;
          price += addon.price;
          caffeine += addon.caffeine;
        }
      });

      // Clamp negative values
      cal = Math.max(5, Math.round(cal));
      fat = Math.max(0, Math.round(fat * 10) / 10);
      carbs = Math.max(0, Math.round(carbs * 10) / 10);
      sugar = Math.max(0, Math.round(sugar * 10) / 10);
      protein = Math.max(0, Math.round(protein * 10) / 10);
      caffeine = Math.max(0, Math.round(caffeine));

      // Net Carbs (fiber assumed ~0g except oat ~1g)
      let fiber = official ? official.fiber : (currentMilk === 'oat' ? 1.5 : 0);
      let netCarbs = Math.max(0, Math.round((carbs - fiber) * 10) / 10);

      const matchedStandard = official && currentMilk === drink.defaultMilk && ['regular','standard','sugar-free'].includes(currentSweetness) && selectedAddons.length === 0;
      const marker = matchedStandard ? '' : '~';
      // Render Outputs
      if (caloriesVal) caloriesVal.textContent = marker + cal;
      if (fatVal) fatVal.textContent = `${fat}g`;
      if (carbsVal) carbsVal.textContent = `${carbs}g`;
      if (netCarbsVal) netCarbsVal.textContent = `${netCarbs}g`;
      if (sugarVal) sugarVal.textContent = `${sugar}g`;
      if (proteinVal) proteinVal.textContent = `${protein}g`;
      if (caffeineVal) caffeineVal.textContent = `${caffeine} mg`;
      if (priceVal) priceVal.textContent = `~$${price.toFixed(2)}`;

      // Render Dietary Badges
      if (dietTagsContainer) dietTagsContainer.textContent = matchedStandard ? 'Official standard recipe · June 2026 nutrition guide. Price is estimated.' : 'Custom recipe estimate, not an official nutrition result. Confirm ingredients and dietary suitability with your stand.';

      // Generate Order Script
      generateOrderScript(drink.name, size, currentTemp, currentMilk, currentSweetness, selectedAddons);
    }

    function renderDietTags(cal, netCarbs, sugar, caffeine, milk) {
      if (!dietTagsContainer) return;
      const tags = [];

      if (netCarbs <= 4) {
        tags.push('<span class="nutrition-diet-tag keto">🥑 Keto Friendly (&le;4g Net Carbs)</span>');
      }
      if (sugar <= 2) {
        tags.push('<span class="nutrition-diet-tag sugar-free">✨ Zero / Low Sugar</span>');
      }
      if (['oat', 'almond', 'coconut', 'none'].includes(milk)) {
        tags.push('<span class="nutrition-diet-tag dairy-free">🌱 Dairy-Free Option</span>');
      }
      if (cal <= 120) {
        tags.push('<span class="nutrition-diet-tag low-cal">🟢 Low Calorie (&le;120 kcal)</span>');
      }
      if (caffeine >= 200) {
        tags.push('<span class="nutrition-diet-tag high-caffeine">⚡ High Caffeine (200mg+)</span>');
      } else if (caffeine === 0) {
        tags.push('<span class="nutrition-diet-tag low-cal">💤 Caffeine-Free</span>');
      }

      dietTagsContainer.innerHTML = tags.join('');
    }

    function generateOrderScript(drinkName, size, temp, milk, sweetness, addons) {
      if (!scriptText) return;
      const sizeCapitalized = size.charAt(0).toUpperCase() + size.slice(1);

      let milkPhrase = '';
      if (milk === 'oat') milkPhrase = ' with Oat Milk';
      else if (milk === 'almond') milkPhrase = ' with Almond Milk';
      else if (milk === 'coconut') milkPhrase = ' with Coconut Milk';
      else if (milk === 'skim') milkPhrase = ' with Skim Milk';
      else if (milk === 'whole') milkPhrase = ' with Whole Milk';
      else if (milk === 'heavy-cream') milkPhrase = ' with a splash of Heavy Cream';
      else if (milk === 'breve') milkPhrase = ' made Breve';

      let sweetPhrase = '';
      if (sweetness === 'half') sweetPhrase = ', half sweet';
      else if (sweetness === 'quarter') sweetPhrase = ', quarter sweet';
      else if (sweetness === 'sugar-free') sweetPhrase = ', made with Sugar-Free syrups';
      else if (sweetness === 'unsweetened') sweetPhrase = ', unsweetened';

      let addonPhrases = addons.map(id => {
        if (id === 'cold-foam') return 'topped with Sweet Cream Cold Foam';
        if (id === 'whipped-cream') return 'with Whipped Cream';
        if (id === 'caramel-drizzle') return 'with Caramel Drizzle';
        if (id === 'mocha-drizzle') return 'with Mocha Drizzle';
        if (id === 'extra-shot') return 'with an Extra Espresso Shot';
        return '';
      }).filter(Boolean);

      let addonString = addonPhrases.length ? `, ${addonPhrases.join(' and ')}` : '';

      const script = `Can I get a ${sizeCapitalized} ${temp} ${drinkName}${milkPhrase}${sweetPhrase}${addonString}?`;
      scriptText.textContent = `"${script}"`;
    }

    // Copy script button
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        const text = scriptText.textContent.replace(/^"|"$/g, '');
        navigator.clipboard.writeText(text).then(() => {
          const originalText = copyBtn.innerHTML;
          copyBtn.innerHTML = '✓ Copied to Clipboard!';
          setTimeout(() => {
            copyBtn.innerHTML = originalText;
          }, 2500);
        }).catch(() => {
          alert('Order script ready to read at the drive-thru window!');
        });
      });
    }

    // Initial run
    calculateNutrition();
  });
})();
