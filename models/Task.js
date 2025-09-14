const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "タスク名を入れてください"],
        trim:true,
        maxlength: [20, "タスク名は20文字以内で入力してください"],
    },
    completed: {
        type: Boolean,
        default: false,
    },
    category: {
        type: String,
        enum: ["仕事", "プライベート", "勉強", "その他"],
        default: "その他",
    },
    dueDate: {
        type: Date,
        default: null,
    },
});

module.exports = mongoose.model("Task",TaskSchema)
