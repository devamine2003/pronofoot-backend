/*
  Warnings:

  - A unique constraint covering the columns `[pseudo]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `pseudo` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user` ADD COLUMN `pseudo` VARCHAR(191) NOT NULL,
    MODIFY `uuid` VARCHAR(191) NOT NULL,
    MODIFY `firstname` VARCHAR(191) NULL,
    MODIFY `lastname` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User_pseudo_key` ON `User`(`pseudo`);
