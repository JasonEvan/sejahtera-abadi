-- CreateTable
CREATE TABLE "public"."beli" (
    "tipe" CHAR(2) NOT NULL DEFAULT 'B',
    "id" SERIAL NOT NULL,
    "id_client" INTEGER NOT NULL,
    "nomor_nota" VARCHAR(10) NOT NULL,
    "tanggal_nota" DATE NOT NULL,
    "nama_barang" VARCHAR(50) NOT NULL,
    "harga_barang" INTEGER NOT NULL,
    "qty_barang" INTEGER NOT NULL,
    "total_harga" INTEGER NOT NULL,
    "diskon_nota" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "beli_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."blunas" (
    "id" SERIAL NOT NULL,
    "nomor_transaksi" VARCHAR(10) NOT NULL,
    "tanggal_lunas" DATE NOT NULL,
    "id_client" INTEGER NOT NULL,
    "nomor_nota" VARCHAR(10) NOT NULL,
    "lunas_nota" INTEGER NOT NULL,

    CONSTRAINT "blunas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."bnota" (
    "id" SERIAL NOT NULL,
    "id_client" INTEGER NOT NULL,
    "nomor_nota" VARCHAR(10) NOT NULL,
    "tanggal_nota" DATE NOT NULL,
    "nilai_nota" INTEGER NOT NULL,
    "diskon_nota" DOUBLE PRECISION NOT NULL,
    "lunas_nota" INTEGER NOT NULL,
    "diskon_lunas" DOUBLE PRECISION NOT NULL,
    "saldo_nota" INTEGER NOT NULL,

    CONSTRAINT "bnota_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."bretur" (
    "tipe" CHAR(3) NOT NULL DEFAULT 'BR',
    "id" SERIAL NOT NULL,
    "id_client" INTEGER NOT NULL,
    "id_beli" INTEGER NOT NULL,
    "nomor_nota" VARCHAR(10) NOT NULL,
    "tanggal_nota" DATE NOT NULL,
    "nama_barang" VARCHAR(50) NOT NULL,
    "harga_barang" INTEGER NOT NULL,
    "qty_barang" INTEGER NOT NULL,
    "total_harga" INTEGER NOT NULL,
    "tanggal_retur" DATE,

    CONSTRAINT "bretur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."client" (
    "id" SERIAL NOT NULL,
    "nama_client" VARCHAR(50) NOT NULL,
    "kota_client" VARCHAR(50) NOT NULL DEFAULT '',
    "telp_client" VARCHAR(20),
    "alamat_client" VARCHAR(50),
    "sldawal_utang" INTEGER NOT NULL DEFAULT 0,
    "sldawal_piutang" INTEGER NOT NULL DEFAULT 0,
    "sldakhir_utang" INTEGER NOT NULL DEFAULT 0,
    "sldakhir_piutang" INTEGER NOT NULL DEFAULT 0,
    "hp_client" VARCHAR(20),

    CONSTRAINT "client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."jlunas" (
    "id" SERIAL NOT NULL,
    "nomor_transaksi" VARCHAR(10) NOT NULL,
    "tanggal_lunas" DATE NOT NULL,
    "id_client" INTEGER NOT NULL,
    "nomor_nota" VARCHAR(10) NOT NULL,
    "lunas_nota" INTEGER NOT NULL,

    CONSTRAINT "jlunas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."jnota" (
    "id" SERIAL NOT NULL,
    "id_client" INTEGER NOT NULL,
    "nomor_nota" VARCHAR(10) NOT NULL,
    "tanggal_nota" DATE NOT NULL,
    "nilai_nota" INTEGER NOT NULL,
    "diskon_nota" DOUBLE PRECISION NOT NULL,
    "lunas_nota" INTEGER NOT NULL,
    "diskon_lunas" DOUBLE PRECISION NOT NULL,
    "saldo_nota" INTEGER NOT NULL,

    CONSTRAINT "jnota_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."jretur" (
    "tipe" CHAR(3) NOT NULL DEFAULT 'JR',
    "id" SERIAL NOT NULL,
    "id_client" INTEGER NOT NULL,
    "id_jual" INTEGER NOT NULL,
    "nomor_nota" VARCHAR(10) NOT NULL,
    "tanggal_nota" DATE NOT NULL,
    "nama_barang" VARCHAR(50) NOT NULL,
    "harga_barang" INTEGER NOT NULL,
    "qty_barang" INTEGER NOT NULL,
    "total_harga" INTEGER NOT NULL,
    "tanggal_retur" DATE,
    "nama_sales" VARCHAR(100) NOT NULL,

    CONSTRAINT "jretur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."jual" (
    "tipe" CHAR(2) NOT NULL DEFAULT 'J',
    "id" SERIAL NOT NULL,
    "id_client" INTEGER NOT NULL,
    "nomor_nota" VARCHAR(10) NOT NULL,
    "tanggal_nota" DATE NOT NULL,
    "nama_barang" VARCHAR(50) NOT NULL,
    "harga_barang" INTEGER NOT NULL,
    "qty_barang" INTEGER NOT NULL,
    "total_harga" INTEGER NOT NULL,
    "diskon_nota" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nama_sales" VARCHAR(100) NOT NULL,

    CONSTRAINT "jual_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."salesman" (
    "id" SERIAL NOT NULL,
    "nama_sales" VARCHAR(100) NOT NULL,
    "no_depan" INTEGER,
    "no_nota" INTEGER NOT NULL,
    "no_telp_sales" VARCHAR(20),
    "kode_sales" VARCHAR(20) NOT NULL,

    CONSTRAINT "salesman_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."stock" (
    "id" SERIAL NOT NULL,
    "nama_barang" VARCHAR(50) NOT NULL,
    "stock_awal" INTEGER NOT NULL,
    "stock_akhir" INTEGER NOT NULL,
    "harga_barang" INTEGER NOT NULL DEFAULT 0,
    "qty_in" INTEGER NOT NULL DEFAULT 0,
    "qty_out" INTEGER NOT NULL DEFAULT 0,
    "jual_barang" INTEGER,
    "satuan_barang" VARCHAR(10) NOT NULL,
    "modal" INTEGER NOT NULL,
    "rusak_barang" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "stock_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "bnota_nomor_nota_key" ON "public"."bnota"("nomor_nota");

-- CreateIndex
CREATE UNIQUE INDEX "client_nama_client_kota_client_key" ON "public"."client"("nama_client", "kota_client");

-- CreateIndex
CREATE UNIQUE INDEX "jnota_nomor_nota_key" ON "public"."jnota"("nomor_nota");

-- CreateIndex
CREATE UNIQUE INDEX "salesman_nama_sales_key" ON "public"."salesman"("nama_sales");

-- CreateIndex
CREATE UNIQUE INDEX "stock_nama_barang_key" ON "public"."stock"("nama_barang");

-- AddForeignKey
ALTER TABLE "public"."beli" ADD CONSTRAINT "beli_id_client_fkey" FOREIGN KEY ("id_client") REFERENCES "public"."client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."beli" ADD CONSTRAINT "beli_nomor_nota_fkey" FOREIGN KEY ("nomor_nota") REFERENCES "public"."bnota"("nomor_nota") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."blunas" ADD CONSTRAINT "blunas_id_client_fkey" FOREIGN KEY ("id_client") REFERENCES "public"."client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."blunas" ADD CONSTRAINT "blunas_nomor_nota_fkey" FOREIGN KEY ("nomor_nota") REFERENCES "public"."bnota"("nomor_nota") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."bnota" ADD CONSTRAINT "bnota_id_client_fkey" FOREIGN KEY ("id_client") REFERENCES "public"."client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."bretur" ADD CONSTRAINT "bretur_id_client_fkey" FOREIGN KEY ("id_client") REFERENCES "public"."client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."bretur" ADD CONSTRAINT "bretur_id_beli_fkey" FOREIGN KEY ("id_beli") REFERENCES "public"."beli"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."bretur" ADD CONSTRAINT "bretur_nomor_nota_fkey" FOREIGN KEY ("nomor_nota") REFERENCES "public"."bnota"("nomor_nota") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."jlunas" ADD CONSTRAINT "jlunas_id_client_fkey" FOREIGN KEY ("id_client") REFERENCES "public"."client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."jlunas" ADD CONSTRAINT "jlunas_nomor_nota_fkey" FOREIGN KEY ("nomor_nota") REFERENCES "public"."jnota"("nomor_nota") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."jnota" ADD CONSTRAINT "jnota_id_client_fkey" FOREIGN KEY ("id_client") REFERENCES "public"."client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."jretur" ADD CONSTRAINT "jretur_id_client_fkey" FOREIGN KEY ("id_client") REFERENCES "public"."client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."jretur" ADD CONSTRAINT "jretur_id_jual_fkey" FOREIGN KEY ("id_jual") REFERENCES "public"."jual"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."jretur" ADD CONSTRAINT "jretur_nomor_nota_fkey" FOREIGN KEY ("nomor_nota") REFERENCES "public"."jnota"("nomor_nota") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."jretur" ADD CONSTRAINT "jretur_nama_sales_fkey" FOREIGN KEY ("nama_sales") REFERENCES "public"."salesman"("nama_sales") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."jual" ADD CONSTRAINT "jual_id_client_fkey" FOREIGN KEY ("id_client") REFERENCES "public"."client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."jual" ADD CONSTRAINT "jual_nomor_nota_fkey" FOREIGN KEY ("nomor_nota") REFERENCES "public"."jnota"("nomor_nota") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."jual" ADD CONSTRAINT "jual_nama_sales_fkey" FOREIGN KEY ("nama_sales") REFERENCES "public"."salesman"("nama_sales") ON DELETE RESTRICT ON UPDATE CASCADE;
