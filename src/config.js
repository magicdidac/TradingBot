import { isMobile } from 'react-device-detect'

export const API_KEY = 'd66dd8a7464c415eb68a80d4d5f8834c'
export const API_SECRET = '2afeba640b42407ab0bbd87e18ec4f80'

export const BASE_URL_BITTREX = 'https://api.bittrex.com/v3/markets/'
export const BASE_URL_PHP = 'https://magicdvstudio.com/tradeBot/sendBittrexRequest.php?url='

export const FEE = 0.0075
export const FEE_MULTIPLIER = 1 - FEE

export const MAX_BOTS_COLUMNS = (isMobile) ? 2 : 5