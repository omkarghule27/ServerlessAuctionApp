import AWS from 'aws-sdk';
import validator from '@middy/validator';
import createError from 'http-errors';
import getAuctionsSchema from '../lib/schemas/getAuctionsSchema';
import commonMiddleware from '../lib/commonMiddleware';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getAuctions(event, context) {
    const {status} = event.queryStringParameters;
    let auctions;
    try
    {
        const params = {
            TableName: process.env.AUCTIONS_TABLE_NAME,
            IndexName : 'statusAndEndDate',
            KeyConditionExpression: '#status = :status',
            ExpressionAttributeValues:
            {
                ':status': status,
            },
            ExpressionAttributeNames:
            {
                '#status': 'status',
            },
        };
        const results = await dynamodb.query(params).promise();
        auctions = results.Items;
    }
    catch(error)
    {
        console.error(error);
        throw new createError.InternalServerError(error);
    }
    return {
        statusCode: 200,
        body: JSON.stringify({auctions}),
    };
}

export const handler = commonMiddleware(getAuctions).use(
    validator({
      inputSchema: getAuctionsSchema,
      ajvOptions: {
        useDefaults: true,
        strict: true,
      },
    })
  );