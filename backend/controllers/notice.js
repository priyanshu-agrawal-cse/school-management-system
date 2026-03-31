const Notice = require("../models/notice");
const School = require("../models/school");

module.exports.renderAddForm = (req, res) => {
    res.status(200).json({ view: "notices/add.ejs" });
};

module.exports.addNotice = async (req, res) => {
    const school = await School.findOne({ user: req.user._id });
    const newNotice = new Notice({
        ...req.body,
        schoolId: school._id,
        postedBy: req.user._id
    });
    await newNotice.save();
    res.status(200).json({ redirectUrl: "/dashboard" });
};

module.exports.viewNotices = async (req, res) => {
    const school = await School.findOne({ user: req.user._id });
    const notices = await Notice.find({ schoolId: school._id }).sort({ createdAt: -1 });
    res.status(200).json({ notices });
};
