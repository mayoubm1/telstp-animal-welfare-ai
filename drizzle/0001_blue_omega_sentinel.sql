CREATE TABLE `caseHistory` (
	`id` int AUTO_INCREMENT NOT NULL,
	`petId` int NOT NULL,
	`userId` int NOT NULL,
	`symptoms` longtext NOT NULL,
	`symptomOnsetDate` timestamp,
	`severity` enum('mild','moderate','severe','critical') NOT NULL,
	`triageLevel` enum('home_care','urgent_vet','emergency'),
	`aiDiagnosis` longtext,
	`veterinarianDiagnosis` longtext,
	`treatment` longtext,
	`outcome` enum('resolved','ongoing','referred','hospitalized','unknown'),
	`veterinarianId` int,
	`consultationRequested` boolean DEFAULT false,
	`imageUrls` json,
	`voiceTranscription` longtext,
	`notes` longtext,
	`followUpDate` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `caseHistory_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `consultations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`caseHistoryId` int NOT NULL,
	`petOwnerId` int NOT NULL,
	`veterinarianId` int,
	`status` enum('pending','accepted','in_progress','completed','declined') DEFAULT 'pending',
	`requestedAt` timestamp NOT NULL DEFAULT (now()),
	`acceptedAt` timestamp,
	`completedAt` timestamp,
	`veterinarianNotes` longtext,
	`recommendation` longtext,
	`followUpRequired` boolean DEFAULT false,
	`followUpDate` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `consultations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `diagnosticImages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`diseaseId` int,
	`condition` varchar(255) NOT NULL,
	`conditionAr` varchar(255),
	`imageUrl` varchar(512) NOT NULL,
	`description` text,
	`descriptionAr` text,
	`species` enum('cat','dog','both') NOT NULL,
	`imageType` enum('clinical','histopathology','radiograph','ultrasound','endoscopy'),
	`source` varchar(255),
	`verified` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `diagnosticImages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `diseases` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`nameAr` varchar(255),
	`category` enum('respiratory','gastrointestinal','infectious','dermatological','neurological','cardiovascular','renal','hepatic','behavioral','parasitic','neoplastic','other') NOT NULL,
	`affectedSpecies` enum('cat','dog','both') NOT NULL,
	`description` longtext,
	`descriptionAr` longtext,
	`symptoms` longtext,
	`symptomsAr` longtext,
	`diagnosticTests` longtext,
	`treatmentProtocol` longtext,
	`medications` longtext,
	`prognosis` longtext,
	`zoonotic` boolean DEFAULT false,
	`zoonoticRisk` text,
	`preventionMeasures` longtext,
	`referenceImages` json,
	`referenceVideos` json,
	`sources` longtext,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `diseases_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `educationalContent` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`titleAr` varchar(255),
	`category` enum('preventive_care','vaccination','nutrition','behavior','emergency_care','zoonotic_diseases','breed_specific','life_stage') NOT NULL,
	`content` longtext,
	`contentAr` longtext,
	`imageUrl` varchar(512),
	`videoUrl` varchar(512),
	`author` varchar(255),
	`sources` longtext,
	`targetAudience` enum('pet_owner','veterinarian','both') DEFAULT 'pet_owner',
	`relatedDiseaseIds` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `educationalContent_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`type` enum('critical_case','consultation_request','feedback','system') NOT NULL,
	`title` varchar(255) NOT NULL,
	`content` longtext,
	`relatedCaseId` int,
	`relatedConsultationId` int,
	`read` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`readAt` timestamp,
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `pets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`species` enum('cat','dog') NOT NULL,
	`breed` varchar(255),
	`age` int,
	`weight` decimal(5,2),
	`color` varchar(255),
	`microchipId` varchar(255),
	`vaccinationStatus` enum('up_to_date','overdue','unknown') DEFAULT 'unknown',
	`lastVaccinationDate` timestamp,
	`medicalHistory` longtext,
	`allergies` longtext,
	`currentMedications` longtext,
	`profileImageUrl` varchar(512),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `pets_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `vetClinics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`nameAr` varchar(255),
	`address` varchar(512) NOT NULL,
	`addressAr` varchar(512),
	`city` varchar(255) NOT NULL,
	`country` varchar(255) NOT NULL,
	`latitude` decimal(10,8) NOT NULL,
	`longitude` decimal(11,8) NOT NULL,
	`phone` varchar(20) NOT NULL,
	`email` varchar(320),
	`website` varchar(512),
	`clinicType` enum('general','emergency','specialty','hospital') DEFAULT 'general',
	`specialties` json,
	`operatingHours` json,
	`emergencyServices` boolean DEFAULT false,
	`surgeryCapable` boolean DEFAULT false,
	`imagingServices` boolean DEFAULT false,
	`labServices` boolean DEFAULT false,
	`rating` decimal(3,2),
	`totalReviews` int DEFAULT 0,
	`description` longtext,
	`descriptionAr` longtext,
	`verified` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `vetClinics_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `veterinarians` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`licenseNumber` varchar(255) NOT NULL,
	`specializations` json,
	`clinicName` varchar(255),
	`clinicAddress` varchar(512),
	`clinicPhone` varchar(20),
	`clinicEmail` varchar(320),
	`latitude` decimal(10,8),
	`longitude` decimal(11,8),
	`availability` json,
	`consultationFee` decimal(8,2),
	`bio` longtext,
	`bioAr` longtext,
	`profileImageUrl` varchar(512),
	`verified` boolean DEFAULT false,
	`rating` decimal(3,2),
	`totalConsultations` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `veterinarians_id` PRIMARY KEY(`id`),
	CONSTRAINT `veterinarians_userId_unique` UNIQUE(`userId`),
	CONSTRAINT `veterinarians_licenseNumber_unique` UNIQUE(`licenseNumber`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('user','admin','veterinarian') NOT NULL DEFAULT 'user';--> statement-breakpoint
ALTER TABLE `users` ADD `userType` enum('pet_owner','veterinarian','clinic') DEFAULT 'pet_owner' NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `phone` varchar(20);--> statement-breakpoint
ALTER TABLE `users` ADD `location` varchar(255);--> statement-breakpoint
ALTER TABLE `users` ADD `language` enum('en','ar') DEFAULT 'en' NOT NULL;