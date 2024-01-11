const { noTryCatch } = require("../functions/notrycatch");
const { connectDB, disconnectDB } = require("../configurations/connectpg");
const { encrypt, matched } = require("../functions/decryptencryptpassword");
const { StatusCodes } = require("http-status-codes");
const { createcode } = require("../functions/createcode");
const { createJWT, decodeJWT } = require("../functions/JWT/createJWT");
const customError = require("../functions/customerror");
const { HttpStatusCode } = require("axios");
const { sendmail } = require("../functions/nodemailer");

const loginController = noTryCatch(async (req, res) => {
  let { email, password } = req.body;
  const client = await connectDB("vendors");

  let pgres = await client.query(
    `select * from vendor_credentials where email=$1`,
    [email]
  );
  if (pgres.rows.length == 0)
    return res.json({ msg: "invalid email or password" });
  encode_password = await matched(password, pgres.rows[0].password);
  if (encode_password) {
    const access_token = createJWT({ email }, { expiresIn: 60 * 5 }, "access");
    const refresh_token = createJWT({ email }, { expiresIn: "1d" }, "refresh");
    res.cookie("refresh_token", refresh_token, { httpOnly: true });
    return res.json({ access_token });
  } else {
    return res.json({ msg: "email or password is incorrect" });
  }
});

const registerController = noTryCatch(async (req, res, next) => {
  //this is how user must send me data
  const { email, password,username} = req.body;

  const client = await connectDB("vendors");
  let pgres = await client.query(
    `select * from vendor_credentials where email=$1`,
    [email]
  );

  if (pgres.rows.length != 0)
    return next(
      new customError("Email is already used", StatusCodes.NOT_FOUND)
    );

  const code = createcode();
  const token = createJWT({ email, code });

  //errorc
  //this is the format i send to user on hitting submit in register page
  await sendmail(email, code, next);
  return res.status(StatusCodes.OK).json({ token: token }); //remove code later
});

const emailverifyController = noTryCatch(async (req, res) => {
  //this is how user send data after hitting submit in verification page number must send in string
  const token = req.headers.authorization.split(" ")[1];
  const code = req.body.code;
  const email = req.body.email;
  // const decodecode=createcode(token)
  const decode = decodeJWT(token);
  console.log(decode);
  if (code == decode.code && email == decode.email) {
    const password = await encrypt(decode.password);
    console.log(password);
    const client = await connectDB("vendors");
    await client.query(
      `insert into vendor_credentials(email,password) values($1,$2)`,
      [email, password]
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
    res
      .status(StatusCodes.OK)
      .json({
        msg: `Password is updated ${newPassword},${oldPasswordEncrypt}`,
      });
  } else {
    return res.json({ msg: "password is incorrect" });
  }
});

//for the forgetting of password
const requestresetpasswordController = noTryCatch(async (req, res,next) => {
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

module.exports = {
  registerController,
  emailverifyController,
  loginController,
  updatePasswordController,
  requestresetpasswordController,
  resetpasswordController,
};
