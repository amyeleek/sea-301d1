var aboutView = {};

aboutView.index = function() {
  aboutView.ui();

  var _append = function(repo) {
    $('#about ul').append(aboutView.render(repo));
  };

  repos.all
    .filter(function(repo) {
      return repo.stargazers_count;
    }).map(_append);
};

aboutView.render = function(repo) {
  //TODO: How would you like to render this?
  return $('<li>').text(repo.full_name);
};

aboutView.ui = function() {
  var $about = $('#about');
  var $ul = $about.find('ul');

  $ul.empty();
  $about.fadeIn().siblings().hide();
};
