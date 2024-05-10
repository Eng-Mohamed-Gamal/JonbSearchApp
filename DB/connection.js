

import mongoose from "mongoose";

const DB_connection = async () => {
  await mongoose
    .connect(process.env.MAIN_URL)
    .then((res) => console.log("DB DONE"))
    .catch((err) => console.log("DB FAIL"));
};


export default DB_connection ;