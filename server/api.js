/*
 |--------------------------------------
 | Dependencies
 |--------------------------------------
 */

const jwt = require('express-jwt');
const jwks = require('jwks-rsa');
const Event = require('./models/Event');
const Rsvp = require('./models/Rsvp');
const Dcomment = require('./models/Dcomment');
const Donation = require('./models/Donations')

/*
 |--------------------------------------
 | Authentication Middleware
 |--------------------------------------
 */

module.exports = function(app, config) {
  // Authentication middleware
  const jwtCheck = jwt({
    secret: jwks.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: `https://${config.AUTH0_DOMAIN}/.well-known/jwks.json`
    }),
    audience: config.AUTH0_API_AUDIENCE,
    issuer: `https://${config.AUTH0_DOMAIN}/`,
    algorithm: 'RS256'
  });

  // Check for an authenticated admin user
  const adminCheck = (req, res, next) => {
    const roles = req.user[config.NAMESPACE] || [];
    if (roles.indexOf('admin') > -1) {
      next();
    } else {
      res.status(401).send({message: 'Not authorized for admin access'});
    }
  }

/*
 |--------------------------------------
 | API Routes
 |--------------------------------------
 */

  const _eventListProjection = 'title startDatetime endDatetime viewPublic';
  const _donationsListProjection = 'itemName viewPublic donatedDatetime';
  // GET API root
  app.get('/api/', (req, res) => {
    res.send('API works');
  });

  // GET list of public events starting in the future
  app.get('/api/events', (req, res) => {
    Event.find({viewPublic: true, startDatetime: { $gte: new Date() }},
      _eventListProjection, (err, events) => {
        let eventsArr = [];
        if (err) {
          return res.status(500).send({message: err.message});
        }
        if (events) {
          events.forEach(event => {
            eventsArr.push(event);
          });
        }
        res.send(eventsArr);
      }
    );
  });

    // GET list of items public items
    app.get('/api/donations', (req, res) => {
      Donation.find({viewPublic: true},
        _donationsListProjection, (err, donations) => {
          let donationsArr = [];
          if (err) {
            return res.status(500).send({message: err.message});
          }
          if (donations) {
            donations.forEach(donation => {
              donationsArr.push(donation);
            });
          }
          res.send(donationsArr);
        }
      );
    });


  // GET list of all events, public and private (admin only)
  app.get('/api/events/admin', jwtCheck, adminCheck, (req, res) => {
    Event.find({}, _eventListProjection, (err, events) => {
        let eventsArr = [];
        if (err) {
          return res.status(500).send({message: err.message});
        }
        if (events) {
          events.forEach(event => {
            eventsArr.push(event);
          });
        }
        res.send(eventsArr);
      }
    );
  });

    // GET list of all donations, public and private (admin only)
    app.get('/api/donations/admin', jwtCheck, adminCheck, (req, res) => {
      Donation.find({}, _donationsListProjection, (err, donations) => {
          let donationsArr = [];
          if (err) {
            return res.status(500).send({message: err.message});
          }
          if (donations) {
            donations.forEach(donation => {
              donationsArr.push(donation);
            });
          }
          res.send(donationsArr);
        }
      );
    });

  // GET event by event ID
  app.get('/api/event/:id', jwtCheck, (req, res) => {
    Event.findById(req.params.id, (err, event) => {
      if (err) {
        return res.status(500).send({message: err.message});
      }
      if (!event) {
        return res.status(400).send({message: 'Event not found.'});
      }
      res.send(event);
    });
  });

    // GET donatiion by event ID
    app.get('/api/donations/:id', jwtCheck, (req, res) => {
      Donation.findById(req.params.id, (err, event) => {
        if (err) {
          return res.status(500).send({message: err.message});
        }
        if (!event) {
          return res.status(400).send({message: 'item not found.'});
        }
        res.send(event);
      });
    });

  // GET RSVPs by event ID
  app.get('/api/event/:eventId/rsvps', jwtCheck, (req, res) => {
    Rsvp.find({eventId: req.params.eventId}, (err, rsvps) => {
      let rsvpsArr = [];
      if (err) {
        return res.status(500).send({message: err.message});
      }
      if (rsvps) {
        rsvps.forEach(rsvp => {
          rsvpsArr.push(rsvp);
        });
      }
      res.send(rsvpsArr);
    });
  });

    // GET dcomments by event ID
    app.get('/api/event/:eventId/dcomments', jwtCheck, (req, res) => {
      Dcomment.find({eventId: req.params.eventId}, (err, dcomments) => {
        let dcommentsArr = [];
        if (err) {
          return res.status(500).send({message: err.message});
        }
        if (dcomments) {
          dcomments.forEach(dcomment => {
            dcommentsArr.push(dcomment);
          });
        }
        res.send(dcommentsArr);
      });
    });

  // GET list of upcoming events user has RSVPed to
  app.get('/api/events/:userId', jwtCheck, (req, res) => {
    Rsvp.find({userId: req.params.userId}, 'eventId', (err, rsvps) => {
      const _eventIdsArr = rsvps.map(rsvp => rsvp.eventId);
      const _rsvpEventsProjection = 'title startDatetime endDatetime';
      let eventsArr = [];

      if (err) {
        return res.status(500).send({message: err.message});
      }
      if (rsvps) {
        Event.find(
          {_id: {$in: _eventIdsArr}, startDatetime: { $gte: new Date() }},
          _rsvpEventsProjection, (err, events) => {
          if (err) {
            return res.status(500).send({message: err.message});
          }
          if (events) {
            events.forEach(event => {
              eventsArr.push(event);
            });
          }
          res.send(eventsArr);
        });
      }
    });
  });

  // POST a new event
  app.post('/api/event/new', jwtCheck, adminCheck, (req, res) => {
    Event.findOne({
      title: req.body.title,
      location: req.body.location,
      startDatetime: req.body.startDatetime}, (err, existingEvent) => {
      if (err) {
        return res.status(500).send({message: err.message});
      }
      if (existingEvent) {
        return res.status(409).send({message: 'You have already created an event with this title, location, and start date/time.'});
      }
      const event = new Event({
        title: req.body.title,
        location: req.body.location,
        startDatetime: req.body.startDatetime,
        endDatetime: req.body.endDatetime,
        description: req.body.description,
        viewPublic: req.body.viewPublic
      });
      event.save((err) => {
        if (err) {
          return res.status(500).send({message: err.message});
        }
        res.send(event);
      });
    });
  });

// POST a new donation
app.post('/api/donations/new', jwtCheck, adminCheck, (req, res) => {
  Donation.findOne({
    itemName: req.body.itemName,
    donatedBy: req.body.donatedBy,
    quantity: req.body.quantity,
    MT: req.body.MT,
    category:  req.body.category,
    donatedDatetime: req.body.donatedDatetime}, (err, existingEvent) => {
    if (err) {
      return res.status(500).send({message: err.message});
    }
  // if (existingEvent) {
    //  return res.status(409).send({message: 'You have already created an item with this name, location, and start date/time.'});
   // }
   
    const donation = new Donation({
      itemName: req.body.itemName,
      donatedBy: req.body.donatedBy,
      quantity: req.body.quantity,
      MT: req.body.quantity,
      category:  req.body.category,
      donatedDatetime: req.body.donatedDatetime,
      description: req.body.description,
      viewPublic: req.body.viewPublic
    });
    donation.save((err) => {
      if (err) {
        return res.status(500).send({message: 'test' +err.message});
      }
      res.send(donation);
    });
  });
});

  // PUT (edit) an existing event
  app.put('/api/event/:id', jwtCheck, adminCheck, (req, res) => {
    Event.findById(req.params.id, (err, event) => {
      if (err) {
        return res.status(500).send({message: err.message});
      }
      if (!event) {
        return res.status(400).send({message: 'Event not found.'});
      }
      event.title = req.body.title;
      event.location = req.body.location;
      event.startDatetime = req.body.startDatetime;
      event.endDatetime = req.body.endDatetime;
      event.viewPublic = req.body.viewPublic;
      event.description = req.body.description;

      event.save(err => {
        if (err) {
          return res.status(500).send({message: err.message});
        }
        res.send(event);
      });
    });
  });



 // PUT (edit) an existing donation
 app.put('/api/donations/:id', jwtCheck, adminCheck, (req, res) => {
  Donation.findById(req.params.id, (err, donation) => {
    if (err) {
      return res.status(500).send({message: err.message});
    }
    if (!donation) {
      return res.status(400).send({message: 'donation not found.'});
    }
    donation.itemName = req.body.itemName;
    donation.donatedBy = req.body.donatedBy;
    donation.quantity = req.body.quantity,
    donation.MT = req.body.quantity,
    donation.category = req.body.category;
    donation.donatedDatetime = req.body.donatedDatetime;
    donation.description = req.body.description;
    donation.viewPublic = req.body.viewPublic;

    donation.save(err => {
      if (err) {
        return res.status(500).send({message: err.message});
      }
      res.send(donation);
    });
  });
});



  // DELETE an event and all associated RSVPs
  app.delete('/api/event/:id', jwtCheck, adminCheck, (req, res) => {
    Event.findById(req.params.id, (err, event) => {
      if (err) {
        return res.status(500).send({message: err.message});
      }
      if (!event) {
        return res.status(400).send({message: 'Event not found.'});
      }
      Rsvp.find({eventId: req.params.id}, (err, rsvps) => {
        if (rsvps) {
          rsvps.forEach(rsvp => {
            rsvp.remove();
          });
        }
        event.remove(err => {
          if (err) {
            return res.status(500).send({message: err.message});
          }
          res.status(200).send({message: 'Event and RSVPs successfully deleted.'});
        });
      });
    });
  });

   // DELETE an event and all associated RSVPs
   app.delete('/api/donations/:id', jwtCheck, adminCheck, (req, res) => {
    Donation.findById(req.params.id, (err, event) => {
      if (err) {
        return res.status(500).send({message: err.message});
      }
      if (!event) {
        return res.status(400).send({message: 'Event not found.'});
      }
      Rsvp.find({eventId: req.params.id}, (err, rsvps) => {
        if (rsvps) {
          rsvps.forEach(rsvp => {
            rsvp.remove();
          });
        }
        event.remove(err => {
          if (err) {
            return res.status(500).send({message: err.message});
          }
          res.status(200).send({message: 'Event and RSVPs successfully deleted.'});
        });
      });
    });
  });

  // POST a new dcomment
  app.post('/api/dcomment/new', jwtCheck, (req, res) => {
    Dcomment.findOne({eventId: req.body.eventId, userId: req.body.userId}, (err, existingRsvp) => {
      if (err) {
        return res.status(500).send({message: err.message});
      }
      if (existingRsvp) {
        return res.status(409).send({message: 'You have already requested to this item.'});
      }
      const dcomment = new Dcomment({
        userId: req.body.userId,
        name: req.body.name,
        eventId: req.body.eventId,
        wishList: req.body.wishList,
        numberWished: req.body.numberWished,
        comments: req.body.comments
                
      });
      dcomment.save((err) => {
        if (err) {
          return res.status(500).send({message: err.message});
        }
        res.send(dcomment);
      });
    });
  });

// POST a new RSVP
app.post('/api/rsvp/new', jwtCheck, (req, res) => {
  Rsvp.findOne({eventId: req.body.eventId, userId: req.body.userId}, (err, existingRsvp) => {
    if (err) {
      return res.status(500).send({message: err.message});
    }
    if (existingRsvp) {
      return res.status(409).send({message: 'You have already RSVPed to this event.'});
    }
    const rsvp = new Rsvp({
      userId: req.body.userId,
      name: req.body.name,
      eventId: req.body.eventId,
      attending: req.body.attending,
      guests: req.body.guests,
      comments: req.body.comments
    });
    rsvp.save((err) => {
      if (err) {
        return res.status(500).send({message: err.message});
      }
      res.send(rsvp);
    });
  });
});

   // PUT (edit) an existing dcomment
   app.put('/api/rsvp/:id', jwtCheck, (req, res) => {
    Rsvp.findById(req.params.id, (err, rsvp) => {
      if (err) {
        return res.status(500).send({message: err.message});
      }
      if (!rsvp) {
        return res.status(400).send({message: 'wishlist not found.'});
      }
      if (rsvp.userId !== req.user.sub) {
        return res.status(401).send({message: 'You cannot edit someone else\'s wishlist.'});
      }
      rsvp.name = req.body.name;
      rsvp.attending = req.body.attending;
      rsvp.guests = req.body.guests;
      rsvp.comments = req.body.comments;

      rsvp.save(err => {
        if (err) {
          return res.status(500).send({message: err.message});
        }
        res.send(rsvp);
      });
    });
  });

  // PUT (edit) an existing dcomment
  app.put('/api/dcomment/:id', jwtCheck, (req, res) => {
    Dcomment.findById(req.params.id, (err, dcomment) => {
      if (err) {
        return res.status(500).send({message: err.message});
      }
      if (!dcomment) {
        return res.status(400).send({message: err.message});
      }
      if (dcomment.userId !== req.user.sub) {
        return res.status(401).send({message: 'You cannot edit someone else\'s wishlist.'});
      }
      dcomment.name = req.body.name;
      dcomment.wishList = req.body.wishList;
      dcomment.numberWished = req.body.numberWished;
      dcomment.comments = req.body.comments;
      dcomment.save(err => {
        if (err) {
          return res.status(500).send({message: err.message});
        }
        res.send(dcomment);
      });
    });
  });

};


