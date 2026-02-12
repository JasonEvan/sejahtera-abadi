/*
  Warnings:

  - You are about to drop the column `rusak_barang` on the `stock` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."beli" DROP CONSTRAINT "beli_id_client_fkey";

-- DropForeignKey
ALTER TABLE "public"."beli" DROP CONSTRAINT "beli_nomor_nota_fkey";

-- DropForeignKey
ALTER TABLE "public"."blunas" DROP CONSTRAINT "blunas_id_client_fkey";

-- DropForeignKey
ALTER TABLE "public"."blunas" DROP CONSTRAINT "blunas_nomor_nota_fkey";

-- DropForeignKey
ALTER TABLE "public"."bnota" DROP CONSTRAINT "bnota_id_client_fkey";

-- DropForeignKey
ALTER TABLE "public"."bretur" DROP CONSTRAINT "bretur_id_beli_fkey";

-- DropForeignKey
ALTER TABLE "public"."bretur" DROP CONSTRAINT "bretur_id_client_fkey";

-- DropForeignKey
ALTER TABLE "public"."bretur" DROP CONSTRAINT "bretur_nomor_nota_fkey";

-- DropForeignKey
ALTER TABLE "public"."jlunas" DROP CONSTRAINT "jlunas_id_client_fkey";

-- DropForeignKey
ALTER TABLE "public"."jlunas" DROP CONSTRAINT "jlunas_nomor_nota_fkey";

-- DropForeignKey
ALTER TABLE "public"."jnota" DROP CONSTRAINT "jnota_id_client_fkey";

-- DropForeignKey
ALTER TABLE "public"."jretur" DROP CONSTRAINT "jretur_id_client_fkey";

-- DropForeignKey
ALTER TABLE "public"."jretur" DROP CONSTRAINT "jretur_id_jual_fkey";

-- DropForeignKey
ALTER TABLE "public"."jretur" DROP CONSTRAINT "jretur_nama_sales_fkey";

-- DropForeignKey
ALTER TABLE "public"."jretur" DROP CONSTRAINT "jretur_nomor_nota_fkey";

-- DropForeignKey
ALTER TABLE "public"."jual" DROP CONSTRAINT "jual_id_client_fkey";

-- DropForeignKey
ALTER TABLE "public"."jual" DROP CONSTRAINT "jual_nama_sales_fkey";

-- DropForeignKey
ALTER TABLE "public"."jual" DROP CONSTRAINT "jual_nomor_nota_fkey";

-- AlterTable
ALTER TABLE "public"."beli" ALTER COLUMN "tipe" SET DATA TYPE VARCHAR(2);

-- AlterTable
ALTER TABLE "public"."bretur" ALTER COLUMN "tipe" SET DATA TYPE VARCHAR(3);

-- AlterTable
ALTER TABLE "public"."jretur" ALTER COLUMN "tipe" SET DATA TYPE VARCHAR(3);

-- AlterTable
ALTER TABLE "public"."jual" ALTER COLUMN "tipe" SET DATA TYPE VARCHAR(2);

-- AlterTable
ALTER TABLE "public"."stock" DROP COLUMN "rusak_barang";

-- CreateTable
CREATE TABLE "public"."users" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" TEXT NOT NULL,
    "roles" VARCHAR(100) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- AddForeignKey
ALTER TABLE "public"."beli" ADD CONSTRAINT "beli_id_client_fkey" FOREIGN KEY ("id_client") REFERENCES "public"."client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."beli" ADD CONSTRAINT "beli_nomor_nota_fkey" FOREIGN KEY ("nomor_nota") REFERENCES "public"."bnota"("nomor_nota") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."blunas" ADD CONSTRAINT "blunas_id_client_fkey" FOREIGN KEY ("id_client") REFERENCES "public"."client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."blunas" ADD CONSTRAINT "blunas_nomor_nota_fkey" FOREIGN KEY ("nomor_nota") REFERENCES "public"."bnota"("nomor_nota") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."bnota" ADD CONSTRAINT "bnota_id_client_fkey" FOREIGN KEY ("id_client") REFERENCES "public"."client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."bretur" ADD CONSTRAINT "bretur_id_client_fkey" FOREIGN KEY ("id_client") REFERENCES "public"."client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."bretur" ADD CONSTRAINT "bretur_id_beli_fkey" FOREIGN KEY ("id_beli") REFERENCES "public"."beli"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."bretur" ADD CONSTRAINT "bretur_nomor_nota_fkey" FOREIGN KEY ("nomor_nota") REFERENCES "public"."bnota"("nomor_nota") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."jlunas" ADD CONSTRAINT "jlunas_id_client_fkey" FOREIGN KEY ("id_client") REFERENCES "public"."client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."jlunas" ADD CONSTRAINT "jlunas_nomor_nota_fkey" FOREIGN KEY ("nomor_nota") REFERENCES "public"."jnota"("nomor_nota") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."jnota" ADD CONSTRAINT "jnota_id_client_fkey" FOREIGN KEY ("id_client") REFERENCES "public"."client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."jretur" ADD CONSTRAINT "jretur_id_client_fkey" FOREIGN KEY ("id_client") REFERENCES "public"."client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."jretur" ADD CONSTRAINT "jretur_id_jual_fkey" FOREIGN KEY ("id_jual") REFERENCES "public"."jual"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."jretur" ADD CONSTRAINT "jretur_nomor_nota_fkey" FOREIGN KEY ("nomor_nota") REFERENCES "public"."jnota"("nomor_nota") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."jretur" ADD CONSTRAINT "jretur_nama_sales_fkey" FOREIGN KEY ("nama_sales") REFERENCES "public"."salesman"("nama_sales") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."jual" ADD CONSTRAINT "jual_id_client_fkey" FOREIGN KEY ("id_client") REFERENCES "public"."client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."jual" ADD CONSTRAINT "jual_nomor_nota_fkey" FOREIGN KEY ("nomor_nota") REFERENCES "public"."jnota"("nomor_nota") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."jual" ADD CONSTRAINT "jual_nama_sales_fkey" FOREIGN KEY ("nama_sales") REFERENCES "public"."salesman"("nama_sales") ON DELETE CASCADE ON UPDATE CASCADE;
