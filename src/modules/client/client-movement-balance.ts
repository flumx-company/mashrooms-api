type MoneyMovement = {
  id: number
  direction: 'OUT' | 'IN'
  moneyAmount: number | string
}

const roundMoney = (value: number): number =>
  Math.round((value + Number.EPSILON) * 100) / 100

/**
 * Восстанавливает долг после каждого движения.
 * Разница между текущим долгом и суммой движений считается начальным долгом
 * (это сохраняет корректность для клиентов, созданных до появления истории).
 */
export function calculateMoneyBalances(
  currentDebt: number,
  movementsInChronologicalOrder: MoneyMovement[],
): Map<number, number> {
  const totalMovementDelta = movementsInChronologicalOrder.reduce(
    (sum, movement) => {
      const amount = Number(movement.moneyAmount) || 0
      return sum + (movement.direction === 'OUT' ? amount : -amount)
    },
    0,
  )
  let balance = roundMoney((Number(currentDebt) || 0) - totalMovementDelta)
  const balances = new Map<number, number>()

  movementsInChronologicalOrder.forEach((movement) => {
    const amount = Number(movement.moneyAmount) || 0
    balance = roundMoney(
      balance + (movement.direction === 'OUT' ? amount : -amount),
    )
    balances.set(movement.id, balance)
  })

  return balances
}
