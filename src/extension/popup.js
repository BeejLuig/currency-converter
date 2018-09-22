const {
  fromCode: fromCodeSelect,
  fromAmount: fromAmountInput,
  toCode: toCodeSelect,
  toAmount: toAmountInput,
} = window;

const formatAmount = amount => (Math.round(100 * amount) / 100).toFixed(2);

[fromCodeSelect, fromAmountInput].forEach(input =>
  input.addEventListener('input', async e => {
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
    toAmountInput.value = formatAmount(fromAmount * conversionRate);
  })
);

[toCodeSelect, toAmountInput].forEach(input =>
  input.addEventListener('input', async e => {
    const { value: fromAmount } = toAmountInput;
    const { value: fromCode } = toCodeSelect;
    const { value: toCode } = fromCodeSelect;
    console.log('from:', fromCode);
    console.log('to:', toCode);
    const conversionRate = await fetch(
      `http://localhost:3000/api/v1/currencies/code/${fromCode}`
    )
      .then(res => res.json())
      .then(data => data.currency.convertTo[toCode]);
    console.log('conversion rate:', conversionRate);
    fromAmountInput.value = formatAmount(fromAmount * conversionRate);
  })
);
