/*global data */
/*eslint quotes: 0 */

// initialize the `data` variable here so, it has a global scope
// so it can be called from Function objects
var data = '';

$('#prefill').on('click', function preload(e) {
  $.get('tiobe.html', function(response){
    $('textarea[name=input]').text(response);
    data = response;
  });
});

// holds all the code we will walk through, step-by-step
var steps = [];

steps[0] = "\
  // first we will just log the raw data\n\
  $('textarea[name=output]').text(data);";

steps[1] = "\
  // first real step is to figure out the rows\n\
  // split will create an array of rows for us\n\
  $('textarea[name=output]').text( data.split( '<tr>' ) );";

steps[2] = "\
  // the first result in the array of rows is an empty string, so\n\
  // let's get rid of that\n\
  $('textarea[name=output]').text(\
    data\n\
      .split('<tr>')\n\
      .slice(1)   // take everything in the array but the first one (zero-th index)\n\
  );";

  // now let's process each row
  // we'll need to transform each row into something useful (like columns!)
  // a map applies a function to each element of an array, so that's what we want
steps[3] = function step3() {
  $('textarea[name=output]').text(
    data
      .split('<tr>')
      .slice(1)
      .map( function(row) {
        // first we need to remove the closing </tr>
        // the -5 means remove the last 5 characters
        return row
          .slice(0, -5);
      })
  );
};

steps[4] = function step4() {
  $('textarea[name=output]').text(
    data
      .split('<tr>')
      .slice(1)
      .map( function(row) {
        return row
          .slice(0, -5)
          // now we need to split the row into columns
          .split('<td>')
          // remove the first empty column
          .slice(1);
          // now we have a nice array of arrays.
          // Each elment in the outer array has six elements, which are the
          // columns of the table.
      })
  );
};

  // the problem is that each column has a </td> in it. That's extraneous.
  // Let's get rid of it. We need to transform each element in an array, so
  // that is a map, again. This time for each colulmn.

steps[5] = function step5() {
  $('textarea[name=output]').text(
    data
      .split('<tr>')
      .slice(1)
      .map( function(row) {
        return row
          .slice(0, -5)
          .split('<td>')
          .slice(1)
          .map( function(col){
            // chop off the last 5 characters
            return col.slice(0, -5);
          });
      })
  );
};
  // now we can answer our question about which programming languages have moved
  // up in rank

steps[6] = function step6() {
  var newData =
    data
      .split('<tr>')
      .slice(1)
      .map(function(row) {
        return row
          .slice(0, -5)
          .split('<td>')
          .slice(1)
          .map(function(col) {
            return col.slice(0, -5);
          });
      })
      .reduce(function(acc, col) {
        var rank = col[0];
        var prevRank = col[1];
        var name = col[3];
        if (rank < prevRank) {
          acc.push({
            rank: rank,
            prevRank: prevRank,
            name: name
          });
        }
        return acc;
      }, []);
  $('textarea[name=output]').text(JSON.stringify(newData, null, '  '));
};

$('.step-buttons').append(
  steps.map(function(step, i) {
    var button = $('<button>Step ' + i + '</button>');
    button.on('click', function(e) {
      code_editor.setValue(steps[i].toString());
    });
    return button;
  })
);

var code_editor = ace.edit('code');
code_editor.getSession().setMode('ace/mode/javascript');
code_editor.getSession().setTabSize(2);
code_editor.getSession().setUseSoftTabs(true);
code_editor.$blockScrolling = Infinity;

$('input[name=submit]').on('click', function(e){
  e.preventDefault();
  var processor = new Function(code_editor.getValue());
  processor();
});

$('button#clear').on('click',function(e){
  $('textarea[name=output]').text('');
});
