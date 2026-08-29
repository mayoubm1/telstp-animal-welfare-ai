CREATE TABLE `consultationRequests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ownerId` int NOT NULL,
	`clinicId` varchar(64) NOT NULL,
	`clinicName` varchar(255) NOT NULL,
	`clinicPhone` varchar(32) NOT NULL,
	`petName` varchar(255) NOT NULL,
	`requestedAt` timestamp NOT NULL,
	`reason` longtext NOT NULL,
	`contactPhone` varchar(32) NOT NULL,
	`status` enum('saved','clinic_contacted','closed') NOT NULL DEFAULT 'saved',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `consultationRequests_id` PRIMARY KEY(`id`)
);
