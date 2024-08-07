import Joi from "joi";

const createEmployeeValidation = Joi.object({
    nama: Joi.string().max(100 ).required(),
    nomor: Joi.string().max(20 ).required(),
    jabatan: Joi.string().max(100 ).required(),
    departmen: Joi.string().max(30 ).required(),
    tanggal_masuk: Joi.date().required(),
    foto: Joi.any().optional(),
    status: Joi.string().max(10 ).required(),
});

const getEmployeeValidation = Joi.string().max(20).required();

const updateEmployeeValidation = Joi.object({
    nama: Joi.string().max(100 ).required(),
    nomor: Joi.string().max(20 ).required(),
    jabatan: Joi.string().max(100 ).required(),
    departmen: Joi.string().max(30 ).required(),
    tanggal_masuk: Joi.date().required(),
    foto: Joi.any().optional(),
    status: Joi.string().max(10 ).required(),
});

export {
    createEmployeeValidation,
    getEmployeeValidation,
    updateEmployeeValidation
}