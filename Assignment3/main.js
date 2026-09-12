const path = require("node:path");
const fs = require("fs");
const express = require("express");
const { json } = require("body-parser");
const app = express();
const router = express.Router();

app.use(express.json());
app.use("/user", router);

let readingPath = "userData/users.json";

function readingUserData() {
  return JSON.parse(fs.readFileSync(readingPath, "utf-8"));
}
const usersData = readingUserData();

function writignUserData(userData) {
  return fs.writeFileSync(readingPath, JSON.stringify(userData), {
    encoding: "utf-8",
  });
}

function badRequest(res, status, msg) {
  res.status(status).send(
    JSON.stringify({
      msg,
    }),
  );
}

// =============== Add user =================
router.post("/", (req, res) => {
  let userId = 0;
  let userData = req.body;
  const userIndex = usersData.findIndex((user) => {
    return user.email == usersData.email;
  });

  if (userIndex != -1) {
    badRequest(res, 409, "Email already exixts");
  } else {
    const maxId = usersData.reduce((max, user) => {
      return user.id > max ? user.id : max;
    }, 0);
    userData.id = maxId + 1;

    usersData.push(userData);
    writignUserData(usersData);
    res.status(201).send(
      JSON.stringify({
        msg: "User added successfully.",
      }),
    );
  }
});
// ==========================================

// =============== Update user ==============
router.patch("/:id", (req, res) => {
  let userData = req.body;
  const userId = Number(req.params.id);
  const userIndex = usersData.findIndex((user) => {
    return user.id === userId;
  });

  console.log(userIndex);

  if (userIndex != -1) {
    delete userData.id;
    console.log(userData);

    usersData[userIndex] = {
      ...usersData[userIndex],
      ...userData,
    };
    writignUserData(usersData);

    res.status(200).send(
      JSON.stringify({
        msg: "User updated",
      }),
    );
  } else {
    badRequest(res, 404, "User ID not found");
  }
});

// ==========================================

// =============== Delete user ==============
router.delete("{/:id}", (req, res) => {
  const userId = req.params.id ? Number(req.params.id) : req.body.id;

  const userIndex = usersData.findIndex((user) => {
    return user.id === userId;
  });

  if (userIndex != -1) {
    usersData.splice(userIndex, 1);
    writignUserData(usersData);
    res.status(200).send(
      JSON.stringify({
        msg: "User deleted",
      }),
    );
  } else {
    badRequest(res, 404, "User ID not found");
  }

  console.log(userId);
});
// ==========================================

// =============== Get By Name ===============
router.get("/getByName", (req, res) => {
  let userName = req.params.name;
  let userIndex = usersData.findIndex((user) => {
    return user.name === userName;
  });

  if (userIndex != -1) {
    res.status(200).send(JSON.stringify(usersData[userIndex]));
  } else {
    badRequest(res, 404, "User name not found");
  }
});
// ===========================================

// =============== Get All Users =============
router.get("/", (req, res) => {
  res.status(200).send(JSON.stringify(usersData));
});
// ==========================================

// =============== Get by Min Age ===========
router.get("/filter", (req, res) => {
  const minAge = Number(req.query.minAge);
  const filteredUsers = usersData.filter((user) => {
    return user.age > minAge;
  });
  res.status(200).json(filteredUsers);
});
// ==========================================

// =============== Ge by Id =================
router.get("/:id", (req, res) => {
  let userId = Number(req.params.id);
  let userIndex = usersData.findIndex((user) => {
    return user.id === userId;
  });

  if (userIndex != -1) {
    res.status(200).send(JSON.stringify(usersData[userIndex]));
  } else {
    badRequest(res, 404, "User ID not found");
  }
});
// ==========================================

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
