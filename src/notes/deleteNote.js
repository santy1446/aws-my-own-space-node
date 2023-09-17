const AWS = require('aws-sdk');

module.exports.deleteNote = async (event) => {
    try {
        const { id, email} = event.pathParameters;
        const dynamodb = new AWS.DynamoDB.DocumentClient();

        await dynamodb.delete({
            TableName: 'NotesTable',
            Key: {
                id,
                email_user_login: email
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