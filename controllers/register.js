// ! REGISTER METHOD #1 (much easier to understand)
// const handleRegister = (req, res, db, bcrypt, saltRounds) => {
const handleRegister = (db, bcrypt, saltRounds) => (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    res.status(400).json("Incorrect form submission");
    return;
  }
  const hash = bcrypt.hashSync(password, saltRounds);

  // ? ASYNC LOGIN WITH SALT
  // bcrypt.hash(password, saltRounds, function (err, hash) {
  //   console.log(hash);
  // });
  db.transaction((trx) => {
    trx
      .insert({
        hash: hash,
        email: email,
      })
      .into("login")
      .returning("email")
      .then((loginEmail) => {
        return trx("users")
          .returning("*")
          .insert({
            email: loginEmail[0].email,
            name: name,
            joined: new Date(),
          })
          .then((user) => {
            res.json(user[0]);
          });
      })
      .then(trx.commit)
      .catch(trx.rollback);
  }).catch(() => res.status(400).json("Unable to create account"));
};

module.exports = {
  handleRegister: handleRegister,
};
