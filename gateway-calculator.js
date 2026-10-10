(() => {
  const byId = id => document.getElementById(id);
  if (!byId('gateway-quantity')) return;
  const money = new Intl.NumberFormat('en-AU', {style: 'currency', currency: 'AUD'});
  const quantity = (value, minimum) => {
    const number = Number(value);
    return Number.isFinite(number) ? Math.max(minimum, Math.floor(number)) : minimum;
  };
  function update(normalize = false) {
    const gateways = quantity(byId('gateway-quantity').value, 1);
    const packs = quantity(byId('sensor-packs').value, 1);
    const sensors = packs * 5;
    const months = Number(byId('gateway-period').value);
    if (normalize) {
      byId('gateway-quantity').value = gateways;
      byId('sensor-packs').value = packs;
    }
    const gatewayHardware = gateways * 350;
    const sensorHardware = packs * 350;
    byId('sensor-count').textContent = sensors;
    const hardware = gatewayHardware + sensorHardware;
    const monthly = gateways * 30;
    const subscription = monthly * months;
    const subtotal = hardware + subscription;
    const gst = subtotal * 0.1;
    const values = {
      'gateway-hardware': gatewayHardware, 'sensor-hardware': sensorHardware,
      'gateway-upfront': hardware, 'gateway-monthly': monthly,
      'gateway-subscription': subscription, 'gateway-subtotal': subtotal,
      'gateway-gst': gst, 'gateway-total': subtotal + gst
    };
    Object.entries(values).forEach(([id, value]) => { byId(id).textContent = money.format(value); });
    return {gateways, packs, sensors, months, hardware, monthly, total: subtotal + gst};
  }
  ['gateway-quantity', 'sensor-packs', 'gateway-period'].forEach(id => {
    byId(id).addEventListener('input', () => update());
    byId(id).addEventListener('change', () => update(true));
  });
  document.querySelector('[data-gateway-quote]').addEventListener('click', () => {
    const estimate = update(true);
    const summary = `Gateway system enquiry: ${estimate.gateways} Gateway(s), ${estimate.packs} sensor pack(s) (${estimate.sensors} sensors). Upfront hardware ${money.format(estimate.hardware)} excl. GST; monitoring ${money.format(estimate.monthly)}/month excl. GST, sensor monitoring included. Hardware plus ${estimate.months} months monitoring: ${money.format(estimate.total)} incl. GST. Configuration and freight to be confirmed.`;
    document.dispatchEvent(new CustomEvent('wildtrkr:enquiry', {detail: summary}));
  });
  update(true);
})();
