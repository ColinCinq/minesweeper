module.exports = function (server, handler) {
	server.get('/', handler.renderIndex)
	server.get('/minesweeper', handler.renderMinesweeper)

	server.get('*', handler.render404)
}