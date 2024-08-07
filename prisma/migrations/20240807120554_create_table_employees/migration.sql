-- CreateTable
CREATE TABLE `employees` (
    `nama` VARCHAR(100) NOT NULL,
    `nomor` VARCHAR(20) NOT NULL,
    `jabatan` VARCHAR(100) NOT NULL,
    `departmen` VARCHAR(30) NOT NULL,
    `tanggal_masuk` DATE NOT NULL,
    `foto` TEXT NOT NULL,
    `status` VARCHAR(10) NULL,

    PRIMARY KEY (`nomor`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE InnoDB;
