function submitForm() {
  const date = document.getElementById('date').value;
  const manager = document.getElementById('manager').value;
  const checkboxes = document.querySelectorAll('.district:checked');
  
  if (!date || checkboxes.length === 0) {
    alert('Please select date and at least one district.');
    return;
  }

  let entries = [];

  checkboxes.forEach(box => {
    const district = box.value;
    const name = document.getElementById('name_' + district).value;
    const phone = document.getElementById('phone_' + district).value;
    entries.push({ district, name, phone });
  });

  const data = { date, manager, entries };

  // Yeh hai aapka Google Apps Script Web App URL
  const apiUrl = "https://script.google.com/macros/s/YOUR_DEPLOYED_URL/exec";

  fetch(apiUrl, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(() => {
    alert("Data saved successfully");
    location.reload();
  }).catch(err => {
    console.error(err);
    alert("Error while submitting form.");
  });
}
