const {
    db,
    pg,
    redis,
    logger,
    queryUtility,
    JSONUTIL,
  } = require("edu-micro-common");
  const QUERY = require("../constants/QUERY");
  const CONSTANT = require("../constants/CONST");
  const ERRORCODE = require("../constants/ERRORCODE");
  const moment = require("moment");
  const { log } = require("util");
  
  const checkistransactionDetailsExist = async (transaction_id) => {
    try {
      const _query = {
        text: QUERY.TRANSACTION.checkTransactionExist,
        values: [transaction_id],
      };
  
      console.log(_query);
  
      const queryResult = await pg.executeQueryPromise(_query);
      return queryResult[0].count;
    } catch (error) {
      throw error;
    }
  };

  const checkTransactionDetailsExistByInvoice = async (invoice_id) => {
    try {
      const _query = {
        text: QUERY.TRANSACTION.checkTransactionExistbyvoiceid,
        values: [invoice_id],
      };
  
      console.log(_query);
  
      const queryResult = await pg.executeQueryPromise(_query);
      return queryResult[0].count;
    } catch (error) {
      throw error;
    }
  };

  const createTransaction = async (transactionDetails) => {
    console.log(transactionDetails);
    try {
      const invoice_id = generateInvoiceId();
      const _query = {
        text: QUERY.TRANSACTION.createTransaction,
        values: [
          transactionDetails.student_admission_id,
          transactionDetails.class_id,
          transactionDetails.academic_year_id,
          transactionDetails.fees_config_id,
          transactionDetails.total_amount,
          transactionDetails.paying_amount,
          transactionDetails.date,
          invoice_id,
          transactionDetails.balance_amount,
          transactionDetails.transaction_mode_id,
          transactionDetails.status,
          transactionDetails.updated_by,
          transactionDetails.created_by
        ],
      };
  
      console.log(_query);
      const queryResult = await pg.executeQueryPromise(_query);
      return queryResult;
    } catch (error) {
      throw error;
    }
  };

  const getAllTransactions = async ( fees_config_id) => {
    try {

        const query = {
            text: QUERY.TRANSACTION.getAllTransactions,
            values: [
              fees_config_id],
        };
        console.log("query-------".query);
        const result = await pg.executeQueryPromise(query);
        return result;
    } catch (error) {
        logger.error(`Error getting in transaction details: ${error}`);
        throw error;
    }
};


function generateInvoiceId(prefix) {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  const day = currentDate.getDate().toString().padStart(2, '0'); 
  const uniqueId = Math.floor(Math.random() * 10000); 

const invoiceId = `${year}${month}${day}-${uniqueId}`;
  return invoiceId;
}

const transactionList = async (Invoiceid, transactionid) => {
  try {

    const _query = {
      text: QUERY.TRANSACTION.transactionList,
      values: [Invoiceid, transactionid]
    };

    const queryResult = await pg.executeQueryPromise(_query);
    return queryResult;

  } catch (error) {
    throw error;
  }
};

  const gettransactionDetailsBytransactionId = async (transaction_id) => {
    try {
      const _query = {
        text: QUERY.TRANSACTION.getSpecifictransactionDetails,
        values: [transaction_id],
      };
  
      const queryResult = await pg.executeQueryPromise(_query);
      return queryResult && queryResult.length > 0 ? queryResult[0] : null;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const checkSchoolAdmissionId = async(student_admission_id) =>{
    try{
        const _query={
            text:QUERY.TRANSACTION.checkStudentAdmissionId,
            values:[student_admission_id]
        }
        const queryResult = await pg.executeQueryPromise(_query);
        return queryResult[0].count;
    }catch(error){
        throw error;
    }
}


const getTransactionById = async (student_admission_id,academic_year_id) =>{
    try{
        const _query = {
            text:QUERY.TRANSACTION.getTransactionById,
            values:[student_admission_id,academic_year_id]
        }
         const queryResult = await pg.executeQueryPromise(_query);
         return queryResult;
    }catch(error){
        throw error;
    }
}

  module.exports = {
    generateInvoiceId,
    checkistransactionDetailsExist,
    checkTransactionDetailsExistByInvoice,
    createTransaction,
    gettransactionDetailsBytransactionId,
    getAllTransactions,
    getTransactionById,
    transactionList,
    checkSchoolAdmissionId
  };