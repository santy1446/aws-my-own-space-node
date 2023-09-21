const { v4 } = require('uuid');
const AWS = require('aws-sdk');

module.exports.addNote = async (event) => {

    try {
        const dynamodb = new AWS.DynamoDB.DocumentClient();
        const { email_user_login, title, note_body } = JSON.parse(event.body);
        const createDate = new Date().toISOString();
        const id = v4();

        const newNote = {
            id,
            email_user_login,
            title,
            note_body,
            createDate
        }
        await dynamodb.put({
            TableName: 'NotesTable',
            Item: newNote
        }).promise();

        return {
            status: 200,
            body: JSON.stringify(newNote)
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify(error)
        }
    }
}
