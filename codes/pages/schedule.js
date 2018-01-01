function render_list(list) {
    var tbody =  $("#list-tbody").empty();
    for (i in list) {
        var sc = list[i];
        var row = $('<tr>');
        $('<td>').text(sc['num']).appendTo(row);
        $('<td>').text(sc['day']).appendTo(row);
        $('<td>').text(sc['time']).appendTo(row);
        $('<td>').text(sc['classroom']).appendTo(row);
        $('<td>').text(sc['c_cn']).appendTo(row);
        $('<td>').text(sc['cname']).appendTo(row);
        $('<td>').text(sc['t_tn']).appendTo(row);
        $('<td>').text(sc['tname']).appendTo(row);
        $('<td>').text(sc['s_sn']).appendTo(row);
        $('<td>').text(sc['sname']).appendTo(row);

        var btn_edit = $('<button>')
            .text('修改')
            .on( "click", (function(sc) {
                return function( event ) {
                    var num = sc['num'];
                    console.log('edit: ' + num);
                    edit_sc(num);
                }
            })(sc));

        var btn_del = $('<button>')
            .text('删除')
            .on( "click", (function(item) { 
                return function( event ) {
                    delete_sc(item['num']);
                }
            })(sc));

        $('<td>').append(btn_edit).append(btn_del).appendTo(row);

        row.appendTo(tbody);
    }
}

function load_list() {
	$.ajax({
        type: 'GET',
  		url: "/s/sc/",
        data: '',
        dataType: 'json' 
	})
    .done(function(data) {
        render_list(data);
    });
}

function get_details(num) {
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

function edit_sc(num) {
    function put_sc() {
        var item = {};
        var num = $('#frm-sc input[name="num"]').val();
        item['num'] = num;
        item['day'] = $('#frm-sc select[name="day"]').val();
        item['time'] = $('#frm-sc select[name="time"]').val();
        item['classroom'] = $('#frm-sc input[name="classroom"]').val();
        item['c_cn'] = $('#frm-sc input[name="c_cn"]').val();
        item['t_tn'] = $('#frm-sc input[name="t_tn"]').val();
        item['s_sn'] = $('#frm-sc input[name="s_sn"]').val();
        var jsondata = JSON.stringify(item);
        $.ajax({ 
            type: 'PUT', 
            url: '/s/sc/' + num,
            data: jsondata,
            dataType: 'json' 
        })
        .done(function(){
            load_list();
            $('#dlg-sc-form').hide()
        });

        return false; // 在AJAX下，不需要浏览器完成后续的工作。
    }

    $.ajax({ 
        type: 'GET', 
        url: '/s/sc/' + num,
        dataType: 'json' 
    })
    .then(function(item) {
        $('#frm-sc input[name="num"]').val(item['num']);
        $('#frm-sc select[name="day"]').val(item['day']);
        $('#frm-sc select[name="time"]').val(item['time']);
        $('#frm-sc input[name="classroom"]').val(item['classroom']);
        $('#frm-sc input[name="c_cn"]').val(item['c_cn']);
        $('#frm-sc input[name="t_tn"]').val(item['t_tn']);
        $('#frm-sc input[name="s_sn"]').val(item['s_sn']);

        $('#frm-sc').off('submit').on('submit', put_sc);
        $('#frm-sc input:submit').val('修改')
        $('#dlg-sc-form').show()
    }); 

}


function register_sc() {
    // 因为新添和修改都使用和这个表单，因此需要置空这个表单
    $('#frm-sc select[name="num"]').val('');
    $('#frm-sc select[name="day"]').val('一');
    $('#frm-sc select[name="time"]').val('一');
    $('#frm-sc input[name="classroom"]').val('');
    $('#frm-sc input[name="c_cn"]').val('');
    $('#frm-sc input[name="t_tn"]').val('');
    $('#frm-sc input[name="s_sn"]').val('');

    $('#frm-sc input:submit').val('新增')
    // 要先把前面事件处理取消掉，避免累积重复事件处理
    $('#frm-sc').off('submit').on('submit', function() {
        var item = {};
        item['day'] = $('#frm-sc select[name="day"]').val();
        item['time'] = $('#frm-sc select[name="time"]').val();
        item['classroom'] = $('#frm-sc input[name="classroom"]').val();
        item['c_cn'] = $('#frm-sc input[name="c_cn"]').val();
        item['t_tn'] = $('#frm-sc input[name="t_tn"]').val();
        item['s_sn'] = $('#frm-sc input[name="s_sn"]').val();
        $.ajax({ 
            type: 'POST', 
            url: '/s/sc/',
            data: JSON.stringify(item),
            dataType: 'json' 
        })
        .done(function(){
            load_list();
            $('#dlg-sc-form').hide()
        });

        return false; // 在AJAX下，不需要浏览器完成后续的工作。
    });
    $('#dlg-sc-form').show()
}


function delete_sc(num) {
    $.ajax({
        type: 'DELETE',
        url: '/s/sc/' + num,
        dataType: 'html'
    })
    .done(function() {
        load_list();
    });
}

//----------------------------------------------------
$(document).ready(function() {
	
    $( "#btn-refresh" ).on( "click", load_list);
    $( "#btn-new" ).on( "click", register_sc);
    $( "#btn-sc-frm-close" ).on( "click", function() {
        // 在关闭浏览器时，可能会自动提交，需要设置一个空提交方法。
        $('#frm-sc').off('submit').on('submit', function() {
            return false;
        });
        $('#dlg-sc-form').hide();
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


