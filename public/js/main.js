// Funções auxiliares gerais
console.log('🌸 GlowRoutine carregado');

// Drag and Drop para rotina
let draggedElement = null;

function setupDragAndDrop() {
  const draggables = document.querySelectorAll('[draggable="true"]');
  const dropZones = document.querySelectorAll('.drop-zone');

  draggables.forEach(draggable => {
    draggable.addEventListener('dragstart', (e) => {
      draggedElement = draggable;
      draggable.style.opacity = '0.5';
      e.dataTransfer.effectAllowed = 'move';
    });

    draggable.addEventListener('dragend', (e) => {
      draggable.style.opacity = '1';
    });
  });

  dropZones.forEach(zone => {
    zone.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      zone.style.backgroundColor = 'rgba(232, 165, 194, 0.1)';
    });

    zone.addEventListener('dragleave', (e) => {
      zone.style.backgroundColor = '';
    });

    zone.addEventListener('drop', (e) => {
      e.preventDefault();
      zone.style.backgroundColor = '';
      if (draggedElement) {
        zone.appendChild(draggedElement);
        draggedElement = null;
        updateRoutineOrder();
      }
    });
  });
}

function updateRoutineOrder() {
  const morningZone = document.getElementById('morningZone');
  const nightZone = document.getElementById('nightZone');

  if (morningZone) {
    const morningProducts = Array.from(morningZone.querySelectorAll('[data-product-id]')).map(el => ({
      id: el.dataset.productId,
      name: el.dataset.productName,
      category: el.dataset.category,
    }));

    const nightProducts = Array.from(nightZone.querySelectorAll('[data-product-id]')).map(el => ({
      id: el.dataset.productId,
      name: el.dataset.productName,
      category: el.dataset.category,
    }));

    // Salvar no localStorage
    localStorage.setItem('routineOrder', JSON.stringify({
      morning: morningProducts,
      night: nightProducts,
    }));
  }
}

// Inicializar ao carregar
document.addEventListener('DOMContentLoaded', () => {
  setupDragAndDrop();
});

// Notificações
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#2196f3'};
    color: white;
    padding: 15px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 1000;
    animation: slideIn 0.3s ease-out;
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-out';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Adicionar estilos de animação
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);
