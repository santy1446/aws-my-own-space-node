const AWS = require('aws-sdk');
const jwt_decode = require('jwt-decode');

module.exports.updateNote = async (event) => {
    try {
        const { id } = event.pathParameters;
        const { title, note_body } = JSON.parse(event.body);
        const dynamodb = new AWS.DynamoDB.DocumentClient();
        const DECODED = jwt_decode(event.headers.authorization);
        const USER_ID = DECODED.username;

        await dynamodb.update({
            TableName: 'NotesTable',
            Key: {
                id,
                user_id: USER_ID
            },
            UpdateExpression: 'set note_body = :note_body, title = :title',
            ExpressionAttributeValues: {
                ':note_body': note_body,
                ':title': title
            },
            ReturnValues: 'ALL_NEW'
        }).promise();

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Note updated successfully'
            })
        }

    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify(error)
        }
        
    }
}