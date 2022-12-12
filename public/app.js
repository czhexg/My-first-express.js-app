const express = require("express");
const mailchimp = require("@mailchimp/mailchimp_marketing");

mailchimp.setConfig({
    apiKey: "YOUR API KEY",
    server: "YOUR SERVER",
});

const listId = "YOUR LIST ID";

const app = express();

app.use(express.static("public"));
app.use(express.urlencoded());

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res) => {
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let email = req.body.email;

    let member = {
        email_address: email,
        status: "subscribed",
        merge_fields: {
            FNAME: firstName,
            LNAME: lastName,
        },
    };

    async function run() {
        try {
            const response = await mailchimp.lists.addListMember(
                listId,
                member
            );

            console.log(
                `Successfully added contact as an audience member. The contact's id is ${response.id}.`
            );
            res.sendFile(__dirname + "/success.html");
        } catch (error) {
            console.log("Failed to add contact");
            res.sendFile(__dirname + "/failure.html");
        }
    }

    run();
});

app.listen(3000, () => {
    console.log("Server is running on port 3000!");
});
