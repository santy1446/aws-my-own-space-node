const { v4 } = require('uuid');
const AWS = require('aws-sdk');
const jwt_decode = require('jwt-decode');
const { env } = require('../environments/environment');
module.exports.addContact = async (event) => {
    
    try {
        const { 
            img_src, img_extension,
            job, contact_name, phone, email
        } = JSON.parse(event.body);
        const DECODED = jwt_decode(event.headers.authorization);
        const USER_ID = DECODED.username;
        const id = v4();
        const IMAGE_NAME = `${USER_ID}-${id}.${img_extension}`

        /** Bucket */

        const buf = Buffer.from(img_src.replace(/^data:image\/\w+;base64,/, ""),'base64');
        const S3 = new AWS.S3({
            accessKeyId: env.AWS_S3_ACCESS_KEY_ID,
            secretAccessKey: env.AWS_S3_SECRET_ACCESS_KEY,
        });

        await S3.upload({
            Bucket: env.AWS_S3_BUCKET_NAME,
            Key: IMAGE_NAME,
            Body: buf,
            ContentEncoding: 'base64',
            ContentType: 'image/jpeg'
        }).promise();

        /** Table */

        const dynamodb = new AWS.DynamoDB.DocumentClient();
        
        const newContact = {
            id,
            user_id: USER_ID,
            img: IMAGE_NAME,
            contact_name,
            job,
            phone,
            email
        }

        await dynamodb.put({
            TableName: 'ContactsTable',
            Item: newContact
        }).promise();

        return {
            status: 200,
            body: JSON.stringify(newContact)
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify(error)
        }
    }
}
