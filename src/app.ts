import express from 'express';
import ingest from './ingest'

const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.send('Hello Express World!');
});

app.listen(port, () => {
    console.log(`Express is listening at http://localhost:${port}`);
    void ingest()
});
