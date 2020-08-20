$(document).ready(function () {
    jQuery.extend(jQuery.fn.dataTableExt.oSort, {
        "date-uk-pre": function (a) {
            var ukDatea = a.split('-');
            return (ukDatea[2] + ukDatea[1] + ukDatea[0]) * 1;
        },

        "date-uk-asc": function (a, b) {
            return ((a < b) ? -1 : ((a > b) ? 1 : 0));
        },

        "date-uk-desc": function (a, b) {
            return ((a < b) ? 1 : ((a > b) ? -1 : 0));
        }
    });
    $('.gridloader').show();

    $.RegisterCCTable = function (tableId, json, haveSummary,paging=true) {

        $("#headerButtons" + tableId).addClass("hidden");
        var dataDis = JSON.parse(json.data);

        for (var i = 0; i < dataDis.length; i++) {
            delete dataDis[i].Permission_Request;
            delete dataDis[i].Permission_Response;
            delete dataDis[i].User_Id;
            delete dataDis[i].User_Branch_Id;
            delete dataDis[i].Node_Id;
            delete dataDis[i].Bank_Date;
            delete dataDis[i].Company_Id;
            delete dataDis[i].Bank_Id;
            delete dataDis[i].ResponseMessage;
            // dataDis[0].pos();
        }

        dataDis.shift();
        var dataToload = eval(dataDis);
        var columnToDisplay = eval(json.column);
        var hiddenTargets = eval(json.hiddenTrgt);
        var summaryTargets = eval(json.summaryTrgt);
        var dateTargets = eval(json.dateTrgt);
        var intTargets = eval(json.intTrgt);
        var decimalTargets = eval(json.decimalTrgt);
        var boolTargets = eval(json.boolTrgt);

        var pagelength = 10;
        if (paging === false) {
            pagelength = 1000;
        }

        table = $("#" + tableId).DataTable({
            "dom": "<'row'<'col-md-9 headerButtons' ><'col-md-3'f>>rtip",
            data: dataToload,
            scrollResize: true,
            scrollX: "200%",
            scrollY: 300,
            scrollCollapse: true,
            paging: true,
            "pageLength": pagelength,
            lengthChange: false,
            sScrollXInner: "100%",
            fixedColumns: true,
            "aaSorting": [],
            columns: columnToDisplay,
            columnDefs: [{
                "searchable": false,
                "orderable": false,
                "targets": 0
            },
            {//Hidden fields
                "searchable": false,
                "visible": false,
                "targets": hiddenTargets
            },
            {//date Fields
                "className": "dt-center",
                "sType": "date-uk",
                "type": 'date',
                "render": function (value) {
                    if (value === null) return "";
                    var dt = new Date(value);
                    return (dt.getDate() < 10 ? "0" + dt.getDate() : dt.getDate()) + "-" + ((dt.getMonth() + 1) < 10 ? "0" + (dt.getMonth() + 1) : (dt.getMonth() + 1)) + "-" + dt.getFullYear();
                },
                "targets": dateTargets
            },
            {//decimal Field
                "className": "dt-right",
                "render": function (value) { if (value === 0) return ""; return value.toFixed(2); },
                "targets": decimalTargets
            },
            {//int Field
                "className": "dt-right",
                "targets": intTargets
            },
            {//checkbox
                "className": 'dt-checkbox',
                "render": function (value) {
                    var is_checked = value === true ? "checked" : "";
                    return '<input type="checkbox" class="checkbox" ' + is_checked + ' />';
                },
                "targets": boolTargets
            }
            ],
            //Row Call back for Slno
            "fnRowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                $("td:eq(0)", nRow).html(iDisplayIndexFull + 1);
                $("td:not(.dt-right,.dt-center,.dt-checkbox):not(:eq(0))", nRow).addClass("max-field-width");
                $("th.dt-right", nRow).attr("style", "width:unset !importat;");
                return nRow;
            },
            "drawCallback": function (settings) {
                $('.gridloader').hide();
                return true;

            },
            //Footer call back
            "footerCallback": function (row, data, start, end, display) {
                if (haveSummary) {
                    var api = this.api(), data;
                    var apiColumns = api.columns();

                    $(api.column(0).footer()).html('Page Total');
                    $(api.column(0).footer()).parent().siblings().find("th:eq(0)").html('Grand Total');

                    for (var item in summaryTargets) {
                        for (var i in intTargets) {
                            if (intTargets[i] == summaryTargets[item]) {
                                $(api.column(summaryTargets[item]).footer()).html($.GetPageTotalCCTable(api, summaryTargets[item], "integer"));
                                var pos = parseInt(summaryTargets[item]) - 1;
                                $(api.column().footer()).parent().siblings().find("th:eq(" + pos + ")").addClass("dt-right").html($.GetPageTotalCCTable(api, summaryTargets[item], 'integer'));
                            }
                            else {
                                $(api.column(summaryTargets[item]).footer()).html($.GetPageTotalCCTable(api, summaryTargets[item], 'decimal'));
                                var pos = parseInt(summaryTargets[item]) - 1;
                                $(api.column().footer()).parent().siblings().find("th:eq(" + pos + ")").addClass("dt-right").html($.GetGrandTotalCCTable(api, summaryTargets[item], 'decimal'));
                            }
                        }

                    }
                }
            }
        });
       
        $("#headerButtons" + tableId).removeClass("hidden");
        $("div#searchHolder" + tableId).html("");
        $("#" + tableId + "_filter").appendTo($("div#searchHolder" + tableId));
        $("#" + tableId + " td.max-field-width").hover(function () {
            $(this).attr("title", $(this).html());
        });
        $(".cc-table").removeClass("hidden");
        $("#cctableDiv").removeClass("hidden");
        table.columns.adjust();
       
        return table;
    };




    $.GetPageTotalCCTable = function (api, columnIndex, type) {
        var intVal = function (i) {
            return typeof i === 'string' ?
                i.replace(/[\$,]/g, '') * 1 :
                typeof i === 'number' ?
                    i : 0;
        };

        // Total over this page
        pageTotal = api
            .column(columnIndex, { page: 'current' })
            .data()
            .reduce(function (a, b) {
                return intVal(a) + intVal(b);
            }, 0);
        if (type == "integer") {
            return parseFloat(pageTotal);
        }
        else {
            return parseFloat(pageTotal).toFixed(2);
        }
    }

    $.GetGrandTotalCCTable = function (api, columnIndex, type) {
        var intVal = function (i) {
            return typeof i === 'string' ?
                i.replace(/[\$,]/g, '') * 1 :
                typeof i === 'number' ?
                    i : 0;
        };

        // Total over all pages
        total = api
            .column(columnIndex)
            .data()
            .reduce(function (a, b) {
                return intVal(a) + intVal(b);
            }, 0);

        if (type == "integer") {
            return parseFloat(total);
        }
        else {
            return parseFloat(total).toFixed(2);
        }
    }

    $.CCTableSaveUpdateDelete = function () {
        var tableId = $.SetTableId();
        var datatable = $("#" + tableId).DataTable();
        var index = $.SetRowId();
        if ($("#" + tableId + ' tr.selected').length !== 1) {
            alert("Please Select One Row To Delete!!!");
            return false;
        }

        var rowToDelete = [];
        //Row to Delete
        var deleteRows = datatable.cells({ row: index, column: 0 }).data()[0];
        console.log(deleteRows);

        var jsonObjectOld = {};
        $.each(deleteRows, function (key, value) {
            jsonObjectOld[key] = value;
        });

        jsonObjectOld['Data_Pair_Id'] = 1;
        jsonObjectOld['Data_Status'] = 'DeleteData';
        jsonObjectOld['Permission_Request'] = PermissionRequest;
        rowToDelete.push(jsonObjectOld);

        console.log(rowToDelete);

        var CrudData = rowToDelete;
        if (CrudData.length > 0) {
            if (confirm('Do you want to Delete data ?', 'YES', 'No')) {
                $.SaveCCTable(CrudData);
            }
        }
        return false;

    };

    $.CCTableVerification = function () {
        var tableId = $.SetTableId();

        //if ($("#" + tableId + ' tr.selected').length !== 1) {
        //    alert("Please Select One Row To Delete!!!");
        //    return false;
        //}

        var rowToUpdate = [];
        var datatable = $("#" + tableId).DataTable();
        var index = 0;
        $("#" + tableId + " tbody tr").each(function () {
            if ($(this).find("td input[type=checkbox]").is(":checked")) {
                index = datatable.row(this).index();
                var details = datatable.cells({ row: index, column: 0 }).data()[0];
                console.log(details);
                details['Data_Status'] = 'VerifyData';
                details['Data_Pair_Id'] = 0;
                rowToUpdate.push(details);
            }
            index++;
        });
        console.log(rowToUpdate);

        var CrudData = rowToUpdate;
        if (CrudData.length > 0) {
            if (confirm('Do you want to Verify data ?', 'YES', 'No')) {
                $.VerifyCCTable(CrudData);
            }

        }
        else {
            alert("Nothing To verify");
        }
        return false;

    };

    $.CCTableEncashment = function () {
        var tableId = $.SetTableId();

        //if ($("#" + tableId + ' tr.selected').length !== 1) {
        //    alert("Please Select One Row To Delete!!!");
        //    return false;
        //}

        var rowToUpdate = [];
        var datatable = $("#" + tableId).DataTable();
        var index = 0;
        $("#" + tableId + " tbody tr").each(function () {
            console.log(index);
            if ($(this).find("td input[type=checkbox]").is(":checked")) {
                var details = datatable.cells({ row: index, column: 0 }).data()[0];
                console.log(details);
                details['Data_Status'] = 'VerifyData';
                details['Data_Pair_Id'] = 0;
                rowToUpdate.push(details);
            }
            index++;
        });
        console.log(rowToUpdate);

        var CrudData = rowToUpdate;
        if (CrudData.length > 0) {
            if (confirm('Do you want to Encash data ?', 'YES', 'No')) {
                $.EncashCCTable(CrudData);
            }

        }
        else {
            alert("Nothing To Encash");
        }
        return false;

    };

});