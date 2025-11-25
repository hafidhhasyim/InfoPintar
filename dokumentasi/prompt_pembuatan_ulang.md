# Prompt Pembuatan Ulang Aplikasi "InfoPintar SMP"

Gunakan prompt berikut kepada AI Engineer (seperti saya) untuk membangun ulang aplikasi ini dari nol dengan fitur dan struktur yang sama persis.

---

**Role:** Bertindaklah sebagai Senior Frontend Engineer dengan keahlian React, TypeScript, dan UI/UX Design.

**Tugas:** Buatkan sebuah Single Page Application (SPA) bernama "InfoPintar SMP". Aplikasi ini adalah Knowledge Base Informatika untuk siswa SMP (Kelas 7, 8, 9) yang mencakup materi pembelajaran, kuis interaktif, dan manajemen konten (CMS) untuk admin.

### 1. Tech Stack & Libraries
*   **Framework:** React 19 (TypeScript).
*   **Styling:** Tailwind CSS (Gunakan CDN/Utility classes).
*   **Icons:** Lucide React.
*   **AI Integration:** @google/genai (Google Gemini API) untuk fitur "Tutor AI".
*   **Markdown:** react-markdown.
*   **Struktur File:** 
    *   `App.tsx`: Router utama dan Global State.
    *   `types.ts`: Definisi TypeScript interface/enum.
    *   `constants.ts`: Data dummy awal dan konfigurasi tema.
    *   `services/geminiService.ts`: Logika komunikasi dengan Gemini AI.
    *   `components/TopicCard.tsx`: Komponen kartu topik.
    *   `components/RichTextEditor.tsx`: Editor WYSIWYG custom.
    *   `components/AdminDashboard.tsx`: Logika dan tampilan Dashboard Admin.
    *   `components/StudentView.tsx`: Logika dan tampilan sisi Siswa.

### 2. Struktur Data (Types)
Definisikan struktur data yang mendukung hierarki berikut:
*   **SubjectModule:** Mengelompokkan materi (contoh: "Sistem Komputer Kelas 7").
*   **Topic:** Topik spesifik dalam modul.
*   **TopicMaterial (PENTING):** Array materi di dalam topik (mendukung Multi-tab content). Setiap materi memiliki:
    *   `id`: string
    *   `title`: string (Judul Tab)
    *   `content`: string (HTML string)
    *   `quizzes`: QuizQuestion[] (Soal spesifik untuk materi ini)
    *   `assignments`: Assignment[] (Tugas spesifik untuk materi ini)
*   **QuizQuestion:** Soal pilihan ganda (Question, Options, CorrectIndex, Explanation).
*   **Assignment:** Tugas/PR siswa.

### 3. Fitur Utama (Siswa)
*   **Dashboard:** Pilihan Kelas (7, 8, 9) dengan kartu visual yang menarik.
*   **Navigasi:**
    *   **Desktop:** Sidebar kiri (fixed).
    *   **Mobile:** Bottom Navigation Bar ala aplikasi Android (Beranda, Cari, Materi, Tutor).
*   **Topic Detail (Reader):**
    *   Tampilkan materi dalam bentuk **Tabs** (misal: Tab 1 "Pengertian", Tab 2 "Contoh").
    *   Render konten HTML (support gambar, teks rich text, video, audio).
    *   List Tugas (Assignment) spesifik per tab materi.
    *   Tombol Kuis spesifik per tab materi.
*   **Kuis Interaktif:**
    *   Gunakan **Modal Pop-up** (Light Mode, bersih).
    *   Tampilkan progress bar soal.
    *   Feedback langsung (Benar/Salah beserta penjelasan).
    *   Skor akhir ditampilkan di dalam modal.
    *   **Validasi Ketat:** Cegah pengerjaan ulang di hari yang sama (simpan state di LocalStorage: `quizAttempts`). Tampilkan skor terakhir jika sudah mengerjakan hari ini.
*   **Pencarian Cerdas:** Cari topik berdasarkan judul, deskripsi, atau isi konten.
*   **Personalisasi:** Pilihan Tema Warna (Ocean, Nature, Royal, Sunset) yang mengubah warna primer aplikasi.
*   **AI Tutor:** Chat interface untuk bertanya ke Gemini AI tentang pelajaran.

### 4. Fitur Utama (Admin Dashboard)
*   **Autentikasi:** Login sederhana (hardcoded username/password).
*   **Layout 3 Kolom (Collapsible):**
    1.  **Kiri (Navigasi):** List Modul dan Topik. Bisa Tambah/Hapus Modul & Topik. Panel ini bisa di-minimize (collapsed).
    2.  **Tengah (Workspace):** 
        *   **Tab Bar Atas:** Untuk memilih Tab Materi mana yang sedang diedit. Bisa Tambah/Hapus Tab Materi.
        *   **Sub-Navigasi:** Pilihan mode edit (Edit Materi / Kelola Kuis / Kelola Tugas).
        *   **Editor Area:** Area kerja utama sesuai mode yang dipilih.
    3.  **Kanan (Inspector):** Properti topik (Judul, Deskripsi, **Icon Picker**). Panel ini **default collapsed** saat awal buka dashboard.
*   **Editor Konten (WYSIWYG - Rich Text):**
    *   Komponen `RichTextEditor` custom menggunakan `contentEditable`.
    *   **Toolbar Lengkap:** Bold, Italic, Underline, Headings, Lists, Alignments, Undo/Redo.
    *   **Media Support:** Tombol khusus untuk insert Gambar, Video (MP4/YouTube), dan Audio (MP3) via URL prompt.
    *   Support Copy-Paste dari Word.
*   **Manajemen Kuis & Tugas:** Form dinamis untuk menambah/edit/hapus soal kuis dan tugas **per Tab Materi**.
*   **Utility:** Tombol "Reset Kuis Siswa" untuk menghapus data `quizAttempts` di LocalStorage (berguna untuk testing/reset harian manual).

### 5. Desain & UX
*   **Style:** Modern, Clean, Edukatif. Gunakan font 'Inter'.
*   **Admin Editor UI:** Buat menyerupai kertas dokumen A4 (Paper-like) di tengah layar abu-abu agar fokus.
*   **Responsif:** Pastikan layout beradaptasi sempurna antara Desktop dan Mobile.

### 6. Instruksi Khusus
*   Pastikan kode error handling untuk API Key Gemini (gunakan `process.env.API_KEY`).
*   Buat data dummy (`CURRICULUM_DATA`) yang cukup lengkap dan terstruktur (Module -> Topic -> Materials -> Quiz/Assignment).
*   Pisahkan komponen besar (`RichTextEditor`, `AdminDashboard`, `StudentView`, `TopicCard`) ke file masing-masing agar kode bersih dan maintainable.

---
Tolong generate kode lengkap dalam format XML untuk file-file yang diperlukan.