const express = require('express');
const router = express.Router();
const { verifyToken } = require('../controllers/authController');
const transporter = require('../config/nodemailerConfig');

const sendMail = async (email) => {
    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Trainer Request Approved',
        html: `<div style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
        <div style="background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); max-width: 400px; margin: 20px auto; text-align: center;">
            <h2 style="margin-top: 0; color: #333;">Request Approved</h2>
            <p style="font-size: 16px; color: #555;">Your request to be a trainer has been approved. Kindly confirm your registration by booking your tickets.</p>
            <a href="https://localhost:5000/book-ticket" style="display: inline-block; margin-top: 20px; padding: 10px 20px; color: #fff; background-color: #007bff; text-decoration: none; border-radius: 4px;">Book Tickets</a>
        </div>
    </div>`
    };

    await transporter.sendMail(mailOptions);
};

// Dummy function to calculate distance. Replace with actual implementation.
const calculateDistance = (location1, location2) => {
    // Implement actual distance calculation based on your needs
    // For example, you can use Haversine formula for geographical coordinates
    return Math.abs(location1 - location2); // Simple placeholder
};

// Function to get trainers based on criteria
const getFilteredTrainers = (trainers, noOfTrainer, trainerLocation) => {
    // Separate trainers into male, female, experienced, and new
    const maleTrainers = trainers.filter(trainer => trainer.gender === 'male');
    const femaleTrainers = trainers.filter(trainer => trainer.gender === 'female');
    const experiencedTrainers = trainers.filter(trainer => trainer.trainingsTaken > 5);
    const newTrainers = trainers.filter(trainer => trainer.trainingsTaken <= 5);

    // Calculate number of experienced and new trainers needed
    const experiencedCount = Math.floor(noOfTrainer * 0.6);
    const newCount = noOfTrainer - experiencedCount;

    // Helper function to sort trainers by distance
    const sortByDistance = (trainers) => {
        return trainers
            .map(trainer => ({ ...trainer, distance: calculateDistance(trainer.location, trainerLocation) }))
            .sort((a, b) => a.distance - b.distance);
    };

    // Select trainers based on experience and distance
    const selectedExperiencedTrainers = sortByDistance(experiencedTrainers).slice(0, experiencedCount);
    const selectedNewTrainers = sortByDistance(newTrainers).slice(0, newCount);

    // Combine selected trainers
    let combinedTrainers = [...selectedExperiencedTrainers, ...selectedNewTrainers];

    // Ensure gender balance
    const maleCount = Math.floor(combinedTrainers.length / 2);
    const femaleCount = combinedTrainers.length - maleCount;

    let maleTrainersFiltered = combinedTrainers.filter(trainer => trainer.gender === 'male').slice(0, maleCount);
    let femaleTrainersFiltered = combinedTrainers.filter(trainer => trainer.gender === 'female').slice(0, femaleCount);

    // Adjust if not enough males or females
    if (maleTrainersFiltered.length < maleCount) {
        const additionalMales = maleTrainers.slice(0, maleCount - maleTrainersFiltered.length);
        maleTrainersFiltered = [...maleTrainersFiltered, ...additionalMales];
    }

    if (femaleTrainersFiltered.length < femaleCount) {
        const additionalFemales = femaleTrainers.slice(0, femaleCount - femaleTrainersFiltered.length);
        femaleTrainersFiltered = [...femaleTrainersFiltered, ...additionalFemales];
    }

    // Merge and return the final list ensuring it meets the requested number
    combinedTrainers = [...maleTrainersFiltered, ...femaleTrainersFiltered].slice(0, noOfTrainer);
    return combinedTrainers;
};

router.post('/validate', verifyToken, async (req, res) => {
    const validatedData = req.body.validatedData;
    const noOfTrainer = parseInt(req.body.number, 10) ;
    const trainerLocation = parseFloat(req.body.trainerLocation); // Assume location is a numeric value for simplicity

    try {
        const trainers = validatedData; // Assuming validatedData is an array of trainers

        const filteredTrainers = getFilteredTrainers(trainers, noOfTrainer, trainerLocation);

        for (let i = 0; i < filteredTrainers.length; i++) {
            sendMail(filteredTrainers[i].email); // Access the email property
        }

        res.status(200).json(filteredTrainers);
    } catch (err) {
        console.log(err.message);
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
