var express = require('express');
var router = express.Router();
const User = require('../models').user;
const Group = require('../models').group;
const userGroup = require('../models').userGroup;
const jwt = require('jsonwebtoken'); // sign, issue, verify JWT tokens
const jwtCheck = require('express-jwt'); // middleware for checking JWT

//Get user's groups
router.get('/', jwtCheck({
  secret: process.env.JWT_SECRET
}), function(req, res, next) {
  User.findById(req.user.id, {
      include: [{
        model: Group
      }]
    })
    .then(uG => {
      res.status(200).json(uG)
    })
});

//Create group
router.post('/new', jwtCheck({
  secret: process.env.JWT_SECRET
}), function(req, res, next) {
  User.findById(req.user.id)
    .then(user => {
      Group.create({
          name: req.body.name,
          owner_id: user.id
        })
        .then(group => {
          userGroup.create({
              user_id: user.id,
              group_id: group.id,
              unread_messages: 0
            })
            .then(function(uGroup) {
              res.status(200).json(uGroup);
            });
        })
    })
});

//add user to group
router.post('/add/:id/:username', jwtCheck({
  secret: process.env.JWT_SECRET
}), function(req, res, next) {
  User.findAll({
      where: {
        username: req.params.username
      }
    })
    .then(user => {
      userGroup.create({
          user_id: user[0].id,
          group_id: req.params.id,
          unread_messages: 0
        })
        .then(function(uGroup) {
          res.status(200).json(uGroup);
        });
    })
});

//get group members
router.get('/:id', jwtCheck({
  secret: process.env.JWT_SECRET
}), function(req, res, next) {
  Group.findById(req.params.id, {
      include: [{
        model: User
      }]
    })
    .then(response => {
      res.status(200).json({
        group: response,
        user: req.user.id
      })
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

// PUT ROUTE for group name
router.put("/:id", jwtCheck({
  secret: process.env.JWT_SECRET
}), (req, res) => {
  Group.findById(req.params.id).then((group) => {
    group.updateAttributes({
        name: req.body.name
      })
      .then((group) => {
        res.status(200).json(group)
      })
      .catch(err => {
        res.status(500).json(err);
      });
  })
});

//delete a group if you are creator
router.delete("/:id", jwtCheck({
  secret: process.env.JWT_SECRET
}), (req, res) => {
  Group.findById(req.params.id)
    .then(group => {
      //console.log("USER ID!!!", req.user.id);
      if (req.user.id === group.owner_id) {
        group.destroy()
          .then(group => {
            res.status(200).json(group)
          })
          .catch(err => {
            res.status(500).json(err);
          });
      } else {
        res.status(200).json({
            message: "failed"
          })
          .catch(err => {
            res.status(500).json(err);
          })
      }
    })
});

// delete user from group
router.delete("/:group_id/:user_id", jwtCheck({
  secret: process.env.JWT_SECRET
}), (req, res) => {
  userGroup.findOne({
      where: {
        group_id: req.params.group_id,
        user_id: req.params.user_id
      }
    })
    .then(user_group => {
      console.log('USER GROUP DELETE', user_group)
      user_group.destroy()
    })
    .then(() => {
      res.status(200).json({
        message: "deleted"
      })
    })
    .catch(err => {
      res.status(500).json(err);
    });
});



module.exports = router;
