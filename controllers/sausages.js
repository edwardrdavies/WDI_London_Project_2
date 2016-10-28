const Sausage = require('../models/sausage');

function sausageAdd(req, res){
  Sausage.create(req.body, (err, sausage) => {
    if (err){
      console.log(err);
      return res.status(500).json({ message: "Ain't not sausages here!"});
    }
    return res.status(201).json({
      message: "Success, that's a nice a sausage",
      sausage
    });
  });
}

function sausageIndex(req,res){
  Sausage.find((err,sausages)=>{
    if (err){
      console.log(err);
      return res.status(500).json({ message: "Ain't not sausages here!"});
    }
    return res.status(200).json(sausages);

  });
}

function sausageShow(req, res){
  Sausage.findById(req.params.id, (err, sausage) => {
    if (err){
      console.log(err);
      return res.status(500).json({ message: "Ain't not sausages here!"});
    }
    return res.status(200).json(sausage);
  });
}

function sausageUpdate(req, res){
  Sausage.findByIdAndUpdate(req.params.id, req.body, { new: true}, (err, sausage) => {
    console.log(req.params.id, req.body);
    if (err){
      console.log(err);
      return res.status(500).json({ message: "Ain't not sausages here!"});

    }
    if (!sausage) {
      return res.status(404).json({ message: "No sausage, no see"});
    }
    return res.status(200).json(sausage);
  });
}

function sausageDelete(req, res){
  Sausage.findByIdAndRemove(req.params.id, (err, sausage) => {
    if (err){
      console.log(err);
      return res.status(500).json({ message: "Ain't not sausages here!"});

    }
    if (!sausage) {
      return res.status(404).json({ message: "No sausage, no see"});
    }
    return res.status(204).send();
  });
}

module.exports = {
  add: sausageAdd,
  index: sausageIndex,
  show: sausageShow,
  update: sausageUpdate,
  delete: sausageDelete
};
