import mongoose from 'mongoose';

// --- User Schema ---
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please provide a username'],
        unique: true,
        maxlength: [60, 'Username cannot be more than 60 characters'],
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    avatar: {
        type: String, // URL/Path to image
        default: '',
    },
    bio: {
        type: String,
        maxlength: [160, 'Bio cannot be more than 160 characters'],
        default: '',
    },
});

// --- Part Schemas ---
const PartSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a part name'],
        maxlength: [100, 'Name cannot be more than 100 characters'],
    },
    type: {
        type: String,
        required: true,
        enum: ['case', 'pcb', 'switch', 'keycap'],
    },
    price: {
        type: Number,
        required: [true, 'Please provide a price'],
        min: 0,
    },
    image: {
        type: String,
        required: [true, 'Please provide an image URL'],
    },
    // Dynamic fields based on type
    specs: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
}, { timestamps: true });

// --- Build Schema ---
const BuildSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    name: {
        type: String,
        required: [true, 'Please provide a build name'],
    },
    parts: {
        case: { type: mongoose.Schema.Types.ObjectId, ref: 'Part' },
        pcb: { type: mongoose.Schema.Types.ObjectId, ref: 'Part' },
        switch: { type: mongoose.Schema.Types.ObjectId, ref: 'Part' },
        keycap: { type: mongoose.Schema.Types.ObjectId, ref: 'Part' },
    },
    totalPrice: {
        type: Number,
        default: 0,
    },
    favorite: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

// Prevent overwrite on hot reload
export const User = mongoose.models.User || mongoose.model('User', UserSchema);
export const Part = mongoose.models.Part || mongoose.model('Part', PartSchema);
export const Build = mongoose.models.Build || mongoose.model('Build', BuildSchema);
