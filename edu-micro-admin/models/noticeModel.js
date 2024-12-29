const Joi = require("joi")

const noticeBoard = function (noticeDetails) {
    this.notice_title = noticeDetails.notice_title;
    this.published_on = noticeDetails.published_on;
    this.description = noticeDetails.description;
    this.role_list = noticeDetails.role_list;
    this.role_list = noticeDetails.role_list ? noticeDetails.role_list: null;

}

function validateNotice(noticeDetails) {
    const noticeSchema = Joi.object({
        notice_title: Joi.string().required(),
        published_on: Joi.allow(null),
        description: Joi.string().allow(null),
        role_list : Joi.allow(null)
    });
    return noticeSchema.validate(noticeDetails)
}


//UPDATE
const updateNotice = function (noticeDetails) {
    this.notice_id = noticeDetails.notice_id;
    this.notice_title = noticeDetails.notice_title;
    this.published_on = noticeDetails.published_on;
    this.description = noticeDetails.description;
}

function validateUpdateNotice(noticeDetails) {
    const noticeSchema = Joi.object({
        notice_id: Joi.number().required(),
        notice_title: Joi.string(),
        published_on: Joi.allow(null),
        description: Joi.string().allow(null),
    });
    return noticeSchema.validate(noticeDetails)
}
module.exports = {
    noticeBoard,
    validateNotice,
    updateNotice,
    validateUpdateNotice
}