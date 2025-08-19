import express from 'express';

const app = express();

app.get('/api', (req, res) => {
    res.json({message: "Proxy is activated."})
})

const PORT = process.env.PORT || 3302;

app.listen(PORT, () => console.log(`Server is listening at PORT ${PORT}`))