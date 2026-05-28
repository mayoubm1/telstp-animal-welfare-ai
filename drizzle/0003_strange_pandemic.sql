CREATE TABLE `bestPractices` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`titleAr` varchar(255),
	`category` enum('nutrition','behavior','health','grooming','training','enrichment','socialization','emergency_care') NOT NULL,
	`content` longtext NOT NULL,
	`contentAr` longtext,
	`keyPoints` json,
	`keyPointsAr` json,
	`species` json,
	`breedSpecific` varchar(255),
	`source` varchar(255),
	`expertReview` boolean DEFAULT false,
	`reviewedBy` varchar(255),
	`references` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `bestPractices_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `naturalAlternatives` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`nameAr` varchar(255),
	`category` enum('organic_food','natural_treats','eco_supplies','toys_enrichment','grooming','training_tools','supplements','bedding') NOT NULL,
	`description` longtext,
	`descriptionAr` longtext,
	`benefits` json,
	`benefitsAr` json,
	`ingredients` longtext,
	`ingredientsAr` longtext,
	`suitableFor` json,
	`price` decimal(10,2),
	`supplier` varchar(255),
	`supplierUrl` varchar(512),
	`imageUrl` varchar(512),
	`verified` boolean DEFAULT false,
	`certifications` json,
	`rating` decimal(3,2),
	`reviewCount` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `naturalAlternatives_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `petFileAudit` (
	`id` int AUTO_INCREMENT NOT NULL,
	`petId` int NOT NULL,
	`userId` int NOT NULL,
	`action` enum('view','edit','download','share','delete') NOT NULL,
	`details` longtext,
	`ipAddress` varchar(45),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `petFileAudit_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `petFileShares` (
	`id` int AUTO_INCREMENT NOT NULL,
	`petId` int NOT NULL,
	`ownerId` int NOT NULL,
	`sharedWithId` int,
	`sharedWithType` enum('veterinarian','clinic','trainer'),
	`shareToken` varchar(255),
	`accessLevel` enum('view_only','edit','full_access') DEFAULT 'view_only',
	`expiresAt` timestamp,
	`sharedAt` timestamp NOT NULL DEFAULT (now()),
	`lastAccessedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `petFileShares_id` PRIMARY KEY(`id`),
	CONSTRAINT `petFileShares_shareToken_unique` UNIQUE(`shareToken`)
);
--> statement-breakpoint
CREATE TABLE `trainingPrograms` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`nameAr` varchar(255),
	`category` enum('bathroom_training','obedience','socialization','play_enrichment','behavioral_modification','agility','tricks') NOT NULL,
	`description` longtext,
	`descriptionAr` longtext,
	`difficulty` enum('beginner','intermediate','advanced'),
	`ageRange` varchar(100),
	`duration` int,
	`steps` json,
	`stepsAr` json,
	`videoUrl` varchar(512),
	`tips` json,
	`tipsAr` json,
	`successIndicators` json,
	`successIndicatorsAr` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `trainingPrograms_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `trainingProgress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`petId` int NOT NULL,
	`userId` int NOT NULL,
	`programId` int NOT NULL,
	`startDate` timestamp NOT NULL DEFAULT (now()),
	`currentStep` int DEFAULT 0,
	`status` enum('not_started','in_progress','completed','paused') DEFAULT 'not_started',
	`dailyLogs` json,
	`notes` longtext,
	`completionDate` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `trainingProgress_id` PRIMARY KEY(`id`)
);
