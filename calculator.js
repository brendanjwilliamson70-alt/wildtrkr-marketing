(() => {
  const DEVICE_PRICE = 200;
  const PLATFORM_RATE = 15;
  const GST_RATE = 0.1;

  const purchaseDiscountRate = (quantity) => {
    if (quantity >= 5) return 0.20;
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
    const platform = quantity * PLATFORM_RATE * months;
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

  document.querySelectorAll('[data-purchase-step]').forEach((button) => {
    button.addEventListener('click', () => {
      byId('purchase-quantity').value = integer(byId('purchase-quantity').value) + Number(button.dataset.purchaseStep);
      updatePurchase();
    });
  });

  ['purchase-quantity', 'purchase-period'].forEach((id) => byId(id).addEventListener('input', updatePurchase));

  document.querySelectorAll('[data-quote]').forEach((link) => {
    link.addEventListener('click', () => {
      const summary = `Purchase enquiry: ${byId('purchase-quantity').value} cellular devices, ${byId('purchase-period').value} months of platform access. Estimated total incl. GST: ${byId('purchase-total').textContent}.`;
      document.dispatchEvent(new CustomEvent('wildtrkr:enquiry', { detail: summary }));
    });
  });

  updatePurchase();

})();
