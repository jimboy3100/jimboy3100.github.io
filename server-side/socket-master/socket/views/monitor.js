console.clear()
require['config']({
    'context': '',
    'paths': {
      'bootstrap':  'https://cdn.ogario.ovh/static/js/bootstrap.min',
      'jquery':     'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.0/jquery.min',
      'underscore': 'https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.9.1/underscore-min',
      'backbone':   'https://cdnjs.cloudflare.com/ajax/libs/backbone.js/1.4.0/backbone-min',
      'backbone-ws':'https://rawcdn.githack.com/ydaniv/backbone-ws/9d5cce1519ee0807c192600effa25a3c806d40d7/backbone-ws',
      'msgpack':'https://cdnjs.cloudflare.com/ajax/libs/msgpack-lite/0.1.26/msgpack.min',
      //'Ractive':'https://cdnjs.cloudflare.com/ajax/libs/ractive/0.7.2/ractive.min',
      'Ractive':'https://cdnjs.cloudflare.com/ajax/libs/ractive/1.3.12/ractive.min',
      'WS':'https://rawcdn.githack.com/joewalnes/reconnecting-websocket/fd7c819bb15eeee3452c17e317c0a3664c442965/reconnecting-websocket'
    },
    'shim': {
        'bootstrap': {'deps': ['jquery']},
        'jquery':    {'exports': '$'},
        'msgpack':    {'exports': 'msgpack'},
        'underscore':{'exports': '_'},
        'backbone':  {'exports': 'Backbone','deps': ['jquery', 'underscore']},
        'backbone-ws':{'deps': ['backbone']}
    }
});

var app = {
  tpl:{},view:{},model:{},collection:{},run:{},e:{},helper:{},cache:{pages:{}}
}


require(["backbone","msgpack",'Ractive','underscore','WS','backbone-ws'],function(Backbone,msgpack,Ractive,_,WS) {

  var token = localStorage['token']
  if(!token) localStorage['token'] = token = prompt('Token access:')

app.model.user = Backbone.Model.extend()
app.collection.users = Backbone.Collection.extend({
  model:app.model.user,
  
})
app.view.user = Backbone.View.extend({
  tagName:'div',
  render: function(){
    this.model.attributes.cid = this.model.cid
    this.$el.html(app.tpl.fitem(this.model.toJSON()))
    return this
  }
})
var Users = window.Users = new app.collection.users


//var ws = window.ws = new Backbone.WS(`ws${location.protocol==='https:'?'s':''}://${location.host}/ws`);
var urlToSearch="snez.org:8080";
var ws = window.ws = new Backbone.WS(`ws${location.protocol==='https:'?'s':''}://${urlToSearch}/ws`);

ws.ready
    .then(
        function (instance) {
          setInterval(function(){
            ws.send(1)
          },45000)
          console.log('On air!');
        },
        function (error) {
            console.error('Failed to connect!', error);
        });
  var model = window.model = new Backbone.Model({collection:Users});
  model.on('ws:open', function (){
    ws.socket.binaryType='arraybuffer'
    ws.socket.send(msgpack.encode({e:'auth',token:token}))
    ws.socket.send(msgpack.encode({e:'users'}))
    ws.socket.send(msgpack.encode({e:'change'}))
    ractive.set('userz',{})
  })
  model.on('ws:message', function (buffer) { 
      ractive.add('traffic',buffer.byteLength)
      try{var msg = msgpack.decode(new Uint8Array(buffer))}catch(e){console.log(buffer)}
      switch(msg.e){
          
          case 'unauth':
            delete localStorage['token']
            console.log(token)
            location.reload()
          break;
          case 'ad': 
          var index;
          ractive.push('ids',msg.data)
            .then(index => {
            msg.data.i = index-1
            ractive.set('userz.'+msg.data.id,msg.data)
          })
        //case 'ad': window.Users.add(msg.data);
          break;
        case 'ch': 
          var path = 'userz.'+msg.data.id
          //console.log(ractive.get('userz')[msg.data.id])
          Object.keys(msg.data).map(function(key,id){
            if(key=='id') return;

            //var el = ractive.find('[id="'+msg.data.id+'"] [data-type="'+key+'"]')
            //$(el).css({background:'red'})
            //$(el).animate({background: "white"}, 500, function() {});
            ractive.set(path+'.'+key,msg.data[key])
          })
          //delete ractive.get('userz')[msg.data.id];
          ractive.update(path);
          /*var i = ractive.get('ids.'+msg.data.id)
          console.log(ractive.get('users['+i+'].nick'))
          Object.keys(msg.data).map(function(key){
            if(key==i)return;
            console.log(key,msg.data[key])
            ractive.set('users['+i+'].'+key,msg.data[key])
          })*/
          
          break;
        case 'rm': 
          var path = 'userz.'+msg.data.id
          var i = ractive.get(path+'.i')
          ractive.splice('ids',i+1,1)
          //ractiverset('userz.'+msg.data.id)
          delete ractive.get('userz')[msg.data.id];
          ractive.update(path);
          break;
          
      }
    
});

ws.bind(model);
 
Ractive.transitions.bump = function(t, params) {
   params = t.processParams( params, {
     duration: 400,
     color: t.isIntro ? 'rgb(0,255,0)' : 'rgb(255,0,0)'
   });

  if (t.isIntro) {
    /* enter */
  } else {
    /* exit */
  }

  t.complete();
};

var ractive = window.ractive = new Ractive({
  el: $('#app'),
  template: $('#t-users').html(),
  data: {
    _: _,
    traffic:0,
    users:[],
    icons:{
      '000':'https://cdn.glitch.com/06ad7f69-0eb6-4f4e-9a49-e3ba3481ca33%2F000.png',
      '030':'https://cdn.glitch.com/ec7b0453-8743-4e7c-91b3-dfcf4bee7406%2F030.png?v=1591627437245',
      '020':'https://cdn.glitch.com/06ad7f69-0eb6-4f4e-9a49-e3ba3481ca33%2F020.png?v=1580246854138',
      '021':'https://cdn.glitch.com/06ad7f69-0eb6-4f4e-9a49-e3ba3481ca33%2F021.png?v=1580246854184',
      '011':'https://cdn.glitch.com/06ad7f69-0eb6-4f4e-9a49-e3ba3481ca33%2F011.png?v=1580246854236',
      '031':'https://cdn.glitch.com/ec7b0453-8743-4e7c-91b3-dfcf4bee7406%2F031.png?v=1591627437245',
      '010':'https://cdn.glitch.com/06ad7f69-0eb6-4f4e-9a49-e3ba3481ca33%2F010.png?v=1580246854355',
      '555':'https://cdn.glitch.com/ec7b0453-8743-4e7c-91b3-dfcf4bee7406%2F555.png?v=1587921928458',
      '040':'https://cdn.glitch.com/ec7b0453-8743-4e7c-91b3-dfcf4bee7406%2F040.png?v=1591627437112',
      '041':'https://cdn.glitch.com/ec7b0453-8743-4e7c-91b3-dfcf4bee7406%2F040.png?v=1591627437112'
    },
    userz:{},
    sortColumn:'id',
    sortReversed:false,
    transitions:{bump:Ractive.transitions.bump},
    sort: function( obj ) {
      
      var arr = [];
      Object.keys(obj).forEach(function(e) {
          arr.push(obj[e]);
      });
  		var column = this.get( 'sortColumn' );
	  	var sorted =  arr.sort( function( a, b ) {
	  		return a[ column ] < b[ column ] ? -1 : 1;
	  	});
      if(this.get( 'sortReversed')) sorted.reverse()
      return sorted
  	}
    
  },
  sort: function( column ) {
    this.set('sortReversed',!this.get( 'sortReversed')?this.get('sortColumn') == column:false)
  	this.set('sortColumn', column);
  },
  //adapt: [adaptor],
});

//ractive.reverse('collection')
  
})

//if(navigator.userAgent=='Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36 OPR/65.0.3467.78')
