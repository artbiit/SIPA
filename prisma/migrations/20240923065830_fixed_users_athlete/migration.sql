-- CreateTable
CREATE TABLE `Athlete` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `athleteName` VARCHAR(10) NOT NULL,
    `speed` INTEGER NOT NULL,
    `scoringAbility` INTEGER NOT NULL,
    `power` INTEGER NOT NULL,
    `defence` INTEGER NOT NULL,
    `stamina` INTEGER NOT NULL,
    `athleteType` ENUM('ATTACKER', 'DEFENDER', 'MIDDLE') NOT NULL,
    `spawnRate` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MMR` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `score` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `MMR_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MyTeam` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `attacker` INTEGER NOT NULL,
    `defender` INTEGER NOT NULL,
    `middle` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `MyTeam_userId_key`(`userId`),
    UNIQUE INDEX `MyTeam_attacker_key`(`attacker`),
    UNIQUE INDEX `MyTeam_defender_key`(`defender`),
    UNIQUE INDEX `MyTeam_middle_key`(`middle`),
    INDEX `MyTeam_attacker_fkey_idx`(`attacker`),
    INDEX `MyTeam_defender_fkey_idx`(`defender`),
    INDEX `MyTeam_middle_fkey_idx`(`middle`),
    INDEX `MyTeam_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` VARCHAR(15) NOT NULL,
    `password` VARCHAR(15) NOT NULL,
    `userName` VARCHAR(16) NOT NULL,
    `cash` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Users_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UsersAthlete` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `athleteId` INTEGER NOT NULL,
    `enhance` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `UsersAthlete_athleteId_fkey`(`athleteId`),
    INDEX `UsersAthlete_userId_fkey`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `MMR` ADD CONSTRAINT `MMR_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MyTeam` ADD CONSTRAINT `MyTeam_attacker_fkey` FOREIGN KEY (`attacker`) REFERENCES `UsersAthlete`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MyTeam` ADD CONSTRAINT `MyTeam_defender_fkey` FOREIGN KEY (`defender`) REFERENCES `UsersAthlete`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MyTeam` ADD CONSTRAINT `MyTeam_middle_fkey` FOREIGN KEY (`middle`) REFERENCES `UsersAthlete`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MyTeam` ADD CONSTRAINT `MyTeam_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UsersAthlete` ADD CONSTRAINT `UsersAthlete_athleteId_fkey` FOREIGN KEY (`athleteId`) REFERENCES `Athlete`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UsersAthlete` ADD CONSTRAINT `UsersAthlete_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
