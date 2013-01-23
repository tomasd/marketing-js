$(function() {
	$(".attribute-container").each(showGraph);
});

function showGraph(index, item) {
	var last = index == $(".attribute-container").length-1;
	var container = $(item);
	var title = $(item).attr("title");
	var series = attributes[$(item).attr("attribute")];
	var graphDefaults = newGraphDefaults(container, title, last);
	
	if ($(item).attr("type") == 'category') {
		categoryHandler(graphDefaults, container, title, series);
	} else if ($(item).attr("type") == 'numeric-bin') {
		numericBinHandler(graphDefaults, container, title, series);
	} else if ($(item).attr("type") == 'temporal') {
		temporalHandler(graphDefaults, container, title, series);
	}
}

function categoryHandler(graphDefaults, container, title, series) {
	var type = 'column';
	series = $(series).map(function() {
		return {id:this[0], y:this[1], name:this[0]!=''?this[0]:'Not specified'};
	});
	categories = $(series).map(function() {
		return this.name;
	});
	var input = container.find("select");
	var click = function(event) {
		var val = input.val() || [];
		var pointId = event.point.id==null?'':event.point.id;
		if ($.inArray(pointId, val)==-1) {
			val = val.concat([pointId])
		} else {
			val = $.grep(val, function(value) {
				return value != pointId;
			});
		}
		input.val(val).change();
	};
	
	categoryDefaults(graphDefaults, categories, series, title, click)
	var chart = new Highcharts.Chart(graphDefaults);
	
	input.change(function(){
		$.each(chart.series[0].points, function(index, point) {
			var pointId = point.id==null?"":point.id;
			if ($.inArray(pointId, input.val())!=-1) {
				point.select(true, true);
			} else {
				point.select(false, true);
			} 
		});
		container.removeClass("error");
		container.find('.errors').remove();
		container.find(".error").removeClass("error");
	}).change();
}

function numericBinHandler(graphDefaults, container, title, series) {
	var start = $(":input[name*='start']", container);
	var end = $(":input[name*='end']", container);
	
	var click = function(event) {
		var startVal = '', endVal = '';
		
		if (start.val() == '' && end.val() == '') {
			startVal = event.point.min;
			endVal = '';
		} else
		if (end.val() == '') {
			startVal = start.val();
			endVal = event.point.max;
		}
		else{
			startVal = event.point.min;
			endVal = '';
		}
		
		end.val(endVal);
		start.val(startVal).change();
	};
	
	var categories = [];
	series = $.map(series, function(item) {
		var label = item.min + ' - ' + item.max;
		if (item.min == item.max) {
			label = item.min + '';
		}
		categories.push(label);
		return {y:item.count, name:label, min:item.min, max:item.max};
	});
	
	categoryDefaults(graphDefaults, categories, series, title, click)
	var chart = new Highcharts.Chart(graphDefaults);
	
	$(":input[name*='start'], :input[name*='end']", container).change(function(){
		$.each(chart.series[0].points, function(index, point) {
			var startInt = parseInt(start.val()),
				endInt = parseInt(end.val());
			var startBoundary = start.val() == '' || (startInt <= point.min && startInt <= point.max);
			var endBoundary = end.val() == '' || (endInt >= point.min && endInt >= point.max);
			if (startBoundary && endBoundary) {
				point.select(true, true);
			} else {
				point.select(false, true)
			} 
		});
		container.removeClass("error");
		container.find('.errors').remove();
		container.find(".error").removeClass("error");
	}).change();
}

function temporalHandler(graphDefaults, container, title, series) {
	series = $.map(series, function(item) {
		return {y:item[1], x:Date.parse(item[0])};
	});
	var start = $(":input[name*='start']", container);
	var end = $(":input[name*='end']", container);
	
	var click = function(event) {
		var date = new Date(event.point.x);
		var format = $.datepicker.formatDate('yy-mm-dd', date);
		var startVal = format, endVal = '';
		if (start.val() && !end.val()) {
			startVal = start.val();
			endVal = format;
		} 
		
		if (startVal && endVal && endVal < startVal) {
			var x = startVal;
			startVal = endVal;
			endVal = x;
		}
		end.val(endVal);
		start.val(startVal).change();
	};
	
	graphDefaults['chart']['type'] = 'spline';
	graphDefaults['chart']['zoomType'] ='x'
	graphDefaults['chart']['spacingRight'] = 20
	graphDefaults['series'] = [{name:title, data:series}];
	graphDefaults['plotOptions'] = {
			spline: {
				lineWidth:1,
				events:{
					click:click
				}
			}
	};
	graphDefaults['xAxis'] = {
			type: 'datetime',
			maxZoom: 14 * 24 * 3600000, // fourteen days
			title: {
				text: null
			}
		}
	var chart = new Highcharts.Chart(graphDefaults);
	
	$(":input[name*='start'], :input[name*='end']", container).change(function(){
		var startVal = Date.parse(start.val());
		var endVal = Date.parse(end.val());
		$.each(chart.series[0].points, function(index, point) {
			if (point.x >= startVal && (!endVal || point.x <= endVal)) {
				point.select(true, true);
			} else {
				point.select(false, true)
			} 
		});
		container.removeClass("error");
		container.find('.errors').remove();
		container.find(".error").removeClass("error");
	}).change();
}

function newGraphDefaults(container, title, last) {
	var renderDiv = $("<div class='attribute-graph'>").appendTo(container);
	if (last) {
		renderDiv.addClass("last");
	}
	var chartData = {
			chart: {
				renderTo: renderDiv[0],
				events: {}
			},
			title: {
				text: title
			},
			yAxis: {
				title: {
					text: '# of customers'
				}
			}
		};	
	return chartData;
}

function categoryDefaults(chartData, categories, series, title, click) {
	chartData['xAxis'] = {
		categories: categories
	};
	chartData['chart']['type'] = 'column';
	chartData['plotOptions'] = {
			column:{
				minPointLength: 3, 
				dataLabels: { 
					enabled: true, 
					style: { 
						fontWeight: 'bold' 
							}, 
					formatter: function() { return this.y; }
				},
				events: {
					click: click
				},
			}
	};
	chartData['series'] = [{name:title, data:series}];
}