import mongoose, { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  friendRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  friends: { type: [Schema.Types.ObjectId], ref: "User", default: [] }
}, { timestamps: true });

// الحركة هي بتخلي Next.js ينسى أي نسخة قديمة من الموديل
if (mongoose.models.User) {
  delete mongoose.models.User;
}

const User = mongoose.model("User", UserSchema);

export default User;