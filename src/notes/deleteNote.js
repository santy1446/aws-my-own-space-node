const AWS = require('aws-sdk');
const jwt_decode = require('jwt-decode');

module.exports.deleteNote = async (event) => {
    try {
        const { id } = event.pathParameters;
        const dynamodb = new AWS.DynamoDB.DocumentClient();
        const DECODED = jwt_decode(event.headers.authorization);
        const USER_ID = DECODED.username;

        await dynamodb.delete({
            TableName: 'NotesTable',
            Key: {
                id,
                user_id: USER_ID
            }
        }).promise();

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Note deleted'
            })
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify(error)
        }
    }
}