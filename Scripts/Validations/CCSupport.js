(function ($) {
    var $jQval = $.validator;
    $jQval.addMethod("calldetails", function (value, element, params) {
        value = $.trim(value);
        alert(value);
        if (!value) return true;
        return false;
    });
    var adapters = $jQval.unobtrusive.adapters;
    adapters.addBool("calldetails");
})(jQuery);

(function ($) {
    var $jQval = $.validator;
    $jQval.addMethod("contactno", function (value, element, params) {
        value = $.trim(value);
        alert(value);
        if ((!value)&&(!value.match('[0-9]{10,11}'))) return false;
        return true;
    });
    var adapters = $jQval.unobtrusive.adapters;
    adapters.addBool("contactno");
})(jQuery);

(function ($) {
    var $jQval = $.validator;
    $jQval.addMethod("datecompare", function (value, element, params) {
        console.log(value);
        value = $.trim(value);
        var dateto = $("#Date_To").val();
        alert(value);
        console.log('helllloooooo');
        console.log(value);

        if ((!value) &&(!(value <= dateto))) return false;
        return true;
    });
    var adapters = $jQval.unobtrusive.adapters;
    adapters.addBool("datecompare");
})(jQuery);

(function ($) {
    var $jQval = $.validator;
    $jQval.addMethod("monthdiff", function (value, element, params) {
        value = $.trim(value);
        var dateto = $("#Date_To").val();
        var monthTo = dateto.month();
        var monthFrom = value.month();
      
        if (monthTo > monthFrom) {
           var monthdiff = monthTo - monthFrom;
        }
        else {
           var monthdiff = monthFrom - monthTo;
        }
        if (monthdiff>6) return false;
        return true;
    });
    var adapters = $jQval.unobtrusive.adapters;
    adapters.addBool("monthdiff");
})(jQuery);