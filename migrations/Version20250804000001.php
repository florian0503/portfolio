<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20250804000001 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Create contact_messages table';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('CREATE TABLE contact_messages (
            id INT AUTO_INCREMENT NOT NULL, 
            name VARCHAR(255) NOT NULL, 
            email VARCHAR(255) NOT NULL, 
            subject VARCHAR(255) DEFAULT NULL, 
            message LONGTEXT NOT NULL, 
            created_at DATETIME NOT NULL, 
            is_read TINYINT(1) NOT NULL DEFAULT 0, 
            PRIMARY KEY(id)
        ) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('DROP TABLE contact_messages');
    }
}