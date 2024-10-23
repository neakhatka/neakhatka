import { logger } from '@notifications/utils/logger';
import client, { Channel, Connection } from 'amqplib';
import { consumeAuthEmailMessages } from './email-consumer';
import getConfig from '@notifications/utils/config';

export async function createQueueConnection(): Promise<Channel | undefined> {
  try {
    console.log('hello world');

    // Create Connection to RabbitMQ
    const connection: Connection = await client.connect(
      `${getConfig().rabbitMQ}`
    );
    console.log('hello world');

    const channel: Channel = await connection.createChannel();

    logger.info('Notification server connected to queue successfully....');

    // Set up close logic for SIGINT
    closeQueueConnection(channel, connection);

    return channel;
  } catch (error) {
    console.log('Error from notification', error);
    logger.error(
      `NotificationService createQueueConnection() method error: ${error}`
    );
    return undefined;
  }
}

function closeQueueConnection(channel: Channel, connection: Connection) {
  process.once('SIGINT', async () => {
    await channel.close();
    await connection.close();
    logger.info('RabbitMQ connection and channel closed successfully.');
  });
}

export async function startQueue(): Promise<void> {
  try {
    console.log('Hello from startqueue()');
    const emailChannel: Channel = (await createQueueConnection()) as Channel;
    await consumeAuthEmailMessages(emailChannel);
  } catch (error) {
    throw error;
  }
}
