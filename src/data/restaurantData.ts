// ============ TYPES ============
export interface MenuItem {
  id: string;
  name: string;
  price: number;
  protein: number;
  fat: number;
  calories: number;
  description?: string;
}

export interface Restaurant {
  id: string;
  name: string;
  cuisine?: string;
  menuItems: MenuItem[];
}

// ============ MOCK DATA ============
export const RESTAURANTS: Restaurant[] = [
  {
    id: "rest1",
    name: "McDonald's",
    cuisine: "Fast Food",
    menuItems: [
      {
        id: "item1",
        name: "Big Mac",
        price: 5.99,
        protein: 25,
        fat: 34,
        calories: 550,
        description: "Two all-beef patties, special sauce"
      },
      {
        id: "item2",
        name: "McChicken",
        price: 3.99,
        protein: 14,
        fat: 19,
        calories: 400
      },
      {
        id: "item3",
        name: "French Fries (Medium)",
        price: 2.49,
        protein: 3,
        fat: 15,
        calories: 320
      }
    ]
  },
  {
    id: "rest2",
    name: "Chipotle",
    cuisine: "Mexican",
    menuItems: [
      {
        id: "item4",
        name: "Chicken Burrito",
        price: 8.99,
        protein: 42,
        fat: 28,
        calories: 980,
        description: "With rice, beans, salsa, cheese"
      },
      {
        id: "item5",
        name: "Steak Bowl",
        price: 9.49,
        protein: 38,
        fat: 24,
        calories: 720
      }
    ]
  },
  {
    id: "rest3",
    name: "Subway",
    cuisine: "Sandwiches",
    menuItems: [
      {
        id: "item6",
        name: "Turkey Footlong",
        price: 6.99,
        protein: 36,
        fat: 8,
        calories: 560
      },
      {
        id: "item7",
        name: "Meatball Marinara",
        price: 5.99,
        protein: 24,
        fat: 22,
        calories: 680
      }
    ]
  },
  {
    id: "rest4",
    name: "Pizza Hut",
    cuisine: "Pizza",
    menuItems: [
      {
        id: "item8",
        name: "Pepperoni Pizza (Large)",
        price: 12.99,
        protein: 48,
        fat: 56,
        calories: 2160
      },
      {
        id: "item9",
        name: "Breadsticks",
        price: 4.99,
        protein: 8,
        fat: 18,
        calories: 420
      }
    ]
  }
];