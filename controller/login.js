const { noTryCatch } = require("../functions/notrycatch");
const { connectDB, disconnectDB } = require("../configurations/connectpg");
const { encrypt, matched } = require("../functions/decryptencryptpassword");
const { StatusCodes } = require("http-status-codes");
const { createcode } = require("../functions/createcode");
const { createJWT, decodeJWT } = require("../functions/createJWT");
const customError = require("../functions/customerror");
const { sendmail } = require("../functions/nodemailer");

const loginController = noTryCatch(async (req, res) => {
  let { email, password, role } = req.body;

  const client = await connectDB();

  let pgres = await client.query(
    `select * from USER_CREDENTIAL where email=$1 and role=$2`,
    [email,role]
  );
  if (pgres.rows.length == 0)
    return res.json({ msg: "invalid email or password or role" });
  const username = pgres.rows[0].username;
  encode_password = await matched(password, pgres.rows[0].password);
  if (encode_password) {
    const access_token = createJWT(
      { email, username, role },
      { expiresIn: "1 yr" },
      "access"
    );
    const refresh_token = createJWT(
      { email, username, role },
      { expiresIn: "1 yr" },
      "refresh"
    );
    res.cookie("refresh_token", refresh_token, { httpOnly: true });
    return res.json({ access_token, username });
  } else {
    return res.json({ msg: "email or password is incorrect" });
  }
});

const registerController = noTryCatch(async (req, res, next) => {
  //this is how user must send me data

  const { email, password, username } = req.body;

  const client = await connectDB();
  await client.query(`CREATE TABLE IF NOT EXISTS USER_CREDENTIAL (
    email VARCHAR(320) NOT NULL unique,
    password VARCHAR(100) NOT NULL CHECK (LENGTH(password) >= 8 AND
                                           password ~ '[A-Z]' AND
                                           password ~ '[0-9]' AND
                                           password ~ '[a-z]' AND
                                           password ~ '[^A-Za-z0-9]'),
    username varchar(100) primary key,
    role varchar(8) default 'customer' check (role in  ('admin','customer','vendor')),
    id serial 
);`);

  let pgres = await client.query(
    `select * from USER_CREDENTIAL where email=$1`,
    [email]
  );

  if (pgres.rows.length != 0)
    return next(
      new customError("Email is already used", StatusCodes.NOT_FOUND)
    );

  const code = createcode();
  const token = createJWT({ email, code, username, password }, "register", {
    expiresIn: 5 * 60,
  });
  await sendmail(email, code, next);
  res.cookie("email_token", token, {
    httpOnly: true,
    secure: true,
  });
  return res.status(StatusCodes.OK).json({ msg: "email is sent" }); //remove code later
});

const emailverifyController = noTryCatch(async (req, res, next) => {
  //this is how user send data after hitting submit in verification page number must send in string
  const token = req.cookies.email_token;

  const code = req.body.code;
  // const decodecode=createcode(token)
  const decode = decodeJWT(token);
  const { email, role, username } = decode;
  if (code == decode.code) {
    const password = await encrypt(decode.password);
    console.log(decode);

    const client = await connectDB();
    await client.query(
      `insert into USER_CREDENTIAL(email,password,username) values($1,$2,$3)`,
      [email, password, username]
    );
    return res.json({ msg: "Registered successfully" });
  } else {
    res.json({ msg: "Incorrect OTP code" });
  }
});

const updatePasswordController = noTryCatch(async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  console.log("inside updatepasswordcontroller");
  const { email } = decodeJWT(token, "access");
  let { oldPassword, newPassword } = req.body;
  const client = await connectDB("vendors");
  const pgres = await client.query(
    "select * from vendor_credentials where email=$1",
    [email]
  );
  const oldPasswordEncrypt = pgres.rows[0].password;
  const ispasswordsame = await matched(oldPassword, oldPasswordEncrypt);
  console.log(ispasswordsame);
  if (ispasswordsame) {
    newPassword = await encrypt(newPassword);
    await client.query(
      "update vendor_credentials set password=$1 where email=$2",
      [newPassword, email]
    );
    res.status(StatusCodes.OK).json({
      msg: `Password is updated ${newPassword},${oldPasswordEncrypt}`,
    });
  } else {
    return res.json({ msg: "password is incorrect" });
  }
});

//for the forgetting of password
const requestresetpasswordController = noTryCatch(async (req, res, next) => {
  const { email } = req.body;
  const client = await connectDB("vendors");
  let pgres = await client.query(
    `select * from vendor_credentials where email=$1`,
    [email]
  );

  if (pgres.rows.length == 0)
    return next(
      new customError("Email is not registered", StatusCodes.NOT_FOUND)
    );

  const code = createcode();
  const token = createJWT({ email, code });
  await sendmail(email, code, next);
  return res.status(StatusCodes.OK).json({ token: token }); //remove code later
});

//for the updating of the reseting password
const resetpasswordController = noTryCatch(async (req, res) => {
  let { token, code, password } = req.body;
  const decodecode = decodeJWT(token);
  if (code == decodecode) {
    const newPassword = await encrypt(password);
    const client = await connectDB("vendors");
    await client.query(
      "update vendor_credentials set password=$1 where email=$2",
      [newPassword, email]
    );
    res.json({ msg: "updated successfully" });
  } else {
    res.json({ msg: "incorrect code" });
  }
});

const displayCredentials = noTryCatch(async (req, res) => {
  const client = await connectDB();
  const pgres = await client.query(`select * from USER_CREDENTIAL`);
  res.json(pgres.rows);
});

module.exports = {
  registerController,
  emailverifyController,
  loginController,
  updatePasswordController,
  requestresetpasswordController,
  resetpasswordController,
  displayCredentials,
};
