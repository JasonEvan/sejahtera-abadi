# 💳 Sejahtera Abadi POS App

Aplikasi **Point of Sale (POS)** berbasis web untuk perusahaan **Sejahtera Abadi**, dibangun dengan **Next.js (App Router)**.  
Mendukung pengelolaan transaksi, pelanggan, dan laporan dengan desain modern, performa cepat, serta integrasi database yang fleksibel.

## 🚀 Tech Stack

Proyek ini menggunakan beberapa teknologi modern:

- **[Next.js (App Router)](https://nextjs.org/docs/app)** → framework React untuk aplikasi fullstack.
- **[Prisma](https://www.prisma.io/)** → ORM untuk database.
- **[Zustand](https://zustand-demo.pmnd.rs/)** → state management ringan & scalable.
- **[Winston](https://github.com/winstonjs/winston)** → logging aplikasi.
- **[Formik](https://formik.org/)** & **[Yup](https://github.com/jquense/yup)** → form handling & validation.
- **[MUI](https://mui.com/)** → komponen UI modern & responsif.
- **[Supabase](https://supabase.com/)** → backend as a service untuk autentikasi, penyimpanan, dsb.

## 📂 Fitur Utama

- 🔐 Autentikasi & otorisasi dengan JWT.
- 🛒 Pengelolaan transaksi penjualan.
- 👥 Manajemen data pelanggan & produk.
- 📊 Laporan penjualan dengan tampilan modern.
- 📝 Form input dengan validasi real-time (Formik + Yup).
- 🌙 UI responsif & konsisten dengan MUI.
- 🛠 Logging aktivitas server dengan Winston.

## 🛠 Instalasi & Menjalankan di Local

### 1. Clone repository

```bash
git clone https://github.com/JasonEvan/sejahtera-abadi-pos.git
cd sejahtera-abadi-pos
```

### 2. Install Dependencies

```bash
npm install
# atau
yarn install
```

### 3. Konfigurasi Environment

Buat file `.env` di root project, misalnya:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
NEXT_PUBLIC_SUPABASE_URL="https://xxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
```

> ⚠️ Sesuaikan dengan database & project Supabase Anda.

### 4. Setup database (Prisma)

```bash
npx prisma migrate dev
```

### 5. Menjalankan development server

```bash
npm run dev
```

Aplikasi akan berjalan di http://localhost:3000

### 6. Build untuk production

```bash
npm run build
npm start
```

## 🤝 Kontribusi

Kontribusi sangat diterima! Silakan buat issue atau pull request jika ingin menambahkan fitur / perbaikan bug.
