import { calculateMoneyBalances } from './client-movement-balance'

describe('calculateMoneyBalances', () => {
  it('shows the debt immediately after each money movement', () => {
    const balances = calculateMoneyBalances(700, [
      {
        id: 1,
        direction: 'OUT',
        moneyAmount: 1000,
      },
      {
        id: 2,
        direction: 'IN',
        moneyAmount: 300,
      },
    ])

    expect(balances.get(1)).toBe(1000)
    expect(balances.get(2)).toBe(700)
  })

  it('keeps a legacy opening debt that predates movement history', () => {
    const balances = calculateMoneyBalances(1200, [
      {
        id: 1,
        direction: 'OUT',
        moneyAmount: 500,
      },
      {
        id: 2,
        direction: 'IN',
        moneyAmount: 100,
      },
    ])

    expect(balances.get(1)).toBe(1300)
    expect(balances.get(2)).toBe(1200)
  })

  it('does not change the money balance for a tare-only movement', () => {
    const balances = calculateMoneyBalances(250, [
      {
        id: 1,
        direction: 'IN',
        moneyAmount: 0,
      },
    ])

    expect(balances.get(1)).toBe(250)
  })
})
