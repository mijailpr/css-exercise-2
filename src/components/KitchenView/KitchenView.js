import './KitchenView.css'
import { pendingOrders, completedOrders, snacks } from '../../data/gameRooms'
import { getSnacksViewTemplate, getOrderCardTemplate } from './KitchenView.template'

/**
 * Kitchen View Component
 * Manages the kitchen orders interface, including order delivery and status updates
 * @returns {HTMLElement} The kitchen view container element
 */
export function KitchenView() {
    const container = document.createElement('div')
    container.className = 'kitchen-view'
    container.innerHTML = getSnacksViewTemplate(snacks, pendingOrders)

    /**
     * Handles custom scrollbar functionality for the orders list
     * Implements draggable thumb and scroll synchronization
     */
    function setupCustomScrollbar() {
        const ordersList = container.querySelector('.orders-list')
        const scrollbarThumb = container.querySelector('.scrollbar-thumb')
        const scrollContainer = container.querySelector('.scroll-container')

        if (!ordersList || !scrollbarThumb || !scrollContainer) return

        const updateThumbWidth = () => {
            const scrollRatio = ordersList.clientWidth / ordersList.scrollWidth
            scrollbarThumb.style.width = `${scrollRatio * 100}%`
        }

        ordersList.addEventListener('scroll', () => {
            const scrollRatio = ordersList.scrollLeft / (ordersList.scrollWidth - ordersList.clientWidth)
            const maxScrollLeft = scrollContainer.clientWidth - scrollbarThumb.clientWidth
            scrollbarThumb.style.transform = `translateX(${scrollRatio * maxScrollLeft}px)`
        })

        // Hacer draggable el thumb del scrollbar
        let isDragging = false
        let startX
        let scrollLeft

        scrollbarThumb.addEventListener('mousedown', (e) => {
            isDragging = true
            startX = e.pageX - scrollbarThumb.offsetLeft
            scrollbarThumb.style.cursor = 'grabbing'
        })

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return

            e.preventDefault()
            const x = e.pageX - startX
            const maxScroll = scrollContainer.clientWidth - scrollbarThumb.clientWidth
            const boundedX = Math.max(0, Math.min(x, maxScroll))
            const scrollRatio = boundedX / maxScroll

            ordersList.scrollLeft = scrollRatio * (ordersList.scrollWidth - ordersList.clientWidth)
            scrollbarThumb.style.transform = `translateX(${boundedX}px)`
        })

        document.addEventListener('mouseup', () => {
            isDragging = false
            scrollbarThumb.style.cursor = 'grab'
        })

        updateThumbWidth()
        window.addEventListener('resize', updateThumbWidth)
    }

    /**
     * Updates the orders list UI with current pending orders
     * Manages order display and status indicators
     */
    function updateOrdersList() {
        const pendingList = container.querySelector('#pendingOrdersList')
        const pendingTitle = container.querySelector('#pendingOrdersTitle')

        pendingTitle.textContent = `📋 Órdenes por Entregar (${pendingOrders.length})`
        pendingList.innerHTML = pendingOrders.map(order =>
            getOrderCardTemplate(order, snacks)
        ).join('') || '<div class="no-orders">🎮 No hay órdenes pendientes</div>'

        setupOrderActions()
        setupCustomScrollbar()
    }

    function setupOrderActions() {
        container.querySelectorAll('.deliver-item').forEach(button => {
            button.addEventListener('click', (e) => {
                const orderId = e.target.closest('.order-card').dataset.orderId
                const itemId = e.target.dataset.itemId
                deliverItem(orderId, itemId)
                updateOrdersList()
                updateRoomsIfVisible()
            })
        })

        container.querySelectorAll('.deliver-all').forEach(button => {
            button.addEventListener('click', (e) => {
                const orderId = e.target.closest('.order-card').dataset.orderId
                deliverOrder(orderId)
                updateOrdersList()
                updateRoomsIfVisible()
            })
        })
    }

    /**
     * Marks an individual item as delivered within an order
     * @param {string} orderId - The ID of the order containing the item
     * @param {string} itemId - The ID of the item to mark as delivered
     */
    function deliverItem(orderId, itemId) {
        const orderIndex = pendingOrders.findIndex(o => o.id === parseInt(orderId))
        if (orderIndex === -1) return

        const order = pendingOrders[orderIndex]
        const itemIndex = order.items.findIndex(i => i.id === parseInt(itemId))
        if (itemIndex === -1) return

        order.items[itemIndex].delivered = true

        if (order.items.every(item => item.delivered)) {
            completedOrders.push(order)
            pendingOrders.splice(orderIndex, 1)
        }
    }

    /**
     * Marks all items in an order as delivered
     * @param {string} orderId - The ID of the order to complete
     */
    function deliverOrder(orderId) {
        const orderIndex = pendingOrders.findIndex(o => o.id === parseInt(orderId))
        if (orderIndex === -1) return

        const order = pendingOrders[orderIndex]
        order.items.forEach(item => item.delivered = true)
        completedOrders.push(order)
        pendingOrders.splice(orderIndex, 1)
    }

    function updateRoomsIfVisible() {
        const roomsContainer = document.getElementById('roomsContainer')
        if (roomsContainer && roomsContainer.classList.contains('active')) {
            const rooms = document.querySelectorAll('.room-card')
            rooms.forEach(roomCard => {
                const roomId = parseInt(roomCard.querySelector('.room-id').textContent.split(' ')[1])
                const room = window.rooms.find(r => r.id === roomId)
                if (room) {
                    updateRoomCard(room, roomCard)
                }
            })
        }
    }

    setupCustomScrollbar()
    updateOrdersList()
    return container
}