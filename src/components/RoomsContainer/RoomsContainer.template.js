import { roomTypes, pendingOrders, snacks } from '../../data/gameRooms'

function getRoomIcon(type) {
    const icons = {
        basic: '🎮',
        intermediate: '🕹️',
        immersive: '🥽'
    };
    return icons[type] || '🎮';
}

export const getRoomTemplate = (room, isOccupied, pendingOrdersCount = 0) => {
    // Calcular el total de órdenes pendientes y el total general
    const orderTotal = pendingOrders
        .filter(order => order.roomId === room.id)
        .reduce((total, order) => {
            return total + order.items.reduce((subtotal, item) => {
                const snack = snacks.find(s => s.id === item.snackId);
                return subtotal + (snack.price * item.quantity);
            }, 0);
        }, 0);

    // Calcular el total incluyendo entrada y snacks
    const ticketTotal = room.currentGroup ? room.price * room.currentGroup.size : 0;
    const totalAmount = ticketTotal + orderTotal;

    return `
    <div class="room-type">
        ${roomTypes[room.type].name}
        <span class="room-id">Sala ${room.id}</span>
    </div>
    <div class="room-info">
        ${!isOccupied ? `
            <div class="room-description">
                <i class="room-icon">${getRoomIcon(room.type)}</i>
                <span>${roomTypes[room.type].description}</span>
            </div>
            <div class="room-price">
                <span class="price-tag">$${roomTypes[room.type].price}</span>
                <span class="price-detail">por persona</span>
            </div>
        ` : `
            <div class="room-orders">
                ${pendingOrdersCount > 0 ? `
                    <div class="pending-orders">
                        <div class="pending-orders-badge">${pendingOrdersCount} orden(es) pendiente(s)</div>
                        <div class="orders-separator"></div>
                        <div class="total-to-pay">Total a pagar: <span class="total-amount">$${totalAmount}</span></div>
                    </div>
                ` : `
                    <div class="pending-orders">
                        <div class="total-to-pay">Total a pagar: <span class="total-amount">$${totalAmount}</span></div>
                    </div>
                `}
            </div>
        `}
    </div>
    <div class="room-status ${isOccupied ? 'status-occupied' : 'status-available'}">
        <div class="status-indicator">
            <span class="status-dot"></span>
            <span>${isOccupied ? 'Ocupada' : 'Disponible'}</span>
        </div>
        <button class="btn btn-primary"
            ${isOccupied ? 'data-action="manage"' : 'data-action="checkin"'}>
            ${isOccupied ? 'Gestionar' : 'Registrar grupo'}
        </button>
    </div>
`}

export const getCheckinModalTemplate = (room) => `
    <div class="modal-content">
        <div class="modal-header">
            <h2>Registrar Grupo - Sala ${room.id}</h2>
            <div class="room-type-badge" data-type="${room.type}">${roomTypes[room.type].name}</div>
        </div>
        
        <div class="form-group">
            <label for="groupSize">Número de personas (máx. 4):</label>
            <div class="input-with-controls">
                <button class="btn-circle" id="decreaseSize">-</button>
                <input type="number" min="1" max="4" value="1" id="groupSize" readonly>
                <button class="btn-circle" id="increaseSize">+</button>
            </div>
        </div>

        <div class="form-group">
            <label>Snacks Iniciales</label>
            <div class="snacks-selection">
                <div class="selected-snacks" id="selectedSnacksList"></div>
                <button class="add-snacks-btn" id="addSnacksBtn">
                    <span>Agregar Snacks</span>
                    <i class="fas fa-plus"></i>
                </button>
            </div>
        </div>

        <div class="modal-actions">
            <button class="btn btn-danger" id="cancelCheckin">Cancelar</button>
            <button class="btn btn-primary" id="confirmCheckin">Confirmar Grupo</button>
        </div>
    </div>
`

export const getManageModalTemplate = (room, activeOrders, timeElapsed, entryCost, consumptionCost) => `
    <div class="modal-content">
        <div class="modal-header">
            <h2>Gestionar Grupo - Sala ${room.id}</h2>
            <div class="room-type-badge" data-type="${room.type}">${roomTypes[room.type].name}</div>
        </div>
        
        <div class="form-group">
            <label for="groupSize">Número de personas (máx. 4):</label>
            <div class="input-with-controls">
                <button class="btn-circle" id="decreaseSize">-</button>
                <input type="number" min="1" max="4" value="${room.currentGroup.size}" id="groupSize" readonly>
                <button class="btn-circle" id="increaseSize">+</button>
            </div>
        </div>

        <div class="form-group">
            <label>Tiempo transcurrido: ${timeElapsed}</label>
        </div>

        <div class="form-group">
            <label>Snacks y Pedidos</label>
            <div class="snacks-selection">
                <div class="active-orders-list">
                    ${activeOrders}
                </div>
                <button class="add-snacks-btn" id="newOrderBtn">
                    <span>Agregar Snacks</span>
                    <i class="fas fa-plus"></i>
                </button>
            </div>
        </div>

        <div class="total-section">
            <h3>Total Actual</h3>
            <p>Entrada: $${entryCost}</p>
            <p>Consumo: $${consumptionCost}</p>
            <p>Total: $${entryCost + consumptionCost}</p>
        </div>

        <div class="modal-actions">
            <button class="btn btn-secondary" id="closeModal">Cerrar</button>
            <button class="btn btn-danger" id="checkoutBtn">Finalizar Sesión</button>
        </div>
    </div>
`