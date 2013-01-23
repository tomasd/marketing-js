$(function() {
	var container = $('<ul class="thumbnails">').appendTo(".add-attribute");
	$(".add-attribute :input optgroup").each(function(index, optgroup) {
		var group = $('<li class="span3"">').appendTo(container);
		//group = $('<div class="thumbnail">').appendTo(group);
		group.append($("<h4>").html($(optgroup).attr("label")));
		var groupContainer = $('<ul class="thumbnail">').appendTo(group);
		$("option", optgroup).each(function(index, option){
			var link = $("<a>").attr('href','#').html($(option).html());
			groupContainer.append($("<li>").append(link));

			link.click(function() {
					$(".add-attribute :input").val($(option).attr("value"));
					$(".add-attribute").parents("form:first").submit();

				});
		});
	});
	$(".add-attribute .controls").hide();
	//var maxHeight = container.reduce(fuction)
});
