// Prices are estimates; nutrition sources are labelled per item.
const MENU_DATA = {
  "metadata": {
    "lastVerified": "Editorial review: September 21, 2026; names checked against the official drive-thru menu board; prices unverified",
    "locationsCount": "Featured stands",
    "statesCount": "Selected markets",
    "nonDairyPolicy": "Confirm milk options and any surcharge at your stand.",
    "disclaimer": "Illustrative estimates. Stand prices, taxes and surcharges vary.",
    "nutritionNote": "Calories and caffeine come from 7 Brew's published nutrition guide where the drink appears in it; drinks without published figures show none. Prices remain estimates."
  },
  "categories": [
    {
      "id": "all",
      "name": "All Drinks",
      "icon": "✨",
      "calRange": "Check official nutrition"
    },
    {
      "id": "originals",
      "name": "7 Originals",
      "icon": "☕",
      "calRange": "Check official nutrition"
    },
    {
      "id": "classics",
      "name": "Classics",
      "icon": "🥤",
      "calRange": "Check official nutrition"
    },
    {
      "id": "energy",
      "name": "7 Energy",
      "icon": "⚡",
      "calRange": "Check official nutrition"
    },
    {
      "id": "fizz",
      "name": "7 Fizz Sodas",
      "icon": "🫧",
      "calRange": "Check official nutrition"
    },
    {
      "id": "teas-matcha",
      "name": "Teas & Matcha",
      "icon": "🍵",
      "calRange": "Check official nutrition"
    },
    {
      "id": "lemonades",
      "name": "Lemonades",
      "icon": "🍋",
      "calRange": "Check official nutrition"
    },
    {
      "id": "smoothies",
      "name": "Smoothies",
      "icon": "🍓",
      "calRange": "Check official nutrition"
    },
    {
      "id": "shakes",
      "name": "Shakes & Treats",
      "icon": "🍦",
      "calRange": "Check official nutrition"
    },
    {
      "id": "secret-menu",
      "name": "Secret Menu",
      "icon": "🤫",
      "calRange": "Check official nutrition"
    }
  ],
  "sizes": {
    "iced": [
      {
        "key": "small",
        "name": "Small",
        "oz": "16 oz",
        "desc": "Standard on-the-go refresh"
      },
      {
        "key": "medium",
        "name": "Medium",
        "oz": "24 oz",
        "desc": "Most popular daily driver"
      },
      {
        "key": "large",
        "name": "Large",
        "oz": "32 oz",
        "desc": "Maximum caffeine and hydration"
      }
    ],
    "hot": [
      {
        "key": "small",
        "name": "Small",
        "oz": "12 oz",
        "desc": "Double shot rich warm balance"
      },
      {
        "key": "medium",
        "name": "Medium",
        "oz": "16 oz",
        "desc": "Double shot comforting cup"
      },
      {
        "key": "large",
        "name": "Large",
        "oz": "20 oz",
        "desc": "Quad shot velvety warmth"
      }
    ],
    "chiller": [
      {
        "key": "small",
        "name": "Small",
        "oz": "16 oz",
        "desc": "Blended frozen espresso shake"
      },
      {
        "key": "medium",
        "name": "Medium",
        "oz": "24 oz",
        "desc": "Crowd favorite sweet chiller"
      },
      {
        "key": "large",
        "name": "Large",
        "oz": "32 oz",
        "desc": "Ultimate blended dessert treat"
      }
    ]
  },
  "milkOptions": [
    {
      "id": "whole",
      "name": "Whole Milk",
      "isDairy": true,
      "isDefault": false
    },
    {
      "id": "breve",
      "name": "Breve (Half and Half)",
      "isDairy": true,
      "isDefault": true
    },
    {
      "id": "skim",
      "name": "Skim / Nonfat Milk",
      "isDairy": true,
      "isDefault": false
    },
    {
      "id": "oat",
      "name": "Oat Milk",
      "isDairy": false,
      "isDefault": false
    },
    {
      "id": "almond",
      "name": "Almond Milk",
      "isDairy": false,
      "isDefault": false
    },
    {
      "id": "coconut",
      "name": "Coconut Milk",
      "isDairy": false,
      "isDefault": false
    }
  ],
  "flavorCombos": [
    {
      "id": "pink-paradise",
      "name": "Pink Paradise",
      "syrupIds": [
        "cherry",
        "watermelon",
        "raspberry"
      ],
      "formula": "Cherry + Watermelon + Raspberry",
      "category": "energy",
      "bestBase": "Lemonade, 7 Fizz, or 7 Energy",
      "taste": "Sweet tart vibrant pink fruit punch"
    },
    {
      "id": "tropic-thunder",
      "name": "Tropic Thunder",
      "syrupIds": [
        "mango",
        "pineapple"
      ],
      "formula": "Mango + Pineapple",
      "category": "energy",
      "bestBase": "Lemonade, Iced Tea, or 7 Energy",
      "taste": "Sun-drenched tropical citrus and golden peach"
    },
    {
      "id": "blackberry-cobbler",
      "name": "Blackberry Cobbler",
      "syrupIds": [
        "blackberry",
        "cupcake",
        "white-chocolate"
      ],
      "formula": "Blackberry + Cupcake + White Chocolate",
      "category": "energy",
      "bestBase": "Lemonade, Chiller, or Shake",
      "taste": "Warm blackberry pastry with sweet cream drizzle"
    },
    {
      "id": "blue-lagoon",
      "name": "Blue Lagoon (confirm combination)",
      "syrupIds": [
        "blue-raspberry",
        "lime",
        "coconut-syrup"
      ],
      "formula": "Blue Raspberry + Lime + Coconut",
      "category": "energy",
      "bestBase": "7 Fizz Soda or 7 Energy",
      "taste": "Electric cyan tropical citrus coconut refresher"
    },
    {
      "id": "peaches-n-cream",
      "name": "Peaches 'n' Cream (confirm combination)",
      "syrupIds": [
        "peach",
        "vanilla"
      ],
      "formula": "Peach + Vanilla (+ Cream Float)",
      "category": "energy",
      "bestBase": "7 Fizz Italian Soda",
      "taste": "Juicy orchard peach cream soda with velvety finish"
    },
    {
      "id": "strawberry-shortcake",
      "name": "Strawberry Shortcake (confirm combination)",
      "syrupIds": [
        "strawberry",
        "vanilla",
        "white-chocolate"
      ],
      "formula": "Strawberry + Vanilla + White Chocolate",
      "category": "energy",
      "bestBase": "7 Fizz Soda or Shake",
      "taste": "Sweet strawberry glazed bakery shortcake"
    },
    {
      "id": "cotton-candy",
      "name": "Cotton Candy",
      "syrupIds": [
        "blue-raspberry",
        "watermelon",
        "vanilla"
      ],
      "formula": "Blue Raspberry + Watermelon + Vanilla",
      "category": "energy",
      "bestBase": "7 Fizz Soda or 7 Energy",
      "taste": "Carnival spun blue sugar and sweet cream"
    },
    {
      "id": "bubblegum",
      "name": "Bubblegum (confirm combination)",
      "syrupIds": [
        "banana",
        "strawberry"
      ],
      "formula": "Banana + Strawberry",
      "category": "energy",
      "bestBase": "7 Fizz Soda",
      "taste": "Classic nostalgic sweet pink bubblegum"
    },
    {
      "id": "banana-bread",
      "name": "Banana Bread",
      "syrupIds": [
        "banana",
        "hazelnut-mocha"
      ],
      "formula": "Banana + Hazelnut Mocha",
      "category": "coffee",
      "bestBase": "Mocha, Breve, or Latte",
      "taste": "Warm freshly baked nutty banana bread"
    },
    {
      "id": "german-chocolate",
      "name": "German Chocolate (confirm combination)",
      "syrupIds": [
        "caramel",
        "coconut-syrup",
        "dark-chocolate"
      ],
      "formula": "Caramel + Coconut + Dark Chocolate",
      "category": "coffee",
      "bestBase": "Mocha or Breve",
      "taste": "Rich chocolate coconut fudge with caramel swirl"
    },
    {
      "id": "cookie-butter",
      "name": "Cookie Butter (confirm combination)",
      "syrupIds": [
        "toasted-marshmallow",
        "hazelnut",
        "white-chocolate"
      ],
      "formula": "Toasted Marshmallow + Hazelnut + White Chocolate",
      "category": "coffee",
      "bestBase": "Breve, Latte, or Chiller",
      "taste": "Belgian speculoos cookie spread with sweet warmth"
    },
    {
      "id": "butterbeer",
      "name": "Butterbeer (confirm combination)",
      "syrupIds": [
        "caramel",
        "vanilla",
        "brown-sugar-cin"
      ],
      "formula": "Caramel + Vanilla + Brown Sugar Cinnamon",
      "category": "coffee",
      "bestBase": "Iced Breve or Cold Brew",
      "taste": "Rich creamy butterscotch and spiced brown sugar"
    },
    {
      "id": "snickerdoodle",
      "name": "Snickerdoodle",
      "syrupIds": [
        "brown-sugar-cinnamon",
        "vanilla-mocha"
      ],
      "formula": "Brown Sugar Cinnamon + Vanilla Mocha",
      "category": "coffee",
      "bestBase": "Hot or Iced Latte",
      "taste": "Warm cinnamon sugar bakery cookie"
    },
    {
      "id": "funnel-cake",
      "name": "Funnel Cake",
      "syrupIds": [
        "white-chocolate",
        "vanilla",
        "salted-caramel-macchiato"
      ],
      "formula": "White Chocolate + Vanilla + Salted Caramel Macchiato",
      "category": "coffee",
      "bestBase": "Breve, Chiller, or Latte",
      "taste": "Fried carnival dough with warm vanilla sugar"
    },
    {
      "id": "salted-nut-roll",
      "name": "Salted Nut Roll (confirm combination)",
      "syrupIds": [
        "salted-caramel",
        "hazelnut"
      ],
      "formula": "Salted Caramel + Hazelnut",
      "category": "coffee",
      "bestBase": "Breve or Cold Brew",
      "taste": "Savory salted caramel candy bar with roasted nut"
    },
    {
      "id": "campfire-smores",
      "name": "Campfire S'mores (confirm combination)",
      "syrupIds": [
        "toasted-marshmallow",
        "dark-chocolate"
      ],
      "formula": "Toasted Marshmallow + Dark Chocolate",
      "category": "coffee",
      "bestBase": "Mocha or Hot Cocoa",
      "taste": "Graham marshmallow and melted dark chocolate"
    },
    {
      "id": "almond-joy",
      "name": "Almond Joy (confirm combination)",
      "syrupIds": [
        "hazelnut",
        "coconut-syrup",
        "dark-chocolate"
      ],
      "formula": "Hazelnut + Coconut + Dark Chocolate",
      "category": "coffee",
      "bestBase": "Mocha or Breve",
      "taste": "Classic coconut candy bar with chocolate and nut"
    },
    {
      "id": "white-zombie",
      "name": "White Zombie (confirm combination)",
      "syrupIds": [
        "white-chocolate",
        "vanilla"
      ],
      "formula": "White Chocolate + Vanilla",
      "category": "coffee",
      "bestBase": "Breve, Latte, or Cold Brew",
      "taste": "Ultra-velvety double sweet cream and vanilla"
    },
    {
      "id": "nightshade",
      "name": "Nightshade",
      "syrupIds": [
        "lavender",
        "pomegranate",
        "blue-raspberry"
      ],
      "formula": "Lavender + Pomegranate + Blue Raspberry",
      "category": "energy",
      "bestBase": "7 Energy or 7 Fizz",
      "taste": "Dark floral berry with an electric citrus bite"
    },
    {
      "id": "tigers-blood",
      "name": "Tiger's Blood",
      "syrupIds": [
        "coconut",
        "strawberry"
      ],
      "formula": "Coconut + Strawberry",
      "category": "energy",
      "bestBase": "7 Energy or 7 Fizz Soda",
      "taste": "Classic shaved ice sweet strawberry coconut melon"
    },
    {
      "id": "ocean-breeze",
      "name": "Ocean Breeze",
      "syrupIds": [
        "blue-raspberry",
        "coconut"
      ],
      "formula": "Blue Raspberry + Coconut",
      "category": "energy",
      "bestBase": "7 Energy or 7 Fizz",
      "taste": "Refreshing tropical blue berry with cool coconut"
    },
    {
      "id": "georgia-peach",
      "name": "Georgia Peach",
      "syrupIds": [
        "peach",
        "strawberry"
      ],
      "formula": "Peach + Strawberry",
      "category": "energy",
      "bestBase": "7 Energy, Iced Tea, or 7 Fizz",
      "taste": "Sweet southern orchard peach and ripe berry"
    },
    {
      "id": "pixie-stick",
      "name": "Pixie Stick",
      "syrupIds": [
        "almond",
        "orange",
        "pomegranate"
      ],
      "formula": "Almond + Orange + Pomegranate",
      "category": "energy",
      "bestBase": "7 Energy",
      "taste": "Tangy sweet powdery candy straw punch"
    },
    {
      "id": "pink-mermaid",
      "name": "Pink Mermaid",
      "syrupIds": [
        "watermelon",
        "coconut",
        "strawberry"
      ],
      "formula": "Watermelon + Coconut + Strawberry",
      "category": "energy",
      "bestBase": "7 Fizz Soda or 7 Energy",
      "taste": "Fizzy sweet pink melon punch with creamy coconut finish"
    },
    {
      "id": "firecracker",
      "name": "Firecracker",
      "syrupIds": [
        "orange",
        "pomegranate",
        "raspberry"
      ],
      "formula": "Orange + Pomegranate + Raspberry",
      "category": "energy",
      "bestBase": "7 Energy",
      "taste": "Bold explosive tart fruit punch"
    },
    {
      "id": "key-lime-pie",
      "name": "Key Lime Pie",
      "syrupIds": [
        "lime",
        "lemon-concentrate",
        "white-chocolate"
      ],
      "formula": "Lime + Lemon Concentrate + White Chocolate",
      "category": "energy",
      "bestBase": "7 Energy Chiller or 7 Fizz",
      "taste": "Tart tropical lime balanced by sweet creamy pastry"
    },
    {
      "id": "midnight",
      "name": "Midnight",
      "syrupIds": [
        "blackberry",
        "blue-raspberry"
      ],
      "formula": "Blackberry + Blue Raspberry",
      "category": "energy",
      "bestBase": "7 Energy or Black Tea",
      "taste": "Deep dark mountain berry blast"
    },
    {
      "id": "island-dream",
      "name": "Island Dream",
      "syrupIds": [
        "pineapple",
        "coconut",
        "vanilla"
      ],
      "formula": "Pineapple + Coconut + Vanilla",
      "category": "energy",
      "bestBase": "7 Energy, Smoothie, or 7 Fizz",
      "taste": "Tropical pina colada vibes with bright pineapple"
    },
    {
      "id": "watermelon-sugar",
      "name": "Watermelon Sugar (confirm combination)",
      "syrupIds": [
        "watermelon",
        "strawberry"
      ],
      "formula": "Watermelon + Strawberry",
      "category": "energy",
      "bestBase": "7 Energy or 7 Fizz",
      "taste": "Summertime juicy candied melon and ripe berry"
    },
    {
      "id": "cherry-blossom",
      "name": "Cherry Blossom",
      "syrupIds": [
        "cherry",
        "peach"
      ],
      "formula": "Cherry + Peach",
      "category": "energy",
      "bestBase": "7 Fizz Soda or 7 Energy",
      "taste": "Fountain cherry cola style with smooth vanilla cream"
    },
    {
      "id": "passion-punch",
      "name": "Passion Punch (confirm combination)",
      "syrupIds": [
        "passionfruit",
        "strawberry",
        "orange"
      ],
      "formula": "Passionfruit + Strawberry + Orange",
      "category": "energy",
      "bestBase": "7 Energy or Green Tea",
      "taste": "Exotic tropical citrus punch"
    },
    {
      "id": "wildberry",
      "name": "Wildberry (confirm combination)",
      "syrupIds": [
        "strawberry",
        "blackberry"
      ],
      "formula": "Strawberry + Blackberry",
      "category": "energy",
      "bestBase": "7 Energy or Iced Black Tea",
      "taste": "Sun-ripened orchard berries with balanced tart sweetness"
    }
  ],
  "syrupFlavors": [
    {
      "id": "almond",
      "name": "Almond",
      "isSf": false,
      "category": "flavor"
    },
    {
      "id": "banana",
      "name": "Banana",
      "isSf": false,
      "category": "flavor"
    },
    {
      "id": "sf-banana",
      "name": "Sugar-Free Banana",
      "isSf": true,
      "category": "flavor"
    },
    {
      "id": "brown-sugar-cinnamon",
      "name": "Brown Sugar Cinnamon",
      "isSf": false,
      "category": "flavor"
    },
    {
      "id": "sf-brown-sugar-cinnamon",
      "name": "Sugar-Free Brown Sugar Cinnamon",
      "isSf": true,
      "category": "flavor"
    },
    {
      "id": "blackberry",
      "name": "Blackberry",
      "isSf": false,
      "category": "flavor"
    },
    {
      "id": "blue-raspberry",
      "name": "Blue Raspberry",
      "isSf": false,
      "category": "flavor"
    },
    {
      "id": "sf-blue-raspberry",
      "name": "Sugar-Free Blue Raspberry",
      "isSf": true,
      "category": "flavor"
    },
    {
      "id": "cane-sugar",
      "name": "Cane Sugar",
      "isSf": false,
      "category": "flavor"
    },
    {
      "id": "caramel",
      "name": "Caramel",
      "isSf": false,
      "category": "flavor"
    },
    {
      "id": "sf-caramel",
      "name": "Sugar-Free Caramel",
      "isSf": true,
      "category": "flavor"
    },
    {
      "id": "cherry",
      "name": "Cherry",
      "isSf": false,
      "category": "flavor"
    },
    {
      "id": "chocolate-macadamia",
      "name": "Chocolate Macadamia",
      "isSf": false,
      "category": "flavor"
    },
    {
      "id": "coconut",
      "name": "Coconut",
      "isSf": false,
      "category": "flavor"
    },
    {
      "id": "sf-coconut",
      "name": "Sugar-Free Coconut",
      "isSf": true,
      "category": "flavor"
    },
    {
      "id": "cupcake",
      "name": "Cupcake",
      "isSf": false,
      "category": "flavor"
    },
    {
      "id": "dark-chocolate",
      "name": "Dark Chocolate",
      "isSf": false,
      "category": "flavor"
    },
    {
      "id": "sf-dark-chocolate",
      "name": "Sugar-Free Dark Chocolate",
      "isSf": true,
      "category": "flavor"
    },
    {
      "id": "green-apple",
      "name": "Green Apple",
      "isSf": false,
      "category": "flavor"
    },
    {
      "id": "guava",
      "name": "Guava",
      "isSf": false,
      "category": "flavor"
    },
    {
      "id": "hazelnut",
      "name": "Hazelnut",
      "isSf": false,
      "category": "flavor"
    },
    {
      "id": "sf-hazelnut",
      "name": "Sugar-Free Hazelnut",
      "isSf": true,
      "category": "flavor"
    },
    {
      "id": "honey",
      "name": "Honey",
      "isSf": false,
      "category": "flavor"
    },
    {
      "id": "irish-cream",
      "name": "Irish Cream",
      "isSf": false,
      "category": "flavor"
    },
    {
      "id": "sf-irish-cream",
      "name": "Sugar-Free Irish Cream",
      "isSf": true,
      "category": "flavor"
    },
    {
      "id": "kiwi",
      "name": "Kiwi",
      "isSf": false,
      "category": "flavor"
    },
    {
      "id": "lavender",
      "name": "Lavender",
      "isSf": false,
      "category": "flavor"
    },
    {
      "id": "lime",
      "name": "Lime",
      "isSf": false,
      "category": "flavor"
    },
    {
      "id": "mango",
      "name": "Mango",
      "isSf": false,
      "category": "flavor"
    },
    {
      "id": "orange",
      "name": "Orange",
      "isSf": false,
      "category": "flavor"
    },
    {
      "id": "passion-fruit",
      "name": "Passion Fruit",
      "isSf": false,
      "category": "flavor"
    },
    {
      "id": "peach",
      "name": "Peach",
      "isSf": false,
      "category": "flavor"
    },
    {
      "id": "sf-peach",
      "name": "Sugar-Free Peach",
      "isSf": true,
      "category": "flavor"
    },
    {
      "id": "peppermint",
      "name": "Peppermint",
      "isSf": false,
      "category": "flavor"
    },
    {
      "id": "pineapple",
      "name": "Pineapple",
      "isSf": false,
      "category": "flavor"
    },
    {
      "id": "pomegranate",
      "name": "Pomegranate",
      "isSf": false,
      "category": "flavor"
    },
    {
      "id": "pumpkin",
      "name": "Pumpkin",
      "isSf": false,
      "category": "flavor"
    },
    {
      "id": "raspberry",
      "name": "Raspberry",
      "isSf": false,
      "category": "flavor"
    },
    {
      "id": "sf-raspberry",
      "name": "Sugar-Free Raspberry",
      "isSf": true,
      "category": "flavor"
    },
    {
      "id": "salted-caramel",
      "name": "Salted Caramel",
      "isSf": false,
      "category": "flavor"
    },
    {
      "id": "sf-salted-caramel",
      "name": "Sugar-Free Salted Caramel",
      "isSf": true,
      "category": "flavor"
    },
    {
      "id": "strawberry",
      "name": "Strawberry",
      "isSf": false,
      "category": "flavor"
    },
    {
      "id": "sf-strawberry",
      "name": "Sugar-Free Strawberry",
      "isSf": true,
      "category": "flavor"
    },
    {
      "id": "toasted-marshmallow",
      "name": "Toasted Marshmallow",
      "isSf": false,
      "category": "flavor"
    },
    {
      "id": "sf-toasted-marshmallow",
      "name": "Sugar-Free Toasted Marshmallow",
      "isSf": true,
      "category": "flavor"
    },
    {
      "id": "vanilla",
      "name": "Vanilla",
      "isSf": false,
      "category": "flavor"
    },
    {
      "id": "sf-vanilla",
      "name": "Sugar-Free Vanilla",
      "isSf": true,
      "category": "flavor"
    },
    {
      "id": "watermelon",
      "name": "Watermelon",
      "isSf": false,
      "category": "flavor"
    },
    {
      "id": "white-chocolate",
      "name": "White Chocolate",
      "isSf": false,
      "category": "flavor"
    },
    {
      "id": "sf-white-chocolate",
      "name": "Sugar-Free White Chocolate",
      "isSf": true,
      "category": "flavor"
    }
  ],
  "toppingsExtras": [
    {
      "id": "cold-foam",
      "name": "Cold Foam"
    },
    {
      "id": "whipped-cream",
      "name": "Whipped Cream"
    },
    {
      "id": "caramel-drizzle",
      "name": "Caramel Drizzle"
    },
    {
      "id": "chocolate-drizzle",
      "name": "Dark Chocolate Drizzle"
    },
    {
      "id": "white-choc-drizzle",
      "name": "White Chocolate Drizzle"
    }
  ],
  "items": [
    {
      "id": "pumpkin-blondie-breve",
      "name": "Original Pumpkin Blondie Breve",
      "image": "assets/products/product-originalpumpkinblondiebreve.webp",
      "imageAlt": "Original Pumpkin Blondie Breve — image supplied by 7 Brew",
      "category": "seasonal",
      "badge": "Official catalog",
      "tagline": "Vanilla + Caramel + Pumpkin",
      "desc": "Listed in the official Featured Drinks collection. Confirm your preferred preparation and any customizations at the stand.",
      "availableAs": [
        "Iced",
        "Hot",
        "Chiller"
      ],
      "flavors": [
        "Vanilla",
        "Caramel",
        "Pumpkin"
      ],
      "base": "Espresso + Breve Cream",
      "tags": [
        "seasonal",
        "featured",
        "bestseller"
      ],
      "imageCaption": "Product image: 7 Brew.",
      "imageSource": "https://7brew.com/menu/featured-drinks/original-pumpkin-blondie-breve",
      "pricing": {
        "small": 4.75,
        "medium": 5.5,
        "large": 6.5
      }
    },
    {
      "id": "caramel-apple-pie-macchiato",
      "name": "Caramel Apple Pie Macchiato",
      "image": "assets/products/product-caramelapplepiemacchiato.webp",
      "imageAlt": "Caramel Apple Pie Macchiato — image supplied by 7 Brew",
      "category": "seasonal",
      "badge": "Official catalog",
      "tagline": "Salted Caramel w/ Apple Butter Drizzle",
      "desc": "Listed in the official Featured Drinks collection. Confirm your preferred preparation and any customizations at the stand.",
      "availableAs": [
        "Iced",
        "Hot"
      ],
      "flavors": [
        "Salted Caramel w/ Apple Butter Drizzle"
      ],
      "base": "Espresso + Milk",
      "tags": [
        "seasonal",
        "featured"
      ],
      "imageCaption": "Product image: 7 Brew.",
      "imageSource": "https://7brew.com/menu/featured-drinks/caramel-apple-pie-macchiato",
      "pricing": {
        "small": 4.75,
        "medium": 5.5,
        "large": 6.5
      }
    },
    {
      "id": "drizzled-apple-7-energy",
      "name": "Drizzled Apple 7 Energy Frozen Chiller",
      "image": "assets/products/product-drizzledapple7energyfrozenchiller.webp",
      "imageAlt": "Drizzled Apple 7 Energy Frozen Chiller — image supplied by 7 Brew",
      "category": "seasonal",
      "badge": "Official catalog",
      "tagline": "Green Apple w/ Caramel Drizzle",
      "desc": "Listed in the official Featured Drinks collection. Confirm your preferred preparation and any customizations at the stand.",
      "availableAs": [
        "Chiller",
        "Iced"
      ],
      "flavors": [
        "Green Apple w/ Caramel Drizzle"
      ],
      "base": "7 Energy Base",
      "tags": [
        "seasonal",
        "featured",
        "high-caffeine"
      ],
      "imageCaption": "Product image: 7 Brew.",
      "imageSource": "https://7brew.com/menu/featured-drinks/drizzled-apple-7-energy-frozen-chiller",
      "pricing": {
        "small": 5.5,
        "medium": 6.5,
        "large": 7.5
      }
    },
    {
      "id": "apple-butter-chai-latte",
      "name": "Apple Butter Chai Latte",
      "image": "assets/products/product-applebutterchailatte.webp",
      "imageAlt": "Apple Butter Chai Latte — image supplied by 7 Brew",
      "category": "seasonal",
      "badge": "Official catalog",
      "tagline": "Green Apple + White Chocolate w/ Whipped Cream & Apple Butter Drizzle",
      "desc": "Listed in the official Featured Drinks collection. Confirm your preferred preparation and any customizations at the stand.",
      "availableAs": [
        "Iced",
        "Hot"
      ],
      "flavors": [
        "Green Apple",
        "White Chocolate w/ Whipped Cream & Apple Butter Drizzle"
      ],
      "base": "Chai Tea + Milk",
      "tags": [
        "seasonal",
        "featured"
      ],
      "imageCaption": "Product image: 7 Brew.",
      "imageSource": "https://7brew.com/menu/featured-drinks/apple-butter-chai-latte",
      "pricing": {
        "small": 4.5,
        "medium": 5.25,
        "large": 6.25
      }
    },
    {
      "id": "pumpkin-roll-shake",
      "name": "Pumpkin Roll Shake",
      "image": "assets/products/product-pumpkinrollshake.webp",
      "imageAlt": "Pumpkin Roll Shake — image supplied by 7 Brew",
      "category": "seasonal",
      "badge": "Official catalog",
      "tagline": "Brown Sugar Cinnamon + White Chocolate + Pumpkin w/ Whipped Cream & Pumpkin Drizzle",
      "desc": "Listed in the official Featured Drinks collection. Confirm your preferred preparation and any customizations at the stand.",
      "availableAs": [
        "Chiller"
      ],
      "flavors": [
        "Brown Sugar Cinnamon",
        "White Chocolate",
        "Pumpkin w/ Whipped Cream & Pumpkin Drizzle"
      ],
      "base": "Ice Cream Shake Base",
      "tags": [
        "seasonal",
        "featured",
        "caffeine-free"
      ],
      "imageCaption": "Product image: 7 Brew.",
      "imageSource": "https://7brew.com/menu/featured-drinks/pumpkin-roll-shake",
      "pricing": {
        "small": 5.5,
        "medium": 6.5,
        "large": 7.25
      }
    },
    {
      "id": "blondie",
      "name": "Blondie",
      "image": "assets/products/product-blondie.webp",
      "imageAlt": "Blondie — image supplied by 7 Brew",
      "category": "originals",
      "badge": "Official catalog",
      "tagline": "Vanilla + Caramel Breve",
      "desc": "Listed in the official 7 Originals collection. Confirm your preferred preparation and any customizations at the stand.",
      "availableAs": [
        "Iced",
        "Hot",
        "Chiller"
      ],
      "flavors": [
        "Vanilla",
        "Caramel"
      ],
      "base": "Espresso + Breve Cream",
      "tags": [
        "sugar-free-available",
        "bestseller",
        "signature",
        "official-original"
      ],
      "imageCaption": "Product image: 7 Brew.",
      "imageSource": "https://7brew.com/menu/originals/blondie",
      "pricing": {
        "small": 4.5,
        "medium": 5.25,
        "large": 6.25
      },
      "calories": {
        "small": 280,
        "medium": 480,
        "large": 560
      },
      "caffeineMg": {
        "small": 120,
        "medium": 120,
        "large": 240
      },
      "nutritionSource": "Blondie Breve"
    },
    {
      "id": "sweet-salty",
      "name": "Sweet & Salty",
      "image": "assets/products/product-sweetsalty.webp",
      "imageAlt": "Sweet & Salty — image supplied by 7 Brew",
      "category": "originals",
      "badge": "Official catalog",
      "tagline": "Salted Caramel + White Chocolate Breve",
      "desc": "Listed in the official 7 Originals collection. Confirm your preferred preparation and any customizations at the stand.",
      "availableAs": [
        "Iced",
        "Hot",
        "Chiller"
      ],
      "flavors": [
        "Salted Caramel",
        "White Chocolate"
      ],
      "base": "Espresso + Breve",
      "tags": [
        "sugar-free-available",
        "official-original"
      ],
      "imageCaption": "Product image: 7 Brew.",
      "imageSource": "https://7brew.com/menu/originals/sweet-and-salty",
      "pricing": {
        "small": 4.5,
        "medium": 5.25,
        "large": 6.25
      },
      "calories": {
        "small": 300,
        "medium": 520,
        "large": 600
      },
      "caffeineMg": {
        "small": 120,
        "medium": 120,
        "large": 240
      },
      "nutritionSource": "Sweet & Salty Breve"
    },
    {
      "id": "cinnamon-roll",
      "name": "Cinnamon Roll",
      "image": "assets/products/product-cinnamonroll.webp",
      "imageAlt": "Cinnamon Roll — image supplied by 7 Brew",
      "category": "originals",
      "badge": "Official catalog",
      "tagline": "Brown Sugar Cinnamon + White Chocolate Breve",
      "desc": "Listed in the official 7 Originals collection. Confirm your preferred preparation and any customizations at the stand.",
      "availableAs": [
        "Iced",
        "Hot",
        "Chiller"
      ],
      "flavors": [
        "Brown Sugar Cinnamon",
        "White Chocolate"
      ],
      "base": "Espresso + Breve",
      "tags": [
        "sugar-free-available",
        "official-original"
      ],
      "imageCaption": "Product image: 7 Brew.",
      "imageSource": "https://7brew.com/menu/originals/cinnamon-roll",
      "pricing": {
        "small": 4.5,
        "medium": 5.25,
        "large": 6.25
      },
      "calories": {
        "small": 290,
        "medium": 510,
        "large": 590
      },
      "caffeineMg": {
        "small": 120,
        "medium": 120,
        "large": 240
      },
      "nutritionSource": "Cinnamon Roll Breve"
    },
    {
      "id": "brunette",
      "name": "Brunette",
      "image": "assets/products/product-brunette.webp",
      "imageAlt": "Brunette — image supplied by 7 Brew",
      "category": "originals",
      "badge": "Official catalog",
      "tagline": "Hazelnut + Caramel Mocha",
      "desc": "Listed in the official 7 Originals collection. Confirm your preferred preparation and any customizations at the stand.",
      "availableAs": [
        "Iced",
        "Hot",
        "Chiller"
      ],
      "flavors": [
        "Hazelnut",
        "Caramel"
      ],
      "base": "Espresso + Breve Mocha",
      "tags": [
        "sugar-free-available",
        "bestseller",
        "official-original"
      ],
      "imageCaption": "Product image: 7 Brew.",
      "imageSource": "https://7brew.com/menu/originals/brunette",
      "pricing": {
        "small": 4.5,
        "medium": 5.25,
        "large": 6.25
      },
      "calories": {
        "small": 250,
        "medium": 370,
        "large": 500
      },
      "caffeineMg": {
        "small": 120,
        "medium": 120,
        "large": 240
      },
      "nutritionSource": "Brunette Mocha"
    },
    {
      "id": "banana-bread",
      "name": "Banana Bread",
      "image": "assets/products/product-bananabread.webp",
      "imageAlt": "Banana Bread — image supplied by 7 Brew",
      "category": "originals",
      "badge": "Official catalog",
      "tagline": "Banana + Hazelnut Mocha",
      "desc": "Listed in the official 7 Originals collection. Confirm your preferred preparation and any customizations at the stand.",
      "availableAs": [
        "Iced",
        "Hot",
        "Chiller"
      ],
      "flavors": [
        "Banana",
        "Hazelnut"
      ],
      "base": "Espresso + Breve Mocha",
      "tags": [
        "sugar-free-available",
        "signature",
        "official-original"
      ],
      "imageCaption": "Product image: 7 Brew.",
      "imageSource": "https://7brew.com/menu/originals/banana-bread",
      "pricing": {
        "small": 4.5,
        "medium": 5.25,
        "large": 6.25
      },
      "calories": {
        "small": 220,
        "medium": 340,
        "large": 450
      },
      "caffeineMg": {
        "small": 120,
        "medium": 120,
        "large": 240
      },
      "nutritionSource": "Banana Bread Mocha"
    },
    {
      "id": "smooth-7",
      "name": "Smooth 7",
      "image": "assets/products/product-smooth7.webp",
      "imageAlt": "Smooth 7 — image supplied by 7 Brew",
      "category": "originals",
      "badge": "Official catalog",
      "tagline": "Irish Cream + White Chocolate Breve",
      "desc": "Listed in the official 7 Originals collection. Confirm your preferred preparation and any customizations at the stand.",
      "availableAs": [
        "Iced",
        "Hot",
        "Chiller"
      ],
      "flavors": [
        "Irish Cream",
        "White Chocolate"
      ],
      "base": "Espresso + Breve Cream",
      "tags": [
        "sugar-free-available",
        "signature",
        "official-original"
      ],
      "imageCaption": "Product image: 7 Brew.",
      "imageSource": "https://7brew.com/menu/originals/smooth-7",
      "pricing": {
        "small": 4.5,
        "medium": 5.25,
        "large": 6.25
      },
      "calories": {
        "small": 300,
        "medium": 520,
        "large": 600
      },
      "caffeineMg": {
        "small": 120,
        "medium": 120,
        "large": 240
      },
      "nutritionSource": "Smooth 7 Breve"
    },
    {
      "id": "cookie-butter",
      "name": "Cookie Butter",
      "image": "assets/products/product-cookiebutter.webp",
      "imageAlt": "Cookie Butter — image supplied by 7 Brew",
      "category": "originals",
      "badge": "Official catalog",
      "tagline": "Toasted Marshmallow + Hazelnut + White Chocolate Breve",
      "desc": "Listed in the official 7 Originals collection. Confirm your preferred preparation and any customizations at the stand.",
      "availableAs": [
        "Iced",
        "Hot",
        "Chiller"
      ],
      "flavors": [
        "Toasted Marshmallow",
        "Hazelnut",
        "White Chocolate"
      ],
      "base": "Espresso + Breve Cream",
      "tags": [
        "sugar-free-available",
        "signature",
        "official-original",
        "bestseller"
      ],
      "imageCaption": "Product image: 7 Brew.",
      "imageSource": "https://7brew.com/menu/originals/cookie-butter",
      "pricing": {
        "small": 4.5,
        "medium": 5.25,
        "large": 6.25
      },
      "calories": {
        "small": 330,
        "medium": 580,
        "large": 660
      },
      "caffeineMg": {
        "small": 120,
        "medium": 120,
        "large": 240
      },
      "nutritionSource": "Cookie Butter Breve"
    },
    {
      "id": "german-chocolate",
      "name": "German Chocolate Mocha",
      "image": "assets/products/category-classics.webp",
      "imageAlt": "7 Classics category photo",
      "category": "classics",
      "badge": "Confirm recipe locally",
      "tagline": "Coconut, Caramel & Dark Chocolate Mocha",
      "desc": "A guide entry for this named order. Confirm the base, flavor combination and availability with your stand before ordering.",
      "availableAs": [
        "Iced",
        "Hot",
        "Chiller"
      ],
      "flavors": [
        "Coconut",
        "Caramel",
        "Dark Chocolate"
      ],
      "base": "Espresso + Breve Mocha",
      "tags": [
        "sugar-free-available"
      ],
      "imageCaption": "Official category photo; exact custom drink is not pictured.",
      "imageSource": "https://7brew.com/menu",
      "pricing": {
        "small": 5,
        "medium": 5.75,
        "large": 6.75
      },
      "calories": {
        "small": 260,
        "medium": 370,
        "large": 430
      },
      "caffeineMg": {
        "small": 120,
        "medium": 120,
        "large": 240
      },
      "nutritionSource": "German Chocolate Mocha"
    },
    {
      "id": "classic-latte",
      "name": "Classic Latte",
      "image": "assets/products/category-classics.webp",
      "imageAlt": "7 Classics category photo",
      "category": "classics",
      "badge": "Confirm recipe locally",
      "tagline": "Espresso & Velvety Steamed Milk",
      "desc": "A guide entry for this named order. Confirm the base, flavor combination and availability with your stand before ordering.",
      "availableAs": [
        "Iced",
        "Hot"
      ],
      "flavors": [
        "Unsweetened",
        "Add Flavors Free"
      ],
      "base": "Espresso + Whole Milk",
      "tags": [
        "low-calorie",
        "sugar-free-available",
        "dairy-free-available"
      ],
      "imageCaption": "Official category photo; exact custom drink is not pictured.",
      "imageSource": "https://7brew.com/menu",
      "pricing": {
        "small": 3.95,
        "medium": 4.5,
        "large": 5.25
      },
      "calories": {
        "small": 110,
        "medium": 190,
        "large": 230
      },
      "caffeineMg": {
        "small": 120,
        "medium": 120,
        "large": 240
      },
      "nutritionSource": "Latte"
    },
    {
      "id": "classic-mocha",
      "name": "Classic Mocha",
      "image": "assets/products/category-classics.webp",
      "imageAlt": "7 Classics category photo",
      "category": "classics",
      "badge": "Confirm recipe locally",
      "tagline": "Dark Chocolate & Espresso",
      "desc": "A guide entry for this named order. Confirm the base, flavor combination and availability with your stand before ordering.",
      "availableAs": [
        "Iced",
        "Hot",
        "Chiller"
      ],
      "flavors": [
        "Dark Chocolate"
      ],
      "base": "Espresso + Chocolate Milk",
      "tags": [
        "sugar-free-available"
      ],
      "imageCaption": "Official category photo; exact custom drink is not pictured.",
      "imageSource": "https://7brew.com/menu",
      "pricing": {
        "small": 4.25,
        "medium": 4.95,
        "large": 5.75
      },
      "calories": {
        "small": 180,
        "medium": 300,
        "large": 360
      },
      "caffeineMg": {
        "small": 120,
        "medium": 120,
        "large": 240
      },
      "nutritionSource": "Mocha"
    },
    {
      "id": "caramel-macchiato",
      "name": "Caramel Macchiato",
      "image": "assets/products/category-classics.webp",
      "imageAlt": "7 Classics category photo",
      "category": "classics",
      "badge": "Confirm recipe locally",
      "tagline": "Vanilla, Steamed Milk & Caramel Drizzle",
      "desc": "A guide entry for this named order. Confirm the base, flavor combination and availability with your stand before ordering.",
      "availableAs": [
        "Iced",
        "Hot"
      ],
      "flavors": [
        "Vanilla",
        "Caramel Drizzle"
      ],
      "base": "Espresso + Milk",
      "tags": [
        "sugar-free-available"
      ],
      "imageCaption": "Official category photo; exact custom drink is not pictured.",
      "imageSource": "https://7brew.com/menu",
      "pricing": {
        "small": 4.25,
        "medium": 4.95,
        "large": 5.75
      },
      "calories": {
        "small": 260,
        "medium": 340,
        "large": 380
      },
      "caffeineMg": {
        "small": 120,
        "medium": 120,
        "large": 240
      },
      "nutritionSource": "Caramel Macchiato"
    },
    {
      "id": "cold-brew",
      "name": "Cold Brew Coffee",
      "image": "assets/products/category-classics.webp",
      "imageAlt": "7 Classics category photo",
      "category": "classics",
      "badge": "Confirm recipe locally",
      "tagline": "Steeped 24 Hours For Low Acidity",
      "desc": "A guide entry for this named order. Confirm the base, flavor combination and availability with your stand before ordering.",
      "availableAs": [
        "Iced"
      ],
      "flavors": [
        "Black",
        "Customizable"
      ],
      "base": "Cold Brew Extract + Water",
      "tags": [
        "under-50-cals",
        "low-calorie",
        "keto",
        "dairy-free-available"
      ],
      "imageCaption": "Official category photo; exact custom drink is not pictured.",
      "imageSource": "https://7brew.com/menu",
      "pricing": {
        "small": 4.25,
        "medium": 4.95,
        "large": 5.75
      },
      "calories": {
        "small": 15,
        "medium": 20,
        "large": 25
      },
      "caffeineMg": {
        "small": 179,
        "medium": 268,
        "large": 357
      },
      "nutritionSource": "Cold Brew"
    },
    {
      "id": "house-blend",
      "name": "House Blend Drip Coffee",
      "image": "assets/products/category-classics.webp",
      "imageAlt": "7 Classics category photo",
      "category": "classics",
      "badge": "Confirm recipe locally",
      "tagline": "Freshly Brewed Hot Drip",
      "desc": "A guide entry for this named order. Confirm the base, flavor combination and availability with your stand before ordering.",
      "availableAs": [
        "Hot"
      ],
      "flavors": [
        "Black",
        "Cream & Sugar on request"
      ],
      "base": "Fresh Drip Coffee",
      "tags": [
        "under-50-cals",
        "low-calorie",
        "keto"
      ],
      "imageCaption": "Official category photo; exact custom drink is not pictured.",
      "imageSource": "https://7brew.com/menu",
      "pricing": {
        "small": 2.75,
        "medium": 3.25,
        "large": 3.95
      }
    },
    {
      "id": "classic-cocoa",
      "name": "Hot Chocolate / Cocoa",
      "image": "assets/products/category-classics.webp",
      "imageAlt": "7 Classics category photo",
      "category": "classics",
      "badge": "Confirm recipe locally",
      "tagline": "Steamed Chocolate Milk + Whip",
      "desc": "A guide entry for this named order. Confirm the base, flavor combination and availability with your stand before ordering.",
      "availableAs": [
        "Hot"
      ],
      "flavors": [
        "Milk Chocolate"
      ],
      "base": "Steamed Chocolate Milk",
      "tags": [],
      "imageCaption": "Official category photo; exact custom drink is not pictured.",
      "imageSource": "https://7brew.com/menu",
      "pricing": {
        "small": 3.25,
        "medium": 3.95,
        "large": 4.5
      }
    },
    {
      "id": "cappuccino",
      "name": "Cappuccino",
      "image": "",
      "imageAlt": "",
      "category": "classics",
      "badge": "Official menu board",
      "tagline": "Cupcake, Irish Cream or French Vanilla",
      "desc": "Listed on the official 7 Brew drive-thru board. Nutrition from 7 Brew's published guide; price is an estimate.",
      "availableAs": [
        "Iced",
        "Hot"
      ],
      "flavors": [
        "Cupcake",
        "Irish Cream",
        "French Vanilla"
      ],
      "base": "",
      "tags": [
        "official-board"
      ],
      "imageCaption": "",
      "imageSource": "https://7brew.com/menu",
      "pricing": {
        "small": 4.25,
        "medium": 4.95,
        "large": 5.75
      },
      "calories": {
        "small": 90,
        "medium": 130,
        "large": 150
      },
      "caffeineMg": {
        "small": 120,
        "medium": 120,
        "large": 240
      },
      "nutritionSource": "Cappuccino"
    },
    {
      "id": "americano",
      "name": "Americano",
      "image": "",
      "imageAlt": "",
      "category": "classics",
      "badge": "Official menu board",
      "tagline": "Brown Sugar Cinnamon, Hazelnut or Dark Chocolate",
      "desc": "Listed on the official 7 Brew drive-thru board. Nutrition from 7 Brew's published guide; price is an estimate.",
      "availableAs": [
        "Iced",
        "Hot"
      ],
      "flavors": [
        "Brown Sugar Cinnamon",
        "Hazelnut",
        "Dark Chocolate"
      ],
      "base": "",
      "tags": [
        "official-board"
      ],
      "imageCaption": "",
      "imageSource": "https://7brew.com/menu",
      "pricing": {
        "small": 4.25,
        "medium": 4.95,
        "large": 5.75
      },
      "calories": {
        "small": 0,
        "medium": 0,
        "large": 0
      },
      "caffeineMg": {
        "small": 120,
        "medium": 9,
        "large": 240
      },
      "nutritionSource": "Americano"
    },
    {
      "id": "heatwave",
      "name": "Heatwave 7 Energy",
      "image": "assets/products/product-heatwave7energy.webp",
      "imageAlt": "Heatwave 7 Energy — image supplied by 7 Brew",
      "category": "energy",
      "badge": "Official catalog",
      "tagline": "Orange + Lime + Lemon Concentrate",
      "desc": "Listed in the official 7 Energy collection. Confirm your preferred preparation and any customizations at the stand.",
      "availableAs": [
        "Iced",
        "Chiller"
      ],
      "flavors": [
        "Orange",
        "Lime",
        "Lemon Concentrate"
      ],
      "base": "7 Energy Base",
      "tags": [
        "official-energy",
        "bestseller",
        "high-caffeine"
      ],
      "imageCaption": "Product image: 7 Brew.",
      "imageSource": "https://7brew.com/menu/energy/heatwave-7-energy",
      "pricing": {
        "small": 4.5,
        "medium": 5.25,
        "large": 6.25
      },
      "calories": {
        "small": 180,
        "medium": 230,
        "large": 360
      },
      "caffeineMg": {
        "small": 67,
        "medium": 105,
        "large": 133
      },
      "nutritionSource": "Heatwave 7 Energy"
    },
    {
      "id": "ocean-breeze",
      "name": "Ocean Breeze 7 Energy",
      "image": "assets/products/product-oceanbreeze7energy.webp",
      "imageAlt": "Ocean Breeze 7 Energy — image supplied by 7 Brew",
      "category": "energy",
      "badge": "Official catalog",
      "tagline": "Blue Raspberry + Coconut",
      "desc": "Listed in the official 7 Energy collection. Confirm your preferred preparation and any customizations at the stand.",
      "availableAs": [
        "Iced",
        "Chiller"
      ],
      "flavors": [
        "Blue Raspberry",
        "Coconut"
      ],
      "base": "7 Energy Base",
      "tags": [
        "official-energy",
        "bestseller",
        "sugar-free-available",
        "high-caffeine"
      ],
      "imageCaption": "Product image: 7 Brew.",
      "imageSource": "https://7brew.com/menu/energy/ocean-breeze-7-energy",
      "pricing": {
        "small": 4.5,
        "medium": 5.25,
        "large": 6.25
      },
      "calories": {
        "small": 180,
        "medium": 240,
        "large": 360
      },
      "caffeineMg": {
        "small": 67,
        "medium": 105,
        "large": 133
      },
      "nutritionSource": "Ocean Breeze 7 Energy"
    },
    {
      "id": "bikini-bottom",
      "name": "Bikini Bottom 7 Energy",
      "image": "assets/products/category-energy.webp",
      "imageAlt": "7 Energy category photo",
      "category": "energy",
      "badge": "Confirm recipe locally",
      "tagline": "Banana, Coconut & Guava",
      "desc": "A guide entry for this named order. Confirm the base, flavor combination and availability with your stand before ordering.",
      "availableAs": [
        "Iced",
        "Chiller"
      ],
      "flavors": [
        "Banana",
        "Coconut",
        "Guava"
      ],
      "base": "7 Energy Base",
      "tags": [
        "official-energy",
        "high-caffeine"
      ],
      "imageCaption": "Official category photo; exact custom drink is not pictured.",
      "imageSource": "https://7brew.com/menu",
      "pricing": {
        "small": 4.5,
        "medium": 5.25,
        "large": 6.25
      }
    },
    {
      "id": "sunrise-energy",
      "name": "Sunrise 7 Energy",
      "image": "assets/products/product-sunrise7energy.webp",
      "imageAlt": "Sunrise 7 Energy — image supplied by 7 Brew",
      "category": "energy",
      "badge": "Official catalog",
      "tagline": "Peach + Raspberry",
      "desc": "Listed in the official 7 Energy collection. Confirm your preferred preparation and any customizations at the stand.",
      "availableAs": [
        "Iced",
        "Chiller"
      ],
      "flavors": [
        "Peach",
        "Raspberry"
      ],
      "base": "7 Energy Base",
      "tags": [
        "official-energy",
        "sugar-free-available",
        "high-caffeine"
      ],
      "imageCaption": "Product image: 7 Brew.",
      "imageSource": "https://7brew.com/menu/energy/sunrise-7-energy",
      "pricing": {
        "small": 4.5,
        "medium": 5.25,
        "large": 6.25
      },
      "calories": {
        "small": 180,
        "medium": 230,
        "large": 360
      },
      "caffeineMg": {
        "small": 67,
        "medium": 105,
        "large": 133
      },
      "nutritionSource": "Sunrise 7 Energy"
    },
    {
      "id": "pixie-stick",
      "name": "Pixie Stick 7 Energy",
      "image": "assets/products/product-pixiestick7energy.webp",
      "imageAlt": "Pixie Stick 7 Energy — image supplied by 7 Brew",
      "category": "energy",
      "badge": "Official catalog",
      "tagline": "Almond + Orange + Pomegranate",
      "desc": "Listed in the official 7 Energy collection. Confirm your preferred preparation and any customizations at the stand.",
      "availableAs": [
        "Iced",
        "Chiller"
      ],
      "flavors": [
        "Almond",
        "Orange",
        "Pomegranate"
      ],
      "base": "7 Energy Base",
      "tags": [
        "official-energy",
        "sugar-free-available",
        "high-caffeine"
      ],
      "imageCaption": "Product image: 7 Brew.",
      "imageSource": "https://7brew.com/menu/energy/pixie-stick-7-energy",
      "pricing": {
        "small": 4.5,
        "medium": 5.25,
        "large": 6.25
      },
      "calories": {
        "small": 170,
        "medium": 230,
        "large": 350
      },
      "caffeineMg": {
        "small": 67,
        "medium": 105,
        "large": 133
      },
      "nutritionSource": "Pixie Stick 7 Energy"
    },
    {
      "id": "brewberry-energy",
      "name": "Brewberry 7 Energy",
      "image": "assets/products/product-brewberry7energy.webp",
      "imageAlt": "Brewberry 7 Energy — image supplied by 7 Brew",
      "category": "energy",
      "badge": "Official catalog",
      "tagline": "Blue Raspberry + Strawberry",
      "desc": "Listed in the official 7 Energy collection. Confirm your preferred preparation and any customizations at the stand.",
      "availableAs": [
        "Iced",
        "Chiller"
      ],
      "flavors": [
        "Blue Raspberry",
        "Strawberry"
      ],
      "base": "7 Energy Base",
      "tags": [
        "official-energy",
        "sugar-free-available",
        "high-caffeine"
      ],
      "imageCaption": "Product image: 7 Brew.",
      "imageSource": "https://7brew.com/menu/energy/brewberry-7-energy",
      "pricing": {
        "small": 4.5,
        "medium": 5.25,
        "large": 6.25
      },
      "calories": {
        "small": 180,
        "medium": 230,
        "large": 350
      },
      "caffeineMg": {
        "small": 67,
        "medium": 105,
        "large": 133
      },
      "nutritionSource": "Brewberry 7 Energy"
    },
    {
      "id": "bahama-mama-energy",
      "name": "Bahama Mama 7 Energy",
      "image": "assets/products/category-energy.webp",
      "imageAlt": "7 Energy category photo",
      "category": "energy",
      "badge": "Confirm recipe locally",
      "tagline": "Cherry & Coconut Tropical Zing",
      "desc": "A guide entry for this named order. Confirm the base, flavor combination and availability with your stand before ordering.",
      "availableAs": [
        "Iced",
        "Chiller"
      ],
      "flavors": [
        "Cherry",
        "Coconut"
      ],
      "base": "7 Energy Base",
      "tags": [
        "official-energy",
        "high-caffeine"
      ],
      "imageCaption": "Official category photo; exact custom drink is not pictured.",
      "imageSource": "https://7brew.com/menu",
      "pricing": {
        "small": 4.5,
        "medium": 5.25,
        "large": 6.25
      }
    },
    {
      "id": "nightshade-energy",
      "name": "Nightshade 7 Energy",
      "image": "assets/products/product-nightshade7energy.webp",
      "imageAlt": "Nightshade 7 Energy — image supplied by 7 Brew",
      "category": "energy",
      "badge": "Official catalog",
      "tagline": "Lavender + Pomegranate + Blue Raspberry",
      "desc": "Listed in the official 7 Energy collection. Confirm your preferred preparation and any customizations at the stand.",
      "availableAs": [
        "Iced",
        "Chiller"
      ],
      "flavors": [
        "Lavender",
        "Pomegranate",
        "Blue Raspberry"
      ],
      "base": "7 Energy Base",
      "tags": [
        "sugar-free-available",
        "high-caffeine"
      ],
      "imageCaption": "Product image: 7 Brew.",
      "imageSource": "https://7brew.com/menu/energy/nightshade-7-energy",
      "pricing": {
        "small": 4.5,
        "medium": 5.25,
        "large": 6.25
      },
      "calories": {
        "small": 180,
        "medium": 230,
        "large": 350
      },
      "caffeineMg": {
        "small": 67,
        "medium": 105,
        "large": 133
      },
      "nutritionSource": "Nightshade 7 Energy"
    },
    {
      "id": "tigers-blood",
      "name": "Tiger's Blood 7 Energy",
      "image": "assets/products/category-energy.webp",
      "imageAlt": "7 Energy category photo",
      "category": "energy",
      "badge": "Confirm recipe locally",
      "tagline": "Strawberry & Coconut",
      "desc": "A guide entry for this named order. Confirm the base, flavor combination and availability with your stand before ordering.",
      "availableAs": [
        "Iced",
        "Chiller"
      ],
      "flavors": [
        "Strawberry",
        "Coconut"
      ],
      "base": "7 Energy Base",
      "tags": [
        "sugar-free-available",
        "high-caffeine"
      ],
      "imageCaption": "Official category photo; exact custom drink is not pictured.",
      "imageSource": "https://7brew.com/menu",
      "pricing": {
        "small": 4.5,
        "medium": 5.25,
        "large": 6.25
      }
    },
    {
      "id": "sugar-free-energy-can",
      "name": "7 Energy Sugar-Free Can",
      "image": "",
      "imageAlt": "",
      "category": "energy",
      "badge": "Confirm recipe locally",
      "tagline": "Standalone Canned Energy or Custom Base",
      "desc": "A guide entry for this named order. Confirm the base, flavor combination and availability with your stand before ordering.",
      "availableAs": [
        "Iced",
        "Can"
      ],
      "flavors": [
        "Zero Sugar Energy"
      ],
      "base": "SF 7 Energy Can",
      "tags": [
        "under-50-cals",
        "low-calorie",
        "keto",
        "high-caffeine"
      ],
      "imageCaption": "Exact product photo unavailable.",
      "imageSource": "https://7brew.com/menu",
      "pricing": {
        "small": 3.99,
        "medium": 4.75,
        "large": 5.5
      }
    },
    {
      "id": "lemon-drop-fizz",
      "name": "Lemon Drop 7 Fizz",
      "image": "assets/products/category-fizz-sodas.webp",
      "imageAlt": "7 Fizz Sodas category photo",
      "category": "fizz",
      "badge": "Confirm recipe locally",
      "tagline": "Lemon & Pure Cane Sugar",
      "desc": "A guide entry for this named order. Confirm the base, flavor combination and availability with your stand before ordering.",
      "availableAs": [
        "Iced",
        "Chiller"
      ],
      "flavors": [
        "Lemon",
        "Cane Sugar"
      ],
      "base": "Sparkling Soda Water",
      "tags": [
        "caffeine-free",
        "official-fizz"
      ],
      "imageCaption": "Official category photo; exact custom drink is not pictured.",
      "imageSource": "https://7brew.com/menu",
      "pricing": {
        "small": 2.75,
        "medium": 3.5,
        "large": 4.25
      }
    },
    {
      "id": "pink-mermaid",
      "name": "Pink Mermaid 7 Fizz",
      "image": "assets/products/product-pinkmermaid7fizzsoda.webp",
      "imageAlt": "Pink Mermaid 7 Fizz Soda — image supplied by 7 Brew",
      "category": "fizz",
      "badge": "Confirm recipe locally",
      "tagline": "Watermelon, Coconut & Strawberry Sparkling Soda",
      "desc": "A guide entry for this named order. Confirm the base, flavor combination and availability with your stand before ordering.",
      "availableAs": [
        "Iced"
      ],
      "flavors": [
        "Watermelon",
        "Coconut",
        "Strawberry"
      ],
      "base": "Sparkling Soda Water",
      "tags": [
        "caffeine-free",
        "sugar-free-available"
      ],
      "imageCaption": "Product image: 7 Brew.",
      "imageSource": "https://7brew.com/menu/fizz-sodas/pink-mermaid-7-fizz-soda",
      "pricing": {
        "small": 2.75,
        "medium": 3.5,
        "large": 4.25
      },
      "calories": {
        "small": 160,
        "medium": 5,
        "large": 320
      },
      "caffeineMg": {
        "small": 0,
        "medium": 0,
        "large": 0
      },
      "nutritionSource": "Pink Mermaid 7 Fizz Soda"
    },
    {
      "id": "brew-lagoon",
      "name": "Brew Lagoon 7 Fizz",
      "image": "assets/products/product-brewlagoon7fizzsoda.webp",
      "imageAlt": "Brew Lagoon 7 Fizz Soda — image supplied by 7 Brew",
      "category": "fizz",
      "badge": "Confirm recipe locally",
      "tagline": "Blue Raspberry, Lime & Coconut",
      "desc": "A guide entry for this named order. Confirm the base, flavor combination and availability with your stand before ordering.",
      "availableAs": [
        "Iced"
      ],
      "flavors": [
        "Blue Raspberry",
        "Lime",
        "Coconut"
      ],
      "base": "Sparkling Soda Water",
      "tags": [
        "caffeine-free",
        "sugar-free-available"
      ],
      "imageCaption": "Product image: 7 Brew.",
      "imageSource": "https://7brew.com/menu/fizz-sodas/brew-lagoon-7-fizz-soda",
      "pricing": {
        "small": 2.75,
        "medium": 3.5,
        "large": 4.25
      },
      "calories": {
        "small": 170,
        "medium": 250,
        "large": 340
      },
      "caffeineMg": {
        "small": 0,
        "medium": 0,
        "large": 0
      },
      "nutritionSource": "Brew Lagoon 7 Fizz Soda"
    },
    {
      "id": "blood-orange-fizz",
      "name": "Blood Orange 7 Fizz",
      "image": "assets/products/product-bloodorange7fizzsoda.webp",
      "imageAlt": "Blood Orange 7 Fizz Soda — image supplied by 7 Brew",
      "category": "fizz",
      "badge": "Confirm recipe locally",
      "tagline": "Orange & Pomegranate Soda",
      "desc": "A guide entry for this named order. Confirm the base, flavor combination and availability with your stand before ordering.",
      "availableAs": [
        "Iced"
      ],
      "flavors": [
        "Orange",
        "Pomegranate"
      ],
      "base": "Sparkling Soda Water",
      "tags": [
        "caffeine-free",
        "sugar-free-available"
      ],
      "imageCaption": "Product image: 7 Brew.",
      "imageSource": "https://7brew.com/menu/fizz-sodas/blood-orange-7-fizz-soda",
      "pricing": {
        "small": 2.75,
        "medium": 3.5,
        "large": 4.25
      },
      "calories": {
        "small": 170,
        "medium": 250,
        "large": 340
      },
      "caffeineMg": {
        "small": 0,
        "medium": 0,
        "large": 0
      },
      "nutritionSource": "Blood Orange 7 Fizz Soda"
    },
    {
      "id": "peaches-n-cream-fizz",
      "name": "Peaches 'n' Cream 7 Fizz",
      "image": "assets/products/product-peachesncream7fizzsoda.webp",
      "imageAlt": "Peaches N' Cream 7 Fizz Soda — image supplied by 7 Brew",
      "category": "fizz",
      "badge": "Confirm recipe locally",
      "tagline": "Peach & Vanilla with Cream Float",
      "desc": "A guide entry for this named order. Confirm the base, flavor combination and availability with your stand before ordering.",
      "availableAs": [
        "Iced"
      ],
      "flavors": [
        "Peach",
        "Vanilla",
        "Cream"
      ],
      "base": "Sparkling Soda + Breve Float",
      "tags": [
        "caffeine-free"
      ],
      "imageCaption": "Product image: 7 Brew.",
      "imageSource": "https://7brew.com/menu/fizz-sodas/peaches-n-cream-7-fizz-soda",
      "pricing": {
        "small": 2.95,
        "medium": 3.75,
        "large": 4.5
      },
      "calories": {
        "small": 180,
        "medium": 270,
        "large": 360
      },
      "caffeineMg": {
        "small": 0,
        "medium": 0,
        "large": 0
      },
      "nutritionSource": "Peaches 'n Cream 7 Fizz Soda"
    },
    {
      "id": "strawberry-matcha",
      "name": "Strawberry Matcha Latte",
      "image": "assets/products/product-strawberrymatchalatte.webp",
      "imageAlt": "Strawberry Matcha Latte — image supplied by 7 Brew",
      "category": "teas-matcha",
      "badge": "Official catalog",
      "tagline": "Strawberry",
      "desc": "Listed in the official Teas + Chai + Matcha collection. Confirm your preferred preparation and any customizations at the stand.",
      "availableAs": [
        "Iced",
        "Hot"
      ],
      "flavors": [
        "Strawberry"
      ],
      "base": "Matcha Tea + Milk",
      "tags": [
        "antioxidant",
        "dairy-free-available"
      ],
      "imageCaption": "Product image: 7 Brew.",
      "imageSource": "https://7brew.com/menu/teas-chai-matcha/strawberry-matcha-latte",
      "pricing": {
        "small": 4.25,
        "medium": 4.95,
        "large": 5.75
      },
      "calories": {
        "small": 220,
        "medium": 300,
        "large": 380
      },
      "caffeineMg": {
        "small": 11,
        "medium": 17,
        "large": 22
      },
      "nutritionSource": "Strawberry Matcha Latte"
    },
    {
      "id": "chai-latte",
      "name": "Spiced Chai Tea Latte",
      "image": "assets/products/category-teas-chai--matcha.webp",
      "imageAlt": "Teas, Chai & Matcha category photo",
      "category": "teas-matcha",
      "badge": "Confirm recipe locally",
      "tagline": "Black Tea, Cardamom, Cinnamon & Milk",
      "desc": "A guide entry for this named order. Confirm the base, flavor combination and availability with your stand before ordering.",
      "availableAs": [
        "Iced",
        "Hot"
      ],
      "flavors": [
        "Spiced Chai"
      ],
      "base": "Chai Concentrate + Milk",
      "tags": [
        "dairy-free-available"
      ],
      "imageCaption": "Official category photo; exact custom drink is not pictured.",
      "imageSource": "https://7brew.com/menu",
      "pricing": {
        "small": 3.95,
        "medium": 4.65,
        "large": 5.45
      },
      "calories": {
        "small": 150,
        "medium": 220,
        "large": 300
      },
      "caffeineMg": {
        "small": 0,
        "medium": 0,
        "large": 0
      },
      "nutritionSource": "Chai Latte"
    },
    {
      "id": "iced-peach-black-tea",
      "name": "Iced Peach Black Tea",
      "image": "assets/products/category-teas-chai--matcha.webp",
      "imageAlt": "Teas, Chai & Matcha category photo",
      "category": "teas-matcha",
      "badge": "Confirm recipe locally",
      "tagline": "Fresh Black Tea with Sweet Peach",
      "desc": "A guide entry for this named order. Confirm the base, flavor combination and availability with your stand before ordering.",
      "availableAs": [
        "Iced"
      ],
      "flavors": [
        "Peach",
        "Black Tea"
      ],
      "base": "Steeped Black Tea",
      "tags": [
        "low-calorie",
        "sugar-free-available"
      ],
      "imageCaption": "Official category photo; exact custom drink is not pictured.",
      "imageSource": "https://7brew.com/menu",
      "pricing": {
        "small": 2.75,
        "medium": 3.5,
        "large": 4.25
      },
      "calories": {
        "small": 80,
        "medium": 170,
        "large": 250
      },
      "caffeineMg": {
        "small": 74,
        "medium": 106,
        "large": 138
      },
      "nutritionSource": "Georgia Peach Black Tea"
    },
    {
      "id": "pink-paradise-lemonade",
      "name": "Pink Paradise Lemonade",
      "image": "assets/products/product-pinkparadiselemonade.webp",
      "imageAlt": "Pink Paradise Lemonade — image supplied by 7 Brew",
      "category": "lemonades",
      "badge": "Official catalog",
      "tagline": "Cherry + Watermelon + Raspberry",
      "desc": "Listed in the official Lemonades collection. Confirm your preferred preparation and any customizations at the stand.",
      "availableAs": [
        "Iced",
        "Chiller"
      ],
      "flavors": [
        "Cherry",
        "Watermelon",
        "Raspberry"
      ],
      "base": "Lemonade Base",
      "tags": [
        "caffeine-free",
        "dairy-free",
        "official-lemonade"
      ],
      "imageCaption": "Product image: 7 Brew.",
      "imageSource": "https://7brew.com/menu/lemonades/pink-paradise-lemonade",
      "pricing": {
        "small": 2.75,
        "medium": 3.5,
        "large": 4.25
      },
      "calories": {
        "small": 200,
        "medium": 270,
        "large": 400
      },
      "caffeineMg": {
        "small": 0,
        "medium": 0,
        "large": 0
      },
      "nutritionSource": "Pink Paradise Lemonade"
    },
    {
      "id": "tropic-thunder-lemonade",
      "name": "Tropic Thunder Lemonade",
      "image": "assets/products/product-tropicthunderlemonade.webp",
      "imageAlt": "Tropic Thunder Lemonade — image supplied by 7 Brew",
      "category": "lemonades",
      "badge": "Official catalog",
      "tagline": "Mango + Pineapple",
      "desc": "Listed in the official Lemonades collection. Confirm your preferred preparation and any customizations at the stand.",
      "availableAs": [
        "Iced",
        "Chiller"
      ],
      "flavors": [
        "Mango",
        "Pineapple"
      ],
      "base": "Lemonade Base",
      "tags": [
        "caffeine-free",
        "dairy-free",
        "official-lemonade"
      ],
      "imageCaption": "Product image: 7 Brew.",
      "imageSource": "https://7brew.com/menu/lemonades/tropic-thunder-lemonade",
      "pricing": {
        "small": 2.75,
        "medium": 3.5,
        "large": 4.25
      }
    },
    {
      "id": "blackberry-cobbler-lemonade",
      "name": "Blackberry Cobbler Lemonade",
      "image": "assets/products/product-blackberrycobblerlemonade.webp",
      "imageAlt": "Blackberry Cobbler Lemonade — image supplied by 7 Brew",
      "category": "lemonades",
      "badge": "Official catalog",
      "tagline": "Blackberry + Cupcake + White Chocolate",
      "desc": "Listed in the official Lemonades collection. Confirm your preferred preparation and any customizations at the stand.",
      "availableAs": [
        "Iced",
        "Chiller"
      ],
      "flavors": [
        "Blackberry",
        "Cupcake",
        "White Chocolate"
      ],
      "base": "Lemonade Base",
      "tags": [
        "caffeine-free",
        "official-lemonade"
      ],
      "imageCaption": "Product image: 7 Brew.",
      "imageSource": "https://7brew.com/menu/lemonades/blackberry-cobbler-lemonade",
      "pricing": {
        "small": 2.95,
        "medium": 3.75,
        "large": 4.5
      }
    },
    {
      "id": "classic-lemonade",
      "name": "Fresh Lemonade",
      "image": "assets/products/category-lemonades.webp",
      "imageAlt": "Lemonades category photo",
      "category": "lemonades",
      "badge": "Confirm recipe locally",
      "tagline": "Real Lemon Juice & Pure Cane Sugar",
      "desc": "A guide entry for this named order. Confirm the base, flavor combination and availability with your stand before ordering.",
      "availableAs": [
        "Iced"
      ],
      "flavors": [
        "Lemon Juice",
        "Custom Fruits"
      ],
      "base": "Lemonade Base",
      "tags": [
        "caffeine-free",
        "dairy-free"
      ],
      "imageCaption": "Official category photo; exact custom drink is not pictured.",
      "imageSource": "https://7brew.com/menu",
      "pricing": {
        "small": 2.75,
        "medium": 3.5,
        "large": 4.25
      },
      "calories": {
        "small": 140,
        "medium": 200,
        "large": 270
      },
      "caffeineMg": {
        "small": 0,
        "medium": 0,
        "large": 0
      },
      "nutritionSource": "Lemonade"
    },
    {
      "id": "fruit-roll-up-lemonade",
      "name": "Fruit Roll-Up Lemonade",
      "image": "",
      "imageAlt": "",
      "category": "lemonades",
      "badge": "Official menu board",
      "tagline": "Lavender & Strawberry",
      "desc": "Listed on the official 7 Brew drive-thru board. Nutrition from 7 Brew's published guide; price is an estimate.",
      "availableAs": [
        "Iced",
        "Hot"
      ],
      "flavors": [
        "Lavender",
        "Strawberry"
      ],
      "base": "",
      "tags": [
        "official-board"
      ],
      "imageCaption": "",
      "imageSource": "https://7brew.com/menu",
      "pricing": {
        "small": 2.75,
        "medium": 3.5,
        "large": 4.25
      },
      "calories": {
        "small": 200,
        "medium": 270,
        "large": 400
      },
      "caffeineMg": {
        "small": 0,
        "medium": 0,
        "large": 0
      },
      "nutritionSource": "Fruit Roll-Up Lemonade"
    },
    {
      "id": "cocoberry-lemonade",
      "name": "Cocoberry Lemonade",
      "image": "",
      "imageAlt": "",
      "category": "lemonades",
      "badge": "Official menu board",
      "tagline": "Coconut & Raspberry",
      "desc": "Listed on the official 7 Brew drive-thru board. Nutrition from 7 Brew's published guide; price is an estimate.",
      "availableAs": [
        "Iced",
        "Hot"
      ],
      "flavors": [
        "Coconut",
        "Raspberry"
      ],
      "base": "",
      "tags": [
        "official-board"
      ],
      "imageCaption": "",
      "imageSource": "https://7brew.com/menu",
      "pricing": {
        "small": 2.75,
        "medium": 3.5,
        "large": 4.25
      },
      "calories": {
        "small": 210,
        "medium": 280,
        "large": 420
      },
      "caffeineMg": {
        "small": 0,
        "medium": 0,
        "large": 0
      },
      "nutritionSource": "Cocoberry Lemonade"
    },
    {
      "id": "key-lime-pie-lemonade",
      "name": "Key Lime Pie Lemonade",
      "image": "",
      "imageAlt": "",
      "category": "lemonades",
      "badge": "Official menu board",
      "tagline": "Lemon, Lime & White Chocolate",
      "desc": "Listed on the official 7 Brew drive-thru board. Nutrition from 7 Brew's published guide; price is an estimate.",
      "availableAs": [
        "Iced",
        "Hot"
      ],
      "flavors": [
        "Lemon",
        "Lime",
        "White Chocolate"
      ],
      "base": "",
      "tags": [
        "official-board"
      ],
      "imageCaption": "",
      "imageSource": "https://7brew.com/menu",
      "pricing": {
        "small": 2.75,
        "medium": 3.5,
        "large": 4.25
      },
      "calories": {
        "small": 210,
        "medium": 280,
        "large": 420
      },
      "caffeineMg": {
        "small": 0,
        "medium": 0,
        "large": 0
      },
      "nutritionSource": "Key Lime Pie Lemonade"
    },
    {
      "id": "banana-strawberry-smoothie",
      "name": "Banana Strawberry Smoothie",
      "image": "",
      "imageAlt": "",
      "category": "smoothies",
      "badge": "Official menu board",
      "tagline": "Banana & Strawberry",
      "desc": "Listed on the official 7 Brew drive-thru board. 7 Brew does not publish nutrition figures for smoothies, so no calorie count is shown. Price is an estimate.",
      "availableAs": [
        "Blended"
      ],
      "flavors": [
        "Banana",
        "Strawberry"
      ],
      "base": "",
      "tags": [
        "official-board"
      ],
      "imageCaption": "",
      "imageSource": "https://7brew.com/menu",
      "pricing": {
        "small": 5.25,
        "medium": 6.25,
        "large": 7.25
      }
    },
    {
      "id": "tiki-tango-mango-smoothie",
      "name": "Tiki Tango Mango Smoothie",
      "image": "",
      "imageAlt": "",
      "category": "smoothies",
      "badge": "Official menu board",
      "tagline": "Passion Fruit & Pineapple",
      "desc": "Listed on the official 7 Brew drive-thru board. 7 Brew does not publish nutrition figures for smoothies, so no calorie count is shown. Price is an estimate.",
      "availableAs": [
        "Blended"
      ],
      "flavors": [
        "Passion Fruit",
        "Pineapple"
      ],
      "base": "",
      "tags": [
        "official-board"
      ],
      "imageCaption": "",
      "imageSource": "https://7brew.com/menu",
      "pricing": {
        "small": 5.25,
        "medium": 6.25,
        "large": 7.25
      }
    },
    {
      "id": "tigers-blood-pina-colada-smoothie",
      "name": "Tiger's Blood Piña Colada Smoothie",
      "image": "assets/products/category-smoothies.webp",
      "imageAlt": "Smoothies category photo",
      "category": "smoothies",
      "badge": "Official menu board",
      "tagline": "Coconut & Strawberry",
      "desc": "Listed on the official 7 Brew drive-thru board. 7 Brew does not publish nutrition figures for smoothies, so no calorie count is shown. Price is an estimate.",
      "availableAs": [
        "Blended"
      ],
      "flavors": [
        "Coconut",
        "Strawberry"
      ],
      "base": "",
      "tags": [
        "official-board"
      ],
      "imageCaption": "Official category photo; exact custom drink is not pictured.",
      "imageSource": "https://7brew.com/menu",
      "pricing": {
        "small": 5.25,
        "medium": 6.25,
        "large": 7.25
      }
    },
    {
      "id": "blackberry-cobbler-wildberry-smoothie",
      "name": "Blackberry Cobbler Wildberry Smoothie",
      "image": "",
      "imageAlt": "",
      "category": "smoothies",
      "badge": "Official menu board",
      "tagline": "Blackberry, Cupcake & White Chocolate",
      "desc": "Listed on the official 7 Brew drive-thru board. 7 Brew does not publish nutrition figures for smoothies, so no calorie count is shown. Price is an estimate.",
      "availableAs": [
        "Blended"
      ],
      "flavors": [
        "Blackberry",
        "Cupcake",
        "White Chocolate"
      ],
      "base": "",
      "tags": [
        "official-board"
      ],
      "imageCaption": "",
      "imageSource": "https://7brew.com/menu",
      "pricing": {
        "small": 5.25,
        "medium": 6.25,
        "large": 7.25
      }
    },
    {
      "id": "rocky-road-shake",
      "name": "Rocky Road Shake",
      "image": "assets/products/product-rockyroadshake.webp",
      "imageAlt": "Rocky Road Shake — image supplied by 7 Brew",
      "category": "shakes",
      "badge": "Official menu board",
      "tagline": "Toasted Marshmallow, Hazelnut & Caramel",
      "desc": "Listed on the official 7 Brew drive-thru board. 7 Brew does not publish nutrition figures for shakes, so no calorie count is shown. Price is an estimate.",
      "availableAs": [
        "Blended"
      ],
      "flavors": [
        "Toasted Marshmallow",
        "Hazelnut",
        "Caramel"
      ],
      "base": "",
      "tags": [
        "official-board"
      ],
      "imageCaption": "Product image: 7 Brew.",
      "imageSource": "https://7brew.com/menu",
      "pricing": {
        "small": 5.25,
        "medium": 6.25,
        "large": 7.25
      }
    },
    {
      "id": "cookies-cream-shake",
      "name": "Cookies & Cream Shake",
      "image": "assets/products/product-cookiescreamshake.webp",
      "imageAlt": "Cookies & Cream Shake — image supplied by 7 Brew",
      "category": "shakes",
      "badge": "Official menu board",
      "tagline": "Cupcake, Dark Chocolate & White Chocolate",
      "desc": "Listed on the official 7 Brew drive-thru board. 7 Brew does not publish nutrition figures for shakes, so no calorie count is shown. Price is an estimate.",
      "availableAs": [
        "Blended"
      ],
      "flavors": [
        "Cupcake",
        "Dark Chocolate",
        "White Chocolate"
      ],
      "base": "",
      "tags": [
        "official-board"
      ],
      "imageCaption": "Product image: 7 Brew.",
      "imageSource": "https://7brew.com/menu",
      "pricing": {
        "small": 5.25,
        "medium": 6.25,
        "large": 7.25
      }
    },
    {
      "id": "orange-sherbet-shake",
      "name": "Orange Sherbet Shake",
      "image": "assets/products/product-orangesherbetshake.webp",
      "imageAlt": "Orange Sherbet Shake — image supplied by 7 Brew",
      "category": "shakes",
      "badge": "Official menu board",
      "tagline": "Orange, Strawberry & Vanilla",
      "desc": "Listed on the official 7 Brew drive-thru board. 7 Brew does not publish nutrition figures for shakes, so no calorie count is shown. Price is an estimate.",
      "availableAs": [
        "Blended"
      ],
      "flavors": [
        "Orange",
        "Strawberry",
        "Vanilla"
      ],
      "base": "",
      "tags": [
        "official-board"
      ],
      "imageCaption": "Product image: 7 Brew.",
      "imageSource": "https://7brew.com/menu",
      "pricing": {
        "small": 5.25,
        "medium": 6.25,
        "large": 7.25
      }
    },
    {
      "id": "birthday-cake-shake",
      "name": "Birthday Cake Shake",
      "image": "assets/products/product-birthdaycakeshake.webp",
      "imageAlt": "Birthday Cake Shake — image supplied by 7 Brew",
      "category": "shakes",
      "badge": "Official menu board",
      "tagline": "Cupcake & White Chocolate",
      "desc": "Listed on the official 7 Brew drive-thru board. 7 Brew does not publish nutrition figures for shakes, so no calorie count is shown. Price is an estimate.",
      "availableAs": [
        "Blended"
      ],
      "flavors": [
        "Cupcake",
        "White Chocolate"
      ],
      "base": "",
      "tags": [
        "official-board"
      ],
      "imageCaption": "Product image: 7 Brew.",
      "imageSource": "https://7brew.com/menu",
      "pricing": {
        "small": 5.25,
        "medium": 6.25,
        "large": 7.25
      }
    },
    {
      "id": "triple-7",
      "name": "Triple 7 (6 Shots)",
      "image": "assets/products/category-classics.webp",
      "imageAlt": "7 Classics category photo",
      "category": "secret-menu",
      "badge": "Confirm recipe locally",
      "tagline": "6 Shots Espresso + Irish Cream & White Choc",
      "desc": "A guide entry for this named order. Confirm the base, flavor combination and availability with your stand before ordering.",
      "availableAs": [
        "Iced",
        "Hot",
        "Chiller"
      ],
      "flavors": [
        "White Chocolate",
        "Irish Cream"
      ],
      "base": "6x Espresso Shots + Breve",
      "tags": [
        "high-caffeine"
      ],
      "imageCaption": "Official category photo; exact custom drink is not pictured.",
      "imageSource": "https://7brew.com/menu",
      "pricing": {
        "small": 5.5,
        "medium": 6.25,
        "large": 7.25
      }
    },
    {
      "id": "muffin-tops",
      "name": "Bakery Muffin Tops",
      "image": "",
      "imageAlt": "",
      "category": "secret-menu",
      "badge": "Confirm recipe locally",
      "tagline": "Blueberry, Choc Chip & Lemon Poppyseed",
      "desc": "A guide entry for this named order. Confirm the base, flavor combination and availability with your stand before ordering.",
      "availableAs": [
        "Bakery"
      ],
      "flavors": [
        "Blueberry",
        "Chocolate Chip",
        "Lemon Poppyseed"
      ],
      "base": "Fresh Baked Goods",
      "tags": [
        "bakery",
        "food"
      ],
      "imageCaption": "Exact product photo unavailable.",
      "imageSource": "https://7brew.com/menu",
      "pricing": {
        "small": 4.45,
        "medium": 4.45,
        "large": 4.45
      }
    },
    {
      "id": "pup-cup",
      "name": "7 Brew Pup Cup",
      "image": "",
      "imageAlt": "",
      "category": "secret-menu",
      "badge": "Confirm recipe locally",
      "tagline": "Whipped Cream & Dog Biscuit",
      "desc": "A guide entry for this named order. Confirm the base, flavor combination and availability with your stand before ordering.",
      "availableAs": [
        "Treat"
      ],
      "flavors": [
        "Whipped Cream",
        "Dog Treat"
      ],
      "base": "Dairy Whip",
      "tags": [
        "free",
        "pets"
      ],
      "imageCaption": "Exact product photo unavailable.",
      "imageSource": "https://7brew.com/menu",
      "pricing": {
        "small": 0,
        "medium": 0,
        "large": 0
      }
    },
    {
      "id": "secret-cookie-butter",
      "name": "Cookie Butter Chiller",
      "image": "assets/products/category-classics.webp",
      "imageAlt": "7 Classics category photo",
      "category": "secret-menu",
      "badge": "Confirm recipe locally",
      "tagline": "White Choc, Hazelnut & Toasted Marshmallow",
      "desc": "A guide entry for this named order. Confirm the base, flavor combination and availability with your stand before ordering.",
      "availableAs": [
        "Iced",
        "Hot",
        "Chiller"
      ],
      "flavors": [
        "Toasted Marshmallow",
        "White Choc",
        "Hazelnut"
      ],
      "base": "Espresso + Breve Cream",
      "tags": [
        "secret-menu",
        "bestseller"
      ],
      "imageCaption": "Official category photo; exact custom drink is not pictured.",
      "imageSource": "https://7brew.com/menu",
      "pricing": {
        "small": 4.75,
        "medium": 5.5,
        "large": 6.5
      }
    },
    {
      "id": "secret-butterbeer",
      "name": "Butterbeer Breve",
      "image": "assets/products/category-classics.webp",
      "imageAlt": "7 Classics category photo",
      "category": "secret-menu",
      "badge": "Confirm recipe locally",
      "tagline": "Caramel, Vanilla & Brown Sugar Cinnamon",
      "desc": "A guide entry for this named order. Confirm the base, flavor combination and availability with your stand before ordering.",
      "availableAs": [
        "Iced",
        "Hot",
        "Chiller"
      ],
      "flavors": [
        "Caramel",
        "Vanilla",
        "Brown Sugar Cinnamon"
      ],
      "base": "Espresso + Breve Cream",
      "tags": [
        "secret-menu"
      ],
      "imageCaption": "Official category photo; exact custom drink is not pictured.",
      "imageSource": "https://7brew.com/menu",
      "pricing": {
        "small": 4.75,
        "medium": 5.5,
        "large": 6.5
      }
    },
    {
      "id": "secret-funnel-cake",
      "name": "Funnel Cake Chiller",
      "image": "assets/products/product-funnelcakecoffeefrozenchiller.webp",
      "imageAlt": "Funnel Cake Coffee Frozen Chiller — image supplied by 7 Brew",
      "category": "secret-menu",
      "badge": "Confirm recipe locally",
      "tagline": "Cupcake, Salted Caramel & White Chocolate",
      "desc": "A guide entry for this named order. Confirm the base, flavor combination and availability with your stand before ordering.",
      "availableAs": [
        "Chiller"
      ],
      "flavors": [
        "Cupcake",
        "Salted Caramel",
        "White Choc"
      ],
      "base": "Blended Chiller Mix",
      "tags": [
        "secret-menu"
      ],
      "imageCaption": "Product image: 7 Brew.",
      "imageSource": "https://7brew.com/chiller-nights/funnel-cake-coffee-frozen-chiller",
      "pricing": {
        "small": 5.25,
        "medium": 6.25,
        "large": 7.25
      }
    },
    {
      "id": "secret-black-mamba",
      "name": "Black Mamba 7 Energy",
      "image": "assets/products/category-classics.webp",
      "imageAlt": "7 Classics category photo",
      "category": "secret-menu",
      "badge": "Confirm recipe locally",
      "tagline": "Blue Raspberry, Strawberry & Passionfruit",
      "desc": "A guide entry for this named order. Confirm the base, flavor combination and availability with your stand before ordering.",
      "availableAs": [
        "Iced",
        "Chiller"
      ],
      "flavors": [
        "Blue Raspberry",
        "Strawberry",
        "Passionfruit"
      ],
      "base": "7 Energy Base",
      "tags": [
        "secret-menu",
        "high-caffeine"
      ],
      "imageCaption": "Official category photo; exact custom drink is not pictured.",
      "imageSource": "https://7brew.com/menu",
      "pricing": {
        "small": 4.75,
        "medium": 5.5,
        "large": 6.5
      }
    },
    {
      "id": "secret-snickerdoodle",
      "name": "Snickerdoodle Latte",
      "image": "assets/products/category-classics.webp",
      "imageAlt": "7 Classics category photo",
      "category": "secret-menu",
      "badge": "Confirm recipe locally",
      "tagline": "Brown Sugar Cinnamon & Vanilla with Cinnamon Dust",
      "desc": "A guide entry for this named order. Confirm the base, flavor combination and availability with your stand before ordering.",
      "availableAs": [
        "Iced",
        "Hot"
      ],
      "flavors": [
        "Brown Sugar Cinnamon",
        "Vanilla"
      ],
      "base": "Espresso + Milk",
      "tags": [
        "secret-menu",
        "sugar-free-available"
      ],
      "imageCaption": "Official category photo; exact custom drink is not pictured.",
      "imageSource": "https://7brew.com/menu",
      "pricing": {
        "small": 4.5,
        "medium": 5.25,
        "large": 6
      }
    }
  ],
  "faqs": [
    {
      "q": "Where can I check current 7 Brew prices?",
      "a": "Select your stand in the official app or ask at the drive-thru. This guide does not have a verified nationwide price list. Confirm the final price after customizations."
    },
    {
      "q": "What is in a 7 Brew Blondie?",
      "a": "The official catalog lists vanilla and caramel in a breve. Read our Blondie guide for preparation choices and comparisons."
    },
    {
      "q": "Are Cookie Butter and Banana Bread on the official menu?",
      "a": "Both appear in the official 7 Originals catalog checked September 9, 2026. Confirm availability with your selected stand."
    },
    {
      "q": "Does 7 Brew have sugar-free flavors?",
      "a": "The official catalog marks selected flavors with sugar-free options. This does not mean every finished drink containing those flavors is sugar-free."
    },
    {
      "q": "Does 7 Brew have an app?",
      "a": "Yes. Find the official download links and current program details through 7brew.com/rewards. Our app guide explains how to check your stand before ordering."
    },
    {
      "q": "Does every 7 Brew have the same hours?",
      "a": "No. The researched official stand listings contain different opening and closing times. Check the exact street address in our location guides or the official directory."
    },
    {
      "q": "Where can I find calories and caffeine?",
      "a": "Use the official nutrition guide and match the drink name, size and preparation. Customizations may need a separate check with 7 Brew."
    },
    {
      "q": "How do I order a custom flavor combination?",
      "a": "Specify the drink base, size, preparation and flavors. A nickname alone may not identify the recipe you want. Ask the stand to confirm the order."
    }
  ]
};
