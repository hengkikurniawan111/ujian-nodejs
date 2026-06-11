const { Op } = require("sequelize");
const { Task, User } = require("../models");

/**
 * Controller untuk menangani endpoint GET /api/tasks
 * Menerapkan pagination, search, dan filter.
 */
exports.getAllTasks = async (req, res) => {
  try {
    // 1. Ambil parameter dari query string dengan default value
    const page = parseInt(req.query.page, 10) || 1;
    const pageSize = parseInt(req.query.pageSize, 10) || 10;
    const { q, done } = req.query;

    // 2. Hitung limit dan offset untuk pagination
    const limit = pageSize;
    const offset = (page - 1) * limit;

    // 3. Bangun objek query where clause secara dinamis
    const whereClause = {};

    // Filter pencarian berdasarkan judul (title) menggunakan Op.like
    if (q) {
      whereClause.title = {
        [Op.like]: `%${q}%`,
      };
    }

    // Filter berdasarkan status selesai (done).
    // Karena query string bertipe string, kita konversi ke boolean.
    if (done !== undefined) {
      whereClause.done = done === "true";
    }

    // 4. Eksekusi query findAndCountAll agar mendapatkan total data (untuk metadata pagination)
    const { count, rows: tasks } = await Task.findAndCountAll({
      where: whereClause,
      limit: limit,
      offset: offset,
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email"], // Hanya ambil field yang diperlukan
        },
      ],
      order: [["createdAt", "DESC"]], // Urutkan berdasarkan tugas terbaru
    });

    // 5. Hitung total halaman (totalPages)
    const totalPages = Math.ceil(count / limit);

    // 6. Kembalikan response terstruktur beserta metadata pagination
    return res.status(200).json({
      success: true,
      message: "Berhasil mengambil data task",
      data: tasks,
      pagination: {
        totalItems: count,
        currentPage: page,
        pageSize: limit,
        totalPages: totalPages,
      },
    });
  } catch (error) {
    console.error("Error pada getAllTasks controller:", error);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan internal pada server",
      error: error.message,
    });
  }
};
