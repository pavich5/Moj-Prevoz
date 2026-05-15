import { Post, Review } from "@/assets/types/types";
//@ts-ignore
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "./api";
import * as Notifications from "expo-notifications";
import { appConfig } from "@/constants/config";

// --------------------- INTERFACES & TYPES ----------------------

interface RegisterUserData {
  createUserEmail: string;
  password: string;
  confirmPassword: string;
  profileImage?: string;
  userFirstName: string;
  userLastName: string;
  phoneNumber: string;
  dateOfBirth: string;
}

interface LoginResponse {
  userId: string;
  token: string;
}

export interface UserDetails {
  id: number; // Assuming ID is a number
  firstName: string;
  lastName: string;
  joinedDate: string;
  imageUri: string;
  phoneNumber?: string;
  email: string;
  reviews?: Review[];
  age: number;
  stars?: number;
  isThemeWhite: boolean;
  newMessagesCount: number
}

// --------------------- AUTH FUNCTIONS -------------------------

// Register new user
export const registerUser = async ({
  createUserEmail,
  password,
  profileImage,
  userFirstName,
  userLastName,
  phoneNumber,
  dateOfBirth,
}: RegisterUserData): Promise<number> => {
  const formatDate = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const joinedDate = formatDate(new Date());

  const registrationData = {
    email: createUserEmail,
    password,
    imageUri: profileImage ?? "https://i.sstatic.net/l60Hf.png",
    firstName: userFirstName,
    lastName: userLastName,
    joinedDate,
    phoneNumber,
    dateOfBirth,
  };

  try {
    const response = await api.post("/Public", registrationData);
    return response.status;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

// Login user
export const loginUser = async (credentials: {
  phoneNumber: string;
  password: string;
}): Promise<{ status: number; userId?: string; token?: string }> => {
  const { phoneNumber, password } = credentials;
  try {
    const response = await fetch(`${appConfig.apiBaseUrl}/Public/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phoneNumber,
        password,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        status: response.status,
        userId: undefined,
        token: errorData.token || undefined,
      };
    }

    const data: LoginResponse = await response.json();
    await AsyncStorage.setItem("userId", String(data.userId));
    await AsyncStorage.setItem("jwtToken", String(data.token));

    return {
      status: response.status,
      userId: data.userId,
      token: data.token,
    };
  } catch (error) {
    console.error("Login failed:", error);
    return {
      status: 500, // Internal server error or network issue
    };
  }
};

export const logoutUser = async (token: string) => {
  try {
    await AsyncStorage.removeItem("jwtToken");
    await AsyncStorage.removeItem("userId");
    await api.post("/Users/logout", { token });
  } catch (error) {
    console.error("Error logging out:", error);
  }
};

export const checkUserLoggedIn = async (): Promise<boolean> => {
  const userId = await AsyncStorage.getItem("userId");
  if (userId) {
    return true;
  } else {
    return false;
  }
};

// --------------------- USER PROFILE MANAGEMENT -------------------------

// Get user details
export const getUserDetails = async (userId: number): Promise<UserDetails> => {
  const backupUserId = (await AsyncStorage.getItem("userId")) ?? "";
  const response = await api.get(
    `/Users/${userId ?? Number.parseInt(backupUserId)}`
  );
  if (response.status !== 200) {
    throw new Error("Failed to fetch user details");
  }
  return response.data;
};

// Update user details
export const updateUserDetails = async (
  userDetails: any
): Promise<UserDetails | null> => {
  try {
    const response = await api.patch(`/Users`, userDetails);
    return response.data;
  } catch (error) {
    console.error("Error updating user details:", error);
    throw error;
  }
};

export const submitReview = async ({
  senderId,
  receiverId,
  message,
  stars,
}: {
  senderId: number;
  receiverId: number;
  message: string;
  stars: number;
}): Promise<void> => {
  const review = {
    senderId,
    receiverId,
    text: message,
    stars,
  };

  const response = await api.post(`/reviews`, review);

  if (response.status !== 201) {
    const errorText = response.data?.message || "Failed to submit review";
    throw new Error(`Failed to submit review: ${errorText}`);
  }
};

export const deleteReview = async (reviewId: number): Promise<void> => {
  const response = await api.delete(`/reviews/${reviewId}`);

  if (response.status !== 200) {
    const errorText = response.data?.message || "Failed to delete review";
    throw new Error(`Failed to delete review: ${errorText}`);
  }
};

export const updateReview = async ({
  id,
  stars,
  text,
}: {
  id: number;
  stars: number;
  text: string;
}): Promise<void> => {
  const reviewUpdate = {
    id,
    stars,
    text,
  };

  const response = await api.patch(`/reviews`, reviewUpdate);

  if (response.status !== 200) {
    const errorText = response.data?.message || "Failed to update review";
    throw new Error(`Failed to update review: ${errorText}`);
  }
};

interface CreatePostData {
  startingLocation: string;
  endLocation: string;
  time?: string | null; // Time in HH:MM format, nullable for Passenger
  date: string; // Date in DD.MM.YYYY format
  userId: number; // ID of the user creating the post
  type: "Driver" | "Passenger"; // Type of post
  price: number; // Price for the ride, formatted as a string
  pickUpLocation?: string; // Optional pickup location (default: "Home")
  stopByLocations?: string | null; // Optional stop locations (comma-separated string)
  luggage?: string | null; // Optional luggage description
  latestArrivalTime?: string | null; // Optional arrival time for passengers
  seatsNeeded?: number | null; // Number of seats needed for passengers
  seatsAvailable?: number | null; // Number of available seats for drivers
  showPrice: boolean; // Whether to show the price in the post
  phoneNumber: string | null;
}

export const createPost = async ({
  startingLocation,
  endLocation,
  time,
  date,
  userId,
  type,
  price,
  pickUpLocation = "Home",
  stopByLocations,
  luggage,
  latestArrivalTime,
  seatsNeeded,
  seatsAvailable,
  showPrice,
  phoneNumber,
}: CreatePostData): Promise<number> => {
  const backupUserId = (await AsyncStorage.getItem("userId")) ?? "";
  const postData = {
    startingLocation,
    endLocation,
    time,
    date,
    userId: userId ? userId : Number.parseInt(backupUserId),
    type,
    price,
    pickUpLocation,
    stopByLocations,
    luggage,
    latestArrivalTime,
    seatsNeeded,
    seatsAvailable,
    showPrice,
    phoneNumber,
  };

  try {
    const response = await api.post("/Posts", postData);

    if (response.status !== 200) {
      console.error("Failed to create post:", response.statusText);
    }

    return response.status;
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
};

export const getAllPosts = async (
  skip = 0,
  take = 10,
  userId?: number
): Promise<Post[]> => {
  const backupUserId = (await AsyncStorage.getItem("userId")) ?? "";
  const url = `/Posts?userId=${
    userId ?? Number.parseInt(backupUserId)
  }&skip=${skip}&take=${take}`;

  try {
    const response = await api.get(url);

    if (response.status !== 200) {
      throw new Error(`Failed to retrieve posts: ${response.statusText}`);
    }

    const posts: Post[] = response.data;
    return posts;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
};

export const getAllPostsForUser = async (userId?: number): Promise<Post[]> => {
  const backupUserId = (await AsyncStorage.getItem("userId")) ?? "";
  const url = `/Posts/get-posts-for-user?userId=${userId ?? backupUserId}`;

  try {
    const response = await api.get(url);

    if (response.status !== 200) {
      throw new Error(`Failed to retrieve posts: ${response.statusText}`);
    }

    const posts: Post[] = response.data;
    return posts;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
};

export const getAllSavedPostsForUser = async (
  userId?: number
): Promise<Post[]> => {
  const backupUserId = (await AsyncStorage.getItem("userId")) ?? "";
  const url = `/Posts/saved-posts?userId=${userId ?? backupUserId}`;

  try {
    const response = await api.get(url);

    if (response.status !== 200) {
      throw new Error(`Failed to retrieve posts: ${response.statusText}`);
    }

    const posts: Post[] = response.data;
    return posts;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
};

export const deleteOnePost = async (postId: number): Promise<void> => {
  try {
    const response = await api.delete(`/Posts/${postId}`);

    if (response.status !== 200) {
      const errorResponse = response.data;
      throw new Error(
        `Failed to delete the post: ${
          errorResponse.message || response.statusText
        }`
      );
    }
  } catch (error) {
    console.error("Error deleting post:", error);
    throw error;
  }
};
export const deleteUser = async (userId: number): Promise<void> => {
  try {
    const response = await api.delete(`/Users/${userId}`);
    if (response.status !== 200) {
      const errorResponse = response.data;
      throw new Error(
        `Failed to delete the post: ${
          errorResponse.message || response.statusText
        }`
      );
    }
  } catch (error) {
    console.error("Error deleting post:", error);
    throw error;
  }
};

export const updateOnePost = async (updatedPostData: {
  id: number;
  startingLocation: string;
  endLocation: string;
  time: string;
  date: string;
  price: number;
  pickUpLocation?: string;
  stopByLocations?: string;
  luggage?: string | null;
  seatsNeeded?: number | null;
  seatsAvailable?: number | null;
  showPrice?: boolean | null;
}): Promise<void> => {
  try {
    const response = await api.patch(`/Posts`, updatedPostData);

    if (response.status !== 200) {
      throw new Error("Failed to update the post");
    }
  } catch (error) {
    console.error("Error updating post:", error);
    throw error;
  }
};

export const getReviewsForUser = async ({
  userId,
  skip = 0,
  take = 10,
}: {
  userId: number;
  skip?: number;
  take?: number;
}): Promise<{
  reviews: Review[];
  rating?: number;
}> => {
  try {
    const url = `/reviews/${userId}?skip=${skip}&take=${take}`;

    const response = await api.get(url);

    if (response.status !== 200) {
      const errorText = response.data?.message || "Failed to retrieve reviews";
      throw new Error(
        `Failed to retrieve reviews. Status: ${response.status}. Message: ${errorText}`
      );
    }

    const reviews = response.data;
    return reviews;
  } catch (error) {
    console.error("Error fetching reviews:", error);
    throw error;
  }
};

export const updateUserTheme = async (
  isThemeWhite: boolean,
  userId: number
) => {
  try {
    const url = `/Users/edit-theme-color`;

    const body = {
      isThemeWhite,
      userId,
    };
    const response = await api.patch(url, body);

    if (response.status !== 200) {
      const errorText = response.data?.message || "Failed to update user theme";
      throw new Error(
        `Failed to update user theme. Status: ${response.status}. Message: ${errorText}`
      );
    }
    return response.status;
  } catch (error) {
    console.error("Failed to update user theme:", error);
    throw error;
  }
};

export interface UserMessengers {
    id: string;
    name: string;
    image: string;
    newMessagesCount: number;
    lastMessage: string;
    lastMessageTime: string;
}
export const getUserMessengers = async ({
  userId,
}: {
  userId: number;
}): Promise<UserMessengers[]> => {
  try {
    const response = await api.get(
      `/Messages/user-messages?loggedUserId=${userId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching userSenders:", error);
    throw error;
  }
};

export const getMesseges = async ({
  senderId,
  receiverId,
  skip,
  take
}: {
  senderId: number;
  receiverId: number;
  skip: number;
  take: number
}): Promise<any[]> => {
  try {
    const response = await api.get(
      `/Messages/conversation?senderId=${senderId}&receiverId=${receiverId}&skip=${skip}&take=${take}`
    );
    const userSenders: UserMessengers[] = await response.data;
    return userSenders;
  } catch (error) {
    console.error("Error fetching conversation:", error);
    throw error;
  }
};

export const registerForPushNotificationsAsync = async () => {
  let token;
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    alert("Permission to access notifications was denied.");
    return null;
  }

  token = (await Notifications.getExpoPushTokenAsync()).data;
  return token;
};
