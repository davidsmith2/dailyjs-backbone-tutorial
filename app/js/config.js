define([], function () {
	var config = {
		apiKey: 'AIzaSyAkNYVmF_J42fSgxw20BsnM20s9KaF-es8',
  		scopes: 'https://www.googleapis.com/auth/tasks https://www.googleapis.com/auth/userinfo.profile',
		clientId: '1014066150582.apps.googleusercontent.com',
	};
	_.templateSettings = {
		interpolate: /\{\{(.+?)\}\}/g
	};
	return config;
});