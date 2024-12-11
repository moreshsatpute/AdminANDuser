const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Store as plain text
  role: { type: String, default: 'user', enum: ['user', 'admin'] },
}, { timestamps: true });


// Remove the pre-save hook for hashing
// userSchema.pre('save', async function (next) {
//   if (!this.isModified('password')) {
//     next();
//   }
//   this.password = await bcrypt.hash(this.password, 10);
// });

const User = mongoose.model('User', userSchema);
module.exports = User;