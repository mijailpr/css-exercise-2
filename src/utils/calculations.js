export const calculateTotal = (room) => {
    const snacksTotal = room.orders.reduce((sum, order) => {
        return sum + order.items.reduce((itemSum, item) => {
            return itemSum + (item.price * item.quantity)
        }, 0)
    }, 0)

    const roomTotal = room.price * room.currentGroup.people
    return {
        roomTotal,
        snacksTotal,
        total: roomTotal + snacksTotal
    }
}

export const formatCurrency = (amount) => {
    return `$${amount.toFixed(2)}`
}

export const validatePeople = (number) => {
    const people = Number(number)
    return !isNaN(people) && people > 0 && people <= 4
}