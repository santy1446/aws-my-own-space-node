const AWS = require('aws-sdk');
const jwt_decode = require('jwt-decode');
const { env } = require('../environments/environment');

module.exports.deleteContact = async (event) => {
    
    try {
        const { id } = event.pathParameters;
        const dynamodb = new AWS.DynamoDB.DocumentClient();
        const DECODED = jwt_decode(event.headers.authorization);
        const USER_ID = DECODED.username;

        const S3 = new AWS.S3({
            accessKeyId: env.AWS_S3_ACCESS_KEY_ID,
            secretAccessKey: env.AWS_S3_SECRET_ACCESS_KEY,
        });

        const PARAMS = {
            TableName: 'ContactsTable',
            Key: {
                id,
                user_id: USER_ID
            }
        };

        let imgToDelete;
        await dynamodb.get(PARAMS, (error, data) => {
            if (!error) {
                imgToDelete = data.Item.img
            }
        }).promise();

        await dynamodb.delete(PARAMS).promise();

        await S3.deleteObject({
            Bucket: env.AWS_S3_BUCKET_NAME,
            Key: imgToDelete
        }).promise();

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'contact deleted'
            })
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify(error)
        }
    }
}