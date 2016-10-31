const Venue = require('../models/venue');

function VenueAdd(req, res){
  Venue.create(req.body, (err, Venue) => {
    if (err){
      console.log(err);
      return res.status(500).json({ message: "Ain't not Venues here!"});
    }
    return res.status(201).json({
      message: "Success, that's a nice a Venue",
      Venue
    });
  });
}

function VenueIndex(req,res){
  Venue.find((err,Venues)=>{
    if (err){
      console.log(err);
      return res.status(500).json({ message: "Ain't not Venues here!"});
    }
    return res.status(200).json(Venues);

  });
}

function VenueShow(req, res){
  Venue.findById(req.params.id, (err, Venue) => {
    if (err){
      console.log(err);
      return res.status(500).json({ message: "Ain't not Venues here!"});
    }
    return res.status(200).json(Venue);
  });
}

function VenueUpdate(req, res){
  Venue.findByIdAndUpdate(req.params.id, req.body, { new: true}, (err, Venue) => {
    console.log(req.params.id, req.body);
    if (err){
      console.log(err);
      return res.status(500).json({ message: "Ain't not Venues here!"});

    }
    if (!Venue) {
      return res.status(404).json({ message: "No Venue, no see"});
    }
    return res.status(200).json(Venue);
  });
}

function VenueDelete(req, res){
  Venue.findByIdAndRemove(req.params.id, (err, Venue) => {
    if (err){
      console.log(err);
      return res.status(500).json({ message: "Ain't not Venues here!"});

    }
    if (!Venue) {
      return res.status(404).json({ message: "No Venue, no see"});
    }
    return res.status(204).send();
  });
}

module.exports = {
  add: VenueAdd,
  index: VenueIndex,
  show: VenueShow,
  update: VenueUpdate,
  delete: VenueDelete
};
