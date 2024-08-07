import path from 'path';
import fs from 'fs';
import employeeService from "../service/employee-service.js";

const create = async (req, res, next) => {
    try {
        const uploadDir = path.resolve('uploads');
        let fotoPath = req.file ? path.relative(uploadDir, req.file.path) : null;

        const employeeData = { ...req.body, foto: fotoPath };
        const result = await employeeService.create(employeeData);
        res.status(200).json({
            data: result
        });
    } catch (e) {
        next(e);
    }
}

const getAll = async (req, res, next) => {
    try {
        const employees = await employeeService.getAll();

        const formattedEmployees = employees.map(employee => ({
            ...employee,
            tanggal_masuk: new Date(employee.tanggal_masuk).toISOString().split('T')[0]
        }));

        res.status(200).json({
            data: formattedEmployees
        });
    } catch (e) {
        next(e);
    }
}

const get = async (req, res, next) => {
    try {
        const nomor = req.params.nomor;
        const result = await employeeService.get(nomor);

        const formattedEmployee = {
            ...result,
            tanggal_masuk: new Date(result.tanggal_masuk).toISOString().split('T')[0]
        };

        res.status(200).json({
            data: formattedEmployee
        })
    } catch (e) {
        next(e);
    }
}

const update = async (req, res, next) => {
    try {
        const nomor = req.params.nomor;
        const uploadDir = path.resolve('uploads');

        let fotoPath = req.file ? req.file.path : null;
        let relativeFotoPath = fotoPath ? path.relative(uploadDir, fotoPath) : null;

        if (relativeFotoPath && !fs.existsSync(path.join(uploadDir, relativeFotoPath))) {
            throw new Error('File tidak ditemukan');
        }

        const updateData = { ...req.body, nomor };
        if (relativeFotoPath) {
            updateData.foto = `uploads/${relativeFotoPath}`;
        }

        const result = await employeeService.update(updateData);

        const formattedEmployee = {
            ...result,
            tanggal_masuk: new Date(result.tanggal_masuk).toISOString().split('T')[0]
        };

        res.status(200).json({
            data: formattedEmployee
        });
    } catch (e) {
        next(e);
    }
}

const remove = async (req, res, next) => {
    try {
        const nomor = req.params.nomor;

        await employeeService.remove(nomor);
        res.status(200).json({
            data: "OK"
        });
    } catch (e) {
        next(e);
    }
}

export default {
    create,
    getAll,
    get,
    update,
    remove
};
