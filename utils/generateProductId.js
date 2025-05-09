const Counter = require("../models/productCounter");

const getNextSequenceValue = async (sequenceName) => {
    try {
        const counter = await Counter.findByIdAndUpdate(
            sequenceName,
            { $inc: { sequence_value: 1 } },
            { new: true, upsert: true }
        );
        return counter.sequence_value;
    } catch (error) {
        console.error('Error in sequence generation:', error);
        throw error;
    }
};

// Generate sequential product ID
const generateProductId = async () => {
    try {
        const sequenceNumber = await getNextSequenceValue('productId');
        return `PROD-${String(sequenceNumber).padStart(5, '0')}`;
    } catch (error) {
        throw new Error('Failed to generate product ID');
    }
};
module.exports=generateProductId