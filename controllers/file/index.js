const fileModel = require("../../models").file;
const artModel = require("../../models").art;

module.exports = {
  list: async (req, res) => {
    const list = await fileModel.findAll({
      include: [
        {
          model: artModel,
          as: "arts",
          attributes: { exclude: ["id"] },
        },
      ],
      attributes: { exclude: ["file_data"] },
    });
    if (!list) {
      res.status(404).json({
        msg: `file not found`,
      });
      return;
    }
    res.json(list);
    return;
  },
  preview: async (req, res) => {
    const id = +req.params.id;
    if (!id) {
      res.status(400).json({
        msg: `id is required`,
      });
      return;
    }
    const file = await fileModel.findOne({
      include: [
        {
          model: artModel,
          as: "arts",
          attributes: { exclude: ["id"] },
        },
      ],
      where: { id },
    });
    if (!file) {
      res.status(404).json({
        msg: `file not found`,
      });
      return;
    }
    if (file.dataValues.file_name.slice(-3) === `mp4`) {
      const head = {
        "Content-Length": Buffer.byteLength(file.dataValues.file_data),
        "Content-Type": "video/mp4",
      };
      res.writeHead(200, head);
      res.write(file.dataValues.file_data, "binary");
      res.end(null, "binary");
      return;
    }
    res.end(file.dataValues.file_data);
    return;
  },
};
