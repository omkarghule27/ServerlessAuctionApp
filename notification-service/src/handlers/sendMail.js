import AWS from 'aws-sdk';

const ses = new AWS.SES({ region: 'us-west-1'});
async function sendMail(event, context) {
  // because the batch size is 1 we can directly get the first message
  const record = event.Records[0];
  console.log('processing record', record);

  const email = JSON.parse(record.body);
  const {subject,body,recipient} = email;

  const params = {
    Source: 'ghuleshubham2013@gmail.com',
    Destination: {
      ToAddresses: [recipient],
    },
    Message: {
      Body:{
        Text:{
          Data: body,
        },
      },
      Subject: {
        Data: subject,
      }
    },
  };

  try
  {
    const result = await ses.sendEmail(params).promise();
    console.log(result);
    return result;
  }
  catch (error)
  {
    console.error(error);
    // throw new createError.InternalServerError(error);
  }


}

export const handler = sendMail;


