// app/scripts/modules/userData.js

import { createPaginatedTableManager } from "../utils/paginatedTableManager.js";
import { openModal, closeModal } from "../components/modal.js"; // Import modal functions

// --- Mock Backend Data (Full Dataset for simulation) ---
// This data is here ONLY to simulate a backend.
// In a real application, this array would NOT exist on the frontend.
const MOCK_FULL_DATASET = [
  {
    id: 1,
    pin: "123456",
    image: "https://placehold.co/20x20/FF0000/FFFFFF?text=1",
    biodata: {
      first_name: "John",
      last_name: "Doe",
      age: 30,
      gender: "Male",
      marital_status: "Single",
      dwelling_place: "Rent (2 rooms)",
      economic_activities: "Self-Employed",
      family_support: "High Support",
      education: "University",
      qualification: "B.Sc.",
      date: "2022-01-01",
      email: "john.doe@example.com",
    },
    location: {
      house_number: "123",
      street: "Main St",
      area: "Downtown",
      city: "Capital City",
      state: "State A",
    },
    poverty_status: {
      business_activity: {
        business_nature: "Retail",
        business_size: "Small",
        business_location: "Market",
        daily_income: 5000,
      },
      family: {
        marital_status: "Single", // Family marital status
        children_under_18: 0,
        children_earning: 0,
        spouse_age: "N/A",
        spouse_occupation: "N/A",
      },
      dwelling_place_details: {
        type: "Rent",
        size: "2 rooms",
      },
      nutrition: {
        meal_type: "Rice & Stew",
      },
      health_status: {
        major_illness: "No",
      },
    },
    score: 17,
    id_type_selected: "",
    nin: "",
    drivers_license_number: "",
    drivers_license_issue_date: "",
    drivers_license_expiry_date: "",
    voters_card_number: "",
  },
  {
    id: 2,
    pin: "234567",
    image: "https://placehold.co/20x20/00FF00/000000?text=2",
    biodata: {
      first_name: "Alice",
      last_name: "Smith",
      age: 25,
      gender: "Female",
      marital_status: "Married",
      dwelling_place: "Own (3 rooms)",
      economic_activities: "Fully Employed",
      family_support: "Limited Support",
      education: "Tertiary",
      qualification: "NCE",
      date: "2022-02-15",
      email: "alice.smith@example.com",
    },
    location: {
      house_number: "45",
      street: "Oak Ave",
      area: "Suburb",
      city: "City B",
      state: "State B",
    },
    poverty_status: {
      business_activity: {
        business_nature: "NA",
        business_size: "NA",
        business_location: "NA",
        daily_income: 10000,
      },
      family: {
        marital_status: "Married",
        children_under_18: 1,
        children_earning: 0,
        spouse_age: 28,
        spouse_occupation: "Engineer",
      },
      dwelling_place_details: {
        type: "Own",
        size: "3 rooms",
      },
      nutrition: {
        meal_type: "Beans & Yam",
      },
      health_status: {
        major_illness: "Yes",
      },
    },
    score: 23,
    id_type_selected: "NIN",
    nin: "12345678901",
    drivers_license_number: "",
    drivers_license_issue_date: "",
    drivers_license_expiry_date: "",
    voters_card_number: "",
  },
  {
    id: 3,
    pin: "345678",
    image: "https://placehold.co/20x20/0000FF/FFFFFF?text=3",
    biodata: {
      first_name: "Michael",
      last_name: "Johnson",
      age: 40,
      gender: "Male",
      marital_status: "Widowed",
      dwelling_place: "Rent (1 room)",
      economic_activities: "Unemployed",
      family_support: "No Support",
      education: "Secondary",
      qualification: "WAEC",
      date: "2022-03-10",
      email: "michael.j@example.com",
    },
    location: {
      house_number: "789",
      street: "Pine Ln",
      area: "Ghetto",
      city: "City C",
      state: "State C",
    },
    poverty_status: {
      business_activity: {
        business_nature: "NA",
        business_size: "NA",
        business_location: "NA",
        daily_income: 0,
      },
      family: {
        marital_status: "Widowed",
        children_under_18: 2,
        children_earning: 0,
        spouse_age: "N/A",
        spouse_occupation: "N/A",
      },
      dwelling_place_details: {
        type: "Rent",
        size: "1 room",
      },
      nutrition: {
        meal_type: "Garri",
      },
      health_status: {
        major_illness: "No",
      },
    },
    score: 15,
    id_type_selected: "Driver's License",
    nin: "",
    drivers_license_number: "DL1234567",
    drivers_license_issue_date: "2020-01-01",
    drivers_license_expiry_date: "2025-01-01",
    voters_card_number: "",
  },
  {
    id: 4,
    pin: "456789",
    image: "https://placehold.co/20x20/FFFF00/000000?text=4",
    biodata: {
      first_name: "Sarah",
      last_name: "Williams",
      age: 35,
      gender: "Female",
      marital_status: "Married",
      dwelling_place: "Own (4 rooms)",
      economic_activities: "Fully Employed",
      family_support: "High Support",
      education: "University",
      qualification: "M.Sc.",
      date: "2022-04-05",
      email: "sarah.w@example.com",
    },
    location: {
      house_number: "101",
      street: "Elm St",
      area: "Uptown",
      city: "City D",
      state: "State D",
    },
    poverty_status: {
      business_activity: {
        business_nature: "NA",
        business_size: "NA",
        business_location: "NA",
        daily_income: 15000,
      },
      family: {
        marital_status: "Married",
        children_under_18: 2,
        children_earning: 1,
        spouse_age: 38,
        spouse_occupation: "Doctor",
      },
      dwelling_place_details: {
        type: "Own",
        size: "4 rooms",
      },
      nutrition: {
        meal_type: "Pasta",
      },
      health_status: {
        major_illness: "No",
      },
    },
    score: 28,
    id_type_selected: "Voters Card",
    nin: "",
    drivers_license_number: "",
    drivers_license_issue_date: "",
    drivers_license_expiry_date: "",
    voters_card_number: "VC987654321",
  },
  {
    id: 5,
    pin: "567890",
    image: "https://placehold.co/20x20/FF00FF/FFFFFF?text=5",
    biodata: {
      first_name: "David",
      last_name: "Brown",
      age: 60,
      gender: "Male",
      marital_status: "Divorced",
      dwelling_place: "Rent (1 room)",
      economic_activities: "Retired",
      family_support: "Limited Support",
      education: "Primary",
      qualification: "FSLC",
      date: "2022-05-20",
      email: "david.b@example.com",
    },
    location: {
      house_number: "202",
      street: "Birch Rd",
      area: "Rural",
      city: "Village E",
      state: "State E",
    },
    poverty_status: {
      business_activity: {
        business_nature: "NA",
        business_size: "NA",
        business_location: "NA",
        daily_income: 500,
      },
      family: {
        marital_status: "Divorced",
        children_under_18: 0,
        children_earning: 1,
        spouse_age: "N/A",
        spouse_occupation: "N/A",
      },
      dwelling_place_details: {
        type: "Rent",
        size: "1 room",
      },
      nutrition: {
        meal_type: "Cassava",
      },
      health_status: {
        major_illness: "Yes",
      },
    },
    score: 12,
    id_type_selected: "",
    nin: "",
    drivers_license_number: "",
    drivers_license_issue_date: "",
    drivers_license_expiry_date: "",
    voters_card_number: "",
  },
  {
    id: 6,
    pin: "678901",
    image: "https://placehold.co/20x20/00FFFF/000000?text=6",
    biodata: {
      first_name: "Emily",
      last_name: "Jones",
      age: 28,
      gender: "Female",
      marital_status: "Single",
      dwelling_place: "Own (2 rooms)",
      economic_activities: "Fully Employed",
      family_support: "High Support",
      education: "Tertiary",
      qualification: "HND",
      date: "2022-06-12",
      email: "emily.j@example.com",
    },
    location: {
      house_number: "303",
      street: "Cedar Dr",
      area: "Urban",
      city: "City F",
      state: "State F",
    },
    poverty_status: {
      business_activity: {
        business_nature: "NA",
        business_size: "NA",
        business_location: "NA",
        daily_income: 8000,
      },
      family: {
        marital_status: "Single",
        children_under_18: 0,
        children_earning: 0,
        spouse_age: "N/A",
        spouse_occupation: "N/A",
      },
      dwelling_place_details: {
        type: "Own",
        size: "2 rooms",
      },
      nutrition: {
        meal_type: "Noodles",
      },
      health_status: {
        major_illness: "No",
      },
    },
    score: 19,
    id_type_selected: "NIN",
    nin: "98765432109",
    drivers_license_number: "",
    drivers_license_issue_date: "",
    drivers_license_expiry_date: "",
    voters_card_number: "",
  },
  {
    id: 7,
    pin: "789012",
    image: "https://placehold.co/20x20/F0F0F0/000000?text=7",
    biodata: {
      first_name: "Robert",
      last_name: "Garcia",
      age: 45,
      gender: "Male",
      marital_status: "Married",
      dwelling_place: "Rent (3 rooms)",
      economic_activities: "Self-Employed",
      family_support: "Limited Support",
      education: "Secondary",
      qualification: "GCE",
      date: "2022-07-08",
      email: "robert.g@example.com",
    },
    location: {
      house_number: "404",
      street: "Maple Ave",
      area: "Suburban",
      city: "City G",
      state: "State G",
    },
    poverty_status: {
      business_activity: {
        business_nature: "Services",
        business_size: "Medium",
        business_location: "Online",
        daily_income: 7000,
      },
      family: {
        marital_status: "Married",
        children_under_18: 3,
        children_earning: 0,
        spouse_age: 42,
        spouse_occupation: "Teacher",
      },
      dwelling_place_details: {
        type: "Rent",
        size: "3 rooms",
      },
      nutrition: {
        meal_type: "Amala",
      },
      health_status: {
        major_illness: "No",
      },
    },
    score: 21,
    id_type_selected: "Driver's License",
    nin: "",
    drivers_license_number: "DL7654321",
    drivers_license_issue_date: "2021-03-15",
    drivers_license_expiry_date: "2026-03-15",
    voters_card_number: "",
  },
  {
    id: 8,
    pin: "890123",
    image: "https://placehold.co/20x20/C0C0C0/000000?text=8",
    biodata: {
      first_name: "Jennifer",
      last_name: "Miller",
      age: 33,
      gender: "Female",
      marital_status: "Single",
      dwelling_place: "Own (2 rooms)",
      economic_activities: "Fully Employed",
      family_support: "High Support",
      education: "University",
      qualification: "B.A.",
      date: "2023-08-30",
      email: "jennifer.m@example.com",
    },
    location: {
      house_number: "505",
      street: "Willow St",
      area: "Downtown",
      city: "City H",
      state: "State H",
    },
    poverty_status: {
      business_activity: {
        business_nature: "NA",
        business_size: "NA",
        business_location: "NA",
        daily_income: 9000,
      },
      family: {
        marital_status: "Single",
        children_under_18: 0,
        children_earning: 0,
        spouse_age: "N/A",
        spouse_occupation: "N/A",
      },
      dwelling_place_details: {
        type: "Own",
        size: "2 rooms",
      },
      nutrition: {
        meal_type: "Salad",
      },
      health_status: {
        major_illness: "No",
      },
    },
    score: 25,
    id_type_selected: "Voters Card",
    nin: "",
    drivers_license_number: "",
    drivers_license_issue_date: "",
    drivers_license_expiry_date: "",
    voters_card_number: "VC123456789",
  },
  {
    id: 9,
    pin: "901234",
    image: "https://placehold.co/20x20/A0A0A0/FFFFFF?text=9",
    biodata: {
      first_name: "Thomas",
      last_name: "Davis",
      age: 50,
      gender: "Male",
      marital_status: "Married",
      dwelling_place: "Rent (2 rooms)",
      economic_activities: "Unemployed",
      family_support: "No Support",
      education: "Primary",
      qualification: "FSLC",
      date: "2023-09-17",
      email: "thomas.d@example.com",
    },
    location: {
      house_number: "606",
      street: "Poplar Ave",
      area: "Rural",
      city: "Village I",
      state: "State I",
    },
    poverty_status: {
      business_activity: {
        business_nature: "NA",
        business_size: "NA",
        business_location: "NA",
        daily_income: 0,
      },
      family: {
        marital_status: "Married",
        children_under_18: 4,
        children_earning: 1,
        spouse_age: 48,
        spouse_occupation: "Farmer",
      },
      dwelling_place_details: {
        type: "Rent",
        size: "2 rooms",
      },
      nutrition: {
        meal_type: "Akpu",
      },
      health_status: {
        major_illness: "Yes",
      },
    },
    score: 14,
    id_type_selected: "",
    nin: "",
    drivers_license_number: "",
    drivers_license_issue_date: "",
    drivers_license_expiry_date: "",
    voters_card_number: "",
  },
  {
    id: 10,
    pin: "012345",
    image: "https://placehold.co/20x20/808080/FFFFFF?text=10",
    biodata: {
      first_name: "Jessica",
      last_name: "Rodriguez",
      age: 29,
      gender: "Female",
      marital_status: "Single",
      dwelling_place: "Own (1 room)",
      economic_activities: "Fully Employed",
      family_support: "High Support",
      education: "Tertiary",
      qualification: "OND",
      date: "2023-10-05",
      email: "jessica.r@example.com",
    },
    location: {
      house_number: "707",
      street: "Cypress Dr",
      area: "Urban",
      city: "City J",
      state: "State J",
    },
    poverty_status: {
      business_activity: {
        business_nature: "NA",
        business_size: "NA",
        business_location: "NA",
        daily_income: 12000,
      },
      family: {
        marital_status: "Single",
        children_under_18: 0,
        children_earning: 0,
        spouse_age: "N/A",
        spouse_occupation: "N/A",
      },
      dwelling_place_details: {
        type: "Own",
        size: "1 room",
      },
      nutrition: {
        meal_type: "Pizza",
      },
      health_status: {
        major_illness: "No",
      },
    },
    score: 30,
    id_type_selected: "NIN",
    nin: "01234567890",
    drivers_license_number: "",
    drivers_license_issue_date: "",
    drivers_license_expiry_date: "",
    voters_card_number: "",
  },
  {
    id: 11,
    pin: "112233",
    image: "https://placehold.co/20x20/606060/FFFFFF?text=11",
    biodata: {
      first_name: "Chris",
      last_name: "Martinez",
      age: 38,
      gender: "Male",
      marital_status: "Married",
      dwelling_place: "Rent (2 rooms)",
      economic_activities: "Self-Employed",
      family_support: "Limited Support",
      education: "Secondary",
      qualification: "SSCE",
      date: "2023-11-01",
      email: "chris.m@example.com",
    },
    location: {
      house_number: "808",
      street: "Palm Ave",
      area: "Suburban",
      city: "City K",
      state: "State K",
    },
    poverty_status: {
      business_activity: {
        business_nature: "Trade",
        business_size: "Small",
        business_location: "Shop",
        daily_income: 6000,
      },
      family: {
        marital_status: "Married",
        children_under_18: 1,
        children_earning: 0,
        spouse_age: 35,
        spouse_occupation: "Salesperson",
      },
      dwelling_place_details: {
        type: "Rent",
        size: "2 rooms",
      },
      nutrition: {
        meal_type: "Rice",
      },
      health_status: {
        major_illness: "No",
      },
    },
    score: 22,
    id_type_selected: "Driver's License",
    nin: "",
    drivers_license_number: "DL9876543",
    drivers_license_issue_date: "2022-05-20",
    drivers_license_expiry_date: "2027-05-20",
    voters_card_number: "",
  },
  {
    id: 12,
    pin: "445566",
    image: "https://placehold.co/20x20/404040/FFFFFF?text=12",
    biodata: {
      first_name: "Linda",
      last_name: "Hernandez",
      age: 42,
      gender: "Female",
      marital_status: "Married",
      dwelling_place: "Own (3 rooms)",
      economic_activities: "Fully Employed",
      family_support: "High Support",
      education: "University",
      qualification: "Ph.D.",
      date: "2023-12-10",
      email: "linda.h@example.com",
    },
    location: {
      house_number: "909",
      street: "Spruce St",
      area: "Downtown",
      city: "City L",
      state: "State L",
    },
    poverty_status: {
      business_activity: {
        business_nature: "NA",
        business_size: "NA",
        business_location: "NA",
        daily_income: 18000,
      },
      family: {
        marital_status: "Married",
        children_under_18: 2,
        children_earning: 0,
        spouse_age: 45,
        spouse_occupation: "Professor",
      },
      dwelling_place_details: {
        type: "Own",
        size: "3 rooms",
      },
      nutrition: {
        meal_type: "Soup",
      },
      health_status: {
        major_illness: "No",
      },
    },
    score: 18,
    id_type_selected: "Voters Card",
    nin: "",
    drivers_license_number: "",
    drivers_license_issue_date: "",
    drivers_license_expiry_date: "",
    voters_card_number: "VC000111222",
  },
  {
    id: 13,
    pin: "778899",
    image: "https://placehold.co/20x20/202020/FFFFFF?text=13",
    biodata: {
      first_name: "Daniel",
      last_name: "Clark",
      age: 31,
      gender: "Male",
      marital_status: "Single",
      dwelling_place: "Rent (1 room)",
      economic_activities: "Unemployed",
      family_support: "No Support",
      education: "Tertiary",
      qualification: "ND",
      date: "2024-01-01",
      email: "daniel.c@example.com",
    },
    location: {
      house_number: "111",
      street: "Bay Dr",
      area: "Beachfront",
      city: "City M",
      state: "State M",
    },
    poverty_status: {
      business_activity: {
        business_nature: "NA",
        business_size: "NA",
        business_location: "NA",
        daily_income: 0,
      },
      family: {
        marital_status: "Single",
        children_under_18: 0,
        children_earning: 0,
        spouse_age: "N/A",
        spouse_occupation: "N/A",
      },
      dwelling_place_details: {
        type: "Rent",
        size: "1 room",
      },
      nutrition: {
        meal_type: "Sandwich",
      },
      health_status: {
        major_illness: "No",
      },
    },
    score: 20,
    id_type_selected: "",
    nin: "",
    drivers_license_number: "",
    drivers_license_issue_date: "",
    drivers_license_expiry_date: "",
    voters_card_number: "",
  },
  {
    id: 14,
    pin: "001122",
    image: "https://placehold.co/20x20/000000/FFFFFF?text=14",
    biodata: {
      first_name: "Nancy",
      last_name: "Lewis",
      age: 55,
      gender: "Female",
      marital_status: "Widowed",
      dwelling_place: "Own (5 rooms)",
      economic_activities: "Retired",
      family_support: "High Support",
      education: "University",
      qualification: "B.A.",
      date: "2024-02-05",
      email: "nancy.l@example.com",
    },
    location: {
      house_number: "222",
      street: "Mountain Rd",
      area: "Highlands",
      city: "City N",
      state: "State N",
    },
    poverty_status: {
      business_activity: {
        business_nature: "NA",
        business_size: "NA",
        business_location: "NA",
        daily_income: 2000,
      },
      family: {
        marital_status: "Widowed",
        children_under_18: 0,
        children_earning: 2,
        spouse_age: "N/A",
        spouse_occupation: "N/A",
      },
      dwelling_place_details: {
        type: "Own",
        size: "5 rooms",
      },
      nutrition: {
        meal_type: "Vegetables",
      },
      health_status: {
        major_illness: "Yes",
      },
    },
    score: 26,
    id_type_selected: "NIN",
    nin: "23456789012",
    drivers_license_number: "",
    drivers_license_issue_date: "",
    drivers_license_expiry_date: "",
    voters_card_number: "",
  },
  {
    id: 15,
    pin: "334455",
    image: "https://placehold.co/20x20/FF5733/FFFFFF?text=15",
    biodata: {
      first_name: "Paul",
      last_name: "King",
      age: 22,
      gender: "Male",
      marital_status: "Single",
      dwelling_place: "Rent (1 room)",
      economic_activities: "Student",
      family_support: "Limited Support",
      education: "Tertiary",
      qualification: "Diploma",
      date: "2024-03-15",
      email: "paul.k@example.com",
    },
    location: {
      house_number: "333",
      street: "Beacon St",
      area: "College",
      city: "City O",
      state: "State O",
    },
    poverty_status: {
      business_activity: {
        business_nature: "NA",
        business_size: "NA",
        business_location: "NA",
        daily_income: 0,
      },
      family: {
        marital_status: "Single",
        children_under_18: 0,
        children_earning: 0,
        spouse_age: "N/A",
        spouse_occupation: "N/A",
      },
      dwelling_place_details: {
        type: "Rent",
        size: "1 room",
      },
      nutrition: {
        meal_type: "Fast Food",
      },
      health_status: {
        major_illness: "No",
      },
    },
    score: 13,
    id_type_selected: "Driver's License",
    nin: "",
    drivers_license_number: "DL0987654",
    drivers_license_issue_date: "2023-08-01",
    drivers_license_expiry_date: "2028-08-01",
    voters_card_number: "",
  },
  {
    id: 16,
    pin: "667788",
    image: "https://placehold.co/20x20/33FF57/000000?text=16",
    biodata: {
      first_name: "Laura",
      last_name: "Wright",
      age: 39,
      gender: "Female",
      marital_status: "Married",
      dwelling_place: "Own (3 rooms)",
      economic_activities: "Fully Employed",
      family_support: "High Support",
      education: "University",
      qualification: "MBA",
      date: "2024-04-20",
      email: "laura.w@example.com",
    },
    location: {
      house_number: "444",
      street: "Rose Ln",
      area: "Suburb",
      city: "City P",
      state: "State P",
    },
    poverty_status: {
      business_activity: {
        business_nature: "NA",
        business_size: "NA",
        business_location: "NA",
        daily_income: 16000,
      },
      family: {
        marital_status: "Married",
        children_under_18: 1,
        children_earning: 0,
        spouse_age: 40,
        spouse_occupation: "Manager",
      },
      dwelling_place_details: {
        type: "Own",
        size: "3 rooms",
      },
      nutrition: {
        meal_type: "Sushi",
      },
      health_status: {
        major_illness: "No",
      },
    },
    score: 29,
    id_type_selected: "Voters Card",
    nin: "",
    drivers_license_number: "",
    drivers_license_issue_date: "",
    drivers_license_expiry_date: "",
    voters_card_number: "VC333444555",
  },
  {
    id: 17,
    pin: "990011",
    image: "https://placehold.co/20x20/3357FF/FFFFFF?text=17",
    biodata: {
      first_name: "Steven",
      last_name: "Scott",
      age: 48,
      gender: "Male",
      marital_status: "Divorced",
      dwelling_place: "Rent (2 rooms)",
      economic_activities: "Self-Employed",
      family_support: "Limited Support",
      education: "Secondary",
      qualification: "GCE",
      date: "2024-05-25",
      email: "steven.s@example.com",
    },
    location: {
      house_number: "555",
      street: "Strip Blvd",
      area: "Tourist",
      city: "City Q",
      state: "State Q",
    },
    poverty_status: {
      business_activity: {
        business_nature: "Entertainment",
        business_size: "Small",
        business_location: "Casino",
        daily_income: 4000,
      },
      family: {
        marital_status: "Divorced",
        children_under_18: 1,
        children_earning: 0,
        spouse_age: "N/A",
        spouse_occupation: "N/A",
      },
      dwelling_place_details: {
        type: "Rent",
        size: "2 rooms",
      },
      nutrition: {
        meal_type: "Steak",
      },
      health_status: {
        major_illness: "No",
      },
    },
    score: 16,
    id_type_selected: "",
    nin: "",
    drivers_license_number: "",
    drivers_license_issue_date: "",
    drivers_license_expiry_date: "",
    voters_card_number: "",
  },
  {
    id: 18,
    pin: "223344",
    image: "https://placehold.co/20x20/FFFF33/000000?text=18",
    biodata: {
      first_name: "Kimberly",
      last_name: "Green",
      age: 32,
      gender: "Female",
      marital_status: "Married",
      dwelling_place: "Own (4 rooms)",
      economic_activities: "Fully Employed",
      family_support: "High Support",
      education: "University",
      qualification: "B.Ed.",
      date: "2024-06-30",
      email: "kimberly.g@example.com",
    },
    location: {
      house_number: "666",
      street: "Magic Way",
      area: "Resort",
      city: "City R",
      state: "State R",
    },
    poverty_status: {
      business_activity: {
        business_nature: "NA",
        business_size: "NA",
        business_location: "NA",
        daily_income: 11000,
      },
      family: {
        marital_status: "Married",
        children_under_18: 2,
        children_earning: 0,
        spouse_age: 33,
        spouse_occupation: "Teacher",
      },
      dwelling_place_details: {
        type: "Own",
        size: "4 rooms",
      },
      nutrition: {
        meal_type: "Burgers",
      },
      health_status: {
        major_illness: "No",
      },
    },
    score: 24,
    id_type_selected: "NIN",
    nin: "45678901234",
    drivers_license_number: "",
    drivers_license_issue_date: "",
    drivers_license_expiry_date: "",
    voters_card_number: "",
  },
  {
    id: 19,
    pin: "556677",
    image: "https://placehold.co/20x20/FF33FF/FFFFFF?text=19",
    biodata: {
      first_name: "Kevin",
      last_name: "Baker",
      age: 65,
      gender: "Male",
      marital_status: "Widowed",
      dwelling_place: "Rent (1 room)",
      economic_activities: "Retired",
      family_support: "No Support",
      education: "Primary",
      qualification: "FSLC",
      date: "2024-07-01",
      email: "kevin.b@example.com",
    },
    location: {
      house_number: "777",
      street: "Motor City Dr",
      area: "Industrial",
      city: "City S",
      state: "State S",
    },
    poverty_status: {
      business_activity: {
        business_nature: "NA",
        business_size: "NA",
        business_location: "NA",
        daily_income: 300,
      },
      family: {
        marital_status: "Widowed",
        children_under_18: 0,
        children_earning: 0,
        spouse_age: "N/A",
        spouse_occupation: "N/A",
      },
      dwelling_place_details: {
        type: "Rent",
        size: "1 room",
      },
      nutrition: {
        meal_type: "Stew",
      },
      health_status: {
        major_illness: "Yes",
      },
    },
    score: 11,
    id_type_selected: "Driver's License",
    nin: "",
    drivers_license_number: "DL1122334",
    drivers_license_issue_date: "2024-01-01",
    drivers_license_expiry_date: "2029-01-01",
    voters_card_number: "",
  },
  {
    id: 20,
    pin: "889900",
    image: "https://placehold.co/20x20/33FFFF/000000?text=20",
    biodata: {
      first_name: "Michelle",
      last_name: "Adams",
      age: 27,
      gender: "Female",
      marital_status: "Single",
      dwelling_place: "Own (1 room)",
      economic_activities: "Fully Employed",
      family_support: "High Support",
      education: "Tertiary",
      qualification: "B.A.",
      date: "2024-08-05",
      email: "michelle.a@example.com",
    },
    location: {
      house_number: "888",
      street: "Lake St",
      area: "Lakeside",
      city: "City T",
      state: "State T",
    },
    poverty_status: {
      business_activity: {
        business_nature: "NA",
        business_size: "NA",
        business_location: "NA",
        daily_income: 10000,
      },
      family: {
        marital_status: "Single",
        children_under_18: 0,
        children_earning: 0,
        spouse_age: "N/A",
        spouse_occupation: "N/A",
      },
      dwelling_place_details: {
        type: "Own",
        size: "1 room",
      },
      nutrition: {
        meal_type: "Sushi",
      },
      health_status: {
        major_illness: "No",
      },
    },
    score: 27,
    id_type_selected: "Voters Card",
    nin: "",
    drivers_license_number: "",
    drivers_license_issue_date: "",
    drivers_license_expiry_date: "",
    voters_card_number: "VC666777888",
  },
  {
    id: 21,
    pin: "111222",
    image: "https://placehold.co/20x20/FF0000/FFFFFF?text=21",
    biodata: {
      first_name: "Edward",
      last_name: "Wilson",
      age: 34,
      gender: "Male",
      marital_status: "Married",
      dwelling_place: "Rent (2 rooms)",
      economic_activities: "Self-Employed",
      family_support: "Limited Support",
      education: "Secondary",
      qualification: "GCE",
      date: "2024-09-10",
      email: "edward.w@example.com",
    },
    location: {
      house_number: "999",
      street: "Queen City Ave",
      area: "Uptown",
      city: "City U",
      state: "State U",
    },
    poverty_status: {
      business_activity: {
        business_nature: "Construction",
        business_size: "Small",
        business_location: "Client Sites",
        daily_income: 7500,
      },
      family: {
        marital_status: "Married",
        children_under_18: 1,
        children_earning: 0,
        spouse_age: 32,
        spouse_occupation: "Designer",
      },
      dwelling_place_details: {
        type: "Rent",
        size: "2 rooms",
      },
      nutrition: {
        meal_type: "Tacos",
      },
      health_status: {
        major_illness: "No",
      },
    },
    score: 19,
    id_type_selected: "",
    nin: "",
    drivers_license_number: "",
    drivers_license_issue_date: "",
    drivers_license_expiry_date: "",
    voters_card_number: "",
  },
  {
    id: 22,
    pin: "333444",
    image: "https://placehold.co/20x20/00FF00/000000?text=22",
    biodata: {
      first_name: "Patricia",
      last_name: "Moore",
      age: 41,
      gender: "Female",
      marital_status: "Married",
      dwelling_place: "Own (3 rooms)",
      economic_activities: "Fully Employed",
      family_support: "High Support",
      education: "University",
      qualification: "M.A.",
      date: "2024-10-15",
      email: "patricia.m@example.com",
    },
    location: {
      house_number: "1010",
      street: "Capital Blvd",
      area: "Downtown",
      city: "City V",
      state: "State V",
    },
    poverty_status: {
      business_activity: {
        business_nature: "NA",
        business_size: "NA",
        business_location: "NA",
        daily_income: 14000,
      },
      family: {
        marital_status: "Married",
        children_under_18: 2,
        children_earning: 0,
        spouse_age: 43,
        spouse_occupation: "Engineer",
      },
      dwelling_place_details: {
        type: "Own",
        size: "3 rooms",
      },
      nutrition: {
        meal_type: "Curry",
      },
      health_status: {
        major_illness: "No",
      },
    },
    score: 28,
    id_type_selected: "NIN",
    nin: "56789012345",
    drivers_license_number: "",
    drivers_license_issue_date: "",
    drivers_license_expiry_date: "",
    voters_card_number: "",
  },
  {
    id: 23,
    pin: "555666",
    image: "https://placehold.co/20x20/0000FF/FFFFFF?text=23",
    biodata: {
      first_name: "Charles",
      last_name: "Taylor",
      age: 29,
      gender: "Male",
      marital_status: "Single",
      dwelling_place: "Rent (1 room)",
      economic_activities: "Musician",
      family_support: "Limited Support",
      education: "Tertiary",
      qualification: "Diploma",
      date: "2024-11-20",
      email: "charles.t@example.com",
    },
    location: {
      house_number: "1122",
      street: "Music Row",
      area: "Entertainment",
      city: "City W",
      state: "State W",
    },
    poverty_status: {
      business_activity: {
        business_nature: "NA",
        business_size: "NA",
        business_location: "NA",
        daily_income: 2000,
      },
      family: {
        marital_status: "Single",
        children_under_18: 0,
        children_earning: 0,
        spouse_age: "N/A",
        spouse_occupation: "N/A",
      },
      dwelling_place_details: {
        type: "Rent",
        size: "1 room",
      },
      nutrition: {
        meal_type: "BBQ",
      },
      health_status: {
        major_illness: "No",
      },
    },
    score: 15,
    id_type_selected: "Driver's License",
    nin: "",
    drivers_license_number: "DL2233445",
    drivers_license_issue_date: "2023-01-10",
    drivers_license_expiry_date: "2028-01-10",
    voters_card_number: "",
  },
  {
    id: 24,
    pin: "777888",
    image: "https://placehold.co/20x20/FFFF00/000000?text=24",
    biodata: {
      first_name: "Betty",
      last_name: "Anderson",
      age: 50,
      gender: "Female",
      marital_status: "Married",
      dwelling_place: "Own (3 rooms)",
      economic_activities: "Fully Employed",
      family_support: "High Support",
      education: "Secondary",
      qualification: "SSCE",
      date: "2024-12-25",
      email: "betty.a@example.com",
    },
    location: {
      house_number: "1313",
      street: "Jazz St",
      area: "Arts District",
      city: "Kansas City",
      state: "State X",
    },
    poverty_status: {
      business_activity: {
        business_nature: "NA",
        business_size: "NA",
        business_location: "NA",
        daily_income: 9500,
      },
      family: {
        marital_status: "Married",
        children_under_18: 1,
        children_earning: 1,
        spouse_age: 52,
        spouse_occupation: "Accountant",
      },
      dwelling_place_details: {
        type: "Own",
        size: "3 rooms",
      },
      nutrition: {
        meal_type: "Steak",
      },
      health_status: {
        major_illness: "No",
      },
    },
    score: 22,
    id_type_selected: "Voters Card",
    nin: "",
    drivers_license_number: "",
    drivers_license_issue_date: "",
    drivers_license_expiry_date: "",
    voters_card_number: "VC999000111",
  },
  {
    id: 25,
    pin: "999000",
    image: "https://placehold.co/20x20/FF00FF/FFFFFF?text=25",
    biodata: {
      first_name: "George",
      last_name: "Thomas",
      age: 36,
      gender: "Male",
      marital_status: "Single",
      dwelling_place: "Rent (2 rooms)",
      economic_activities: "Military",
      family_support: "Limited Support",
      education: "Tertiary",
      qualification: "Associate",
      date: "2025-01-01",
      email: "george.t@example.com",
    },
    location: {
      house_number: "1414",
      street: "Ocean Blvd",
      area: "Coastal",
      city: "Virginia Beach",
      state: "State Y",
    },
    poverty_status: {
      business_activity: {
        business_nature: "NA",
        business_size: "NA",
        business_location: "NA",
        daily_income: 8000,
      },
      family: {
        marital_status: "Single",
        children_under_18: 0,
        children_earning: 0,
        spouse_age: "N/A",
        spouse_occupation: "N/A",
      },
      dwelling_place_details: {
        type: "Rent",
        size: "2 rooms",
      },
      nutrition: {
        meal_type: "Seafood",
      },
      health_status: {
        major_illness: "No",
      },
    },
    score: 18,
    id_type_selected: "",
    nin: "",
    drivers_license_number: "",
    drivers_license_issue_date: "",
    drivers_license_expiry_date: "",
    voters_card_number: "",
  },
  {
    id: 26,
    pin: "123123",
    image: "https://placehold.co/20x20/00FFFF/000000?text=26",
    biodata: {
      first_name: "Sarah",
      last_name: "Jackson",
      age: 44,
      gender: "Female",
      marital_status: "Married",
      dwelling_place: "Own (4 rooms)",
      economic_activities: "Fully Employed",
      family_support: "High Support",
      education: "University",
      qualification: "B.Sc.",
      date: "2025-01-10",
      email: "sarah.j@example.com",
    },
    location: {
      house_number: "1515",
      street: "Peachtree St",
      area: "Midtown",
      city: "Atlanta",
      state: "State Z",
    },
    poverty_status: {
      business_activity: {
        business_nature: "NA",
        business_size: "NA",
        business_location: "NA",
        daily_income: 13000,
      },
      family: {
        marital_status: "Married",
        children_under_18: 2,
        children_earning: 0,
        spouse_age: 45,
        spouse_occupation: "Software Engineer",
      },
      dwelling_place_details: {
        type: "Own",
        size: "4 rooms",
      },
      nutrition: {
        meal_type: "Grits",
      },
      health_status: {
        major_illness: "No",
      },
    },
    score: 25,
    id_type_selected: "NIN",
    nin: "67890123456",
    drivers_license_number: "",
    drivers_license_issue_date: "",
    drivers_license_expiry_date: "",
    voters_card_number: "",
  },
  {
    id: 27,
    pin: "456456",
    image: "https://placehold.co/20x20/F0F0F0/000000?text=27",
    biodata: {
      first_name: "Robert",
      last_name: "White",
      age: 58,
      gender: "Male",
      marital_status: "Divorced",
      dwelling_place: "Rent (2 rooms)",
      economic_activities: "Retired",
      family_support: "Limited Support",
      education: "Primary",
      qualification: "FSLC",
      date: "2025-02-15",
      email: "robert.w@example.com",
    },
    location: {
      house_number: "1616",
      street: "Mile High Ave",
      area: "Mountains",
      city: "Denver",
      state: "State AA",
    },
    poverty_status: {
      business_activity: {
        business_nature: "NA",
        business_size: "NA",
        business_location: "NA",
        daily_income: 700,
      },
      family: {
        marital_status: "Divorced",
        children_under_18: 0,
        children_earning: 1,
        spouse_age: "N/A",
        spouse_occupation: "N/A",
      },
      dwelling_place_details: {
        type: "Rent",
        size: "2 rooms",
      },
      nutrition: {
        meal_type: "Chili",
      },
      health_status: {
        major_illness: "Yes",
      },
    },
    score: 14,
    id_type_selected: "Driver's License",
    nin: "",
    drivers_license_number: "DL3344556",
    drivers_license_issue_date: "2024-03-01",
    drivers_license_expiry_date: "2029-03-01",
    voters_card_number: "",
  },
  {
    id: 28,
    pin: "789789",
    image: "https://placehold.co/20x20/C0C0C0/000000?text=28",
    biodata: {
      first_name: "Linda",
      last_name: "Harris",
      age: 37,
      gender: "Female",
      marital_status: "Married",
      dwelling_place: "Own (3 rooms)",
      economic_activities: "Fully Employed",
      family_support: "High Support",
      education: "University",
      qualification: "M.D.",
      date: "2025-03-20",
      email: "linda.h@example.com",
    },
    location: {
      house_number: "1717",
      street: "Desert Dr",
      area: "Desert",
      city: "City BB",
      state: "State BB",
    },
    poverty_status: {
      business_activity: {
        business_nature: "NA",
        business_size: "NA",
        business_location: "NA",
        daily_income: 20000,
      },
      family: {
        marital_status: "Married",
        children_under_18: 1,
        children_earning: 0,
        spouse_age: 39,
        spouse_occupation: "Doctor",
      },
      dwelling_place_details: {
        type: "Own",
        size: "3 rooms",
      },
      nutrition: {
        meal_type: "Tacos",
      },
      health_status: {
        major_illness: "No",
      },
    },
    score: 29,
    id_type_selected: "Voters Card",
    nin: "",
    drivers_license_number: "",
    drivers_license_issue_date: "",
    drivers_license_expiry_date: "",
    voters_card_number: "VC111222333",
  },
  {
    id: 29,
    pin: "012012",
    image: "https://placehold.co/20x20/A0A0A0/FFFFFF?text=29",
    biodata: {
      first_name: "Karen",
      last_name: "Nelson",
      age: 49,
      gender: "Female",
      marital_status: "Single",
      dwelling_place: "Rent (1 room)",
      economic_activities: "Artist",
      family_support: "Limited Support",
      education: "Tertiary",
      qualification: "B.F.A.",
      date: "2025-04-25",
      email: "karen.n@example.com",
    },
    location: {
      house_number: "1818",
      street: "Golden Gate Ave",
      area: "Bay Area",
      city: "San Francisco",
      state: "State CC",
    },
    poverty_status: {
      business_activity: {
        business_nature: "NA",
        business_size: "NA",
        business_location: "NA",
        daily_income: 3000,
      },
      family: {
        marital_status: "Single",
        children_under_18: 0,
        children_earning: 0,
        spouse_age: "N/A",
        spouse_occupation: "N/A",
      },
      dwelling_place_details: {
        type: "Rent",
        size: "1 room",
      },
      nutrition: {
        meal_type: "Sourdough",
      },
      health_status: {
        major_illness: "No",
      },
    },
    score: 17,
    id_type_selected: "",
    nin: "",
    drivers_license_number: "",
    drivers_license_issue_date: "",
    drivers_license_expiry_date: "",
    voters_card_number: "",
  },
  {
    id: 30,
    pin: "345345",
    image: "https://placehold.co/20x20/808080/FFFFFF?text=30",
    biodata: {
      first_name: "Steven",
      last_name: "Carter",
      age: 31,
      gender: "Male",
      marital_status: "Married",
      dwelling_place: "Own (2 rooms)",
      economic_activities: "Actor",
      family_support: "High Support",
      education: "University",
      qualification: "B.A.",
      date: "2025-05-30",
      email: "steven.c@example.com",
    },
    location: {
      house_number: "1919",
      street: "Hollywood Blvd",
      area: "Hollywood",
      city: "Los Angeles",
      state: "State DD",
    },
    poverty_status: {
      business_activity: {
        business_nature: "NA",
        business_size: "NA",
        business_location: "NA",
        daily_income: 10000,
      },
      family: {
        marital_status: "Married",
        children_under_18: 1,
        children_earning: 0,
        spouse_age: 30,
        spouse_occupation: "Actress",
      },
      dwelling_place_details: {
        type: "Own",
        size: "2 rooms",
      },
      nutrition: {
        meal_type: "Smoothie",
      },
      health_status: {
        major_illness: "No",
      },
    },
    score: 23,
    id_type_selected: "NIN",
    nin: "78901234567",
    drivers_license_number: "",
    drivers_license_issue_date: "",
    drivers_license_expiry_date: "",
    voters_card_number: "",
  },
];

// --- Table Configuration (Page-specific) ---
const userHeaders = [
  "S/N", // S/N is automatically handled by table.js
  "Date",
  "Image",
  "Last Name",
  "First Name",
  "Location",
  "Poverty Status",
  "Pin",
  "Score",
];
const userDropdownActions = ["Open Data", "View", "Delete"]; // Changed "View Details" to "Open Data", added "View"

/**
 * Transforms a nested user object into a flat object suitable for the table display.
 * @param {object} user - The nested user data object.
 * @returns {object} A flattened object for table consumption.
 */
function transformUserForTable(user) {
  return {
    id: user.id,
    date: user.biodata.date,
    image: user.image,
    last_name: user.biodata.last_name,
    first_name: user.biodata.first_name,
    location: user.location.city + ", " + user.location.state, // Example: combine for display
    poverty_status: user.poverty_status.dwelling_place_details.type, // Example: just show dwelling type
    pin: user.pin,
    score: user.score,
  };
}

/**
 * Page-specific function to fetch user data from the backend.
 * This is passed to the generic PaginatedTableManager.
 * @param {number} limit - The number of items to fetch.
 * @param {number} offset - The starting index for the data.
 * @returns {Promise<object>} A promise resolving to { data: Array<object>, totalItems: number }.
 */
async function fetchUsersDataFromAPI(limit, offset) {
  // --- REAL API FETCH EXAMPLE (Uncomment and modify when your API is ready) ---
  /*
  const API_BASE_URL = 'https://your-backend-api.com/api/users'; // Replace with your actual API endpoint
  const url = `${API_BASE_URL}?limit=${limit}&offset=${offset}`;

  console.log(`Real API Request: ${url}`);

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': 'Bearer YOUR_AUTH_TOKEN', // Add if your API requires authentication
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorData.message || 'Unknown error'}`);
    }

    const result = await response.json();

    // IMPORTANT: Adjust this based on your actual API response structure.
    // Your API might return something like:
    // {
    //   "data": [ { ... }, { ... } ], // Array of user objects for the current page
    //   "totalCount": 100,            // Total number of users in the entire dataset
    // }
    // After fetching, transform the data for the table
    const transformedData = result.data.map(transformUserForTable);

    return {
      data: transformedData,        // The array of items for the current page (flattened)
      totalItems: result.totalCount, // The total count of all items
    };

  } catch (error) {
    console.error("Error fetching data from real API:", error);
    throw error; // Re-throw to be caught by the PaginatedTableManager
  }
  */
  // --- END REAL API FETCH EXAMPLE ---

  // --- MOCK API IMPLEMENTATION (Currently Active) ---
  console.log(`Mock API Request: /api/users?limit=${limit}&offset=${offset}`);
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate network delay
      const paginatedRawData = MOCK_FULL_DATASET.slice(offset, offset + limit);
      // Transform mock data before resolving
      const transformedData = paginatedRawData.map(transformUserForTable);
      resolve({
        data: transformedData,
        totalItems: MOCK_FULL_DATASET.length, // Mock backend provides total count
      });
    }, 500); // Simulate network delay
  });
  // --- END MOCK API IMPLEMENTATION ---
}

// Create an instance of the paginated table manager for users
const userTableManager = createPaginatedTableManager(
  "users-table-container",
  "users-pagination-container",
  {
    fetchDataFunction: fetchUsersDataFromAPI, // Pass the page-specific fetch function
    tableHeaders: userHeaders,
    dropdownActions: userDropdownActions,
    pageKey: "users",
    defaultItemsPerPage: 25, // Initial limit for the first fetch
  }
);

/**
 * Handles actions triggered from the user table's dropdown menu.
 * @param {CustomEvent} event - The custom event dispatched by table.js.
 */
function handleUserTableAction(event) {
  const { action, itemId, pageKey } = event.detail;
  console.log(
    `User Table Action: ${action} for item ${itemId} on ${pageKey} page`
  );

  // Find the user from the mock dataset (in a real app, you might fetch full details if needed)
  // IMPORTANT: We get a reference to the user object in MOCK_FULL_DATASET
  // so direct modifications here will persist in the mock data.
  const user = MOCK_FULL_DATASET.find((u) => u.id === parseInt(itemId));

  if (!user) {
    console.warn(`User with ID ${itemId} not found.`);
    return;
  }

  switch (action) {
    case "open-data": // Multi-view modal for editing
      let currentViewIndex = 0; // Start with the first view

      // Define each view's content generator and completeness checker
      const detailViews = [
        {
          id: "pin-view",
          title: "Pin",
          // Pin is read-only
          contentGenerator: (userData) => `
            <div class="modal-view-content">
              <h4>Generate Your Pin</h4>
              <p>Click the button below to generate your pin</p>
              <div class="form-group">
                <label for="user-pin">Pin</label>
                <input type="text" id="user-pin" value="${
                  userData.pin || ""
                }" readonly>
              </div>
              <button class="button button-secondary" id="generate-pin-btn">Generate</button>
            </div>
          `,
          isCompleteChecker: (userData) => !!userData.pin, // Pin is complete if it exists
          // Data collector for this view (returns current values from inputs)
          dataCollector: () => ({
            pin: document.getElementById("user-pin")?.value || "",
          }),
        },
        {
          id: "biodata-view",
          title: "Biodata",
          contentGenerator: (userData) => `
            <div class="modal-view-content">
              <h4>Biodata Details</h4>
              <div class="form-group">
                <label for="first-name">First Name:</label>
                <input type="text" id="first-name" value="${
                  userData.biodata.first_name || ""
                }">
              </div>
              <div class="form-group">
                <label for="last-name">Last Name:</label>
                <input type="text" id="last-name" value="${
                  userData.biodata.last_name || ""
                }">
              </div>
              <div class="form-group">
                <label for="email">Email:</label>
                <input type="email" id="email" value="${
                  userData.biodata.email || ""
                }">
              </div>
              <div class="form-group">
                <label for="date">Date:</label>
                <input type="date" id="date" value="${
                  userData.biodata.date || ""
                }">
              </div>
              <div class="form-group">
                <label for="age">Age:</label>
                <input type="number" id="age" value="${
                  userData.biodata.age || ""
                }">
              </div>
              <div class="form-group">
                <label for="gender">Gender:</label>
                <input type="text" id="gender" value="${
                  userData.biodata.gender || ""
                }">
              </div>
              <div class="form-group">
                <label for="marital-status">Marital Status:</label>
                <input type="text" id="marital-status" value="${
                  userData.biodata.marital_status || ""
                }">
              </div>
              <div class="form-group">
                <label for="dwelling-place">Dwelling Place:</label>
                <input type="text" id="dwelling-place" value="${
                  userData.biodata.dwelling_place || ""
                }">
              </div>
              <div class="form-group">
                <label for="economic-activities">Economic Activities:</label>
                <input type="text" id="economic-activities" value="${
                  userData.biodata.economic_activities || ""
                }">
              </div>
              <div class="form-group">
                <label for="family-support">Family Support:</label>
                <input type="text" id="family-support" value="${
                  userData.biodata.family_support || ""
                }">
              </div>
              <div class="form-group">
                <label for="education">Education:</label>
                <input type="text" id="education" value="${
                  userData.biodata.education || ""
                }">
              </div>
              <div class="form-group">
                <label for="qualification">Qualification:</label>
                <input type="text" id="qualification" value="${
                  userData.biodata.qualification || ""
                }">
              </div>
            </div>
          `,
          isCompleteChecker: (userData) =>
            !!userData.biodata.first_name &&
            !!userData.biodata.last_name &&
            !!userData.biodata.email &&
            !!userData.biodata.date &&
            !!userData.biodata.age &&
            !!userData.biodata.gender &&
            !!userData.biodata.marital_status &&
            !!userData.biodata.dwelling_place &&
            !!userData.biodata.economic_activities &&
            !!userData.biodata.family_support &&
            !!userData.biodata.education &&
            !!userData.biodata.qualification,
          dataCollector: () => ({
            biodata: {
              first_name: document.getElementById("first-name")?.value || "",
              last_name: document.getElementById("last-name")?.value || "",
              email: document.getElementById("email")?.value || "",
              date: document.getElementById("date")?.value || "",
              age: parseInt(document.getElementById("age")?.value, 10) || null,
              gender: document.getElementById("gender")?.value || "",
              marital_status:
                document.getElementById("marital-status")?.value || "",
              dwelling_place:
                document.getElementById("dwelling-place")?.value || "",
              economic_activities:
                document.getElementById("economic-activities")?.value || "",
              family_support:
                document.getElementById("family-support")?.value || "",
              education: document.getElementById("education")?.value || "",
              qualification:
                document.getElementById("qualification")?.value || "",
            },
          }),
        },
        {
          id: "location-view",
          title: "Location",
          contentGenerator: (userData) => `
            <div class="modal-view-content">
              <h4>Location Details</h4>
              <div class="form-group">
                <label for="house-number">House Number:</label>
                <input type="text" id="house-number" value="${
                  userData.location.house_number || ""
                }">
              </div>
              <div class="form-group">
                <label for="street">Street:</label>
                <input type="text" id="street" value="${
                  userData.location.street || ""
                }">
              </div>
              <div class="form-group">
                <label for="area-community">Area/Community:</label>
                <input type="text" id="area-community" value="${
                  userData.location.area || ""
                }">
              </div>
              <div class="form-group">
                <label for="city-village">City/Village:</label>
                <input type="text" id="city-village" value="${
                  userData.location.city || ""
                }">
              </div>
              <div class="form-group">
                <label for="state">State:</label>
                <input type="text" id="state" value="${
                  userData.location.state || ""
                }">
              </div>
            </div>
          `,
          isCompleteChecker: (userData) =>
            !!userData.location.house_number &&
            !!userData.location.street &&
            !!userData.location.area &&
            !!userData.location.city &&
            !!userData.location.state,
          dataCollector: () => ({
            location: {
              house_number:
                document.getElementById("house-number")?.value || "",
              street: document.getElementById("street")?.value || "",
              area: document.getElementById("area-community")?.value || "",
              city: document.getElementById("city-village")?.value || "",
              state: document.getElementById("state")?.value || "",
            },
          }),
        },
        {
          id: "poverty-status-view",
          title: "Poverty Status",
          contentGenerator: (userData) => `
            <div class="modal-view-content">
              <h4>Business Activity</h4>
              <div class="form-group">
                <label for="business-nature">Nature / Type of Business:</label>
                <input type="text" id="business-nature" value="${
                  userData.poverty_status.business_activity.business_nature ||
                  ""
                }">
              </div>
              <div class="form-group">
                <label for="business-size">Size of Business (Estimated Value):</label>
                <input type="text" id="business-size" value="${
                  userData.poverty_status.business_activity.business_size || ""
                }">
              </div>
              <div class="form-group">
                <label for="business-location">Location of Business:</label>
                <input type="text" id="business-location" value="${
                  userData.poverty_status.business_activity.business_location ||
                  ""
                }">
              </div>
              <div class="form-group">
                <label for="daily-income">Daily Income:</label>
                <input type="number" id="daily-income" value="${
                  userData.poverty_status.business_activity.daily_income || ""
                }">
              </div>

              <h4 class="sub-section-title">Family</h4>
              <div class="form-group">
                <label for="family-marital-status">Marital Status:</label>
                <input type="text" id="family-marital-status" value="${
                  userData.poverty_status.family.marital_status || ""
                }">
              </div>
              <div class="form-group">
                <label for="children-under-18">Number of children under 18 years:</label>
                <input type="number" id="children-under-18" value="${
                  userData.poverty_status.family.children_under_18 || ""
                }">
              </div>
              <div class="form-group">
                <label for="children-earning">Number of children earning money:</label>
                <input type="number" id="children-earning" value="${
                  userData.poverty_status.family.children_earning || ""
                }">
              </div>
              <div class="form-group">
                <label for="spouse-age">Age of Spouse:</label>
                <input type="text" id="spouse-age" value="${
                  userData.poverty_status.family.spouse_age || ""
                }">
              </div>
              <div class="form-group">
                <label for="spouse-occupation">Nature of occupation of spouse:</label>
                <input type="text" id="spouse-occupation" value="${
                  userData.poverty_status.family.spouse_occupation || ""
                }">
              </div>

              <h4 class="sub-section-title">Dwelling Place</h4>
              <div class="form-group">
                <label for="dwelling-type">Own home or rent:</label>
                <input type="text" id="dwelling-type" value="${
                  userData.poverty_status.dwelling_place_details.type || ""
                }">
              </div>
              <div class="form-group">
                <label for="dwelling-size">Size of dwelling place (Number of rooms):</label>
                <input type="text" id="dwelling-size" value="${
                  userData.poverty_status.dwelling_place_details.size || ""
                }">
              </div>

              <h4 class="sub-section-title">Nutrition</h4>
              <div class="form-group">
                <label for="meal-type">Main type Of Meal:</label>
                <input type="text" id="meal-type" value="${
                  userData.poverty_status.nutrition.meal_type || ""
                }">
              </div>

              <h4 class="sub-section-title">Health Status</h4>
              <div class="form-group">
                <label for="major-illness">Any major illness:</label>
                <input type="text" id="major-illness" value="${
                  userData.poverty_status.health_status.major_illness || ""
                }">
              </div>
            </div>
          `,
          isCompleteChecker: (userData) =>
            // Business Activity
            !!userData.poverty_status.business_activity.business_nature &&
            !!userData.poverty_status.business_activity.business_size &&
            !!userData.poverty_status.business_activity.business_location &&
            !!userData.poverty_status.business_activity.daily_income &&
            // Family
            !!userData.poverty_status.family.marital_status &&
            userData.poverty_status.family.children_under_18 !== undefined &&
            userData.poverty_status.family.children_under_18 !== null &&
            userData.poverty_status.family.children_earning !== undefined &&
            userData.poverty_status.family.children_earning !== null &&
            !!userData.poverty_status.family.spouse_age &&
            !!userData.poverty_status.family.spouse_occupation &&
            // Dwelling Place
            !!userData.poverty_status.dwelling_place_details.type &&
            !!userData.poverty_status.dwelling_place_details.size &&
            // Nutrition
            !!userData.poverty_status.nutrition.meal_type &&
            // Health Status
            !!userData.poverty_status.health_status.major_illness,
          dataCollector: () => ({
            poverty_status: {
              business_activity: {
                business_nature:
                  document.getElementById("business-nature")?.value || "",
                business_size:
                  document.getElementById("business-size")?.value || "",
                business_location:
                  document.getElementById("business-location")?.value || "",
                daily_income:
                  parseInt(
                    document.getElementById("daily-income")?.value,
                    10
                  ) || null,
              },
              family: {
                marital_status:
                  document.getElementById("family-marital-status")?.value || "",
                children_under_18:
                  parseInt(
                    document.getElementById("children-under-18")?.value,
                    10
                  ) || null,
                children_earning:
                  parseInt(
                    document.getElementById("children-earning")?.value,
                    10
                  ) || null,
                spouse_age: document.getElementById("spouse-age")?.value || "",
                spouse_occupation:
                  document.getElementById("spouse-occupation")?.value || "",
              },
              dwelling_place_details: {
                type: document.getElementById("dwelling-type")?.value || "",
                size: document.getElementById("dwelling-size")?.value || "",
              },
              nutrition: {
                meal_type: document.getElementById("meal-type")?.value || "",
              },
              health_status: {
                major_illness:
                  document.getElementById("major-illness")?.value || "",
              },
            },
          }),
        },
        {
          id: "id-view",
          title: "ID",
          contentGenerator: (userData) => `
            <div class="modal-view-content">
              <h4>ID</h4>
              <div class="form-group">
                <label class="radio-label">
                  <input type="radio" name="idType" value="NIN" id="id-type-nin" ${
                    userData.id_type_selected === "NIN" ? "checked" : ""
                  }>
                  NIN (National Identification Number)
                </label>
              </div>
              <div id="nin-details" class="id-details-section" style="display: ${
                userData.id_type_selected === "NIN" ? "block" : "none"
              };">
                <div class="form-group">
                  <label for="nin-input">NIN:</label>
                  <input type="text" id="nin-input" value="${
                    userData.nin || ""
                  }">
                </div>
              </div>

              <div class="form-group">
                <label class="radio-label">
                  <input type="radio" name="idType" value="Driver's License" id="id-type-drivers-license" ${
                    userData.id_type_selected === "Driver's License"
                      ? "checked"
                      : ""
                  }>
                  Driver's License
                </label>
              </div>
              <div id="drivers-license-details" class="id-details-section" style="display: ${
                userData.id_type_selected === "Driver's License"
                  ? "block"
                  : "none"
              };">
                <div class="form-group">
                  <label for="drivers-license-input">Driver's License:</label>
                  <input type="text" id="drivers-license-input" value="${
                    userData.drivers_license_number || ""
                  }">
                </div>
                <div class="form-group">
                  <label for="drivers-license-issue-date">Issue Date:</label>
                  <input type="date" id="drivers-license-issue-date" value="${
                    userData.drivers_license_issue_date || ""
                  }">
                </div>
                <div class="form-group">
                  <label for="drivers-license-expiry-date">Expiry Date:</label>
                  <input type="date" id="drivers-license-expiry-date" value="${
                    userData.drivers_license_expiry_date || ""
                  }">
                </div>
              </div>

              <div class="form-group">
                <label class="radio-label">
                  <input type="radio" name="idType" value="Voters Card" id="id-type-voters-card" ${
                    userData.id_type_selected === "Voters Card" ? "checked" : ""
                  }>
                  Voters Card
                </label>
              </div>
              <div id="voters-card-details" class="id-details-section" style="display: ${
                userData.id_type_selected === "Voters Card" ? "block" : "none"
              };">
                <div class="form-group">
                  <label for="voters-card-input">Voters Card:</label>
                  <input type="text" id="voters-card-input" value="${
                    userData.voters_card_number || ""
                  }">
                </div>
              </div>
              <div class="user-image-preview">
                <img src="${user.image}" alt="${user.biodata.first_name} ${
            user.biodata.last_name
          } Image" onerror="this.onerror=null;this.src='https://placehold.co/50x50/cccccc/000000?text=No+Image';" />
              </div>
            </div>
          `,
          isCompleteChecker: (userData) => {
            if (userData.id_type_selected === "NIN") {
              return !!userData.nin;
            } else if (userData.id_type_selected === "Driver's License") {
              return (
                !!userData.drivers_license_number &&
                !!userData.drivers_license_issue_date &&
                !!userData.drivers_license_expiry_date
              );
            } else if (userData.id_type_selected === "Voters Card") {
              return !!userData.voters_card_number;
            }
            return false; // No ID type selected or incomplete
          },
          dataCollector: () => {
            const selectedIdType =
              document.querySelector('input[name="idType"]:checked')?.value ||
              "";
            const data = { id_type_selected: selectedIdType };

            // Collect data for selected type, clear others
            data.nin =
              selectedIdType === "NIN"
                ? document.getElementById("nin-input")?.value || ""
                : "";
            data.drivers_license_number =
              selectedIdType === "Driver's License"
                ? document.getElementById("drivers-license-input")?.value || ""
                : "";
            data.drivers_license_issue_date =
              selectedIdType === "Driver's License"
                ? document.getElementById("drivers-license-issue-date")
                    ?.value || ""
                : "";
            data.drivers_license_expiry_date =
              selectedIdType === "Driver's License"
                ? document.getElementById("drivers-license-expiry-date")
                    ?.value || ""
                : "";
            data.voters_card_number =
              selectedIdType === "Voters Card"
                ? document.getElementById("voters-card-input")?.value || ""
                : "";

            return data;
          },
        },
      ];

      /**
       * Renders the current view within the multi-view modal.
       */
      function renderCurrentView() {
        const currentView = detailViews[currentViewIndex];
        const modalBodyContent = currentView.contentGenerator(user); // Pass the current user data

        // Generate the header tabs with status indicators
        const headerTabsHTML = detailViews
          .map((view, index) => {
            // Create a temporary user object to check completeness with current input values
            const tempUser = JSON.parse(JSON.stringify(user)); // Deep copy to avoid modifying original user during checks
            // Apply data from all views' inputs to tempUser for accurate completeness check
            detailViews.forEach((v) => {
              // Only collect data if the view's elements are actually in the DOM
              // This prevents errors if an input doesn't exist in the current view
              const viewContainer = document.querySelector(
                `#app-modal-body #${v.id}`
              );
              if (viewContainer) {
                // Check if the container for this view is present in the modal body
                const collectedData = v.dataCollector();
                // Recursively merge collected data into tempUser
                Object.keys(collectedData).forEach((key) => {
                  if (
                    typeof collectedData[key] === "object" &&
                    collectedData[key] !== null &&
                    !Array.isArray(collectedData[key])
                  ) {
                    tempUser[key] = { ...tempUser[key], ...collectedData[key] };
                  } else {
                    tempUser[key] = collectedData[key];
                  }
                });
              }
            });

            const isComplete = view.isCompleteChecker(tempUser); // Check completeness based on current user data
            const statusIcon = isComplete ? "✓" : "—"; // Green check or grey dash
            const statusClass = isComplete
              ? "status-complete"
              : "status-incomplete";
            const isActive = index === currentViewIndex ? "active" : "";

            return `
            <div class="modal-view-tab ${isActive}" data-view-index="${index}">
              <span class="status-icon ${statusClass}">${statusIcon}</span>
              <span class="tab-title">${view.title}</span>
            </div>
          `;
          })
          .join("");

        // Generate footer buttons
        let footerButtonsHTML = "";
        if (currentViewIndex > 0) {
          footerButtonsHTML += `<button class="button button-secondary" id="modal-back-btn">Back</button>`;
        }
        if (currentViewIndex < detailViews.length - 1) {
          footerButtonsHTML += `<button class="button button-primary" id="modal-continue-btn">Continue</button>`;
        }
        footerButtonsHTML += `<button class="button button-primary" id="modal-save-btn">Save Changes</button>`; // Save button
        footerButtonsHTML += `<button class="button button-secondary" id="modal-close-btn">Close</button>`; // Always a close button

        // Open the modal with the combined content
        openModal(
          `
          <div class="multi-view-modal-container">
            <div class="modal-view-tabs-header">
              ${headerTabsHTML}
            </div>
            <div class="modal-view-body-content" id="current-modal-view-body">
              ${modalBodyContent}
            </div>
          </div>
        `,
          `Details for ${user.biodata.first_name} ${user.biodata.last_name}`,
          {
            // Update title to use biodata
            showFooter: true,
            footerContent: footerButtonsHTML,
            onCloseCallback: () => {
              console.log("Multi-view modal closed.");
              userTableManager.refresh(); // Refresh the main table to show any saved changes
            },
          }
        );

        // --- Attach Event Listeners to Dynamically Created Elements ---
        // Close button
        const modalCloseBtn = document.getElementById("modal-close-btn");
        if (modalCloseBtn) {
          modalCloseBtn.addEventListener("click", closeModal);
        }

        // Back button
        const modalBackBtn = document.getElementById("modal-back-btn");
        if (modalBackBtn) {
          modalBackBtn.addEventListener("click", () => {
            // Collect data from current view before navigating away
            const currentViewData = currentView.dataCollector();
            // Recursively merge collected data into the main user object
            Object.keys(currentViewData).forEach((key) => {
              if (
                typeof currentViewData[key] === "object" &&
                currentViewData[key] !== null &&
                !Array.isArray(currentViewData[key])
              ) {
                user[key] = { ...user[key], ...currentViewData[key] };
              } else {
                user[key] = currentViewData[key];
              }
            });
            currentViewIndex = Math.max(0, currentViewIndex - 1);
            renderCurrentView(); // Re-render the modal with the new view
          });
        }

        // Continue button
        const modalContinueBtn = document.getElementById("modal-continue-btn");
        if (modalContinueBtn) {
          modalContinueBtn.addEventListener("click", () => {
            // Collect data from current view before navigating away
            const currentViewData = currentView.dataCollector();
            // Recursively merge collected data into the main user object
            Object.keys(currentViewData).forEach((key) => {
              if (
                typeof currentViewData[key] === "object" &&
                currentViewData[key] !== null &&
                !Array.isArray(currentViewData[key])
              ) {
                user[key] = { ...user[key], ...currentViewData[key] };
              } else {
                user[key] = currentViewData[key];
              }
            });
            currentViewIndex = Math.min(
              detailViews.length - 1,
              currentViewIndex + 1
            );
            renderCurrentView(); // Re-render the modal with the new view
          });
        }

        // Save Changes button
        const modalSaveBtn = document.getElementById("modal-save-btn");
        if (modalSaveBtn) {
          modalSaveBtn.addEventListener("click", () => {
            console.log("Save Changes button clicked!");
            // Collect data from the current view's inputs
            const currentViewData = currentView.dataCollector();
            // Recursively merge collected data into the main user object
            Object.keys(currentViewData).forEach((key) => {
              if (
                typeof currentViewData[key] === "object" &&
                currentViewData[key] !== null &&
                !Array.isArray(currentViewData[key])
              ) {
                user[key] = { ...user[key], ...currentViewData[key] };
              } else {
                user[key] = currentViewData[key];
              }
            });

            console.log("User data after mock save:", user);
            // In a real application, you'd make an API call to save the changes:
            // await fetch('/api/users/' + user.id, { method: 'PUT', body: JSON.stringify(user), headers: { 'Content-Type': 'application/json' } });

            // Re-render the current view to update status icons based on new data
            renderCurrentView();
          });
        }

        // Clickable tabs
        document.querySelectorAll(".modal-view-tab").forEach((tab) => {
          tab.addEventListener("click", (e) => {
            const index = parseInt(e.currentTarget.dataset.viewIndex, 10);
            if (index !== currentViewIndex) {
              // Collect data from current view before navigating to another tab
              const currentViewData = currentView.dataCollector();
              // Recursively merge collected data into the main user object
              Object.keys(currentViewData).forEach((key) => {
                if (
                  typeof currentViewData[key] === "object" &&
                  currentViewData[key] !== null &&
                  !Array.isArray(currentViewData[key])
                ) {
                  user[key] = { ...user[key], ...currentViewData[key] };
                } else {
                  user[key] = currentViewData[key];
                }
              });
              currentViewIndex = index;
              renderCurrentView(); // Re-render with the selected tab's view
            }
          });
        });

        // Specific button for Pin View (if it's the current view)
        if (currentView.id === "pin-view") {
          const generatePinBtn = document.getElementById("generate-pin-btn");
          if (generatePinBtn) {
            generatePinBtn.addEventListener("click", () => {
              const pinInput = document.getElementById("user-pin");
              if (pinInput) {
                // Mock pin generation
                const newPin = Math.floor(
                  100000 + Math.random() * 900000
                ).toString();
                pinInput.value = newPin;
                user.pin = newPin; // Update the user object
                console.log("New PIN generated:", newPin);

                // Re-render to update the status icon if it's now complete.
                renderCurrentView();
              }
            });
          }
        }

        // Specific logic for ID View (radio button change listener)
        if (currentView.id === "id-view") {
          document.querySelectorAll('input[name="idType"]').forEach((radio) => {
            radio.addEventListener("change", (e) => {
              const selectedType = e.target.value;
              // Update user object's id_type_selected immediately
              user.id_type_selected = selectedType;

              // Hide all ID details sections
              document.getElementById("nin-details").style.display = "none";
              document.getElementById("drivers-license-details").style.display =
                "none";
              document.getElementById("voters-card-details").style.display =
                "none";

              // Show the selected ID details section
              if (selectedType === "NIN") {
                document.getElementById("nin-details").style.display = "block";
              } else if (selectedType === "Driver's License") {
                document.getElementById(
                  "drivers-license-details"
                ).style.display = "block";
              } else if (selectedType === "Voters Card") {
                document.getElementById("voters-card-details").style.display =
                  "block";
              }
              // Re-render to update status icon based on new selection
              renderCurrentView();
            });
          });
        }
      }

      // Initial render of the multi-view modal
      renderCurrentView();
      break;

    case "view": // NEW "View" action for read-only full details
      let viewModalContent = `
        <div class="full-details-modal-content">
          <div class="user-image-preview-view-only">
            <img src="${user.image}" alt="${user.biodata.first_name} ${
        user.biodata.last_name
      } Image" onerror="this.onerror=null;this.src='https://placehold.co/100x100/cccccc/000000?text=No+Image';" />
          </div>

          <div class="details-group">
            <div class="detail-item"><strong>Pin:</strong> <span>${
              user.pin || "N/A"
            }</span></div>
            <div class="detail-item"><strong>NIN:</strong> <span>${
              user.nin || "N/A"
            }</span></div>
          </div>

          <div class="details-section">
            <h4 class="section-title">Biodata</h4>
            <div class="details-grid">
              <div class="detail-item"><strong>First Name:</strong> <span>${
                user.biodata.first_name || "N/A"
              }</span></div>
              <div class="detail-item"><strong>Last Name:</strong> <span>${
                user.biodata.last_name || "N/A"
              }</span></div>
              <div class="detail-item"><strong>Age:</strong> <span>${
                user.biodata.age || "N/A"
              }</span></div>
              <div class="detail-item"><strong>Gender:</strong> <span>${
                user.biodata.gender || "N/A"
              }</span></div>
              <div class="detail-item"><strong>Marital Status:</strong> <span>${
                user.biodata.marital_status || "N/A"
              }</span></div>
              <div class="detail-item"><strong>Dwelling Place:</strong> <span>${
                user.biodata.dwelling_place || "N/A"
              }</span></div>
              <div class="detail-item"><strong>Economic Activities:</strong> <span>${
                user.biodata.economic_activities || "N/A"
              }</span></div>
              <div class="detail-item"><strong>Family Support:</strong> <span>${
                user.biodata.family_support || "N/A"
              }</span></div>
              <div class="detail-item"><strong>Education:</strong> <span>${
                user.biodata.education || "N/A"
              }</span></div>
              <div class="detail-item"><strong>Qualification:</strong> <span>${
                user.biodata.qualification || "N/A"
              }</span></div>
            </div>
          </div>

          <div class="details-section">
            <h4 class="section-title">Location</h4>
            <div class="details-grid">
              <div class="detail-item"><strong>House Number:</strong> <span>${
                user.location.house_number || "N/A"
              }</span></div>
              <div class="detail-item"><strong>Street:</strong> <span>${
                user.location.street || "N/A"
              }</span></div>
              <div class="detail-item"><strong>Area/Community:</strong> <span>${
                user.location.area || "N/A"
              }</span></div>
              <div class="detail-item"><strong>City/Village:</strong> <span>${
                user.location.city || "N/A"
              }</span></div>
              <div class="detail-item"><strong>State:</strong> <span>${
                user.location.state || "N/A"
              }</span></div>
            </div>
          </div>

          <div class="details-section">
            <h4 class="section-title">Poverty Status</h4>
            <div class="details-grid">
              <div class="detail-item"><strong>Business Activity:</strong> <span>${
                user.poverty_status.business_activity.business_nature || "N/A"
              }</span></div>
              <div class="detail-item"><strong>Nature / Type of Business:</strong> <span>${
                user.poverty_status.business_activity.business_nature || "N/A"
              }</span></div>
              <div class="detail-item"><strong>Size of Business (Estimated Value):</strong> <span>${
                user.poverty_status.business_activity.business_size || "N/A"
              }</span></div>
              <div class="detail-item"><strong>Location of Business:</strong> <span>${
                user.poverty_status.business_activity.business_location || "N/A"
              }</span></div>
              <div class="detail-item"><strong>Daily Income:</strong> <span>${
                user.poverty_status.business_activity.daily_income || "N/A"
              }</span></div>

              <div class="detail-item"><strong>Family Marital Status:</strong> <span>${
                user.poverty_status.family.marital_status || "N/A"
              }</span></div>
              <div class="detail-item"><strong>Children under 18:</strong> <span>${
                user.poverty_status.family.children_under_18 || "N/A"
              }</span></div>
              <div class="detail-item"><strong>Children earning money:</strong> <span>${
                user.poverty_status.family.children_earning || "N/A"
              }</span></div>
              <div class="detail-item"><strong>Spouse Age:</strong> <span>${
                user.poverty_status.family.spouse_age || "N/A"
              }</span></div>
              <div class="detail-item"><strong>Spouse Occupation:</strong> <span>${
                user.poverty_status.family.spouse_occupation || "N/A"
              }</span></div>

              <div class="detail-item"><strong>Dwelling Type:</strong> <span>${
                user.poverty_status.dwelling_place_details.type || "N/A"
              }</span></div>
              <div class="detail-item"><strong>Dwelling Size:</strong> <span>${
                user.poverty_status.dwelling_place_details.size || "N/A"
              }</span></div>

              <div class="detail-item"><strong>Main type Of Meal:</strong> <span>${
                user.poverty_status.nutrition.meal_type || "N/A"
              }</span></div>
              <div class="detail-item"><strong>Any major illness:</strong> <span>${
                user.poverty_status.health_status.major_illness || "N/A"
              }</span></div>
            </div>
          </div>

          <div class="details-section">
            <h4 class="section-title">ID Details</h4>
            <div class="details-grid">
              <div class="detail-item"><strong>Selected ID Type:</strong> <span>${
                user.id_type_selected || "N/A"
              }</span></div>
              ${
                user.id_type_selected === "NIN"
                  ? `<div class="detail-item"><strong>NIN:</strong> <span>${
                      user.nin || "N/A"
                    }</span></div>`
                  : ""
              }
              ${
                user.id_type_selected === "Driver's License"
                  ? `
                <div class="detail-item"><strong>Driver's License No:</strong> <span>${
                  user.drivers_license_number || "N/A"
                }</span></div>
                <div class="detail-item"><strong>Issue Date:</strong> <span>${
                  user.drivers_license_issue_date || "N/A"
                }</span></div>
                <div class="detail-item"><strong>Expiry Date:</strong> <span>${
                  user.drivers_license_expiry_date || "N/A"
                }</span></div>
              `
                  : ""
              }
              ${
                user.id_type_selected === "Voters Card"
                  ? `<div class="detail-item"><strong>Voters Card No:</strong> <span>${
                      user.voters_card_number || "N/A"
                    }</span></div>`
                  : ""
              }
            </div>
          </div>
        </div>
      `;

      openModal(
        viewModalContent,
        `View Details for ${user.biodata.first_name} ${user.biodata.last_name}`,
        {
          showFooter: true,
          footerContent: `<button class="button button-secondary" id="view-modal-close-btn">Close</button>`,
          onCloseCallback: () => console.log("View-only modal closed."),
        }
      );

      // Attach event listener for the close button
      const viewModalCloseBtn = document.getElementById("view-modal-close-btn");
      if (viewModalCloseBtn) {
        viewModalCloseBtn.addEventListener("click", closeModal);
      }
      break;

    case "delete":
      console.log(`Delete action for user ID: ${itemId}`);
      // Example: Open a confirmation modal
      openModal(
        `
        <p>Are you sure you want to delete user <strong>${user.biodata.first_name} ${user.biodata.last_name}</strong>?</p>
      `,
        "Confirm Deletion",
        {
          showFooter: true,
          footerContent: `
          <button class="button button-danger" id="confirm-delete-btn">Delete</button>
          <button class="button button-secondary" id="cancel-delete-btn">Cancel</button>
        `,
          onCloseCallback: () =>
            console.log("Delete confirmation modal closed."),
        }
      );

      // Attach event listeners to the dynamically created delete buttons
      const confirmDeleteBtn = document.getElementById("confirm-delete-btn");
      if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener("click", () => {
          console.log(`User ${itemId} confirmed for deletion.`);
          // In a real app, make API call to delete
          // After successful deletion, refresh the table: userTableManager.refresh();
          closeModal(); // This will close the modal after deletion logic
        });
      }
      const cancelDeleteBtn = document.getElementById("cancel-delete-btn");
      if (cancelDeleteBtn) {
        cancelDeleteBtn.addEventListener("click", closeModal); // This will close the modal on cancel
      }
      break;
    default:
      console.warn(`Unhandled action: ${action}`);
  }
}

/**
 * Initialization function for the User Data module.
 * Called by the router when the /users route is active.
 */
export function initUsers() {
  console.log("Initializing User Data module...");
  userTableManager.init(); // Initialize the paginated table manager

  // Add a global event listener for table actions specific to this page
  // Remove previous listeners to prevent duplicates if initUsers is called multiple times
  window.removeEventListener("tableAction", handleUserTableAction);
  window.addEventListener("tableAction", handleUserTableAction);
}
