var assert = require('assert');

suite('Posts Permissions', function() {
  ltest('access granted for type==comment', function(done, server, client) {
    server.eval(function() {
      Posts.find().observe({
        added: onAdded
      });

      function onAdded(doc) {
        emit('doc', doc);
      }
    });

    server.once('doc', function(post) {
      assert.equal(post.title, 'hello');
      done();
    }); 

    client.eval(function() {
      Posts.insert({title: 'hello', type: 'comment'});
    });
  });

  ltest('access denied for other types', function(done, server, client) {
    client.eval(function() {
      Posts.find().observe({
        removed: onRemoved
      });

      function onRemoved(doc) {
        emit('remove', doc);
      }

      Posts.insert({title: 'hello'});
    });

    client.on('remove', function(doc) {
      assert.equal(doc.title, 'hello');
      done();
    });
  });
});