
-- MySQL Workbench Forward Engineering

USE pod_db;

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

DROP TABLE IF EXISTS Shows;
DROP TABLE IF EXISTS Episodes;
DROP TABLE IF EXISTS Producers;
DROP TABLE IF EXISTS Subscribers;
DROP TABLE IF EXISTS Streams;
DROP TABLE IF EXISTS Hosts;
DROP TABLE IF EXISTS Inter_shows_hosts;
DROP TABLE IF EXISTS Inter_subscribers_shows;

-- -----------------------------------------------------
-- Table `Shows`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Shows` (
  `show_ID` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`show_ID`),
  UNIQUE INDEX `title_UNIQUE` (`title` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Hosts`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Hosts` (
  `host_ID` INT NOT NULL AUTO_INCREMENT,
  `first_name` VARCHAR(45) NOT NULL,
  `last_name` VARCHAR(45) NOT NULL,
  `email_address` VARCHAR(45) NOT NULL,
  `phone_number` VARCHAR(10) NULL,
  PRIMARY KEY (`host_ID`),
  UNIQUE INDEX `hostID_UNIQUE` (`host_ID` ASC) VISIBLE,
  UNIQUE INDEX `email_address_UNIQUE` (`email_address` ASC) VISIBLE,
  UNIQUE INDEX `phone_number_UNIQUE` (`phone_number` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Subscribers`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Subscribers` (
  `subscriber_ID` INT NOT NULL AUTO_INCREMENT,
  `first_name` VARCHAR(45) NOT NULL,
  `last_name` VARCHAR(45) NOT NULL,
  `email_address` VARCHAR(45) NOT NULL,
  `phone_number` VARCHAR(10) NULL,
  `age` INT NULL,
  `gender` VARCHAR(15) NULL,
  PRIMARY KEY (`subscriber_ID`),
  UNIQUE INDEX `subscriberID_UNIQUE` (`subscriber_ID` ASC) VISIBLE,
  UNIQUE INDEX `email_address_UNIQUE` (`email_address` ASC) VISIBLE,
  UNIQUE INDEX `phone_number_UNIQUE` (`phone_number` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Episodes`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Episodes` (
  `episode_ID` INT NOT NULL AUTO_INCREMENT,
  `show_ID` INT NOT NULL,
  `title` VARCHAR(100) NOT NULL,
  `episode_summary` VARCHAR(250) NULL,
  `date_released` DATE NOT NULL,
  `hosts_names` VARCHAR(250) NOT NULL,
  PRIMARY KEY (`episode_ID`, `show_ID`),
  INDEX `fk_episodes_shows1_idx` (`show_ID` ASC) VISIBLE,
  UNIQUE INDEX `unique_title_show_ID` (`title` ASC, `show_ID` ASC) VISIBLE,
  CONSTRAINT `fk_episodes_shows1`
    FOREIGN KEY (`show_ID`)
    REFERENCES `Shows` (`show_ID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Streams`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Streams` (
  `stream_ID` INT NOT NULL AUTO_INCREMENT,
  `subscriber_ID` INT NULL,
  `episode_ID` INT NOT NULL,
  `time_streamed` DATETIME NOT NULL,
  INDEX `fk_streams_subscribers1_idx` (`subscriber_ID` ASC) VISIBLE,
  INDEX `fk_streams_episodes1_idx` (`episode_ID` ASC) VISIBLE,
  PRIMARY KEY (`stream_ID`),
  CONSTRAINT `fk_streams_subscribers1`
    FOREIGN KEY (`subscriber_ID`)
    REFERENCES `Subscribers` (`subscriber_ID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_streams_episodes1`
    FOREIGN KEY (`episode_ID`)
    REFERENCES `Episodes` (`episode_ID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Producers`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Producers` (
  `producer_ID` INT NOT NULL AUTO_INCREMENT,
  `show_ID` INT NULL,
  `first_name` VARCHAR(45) NOT NULL,
  `last_name` VARCHAR(45) NOT NULL,
  `email_address` VARCHAR(45) NOT NULL,
  `phone_number` VARCHAR(10) NOT NULL,
  PRIMARY KEY (`producer_ID`),
  INDEX `fk_producers_shows_idx` (`show_ID` ASC) VISIBLE,
  UNIQUE INDEX `producerID_UNIQUE` (`producer_ID` ASC) VISIBLE,
  UNIQUE INDEX `email_address_UNIQUE` (`email_address` ASC) VISIBLE,
  UNIQUE INDEX `phone_number_UNIQUE` (`phone_number` ASC) VISIBLE,
  CONSTRAINT `fk_producers_shows`
    FOREIGN KEY (`show_ID`)
    REFERENCES `Shows` (`show_ID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Inter_shows_hosts`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Inter_shows_hosts` (
  `show_ID` INT NOT NULL,
  `host_ID` INT NOT NULL,
  `inter_shows_hosts_id` INT NOT NULL AUTO_INCREMENT,
  INDEX `fk_shows_has_hosts_hosts1_idx` (`host_ID` ASC) VISIBLE,
  INDEX `fk_shows_has_hosts_shows1_idx` (`show_ID` ASC) VISIBLE,
  PRIMARY KEY (`inter_shows_hosts_id`),
  CONSTRAINT `fk_shows_has_hosts_shows1`
    FOREIGN KEY (`show_ID`)
    REFERENCES `Shows` (`show_ID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_shows_has_hosts_hosts1`
    FOREIGN KEY (`host_ID`)
    REFERENCES `Hosts` (`host_ID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Inter_subscribers_shows`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Inter_subscribers_shows` (
  `subscriber_ID` INT NOT NULL,
  `show_ID` INT NOT NULL,
  `inter_subscribers_shows_id` INT NOT NULL AUTO_INCREMENT,
  INDEX `fk_subscribers_has_shows_shows1_idx` (`show_ID` ASC) VISIBLE,
  INDEX `fk_subscribers_has_shows_subscribers1_idx` (`subscriber_ID` ASC) VISIBLE,
  PRIMARY KEY (`inter_subscribers_shows_id`),
  CONSTRAINT `fk_subscribers_has_shows_subscribers1`
    FOREIGN KEY (`subscriber_ID`)
    REFERENCES `Subscribers` (`subscriber_ID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_subscribers_has_shows_shows1`
    FOREIGN KEY (`show_ID`)
    REFERENCES `Shows` (`show_ID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;


-- -----------------------------------------------------
-- Table `Inter_subscribers_shows`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Inter_subscribers_shows` (
  `subscriber_ID` INT NOT NULL,
  `show_ID` INT NOT NULL,
  `inter_subscribers_shows_id` INT NOT NULL AUTO_INCREMENT,
  INDEX `fk_subscribers_has_shows_shows1_idx` (`show_ID` ASC) VISIBLE,
  INDEX `fk_subscribers_has_shows_subscribers1_idx` (`subscriber_ID` ASC) VISIBLE,
  PRIMARY KEY (`inter_subscribers_shows_id`),
  CONSTRAINT `fk_subscribers_has_shows_subscribers1`
    FOREIGN KEY (`subscriber_ID`)
    REFERENCES `Subscribers` (`subscriber_ID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_subscribers_has_shows_shows1`
    FOREIGN KEY (`show_ID`)
    REFERENCES `Shows` (`show_ID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;


INSERT INTO Shows(
    title
) VALUES
(
    'The Daily Drive'
),
(
    'The Unconventional Life'
),
(
    'All Things Animals!'
);


INSERT INTO Producers(
    show_ID,
    first_name,
    last_name,
    email_address,
    phone_number
) VALUES
(
    2,
    'Bill',
    'Fredrickson',
    'BillFredrickson@tcg.com',
    '4023697332'
),
(
    2,
    'Aiden',
    'Smith',
    'AidenSmith@tcg.com',
    '5162235847'
),
(
    3,
    'Mia',
    'James',
    'MiaJames@tcg.com',
    '6467893712'
),
(
    1,
    'Noah',
    'Green',
    'NoahGreen@tcg.com',
    '7534568129'
),
(
    1,
    'Emily',
    'Brown',
    'EmilyBrown@tcg.com',
    '8012345678'
);

INSERT INTO Hosts(
    first_name,
    last_name,
    email_address,
    phone_number
) VALUES(
    'Jonathan',
    'Smith',
    'JonathanSmith@tcg.com',
    '8543896221'
),
(
    'Emily',
    'Johnson',
    'EmilyJohnson@tcg.com',
    '7293855487'
),
(
    'Michael',
    'Williams',
    'MichaelWilliams@tcg.com',
    '7493853522'
),
(
    'Sarah',
    'Jones',
    'SarahJones@tcg.com',
    '1729385548'
),
(
    'Chistopher',
    'Brown',
    'ChistopherBrown@tcg.com',
    '7493853521'
),
(
    'Elizabeth',
    'Miller',
    'ElizabethMiller@tcg.com',
    '5035971426'
);


INSERT INTO Inter_shows_hosts(
    show_ID,
    host_ID
) VALUES
(
    1,
    1
),
(
    1,
    3
),
(
    2,
    4
),
(
    2,
    5
),
(
    3,
    6
),
(
    3,
    3
);

INSERT INTO Subscribers(
    first_name,
    last_name,
    email_address,
    phone_number,
    age,
    gender
) VALUES
(
    'Aiden',
    'James',
    'AidenJames@email.com',
    NULL,
    23,
    'Male'
),
(
    'Bella',
    'Rose',
    'BellaRose@email.com',
    NULL,
    55,
    'Female'
),
(
    'Cameron',
    'Smith',
    'CameronSmith@email.com',
    '7775556666',
    16,
    'Male'
),
(
    'Evanescence',
    'Jones',
    'EvanescenceJones@email.com',
    '8124569111',
    21,
    'Female'
),
(
    'Harper',
    'Lee',
    'HarperLee@email.com',
    '4564321789',
    NULL,
    'Female'
),
(
    'India',
    'Summer',
    'IndiaSummer@email.com',
    NULL,
    25,
    'Female'
),
(
    'Jaxxon',
    'Cole',
    'JaxxonCole@email.com',
    '3334445555',
    62,
    'Male'
),
(
    'Knoxville',
    'Crawford',
    'KnoxvilleCrawford@email.com',
    '9873213456',
    NULL,
    'Male'
),
(
    'London',
    'James',
    'LondonJames@email.com',
    NULL,
    34,
    'Female'
),
(
    'Phoenix',
    'Wright',
    'PhoenixWright@email.com',
    NULL,
    NULL,
    'Male'
);

INSERT INTO Inter_subscribers_shows(
    subscriber_ID,
    show_ID
) VALUES(
    1,
    1
),
(
    1,
    2
),
(
    5,
    2
),
(
    9,
    1
),
(
    6,
    3
);



INSERT INTO Episodes(
    show_ID,
    title,
    episode_summary,
    date_released,
    hosts_names
) VALUES
(
    1,
    'Your Evening Commute October 1, 2022',
    'Want to learn something new about Python? Your evening commute will show you Python''s great potential and where it''s used in broad industries.',
    '2022-10-01',
    (SELECT GROUP_CONCAT(all_hosts.hosts_names ,  '') 
        FROM (SELECT DISTINCT CONCAT(first_name, ' ', last_name) 
        AS hosts_names  
        FROM Hosts
        INNER JOIN Inter_shows_hosts ON Hosts.host_ID = Inter_shows_hosts.host_ID
        WHERE Inter_shows_hosts.show_ID = 1) 
        all_hosts
    )
),
(
    1,
    'Your Evening Commute October 2, 2022',
    'This episode offers core tech concepts, stories from female developers with successful career journeys, and talks about personal development and growth within the tech field.',
    '2022-10-02',
    (SELECT GROUP_CONCAT(all_hosts.hosts_names ,  '') 
        FROM (SELECT DISTINCT CONCAT(first_name, ' ', last_name) 
        AS hosts_names  
        FROM Hosts
        INNER JOIN Inter_shows_hosts ON Hosts.host_ID = Inter_shows_hosts.host_ID
        WHERE Inter_shows_hosts.show_ID = 1) 
        all_hosts
    )
),
(
    1,
    'Your Evening Commute October 3, 2022',
    'If you’re looking to learn something new, but you only have your lunch break to do so, our next episode is for you! This episode aims to help developers excel at their careers and positively impact the tech world.',
    '2022-10-03',
    (SELECT GROUP_CONCAT(all_hosts.hosts_names ,  '') 
        FROM (SELECT DISTINCT CONCAT(first_name, ' ', last_name) 
        AS hosts_names  
        FROM Hosts
        INNER JOIN Inter_shows_hosts ON Hosts.host_ID = Inter_shows_hosts.host_ID
        WHERE Inter_shows_hosts.show_ID = 1) 
        all_hosts
    )
),
(
    2,
    'The Unconventional Life of a Professional Nomad',
    'This episode is for you full time working professionals. It focuses on teaching people how to transition to tech and provides actionable advice helping them get paid for their skills.',
    '2022-10-01',
    (SELECT GROUP_CONCAT(all_hosts.hosts_names ,  '') 
        FROM (SELECT DISTINCT CONCAT(first_name, ' ', last_name) 
        AS hosts_names  
        FROM Hosts
        INNER JOIN Inter_shows_hosts ON Hosts.host_ID = Inter_shows_hosts.host_ID
        WHERE Inter_shows_hosts.show_ID = 2) 
        all_hosts
    )
),
(
    2,
    'The Unconventional Life of an Online Entrepreneur',
    'You can take various paths to get into tech; But, probably the most common path is teaching oneself to code online. Here is the story of two self-taught developers and their journey.',
    '2022-10-04',
    (SELECT GROUP_CONCAT(all_hosts.hosts_names ,  '') 
        FROM (SELECT DISTINCT CONCAT(first_name, ' ', last_name) 
        AS hosts_names  
        FROM Hosts
        INNER JOIN Inter_shows_hosts ON Hosts.host_ID = Inter_shows_hosts.host_ID
        WHERE Inter_shows_hosts.show_ID = 2) 
        all_hosts
    )
),
(
    2,
    'The Unconventional Life of a Digital Nomad',
    'This episode features many interviews and in-depth discussions about various aspects of programming and web development.',
    '2022-10-07',
    (SELECT GROUP_CONCAT(all_hosts.hosts_names ,  '') 
        FROM (SELECT DISTINCT CONCAT(first_name, ' ', last_name) 
        AS hosts_names  
        FROM Hosts
        INNER JOIN Inter_shows_hosts ON Hosts.host_ID = Inter_shows_hosts.host_ID
        WHERE Inter_shows_hosts.show_ID = 2) 
        all_hosts
    )
),
(
    3,
    'From A to Z',
    'Interviewing a co-founder of a small tech company, this episode describes the origins of the framework, when to use it, and what it’s like when a company such as Microsoft acquires your startup.',
    '2022-10-02',
    (SELECT GROUP_CONCAT(all_hosts.hosts_names ,  '') 
        FROM (SELECT DISTINCT CONCAT(first_name, ' ', last_name) 
        AS hosts_names  
        FROM Hosts
        INNER JOIN Inter_shows_hosts ON Hosts.host_ID = Inter_shows_hosts.host_ID
        WHERE Inter_shows_hosts.show_ID = 3) 
        all_hosts
    )
),
(
    3,
    'In The Wild',
    'This episode is a wonderful place for developers who are newer to the wild world of coding. ',
    '2022-10-06',
    (SELECT GROUP_CONCAT(all_hosts.hosts_names ,  '') 
        FROM (SELECT DISTINCT CONCAT(first_name, ' ', last_name) 
        AS hosts_names  
        FROM Hosts
        INNER JOIN Inter_shows_hosts ON Hosts.host_ID = Inter_shows_hosts.host_ID
        WHERE Inter_shows_hosts.show_ID = 3) 
        all_hosts
    )
),
(
    3,
    'In The City',
    'This episode will show software engineers a friendly introduction to different database types and major players in each field. ',
    '2022-10-09',
    (SELECT GROUP_CONCAT(all_hosts.hosts_names ,  '') 
        FROM (SELECT DISTINCT CONCAT(first_name, ' ', last_name) 
        AS hosts_names  
        FROM Hosts
        INNER JOIN Inter_shows_hosts ON Hosts.host_ID = Inter_shows_hosts.host_ID
        WHERE Inter_shows_hosts.show_ID = 3) 
        all_hosts
    )
);


INSERT INTO Streams(
    subscriber_ID,
    episode_ID,
    time_streamed
) VALUES
(
    1,
    1,
    '2022-10-01 17:03:00'
),
(
    6,
    7,
    '2022-10-02 21:10:00'
),
(
    1,
    2,
    '2022-10-02 21:30:00'
),
(
    2,
    3,
    '2022-10-02 22:01:00'
),
(
    5,
    7,
    '2022-10-02 21:08:00'
);

SELECT * FROM Shows;
SELECT * FROM Episodes;
SELECT * FROM Producers;
SELECT * FROM Subscribers;
SELECT * FROM Streams;
SELECT * FROM Hosts; 
SELECT * FROM Inter_shows_hosts;
SELECT * FROM Inter_subscribers_shows;