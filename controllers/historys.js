const Historys = require("../models/historys");
const Users = require("../models/users");
const { errorFunction } = require("../utils/errorFunction");

const orderHistory = async (req, res, next) => {
    try {
        const userId = await Users.findById(req.body.userId);
        if (!userId) {
          return res.json(
            errorFunction(true, 204, "This user Id have not in the database")
          );
        }
      const newHistory = await Historys.create(req.body);
  
      if (newHistory) {
        return res
          .status(201)
          .json(errorFunction(false, 201, "History Created", newHistory));
      } else {
        return res.status(403).json(errorFunction(true, "Error Creating History"));
      }
    } catch (error) {
      console.log("ERRORS:", error);
      return res.status(403).json(errorFunction(true, "Error Creating History"));
    }
  };

const getAllHistory = async (req, res, next) => {
    try {
      const allHistory = await Historys.find();
      if (Historys.length > 0) {
        res.status(200).json({
          Historys: allHistory.reverse(),
        });
      } else {
        res.status(200).json({
          message: "no results",
          History: [],
        });
      }
    } catch (error) {
      res.status(400).json({
        message: "Bab request",
      });
    }
  };
const getHistoryById = async (req, res, next) => {
  const historyId = req.params.historyId;
  try {
    const history = await Historys.findById(historyId);
    if (history) {
      res.status(200).json({
        statuscode: 200,
        history,
      });
    } else {
      res.json({
        statuscode: 204,
        message: "this product Id is have not in the database",
        historys: {},
      });
    }
  } catch (error) {
    console.log("error: ", error);
    res.status(400).json({
      statuscode: 400,
      message: "Bad request",
    });
  }
};

// get by user id
const getHistoryByUserId = async (req, res, next) => {
  const userId = req.params.userId
  try {
    const filter = {
      $and: [
        {
          userId: {
            $regex: userId,
            $options: '$i',
          },
        },
      ],
    }
    const historys = await Historys.find(filter)
    if (historys) {
      res.status(200).json({
        statusCode: 200,
        total: historys.length,
        historys: historys.reverse(),
      })
    } else {
      res.json({
        statusCode: 204,
        message: 'This order Id have not in the database',
        order: {},
      })
    }
  } catch (error) {
    res.status(400)
    return res.json(errorFunction(true, 400, 'Bad request'))
  }
}

const deleteHistoryById = async (req, res, next) => {
  const historyId = req.params.historyId;
  try {
    const history = await Historys.findByIdAndRemove(historyId);
    if (history) {
      res.status(200).json({
        statuscode: 200,
        message: "Delete product successfully",
      });
    } else {
      res.json({
        statuscode: 204,
        message: "this product Id is have not in the database",
      });
    }
  } catch (error) {
    console.log("error: ", error);
    res.status(400).json({
      statuscode: 400,
      message: "Bad request",
    });
  }
};

const updateHistory = (req, res, next) => {
  try {
    const historyId = req.params.historyId;
    const isBodyEmpTy = Object.keys(req.body).length;
    if (isBodyEmpTy === 0) {
      return res.send({
        statuscode: 403,
        message: "Body request can not emty.",
      });
    }
    Historys.findByIdAndUpdate(historyId, req.body).then((data) => {
      if (data) {
        res.status(200).json({
          statuscode: 200,
          message: "Update product successfully",
        });
      } else {
        res.json({
          statuscode: 204,
          message: "This product Id is have not in the database ",
        });
      }
    });
  } catch (error) {
    res.status(400).json({
      statuscode: 400,
      message: "Bad request",
    });
  }
};
module.exports = {
    orderHistory,
    getAllHistory,
    getHistoryById,
    deleteHistoryById,
    updateHistory,
    getHistoryByUserId
};
