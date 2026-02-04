import mongoose from "mongoose";
import express from "express";

// import schemaAnswers from "./schemas/answers.js";
// import schemaQuestions from "./schemas/questions.js";
// import schemaUsers from "./schemas/users.js";

import { startGameserver } from "./websockets/index.js";
startGameserver();

// mongoose
//   .connect(process.env.DB_CONNECTION)
//   .then(
//     app.listen(port, () => {
//       console.log(`NewKahoot running on port ${port}`);
//     }),
//   )
//   .catch((err) => {
//     console.error("Failed to connect to MongoDB", err);
//   });
