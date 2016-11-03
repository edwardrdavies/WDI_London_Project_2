const Place = require('../models/place.js');


function PlaceIndex(req,res){
  Place.find((err,Places)=>{
    if (err){
      console.log(err);
      return res.status(500).json({ message: "Ain't not Places here!"});
    }
    return res.status(200).json(Places);

  });
}

function PlaceShow(req, res){
  Place.findById(req.params.id, (err, Place) => {
    if (err){
      console.log(err);
      return res.status(500).json({ message: "Ain't not Places here!"});
    }
    return res.status(200).json(Place);
  });
}

function PlaceUpdate(req, res){
  Place.findByIdAndUpdate(req.params.id, req.body, { new: true}, (err, Place) => {
    console.log(req.params.id, req.body);
    if (err){
      console.log(err);
      return res.status(500).json({ message: "Ain't not Places here!"});

    }
    if (!Place) {
      return res.status(404).json({ message: "No Place, no see"});
    }
    return res.status(200).json(Place);
  });
}

function PlaceDelete(req, res){
  Place.findByIdAndRemove(req.params.id, (err, Place) => {
    if (err){
      console.log(err);
      return res.status(500).json({ message: "Ain't not Places here!"});

    }
    if (!Place) {
      return res.status(404).json({ message: "No Place, no see"});
    }
    return res.status(204).send();
  });
}

module.exports = {
  index: PlaceIndex,
  show: PlaceShow,
  update: PlaceUpdate,
  delete: PlaceDelete
};
