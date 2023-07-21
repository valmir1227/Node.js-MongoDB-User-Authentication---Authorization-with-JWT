const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;

const checkDuplicateUsernameOrEmail = (req, res, next) => {
  // Verificar o nome de usuário
  User.findOne({
    username: req.body.username,
  })
    .then((user) => {
      if (user) {
        return res
          .status(400)
          .send({ message: "Falha! Nome de usuário já está em uso!" });
      }

      // Verificar o e-mail
      User.findOne({
        email: req.body.email,
      })
        .then((user) => {
          if (user) {
            return res
              .status(400)
              .send({ message: "Falha! E-mail já está em uso!" });
          }

          // Se nenhum usuário com o mesmo nome de usuário ou e-mail for encontrado, prosseguir para o próximo middleware
          next();
        })
        .catch((err) => {
          res.status(500).send({ message: err.message });
        });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

const checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
        return res.status(400).send({
          message: `Falha! Função ${req.body.roles[i]} não existe`,
        });
      }
    }
  }
  next();
};

const verifySignUp = {
  checkDuplicateUsernameOrEmail,
  checkRolesExisted,
};

module.exports = verifySignUp;
