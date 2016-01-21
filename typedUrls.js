// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Event listner for clicks on links in a browser action popup.
// Open the link in a new tab of the current window.
function onAnchorClick(event) {
  chrome.tabs.create({
    selected: true,
    url: event.srcElement.href
  });
  return false;
}

// Given an array of URLs, build a DOM list of those URLs in the
// browser action popup.
function buildPopupDom(divName, data) {
	var popupDiv = document.getElementById(divName);

	var ol = document.createElement('ol');

	for (var i = 0, ie = data.length; i < ie; ++i) {
		var url = data[i].url
		var title = data[i].title
		if (!title) title = "(no title)"
		var lastVisitTime = new Date(data[i].lastVisitTime).toISOString().slice(0,19).replace('T',' ');

		var li = document.createElement('li');

		var a = document.createElement('a');
		a.href = url;
		a.title = url;
		a.appendChild(document.createTextNode(title));
		a.addEventListener('click', onAnchorClick);
		li.appendChild(a);

		li.appendChild(document.createElement('br'));

		li.appendChild(document.createTextNode(lastVisitTime));

		ol.appendChild(li);
	}

	popupDiv.appendChild(ol);
}

// Search history to find the ten most recent jobinfo.com visits
// and show those links in a popup.
function buildTypedUrlList(divName) {
	urlArray = [];
	chrome.history.search({'text':'jobinfo.com', 'maxResults':10}, function(historyItems) {
		// For each history item, get details on all visits.
		for (var i = 0; i < historyItems.length; i++) {
			urlArray.push({
				'url':historyItems[i].url,
				'title':historyItems[i].title,
				'lastVisitTime':historyItems[i].lastVisitTime,
			});
		}
		buildPopupDom(divName, urlArray);
	});
}

document.addEventListener('DOMContentLoaded', function () {
  buildTypedUrlList("typedUrl_div");
});
