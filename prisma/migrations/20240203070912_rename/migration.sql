-- CreateTable
CREATE TABLE `Literature` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `author` VARCHAR(191) NULL,
    `organization` VARCHAR(191) NULL,
    `publishingHouse` VARCHAR(191) NULL,
    `description` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GlyphPageAssociation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `classId` VARCHAR(191) NOT NULL,
    `literatureId` INTEGER NOT NULL,
    `page` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `GlyphPageAssociation` ADD CONSTRAINT `GlyphPageAssociation_literatureId_fkey` FOREIGN KEY (`literatureId`) REFERENCES `Literature`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
