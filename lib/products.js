// Dados de produtos por tipo de pele
const productsByProfile = {
  oily: [
    { id: 1, name: "Limpador Facial Oil Control", category: "cleanser", timeOfDay: "morning", order: 1 },
    { id: 2, name: "Tônico Adstringente", category: "toner", timeOfDay: "morning", order: 2 },
    { id: 3, name: "Sérum Matificante", category: "serum", timeOfDay: "morning", order: 3 },
    { id: 4, name: "Protetor Solar Matte", category: "sunscreen", timeOfDay: "morning", order: 4 },
    { id: 5, name: "Limpador Noturno", category: "cleanser", timeOfDay: "night", order: 1 },
    { id: 6, name: "Máscara Argila Purificante", category: "mask", timeOfDay: "night", order: 2, duration: 15 },
    { id: 7, name: "Hidratante Leve Oil-Free", category: "moisturizer", timeOfDay: "night", order: 3 },
  ],
  dry: [
    { id: 8, name: "Limpador Cremoso", category: "cleanser", timeOfDay: "morning", order: 1 },
    { id: 9, name: "Tônico Hidratante", category: "toner", timeOfDay: "morning", order: 2 },
    { id: 10, name: "Sérum Hidratante", category: "serum", timeOfDay: "morning", order: 3 },
    { id: 11, name: "Hidratante Nutritivo", category: "moisturizer", timeOfDay: "morning", order: 4 },
    { id: 12, name: "Protetor Solar Hidratante", category: "sunscreen", timeOfDay: "morning", order: 5 },
    { id: 13, name: "Óleo Facial Noturno", category: "oil", timeOfDay: "night", order: 1 },
    { id: 14, name: "Máscara Hidratante", category: "mask", timeOfDay: "night", order: 2, duration: 20 },
    { id: 15, name: "Creme Noturno Intenso", category: "moisturizer", timeOfDay: "night", order: 3 },
  ],
  combination: [
    { id: 16, name: "Limpador Suave", category: "cleanser", timeOfDay: "morning", order: 1 },
    { id: 17, name: "Tônico Equilibrante", category: "toner", timeOfDay: "morning", order: 2 },
    { id: 18, name: "Sérum Equilibrante", category: "serum", timeOfDay: "morning", order: 3 },
    { id: 19, name: "Hidratante Leve", category: "moisturizer", timeOfDay: "morning", order: 4 },
    { id: 20, name: "Protetor Solar Equilibrado", category: "sunscreen", timeOfDay: "morning", order: 5 },
    { id: 21, name: "Limpador Noturno", category: "cleanser", timeOfDay: "night", order: 1 },
    { id: 22, name: "Máscara Equilibrante", category: "mask", timeOfDay: "night", order: 2, duration: 15 },
    { id: 23, name: "Hidratante Noturna", category: "moisturizer", timeOfDay: "night", order: 3 },
  ],
  sensitive: [
    { id: 24, name: "Limpador Suave Hipoalergênico", category: "cleanser", timeOfDay: "morning", order: 1 },
    { id: 25, name: "Tônico Calmante", category: "toner", timeOfDay: "morning", order: 2 },
    { id: 26, name: "Sérum Calmante", category: "serum", timeOfDay: "morning", order: 3 },
    { id: 27, name: "Hidratante Calmante", category: "moisturizer", timeOfDay: "morning", order: 4 },
    { id: 28, name: "Protetor Solar Sensível", category: "sunscreen", timeOfDay: "morning", order: 5 },
    { id: 29, name: "Limpador Noturno Suave", category: "cleanser", timeOfDay: "night", order: 1 },
    { id: 30, name: "Máscara Calmante Suave", category: "mask", timeOfDay: "night", order: 2, duration: 10 },
    { id: 31, name: "Creme Noturno Calmante", category: "moisturizer", timeOfDay: "night", order: 3 },
  ],
};

// Categorias de produtos e sua ordem ideal
const productOrder = {
  morning: ["cleanser", "toner", "serum", "moisturizer", "sunscreen"],
  night: ["cleanser", "toner", "serum", "mask", "oil", "moisturizer"],
};

function getProductsByProfile(profile) {
  return productsByProfile[profile] || [];
}

function validateRoutineOrder(products, timeOfDay) {
  const validOrder = productOrder[timeOfDay];
  const warnings = [];

  for (let i = 0; i < products.length - 1; i++) {
    const currentCategory = products[i].category;
    const nextCategory = products[i + 1].category;

    const currentIndex = validOrder.indexOf(currentCategory);
    const nextIndex = validOrder.indexOf(nextCategory);

    if (currentIndex > nextIndex) {
      warnings.push(
        `⚠️ ${products[i].name} deve vir antes de ${products[i + 1].name}`
      );
    }
  }

  return warnings;
}

module.exports = {
  getProductsByProfile,
  validateRoutineOrder,
  productsByProfile,
  productOrder,
};
