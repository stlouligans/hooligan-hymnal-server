const mongoose = require("mongoose");
const Player = mongoose.model("players");

exports.index = async (req, res) => {
	const page = req.query.page || 1;
	const limit = 1;
	const skip = (page * limit) - limit;

	const playersPromise = Player
		.find({
			name: {
				$regex: `${req.query.name || ""}`,
				$options: "i"
			}
		})
		.skip(skip)
		.limit(limit)
		.sort({ "name": "asc" });

	const countPromise = Player.count();
	const [players, totalCount] = await Promise.all([playersPromise, countPromise]);
	const pages = Math.ceil(totalCount / limit);
	if (!players.length && skip) {
		req.flash("error", `Hey! You asked for page ${page}. But that dosen't exist. So I put you on page ${pages}`);
		res.redirect(`/players?page=${pages}`);
	}

	res.render("players/index", {
		title: "All Players",
		players,
		totalCount,
		skip,
		page,
		pages
	});
};

// TODO: Implement players search that returns div of players cards.
exports.search = async (req, res) => {
	const { name } = req.query;
	const page = req.query.page || 1;
	const limit = 1;
	const skip = (page * limit) - limit;

	const playersPromise = Player
		.find({
			name: {
				$regex: `.*${name}.*`,
				$options: "i"
			}
		})
		.skip(skip)
		.limit(limit)
		.sort({ "name": "asc" });
	const totalCountPromise = Player.count();
	const searchCountPromise = Player.find({
		name: {
			$regex: `.*${name}.*`,
			$options: "i"
		}
	}).count();
	const [players, totalCount, searchCount] = await Promise.all([playersPromise, totalCountPromise, searchCountPromise]);
	const pages = Math.ceil(searchCount / limit);

	res.render("players/_playersList", {
		players,
		name,
		skip,
		page,
		pages,
		totalCount,
		searchCount
	});
};

exports.create = (req, res) => {
	res.render("players/create", {
		title: "Create Player"
	});
};

exports.store = async (req, res) => {
	const player = new Player(req.body);
	await player.save();
	req.flash("success", `${player.name} was successfully created!`);
	res.redirect("/players");
};

exports.show = async (req, res) => {
	const player = await Player.findById(req.params.id);
	res.render("players/show", {
		title: `${player.name}`,
		player
	});
};

exports.edit = async (req, res) => {
	const player = await Player.findById(req.params.id);
	res.render("players/edit", {
		title: `Edit ${player.name}`,
		player
	});
};

exports.update = async (req, res) => {
	const player = await Player.findOneAndUpdate(
		{
			_id: req.params.id
		},
		{
			$set: req.body
		},
		{
			new: true,
			runValidators: true,
			context: "query"
		}
	);
	req.flash("success", `${player.name} was updated`);
	res.redirect(`/players/${player._id}`);
};

exports.deleteConfirm = async (req, res) => {
	const player = await Player.findById(req.params.id);
	res.render("players/delete", {
		title: `${player.name} Delete`,
		player
	});
};

exports.delete = async (req, res) => {
	const player = await Player.findOneAndDelete(req.params.id);
	req.flash("success", `${player.name} was deleted!`);
	res.redirect("/players");
};
