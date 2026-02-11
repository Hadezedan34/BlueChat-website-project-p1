import mongoose, { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  friendRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  image: { type: String, default: "" },
  location: {
    lat: Number,
    lng: Number,
    lastSeen: Date
  },
  friends: { type: [Schema.Types.ObjectId], ref: "User", default: [] },
  isGhostMode: { 
    type: Boolean, 
    default: false // الوضع الافتراضي أن الموقع ظاهر
  }
  
}, { timestamps: true });

// الحركة هي بتخلي Next.js ينسى أي نسخة قديمة من الموديل
if (mongoose.models.User) {
  delete mongoose.models.User;
}

const User = mongoose.model("User", UserSchema);

export default User;