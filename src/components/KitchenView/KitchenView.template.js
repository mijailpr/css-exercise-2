export const getOrderItemTemplate = (snack, item) => `
    <div class="order-item ${item.delivered ? 'delivered' : ''}" 
         data-item-status="${item.delivered ? 'delivered' : 'pending'}">
        <div class="item-info">
            <div class="item-icon" title="${snack.name}">${snack.image}</div>
            <div class="item-details">
                <span class="item-name">${snack.name}</span>
                <span class="item-quantity">Cantidad: ${item.quantity}</span>
            </div>
        </div>
        <button class="btn btn-success deliver-item" 
                data-item-id="${item.id}"
                data-tooltip="${item.delivered ? 'Ya entregado' : 'Marcar como entregado'}">
            ${item.delivered ? '✓' : '→'}
        </button>
    </div>
`

export const getOrderCardTemplate = (order, snacks) => `
    <div class="order-card" data-order-id="${order.id}">
        <div class="order-header">
            <div class="order-info">
                <span class="room-badge">Sala ${order.roomId}</span>
                <span class="order-number">#${order.id}</span>
            </div>
            <div class="order-meta">
                <span class="order-time">⏰ ${formatTime(order.timestamp)}</span>
            </div>
        </div>
        <div class="order-items">
            ${order.items.map(item => {
    const snack = snacks.find(s => s.id === item.snackId);
    return getOrderItemTemplate(snack, item);
}).join('')}
        </div>
        <div class="order-actions">
            <button class="btn btn-success deliver-all">
                <span class="button-icon">✓</span>
                <span class="button-text">Entregar Todo</span>
            </button>
        </div>
    </div>
`

export const getKitchenLayoutTemplate = (pendingOrders, completedOrders) => `
    <div class="kitchen-header">
        <h2>🏪 TanyPlay - Cocina</h2>
        <div class="kitchen-stats">
            <span class="stat-item" title="Órdenes pendientes">
                🔥 ${pendingOrders.length} pendientes
            </span>
            <span class="stat-item" title="Órdenes completadas">
                ✓ ${completedOrders.length} completadas
            </span>
        </div>
    </div>
    <div class="orders-section">
        <div class="pending-orders">
            <h3>Órdenes Pendientes</h3>
            <div class="orders-container pending"></div>
        </div>
        <div class="completed-orders">
            <h3>Órdenes Completadas</h3>
            <div class="orders-container completed"></div>
        </div>
    </div>
`

export const getSnacksViewTemplate = (snacks, pendingOrders) => {
    // Dividir las órdenes en columnas
    const numColumns = 3;
    const columns = Array.from({ length: numColumns }, (_, i) =>
        pendingOrders.filter((_, index) => index % numColumns === i)
    );

    return `
    <div class="pending-orders">
        <h3 id="pendingOrdersTitle">📋 Órdenes por Entregar (${pendingOrders.length})</h3>
        <div class="orders-list" id="pendingOrdersList">
                ${columns.map(column => `
                    <div class="orders-list-column">
                        ${column.map(order => getOrderCardTemplate(order, snacks)).join('')}
                    </div>
                `).join('')}
        </div>
    </div>

    <section class="snacks-section">
        <h3 class="section-title" id="snacksTitle">
            <span class="title-icon">🏷️</span>
            <span class="title-text">Lista de Precios de Productos</span>
        </h3>
        <div class="snacks-menu">
            <div class="snacks-grid">
                ${snacks.map(snack => `
                    <div class="snack-item">
                        <div class="snack-icon" title="${snack.name}" aria-label="${snack.name}">
                            ${snack.image}
                        </div>
                        <div class="snack-details">
                            <span class="snack-name">${snack.name}</span>
                            <span class="snack-price">
                                <span class="currency">$</span>${snack.price}
                            </span>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    </section>
`}

function getOrderProgress(order) {
    const total = order.items.length;
    const delivered = order.items.filter(item => item.delivered).length;
    const percentage = Math.round((delivered / total) * 100);

    return `
        <div class="progress-indicator" title="${percentage}% completado">
            <div class="progress-bar" style="width: ${percentage}%"></div>
            <span class="progress-text">${delivered}/${total}</span>
        </div>
    `;
}

function formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMinutes = Math.floor((now - date) / 60000);

    if (diffMinutes < 60) {
        return `Hace ${diffMinutes} min`;
    }

    return date.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit'
    });
}