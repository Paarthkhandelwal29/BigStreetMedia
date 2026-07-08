import { listPortfolio } from "./lib/cms/store";

async function main() {
  try {
    const items = await listPortfolio();
    console.log("DATABASE PORTFOLIO ITEMS:");
    items.forEach(item => {
      console.log(`- ID: ${item.id}, Brand: "${item.brandName}", Image: "${item.mediaUrl}", Type: "${item.mediaType}"`);
    });
  } catch (err) {
    console.error("Error fetching database portfolio items:", err);
  }
}

main();
