$('#HomeUploadButtonHolder > a').click(function() {
    window.location.replace("/upload");
})

$('#HeaderBackLinkText').click(function() {
    var url = $(this).data("url");
    window.location.replace(url);
})

$('#ColorsFamiliesTap').click(function() {
    window.location.replace("/families");
})

$('#ColorsCollectionTap').click(function() {
    window.location.replace("/collection");
})

$('#nav-savedColorsTab').click(function() {
    if (screen.width >= 970) return;
    $('#SavedColorsModal').toggleClass('nav-slideDown');
    $('#SavedColorsModal').toggleClass('nav-slideUp');
    // console.log($('#headerMenu').height());
    if ($('#SavedColorsModal').hasClass('nav-slideDown')) {
        $('#headerMenu').height(70 + $('#SavedColorsModal').height());
    } else {
        $('#headerMenu').height(70);
    }
    $('#progressBar').removeClass('nav-slideDown');
    $('#progressBar').addClass('nav-slideUp');
})

$('#nav-menuTab').click(function() {
    if (screen.width >= 750) return;
    $('#progressBar').toggleClass('nav-slideDown');
    $('#progressBar').toggleClass('nav-slideUp');
    if ($('#progressBar').hasClass('nav-slideDown')) {
        $('#headerMenu').height(70 + $('#progressBar').height());
    } else {
        $('#headerMenu').height(70);
    }
    $('#SavedColorsModal').removeClass('nav-slideDown');
    $('#SavedColorsModal').addClass('nav-slideUp');
})

if (screen.width >= 970) {
    $('#SavedColorsModal').addClass('nav-slideDown');
} else {
    $('#SavedColorsModal').addClass('nav-slideUp');
}

$(window).resize(function(e){
    console.log(screen.width);
    if (screen.width >= 970) {
        $('#SavedColorsModal').removeClass('nav-slideUp');
        $('#SavedColorsModal').addClass('nav-slideDown');
        $('#nav-savedColorsTab').css({'border-top-right-radius': '15px'});
        return;
    }
    $('#nav-savedColorsTab').css({'border-top-right-radius': '0'});
    $('#SavedColorsModal').addClass('nav-slideUp');
    $('#SavedColorsModal').removeClass('nav-slideDown');
    if (screen.width < 750) {
        $('#progressBar').addClass('nav-slideUp');
        $('#progressBar').removeClass('nav-slideDown');
    }
    $('#headerMenu').height(70);
});

$(window).scroll(function(e){
    // console.log(screen.width);
    if (screen.width < 970) return;
    var $el = $('.fixedElement');
    var x_offset = $('#nav-menuTab').css('width');
    if ($(this).scrollTop() > 70){ 
        $el.css({
            'position': 'fixed',
            'top': '0',
            'transform': `translateX(-${x_offset})`
        });
        $('#nav-savedColorsTab').css({'border-top-right-radius': '0'});
    }
    if ($(this).scrollTop() < 70){
        $el.css({
            'position': 'static',
            'top': '0',
            'transform': `translateX(-${x_offset})`
        });
        $('#nav-savedColorsTab').css({'border-top-right-radius': '15px'});
    } 
});


///OLD

$( '#view_stream' ).click(function() {
    $('#stream_preview').attr('src',$('#stream_url').val());
});

$('body').on('click', '.Cur-Race-Delete', function(){
    $(this).closest('tr').remove();
    update_row_num('#cur_race_info_table');
})

$('#cur_race_info_add').click(function(){
    $('#cur_race_info_table').append("<tr><td class='border px-4 py-2 row_num'></td>"+
    "<td class='border px-4 py-2'><input class='info_name' name='name' type='text' value='' placeholder='Name'/></td>"+
    "<td class='border px-4 py-2'><input class='info_sp' name='sp' type='text' value='' placeholder='SP'/></td>"+
    "<td class='border px-4 py-2'>" +
    "<select id='info_color'>"+
        "<option class = 'Color_None' value='Color_None' 'selected'>None</option>"+
        "<option class = 'Color_Blue' value='Color_Blue' >Blue</option>"+
        "<option class = 'Color_Red' value='Color_Red' >Red</option>"+
    "</select>"+
    "</td>"+
    "<td class='border px-4 py-2'><button type='button' class='Cur-Race-Delete'>Delete</button></td></tr>");
    
    update_row_num('#cur_race_info_table');
})

$('#cur_race_info_clear').click(function(){
    $('#cur_race_info_table').html("");
})

$('body').on('click', '.Next-Race-Delete', function(){
    $(this).closest('tr').remove();
    update_row_num('#next_race_info_table');
})

$('#next_race_info_add').click(function(){
    $('#next_race_info_table').append("<tr><td class='border px-4 py-2 row_num'></td>"+
    "<td class='border px-4 py-2'><input class='info_name' name='name' type='text' value='' placeholder='Name'/></td>"+
    "<td class='border px-4 py-2'><input class='info_sp' name='sp' type='text' value='' placeholder='SP'/></td>"+
    "<td class='border px-4 py-2'>" +
    "<select id='info_color'>"+
        "<option class = 'Color_None' value='Color_None' 'selected'>None</option>"+
        "<option class = 'Color_Blue' value='Color_Blue' >Blue</option>"+
        "<option class = 'Color_Red' value='Color_Red' >Red</option>"+
    "</select>"+
    "</td>"+
    "<td class='border px-4 py-2'><button type='button' class='Next-Race-Delete'>Delete</button></td></tr>");
    
    update_row_num('#next_race_info_table');
})

$('#next_race_info_clear').click(function(){
    $('#next_race_info_table').html("");
})

$('body').on('click', '.Betting-Delete', function(){
    $(this).closest('tr').remove();
    update_row_num('#betting_info_table');
});

$('body').on('click', '.Betting-Update', function(){
    $(this).closest('tr').find('td > input').each(function(index){
        $(this).attr('temp', $(this).val());
        $(this).removeAttr('readonly');
    });
    $(this).closest('tr').find('td > textarea').each(function(index){
        $(this).attr('temp', $(this).text());
        $(this).removeAttr('readonly');
    });
    $(this).addClass('hide');
    $(this).siblings('.Betting-Delete').addClass('hide');
    $(this).siblings('.Betting-Cancel').removeClass('hide');
    $(this).siblings('.Betting-Save').removeClass('hide');
});

$('body').on('click', '.Betting-Cancel', function(){
    $(this).closest('tr').find('td > input').each(function(index){
        $(this).val($(this).attr('temp'));
        $(this).attr('readonly', true);
    });
    $(this).closest('tr').find('td > textarea').each(function(index){
        $(this).text($(this).attr('temp'));
        $(this).attr('readonly', true);
    });
    $(this).siblings('.Betting-Update').removeClass('hide');
    $(this).siblings('.Betting-Delete').removeClass('hide');
    $(this).addClass('hide');
    $(this).siblings('.Betting-Save').addClass('hide');
});

$('body').on('click', '.Betting-Save', function(){
    $(this).siblings('.Betting-Update').removeClass('hide');
    $(this).siblings('.Betting-Delete').removeClass('hide');
    $(this).addClass('hide');
    $(this).siblings('.Betting-Cancel').addClass('hide');
    $(this).closest('tr').find('td > input').each(function(index){
        $(this).attr('readonly', true);
    });
    $(this).closest('tr').find('td > textarea').each(function(index){
        $(this).attr('readonly', true);
    });
    $('#betting_info_table').prepend($(this).closest('tr').clone());
    $(this).closest('tr').remove();
    update_row_num('#betting_info_table');
});

$('#betting_info_add').click(function(){
    $('#betting_info_table').prepend(
        "<tr>"+
        "<td class='border px-4 py-2 row_num'>"+
        "</td>"+
        "<td class='border px-4 py-2'>"+
        "<input class='info_time' type='text' value='' placeholder='Time' readonly/>"+
        "</td>"+
        "<td class='border px-4 py-2'>"+
        "<input class='info_name' type='text' value='' placeholder='Name'  readonly/>"+
        "</td>"+
        "<td class='border px-4 py-2'>"+
        "<textarea class='info_text' value='' placeholder='Description'  readonly></textarea>"+
        "</td>"+
        "<td class='border px-4 py-2'>"+
        "<button type='button' class='Betting-Update'>Update</button>"+
        "<button type='button' class='Betting-Delete'>Delete</button>"+
        "<button type='button' class='Betting-Save hide'>Save</button>"+
        "<button type='button' class='Betting-Cancel hide'>Cancel</button>"+
        "</td></tr>");
    update_row_num('#betting_info_table');
})

$('body').on('click', '.Tips-Info-Delete', function(){
    $(this).closest('tr').remove();
    update_row_num('#tips_info_table');
})

$('#tips_info_add').click(function(){
    $('#tips_info_table').append("<tr>"+
    "<td class='border py-2'>"+
        "<input class='info_race' type='text' value='' placeholder='Race'/>"+
    "</td>"+
    "<td class='border py-2'>"+
        "<input class='info_selection' type='text' value='' placeholder='Selection'/>"+
    "</td>"+
    "<td class='border py-2'>"+
        "<input class='info_price' type='text' value='' placeholder='Price'/>"+
    "</td>"+
    "<td class='border py-2'>"+
        "<input class='info_notes' type='text' value='' placeholder='Notes'/>"+
    "</td>"+
    "<td class='border py-2'>"+
        "<button type='button' class='Tips-Info-Delete'>Delete</button>"+
    "</td>"+
    "</tr>");
})

$('#tips_info_clear').click(function(){
    $('#tips_info_table').html("");
})

function update_row_num(tbl_class){
    $(tbl_class).find("tr > td.row_num").each(function( index ) {
        $( this ).html(index+1);
    });
}

$('body').on('click', '#pdf_upload_button', function(){
    var formData = new FormData();
    if($('#pdf_file').length == 0)
        return;
    formData.append('file', $('#pdf_file')[0].files[0]);
    $.ajax({
        url : '/admin/setting/pdf_upload',
        type : 'POST',
        data : formData,
        processData: false,  // tell jQuery not to process the data
        contentType: false,  // tell jQuery not to set contentType
        success : function(data) {
            $('#message-box').first().removeClass('message-error').addClass('message-succeed').addClass('show').html('Update Succeed');
        },
        error: function(data){
            $('#message-box').first().removeClass('message-succeed').addClass('message-error').addClass('show').html(data.message);
        }
    });
})

$('body').on('click', '#stream_toggle', function(){
    if($('#stream_preview').hasClass('hide')){
        $('#stream_preview').toggleClass('hide');
        $('#stream_preview').fadeIn("slow");
    }else{
        $('#stream_preview').fadeOut("slow", function(){
            $('#stream_preview').toggleClass('hide');
        })
    }
})
