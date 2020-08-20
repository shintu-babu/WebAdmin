$('.preloader').hide();
$(document).bind("contextmenu", function (e) {
    return false;
});
//$(document).keydown(function (event) {
//    if (event.keyCode === 123) { // Prevent F12
//        return false;
//    } else if (event.ctrlKey && event.shiftKey && event.keyCode === 73) { // Prevent Ctrl+Shift+I        
//        return false;
//    }
//});
$.CCAjax = function (url, parameter, successCallBack) {
    var verificationToken = $.RequestVerificationToken;
    $('.preloader').show();
    $.ajax({
        url: url,
        type: 'POST',
        data: parameter,
        dataType: "html",
        headers: { "RequestVerificationToken": verificationToken },
        success: function (data, settings, xhr) {
            var response = $.CCParseJSON(data);
            if (response !== null && response.IsValid !== undefined && !response.IsValid) {
                $.ShowErrorMessages(response.ErrorMessages);
                return;
            }
            $('.preloader').hide();
         
            $("form").each(function () { $.data($(this)[0], 'validator', false); });
           // $.validator.unobtrusive.parse("form");

           
                successCallBack(data);

           
            //console.log(url);

        },
        error: function (jqXHR, textStatus, errorthrown) {
            var errorMsg = jqXHR.responseText;
            //errorMsg = errorMsg == "" ? jqXHR.status + ': ' + jqXHR.statusText : errorMsg;
            var errorPopup = '<div style="color:red;border-color:red;width:unset !important;"><strong>Error!</strong> ' + errorMsg + ' </div >';
            $("#CC-Model-Error").html(errorPopup);
            $('#CCInfoModal').modal('show');
            $('.preloader').hide();
            $(".modal-body").children('div').find('style').html('');
        }
        , complete: function (XHR, status) {
            //console.log("complete "+status+"      ,,,, "+XHR);
            $("form").each(function () { $.data($(this)[0], 'validator', false); });
           // $.validator.unobtrusive.parse("form");

        }
    });
}

$.ShowErrorMessages = function (errorMessages) {
    var errorPopup = '';
    $.each(errorMessages, function (key, value) {
        errorPopup += value + '<br />';
    });
    errorPopup = '<div style="color:red;border-color:red;width:unset !important;"><strong>Error!</strong> ' + errorPopup + ' </div >';
    $('.preloader').hide();
    $("#CC-Model-Error").html(errorPopup);
    //$('#CCInfoModal').modal('show');
   // $(".modal-body").children('div').find('style').html('');
    var div = '<div class="col-md-12 alert alert- danger alert-dismissable" style="color:red;border-color:red;margin:10px;width:unset !important;"><a href= "#" class="close skip-dirty" data- dismiss="alert" aria- label="close" >&times;</a >' + errorPopup + ' </div >';
    $(".ajax-content>div:first").prepend(div);
    $("body").animate({ scrollTop: 0 }, "fast");
    $(".close").click(function () {
        $(this).parent(".alert").remove();
    });
};
$.CCParseJSON = function (data) {
    var json = null;
    try {
        json = JSON.parse(data);
    }
    catch (err) {
       // console.log("CCParse json serialization error : " + err);
    }
    return json;
};

$.SetBreadCrumb = function (pageName, keyValue = {}) {
    $(".breadcrumb-title").html(pageName);
    $(".ol-breadcrumb").find("li:not(:first)").remove();

    if (keyValue !== null || keyValue !== {}) {
        $.each(keyValue, function (key, value) {
            //console.log("key   " + key + "    value    " + value);
            $(".ol-breadcrumb").append("<li class='breadcrumb-item' data-url='" + key+"'><a >" + value + "</a></li>");
        });
    }

    $(".ol-breadcrumb").find("li:last").addClass("active");
};


