import app from './app.js'
import connectionToDB from './config/dbConnection.js';

const PORT = process.env.PORT || 5500;

app.listen(PORT, async ()=>{
    await connectionToDB()
    console.log(`server running at http://localhost:${PORT}`);
});

