
## Clone Project

Untuk menjalankan program tahapan pertama adalah clone terlebih dahulu project employee-management

```bash
git clone https://github.com/fatmuh/employee-management.git
```

Lalu buka menggunakan text editor webstorm atau visual studio code

## Install Node Modules

Buka terminal pada text editor lalu ketikan command di bawah ini dan tunggu hingga selesai

```bash
npm install
```

## Masukan Environtment

Jika proses install node modules sudah selesai, buat file .env dan copy seluruh isi .env.example lalu ganti DATABASE_URL menjadi database management yang ingin digunakan, disini saya menggunakan MySQL.

```bash
# Environment variables declared in this file are automatically made available to Prisma.
# See the documentation for more detail: https://pris.ly/d/prisma-schema#accessing-environment-variables-from-the-schema

# Prisma supports the native connection string format for PostgreSQL, MySQL, SQLite, SQL Server, MongoDB and CockroachDB.
# See the documentation for all the connection string options: https://pris.ly/d/connection-strings

DATABASE_URL=""
```

Lalu jalankan perintah berikut untuk melakukan migrasi ke database yang telah dibuat sebelumnya

```bash
npx prisma migrate dev
```

## Running Program

Jika sudah selesai melakukan migrasi database, jalankan perintah berikut untuk menjalankan program.

```bash
nodemon
```

Setelah itu buka postman ataupun http request yang tersedia, disini saya menggunakan postman, dan coba lakukan berbagai macam service dari endpoint RESTful API yang tersedia.

```bash
http://localhost:3000/api/
```


## Dokumentasi Postman

https://documenter.getpostman.com/view/25853406/2sA3rzLDFu


## Authors

- [@fatmuh](https://www.github.com/fatmuh)
