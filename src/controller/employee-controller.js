import path from 'path';
import fs from 'fs';
import employeeService from "../service/employee-service.js";

const create = async (req, res, next) => {
    try {
        const uploadDir = path.resolve('uploads');

        let fotoPath = req.file ? req.file.path : null;

        let relativeFotoPath = fotoPath ? path.relative(uploadDir, fotoPath) : null;

        console.log('Full path:', fotoPath);
        console.log('Relative path:', relativeFotoPath);

        if (relativeFotoPath && !fs.existsSync(path.join(uploadDir, relativeFotoPath))) {
            throw new Error('File tidak ditemukan');
        }

        const employeeData = { ...req.body, foto: `uploads/${relativeFotoPath}` };
        const result = await employeeService.create(employeeData);
        res.status(200).json({
            data: result
        });
    } catch (e) {
        next(e);
    }
}

export default {
    create,
};
