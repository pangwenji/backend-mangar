import numeral from 'numeral';

export const sleep = (timeout: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });

export const getObjectPrototype = (data: any) => {
  return Object.prototype.toString.call(data).slice(8, -1);
};

export const validIPv4 = (queryIP: string = '') => {
  const tokens = queryIP.split('.');
  if (tokens.length !== 4) {
    return false;
  }
  if (!tokens.every((token) => /^(0|[1-9]\d*)$/.test(token))) {
    return false;
  }
  const components = tokens.map((token) => parseInt(token, 10));
  if (!components.every((component) => component >= 0 && component <= 255)) {
    return false;
  }
  return true;
};

export const validIPv6 = (queryIP: string = '') => {
  const tokens = queryIP.split(':');
  if (tokens.length !== 8) {
    return false;
  }
  if (!tokens.every((token) => /^[\da-fA-F]{1,4}$/.test(token))) {
    return false;
  }
  return true;
};

export const basicMoneyFormat = (
  money?: string | number,
  placeholder: string = ''
): string => {
  const moneyNum = Number(money);
  if (Number.isNaN(moneyNum)) {
    return placeholder;
  } else {
    // const isVND = ((entity as any).currency || currencyType) === CurrencyType.VND;
    const parsedMoney = moneyNum;
    // const unit = isVND ? '万元' : '元';
    // const unit = '元';
    return numeral(parsedMoney).format('0,0.00');
  }
};
