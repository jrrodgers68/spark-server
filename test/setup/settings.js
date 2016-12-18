// @flow

import path from 'path';
import WebhookFileRepository from '../../src/repository/WebhookFileRepository';
import UsersFileRepository from '../../src/repository/UserFileRepository';
import { DeviceAttributeFileRepository, DeviceKeyFileRepository } from 'spark-protocol';

export default {
  accessTokenLifetime: 7776000, // 90 days,
  baseUrl: 'http://localhost',
  coreFlashTimeout: 90000,
  coreKeysDir: path.join(__dirname, '../__test_data__/core_keys'),
  coreRequestTimeout: 30000,
  coreSignalTimeout: 30000,
  isCoreOnlineTimeout: 2000,
  loginRoute: '/oauth/token',
  logRequests: false,
  maxHooksPerDevice: 10,
  maxHooksPerUser: 20,
  deviceAttributeRepository: new DeviceAttributeFileRepository(
    path.join(__dirname, '../__test_data__/core_keys'),
  ),
  deviceKeyFileRepository: new DeviceKeyFileRepository(
    path.join(__dirname, '../__test_data__/core_keys'),
  ),
  usersRepository: new UsersFileRepository(
    path.join(__dirname, '../__test_data__/users'),
  ),
  webhookRepository: new WebhookFileRepository(
    path.join(__dirname, '../__test_data__/webhooks'),
  ),

  /**
   * Your server crypto keys!
   */
  cryptoSalt: 'aes-128-cbc',
  serverKeyFile: "default_key.pem",
  serverKeyPassFile: null,
  serverKeyPassEnvVar: null,

  PORT: 5683,
  HOST: "localhost",
};