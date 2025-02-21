import './GroupSelection.css'
import { getGroupSelectionTemplate } from './GroupSelection.template'
import { SnackSelection } from '../SnackSelection/SnackSelection'
import { pendingOrders, snacks } from '../../../../data/gameRooms'

export function GroupSelection({ room, onConfirm, onCancel }) {
    const container = document.createElement('div')
    container.className = 'group-selection-modal'
    let selectedSnacks = new Map()

    // Determinar si estamos editando un grupo existente
    const isEditingGroup = room.currentGroup !== null

    const calculateTicketTotal = (groupSize) => {
        return room.price * groupSize
    }

    const calculateSnacksTotal = () => {
        let total = 0
        selectedSnacks.forEach(snack => {
            total += snack.price * snack.quantity
        })
        return total
    }

    const updateTotals = () => {
        const groupSize = parseInt(container.querySelector('#groupSize').value)
        const ticketTotal = calculateTicketTotal(groupSize)
        const snacksTotal = calculateSnacksTotal()
        const grandTotal = ticketTotal + snacksTotal

        container.querySelector('#ticketTotal').textContent = `$${ticketTotal}`
        container.querySelector('#snacksTotal').textContent = `$${snacksTotal}`
        container.querySelector('#grandTotal').textContent = `$${grandTotal}`
    }

    const getTimeElapsed = (startTime) => {
        const diff = Date.now() - startTime
        const minutes = Math.floor(diff / 60000)
        const hours = Math.floor(minutes / 60)
        return hours > 0
            ? `${hours}h ${minutes % 60}m`
            : `${minutes}m`
    }

    const render = () => {
        container.innerHTML = getGroupSelectionTemplate(room, isEditingGroup)
        setupEventListeners()

        // Si estamos editando un grupo existente, establecer el tamaño del grupo
        if (isEditingGroup) {
            container.querySelector('#groupSize').value = room.currentGroup.size

            // Cargar los snacks del pedido actual si existen
            const currentOrder = pendingOrders.find(order => order.roomId === room.id)
            if (currentOrder) {
                currentOrder.items.forEach(item => {
                    const snack = snacks.find(s => s.id === item.snackId)
                    if (snack) {
                        selectedSnacks.set(item.snackId, {
                            ...snack,
                            quantity: item.quantity
                        })
                    }
                })
            }
        }

        updateSelectedSnacksList()
        updateTotals()
    }

    const setupEventListeners = () => {
        const input = container.querySelector('#groupSize')
        const decrease = container.querySelector('#decreaseSize')
        const increase = container.querySelector('#increaseSize')

        decrease.addEventListener('click', () => {
            const current = parseInt(input.value)
            if (current > 1) {
                input.value = current - 1
                updateTotals()
            }
        })

        increase.addEventListener('click', () => {
            const current = parseInt(input.value)
            if (current < 4) {
                input.value = current + 1
                updateTotals()
            }
        })

        container.querySelector('.modal-close').addEventListener('click', onCancel)
        container.querySelector('#addSnacksBtn').addEventListener('click', handleAddSnacks)

        // Manejar el botón de Cancelar/Guardar
        container.querySelector('#cancelCheckin').addEventListener('click', () => {
            if (isEditingGroup) {
                // Si estamos editando, guardar cambios
                const groupSize = parseInt(container.querySelector('#groupSize').value)
                onConfirm(groupSize, selectedSnacks, false) // false indica que solo guardamos
            } else {
                // Si no estamos editando, cancelar
                onCancel()
            }
        })

        container.querySelector('#confirmCheckin').addEventListener('click', () => {
            const groupSize = parseInt(container.querySelector('#groupSize').value)
            if (isEditingGroup) {
                // Si estamos en modo edición y es Finalizar Grupo, terminamos directamente
                onConfirm(groupSize, selectedSnacks, true)
            } else {
                // Si es una nueva sesión
                onConfirm(groupSize, selectedSnacks, false)
            }
        })
    }

    const calculateTotal = (groupSize) => {
        const ticketTotal = calculateTicketTotal(groupSize)
        const snacksTotal = calculateSnacksTotal()
        return {
            ticketTotal,
            snacksTotal
        }
    }

    const handleAddSnacks = (e) => {
        e.preventDefault()
        e.stopPropagation()

        const modalOverlay = document.createElement('div')
        modalOverlay.className = 'modal-overlay nested'

        const snacksContainer = document.createElement('div')
        snacksContainer.className = 'modal'

        const snackSelection = new SnackSelection({
            initialSnacks: new Map(selectedSnacks),
            onConfirm: (snacks) => {
                selectedSnacks = new Map(snacks)
                updateSelectedSnacksList()
                updateTotals()
                document.body.removeChild(modalOverlay)
            },
            onCancel: () => {
                document.body.removeChild(modalOverlay)
            }
        })

        snacksContainer.appendChild(snackSelection)
        modalOverlay.appendChild(snacksContainer)
        document.body.appendChild(modalOverlay)
    }

    const updateSelectedSnacksList = () => {
        const list = container.querySelector('#selectedSnacksList')

        if (selectedSnacks.size === 0) {
            list.innerHTML = '<p class="no-snacks-message">No hay snacks seleccionados</p>'
            return
        }

        list.innerHTML = Array.from(selectedSnacks.values())
            .map(snack => `
                <div class="selected-snack-item">
                    <span class="selected-snack-info">
                        <span class="selected-snack-icon">${snack.image}</span>
                        <span class="selected-snack-details">
                            <span class="selected-snack-name">${snack.name}</span>
                            <span class="selected-snack-price">$${snack.price} x${snack.quantity}</span>
                        </span>
                    </span>
                    <span class="quantity">$${snack.price * snack.quantity}</span>
                </div>
            `).join('')
    }

    render()
    return container
}