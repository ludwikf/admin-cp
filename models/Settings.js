import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema({
  websiteTitle: {
    type: String,
    required: true,
    default: "Ludwik's Control Panel",
  },
  websiteDescription: {
    type: String,
    required: true,
    default:
      "Flexible admin panel for websites, providing full functionality and easy integration",
  },
  domain: {
    type: String,
    required: true,
    default: "ludwikfaron.com",
  },
  mainTheme: {
    type: String,
    default: "#FFA500",
  },
  secondTheme: {
    type: String,
    default: "#282828",
  },
});

export default mongoose.models.Settings ||
  mongoose.model("Settings", settingsSchema);
