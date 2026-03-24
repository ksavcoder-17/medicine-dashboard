const firebaseConfig = {
  apiKey: "AIzaSyAbyPNyf8f9uZdEEwNGkiKqXrmPNnedQm4",
  databaseURL: "https://medicine-remainder-60e59-default-rtdb.asia-southeast1.firebasedatabase.app/"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

let allDataArray = []; // store all data globally
const tableBody = document.getElementById("tableBody");

// Listen for medicine logs
db.ref("medicine_logs").on("value", (snapshot) => {
  const data = snapshot.val();
  console.log("Firebase snapshot:", data);
  tableBody.innerHTML = "";

  if (!data) {
    tableBody.innerHTML = `<tr><td colspan="4">No data found</td></tr>`;
    allDataArray = [];
    return;
  }

  // Convert object to array and sort by date
  allDataArray = Object.keys(data).map(key => ({
    key: key,
    ...data[key]
  }));

  allDataArray.sort((a, b) => {
    const [dayA, monthA, yearA] = a.date.split("/").map(Number);
    const [dayB, monthB, yearB] = b.date.split("/").map(Number);
    return (yearA * 10000 + monthA * 100 + dayA) - (yearB * 10000 + monthB * 100 + dayB);
  });

  displayTable(allDataArray);
});

// Display table rows
function displayTable(dataArray) {
  tableBody.innerHTML = "";
  if (dataArray.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="4">No data found</td></tr>`;
    return;
  }

  dataArray.forEach(row => {
    const statusClass = row.status === "Taken" ? "taken" : "missed";
    tableBody.innerHTML += `
      <tr>
        <td>${row.date}</td>
        <td>${row.medicine_name}</td>
        <td>${row.scheduled_time}</td>
        <td class="${statusClass}">${row.status}</td>
      </tr>
    `;
  });
}

// Filter by date
document.getElementById("filterDate").addEventListener("change", (e) => {
  const selected = e.target.value; // format YYYY-MM-DD
  if (!selected) {
    displayTable(allDataArray);
    return;
  }

  const filtered = allDataArray.filter(row => {
    const [day, month, year] = row.date.split("/").map(n => n.padStart(2, "0"));
    const rowDate = `${year}-${month}-${day}`;
    return rowDate === selected;
  });

  displayTable(filtered);
});

// Clear filter button
function clearFilter() {
  document.getElementById("filterDate").value = "";
  displayTable(allDataArray);
}