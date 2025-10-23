/*
  Warnings:

  - Added the required column `direccion` to the `Purchase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total` to the `Purchase` table without a default value. This is not possible if the table is not empty.
  - Made the column `cliente` on table `Purchase` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `numeroPedido` to the `Purchase` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Purchase" ADD COLUMN     "direccion" TEXT NOT NULL,
ADD COLUMN     "total" DOUBLE PRECISION NOT NULL,
ALTER COLUMN "cliente" SET NOT NULL,
DROP COLUMN "numeroPedido",
ADD COLUMN     "numeroPedido" INTEGER NOT NULL;
