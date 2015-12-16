var repos = {};

repos.all = [];

repos.requestAll = function(callback) {
  //TODO: How would you like to fetch your repos?
  $.ajax({
    type: 'GET',
    url: 'https://api.github.com/users/brookr/repos' +
      '?sort=updated&per_page=100',
    headers: { Authorization: 'token ' + githubToken }
  }).done(function(data) {
    repos.all = data;
  }).done(callback);
};
