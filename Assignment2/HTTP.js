import { createServer } from "http";
import fs from "fs";
import path from "path";

let port = 3000;

let readingPath = path.join(import.meta.dirname, "userData", "userData.json");
const headerJson = { "Content-Type": "application/json" };

function readingUserData() {
  return JSON.parse(fs.readFileSync(readingPath, "utf-8"));
}

function writingUserData(data) {
  fs.writeFileSync(readingPath, JSON.stringify(data), {
    encoding: "utf-8",
  });
}

function sendResponse(res, statusCode, msg) {
  res.writeHead(statusCode, headerJson);
  return res.end(JSON.stringify(msg));
}

function getId(url) {
  return url.split("/").at(-1);
}

let server = createServer((req, res) => {
  let { method, url } = req;
  const usersData = readingUserData();

  //=========== Add User ===========
  if (method === "POST" && url === "/user") {
    let body = "";
    req.on("data", (data) => (body += data));

    req.on("end", () => {
      let userInfo = JSON.parse(body);

      const userIndex = usersData.findIndex((user) => {
        return user.email == userInfo.email;
      });

      // if there is user
      if (userIndex > -1) {
        sendResponse(res, 409, {
          msg: "Email alrerady exists",
        });
      } else {
        const maxId = usersData.reduce((max, user) => {
          return user.id > max ? user.id : max;
        }, 0);
        userInfo.id = maxId + 1;

        usersData.push(userInfo);
        writingUserData(usersData);

        console.log("user added");

        res.writeHead(201, headerJson);
        return res.end(
          JSON.stringify({
            msg: "User added successfully.",
          }),
        );
      }
    });
  }
  //================================
  //=========== Updates User =======
  else if (method === "PATCH" && url.startsWith("/user/")) {
    const userId = getId(url);
    let body = "";

    req.on("data", (data) => (body += data));

    req.on("end", () => {
      let userInfo = JSON.parse(body);
      const userIndex = usersData.findIndex((user) => {
        return user.id == userId;
      });

      if (userIndex !== -1) {
        // 3shan atgnb user id modification
        delete userInfo.id;
        // partially updtaes
        usersData[userIndex] = {
          ...usersData[userIndex],
          ...userInfo,
        };

        writingUserData(usersData);
        sendResponse(res, 200, {
          msg: "User updated",
        });
      } else {
        sendResponse(res, 404, {
          err: "Id not found",
        });
      }
    });
  }
  //================================
  //=========== Delete User ========
  else if (method === "DELETE" && url.startsWith("/user/")) {
    let userId = getId(url);
    const userIndex = usersData.findIndex((user) => user.id == userId);

    if (userIndex !== -1) {
      usersData.splice(userIndex, 1);

      writingUserData(usersData);

      sendResponse(res, 200, {
        msg: "User deleted",
      });
    } else {
      sendResponse(res, 404, {
        err: "User not found",
      });
    }
  }
  //================================
  //=========== Get Users ==========
  else if (method === "GET" && url === "/users") {
    if (usersData.length > 0) {
      sendResponse(res, 200, usersData);
    } else {
      res.writeHead(204, headerJson);
      return res.end(
        JSON.stringify({
          msg: "no content",
        }),
      );
    }
  }
  //================================
  //=========== Get User ==========
  else if (method === "GET" && url.startsWith("/user/")) {
    const userId = getId(url);

    const userIndex = usersData.findIndex((user) => {
      return user.id == userId;
    });

    if (userIndex !== -1) {
      res.writeHead(200, headerJson);
      delete usersData[userIndex].id;
      return res.end(
        JSON.stringify({
          user: usersData[userIndex],
        }),
      );
    } else {
      sendResponse(res, 404, {
        err: "User not found",
      });
    }
  }
  //================================
  //=========== 404 Route ==========
  else {
    sendResponse(res, 404, {
      err: "404 api not found",
    });
  }
  //================================
});

server.listen(port, () => {
  console.log("Server Ready");
});
server.on("error", (err) => {
  console.log(err.message);
});
