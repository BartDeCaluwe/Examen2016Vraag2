var DB = "http://127.0.0.1:5984/_utils/document.html?todos/";
var VIEW = "_design/app/_view/todos_by_id?key=%22";


function buildOutput(){

    $('#output').empty();
    var html = '<table class="table table-hover">';
    $.ajax({
        type : 'GET',
        url : '../../_all_docs?include_docs=true',
        async : true,
        success : function(data){
            var arr = JSON.parse(data).rows;

            for(var i = 0; i < arr.length; i++){

                if (arr[i].id.indexOf('_design') == -1){
                    var doc = arr[i].doc;
                    html += '<tr><td>' + doc.ingavedatum + '</td><td>' + doc.einddatum
                            + '</td><td>' + doc.prioriteit + '</td>'
                            + '</td><td>' + doc.beschrijving + '</td>'
                            + '</td><td>' + doc.status + '</td>'
                            + '<td><button type="button" class="btn btn-danger" onClick="deleteDoc(\'' + doc._id + '\',\'' + doc._rev + '\')">X</button></td>'
                            + '<td><button type="button" class="btn btn-success" onClick="editDoc(\'' + doc._id + '\',\'' + doc._rev + '\',\'' + doc.lastName+ '\',\'' + doc.firstName + '\',\'' + doc.points + '\')">Edit</button></td>';
                }
            }
            html += '</table>';
            $('#output').html(html);
        },
        error : function(XMLHttpRequest, textStatus, errorThrown){
            console.log(errorThrown);
        }
    });
}

function deleteDoc(id, rev){
    $.ajax({
        type:     'DELETE',
        url:     '../../' + id + '?rev=' + rev,
        success: function(){
            fillTypeAhead();
        },
        error:   function(XMLHttpRequest, textStatus, errorThrown) { console.log(errorThrown); }
    });
}

function editDoc(id, rev, lastName, firstName, points){
    
    $('#output').hide();
    $('#edit').show();
    
    var html = '';
    
    // Build edit form
    html += '<h3>Editeer record</h3><table class="table table-hover">';
    html += '<input type="hidden" id="_id" value="' + id + '"/>';
    html += '<input type="hidden" id="_rev" value="' + rev + '"/>';
    html += '<tr><td>Naam :</td><td><input id="lastName2" type="text" size="50" value="' + lastName + '"/></td></tr>';
    html += '<tr><td>Voornaam:</td><td><input id="firstName2" type="text" size="50" value="' + firstName + '"/></td></tr>';
    html += '<tr><td>Punten:</td><td><input id="points2" type="text" size="10" value="' + points + '"/></td></tr>';
    html += '<tr><td colspan="2" align="center"><button type="button" class="btn btn-primary" onClick="updateDoc()">Ok</button></td></tr>';
    html += '</table>';
    
    $('#edit').html(html);
}

function updateDoc(){
    
    var id = $("#_id").val();
    var rev = $("#_rev").val();
    var lastName = $("#lastName2").val();
    var firstName = $("#firstName2").val();
    var points = $("#points2").val();

    var doc = {};

    doc._id = id;
    doc._rev = rev;
    doc.lastName = lastName;
    doc.firstName = firstName;
    doc.points = parseInt(points);
    var json = JSON.stringify(doc);

    $.ajax({
        type : 'PUT',
        url : '../../' + id,
        data : json,
        contentType : 'application/json',
        async : true,
        success : function(data){
            $('#edit').hide();
            $('#output').show();
            buildOutput();
        },
        error : function(XMLHttpRequest, textStatus, errorThrown){
            console.log(errorThrown);
        }
    });
}

function fillTypeAhead(){
    
    buildOutput();
    
    $.ajax({
        type:    'GET',
        url:    '_view/allstudents',
        async: true,
        success:function(data){ 
            var rows = JSON.parse(data).rows;
            var names = [];
            $.each(rows, function(key, value){
                names.push(value.key);
            });
            
            $('#students').typeahead({
                hint: true,
                highlight: true,
                minLength: 1
                },
                {
                name: 'names',
                displayKey: 'value',
                source: substringMatcher(names)
                });
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) { alert(XMLHttpRequest.responseText); }
    });
}

function searchDoc(){
    
    var name = $("#students").val();
    var docName = name.replace(/\s+/g, '');
    console.log(docName);
    
    $.ajax({
        type:    'GET',
        url:    '../../' + docName,
        async: true,
        success:function(data){
            var doc = JSON.parse(data);
            editDoc(docName, doc._rev, doc.lastName, doc.firstName, doc.points);
            $("#students").val('');
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) { alert(XMLHttpRequest.responseText); }
    });    
}