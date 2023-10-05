const AWS = require('aws-sdk');
const jwt_decode = require('jwt-decode');

module.exports.getContacts = async (event) => {
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
            TableName: "ContactsTable"
        }

        let response;
        await dynamodb.query(params, (error, data) => {
            if (!error) {
                response = data;
            }
        }).promise();

        return {
            statusCode: 200,
            body: JSON.stringify(response.Items)
        }

        
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify(error)
        }
    }
}