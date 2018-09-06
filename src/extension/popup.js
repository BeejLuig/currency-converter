const {
  fromCode: fromCodeSelect,
  fromAmount: fromAmountInput,
  toCode: toCodeSelect,
  toAmount: toAmountInput,
} = window;

fromAmountInput.addEventListener('input', async e => {
  const { value: fromAmount } = fromAmountInput;
  const { value: fromCode } = fromCodeSelect;
  const { value: toCode } = toCodeSelect;
  console.log('from:', fromCode);
  console.log('to:', toCode);
  const conversionRate = await fetch(
    `http://localhost:3000/api/v1/currencies/code/${fromCode}`
  )
    .then(res => res.json())
    .then(data => data.currency.convertTo[toCode]);
  console.log('conversion rate:', conversionRate);
  toAmountInput.value = fromAmount * conversionRate;
});
