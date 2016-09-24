function main() {
  handleRealtor();
  handleCrebTools();
}

function handleCrebTools() {
  // Returns "523/Monthly so need to split"
  const condo_fee_el = _getCrebLabelValue('label d1240m16', 'Condo Fee')
  if (!condo_fee_el) {
    console.log('Unable to find condo fee element, exiting.');
    return;
  }
  const condo_fee = condo_fee_el[0].textContent.split('/')[0];
  const sqft = _getCrebLabelValue('label d1240m16', 'Reg Size')[1].textContent.replace(',', '');
  const price_el = _getCrebLabelValue('label d1240m16', 'LP:')[0];
  const price = price_el.textContent.trim().replace('$', '').replace(',', '');

  // Update DOM
  const metrics = getMetricElements(price, condo_fee, sqft);
  const metrics_el = `<div style="font-size: 11px">(${getMetricElements(price, condo_fee, sqft).join(', ')})</div>`;
  document.getElementsByClassName('formula field d1240m15')[1].innerHTML = metrics_el;
}

function _getCrebLabelValue(label_class, label_text) {
  let el = document.getElementsByClassName(label_class);
  return Array.prototype.filter.call(el, x => (x.textContent.search(label_text) > -1))[0]
    .parentElement.nextElementSibling.children;
}

function handleRealtor() {
  const price_el = document.getElementById("m_property_dtl_info_hdr_price");
  if (!price_el) return;
  const price = price_el
    .textContent
    .trim().split(' ')[0].trim() // To handle cases where the extension has already run on this page
    .split('$')[1].replace(',', '');
  const condo_fees_el = document.getElementById("m_property_dtl_data_val_monthlymaintenancefees");
  let condo_fees = 0;
  if (condo_fees_el) {
    condo_fees = +condo_fees_el
      .textContent
      .replace(',', '')
      .split('$')[1]
      .split(' Monthly')[0];
  }
  const sqft = +document.getElementById("m_property_dtl_blddata_val_interiorfloorspace")
    .textContent
    .split(' sqft')[0];

  const fee_per_sqft = (condo_fees / sqft).toFixed(2);

  // Update DOM
  if (condo_fees_el) {
    condo_fees_el.innerHTML += ` <font color="blue">($${fee_per_sqft}/sqft)</font>`;
  }
  price_el.innerHTML += ` (${getMetricElements(price, condo_fees, sqft).join(', ')})`;
}

function getMetricElements(price, fee, sqft) {
  const fee_per_sqft = (fee / sqft).toFixed(2);
  const price_per_sqft = Math.round(price / sqft);
  return [
    `<font color="blue">Price: $${price_per_sqft}/sqft</font>`,
    `<font color="dodgerblue">Fees: $${fee_per_sqft}/sqft</font>`,
    `<font color="deepskyblue">Size: ${sqft} sqft</font>`
  ];
}

main();
setInterval(function() {
  handleCrebTools();
}, 1000);
