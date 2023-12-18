import mongoose from "mongoose";

const emailTemplateSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subject: { type: String, required: true },
  content: { type: String, required: true },
});

export default mongoose.models.EmailTemplate ||
  mongoose.model("EmailTemplate", emailTemplateSchema);
