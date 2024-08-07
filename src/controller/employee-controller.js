import path from 'path';
import fs from 'fs';
import csv from 'csv-parser';
import { createObjectCsvWriter } from 'csv-writer';
import PDFDocument from 'pdfkit';
import employeeService from "../service/employee-service.js";

const ensureDirectoryExists = (dirPath) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
}

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

const importCSV = async (req, res, next) => {
    try {
        const filePath = req.file.path;
        const results = [];

        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (data) => {
                if (data.nomor) {
                    data.nomor = data.nomor.replace(/^0+/, '');
                }
                data.tanggal_masuk = new Date(data.tanggal_masuk);
                results.push(data);
            })
            .on('end', async () => {
                try {
                    for (const row of results) {
                        await employeeService.create(row);
                    }

                    fs.unlinkSync(filePath);

                    res.status(200).json({
                        message: "CSV data imported successfully",
                        data: results
                    });
                } catch (e) {
                    next(e);
                }
            });
    } catch (e) {
        next(e);
    }
}

const exportToCSV = async (req, res, next) => {
    try {
        const exportDir = path.resolve('exports');
        ensureDirectoryExists(exportDir);
        const employees = await employeeService.getAll();

        const formattedEmployees = employees.map(employee => ({
            ...employee,
            tanggal_masuk: new Date(employee.tanggal_masuk).toISOString().split('T')[0]
        }));

        const csvWriter = createObjectCsvWriter({
            path: path.resolve('exports', 'employees.csv'),
            header: [
                { id: 'nama', title: 'Nama' },
                { id: 'nomor', title: 'Nomor' },
                { id: 'jabatan', title: 'Jabatan' },
                { id: 'departmen', title: 'Departmen' },
                { id: 'tanggal_masuk', title: 'Tanggal Masuk' },
                { id: 'foto', title: 'Foto' },
                { id: 'status', title: 'Status' }
            ],
            fieldDelimiter: ';'
        });

        await csvWriter.writeRecords(formattedEmployees);

        res.status(200).json({
            message: "Data exported to CSV successfully",
            file: '/exports/employees.csv'
        });
    } catch (e) {
        next(e);
    }
}

const exportToPDF = async (req, res, next) => {
    try {
        const employees = await employeeService.getAll();

        const formatDate = (date) => {
            const d = new Date(date);
            return d.toISOString().split('T')[0];
        };

        const doc = new PDFDocument();
        const pdfPath = path.resolve('exports', 'employees.pdf');
        doc.pipe(fs.createWriteStream(pdfPath));

        doc.fontSize(20).text('Employee List', { align: 'center' });
        doc.moveDown();

        doc.fontSize(12);
        const tableTop = 100;
        const itemSpacing = 1;
        let y = tableTop;

        employees.forEach(employee => {
            doc.text(`Name: ${employee.nama}`, { continued: true }).text(`Number: ${employee.nomor}`);
            doc.text(`Position: ${employee.jabatan}`);
            doc.text(`Department: ${employee.departmen}`);
            doc.text(`Date Joined: ${formatDate(employee.tanggal_masuk)}`);
            doc.text(`Photo: ${employee.foto}`);
            doc.text(`Status: ${employee.status}`);
            doc.moveDown(itemSpacing);
            y += itemSpacing;
        });

        doc.end();

        res.status(200).json({
            message: "Data exported to PDF successfully",
            file: '/exports/employees.pdf'
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
    remove,
    importCSV,
    exportToCSV,
    exportToPDF
};
