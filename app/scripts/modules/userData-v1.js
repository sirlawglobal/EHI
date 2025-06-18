// app/scripts/modules/userData.js

import { generateTable } from "../components/table-v1.js";

const data = [
  {
    id: 4,
    date: "2022-04-05",
    "s/n": "1004",
    image: "https://picsum.photos/23",
    last_name: "Williams",
    first_name: "Sarah",
    location: "Houston",
    poverty_status: "Own",
    pin: "456789",
    score: 28,
  },
  {
    id: 5,
    date: "2022-05-20",
    "s/n": "1005",
    image: "https://picsum.photos/24",
    last_name: "Brown",
    first_name: "David",
    location: "Phoenix",
    poverty_status: "Rent",
    pin: "567890",
    score: 12,
  },
  {
    id: 6,
    date: "2022-06-12",
    "s/n": "1006",
    image: "https://picsum.photos/25",
    last_name: "Jones",
    first_name: "Emily",
    location: "Philadelphia",
    poverty_status: "Own",
    pin: "678901",
    score: 19,
  },
  {
    id: 7,
    date: "2022-07-08",
    "s/n": "1007",
    image: "https://picsum.photos/26",
    last_name: "Garcia",
    first_name: "Robert",
    location: "San Antonio",
    poverty_status: "Rent",
    pin: "789012",
    score: 21,
  },
  {
    id: 8,
    date: "2022-08-30",
    "s/n": "1008",
    image: "https://picsum.photos/27",
    last_name: "Miller",
    first_name: "Jennifer",
    location: "San Diego",
    poverty_status: "Own",
    pin: "890123",
    score: 25,
  },
  {
    id: 9,
    date: "2022-09-17",
    "s/n": "1009",
    image: "https://picsum.photos/28",
    last_name: "Davis",
    first_name: "Thomas",
    location: "Dallas",
    poverty_status: "Rent",
    pin: "901234",
    score: 14,
  },
  {
    id: 10,
    date: "2022-10-05",
    "s/n": "1010",
    image: "https://picsum.photos/29",
    last_name: "Rodriguez",
    first_name: "Jessica",
    location: "San Jose",
    poverty_status: "Own",
    pin: "012345",
    score: 30,
  },
];
export function initUserData() {
  // This will automatically:
  // 1. Detect it's the "users" page
  // 2. Use the correct configuration
  // 3. Generate the appropriate table
  generateTable("Users", {
    customData: data,
  });

  // In production, you would:
  // 1. Fetch real data
  // 2. Then call generateTable with the data
  // Example:
  /*
  fetch('/api/users')
    .then(response => response.json())
    .then(data => {
      generateTable("Users", {
        customData: data,
        containerId: "custom-table-container" // Optional
      });
    });
  */
}
