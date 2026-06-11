# Notes

repositori ini hanya untuk memenuhi tugas mata kuliah 

## 🟢 1. Cara Frontend Vue Memproses API Ini

Untuk menampilkan data dari endpoint `GET /api/tasks?page=1&pageSize=10&q=belajar&done=false` di Vue, frontend perlu melakukan pemanggilan HTTP request (menggunakan `axios` atau `fetch`) secara dinamis saat user melakukan pencarian, filter, atau mengganti halaman.

### Contoh Implementasi Komponen Vue 3 (Composition API):

```html
<template>
  <div class="task-manager">
    <!-- 1. Input Pencarian & Filter -->
    <div class="filters">
      <input 
        v-model="searchQuery" 
        @input="fetchTasks" 
        placeholder="Cari tugas..." 
      />
      
      <select v-model="filterDone" @change="fetchTasks">
        <option value="">Semua Status</option>
        <option value="true">Selesai</option>
        <option value="false">Belum Selesai</option>
      </select>
    </div>

    <!-- 2. List Tasks -->
    <div v-if="loading">Memuat data...</div>
    <ul v-else>
      <li v-for="task in tasks" :key="task.id">
        <strong>{{ task.title }}</strong> - 
        <span>{{ task.done ? 'Selesai' : 'Belum Selesai' }}</span>
        <small>(Pemilik: {{ task.user?.name }})</small>
      </li>
    </ul>

    <!-- 3. Pagination Kontrol -->
    <div class="pagination">
      <button :disabled="currentPage === 1" @click="changePage(currentPage - 1)">
        Sebelumnya
      </button>
      <span>Halaman {{ currentPage }} dari {{ totalPages }}</span>
      <button :disabled="currentPage === totalPages" @click="changePage(currentPage + 1)">
        Selanjutnya
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

// State Reactif
const tasks = ref([]);
const loading = ref(false);
const searchQuery = ref('');
const filterDone = ref('');
const currentPage = ref(1);
const totalPages = ref(1);
const pageSize = ref(5); // Jumlah item per halaman

// Fungsi untuk fetch data dari backend Express
const fetchTasks = async () => {
  loading.value = true;
  try {
    const params = {
      page: currentPage.value,
      pageSize: pageSize.value,
    };

    // Tambahkan filter q jika diisi
    if (searchQuery.value) params.q = searchQuery.value;
    
    // Tambahkan filter done jika dipilih
    if (filterDone.value !== '') params.done = filterDone.value;

    const response = await axios.get('http://localhost:3000/api/tasks', { params });
    
    // Simpan data & metadata pagination dari response API backend
    tasks.value = response.data.data;
    totalPages.value = response.data.pagination.totalPages;
  } catch (error) {
    console.error("Gagal memuat tugas:", error);
  } finally {
    loading.value = false;
  }
};

// Ubah halaman & ambil data baru
const changePage = (newPage) => {
  currentPage.value = newPage;
  fetchTasks();
};

onMounted(() => {
  fetchTasks();
});
</script>
```

---

## 🔵 2. Penggunaan Relasi User-Task dalam Query Sequelize

Relasi antara `User` dan `Task` diatur melalui file `models/index.js` dengan deklarasi berikut:
- **`User.hasMany(Task, { foreignKey: "userId", as: "tasks" })`**: Satu user bisa memiliki banyak task.
- **`Task.belongsTo(User, { foreignKey: "userId", as: "user" })`**: Satu task dimiliki oleh satu user tertentu.

Deklarasi relasi ini memberitahukan Sequelize untuk menghubungkan kolom `userId` pada tabel `tasks` ke kolom `id` pada tabel `users`. Dalam query Sequelize, relasi ini digunakan menggunakan metode **Eager Loading** lewat opsi `include`.

### A. Mengambil Task beserta User pemiliknya (`belongsTo`)
Ketika kita ingin menampilkan daftar tugas dan menampilkan siapa yang mengerjakan tugas tersebut, kita menggunakan `belongsTo`. Sequelize akan melakukan query `LEFT OUTER JOIN` dari tabel `tasks` ke tabel `users`.

```javascript
const tasks = await Task.findAll({
  include: [
    {
      model: User,
      as: "user", // Harus sesuai dengan alias di belongsTo
      attributes: ["id", "name", "email"] // Memilih kolom yang ingin di-expose saja
    }
  ]
});
```
**Hasil Output JSON:**
Setiap objek `task` akan disisipkan objek `user` secara otomatis:
```json
[
  {
    "id": 1,
    "title": "Belajar Express.js dasar",
    "done": true,
    "userId": 1,
    "user": {
      "id": 1,
      "name": "Budi Santoso",
      "email": "budi@example.com"
    }
  }
]
```

### B. Mengambil User beserta seluruh Task miliknya (`hasMany`)
Ketika kita ingin menampilkan daftar user dan melihat daftar tugas apa saja yang dimiliki masing-masing user, kita menggunakan `hasMany`. Sequelize akan melakukan query `LEFT OUTER JOIN` dari tabel `users` ke tabel `tasks`.

```javascript
const users = await User.findAll({
  include: [
    {
      model: Task,
      as: "tasks", // Harus sesuai dengan alias di hasMany
      attributes: ["id", "title", "done"] // Hanya mengambil kolom tertentu milik Task
    }
  ]
});
```
**Hasil Output JSON:**
Setiap objek `user` akan menyertakan array `tasks` yang berisi tugas-tugas miliknya:
```json
[
  {
    "id": 1,
    "name": "Budi Santoso",
    "email": "budi@example.com",
    "tasks": [
      {
        "id": 1,
        "title": "Belajar Express.js dasar",
        "done": true
      },
      {
        "id": 2,
        "title": "Belajar Sequelize ORM hubungan database",
        "done": false
      }
    ]
  }
]
```

---

## 🚀 Cara Menjalankan Project Ini

1. **Install Dependencies:**
   ```bash
   npm install
   ```
2. **Seed Dummy Data (Reset & Isi Database SQLite):**
   ```bash
   npm run seed
   ```
3. **Jalankan Contoh Query Relasi (Terminal):**
   ```bash
   npm run example-query
   ```
4. **Jalankan Server Express Lokal:**
   ```bash
   npm start
   ```
