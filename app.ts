import * as Express from 'express';

const app: Express.Application = Express();

app.listen(80, () => {
    console.log("TEAM WE'LL FIGURE IT OUT");
    console.log("APPLICATION BACKEND");
    console.log("########################");
    console.log("RUNNING REVISION 1.0");
});

app.get('/', (req, res) => {
    res.send("We'll Figure it Out Server is Running");
});