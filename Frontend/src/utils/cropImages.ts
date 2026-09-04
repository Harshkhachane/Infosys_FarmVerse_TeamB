export const getCropImage = (crop: string): string => {
  switch (crop) {
    case "Wheat":
      return "https://images.pexels.com/photos/326082/pexels-photo-326082.jpeg?auto=compress&cs=tinysrgb&w=1200";
    case "Rice":
      return "https://images.pexels.com/photos/4110251/pexels-photo-4110251.jpeg?auto=compress&cs=tinysrgb&w=1200";
    case "Sugarcane":
      return "https://images.pexels.com/photos/2254097/pexels-photo-2254097.jpeg?auto=compress&cs=tinysrgb&w=1200";
    case "Cotton":
      return "https://images.pexels.com/photos/32796552/pexels-photo-32796552.jpeg?auto=compress&cs=tinysrgb&w=1200";
    case "Soybeans":
      return "https://images.pexels.com/photos/3338494/pexels-photo-3338494.jpeg?auto=compress&cs=tinysrgb&w=1200";
    case "Corn":
    case "Maize":
      return "https://images.pexels.com/photos/1459331/pexels-photo-1459331.jpeg?auto=compress&cs=tinysrgb&w=1200";
    case "Tomato":
      return "https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg?auto=compress&cs=tinysrgb&w=1200";
    default:
      return "https://images.pexels.com/photos/4110251/pexels-photo-4110251.jpeg?auto=compress&cs=tinysrgb&w=1200";
  }
};