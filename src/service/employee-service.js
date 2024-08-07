import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import { createEmployeeValidation } from "../validation/employee-validation.js";
import { validate } from "../validation/validation.js";

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
            foto: true,
        }
    });
}

export default {
    create,
};
