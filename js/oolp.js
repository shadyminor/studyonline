(function($, window, t, enUrl, frUrl, lang){
	var Oolp;
	
	Oolp = function(){
		var storage = new Lawnchair(function(){});
		var filters = {};
		var institutions = {};
		var pageSize = 10;
		var page = 1;
		var criteria = {};
		var isResultsPage = false;
		var lastResultLoaded = {};
		var doCheckMoreResults = true;
		
		this.init = function(){
			translateInterface();
			setFullLink();
			//oolp.api.doMock = true;
			
			//add listeners to flag a boolean when pages have been created
			$('#page-program').live('pageshow', function(){
				$.mobile.silentScroll();
			});
			/*$('#page-home').live('pageshow pagehide', function(){
				if(event.type == "pagehide"){
					$('select').selectmenu('close');
				}else if(event.type == "pageshow"){
					$('select').selectmenu('close');
				}
			});*/
			$('#page-results').live('pageshow', function(){
				isResultsPage = true;
			}).live('pagehide', function(){
				isResultsPage = false;
			});
			$(document).scroll(checkScroll);
			
			//add listeners for buttons
			$('#search-form-reset').live('tap', resetForm);
			$('.btn-lang-switch').live('tap', switchLang);
			$('#oolp-search-form-mobile').submit(setSearch);
			
			$.mobile.pageLoading();
			
			
			/*storage.get('institutions', function(data) {
					if(!data){
						start();
					}else{
						start();
					}
				});*/
				
			//Load fliter options
			oolp.api.getFilterOptions(oolp.lang,loadFilters,function(jqXHR, textStatus, errorThrown){});
		}
		
		function loadFilters(data) {
			var $levelSelect = $('#select-choice-lvl');
			var $semester = $('#select-choice-semester');
			var levelText = t('All levels');
			var semesterText = t('All semesters');
			
			filters = data;
			
			//load institutions into an object
			$(filters.institution).each(function(){
				institutions[this.id] = this.name;
			});
			
			//Add levels
			$levelSelect.html('<option value="" selected="selected">'+levelText+'</option>');
			$(filters.level).each(function(){
				$levelSelect.append('<option value="'+this.id+'">'+this.label+'</option>');
			});
			
			//Add prog types
			$semester.html('<option value="" selected="selected">'+semesterText+'</option>');
			$(data.semester).each(function(){
				$semester.append('<option value="'+this.id+'">'+this.label+'</option>');
			});
			
			resetForm();
			$.mobile.pageLoading(true);
		}
		
		function setSearch() {
			var values;
			var incProg = 0;
			var incCor = 0;
			page = 1;
			
			//reset results page
			$('#results-content').empty();
			$('a.program').die('tap');
			//remove detail pages from last search
			$('.details-page').remove();
			
			//Get form values
			values = {};
			$.each($('#oolp-search-form-mobile').serializeArray(), function(i, field) {
				values[field.name] = field.value;
			});
			
			$('a.program').live('tap', function(){
				var id = parseInt($(this).data('id'));
				var progCor = $(this).data('progcor');
				
				if(progCor === 'prog'){
					oolp.api.getPrograms(id, getDetails);
				}else{
					oolp.api.getCourses(id, getDetails);
				}
			});
			
			//create criteria object for searching
			if(values.progCorChoice === 'prog'){
				incProg = 1;
			}else{
				incCor = 1;
			}
			criteria = {
				"keyword" 			: values.keyword,
				"include_programs"	: incProg,
				"include_courses" 	: incCor,
				"level" 			: values.selectChoiceLvl,
				"institution" 		: "",
				"type" 				: values.selectChoiceProgType,
				"field_of_study" 	: "",
				"job_title" 		: "",
				"semester" 			: values.selectChoiceSemester,
				"delivery_method" 	: "",
				"full_time" 		: "",
				"language"			: values.selectChoiceLang
			}
			
			runSearch();
			
			$.mobile.changePage ($('#page-results'));
			
			return false;
		}
		
		function runSearch() {
			$.mobile.pageLoading();
			oolp.api.performSearch(criteria,page,pageSize,showResults);
		}
		
		function showResults(data) {
			var html = "";
			var resultObj;
			var progCor;
			
			if(data.programs){
				resultObj = data.programs.page_data; 
				progCor = 'prog';
			}else{
				resultObj = data.courses.page_data;
				progCor = 'cor';
			}
			
			if(resultObj){
				doCheckMoreResults = true;
				$(resultObj).each(function(intIndex){
					var name = this.name;
					var provider = institutions[this.institution];
					var type = this.type;
					var id = this.id;
					var scroll = '';
					
					html += '<li><a class="program" href="#" data-id="'+id+'" data-index="'+intIndex+'" data-progcor="'+progCor+'" >';
					html += '<h3>'+name+'</h3>';
					html += '<p><strong>Provider: </strong>'+provider+'</p>';
					html += '<p><strong>Type of program: </strong>'+type+'</p>';
					html += '</a></li>';
				});
					
				$('#results-content').append('<ul data-role="listview" id="results-page-'+page+'" class="page" ></ul>');
				scroll = $(window).scrollTop();
				$('#results-page-'+page).bind('pagecreate', function(e){
					doCheckMoreResults = true;
					$.mobile.pageLoading(true);
				}).html(html).page();
				$(window).scrollTop(scroll);
				lastResultLoaded = getLastReultLoaded();
			}else{
				var noResText = t('No results found');
				$('#results-content').html('<h2>'+noResText+'</h2>');
				doCheckMoreResults = false;
			}
		}
		
		function checkScroll() {
			if(isResultsPage){
				if (doCheckMoreResults && isScrolledIntoView(lastResultLoaded)) {
					doCheckMoreResults = false;
					page++;
					runSearch();
				}
			}
		}
		
		function getDetails(data) {
			$.mobile.pageLoading();
			
			var details = {};
			details.id = data[0].id;
			details.pageId = "detail-page-"+data[0].id;
			details.instName = institutions[data[0].institution];
			details.title = data[0].name;
			details.type = data[0].type;
			details.descrip = data[0].description;
			details.realtedItem = [];
			details.progCor = "";
			details.pcTitle = "";
			details.html = "";
			details.semester = data[0].semester;
			
			if(data[0].related_courses){
				details.realtedItem = data[0].related_courses;
				details.progCor = "cor";
				details.pcTitle = t("Courses");
			}else{
				details.realtedItem = data[0].related_programs;
				details.progCor = "prog";
				details.pcTitle = t("Related Programs");
			}
			
			//remove old tap listener and place new one
			$('a.related').die('tap').live('tap', function(){
				var id = parseInt($(this).data('id'));
				var progCor = $(this).data('progcor');
				
				if(progCor === 'prog'){
					oolp.api.getPrograms(id, getDetails);
				}else{
					oolp.api.getCourses(id, getDetails);
				}
			});
			
			$("#detailsPage").tmpl(details).appendTo("body");
			if(oolp.lang != 'en'){translateInterface();}
			$('#'+details.pageId).page();
			
			$.mobile.pageLoading(true);
			$.mobile.changePage ($('#'+details.pageId));
		}
		
		function switchLang() {
			var url = oolp.lang == 'en' ? frUrl : enUrl;
			window.parent.location.href='http://'+url+'/mobile';
		}
		
		function translateInterface() {
			$('*[data-tran="text"]').each(function(){
				if($(this).hasClass('ui-btn-hidden')){
					$(this).parent().find('.ui-btn-text').text(t($(this).text()))
				}else{
					$(this).text(t($(this).text()));
				}
			});
			
			$('*[data-tran="switch"]').each(function(){
				if($(this).hasClass('ui-btn-hidden')){
					$(this).parent().find('.ui-btn-text').text(t($(this).text(), "switchItems"))
				}else{
					$(this).text(t($(this).text(), "switchItems"));
				}
			});
			
			$('*[data-tran="page"]').each(function(){
				$(this).html(t($(this).data('key'), "pages"));
			})
			
			$('*[data-tran="bg-image"]').each(function(){
				$(this).attr('data-lang',oolp.lang);
			});
		}
		
		function resetForm() {
			setTimeout(function(){
				$('select').selectmenu("refresh");
				$('input[type="radio"]').checkboxradio("refresh");
			},1);
		}
		
		function isScrolledIntoView(elem) {
			var docViewTop = $(window).scrollTop();
			var docViewBottom = docViewTop + $(window).height();

			var elemTop = $(elem).offset().top;
			var elemBottom = elemTop + $(elem).height();

			return ((elemBottom >= docViewTop) && (elemTop <= docViewBottom));
		}
		
		function getLastReultLoaded() {
			return llr = $('#page-results ul.page:last').find('li:last');
		}
		
		function setFullLink() {
			var url = '';
			if(lang === 'fr'){
				url = frUrl;
			}else{
				url = enUrl;
			}
			//$('.btn-full-site').attr('href','http://'+url+'/?device=desktop');
			$('.btn-full-site').attr('rel','');
		}
	}
	
	window.Oolp = Oolp;
	
})(jQuery, window, oolp.t, oolp.enUrl, oolp.frUrl, oolp.lang);

window.onload = function(){
	oolp.app = new Oolp();
	
	oolp.app.init();
};