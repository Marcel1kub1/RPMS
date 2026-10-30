-- RPMS MySQL additions for automatic Roblox server sessions and privacy requests.
ALTER TABLE `ActivitySession`
  ADD COLUMN `isStaff` BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN `serverJobId` VARCHAR(191) NULL,
  ADD COLUMN `sessionSource` VARCHAR(191) NOT NULL DEFAULT 'roblox_server';

CREATE INDEX `ActivitySession_workspaceGroupId_active_idx`
  ON `ActivitySession` (`workspaceGroupId`, `active`);
CREATE INDEX `ActivitySession_userId_active_idx`
  ON `ActivitySession` (`userId`, `active`);

CREATE TABLE `DataDeletionRequest` (
  `id` VARCHAR(36) NOT NULL,
  `userId` BIGINT NOT NULL,
  `status` VARCHAR(191) NOT NULL DEFAULT 'pending',
  `requestedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `processedAt` DATETIME(3) NULL,
  `reason` TEXT NULL,
  PRIMARY KEY (`id`),
  INDEX `DataDeletionRequest_status_requestedAt_idx` (`status`, `requestedAt`),
  INDEX `DataDeletionRequest_userId_status_idx` (`userId`, `status`),
  CONSTRAINT `DataDeletionRequest_userId_fkey`
    FOREIGN KEY (`userId`) REFERENCES `user` (`userid`) ON DELETE CASCADE ON UPDATE CASCADE
);
