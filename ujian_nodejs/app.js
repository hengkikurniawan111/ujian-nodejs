const express = require("express");
const { sequelize } = require("./models");
const taskRoutes = require("./routes/taskRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Mount router task ke prefix /api
app.use("/api", taskRoutes);

// Root route untuk testing koneksi
app.get("/", (req, res) => {
  res.json({
    message: "Rancangan Backend Express.js + Sequelize berjalan sukses!",
    endpoints: {
      tasks: "/api/tasks?page=1&pageSize=10&q=belajar&done=false"
    }
  });
});

// Jalankan server setelah database berhasil sinkronisasi
const startServer = async () => {
  try {
    // Sync database (membuat table jika belum ada)
    await sequelize.sync({ force: false });
    console.log("Database SQLite berhasil disinkronisasi.");

    app.listen(PORT, () => {
      console.log(`Server berjalan di http://localhost:${PORT}`);
      console.log(`Endpoint Tugas: http://localhost:${PORT}/api/tasks`);
    });
  } catch (error) {
    console.error("Gagal memulai server:", error);
  }
};

startServer();
