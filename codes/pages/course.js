function render_list(list) {
    var tbody =  $("#list-tbody").empty();
    for (i in list) {
        var course = list[i];
        var row = $('<tr>');
        $('<td>').text(parseInt(i) + 1).appendTo(row);
        $('<td>').text(course['cn']).appendTo(row);
        $('<td>').text(course['name']).appendTo(row);
        $('<td>').text(course['credit']).appendTo(row);

        var btn_edit = $('<button>')
            .text('修改')
            .on( "click", (function(course) {
                return function( event ) {
                    var cn = course['cn'];
                    console.log('edit: ' + cn);
                    edit_course(cn);
                }
            })(course));

        var btn_del = $('<button>')
            .text('删除')
            .on( "click", (function(item) {
                return function( event ) {
                    delete_course(item['cn']);
                }
            })(course));

        $('<td>').append(btn_edit).append(btn_del).appendTo(row);

        row.appendTo(tbody);
    }
}

function load_list() {
	$.ajax({
        type: 'GET',
  		url: "/s/course/",
        data: '',
        dataType: 'json' 
	})
    .done(function(data) {
        render_list(data);
    });
}

function get_details(cn) {
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

function edit_course(cn) {
    function put_course() {
        var item = {};
        var cn = $('#frm-course input[name="cn"]').val();
        item['cn'] = cn;
        item['name'] = $('#frm-course input[name="name"]').val();
        item['credit'] = $('#frm-course input[name="credit"]').val();

        var jsondata = JSON.stringify(item);
        $.ajax({ 
            type: 'PUT', 
            url: '/s/course/' + cn,
            data: jsondata,
            dataType: 'json' 
        })
        .done(function(){
            load_list();
            $('#dlg-course-form').hide()
        });

        return false; // 在AJAX下，不需要浏览器完成后续的工作。
    }

    $.ajax({ 
        type: 'GET', 
        url: '/s/course/' + cn,
        dataType: 'json' 
    })
    .then(function(item) {
        $('#frm-course input[name="cn"]').val(item['cn']);
        $('#frm-course input[name="name"]').val(item['name']);
        $('#frm-course input[name="credit"]').val(item['credit']);

        $('#frm-course').off('submit').on('submit', put_course);
        $('#frm-course input:submit').val('修改')
        $('#dlg-course-form').show()
    }); 

}


function register_course() {
    // 因为新添和修改都使用和这个表单，因此需要置空这个表单
    $('#frm-course input[name="cn"]').val('');
    $('#frm-course input[name="name"]').val('');
    $('#frm-course input[name="credit"]').val('');

    $('#frm-course input:submit').val('新增')
    // 要先把前面事件处理取消掉，避免累积重复事件处理
    $('#frm-course').off('submit').on('submit', function() {
        var item = {};
        item['cn'] = $('#frm-course input[name="cn"]').val();
        item['name'] = $('#frm-course input[name="name"]').val();
        item['credit'] = $('#frm-course input[name="credit"]').val();

        $.ajax({ 
            type: 'POST', 
            url: '/s/course/',
            data: JSON.stringify(item),
            dataType: 'json' 
        })
        .done(function(){
            load_list();
            $('#dlg-course-form').hide()
        });

        return false; // 在AJAX下，不需要浏览器完成后续的工作。
    });
    $('#dlg-course-form').show()
}


function delete_course(cn) {
    $.ajax({
        type: 'DELETE',
        url: '/s/course/' + cn,
        dataType: 'html'
    })
    .done(function() {
        load_list();
    });
}

//----------------------------------------------------
$(document).ready(function() {
	
    $( "#btn-refresh" ).on( "click", load_list);
    $( "#btn-new" ).on( "click", register_course);
    $( "#btn-course-frm-close" ).on( "click", function() {
        // 在关闭浏览器时，可能会自动提交，需要设置一个空提交方法。
        $('#frm-course').off('submit').on('submit', function() {
            return false;
        });
        $('#dlg-course-form').hide();
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


