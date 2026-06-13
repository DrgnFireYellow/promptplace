import mongoose from "mongoose";

const schema = mongoose.Schema({
  name: { type: String, required: true },
  template: { type: String, default: "" },
  fragmentOverrides: { type: {} },
});

export default mongoose.models.Prompt || mongoose.model("Prompt", schema);
