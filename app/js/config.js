define([], function () {
	var config = {
		api_key: 'AIzaSyAkNYVmF_J42fSgxw20BsnM20s9KaF-es8',
        client_id: '1014066150582.apps.googleusercontent.com',
  		scopes: 'https://www.googleapis.com/auth/tasks https://www.googleapis.com/auth/userinfo.profile'
	};
	_.templateSettings = {
		interpolate: /\{\{(.+?)\}\}/g
	};
	return config;
});