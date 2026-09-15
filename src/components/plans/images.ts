import biryani from "@/assets/hero-biryani.webp";
import plate from "@/assets/meal-plate.webp";
import thali from "@/assets/thali-tray.webp";
import chicken from "@/assets/dish-chicken.webp";
import curry from "@/assets/dish-curry.webp";
import rajma from "@/assets/dish-rajma.webp";
import rice from "@/assets/dish-rice.webp";
import roti from "@/assets/dish-roti.webp";
import { sizes, type MealSize, type Product } from "@/lib/catalog";

/* Hero, thali, plate, chicken and rajma are Dawat's own photos.
   curry.webp and roti.webp are CC0 from Wikimedia Commons
   ("Chicken curry Trivandrum", "Chapati-1"). Replace with real kitchen shots when available. */
export const images = { plate, thali, biryani, chicken, curry, rajma, rice, roti };

export function sizeImage(size: MealSize) {
  return sizes[size].image === "thali" ? thali : plate;
}

export function productImage(p: Product) {
  return p.kind === "trial" ? biryani : sizeImage(p.size);
}
