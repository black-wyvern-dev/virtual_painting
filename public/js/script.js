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

$('#AdminColorsFamiliesTap').click(function() {
    window.location.replace("/admin_families");
})

$('#AdminColorsCollectionTap').click(function() {
    window.location.replace("/admin_collection");
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
    // console.log(screen.width);
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
    if ($(this).scrollTop() > 110){ 
        $el.css({
            'position': 'fixed',
            'top': '0',
            'transform': `translateX(-${x_offset})`
        });
        $('#nav-savedColorsTab').css({'border-top-right-radius': '0'});
    }
    if ($(this).scrollTop() < 110){
        $el.css({
            'position': 'static',
            'top': '0',
            'transform': `translateX(-${x_offset})`
        });
        $('#nav-savedColorsTab').css({'border-top-right-radius': '15px'});
    } 
});

$('body').on('click', '.SavedColorDelete', function(){
    // $(this).closest('tr').remove();
    // update_row_num('#cur_race_info_table');
    console.log('ok', globalCurColorIdx);
})

$('body').on('click', '.SavedColorData', function(){
    const index = $(this).closest('.SavedColorItem').data('index');
    if (globalCurColorIdx == index + 1) {
        $(this).closest('#SavedColorsList').data('current', 0);
        $(this).children('.SavedColor_Col').first().html("");
        globalCurColorIdx = 0;
    } else {
        $(this).closest('#SavedColorsList').data('current', index + 1);
        $(".SavedColor_Col").eq(globalCurColorIdx - 1).html("");
        $(this).children(".SavedColor_Col").first().html("<span id='SavedColor_ColCheck'"+
            "class='material-icons'>check_circle</span>");
        globalCurColorIdx = index + 1;
    }
    // update_row_num('#cur_race_info_table');
})

$('.UploadCheckBox').click(function() {
    $('.UploadCheckBox').toggleClass('UploadCheckBoxChecked');
    $('.UploadCheckBox').toggleClass('UploadCheckBoxUnchecked');
    $('#UploadPhotoButton').toggleClass('Active');
});

$('#UploadPhotoButton').click(function() {
    $('#ImagePicker').click();
});

$('#ImagePicker').on('change', function(e) {
    var formData = new FormData();
    if($('#ImagePicker').length == 0)
        return;
    formData.append('file', $('#ImagePicker')[0].files[0]);
    $(".notification-pane").show();
    $.ajax({
        url : '/file_upload',
        type : 'POST',
        data : formData,
        processData: false,  // tell jQuery not to process the data
        contentType: false,  // tell jQuery not to set contentType
        success : function(data) {
            $(".notification-pane").hide();
            $('.nav-2Step').attr('href', '/color');
            $('.nav-2Step .nav-circle').addClass('enabled');
            $('.nav-2Step .nav-progressLine').addClass('enabled');
            $('.nav-2Step .nav-progressText').addClass('enabled');
        },
        error: function(data){
            $(".notification-pane").hide();
            alert('Upload Failed. try again.');
        }
    });
});

$('#UploadButton').click(function() {
    $('#ProductImagePicker').click();
});

function checkSubmitActive() {
    if ($('#ProductTitleContainer > input').val() == '') { $('#SubmitButton').removeClass('Active'); return;}
    if ($('#ProductIdContainer > input').val() == '') { $('#SubmitButton').removeClass('Active'); return;}
    if ($('#ProductPreview > img').attr('src') == '') { $('#SubmitButton').removeClass('Active'); return;}
    $('#SubmitButton').addClass('Active');
}

function productReset(){
    $('#ProductTitleContainer > input').val('');
    $('#ProductIdContainer > input').val('');
    if ( $('#ColorTypeChecker > a').hasClass('UploadCheckBoxUnchecked') ) {
        $('.UploadCheckBox').toggleClass('UploadCheckBoxChecked');
        $('.UploadCheckBox').toggleClass('UploadCheckBoxUnchecked');
    }
    $('#SubmitButton').removeClass('Active');
    $('#ProductPreview > img').addClass('ProductPreviewHidden');
    $('#ProductPreview > div').removeClass('ProductPreviewHidden');
    $('#ProductPreview > img').attr('src', '');
};

$('#SubmitButton').click(function() {
    const title= $('#ProductTitleContainer > input').val();
    const id= $('#ProductIdContainer > input').val();
    const src = $('#ProductPreview > img').attr('src');
    const type = $('#ColorTypeChecker > a').hasClass('UploadCheckBoxChecked') ? 'colors' : 'patterns';
    $(".notification-pane").show();
    $.ajax({
        url : '/add_product',
        type : 'POST',
        data : {
            title: title,
            id: id,
            src: src,
            type: type
        },
        success : function(data) {
            // console.log(data);
            productReset();
            $(".notification-pane").hide();
        },
        error: function(data){
            $(".notification-pane").hide();
            alert('Product Add Failed. Try again.');
        }
    });
});

$('#ResetButton').click(function() { 
    const draftsrc = $('#ProductPreview > img').attr('src');
    console.log('draft: ', draftsrc);
    if (draftsrc) {
        $(".notification-pane").show();
        $.ajax({
            url : '/reset_upload',
            type : 'POST',
            data : {
                draftsrc: draftsrc,
            },
            success : function(data) {
                $(".notification-pane").hide();
            },
            error: function(data){
                $(".notification-pane").hide();
                console.log('Draft Upload Reset Failed.');
            }
        });
    }
    productReset();
});

$('#ProductTitleContainer > input').on('change', function(e) {
    checkSubmitActive();
});

$('#ProductIdContainer > input').on('change', function(e) {
    const src = $('#ProductPreview > img').attr('src');
    // console.log(src);
    checkSubmitActive();
});

$('#ProductImagePicker').on('change', function(e) {
    var formData = new FormData();
    var filePath;
    if($('#ProductImagePicker').length == 0)
        return;
    if ($('#ColorTypeChecker > a').hasClass('UploadCheckBoxChecked')) filePath = 'colors?';
    else filePath = 'patterns?';
    filePath +=  $('#ProductPreview > img').attr('src');
    console.log('oldFile: ', $('#ProductPreview > img').attr('src'));
    formData.append('file', $('#ProductImagePicker')[0].files[0]);
    $(".notification-pane").show();
    $.ajax({
        url : '/image_upload' + filePath,
        type : 'POST',
        data : formData,
        processData: false,  // tell jQuery not to process the data
        contentType: false,  // tell jQuery not to set contentType
        success : function(data) {
            $(".notification-pane").hide();
            $('#ProductPreview > img').attr('src', data.result);
            $('#ProductPreview > img').removeClass('ProductPreviewHidden');
            $('#ProductPreview > div').addClass('ProductPreviewHidden');
            checkSubmitActive();
            // $('.nav-2Step').attr('href', '/color');
            // $('.nav-2Step .nav-circle').addClass('enabled');
            // $('.nav-2Step .nav-progressLine').addClass('enabled');
            // $('.nav-2Step .nav-progressText').addClass('enabled');
        },
        error: function(data){
            $(".notification-pane").hide();
            alert('Upload Failed. try again.');
        }
    });
});