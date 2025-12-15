import bakery_image from "./bakery.jpg";
import namkeens_image from "./namkeens.PNG";
import snacks_image from "./snacks.JPG";
import sweets_image from "./sweet.jpg";
import chocolates_image from "./chocolates.JPG";
import coldrinks_image from "./coldrinks.PNG";
import icecreams_image from "./ice-cream.JPG";
import spices_image from "./spices.PNG";
import dairy_image from "./dairy.PNG";
import biscuits_image from "./biscuits.PNG";
import dryfruits_image from "./dryfruits.PNG";
import bestdeal_image from "./bestdeal.PNG";
import others_image from "./others.PNG";
import celebration_image from "./celebration.PNG";
  //dummy Products
import wheat_image from "./wheat.JPG";
import twist_image from "./twist.JPG";
import aloo_bhujia_image from "./aloo-bhujia.PNG";
import aloo_bhujia_2 from "./aloo-bhujia2.PNG";

import moong_dal_image from "./moong-dal.PNG";
import chips_image from "./chips.PNG";
import banana_image from "./banana.PNG";
import gulab_jamun_image from "./gulab-jamun.PNG";
import rasgulla_image from "./rasgulla.PNG";
import dairymilk_image from "./dairymilk.PNG";
import kitkat_image from "./kitkat.PNG";
import coke_image from "./coke.PNG";
import pepsi_image from "./pepsi.PNG";
import vanilla_ice_image from "./vanilla-ice.PNG";
import choco_ice_image from "./choco-ice.PNG";
import pavbhaji_image from "./pavbhaji.PNG";
import panipuri_image from "./panipuri.PNG";
// Dairy
import amul_taaza_image from "./amul-taaza.PNG";
import amul_butter_image from "./amul-butter.PNG";

// Biscuits
import parleG_image from "./parleG.PNG";
import oreo_image from "./oreo.PNG";
 
//icons
import star_icon from "./star_icon.svg";
import star_dull_icon from "./star_dull_icon.svg";
import add_address_image from "./add_address_image.svg";
import product_list_icon from "./product_list_icon.svg";
import order_icon from "./order_icon.svg";
import add_icon from "./add_icon.svg";
import upload_area from "./upload_area.png";
import box_icon from "./box_icon.svg";





export const assets = {
  star_icon,
  star_dull_icon,
  add_address_image,
  add_icon,
  order_icon,
  product_list_icon,
  upload_area,
  box_icon
 
};


export const categories = [
  {
    text: "Bakery",
    path: "Bakery",
    image: bakery_image,
    bgColor: "#FDE2E4",
  },
  {
    text: "Namkeens",
    path: "Namkeens",
    image: namkeens_image,
    bgColor: "#FFF1E6",
  },
  {
    text: "Snacks",
    path: "Snacks",
    image: snacks_image,
    bgColor: "#E2F0CB",
  },
  {
    text: "Sweets",
    path: "Sweets",
    image: sweets_image,
    bgColor: "#F0EFEB",
  },
  {
    text: "Chocolates",
    path: "Chocolates",
    image: chocolates_image,
    bgColor: "#D7E3FC",
  },
  {
    text: "Coldrinks",
    path: "Coldrinks",
    image: coldrinks_image,
    bgColor: "#C7FFD8",
  },
  {
    text: "Ice-creams",
    path: "IceCreams",
    image: icecreams_image,
    bgColor: "#FFF5BA",
  },
  {
    text: "Spices",
    path: "Spices",
    image: spices_image,
    bgColor: "#E2F0CB",
  },
  {
    text: "Dairy Products",
    path: "Dairy",
    image: dairy_image,
    bgColor: "#E2F0CB",
  },
  {
    text: "Biscuits",
    path: "Biscuits",
    image: biscuits_image,
    bgColor: "#E2F0CB",
  },
  // Newly added categories appended after existing ones
  {
    text: "Dryfruits",
    path: "Dryfruits",
    image: dryfruits_image,
    bgColor: "#FFF0D5",
  },
  {
    text: "Deal of the Day",
    path: "Deal",
    image: bestdeal_image,
    bgColor: "#E8E7FF",
  },
  {
    text: "Others",
    path: "Others",
    image: others_image,
    bgColor: "#E6F7F2",
  },
  {
    text: "Celebration Needs",
    path: "Celebration",
    image: celebration_image,
    bgColor: "#FFE7F0",
  },
];

export const dummyProducts = [
  // Bakery
  {
    _id: "bk01",
    name: "Wheat Khari [250 gm]",
    category: "Bakery",
    price:100 ,
    offerPrice: 80,
    image: [wheat_image],
    description: [
      "Soft and freshly baked",
      "Crispy and Cruncy",
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    inStock: true,
  },
  {
    _id: "bk02",
    name: "Twist Khari [250 gm]",
    category: "Bakery",
    price: 100,
    offerPrice: 80,
    image: [twist_image],
    description: ["Round Twist", "Fresh and Baked", "Best seller"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    inStock: true,
  },

  // Namkeens
  {
    _id: "nm01",
    name: "Aloo Bhujia [200 gm]",
    category: "Namkeens",
    price: 50,
    offerPrice: 45,
    image: [aloo_bhujia_image,aloo_bhujia_2],
    description: ["Crispy and spicy", "Perfect tea-time snack"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    inStock: true,
  },
  {
    _id: "nm02",
    name: "Moong Dal Namkeen [200 gm]",
    category: "Namkeens",
    price: 55,
    offerPrice: 50,
    image: [moong_dal_image],
    description: ["Crispy fried moong dal", "Light and tasty snack"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    inStock: true,
  },

  // Snacks
  {
    _id: "sn01",
    name: "Potato Chips [500 gm]",
    category: "Snacks",
    price: 200,
    offerPrice: 150,
    image: [chips_image],
    description: ["Crispy salted chips", "Kids’ favorite"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    inStock: true,
  },
  {
    _id: "sn02",
    name: "Banana Chips [200 gm]",
    category: "Snacks",
    price: 120,
    offerPrice: 80,
    image: [banana_image],
    description: ["Plain Salted flavor", "Crispy and crunchy"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    inStock: true,
  },

  // Sweets
  {
    _id: "sw01",
    name: "Gulab Jamun (6 pcs)",
    category: "Sweets",
    price: 125,
    offerPrice: 120,
    image: [gulab_jamun_image],
    description: ["Soft and juicy", "Made with khoya", "Best served warm"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    inStock: true,
  },
  {
    _id: "sw02",
    name: "Rasgulla (6 pcs)",
    category: "Sweets",
    price: 125,
    offerPrice: 120,
    image: [rasgulla_image],
    description: ["Soft and spongy", "Authentic Bengali sweet"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    inStock: true,
  },

  // Chocolates
  {
    _id: "ch01",
    name: "Dairy Milk Chocolate",
    category: "Chocolates",
    price: 50,
    offerPrice: 49,
    image: [dairymilk_image],
    description: ["Creamy milk chocolate", "Loved by kids and adults"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    inStock: true,
  },
  {
    _id: "ch02",
    name: "KitKat",
    category: "Chocolates",
    price: 20,
    offerPrice: 19,
    image: [kitkat_image],
    description: ["Crispy wafer coated with chocolate"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    inStock: true,
  },

  // Cold Drinks
  {
    _id: "cd01",
    name: "Coca-Cola 750ml",
    category: "Coldrinks",
    price: 40,
    offerPrice: 38,
    image: [coke_image],
    description: ["Refreshing fizzy drink", "Best served chilled"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    inStock: true,
  },
  {
    _id: "cd02",
    name: "Pepsi 750ml",
    category: "Coldrinks",
    price: 38,
    offerPrice: 35,
    image: [pepsi_image],
    description: ["Classic cola taste", "Best served cold"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    inStock: true,
  },

  // Ice-creams
  {
    _id: "ic01",
    name: "Vanilla Ice Cream 500ml",
    category: "IceCreams",
    price: 115,
    offerPrice: 110,
    image: [vanilla_ice_image],
    description: ["Creamy and rich", "Perfect dessert"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    inStock: true,
  },
  {
    _id: "ic02",
    name: "Chocolate Ice Cream 500ml",
    category: "IceCreams",
    price: 130,
    offerPrice: 120,
    image: [choco_ice_image],
    description: ["Rich chocolate flavor", "All-time favorite"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    inStock: true,
  },

  // Spices
  {
    _id: "sp01",
    name: "Pav Bhaji masala ",
    category: "Spices",
    price: 10,
    offerPrice: 10,
    image: [pavbhaji_image],
    description: ["Enhances the authentic street-style pav bhaji taste"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    inStock: true,
  },
  {
    _id: "sp02",
    name: "Pani Puri Masala Powder ",
    category: "Spices",
    price: 10,
    offerPrice: 10,
    image: [panipuri_image],
    description: [ "Tangy and spicy masala mix",
     "Specially crafted for delicious pani puri water",
     "Quick and easy to prepare at home"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    inStock: true,
  },
  // Dairy Products
  {
    _id: "dy01",
    name: "Amul Taaza Milk 1L",
    category: "Dairy",
    price: 65,
    offerPrice: 60,
    image: [amul_taaza_image],
    description: [
      "Fresh toned milk",
      "Rich in protein and calcium",
      "Perfect for tea, coffee, and daily use"
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    inStock: true,
  },
  {
    _id: "dy02",
    name: "Amul Butter 100g",
    category: "Dairy",
    price: 62,
    offerPrice: 61,
    image: [amul_butter_image],
    description: [
      "Delicious creamy butter",
      "Ideal for bread, pav bhaji, and cooking",
      "Loved by all age groups"
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    inStock: true,
  },

  // Biscuits
  {
    _id: "bs01",
    name: "Parle-G (10 Rs Pack)",
    category: "Biscuits",
    price: 10,
    offerPrice: 10,
    image: [parleG_image],
    description: [
      "Classic glucose biscuit",
      "Perfect with chai",
      "Loved by kids and adults"
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    inStock: true,
  },
  {
    _id: "bs02",
    name: "Oreo Cream Biscuits 120g",
    category: "Biscuits",
    price: 30,
    offerPrice: 28,
    image: [oreo_image],
    description: [
      "Crunchy chocolate biscuits",
      "Cream-filled center",
      "Perfect snack for kids"
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    inStock: true,
  },

];

export const dummyAddress = [
  {
    _id: "67b5b9e54ea97f71bbc196a0",
    userId: "67b5880e4d09769c5ca61644",
    firstName: "Great",
    lastName: "Stack",
    email: "user.greatstack@gmail.com",
    street: "C'Block Road",
    city: "Ulhasnagar",
    state: "Maharastra",
    zipcode: 421002,
    country: "IN",
    phone: "9970920200",
  },
];

export const dummyOrders = [
  {
    _id: "67e2589a8f87e63366786400",
    userId: "67b5880e4d09769c5ca61644",
    items: [
      {
        product: dummyProducts[3],
        quantity: 2,
        _id: "67e2589a8f87e63366786401",
      },
    ],
    amount: 89,
    address: dummyAddress[0],
    status: "Order Placed",
    paymentType: "Online",
    isPaid: true,
    createdAt: "2025-03-25T07:17:46.018Z",
    updatedAt: "2025-03-25T07:18:13.103Z",
  },
  {
    _id: "67e258798f87e633667863f2",
    userId: "67b5880e4d09769c5ca61644",
    items: [
      {
        product: dummyProducts[0],
        quantity: 1,
        _id: "67e258798f87e633667863f3",
      },
      {
        product: dummyProducts[1],
        quantity: 1,
        _id: "67e258798f87e633667863f4",
      },
    ],
    amount: 43,
    address: dummyAddress[0],
    status: "Order Placed",
    paymentType: "COD",
    isPaid: false,
    createdAt: "2025-03-25T07:17:13.068Z",
    updatedAt: "2025-03-25T07:17:13.068Z",
  },
];


