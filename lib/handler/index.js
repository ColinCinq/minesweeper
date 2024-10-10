module.exports = function () {
	return {
		renderIndex: function (req, res) {
			//res.render("index.html.twig", {datas:result})
			res.render("index.html.twig")
		},
		renderMinesweeper: function (req, res) {
			res.render("minesweeper.html.twig")
		},

		render404: function (req, res) {
			res.render("404.html.twig")
		}
	}
}