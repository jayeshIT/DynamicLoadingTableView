var endupdatetimeout = 1000;
var friendlistTimeout = 1000;

var loadmore = true;
var updating = false;
var setdata1 = true;
var lastDistance = 0;
var prevoffset = 0;
var addRow = false;
var getData = function() {
	var myData = [];
	for (var i = 0; i < 10; i++) {
		if (OS_IOS) {
			var TableRow = Titanium.UI.createTableViewRow({
				height : 90,
				backgroundSelectedColor : "transparent",
				backgroundColor : 'gray',
				selectionStyle : Titanium.UI.iPhone.TableViewCellSelectionStyle.NONE
			});
		} else {
			var TableRow = Titanium.UI.createTableViewRow({
				height : 159,
				backgroundSelectedColor : "transparent",
				backgroundColor : 'gray',
				selectionStyle : ""
			});
		}

		if (setdata1 == false) {
			clearTimeout(endupdatetimeout);
			endupdatetimeout = setTimeout(endUpdate, 100);
		}
		if (setdata1 == true) {
			var label = Titanium.UI.createLabel({
				text : 'This is Load label'
			});
			TableRow.add(label);
		} else {
			var label = Titanium.UI.createLabel({
				text : 'This is Append Label'
			});
			TableRow.add(label);
		}
		myData.push(TableRow);
	}
	if (setdata1 == true) {
		$.tableViewevent.setData(myData);
	} else {
		$.tableViewevent.appendRow(myData);
	}

};
getData();

function endUpdate() {
	var index = $.tableViewevent.getIndexByName('borrow1');
	try {
		$.tableViewevent.deleteRow(index, {
			animationStyle : (OS_IOS) ? Titanium.UI.iPhone.RowAnimationStyle.NONE : ""
		});
	} catch (E) {
		Ti.UI.createNotification({
			message : E.message
		}).show();
	}
	addRow = false;
}

function beginUpdate() {

	if (addRow == false) {
		Ti.API.info('------ Begin Update');
		var loading_row = Alloy.createController('row_loading').getView();
		$.tableViewevent.appendRow(loading_row);

		addRow = true;
	}
	clearTimeout(friendlistTimeout);
	friendlistTimeout = setTimeout(function(e) {
		getData();
		setdata1 = false;
	}, 500);
}

$.tableViewevent.addEventListener('scroll', function(e) {
	if (OS_IOS) {
		var offset = e.contentOffset.y;
		var height = e.size.height;
		var total = offset + height;
		var theEnd = e.contentSize.height;
		var distance = theEnd - total;
		if (prevoffset < 0) {
			prevoffset = 0;
		}
		if (distance < lastDistance && prevoffset < offset) {
			var nearEnd = theEnd * .75;
			if (!updating && (total >= theEnd)) {
				beginUpdate();
			}
		}
		prevoffset = offset;
		lastDistance = distance;
	} else {
		var total = e.totalItemCount;
		var visible = e.visibleItemCount;
		if (!updating && total >= visible) {
			var nextFirst = total - visible;
			if (e.firstVisibleItem == nextFirst) {
				total = e.totalItemCount;
				visible = e.visibleItemCount;
				nextFirst = total - visible;
				beginUpdate();
			}
		}
	}
});
$.index.open();
