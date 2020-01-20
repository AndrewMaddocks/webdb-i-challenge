const express = require("express");

const knex = require("./data/dbConfig.js");

const server = express();

server.use(express.json());
// ✅
server.get("/", (req, res) => {
  res.send("<h3>DB Helpers with knex</h3>");
});
// ✅
server.get("/accounts", (req, res) => {
  knex
    .select("*")

    .from("accounts")
    .then(acct => {
      res.status(200).json(acct);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        errorMessage: "error getting the accounts"
      });
    });
});
// ✅
server.get("/accounts/:id", (req, res) => {
  knex
    .select("*")
    .from("accounts")
    // .where("id", "=", req.params.id)
    // .where("prize", ">", 30)
    .where({ id: req.params.id })
    .first() // equivalent to post[0] takes off the array
    .then(acct => {
      res.status(200).json(acct);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        errorMessage: "error getting the post"
      });
    });
});
// ✅
server.post("/accounts", (req, res) => {
  const accountData = req.body;
  //insert into () values ()
  // please validate before calling the database
  knex("accounts")
    .insert(accountData, "id") //second argument will show warning on console when using sQlite its OK it is there for the future using postgresSQL
    .then(ids => {
      // returns an array of one element, the id of the last record inserted
      const id = ids[0];

      return knex("accounts")
        .select("id", "name", "budget")
        .where({ id })
        .first()
        .then(post => {
          res.status(201).json(post);
        });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        errorMessage: "error adding the account"
      });
    });
});
// ✅
server.put("/accounts/:id", (req, res) => {
  const { id } = req.params;
  const changes = req.body;

  // validate the data
  knex("accounts")
    .where({ id }) //always filter on update and delete
    .update(changes)
    .then(count => {
      if (count > 0) {
        res.status(200).json({
          message: ` ${count} record updated`
        });
      } else {
        res.status(404).json({ message: "account not found" });
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        errorMessage: "error updating the account"
      });
    });
});
// ✅
server.delete("/accounts/:id", (req, res) => {
  const { id } = req.params;

  // validate the data
  knex("accounts")
    .where({ id }) //always filter on update and delete
    .delete()
    .then(count => {
      res.status(200).json({
        message: ` ${count} record deleted`
      });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        errorMessage: "error deleting the account"
      });
    });
});
module.exports = server;
