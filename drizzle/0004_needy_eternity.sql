CREATE TABLE `avatarAchievements` (
	`id` int AUTO_INCREMENT NOT NULL,
	`avatarId` int NOT NULL,
	`userId` int NOT NULL,
	`achievementType` varchar(255) NOT NULL,
	`achievementTypeAr` varchar(255),
	`description` longtext,
	`descriptionAr` longtext,
	`badge` varchar(255),
	`unlockedAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `avatarAchievements_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `avatarConversations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`avatarId` int NOT NULL,
	`userId` int NOT NULL,
	`petId` int NOT NULL,
	`userMessage` longtext NOT NULL,
	`avatarResponse` longtext NOT NULL,
	`messageType` enum('question','command','chat','training','health_check') DEFAULT 'chat',
	`context` json,
	`sentiment` varchar(50),
	`userFeedback` enum('helpful','not_helpful','neutral'),
	`rating` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `avatarConversations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `virtualPetAvatars` (
	`id` int AUTO_INCREMENT NOT NULL,
	`petId` int NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`nameAr` varchar(255),
	`personality` varchar(255),
	`personalityAr` varchar(255),
	`avatarImageUrl` varchar(512),
	`bio` longtext,
	`bioAr` longtext,
	`traits` json,
	`traitsAr` json,
	`specialAbilities` json,
	`specialAbilitiesAr` json,
	`conversationStyle` varchar(255),
	`conversationStyleAr` varchar(255),
	`knowledgeBase` json,
	`learningProgress` json,
	`totalInteractions` int DEFAULT 0,
	`lastInteractionAt` timestamp,
	`favoriteActivities` json,
	`colorTheme` varchar(50),
	`voicePreference` varchar(50),
	`isActive` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `virtualPetAvatars_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `avatarAchievements` ADD CONSTRAINT `avatarAchievements_avatarId_virtualPetAvatars_id_fk` FOREIGN KEY (`avatarId`) REFERENCES `virtualPetAvatars`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `avatarAchievements` ADD CONSTRAINT `avatarAchievements_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `avatarConversations` ADD CONSTRAINT `avatarConversations_avatarId_virtualPetAvatars_id_fk` FOREIGN KEY (`avatarId`) REFERENCES `virtualPetAvatars`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `avatarConversations` ADD CONSTRAINT `avatarConversations_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `avatarConversations` ADD CONSTRAINT `avatarConversations_petId_pets_id_fk` FOREIGN KEY (`petId`) REFERENCES `pets`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `virtualPetAvatars` ADD CONSTRAINT `virtualPetAvatars_petId_pets_id_fk` FOREIGN KEY (`petId`) REFERENCES `pets`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `virtualPetAvatars` ADD CONSTRAINT `virtualPetAvatars_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;