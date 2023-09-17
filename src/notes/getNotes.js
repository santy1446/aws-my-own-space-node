const AWS = require('aws-sdk');

module.exports.getNotes = async (event) => {
    try {
        const { email } = event.pathParameters;
        const dynamodb = new AWS.DynamoDB.DocumentClient();

        const params = {
            ExpressionAttributeValues: {
                ":email": email
            },
            IndexName: "email_index",
            KeyConditionExpression: "email_user_login = :email",
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
            body: JSON.stringify(response.Items)
        }

        
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify(error)
        }
    }
}