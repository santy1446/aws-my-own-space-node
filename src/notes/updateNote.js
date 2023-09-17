const AWS = require('aws-sdk');

module.exports.updateNote = async (event) => {
    try {
        const { id, email} = event.pathParameters;
        const { title, note_body } = JSON.parse(event.body);
        const dynamodb = new AWS.DynamoDB.DocumentClient();

        await dynamodb.update({
            TableName: 'NotesTable',
            Key: {
                id,
                email_user_login: email
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