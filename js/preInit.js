oolp.t = function(key, method) {
	var text
	var tranList = {};
	
	method ? tranList = translations[method] : tranList = translations;
	
	if(tranList[key] && tranList[key][oolp.lang]){
		text = tranList[key][oolp.lang];
	}else{
		text = key;
	}
	
	return text;
}


oolp.enUrl = 'studyonline.ca';
oolp.frUrl = 'etudiezenligne.ca';

oolp.checkLang = function() {
	var url = window.location.hostname;
	
	if(url === oolp.frUrl){
		oolp.lang = 'fr';
		$('html').attr('lang','fr').addClass('fr');
	}else{
		oolp.lang = 'en';
	}
}

oolp.checkLang();

$(document).bind("mobileinit", function(){
  var loading = oolp.t('loading');
  var errorMsg = oolp.t('Error Loading Page');
  
  $.mobile.loadingMessage = loading;
  $.mobile.pageLoadErrorMessage = errorMsg;
});