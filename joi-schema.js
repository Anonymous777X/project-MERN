import joi from "joi";


export const joiSchema = joi.object({
    listings : joi.object({
        title : joi.string().required(),
        description : joi.string().required(),
        price :joi.number().required().min(0),
        location : joi.string().required(),
        country : joi.string().required(),
        image : joi.string().allow("",null)
    }).required()
})