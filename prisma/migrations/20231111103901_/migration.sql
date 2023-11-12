-- AlterTable
ALTER TABLE `course` ADD COLUMN `delete` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `delete` BOOLEAN NOT NULL DEFAULT false;
