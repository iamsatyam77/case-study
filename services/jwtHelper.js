const jwt = require("jsonwebtoken");

module.exports.verifyJwtToken = (req, res, next) => {
  let token;
  if ("authorization" in req.headers)
    token = req.headers["authorization"].split(" ")[1];

  if (!token) {
    return res.status().json({ message: "No token provided!!" });
  } else {
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
        res.status(500).json({ message: "Token authentication failed" });
      } else {
        // add user id to request
        req.body.userId = decoded.id;
        next();
      }
    });
  }
};
