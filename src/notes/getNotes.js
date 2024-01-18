const AWS = require('aws-sdk');
const jwt_decode = require('jwt-decode');
const CONSTANTS = require( "../constants");

module.exports.getNotes = async (event) => {
    try {
        const dynamodb = new AWS.DynamoDB.DocumentClient();
        const DECODED = jwt_decode(event.headers.authorization);
        const USER_ID = DECODED.username;

        const params = {
            ExpressionAttributeValues: {
                ":user_id": USER_ID
            },
            IndexName: "user_index",
            KeyConditionExpression: "user_id = :user_id",
            TableName: "NotesTable"
        }

        let response;
        await dynamodb.query(params, (error, data) => {
            if (!error) {
                response = data;
            }
        }).promise();

        return {
            statusCode: 200,
            headers: CONSTANTS.HEADERS_CONFIG,
            body: JSON.stringify(response.Items)
        }

        
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify(error)
        }
    }
}