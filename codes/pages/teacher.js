function render_list(list) {
    var tbody =  $("#list-tbody").empty();
    for (i in list) {
        var teacher = list[i];
        var row = $('<tr>');
        $('<td>').text(parseInt(i) + 1).appendTo(row);
        $('<td>').text(teacher['tn']).appendTo(row);
        $('<td>').text(teacher['name']).appendTo(row);

        var btn_edit = $('<button>')
            .text('修改')
            .on( "click", (function(teacher) {
                return function( event ) {
                    var tn = teacher['tn'];
                    console.log('edit: ' + tn);
                    edit_teacher(tn);
                }
            })(teacher));

        var btn_del = $('<button>')
            .text('删除')
            .on( "click", (function(item) { 
                return function( event ) {
                    delete_teacher(item['tn']);
                }
            })(teacher));

        $('<td>').append(btn_edit).append(btn_del).appendTo(row);

        row.appendTo(tbody);
    }
}

function load_list() {
	$.ajax({
        type: 'GET',
  		url: "/s/teacher/",
        data: '',
        dataType: 'json' 
	})
    .done(function(data) {
        render_list(data);
    });
}

function get_details(tn) {
  $.ajax({ 
    type: 'get', 
    url: '/subscriptions/' + id,
    data: "subscription[title]=" + encodeURI(value),
    dataType: 'script' 
    });

    $.ajax({ 
    type: 'PUT', 
    url: '/subscriptions/' + id,
    data: "subscription[title]=" + encodeURI(value),
    dataType: 'script' 
    }); 
}

function edit_teacher(tn) {
    function put_teacher() {
        var item = {};
        var tn = $('#frm-teacher input[name="tn"]').val();
        item['tn'] = tn;
        item['name'] = $('#frm-teacher input[name="name"]').val();

        var jsondata = JSON.stringify(item);
        $.ajax({ 
            type: 'PUT', 
            url: '/s/teacher/' + tn,
            data: jsondata,
            dataType: 'json' 
        })
        .done(function(){
            load_list();
            $('#dlg-teacher-form').hide()
        });

        return false; // 在AJAX下，不需要浏览器完成后续的工作。
    }

    $.ajax({ 
        type: 'GET', 
        url: '/s/teacher/' + tn,
        dataType: 'json' 
    })
    .then(function(item) {
        $('#frm-teacher input[name="tn"]').val(item['tn']);
        $('#frm-teacher input[name="name"]').val(item['name']);

        $('#frm-teacher').off('submit').on('submit', put_teacher);
        $('#frm-teacher input:submit').val('修改')
        $('#dlg-teacher-form').show()
    }); 

}


function register_teacher() {
    // 因为新添和修改都使用和这个表单，因此需要置空这个表单
    $('#frm-teacher input[name="tn"]').val('');
    $('#frm-teacher input[name="name"]').val('');

    $('#frm-teacher input:submit').val('新增')
    // 要先把前面事件处理取消掉，避免累积重复事件处理
    $('#frm-teacher').off('submit').on('submit', function() {
        var item = {};
        item['tn'] = $('#frm-teacher input[name="tn"]').val();
        item['name'] = $('#frm-teacher input[name="name"]').val();

        $.ajax({ 
            type: 'POST', 
            url: '/s/teacher/',
            data: JSON.stringify(item),
            dataType: 'json' 
        })
        .done(function(){
            load_list();
            $('#dlg-teacher-form').hide()
        });

        return false; // 在AJAX下，不需要浏览器完成后续的工作。
    });
    $('#dlg-teacher-form').show()
}


function delete_teacher(tn) {
    $.ajax({
        type: 'DELETE',
        url: '/s/teacher/' + tn,
        dataType: 'html'
    })
    .done(function() {
        load_list();
    });
}

//----------------------------------------------------
$(document).ready(function() {
	
    $( "#btn-refresh" ).on( "click", load_list);
    $( "#btn-new" ).on( "click", register_teacher);
    $( "#btn-teacher-frm-close" ).on( "click", function() {
        // 在关闭浏览器时，可能会自动提交，需要设置一个空提交方法。
        $('#frm-teacher').off('submit').on('submit', function() {
            return false;
        });
        $('#dlg-teacher-form').hide();
    });

    load_list();
});

//---设置AJAX缺省的错误处理方式
//---有时需要禁止全局错误处理时，可以在调用ajax时增添{global: false}禁止
$(document).ajaxError(function(event, jqxhr, settings, exception) {
    var msg = jqxhr.status + ': ' + jqxhr.statusText + "\n\n";
    if (jqxhr.status == 404 || jqxhr.status == 405 ) { 
        msg += "访问REST资源时，URL错误或该资源的请求方法\n\n"
        msg += settings.type + '  ' + settings.url  
    } else {
        msg += jqxhr.responseText;
    }
    alert(msg);
});


