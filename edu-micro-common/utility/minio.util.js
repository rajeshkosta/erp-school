const AWS = require('aws-sdk');
const Minio = require('minio');

const config = {
  useMinio: process.env.EDU_USE_MINO,
  minioConfig: {
    endPoint: process.env.EDU_MINIO_ENDPOINT,
    port: parseInt(process.env.EDU_MINIO_PORT),
    useSSL: process.env.EDU_MINIO_ENABLE_SSL === 'true',
    accessKey: process.env.EDU_MINIO_ACCESS_KEY,
    secretKey: process.env.EDU_MINIO_SECRET_KEY,
  },
  s3Config: {
    endpoint: process.env.EDU_S3_ENDPOINT,
    accessKeyId: process.env.EDU_S3_ACCESS_KEY,
    secretAccessKey: process.env.EDU_S3_SECRET_KEY,
  },
  spacesConfig: {
    endpoint: process.env.EDU_SPACES_ENDPOINT,
    accessKeyId: process.env.EDU_SPACES_ACCESS_KEY,
    secretAccessKey: process.env.EDU_SPACES_SECRET_KEY,
  },
};

let client;

if (config.useMinio) {
    client = new Minio.Client(config.minioConfig);
} else if (config.s3Config.endpoint) {
    const s3Endpoint = new AWS.Endpoint(config.s3Config.endpoint);
    client = new AWS.S3({
        endpoint: s3Endpoint,
        accessKeyId: config.s3Config.accessKeyId,
        secretAccessKey: config.s3Config.secretAccessKey,
    });
} else if (config.spacesConfig.endpoint) {
    client = new AWS.S3({
        endpoint: config.spacesConfig.endpoint,
        accessKeyId: config.spacesConfig.accessKeyId,
        secretAccessKey: config.spacesConfig.secretAccessKey,
    });
} else {
    throw new Error("No valid configuration found for Minio, S3, or Spaces.");
}

const listBucket = async () => {
    if (config.useMinio) {
        return await minioListBuckets();
    } else {
        return await s3ListBuckets();
    }
}

const makeBucket = async (bucketName) => {
    if (config.useMinio) {
        return await minioMakeBucket(bucketName);
    } else {
        return await s3MakeBucket(bucketName);
    }
}

const putObject = async (bucketName, objectFileName, fileData) => {
    if (config.useMinio) {
        return await minioPutObject(bucketName, objectFileName, fileData);
    } else {
        return await s3PutObject(bucketName, objectFileName, fileData);
    }
}

const getObject = async (bucketName, fileObjectKey) => {
    if (config.useMinio) {
        return await minioGetObject(bucketName, fileObjectKey);
    } else {
        return await s3GetObject(bucketName, fileObjectKey);
    }
}

const presignedGetObject = async (bucketName, fileObjectKey) => {
    if (config.useMinio) {
        return await minioPresignedGetObject(bucketName, fileObjectKey);
    } else {
        return await s3PresignedGetObject(bucketName, fileObjectKey);
    }
}

const minioListBuckets = async () => {
    return client.listBuckets().promise();
}

const minioMakeBucket = async (bucketName) => {
    return client.makeBucket(bucketName).promise();
}

const minioPutObject = async (bucketName, objectFileName, fileData) => {
    return client.putObject(bucketName, objectFileName, fileData);
}

const minioGetObject = async (bucketName, fileObjectKey) => {
    return new Promise((resolve, reject) => {
        const chunks = [];
        client.getObject(bucketName, fileObjectKey, (err, stream) => {
            if (err) {
                reject(err);
                return;
            }
            stream.on('data', chunk => chunks.push(chunk));
            stream.on('end', () => {
                const data = Buffer.concat(chunks);
                resolve(data);
            });
            stream.on('error', reject);
        });
    });
}

const minioPresignedGetObject = async (bucketName, fileObjectKey) => {
    return client.presignedGetObject(bucketName, fileObjectKey, 300);
}

const s3ListBuckets = async () => {
    return client.listBuckets().promise();
}

const s3MakeBucket = async (bucketName) => {
    const params = {
        Bucket: bucketName
    };
    return client.createBucket(params).promise();
}

const s3PutObject = async (bucketName, objectFileName, fileData) => {
    const params = {
        Bucket: bucketName,
        Key: objectFileName,
        Body: fileData
    };
    return client.putObject(params).promise();
}

const s3GetObject = async (bucketName, fileObjectKey) => {
    try {
        const params = {
            Bucket: bucketName,
            Key: fileObjectKey
        };
        const data = await client.getObject(params).promise();
        return data.Body;
    } catch (error) {
        throw error;
    }
}

const s3PresignedGetObject = async (bucketName, fileObjectKey, expiresIn = 3600) => {
    const params = {
        Bucket: bucketName,
        Key: fileObjectKey,
        Expires: expiresIn,
    };
    return client.getSignedUrlPromise('getObject', params);
}

module.exports = {
    listBucket,
    makeBucket,
    putObject,
    getObject,
    presignedGetObject
}