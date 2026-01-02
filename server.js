const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Configurar EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Importar utilitários
const { getProductsByProfile, validateRoutineOrder } = require("./lib/products");
const { getUnlockedAchievements, getStatistics, ACHIEVEMENTS } = require("./lib/achievements");

// Arquivo de dados (simular banco de dados)
const dataFile = path.join(__dirname, "data.json");

function loadData() {
  try {
    if (fs.existsSync(dataFile)) {
      return JSON.parse(fs.readFileSync(dataFile, "utf8"));
    }
  } catch (error) {
    console.error("Erro ao carregar dados:", error);
  }
  return {
    skinProfile: null,
    routine: null,
    habitHistory: [],
    notificationSettings: {
      enabled: true,
      morningTime: "08:00",
      nightTime: "20:00",
      morningEnabled: true,
      nightEnabled: true,
      soundEnabled: true,
    },
  };
}

function saveData(data) {
  try {
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Erro ao salvar dados:", error);
  }
}

// Rotas
app.get("/", (req, res) => {
  const data = loadData();
  res.render("index", { hasRoutine: !!data.routine });
});

app.get("/quiz", (req, res) => {
  res.render("quiz");
});

app.post("/quiz", (req, res) => {
  const { skinType, concerns, sensitivity } = req.body;
  const data = loadData();

  data.skinProfile = {
    skinType,
    concerns: Array.isArray(concerns) ? concerns : [concerns],
    sensitivity,
  };

  const products = getProductsByProfile(skinType);
  saveData(data);

  res.json({ success: true, products });
});

app.get("/recommendations", (req, res) => {
  const data = loadData();
  if (!data.skinProfile) {
    return res.redirect("/quiz");
  }

  const products = getProductsByProfile(data.skinProfile.skinType);
  res.render("recommendations", { products, profile: data.skinProfile });
});

app.get("/routine", (req, res) => {
  const data = loadData();
  if (!data.skinProfile) {
    return res.redirect("/quiz");
  }

  const products = getProductsByProfile(data.skinProfile.skinType);
  res.render("routine", { products });
});

app.post("/routine", (req, res) => {
  const { morningRoutine, nightRoutine } = req.body;
  const data = loadData();

  const morningProducts = morningRoutine ? JSON.parse(morningRoutine) : [];
  const nightProducts = nightRoutine ? JSON.parse(nightRoutine) : [];

  const morningWarnings = validateRoutineOrder(morningProducts, "morning");
  const nightWarnings = validateRoutineOrder(nightProducts, "night");

  data.routine = {
    morning: morningProducts,
    night: nightProducts,
  };

  saveData(data);

  res.json({
    success: true,
    morningWarnings,
    nightWarnings,
  });
});

app.get("/dashboard", (req, res) => {
  const data = loadData();
  if (!data.routine) {
    return res.redirect("/");
  }

  const today = new Date().toISOString().split("T")[0];
  const todayHabit = data.habitHistory.find(h => h.date === today) || {
    date: today,
    completedMorning: false,
    completedNight: false,
  };

  const consecutiveDays = calculateConsecutiveDays(data.habitHistory);

  res.render("dashboard", {
    routine: data.routine,
    todayHabit,
    consecutiveDays,
  });
});

app.post("/complete-routine", (req, res) => {
  const { timeOfDay } = req.body;
  const data = loadData();

  const today = new Date().toISOString().split("T")[0];
  let todayEntry = data.habitHistory.find(h => h.date === today);

  if (!todayEntry) {
    todayEntry = {
      date: today,
      completedMorning: false,
      completedNight: false,
    };
    data.habitHistory.push(todayEntry);
  }

  if (timeOfDay === "morning") {
    todayEntry.completedMorning = true;
  } else {
    todayEntry.completedNight = true;
  }

  saveData(data);
  res.json({ success: true });
});

app.get("/profile", (req, res) => {
  const data = loadData();
  if (!data.habitHistory || data.habitHistory.length === 0) {
    return res.redirect("/");
  }

  const stats = getStatistics(data.habitHistory);
  const unlockedAchievements = getUnlockedAchievements(data.habitHistory);

  res.render("profile", {
    stats,
    history: data.habitHistory,
    unlockedAchievements,
    allAchievements: ACHIEVEMENTS,
  });
});

app.get("/settings", (req, res) => {
  const data = loadData();
  res.render("settings", { settings: data.notificationSettings });
});

app.post("/settings", (req, res) => {
  const data = loadData();
  const { enabled, morningTime, nightTime, morningEnabled, nightEnabled, soundEnabled } = req.body;

  data.notificationSettings = {
    enabled: enabled === "on",
    morningTime,
    nightTime,
    morningEnabled: morningEnabled === "on",
    nightEnabled: nightEnabled === "on",
    soundEnabled: soundEnabled === "on",
  };

  saveData(data);
  res.json({ success: true });
});

app.post("/reset-today", (req, res) => {
  const data = loadData();
  const today = new Date().toISOString().split("T")[0];
  const index = data.habitHistory.findIndex(h => h.date === today);

  if (index !== -1) {
    data.habitHistory.splice(index, 1);
    saveData(data);
  }

  res.json({ success: true });
});

app.post("/clear-all", (req, res) => {
  try {
    if (fs.existsSync(dataFile)) {
      fs.unlinkSync(dataFile);
    }
    res.json({ success: true });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

// Função auxiliar
function calculateConsecutiveDays(history) {
  if (!history || history.length === 0) return 0;

  const sorted = [...history].sort((a, b) => new Date(b.date) - new Date(a.date));

  let consecutive = 0;
  let lastDate = null;

  for (const entry of sorted) {
    if (entry.completedMorning || entry.completedNight) {
      const entryDate = new Date(entry.date);

      if (lastDate === null) {
        consecutive = 1;
        lastDate = entryDate;
      } else {
        const daysDiff = (lastDate - entryDate) / (1000 * 60 * 60 * 24);
        if (daysDiff === 1) {
          consecutive++;
          lastDate = entryDate;
        } else {
          break;
        }
      }
    }
  }

  return consecutive;
}

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🌸 GlowRoutine rodando em http://localhost:${PORT}`);
});
