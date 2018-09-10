import * as Express from 'express';
import * as CORS from 'cors';

const app: Express.Application = Express();

app.use(CORS);

app.listen(80, () => {
    console.log("TEAM WE'LL FIGURE IT OUT");
    console.log("APPLICATION BACKEND");
    console.log("########################");
    console.log("RUNNING REVISION 1.0");
});

app.get('/', (req, res) => {
    console.log("received new request");
    res.json({
        server: "wfio",
        time: Date(),
        online: true,
        message: "Example response message",
    });
});
