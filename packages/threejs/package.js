Package.describe({
	summary: 'Three.js wrapper'
});

Package.on_use(function (api, where) {
	api.add_files(['lib/three.min.js',
		'lib/threex.fullscreen.js',
		'lib/threex.windowresize.js',
		'lib/threex.keyboardstate.js'], 'client');

	if (api.export) {
		api.export('THREE');
		api.export('THREEx');
	}
});
