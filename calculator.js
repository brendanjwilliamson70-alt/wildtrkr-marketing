(() => {
  const DEVICE_PRICE = 200;
  const STANDARD_RATE = 15;
  const RENTAL_BLOCK_PRICE = 500;
  const RENTAL_BLOCK_SIZE = 5;
  const GST_RATE = 0.1;

  const purchaseDiscountRate = (quantity) => {
    if (quantity >= 10) return 0.20;
    if (quantity >= 5) return 0.10;
    return 0;
  };

  const money = new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  const byId = (id) => document.getElementById(id);
  const integer = (value) => Math.max(1, Math.floor(Number(value) || 1));

  function updatePurchase() {
    const quantity = integer(byId('purchase-quantity').value);
    const months = Number(byId('purchase-period').value);
    const hardwareRrp = quantity * DEVICE_PRICE;
    const discountRate = purchaseDiscountRate(quantity);
    const discount = hardwareRrp * discountRate;
    const hardware = hardwareRrp - discount;
    const platform = quantity * STANDARD_RATE * months;
    const subtotal = hardware + platform;
    const gst = subtotal * GST_RATE;

    byId('purchase-quantity').value = quantity;
    byId('purchase-device-count').textContent = quantity;
    byId('purchase-hardware-rrp').textContent = money.format(hardwareRrp);
    byId('purchase-discount-label').textContent = discountRate ? `${Math.round(discountRate * 100)}% quantity discount` : 'Quantity discount';
    byId('purchase-discount').textContent = discount ? `−${money.format(discount)}` : money.format(0);
    byId('purchase-hardware').textContent = money.format(hardware);
    byId('purchase-platform').textContent = money.format(platform);
    byId('purchase-subtotal').textContent = money.format(subtotal);
    byId('purchase-gst').textContent = money.format(gst);
    byId('purchase-total').textContent = money.format(subtotal + gst);
  }

  function updateRental() {
    const blocks = integer(byId('rental-blocks').value);
    const months = Number(byId('rental-period').value);
    const devices = blocks * RENTAL_BLOCK_SIZE;
    const periods = months / 3;
    const subtotal = blocks * periods * RENTAL_BLOCK_PRICE;
    const gst = subtotal * GST_RATE;

    byId('rental-blocks').value = blocks;
    byId('rental-device-count').textContent = devices;
    byId('rental-months').textContent = months;
    byId('rental-subtotal').textContent = money.format(subtotal);
    byId('rental-gst').textContent = money.format(gst);
    byId('rental-total').textContent = money.format(subtotal + gst);
  }

  document.querySelectorAll('[data-purchase-step]').forEach((button) => {
    button.addEventListener('click', () => {
      byId('purchase-quantity').value = integer(byId('purchase-quantity').value) + Number(button.dataset.purchaseStep);
      updatePurchase();
    });
  });

  document.querySelectorAll('[data-rental-step]').forEach((button) => {
    button.addEventListener('click', () => {
      byId('rental-blocks').value = integer(byId('rental-blocks').value) + Number(button.dataset.rentalStep);
      updateRental();
    });
  });

  ['purchase-quantity', 'purchase-period'].forEach((id) => byId(id).addEventListener('input', updatePurchase));
  ['rental-blocks', 'rental-period'].forEach((id) => byId(id).addEventListener('input', updateRental));

  updatePurchase();
  updateRental();
})();
