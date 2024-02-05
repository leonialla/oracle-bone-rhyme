/*
  Warnings:

  - Made the column `totalPages` on table `Literature` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Literature` MODIFY `totalPages` INTEGER NOT NULL;
