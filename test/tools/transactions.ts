export function getTransactionAmount() {
  return parseFloat((Math.random() * 100).toFixed(2));
}

export function getTransactionTime() {
    return new Date().getTime();
}
