/*
  Warnings:

  - You are about to alter the column `userId` on the `MMR` table. The data in that column could be lost. The data in that column will be cast from `VarChar(15)` to `Int`.
  - You are about to alter the column `userId` on the `MyTeam` table. The data in that column could be lost. The data in that column will be cast from `VarChar(15)` to `Int`.
  - You are about to alter the column `userId` on the `UsersAthlete` table. The data in that column could be lost. The data in that column will be cast from `VarChar(15)` to `Int`.
  - A unique constraint covering the columns `[userId]` on the table `MMR` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `MMR` DROP FOREIGN KEY `MMR_userId_fkey`;

-- DropForeignKey
ALTER TABLE `MyTeam` DROP FOREIGN KEY `MyTeam_userId_fkey`;

-- DropForeignKey
ALTER TABLE `UsersAthlete` DROP FOREIGN KEY `UsersAthlete_userId_fkey`;

-- AlterTable
ALTER TABLE `MMR` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `userId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `MyTeam` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `userId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `UsersAthlete` MODIFY `userId` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `MMR_userId_key` ON `MMR`(`userId`);

-- CreateIndex
CREATE INDEX `MyTeam_userId_idx` ON `MyTeam`(`userId`);

-- AddForeignKey
ALTER TABLE `MMR` ADD CONSTRAINT `MMR_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MyTeam` ADD CONSTRAINT `MyTeam_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UsersAthlete` ADD CONSTRAINT `UsersAthlete_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
