$(document).on('ready pjax:end', function() {
	$(".datetimepicker:not(.hasDatepicker)").datetimepicker({timeFormat: 'hh:mm', dateFormat: "yy-mm-dd"});
	$(".datepicker:not(.hasDatepicker)").datepicker({dateFormat: "yy-mm-dd"});	
});

$(function() {
    $('input[type="checkbox"]').ezMark();
    $('input[type="radio"]').ezMark();
    $("[data-toggle='popover']").popover();
});

//for (var i=0;i<onload.length; i++) {
//	$.apply(null, onload[i]);
//}
//for (var i=0;i<onload_pjax.length; i++) {
//	$(document).bind("ready pjax:end", onload_pjax[i][0]);
//}