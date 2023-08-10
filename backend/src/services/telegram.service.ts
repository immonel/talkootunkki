import { createHmac } from 'crypto';
import querystring from 'querystring';
import { TelegramUserData } from '../types';

// https://core.telegram.org/bots/webapps#validating-data-received-via-the-web-app

const generateDataCheckString = (initData: string) => {
  const { hash, ...values } = querystring.parse(initData)
  const sortedValues  = Object.entries(values)
    .map(([key, value]) => `${key}=${value}`)
    .sort()
  const dataCheckString = sortedValues.join('\n')
  return dataCheckString
}


const initDataIsValid = (initData: string) => {
  const bot_token = process.env.TG_BOT_API_TOKEN || '';
  const { hash } = querystring.parse(initData);
  const data_check_string = generateDataCheckString(initData)

  if (!bot_token) {
    console.log('Failed to validate user, TG_BOT_API_TOKEN not set')
    return false
  }

  if (!hash || !data_check_string) {
    console.log('Failed to validate user, invalid initData')
    return false
  }

  const secret_key = (
    createHmac("sha256", "WebAppData")
      .update(bot_token)
      .digest()
  )

  const generated_hash = (
    createHmac("sha256", secret_key)
      .update(data_check_string)
      .digest('hex')
  )

  if (generated_hash !== hash) {
    console.log('Failed to validate user, invalid hash')
    return false
  }

  // TODO: check auth_date to prevent use of outdated data

  return true
}

export const getUserData = (initData: string): TelegramUserData | null => {
  const { user } = querystring.parse(initData)

  if (!user || typeof user !== 'string') {
    return null
  }

  if (!initDataIsValid(initData)) {
    return null
  }

  const userData = JSON.parse(user) as TelegramUserData
  return userData
}