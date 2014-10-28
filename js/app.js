App = Ember.Application.create();

App.Router.map(function(){
	this.resource('about');
	this.resource('posts', function() {
    this.resource('post', { path: ':post_id' });
  });
});

App.Store = DS.Store.extend({
  revision:12,
  adapter: 'DS.FixtureAdapter'
});

App.Post = DS.Model.extend({
  title: DS.attr('string'),
  author: DS.attr('string'),
  fullText: DS.attr('string'),
  publishedAt: DS.attr('date')
});

App.Post.FIXTURES = [{
    id:1,
    title: "Mejoras de usabilidad en el ecommerce. Panama Jack ",
    author: "elad",
    publishedAt: new Date('4-8-2013'),
    fullText: "Hace **unos pocos días** publicamos la nueva versión de uno de nuestros grandes clientes [Panama Jack](http://www.panamajack.es/). Entre las nuevas mejoras de esta nueva versión se encuentra un nuevo diseño (realizado internamente por el departamento creativo de Panama Jack) y **mejoras de usabilidad**."
},
{
    id:2,
    title: "Introducción al framework Ember.js ",
    author: "danii",
    publishedAt: new Date('4-3-2013'),
    fullText: "Suspendisse vitae arcu eu sapien varius venenatis eu sed mi. Integer volutpat turpis nec metus aliquet sagittis. Vivamus semper congue nunc. Lorem ipsum dolor sit amet, consectetur adipiscing elit. In ullamcorper a lorem eget viverra. Nunc nibh nisi, semper et risus quis, ullamcorper mollis libero. Phasellus ultrices sapien dui, eu laoreet erat accumsan eu."
}];

App.PostsRoute = Ember.Route.extend({
    model: function() {
        return App.Post.find();
    }
});

moment.lang('es',
{
  relativeTime: {
    past : 'hace %s',
    s : "unos segundos",
    m : "un minuto",
    mm : "%d minutos",
    h : "una hora",
    hh : "%d horas",
    d : "un día",
    dd : "%d días",
    M : "un mes",
    MM : "%d meses",
    y : "un año",
    yy : "%d años"
  }
});
 
Ember.Handlebars.registerBoundHelper('date', function(date) {
  return moment(date).fromNow();
});

var showdown = new Showdown.converter();
 
Ember.Handlebars.registerBoundHelper('markdown', function(input) {
  return new Ember.Handlebars.SafeString(showdown.makeHtml(input));
});

App.PostController = Ember.ObjectController.extend({
    isEditing: false,
    edit: function()
    {
      this.set('isEditing',true);
    },
    doneEditing: function()
    {
      this.set('isEditing',false);
      this.get('store').commit();
    }
 
});

App.PostsIndexRoute = Ember.Route.extend({
  redirect: function () {
    var posts = this.modelFor('posts');
    var post = posts.get('firstObject');

   if(!post)
      {
          console.log("LOADING bootstrap'ed DATA");
          DS.get('defaultStore').load(App.Post, bootstrap);
          post = App.Post.find(1);
      }

    this.transitionTo('post', post);
  }
});

App.IndexRoute = Ember.Route.extend({
  redirect: function () {
    this.transitionTo('posts');
  }
});