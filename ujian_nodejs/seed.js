const { sequelize, User, Task } = require("./models");

const seedDatabase = async () => {
  try {
    // Force sync untuk mereset database dan membuat table baru
    await sequelize.sync({ force: true });
    console.log("Database reset dan disinkronisasi untuk seeding.");

    // 1. Buat Dummy Users
    const users = await User.bulkCreate([
      { name: "lethem mor", email: "lethem@example.com" },
      { name: "nuer les", email: "nuer@example.com" },
      { name: "frank saint", email: "frank@example.com" },
    ]);

    console.log("Dummy Users berhasil ditambahkan.");

    // 2. Buat Dummy Tasks terasosiasi dengan user
    await Task.bulkCreate([
      // Tugas Budi
      { title: "Belajar Express.js dasar", done: true, userId: users[0].id },
      { title: "Belajar Sequelize ORM hubungan database", done: false, userId: users[0].id },
      { title: "Membuat endpoint REST API GET Tasks", done: false, userId: users[0].id },

      // Tugas Siti
      { title: "Belajar Vue.js Frontend", done: false, userId: users[1].id },
      { title: "Membeli buku pemrograman Node.js", done: true, userId: users[1].id },
      { title: "Belajar SQL join table", done: true, userId: users[1].id },

      // Tugas Andi
      { title: "Refactoring code clean architecture", done: false, userId: users[2].id },
      { title: "Membuat dokumentasi REST API dengan Swagger", done: false, userId: users[2].id },
      { title: "Review pull request rekan kerja", done: true, userId: users[2].id },
      { title: "Belajar deployment ke cloud server", done: false, userId: users[2].id },
    ]);

    console.log("Dummy Tasks berhasil ditambahkan.");
    console.log("Proses seeding selesai dengan sukses!");
    
    process.exit(0);
  } catch (error) {
    console.error("Gagal melakukan seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
