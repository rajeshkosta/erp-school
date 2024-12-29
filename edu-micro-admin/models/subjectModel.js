const Joi = require("joi");
const { ERROR } = require("../constants/ERRORCODE");

// Constructor
const Subject = function (subject) {
  this.subject_name = subject.subject_name;
  this.status = subject.status;
}

function validateSubject(subjectToValidate) {
    const schema = Joi.object({
        subject_name: Joi.array().items(Joi.string()).required(),
        status: Joi.string().valid('1'),
        updated_by: Joi.number().integer(),
        created_by: Joi.number().integer()
      });


    
    return schema.validate(subjectToValidate);
}
  const queryAllSubjects = async () => {
    try {
      // Assuming you have a method to query all subjects from the database
      const query = {
        text: 'SELECT * FROM m_subject',
      };
  
      const result = await pg.executeQueryPromise(query);
  
      return result;
    } catch (error) {
      throw error;
    }
  };

  
const UpdateSubject = function (subject) {
  this.subject_id = subject.subject_id;
  this.subject_name = subject.subject_name;
  
}


function validateUpdateSubject(subjectToValidate) {
   
  const schema = Joi.object({
      subject_name: Joi.string(),
      subject_id: Joi.number().integer()
  
    });


  
  return schema.validate(subjectToValidate);
}

  
module.exports.UpdateSubject=UpdateSubject;
module.exports.validateUpdateSubject = validateUpdateSubject;
module.exports.Subject = Subject;
module.exports.validateSubject = validateSubject;queryAllSubjects



