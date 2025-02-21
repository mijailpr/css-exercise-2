import { snacks } from '../../../../data/gameRooms'

export const getSnackSelectionTemplate = (availableSnacks, selectedSnacks) => `
    <div class="modal-content">
        <div class="modal-header">
            <div class="header-left">
                <div class="cart-total ${selectedSnacks.size === 0 ? 'hidden' : ''}">
                    <span>Total:</span>
                    <span class="total-amount">$${Array.from(selectedSnacks.values()).reduce((sum, snack) => sum + (snack.price * snack.quantity), 0)}</span>
                </div>
            </div>
            <div class="header-actions">
                <button class="btn" id="cancelSnacks">Cancelar</button>
                <button class="btn" id="confirmSnacks" ${selectedSnacks.size === 0 ? 'disabled' : ''}>Confirmar</button>
                <button class="close-btn">×</button>
            </div>
        </div>
        
        <div class="modal-body">
            <div class="selected-snacks-panel">
                <h3>Snacks Seleccionados</h3>
                <div class="selected-snacks-list">
                    ${selectedSnacks.size === 0
        ? '<p class="no-snacks-message">No hay snacks seleccionados</p>'
        : Array.from(selectedSnacks.values())
            .map(snack => `
                                <div class="selected-snack-item" data-id="${snack.id}">
                                    <div class="selected-snack-info">
                                        <span class="selected-snack-icon">${snack.image}</span>
                                        <div class="selected-snack-details">
                                            <span class="selected-snack-name">${snack.name}</span>
                                            <span class="selected-snack-price">$${snack.price} × ${snack.quantity}</span>
                                        </div>
                                    </div>
                                </div>
                            `).join('')
    }
                </div>
            </div>
            
            <div class="menu-panel">
                <div class="snacks-grid">
                    ${snacks.map(snack => {
        const selected = selectedSnacks.get(snack.id);
        return `
                            <div class="snack-item ${selected ? 'selected' : ''}" data-id="${snack.id}">
                                <span class="snack-icon">${snack.image}</span>
                                <div class="snack-details">
                                    <span class="snack-name">${snack.name}</span>
                                    <span class="snack-price">$${snack.price}</span>
                                </div>
                                <div class="quantity-controls">
                                    <button class="btn-control decrease">-</button>
                                    <span class="quantity">${selected ? selected.quantity : 0}</span>
                                    <button class="btn-control increase">+</button>
                                </div>
                            </div>
                        `
    }).join('')}
                </div>
            </div>
        </div>
    </div>
`