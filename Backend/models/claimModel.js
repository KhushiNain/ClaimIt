const mongoose = require('mongoose');
const claimSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    claimAmount: { type: Number, required: true },
    description: { type: String, required: true },
    document: { type: String , required: true },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
    approvedAmount: { type: Number, default: 0 },
    insurerComments: { type: String },

},{ timestamps: true })

const claimModel= mongoose.model('Claim',claimSchema)
module.exports= {claimModel}