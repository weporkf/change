enum CoinsEnum {
  USDT,
  BTC,
  RUB,
  EUR,
  USD,
  TRX,
}

enum CoinsTypeEnum {
  FIAT,
  CRYPTO,
}

export interface InOut {
  coin: CoinsEnum;
  amount: string;
  id: string;
  type: CoinsTypeEnum;
}
