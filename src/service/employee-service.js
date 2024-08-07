import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import {
    createEmployeeValidation,
    getEmployeeValidation,
    updateEmployeeValidation
} from "../validation/employee-validation.js";
import { validate } from "../validation/validation.js";
import fs from "fs";
import path from "path";

const create = async (request) => {
    const employee = validate(createEmployeeValidation, request);

    const countEmployee = await prismaClient.employee.count({
        where: {
            nomor: employee.nomor,
        }
    });

    if (countEmployee === 1) {
        throw new ResponseError(400, { nomor: "Nomor karyawan sudah ada" });
    }

    return prismaClient.employee.create({
        data: employee,
        select: {
            nama: true,
            nomor: true,
            jabatan: true,
            departmen: true,
            tanggal_masuk: true,
            foto: true,
            status: true
        }
    });
}

const getAll = async () => {
    try {
        const employees = await prismaClient.employee.findMany({
            select: {
                nama: true,
                nomor: true,
                jabatan: true,
                departmen: true,
                tanggal_masuk: true,
                foto: true,
                status: true
            }
        });
        return employees;
    } catch (error) {
        console.error('Error fetching employees:', error);
        throw error;
    }
}

const get = async (nomor) => {
    nomor = validate(getEmployeeValidation, nomor);

    const employee = await prismaClient.employee.findFirst({
        where: {
            nomor: nomor
        },
        select: {
            nama: true,
            nomor: true,
            jabatan: true,
            departmen: true,
            tanggal_masuk: true,
            foto: true,
            status: true
        }
    });

    if (!employee) {
        throw new ResponseError(400, { message: "Data karyawan tidak ditemukan" });
    }

    return employee;
}

const update = async (request) => {
    const employee = validate(updateEmployeeValidation, request);

    const totalEmployeeInDatabase = await prismaClient.employee.count({
        where: {
            nomor: employee.nomor
        }
    });

    if (totalEmployeeInDatabase !== 1) {
        throw new ResponseError(400, { message: "Data karyawan tidak ditemukan" });
    }

    return prismaClient.employee.update({
        where: {
            nomor: employee.nomor
        },
        data: {
            nama: employee.nama,
            jabatan: employee.jabatan,
            departmen: employee.departmen,
            tanggal_masuk: employee.tanggal_masuk,
            foto: employee.foto,
            status: employee.status,
        },
        select: {
            nama: true,
            nomor: true,
            jabatan: true,
            departmen: true,
            tanggal_masuk: true,
            foto: true,
            status: true
        }
    });
}

const remove = async (nomor) => {
    nomor = validate(getEmployeeValidation, nomor);

    const employee = await prismaClient.employee.findUnique({
        where: { nomor: nomor },
        select: { foto: true }
    });

    if (!employee) {
        throw new ResponseError(400, { message: "Data karyawan tidak ditemukan" });
    }

    const filePath = path.resolve('uploads', employee.foto);
    if (fs.existsSync(filePath)) {
        try {
            fs.unlinkSync(filePath);
        } catch (err) {
            console.error(`Failed to delete file at ${filePath}:`, err);
            throw new Error('Failed to delete file');
        }
    }

    return prismaClient.employee.delete({
        where: { nomor: nomor }
    });
}

export default {
    create,
    getAll,
    get,
    update,
    remove
};
