/**
 * File ini berisi contoh query relasi Sequelize menggunakan 'include'
 * Sesuai dengan kebutuhan tugas:
 * 1. Mengambil semua Task beserta User pemiliknya.
 * 2. Mengambil User beserta seluruh Task miliknya.
 */

const { User, Task, sequelize } = require("./models");

async function runExamples() {
  try {
    // Sinkronisasi database
    await sequelize.sync();
    console.log("Database synced. Menjalankan contoh query...\n");

    // =========================================================================
    // CONTOH 1: Mengambil semua Task beserta User pemiliknya menggunakan 'include'
    // =========================================================================
    console.log("--- CONTOH 1: Get All Tasks Include User ---");
    const tasks = await Task.findAll({
      include: [
        {
          model: User,
          as: "user", // Sesuai alias yang didefinisikan di models/index.js
          attributes: ["id", "name", "email"] // Memilih kolom tertentu milik User
        }
      ]
    });

    console.log(JSON.stringify(tasks, null, 2));
    console.log("\n---------------------------------------------------\n");

    // =========================================================================
    // CONTOH 2: Mengambil User beserta seluruh Task miliknya menggunakan 'include'
    // =========================================================================
    console.log("--- CONTOH 2: Get Users Include Tasks ---");
    const users = await User.findAll({
      include: [
        {
          model: Task,
          as: "tasks", // Sesuai alias yang didefinisikan di models/index.js
          attributes: ["id", "title", "done"] // Memilih kolom tertentu milik Task
        }
      ]
    });

    console.log(JSON.stringify(users, null, 2));
    
  } catch (error) {
    console.error("Gagal menjalankan query contoh:", error);
  } finally {
    await sequelize.close();
  }
}

// Hanya jalankan jika dieksekusi langsung
if (require.main === module) {
  runExamples();
}
