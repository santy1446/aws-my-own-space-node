const AWS = require('aws-sdk');
const jwt_decode = require('jwt-decode');
const { env } = require('../environments/environment');
const CONSTANTS = require( "../constants");

module.exports.updateContact = async (event) => {
    try {
        const { id } = event.pathParameters;
        const {
            img_src, img_extension,
            job, contact_name, phone, email
        } = JSON.parse(event.body);
        const dynamodb = new AWS.DynamoDB.DocumentClient();
        const DECODED = jwt_decode(event.headers.authorization);
        const USER_ID = DECODED.username;

        let updateExpression = 'set job = :job, contact_name = :contact_name, phone = :phone, email = :email';

        let expressionAttributes = {
            ':job': job,
            ':contact_name': contact_name,
            ':phone': phone,
            ':email': email
        };

        if (img_src && img_extension) {
            const IMAGE_NAME = `${USER_ID}-${id}.${img_extension}`;

            const buf = Buffer.from(img_src.replace(/^data:image\/\w+;base64,/, ""), 'base64');
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

            updateExpression = `${updateExpression}, img = :img`;
            expressionAttributes[':img'] = IMAGE_NAME;
        }

        await dynamodb.update({
            TableName: 'ContactsTable',
            Key: {
                id,
                user_id: USER_ID
            },
            UpdateExpression: updateExpression,
            ExpressionAttributeValues: expressionAttributes,
            ReturnValues: 'ALL_NEW'
        }).promise();

        return {
            statusCode: 200,
            headers: CONSTANTS.HEADERS_CONFIG,
            body: JSON.stringify({
                message: 'Contact updated successfully'
            })
        }

    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify(error)
        }

    }
}