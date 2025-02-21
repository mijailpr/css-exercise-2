import './RoomsContainer.css'
import { rooms, pendingOrders, snacks } from '../../data/gameRooms'
import { getRoomTemplate } from './RoomsContainer.template'
import { calculateTotal } from '../../utils/calculations'
import { GroupSelection } from './components/GroupSelection/GroupSelection'
import { SnackSelection } from './components/SnackSelection/SnackSelection'

export function RoomsContainer() {
    const container = document.createElement('div')
    container.id = 'roomsContainer'
    container.className = 'rooms-container'

    const showNewOrderModal = (room) => {
        const modal = document.createElement('div')
        modal.className = 'modal'
        document.body.classList.add('modal-open')

        const snackSelection = new SnackSelection({
            initialSnacks: new Map(),
            onConfirm: (selectedSnacks) => {
                if (selectedSnacks.size > 0) {
                    const order = {
                        id: Date.now(),
                        roomId: room.id,
                        timestamp: new Date(),
                        items: Array.from(selectedSnacks.entries()).map(([snackId, snack]) => ({
                            id: Date.now() + Math.random(),
                            snackId,
                            quantity: snack.quantity,
                            delivered: false
                        }))
                    }
                    pendingOrders.push(order)
                }

                document.body.classList.remove('modal-open')
                document.body.removeChild(modal)
                renderRooms()
            },
            onCancel: () => {
                document.body.classList.remove('modal-open')
                document.body.removeChild(modal)
            }
        })

        modal.appendChild(snackSelection)
        document.body.appendChild(modal)
    }

    const handleCheckin = (room) => {
        const modal = document.createElement('div')
        modal.className = 'modal'
        document.body.classList.add('modal-open')

        const groupSelection = new GroupSelection({
            room,
            onConfirm: (groupSize, selectedSnacks) => {
                room.currentGroup = {
                    size: groupSize,
                    startTime: new Date()
                }

                if (selectedSnacks && selectedSnacks.size > 0) {
                    const order = {
                        id: Date.now(),
                        roomId: room.id,
                        timestamp: new Date(),
                        items: Array.from(selectedSnacks.entries()).map(([snackId, snack]) => ({
                            id: Date.now() + Math.random(),
                            snackId,
                            quantity: snack.quantity,
                            delivered: false
                        }))
                    }
                    pendingOrders.push(order)
                }

                document.body.classList.remove('modal-open')
                document.body.removeChild(modal)
                renderRooms()
            },
            onCancel: () => {
                document.body.classList.remove('modal-open')
                document.body.removeChild(modal)
            }
        })

        modal.appendChild(groupSelection)
        document.body.appendChild(modal)
    }

    const handleManage = (room) => {
        const modal = document.createElement('div')
        modal.className = 'modal'
        document.body.classList.add('modal-open')

        const groupSelection = new GroupSelection({
            room,
            onConfirm: (groupSize, selectedSnacks, shouldFinalize = false) => {
                if (shouldFinalize) {
                    // Si estamos finalizando, limpiamos los pedidos y el grupo
                    const roomOrdersIndexes = pendingOrders
                        .map((order, index) => order.roomId === room.id ? index : -1)
                        .filter(index => index !== -1)
                        .reverse()

                    roomOrdersIndexes.forEach(index => {
                        pendingOrders.splice(index, 1)
                    })

                    room.currentGroup = null
                } else {
                    // Si solo estamos guardando cambios
                    room.currentGroup.size = groupSize

                    const currentOrderIndex = pendingOrders.findIndex(order => order.roomId === room.id)
                    const newOrder = {
                        id: Date.now(),
                        roomId: room.id,
                        timestamp: new Date(),
                        items: Array.from(selectedSnacks.entries()).map(([snackId, snack]) => ({
                            id: Date.now() + Math.random(),
                            snackId,
                            quantity: snack.quantity,
                            delivered: false
                        }))
                    }

                    if (currentOrderIndex !== -1) {
                        pendingOrders[currentOrderIndex] = newOrder
                    } else if (selectedSnacks.size > 0) {
                        pendingOrders.push(newOrder)
                    }
                }

                document.body.classList.remove('modal-open')
                document.body.removeChild(modal)
                renderRooms()
            },
            onCancel: () => {
                document.body.classList.remove('modal-open')
                document.body.removeChild(modal)
            }
        })

        modal.appendChild(groupSelection)
        document.body.appendChild(modal)
    }

    const renderRoom = (room) => {
        const roomElement = document.createElement('div')
        roomElement.className = `room-card ${room.type}`
        const isOccupied = room.currentGroup !== null
        const pendingOrdersCount = pendingOrders.filter(order => order.roomId === room.id).length

        roomElement.innerHTML = getRoomTemplate(room, isOccupied, pendingOrdersCount)

        const button = roomElement.querySelector('button')
        button.addEventListener('click', () => {
            if (isOccupied) {
                handleManage(room)
            } else {
                handleCheckin(room)
            }
        })

        return roomElement
    }

    const renderRooms = () => {
        container.innerHTML = ''
        rooms.forEach(room => {
            container.appendChild(renderRoom(room))
        })
    }

    renderRooms()
    return container
}

// Funciones auxiliares
function getTimeElapsed(startTime) {
    const diff = Date.now() - startTime
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)
    return hours > 0
        ? `${hours}h ${minutes % 60}m`
        : `${minutes}m`
}

function renderActiveOrders(room) {
    const activeOrders = pendingOrders.filter(order => order.roomId === room.id)
    if (activeOrders.length === 0) {
        return '<p class="no-orders">No hay pedidos activos</p>'
    }

    return activeOrders.map(order => `
        <div class="order-item">
            <div class="order-header">
                <span>Orden #${order.id}</span>
                <span class="order-time">${new Date(order.timestamp).toLocaleTimeString()}</span>
            </div>
            <div class="order-details">
                ${order.items.map(item => {
        const snack = snacks.find(s => s.id === item.snackId)
        return `
                        <div class="order-detail-item ${item.delivered ? 'delivered' : ''}">
                            <span>${snack.image} ${snack.name} x${item.quantity}</span>
                            <span class="delivery-status">
                                ${item.delivered ? '✓ Entregado' : '⏳ Pendiente'}
                            </span>
                        </div>
                    `
    }).join('')}
            </div>
        </div>
    `).join('')
}