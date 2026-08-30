import mongoose, {Schema} from "mongoose"

const preferrenceSchema = new mongoose.Schema({
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    preferrenceGender: {
        type: String,
        enum: ["male","female","any"],
        default: "any"
    },

    preferrenceAgeRange: {
        min: {
            type: Number,
            min: 18,
        },
        max: {
            type: Number,
            max: 100,
        },
    },

    preferredLocation: {
        type: String,
        trim: true,
    },

    budget: {
        min: {
            type: Number,
            min: 0,
        },
        max: {
            type: Number,
            min: 0,
        },
    },
    smoking: {
        type: String,
        enum: ["yes", "no","indifferent"],
        default: "indifferent"
    },
    drinking: {
        type: String,
        enum: ["yes", "no","indifferent"],
        default: "indifferent"
    },
    pets: {
        type: String,
        enum: ["yes", "no","indifferent"],
        default: "indifferent"
    },
    cleanliness: {
        type: String,
        enum: ["yes", "no","indifferent"],
        default: "indifferent"
    },
    sleepHours: {
        type: String,
        enum: ["early", "late","flexible"],
        default: "flexible"
    },
},

{
    timestamps: true
});

const Preferrence = mongoose.model("Preferrence", preferrenceSchema);
export default Preferrence;