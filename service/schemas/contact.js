import mongoose from "mongoose";

const Schema = mongoose.Schema;

const contact = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Enter contacts name'],
        },
        email: {
            type: String
        },
        phone: {
            type: String
        },
        favorite: {
            type: Boolean,
            default: false
        },
    },
    { versionKey: false, timestamps: true }
)

const Contact = mongoose.model('contact', contact);

export default Contact;