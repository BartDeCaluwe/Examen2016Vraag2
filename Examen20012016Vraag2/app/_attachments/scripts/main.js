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
                            + '<td><button type="button" class="btn btn-success" onClick="editDoc(\'' + doc._id + '\',\'' + doc._rev + '\',\'' + doc.ingavedatum+ '\',\'' + doc.einddatum + '\',\'' + doc.prioriteit + '\',\'' + doc.beschrijving + '\',\'' + doc.status + '\')">Edit</button></td>';
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

function editDoc(id, rev, invoerdatum, einddatum, prioriteit, beschrijving, status){
    
    $('#output').hide();
    $('#edit').show();
    
    var html = '';
    
    // Build edit form
    html += '<h3>Editeer record</h3><table class="table table-hover">';
    html += '<input type="hidden" id="_id" value="' + id + '"/>';
    html += '<input type="hidden" id="_rev" value="' + rev + '"/>';
    html += '<tr><td>invoerdatum :</td><td><input id="invoerdatum2" type="text" size="50" value="' + invoerdatum + '"/></td></tr>';
    html += '<tr><td>einddatum:</td><td><input id="einddatum2" type="text" size="50" value="' + einddatum + '"/></td></tr>';
    html += '<tr><td>prioriteit:</td><td><input id="prioriteit2" type="text" size="10" value="' + prioriteit + '"/></td></tr>';
    html += '<tr><td>beschrijving:</td><td><input id="beschrijving2" type="text" size="10" value="' + beschrijving + '"/></td></tr>';
    html += '<tr><td>status:</td><td><input id="status2" type="text" size="10" value="' + status + '"/></td></tr>';
    html += '<tr><td colspan="2" align="center"><button type="button" class="btn btn-primary" onClick="updateDoc()">Ok</button></td></tr>';
    html += '</table>';
    
    $('#edit').html(html);
}

function updateDoc(){
    
    var id = $("#_id").val();
    var rev = $("#_rev").val();
    var invoerdatum = $("#invoerdatum2").val();
    var einddatum = $("#einddatum2").val();
    var prioriteit = $("#prioriteit2").val();
    var beschrijving = $("#beschrijving2").val();
    var status = $("#status2").val();

    var doc = {};

    doc._id = id;
    doc._rev = rev;
    doc.invoerdatum = invoerdatum;
    doc.einddatum = einddatum;
    doc.prioriteit = parseInt(prioriteit);
    doc.beschrijving = beschrijving;
    doc.status = status;
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


function searchDoc(){
    
    var name = $("#id").val();
    var docName = name.replace(/\s+/g, '');
    console.log(docName);
    
    $.ajax({
        type:    'GET',
        url:    '../../' + docName,
        async: true,
        success:function(data){
            var doc = JSON.parse(data);
            editDoc(docName, doc._rev, doc.invoerdatum, doc.einddatum, doc.prioriteit, doc.beschrijving, doc.status);
            $("#id").val('');
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) { alert(XMLHttpRequest.responseText); }
    });    
}