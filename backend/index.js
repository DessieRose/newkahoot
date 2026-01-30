import mongoose from 'mongoose';

import schemaAnswers from './schemas/answers.js';
import schemaQuestions from './schemas/questions.js';
import schemaUsers from './schemas/users.js';


mongoose
    .connect(
        process.env.DB_CONNECTION,
    )
    .then(
        app.listen(port, () => {
            console.log(`NewKahoot running on port ${port}`);
        })
    )
    .catch(
        (err) => {
            console.error('Failed to connect to MongoDB', err);
        }
    );