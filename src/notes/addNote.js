const { v4 } = require('uuid');
const AWS = require('aws-sdk');
const jwt_decode = require('jwt-decode');
module.exports.addNote = async (event) => {
    
    try {
        const dynamodb = new AWS.DynamoDB.DocumentClient();
        const { title, note_body } = JSON.parse(event.body);
        const create_date = new Date().toISOString();
        const id = v4();
        const DECODED = jwt_decode(event.headers.authorization);
        const USER_ID = DECODED.username;

        const newNote = {
            id,
            user_id: USER_ID,
            title,
            note_body,
            create_date
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
