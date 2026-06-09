-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `uuid` VARCHAR(36) NOT NULL,
    `firstname` VARCHAR(191) NOT NULL,
    `lastname` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `User_uuid_key`(`uuid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Match` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `apiMatchId` VARCHAR(191) NOT NULL,
    `homeTeam` VARCHAR(191) NOT NULL,
    `awayTeam` VARCHAR(191) NOT NULL,
    `homeFlag` VARCHAR(191) NULL,
    `awayFlag` VARCHAR(191) NULL,
    `kickoff` DATETIME(3) NOT NULL,
    `status` ENUM('SCHEDULED', 'LIVE', 'FINISHED', 'POSTPONED', 'CANCELLED') NOT NULL DEFAULT 'SCHEDULED',
    `homeScore` INTEGER NULL,
    `awayScore` INTEGER NULL,
    `stage` VARCHAR(191) NULL,
    `venue` VARCHAR(191) NULL,
    `homeOdds` DOUBLE NULL,
    `drawOdds` DOUBLE NULL,
    `awayOdds` DOUBLE NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Match_apiMatchId_key`(`apiMatchId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Prediction` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `matchId` INTEGER NOT NULL,
    `predictedHomeScore` INTEGER NOT NULL,
    `predictedAwayScore` INTEGER NOT NULL,
    `pointsEarned` INTEGER NOT NULL DEFAULT 0,
    `bonusPoints` INTEGER NOT NULL DEFAULT 0,
    `isCalculated` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Prediction_userId_matchId_key`(`userId`, `matchId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Prediction` ADD CONSTRAINT `Prediction_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Prediction` ADD CONSTRAINT `Prediction_matchId_fkey` FOREIGN KEY (`matchId`) REFERENCES `Match`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
