// Define the addUser function
module.exports.addUser = async function (user) {

  console.log("user---",user)
  const lengthObj = Object.keys(user).length;
  try {
    return await new Promise((resolve, reject) => {
      dbConnection.run(
        `INSERT INTO users (${Object.keys(user).toString()}) 
               VALUES 
                  (${Array.from({ length: lengthObj }, () => "?").join(",")})`,
        Object.values(user),
        (err, data) => {
          console.log("data--" , err, data);
          if (err) {
            console.error("Error inserting user:", err);
            reject(err);
          } else {
            console.info("User inserted");
            resolve(true);
          }
        }
      );
    });
  } catch (err) {
    throw err;
  }
};

// Define the getUser function
module.exports.getUser = async function (params) {
  try {
    let conVAl = [];
    let sql = `SELECT * FROM users WHERE `;
    if (params?.id) {
      sql += `id = ?`;
      conVAl.push(params.id);
    }
    sql += "1=1";

    console.log('--------', sql);

    return await new Promise((resolve, reject) => {
      dbConnection.all(sql, conVAl, (err, row) => {
        if (err) {
          console.error("Error fetching user:", err);
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
 
  } catch (err) {
    throw err;
  }
};

// Define the updateUser function
module.exports.updateUser = async function (userId, params) {
  try {
    let conVals = [];
    let setClause = "";

    // Generate SET clause dynamically based on params
    Object.keys(params).forEach((key, index) => {

      setClause += `${key} = ?`;

      conVals.push(params[key]);

      if (index !== Object.keys(params).length - 1) {
        setClause += ", ";
      }

    });

    // Add userId to the conVals array
    conVals.push(userId);

    // Execute the UPDATE query
    await new Promise((resolve, reject) => {
      dbConnection.run(
        `UPDATE users SET ${setClause} WHERE id = ?`,
        conVals,
        (err) => {
          if (err) {
            console.error("Error updating user:", err);
            reject(err);
          } else {
            console.info("User updated");
            resolve(true);
          }
        }
      );
    });

  } catch (err) {
    throw err;
  }
};

// Define the getUserByUsernameAndPassword function
module.exports.getUserByUsernameAndPassword = async function (username, password) {
  try {
      const user = await new Promise((resolve, reject) => {
          dbConnection.get(
              "SELECT * FROM users WHERE email = ? AND password = ?",
              [username, password],
              (err, row) => {
                  if (err) {
                      reject(err);
                  } else {
                      resolve(row);
                  }
              }
          );
      });
      return user;
  } catch (err) {
      throw err;
  }
};