(() => {
  const managerDistricts = {
    "Rohit Kumar": ["Nalanda", "Banka", "Bhagalpur", "Jamui", "Khagaria", "Munger"],
    "Dharmendra Kumar": ["Arwal", "Aurangabad", "Gaya", "Jehanabad", "Sitamarhi", "Sheohar", "Vaishali"],
    "Shalu Kumari": ["Begusarai", "Katihar", "Kishanganj", "Araria", "Nawada", "Purnia"],
    "Rahul Kumar": ["Bhojpur", "Buxar", "Kaimur", "Patna", "Rohtas", "Samastipur"],
    "Vishwanath Singh": ["Darbhanga", "East Champaran", "Madhubani", "West Champaran"],
    "Ritesh Kumar Rohit": ["Gopalganj", "Muzaffarpur", "Saran", "Siwan"],
    "Markandey Shahi": ["Lakhisarai", "Madhepura", "Saharsa", "Sheikhpura", "Supaul"]
  };

  const managerSelect = document.getElementById('manager');
  const districtContainer = document.getElementById('districtCheckboxes');
  const form = document.getElementById('dataForm');
  const msgDiv = document.getElementById('msg');
  const scheduleDateInput = document.getElementById('schedule_date');

  managerSelect.addEventListener('change', () => {
    const selectedManager = managerSelect.value;
    districtContainer.innerHTML = '';

    if (selectedManager && managerDistricts[selectedManager]) {
      managerDistricts[selectedManager].forEach(district => {
        const wrapper = document.createElement('div');
        wrapper.className = 'district-container';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = district;
        checkbox.id = `dist_${district.replace(/\s+/g, '_')}`;

        const label = document.createElement('label');
        label.htmlFor = checkbox.id;
        label.textContent = district;
        label.style.marginRight = '10px';
        label.style.fontWeight = 'bold';
        label.style.color = '#2c3e50';

        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.placeholder = 'Manager Name';
        nameInput.style.display = 'none';
        nameInput.style.marginTop = '5px';

        const phoneInput = document.createElement('input');
        phoneInput.type = 'tel';
        phoneInput.placeholder = '10 Digit Mobile';
        phoneInput.style.display = 'none';
        phoneInput.maxLength = 10;
        phoneInput.pattern = "\\d{10}";
        phoneInput.style.marginTop = '5px';

        // Restrict phone input to 10 digit numbers only
        phoneInput.addEventListener('input', () => {
          phoneInput.value = phoneInput.value.replace(/\D/g, '').slice(0, 10);
        });

        checkbox.addEventListener('change', () => {
          if (checkbox.checked) {
            nameInput.style.display = 'block';
            phoneInput.style.display = 'block';
          } else {
            nameInput.style.display = 'none';
            phoneInput.style.display = 'none';
            nameInput.value = '';
            phoneInput.value = '';
          }
        });

        wrapper.appendChild(checkbox);
        wrapper.appendChild(label);
        wrapper.appendChild(nameInput);
        wrapper.appendChild(phoneInput);
        districtContainer.appendChild(wrapper);
      });
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    msgDiv.textContent = '';

    const scheduleDate = scheduleDateInput.value;
    const manager = managerSelect.value;

    if (!manager) {
      alert("Please select HQ Manager.");
      return;
    }
    if (!scheduleDate) {
      alert("Please select schedule date.");
      return;
    }

    const districtsData = [];
    let validationError = false;

    districtContainer.querySelectorAll('.district-container').forEach(container => {
      const checkbox = container.querySelector('input[type="checkbox"]');
      const name = container.querySelector('input[type="text"]').value.trim();
      const mobile = container.querySelector('input[type="tel"]').value.trim();

      if (checkbox.checked) {
        if (!name || !mobile) {
          alert(`Please fill name and 10 digit mobile for ${checkbox.value}`);
          validationError = true;
          return;
        }
        if (mobile.length !== 10) {
          alert(`Invalid mobile number for ${checkbox.value}. It must be 10 digits.`);
          validationError = true;
          return;
        }
        districtsData.push(`${checkbox.value} (${name}, ${mobile})`);
      }
    });

    if (validationError) return;

    if (districtsData.length === 0) {
      alert("Please select at least one district and fill details.");
      return;
    }

    const data = {
      manager,
      schedule_date: scheduleDate,
      districts: districtsData.join(", ")
    };

    const scriptURL = 'https://script.google.com/macros/s/AKfycbxsz_HL_r75rHHfck_f3YG-iCKgRsSRjNYsSoaUPolCJlXURYfGCOIw0fTKxTICYakaWA/exec';

    try {
      await fetch(scriptURL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      msgDiv.textContent = "✅ Data submitted successfully!";
      msgDiv.style.color = 'green';
      form.reset();
      districtContainer.innerHTML = '';

    } catch (error) {
      msgDiv.textContent = `❌ Error: ${error}`;
      msgDiv.style.color = 'red';
    }
  });
})();
