export interface Post {
  id: number; // Post ID
  startingLocation: string; // Starting point of the journey
  endLocation: string; // Destination
  date: string; // Date of the journey in DD.MM.YYYY format
  time: string; // Time in HH:MM format
  userId: number; // ID of the user creating the post
  type: "driver" | "passenger"; // Type of the post
  price: number; // Price for the journey
  pickUpLocation?: string; // Optional pickup location (default: "Home")
  stopByLocations?: string; // Optional stop locations (comma-separated string)
  luggage?: string | null; // Optional luggage description (null if none)
  seatsAvailable?: number | null; // Number of seats available (for drivers)
  seatsNeeded?: number | null; // Number of seats needed (for passengers)
  showPrice: boolean; // Whether to show the price in the post
  firstName: string;
  lastName: string;
  phoneNumber: number
  imageUri: string;
  savedByUserIds?: number[]
  createdDate: string
}


export interface Review {
  id: number;
  senderName: string;
  date: string;
  stars: number;
  text: string;
  imageUri: string;
  senderId: number;
}

export interface UserDetails {
  id: number;
  firstName: string;
  lastName: string;
  joinedDate?: string;
  imageUri: string;
  phoneNumber?: string;
  email: string;
  isThemeWhite: boolean
  newMessagesCount: number
}