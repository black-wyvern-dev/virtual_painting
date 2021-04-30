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
    if (!$('#SavedColorsList').data('admin')) return;
    
    const index = $(this).closest('.SavedColorItem').data('index');
    var id = $(this).closest('.SavedColorItem').data('id');
    var self = $(this).closest('.SavedColorItem');
    $(".notification-pane").show();
    $.ajax({
        url : '/delete_product',
        type : 'POST',
        data : {
            id: id,
        },
        success : function(data) {
            if (globalCurColorIdx == index + 1) {
                resetHandler();
            }
            if (globalCurColorIdx >= index + 1) globalCurColorIdx--;
            $('#SavedColorsList').data('current', globalCurColorIdx);
            const len = $('.SavedColorItem').length;
            if (index != len - 1) {
                for ( i = index + 1; i < len ; i++) {
                    $('.SavedColorItem').eq(i).attr('data-index', i - 1);
                    $('.SavedColorItem').eq(i).data('index', i - 1);
                }
            }
            
            $.ajax({
                url : '/reset_upload',
                type : 'POST',
                data : {
                    draftsrc: self.data('src'),
                },
                success : function(data) {
                    $(".notification-pane").hide();
                },
                error: function(data){
                    $(".notification-pane").hide();
                    console.log('Draft Upload Reset Failed.');
                }
            });
            self.remove();
        },
        error: function(data){
            $(".notification-pane").hide();
            alert('Product Add Failed. Please check and try again.');
        }
    });
})

$('body').on('click', '.SavedColorData', function(){
    const index = $(this).closest('.SavedColorItem').data('index');
    if (globalCurColorIdx == index + 1) {
        $(this).closest('#SavedColorsList').data('current', 0);
        $(this).children('.SavedColor_Col').first().html("");
        globalCurColorIdx = 0;
    } else {
        $(this).closest('#SavedColorsList').data('current', index + 1);
        $(".SavedColorItem[data-index="+(globalCurColorIdx - 1)+"]").find(".SavedColor_Col").html("");
        $(this).children(".SavedColor_Col").first().html("<span id='SavedColor_ColCheck'"+
            "class='material-icons'>check_circle</span>");
        globalCurColorIdx = index + 1;
    }
    if ($('#SavedColorsList').data('admin')) productSelect();
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
    $('#ProductPreview').data('imgurl','');
    $('#SubmitButton').find('#UploadText').text('Add');
};

function productSelect(){
    const draftsrc = $('#ProductPreview > img').attr('src');
    var curSrc = $('#ProductPreview').data('imgurl');
    if (draftsrc) {
        if(!curSrc || curSrc != draftsrc) {
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
    }
    productReset();
    if( !globalCurColorIdx ) return;

    var el = $(".SavedColorItem[data-index="+(globalCurColorIdx - 1)+"]");
    var id = el.data('id');
    var src = el.data('src');
    var type = src.indexOf('/colors/') != -1 ? 'colors' : 'patterns';
    var title = el.find('.SavedColorName > span').text();

    $('#ProductTitleContainer > input').val(title);
    $('#ProductIdContainer > input').val(id);
    $('#ProductIdContainer > input').data('id', id);
    if (type == 'patterns') {
        $('.UploadCheckBox').toggleClass('UploadCheckBoxChecked');
        $('.UploadCheckBox').toggleClass('UploadCheckBoxUnchecked');
    }
    $('#ProductPreview > img').removeClass('ProductPreviewHidden');
    $('#ProductPreview > div').addClass('ProductPreviewHidden');
    $('#ProductPreview > img').attr('src', src);

    $('#ProductPreview').data('imgurl', src);
    $('#SubmitButton').find('#UploadText').text('Update');
    $('#SubmitButton').addClass('Active');
};

$('#SubmitButton').click(function() {
    const title= $('#ProductTitleContainer > input').val();
    const oldId= $('#ProductIdContainer > input').data('id');
    const id= $('#ProductIdContainer > input').val();
    var src = $('#ProductPreview > img').attr('src');
    const type = $('#ColorTypeChecker > a').hasClass('UploadCheckBoxChecked') ? 'colors' : 'patterns';
    const postUrl = $(this).find('#UploadText').text() == 'Add' ? '/add_product' : '/update_product';
    $(".notification-pane").show();
    $.ajax({
        url : postUrl,
        type : 'POST',
        data : {
            old_id: oldId,
            title: title,
            id: id,
            src: src,
            type: type
        },
        success : function(data) {
            if (src.indexOf(type) == -1) {
                var strList = src.split('/');
                for ( i in strList ) {
                    if (strList[i] == 'colors' || strList[i] == 'patterns') {strList[i] = type;break;}
                }
                var newStr = strList.join('/');
                console.log('newStr: ', newStr);
                src = newStr;
            }
            if (postUrl == '/update_product') {
                var curSrc = $('#ProductPreview').data('imgurl');
                if (curSrc != src)
                    $.ajax({
                        url : '/reset_upload',
                        type : 'POST',
                        data : {
                            draftsrc: curSrc,
                        },
                        success : function(data) {
                            $(".notification-pane").hide();
                        },
                        error: function(data){
                            $(".notification-pane").hide();
                            console.log('Draft Upload Reset Failed.');
                        }
                    });

                if( globalCurColorIdx ) {
                    var el = $(".SavedColorItem[data-index="+(globalCurColorIdx - 1)+"]");
                    el.data('id', id);
                    el.data('src', src);
                    el.find('.SavedColor_Col').attr('style', 'background-image: url('+src+'); background-size: contain;');
                    el.find('.SavedColorName > span').text(title);
                    el.find('.SavedColorID > span').text(id);
                    el.find(".SavedColor_Col").html("");
                }
                $(".notification-pane").hide();
            } else {
                var origin = $('#SavedColorsList').html();
                var idx = $('.SavedColorItem').length;

                origin += 
                '<div class="SavedColorItem" style="" data-index="'+idx+'" data-id="'+id+'" data-src="'+src+'">'+
                    '<div class="SavedColorData">'+
                        '<div class="SavedColor_Col" style="background-image: url('+src+'); background-size: contain;">'+
                        '</div>'+
                        '<div class="SavedColorInfo UploadRoboMedium">'+
                            '<p class="SavedColorName">'+
                                '<span class="">'+title+'</span>'+
                            '</p>'+
                            '<p class="SavedColorID">'+
                                '<span class="">'+id+'</span>'+
                            '</p>'+
                        '</div>'+
                    '</div>'+
                    '<div class="SavedColorDelete">'+
                        '<div class="SavedColorTrash material-icons">'+
                            '<span>delete</span>'+
                        '</div>'+
                    '</div>'+
                '</div>';
                $('#SavedColorsList').html(origin);
                $(".notification-pane").hide();
            }
            productReset();
        },
        error: function(data){
            if (postUrl == '/update_product') {
            } else {
                $.ajax({
                    url : '/reset_upload',
                    type : 'POST',
                    data : {
                        draftsrc: src,
                    },
                    success : function(data) {
                        $(".notification-pane").hide();
                    },
                    error: function(data){
                        $(".notification-pane").hide();
                        console.log('Draft Upload Reset Failed.');
                    }
                });
                $('#SubmitButton').removeClass('Active');
                $('#ProductPreview > img').addClass('ProductPreviewHidden');
                $('#ProductPreview > div').removeClass('ProductPreviewHidden');
                $('#ProductPreview > img').attr('src', '');
                // $(".notification-pane").hide();
                alert('Product Id is already exist. Please check and try again.');
            }
        }
    });
});

const resetHandler = function() { 
    const draftsrc = $('#ProductPreview > img').attr('src');
    var curSrc = $('#ProductPreview').data('imgurl');
    if (draftsrc && curSrc != draftsrc) {
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
    $(".SavedColorItem[data-index="+(globalCurColorIdx - 1)+"]").find(".SavedColor_Col").html("");
}

$('#ResetButton').click(resetHandler);

$('#ProductTitleContainer > input').on('change', function(e) {
    checkSubmitActive();
});

$('#ProductIdContainer > input').on('change', function(e) {
    const src = $('#ProductPreview > img').attr('src');
    checkSubmitActive();
});

$('#ProductImagePicker').on('change', function(e) {
    var formData = new FormData();
    var filePath;
    if($('#ProductImagePicker').length == 0)
        return;
    if ($('#ColorTypeChecker > a').hasClass('UploadCheckBoxChecked')) filePath = 'colors?';
    else filePath = 'patterns?';
    const draftsrc = $('#ProductPreview > img').attr('src');
    var curSrc = $('#ProductPreview').data('imgurl');
    if (curSrc && draftsrc!=curSrc)
        filePath +=  $('#ProductPreview > img').attr('src');
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
        },
        error: function(data){
            $(".notification-pane").hide();
            alert('Upload Failed. try again.');
        }
    });
});