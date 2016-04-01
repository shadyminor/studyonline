/// <reference path="http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.6.2-vsdoc.js" />

if (!oolp) {
	var oolp = {};
}

oolp.api = {
	key: '3a57cea5-7557-4909-a5d4-9f74a10c945b',
	apiUrl: 'http://api.contactnorth.ca',
	doMock: false,

	getFilterOptions: function (lang, callback, errorCallback) {
		if (oolp.api.doMock) {
			var result = oolp.mock.getFilterOptions();
			callback(result);
		} else {
			var data = { lang: lang };
			oolp.api.call('getFilterOptions', data, callback, errorCallback);
		}
	},

	performSearch: function (criteria, pageNumber, pageSize, callback, errorCallback) {
		if (oolp.api.doMock) {
			var result = oolp.mock.performSearch();
			callback(result);
		} else {
			//	Assemble the params
			var data = {
				criteria: criteria,
				paging: {
					size: pageSize,
					current: pageNumber
				}
			};

			//	Make the call.
			oolp.api.call('doSearch', data, callback, errorCallback);
		}
	},

	getPrograms: function (ids, callback, errorCallback) {
		if (oolp.api.doMock) {
			var result = oolp.mock.getProgram();
			callback(result);
		} else {
			//	Ensure the list of IDs is an array.
			if (!$.isArray(ids)) {
				ids = [ids];
			}

			//	Make the call.
			oolp.api.call('getProgram', { id: ids }, callback, errorCallback);
		}
	},

	getCourses: function (ids, callback, errorCallback) {
		if (oolp.api.doMock) {
			var result = oolp.mock.getCourse();
			callback(result);
		} else {
			//	Ensure the list of IDs is an array.
			if (!$.isArray(ids)) {
				ids = [ids];
			}

			//	Make the call.
			oolp.api.call('getCourse', { id: ids }, callback, errorCallback);
		}
	},

	call: function (methodName, data, callback, errorCallback) {

		//	Prepend Universal stuff
		data = oolp.api.addUniversal(data);

		//	Build the URL.
		var url = oolp.api.buildUrl(methodName);

		//	Make the call.
		$.ajax({
			url: url,
			success: callback,
			error: errorCallback,
			data: JSON.stringify(data),
			dataType: 'json',
			type: 'POST',
			crossDomain:true
		});
	},

	addUniversal: function (data) {
		if (!data.key) {
			data.key = oolp.api.key;
		}

		if (!data.lang) {
			data.lang = 'en'; // TODO: Set this to the actual lang.
		}

		return data;
	},

	buildUrl: function (methodName) {
		return oolp.api.apiUrl + "/" + methodName;
	}
}










oolp.mock = {
	getFilterOptions: function () {
		return {
			institution: [
	{
		id: 159,
		name: "Algoma District School Board",
		level: "Secondary",
		url: "http://www.adsb.on.ca/content/secondary/index.asp?cat=52, www.adsb.on.ca"
	},
	{
		id: 54,
		name: "Algoma University",
		level: "University",
		url: "http://www.algomau.ca/view.php?page=ap_ptStudies"
	},
	{
		id: 71,
		name: "Algonquin and Lakeshore Catholic District School Board",
		level: "Secondary",
		url: "http://www.alcdsb.on.ca/"
	},
	{
		id: 1,
		name: "Algonquin College ",
		level: "College",
		url: "http://www.algonquincollege.com/PartTimeStudies/distanceEducation.htm"
	},
	{
		id: 152,
		name: "AlphaPlus Centre",
		level: "Other",
		url: "http://alphaplus.ca/"
	}
	],
			semester: [
	{
		id: "Spring 2011",
		label: "Spring 2011"
	},
	{
		id: "Summer 2011",
		label: "Summer 2011"
	},
	{
		id: "Fall 2011",
		label: "Fall 2011"
	},
	{
		id: "Winter 2012",
		label: "Winter 2012"
	},
	{
		id: "Spring 2012",
		label: "Spring 2012"
	},
	{
		id: "Summer 2012",
		label: "Summer 2012"
	}
	],
			level: [
	{
		id: "College",
		label: "College"
	},
	{
		id: "University",
		label: "University"
	},
	{
		id: "Secondary",
		label: "Secondary"
	},
	{
		id: "Literacy",
		label: "Literacy"
	},
	{
		id: "Other",
		label: "Training"
	}
	],
			delivery_method: [
	{
		id: "online_live",
		label: "Online Live"
	},
	{
		id: "online_anytime",
		label: "Online Anytime"
	},
	{
		id: "correspondence",
		label: "Correspondence"
	},
	{
		id: "on_campus",
		label: "On Campus"
	},
	{
		id: "blended",
		label: "Blended"
	}
	],
			program_type: [
	{
		id: "certificate",
		label: "Certificate"
	},
	{
		id: "graduate_certificate",
		label: "Graduate Certificate"
	},
	{
		id: "diploma",
		label: "Diploma"
	},
	{
		id: "bachelors_degree",
		label: "Bachelors Degree"
	},
	{
		id: "recognition_of_achievement",
		label: "Recognition of Achievement"
	},
	{
		id: "advanced_diploma",
		label: "Advanced Diploma"
	},
	{
		id: "masters_degree",
		label: "Masters Degree"
	},
	{
		id: "doctoral_degree",
		label: "Doctoral Degree"
	}
	],
			field_of_study: [
	{
		id: "1",
		label: "Academic Upgrading"
	},
	{
		id: "2",
		label: "Business"
	},
	{
		id: "3",
		label: "Communications"
	},
	{
		id: "4",
		label: "Computers / Networks"
	},
	{
		id: "5",
		label: "Health"
	},
	{
		id: "6",
		label: "High School"
	},
	{
		id: "7",
		label: "Literacy / Basic Skills"
	},
	{
		id: "8",
		label: "Personal Improvement"
	},
	{
		id: "9",
		label: "Professions"
	},
	{
		id: "10",
		label: "Science"
	},
	{
		id: "11",
		label: "Social Sciences"
	},
	{
		id: "12",
		label: "Trades / Technology"
	}
	]
		};
	},


	getCourse: function () {
		return [
			{
				id: 57440,
				name: " Air Reservations",
				code: "TRAV611",
				description: "Learn the airfare terms, codes, ...etc",
				credits: "2.00",
				language: "en",
				institution: 1,
				prerequistes: "TRAV610",
				delivery_method: ["online", "online_live"],
				related_programs: [
					{
						id: 5525,
						name: "Airline Products and Distribution"
					},
					{
						id: 5529,
						name: "Travel Agency Operations"
					}
				]
			},
			{
				id: 50834,
				name: "Abnormal Psychology",
				code: "COUN2580",
				description: "This course focuses on various...etc",
				credits: "1.00",
				language: "en",
				institution: 6,
				prerequistes: "PSYC 1051: PSYCHOLOGY INTRODUCTION",
				delivery_method: ["online", "online_live"],
				related_programs: [
					{
						id: 5054,
						name: "Business - Entrepreneurship and Small Business"
					}
				]
			}
		];
	},


	getProgram: function () {
		var result = [
	{
		id: 5037,
		name: "911 and Emergency Response",
		type: "certificate",
		description: "Employment opportunities in this field are...etc",
		full_time: 1,
		delivery_method: [
	"online",
	"online_live"
	],
		institution: 152,
		related_courses: [
	{
		id: 51444,
		name: "911 and Police Dispatch"
	},
	{
		id: 51445,
		name: "911 Field Observation"
	},
	{
		id: 51237,
		name: "APCO Public Safety Telecommunicator"
	}
	]
	},
	{
		id: 5160,
		name: "Accounting",
		type: "diploma",
		description: "This diploma program is identical to the one...etc",
		full_time: 1,
		delivery_method: [
	"correspondance",
	"oncampus"
	],
		institution: 2,
		related_courses: [
	{
		id: 53407,
		name: "Corporate Finance I"
	},
	{
		id: 53433,
		name: "Financial Accounting I"
	},
	{
		id: 53686,
		name: "Financial Accounting II"
	}
	]
	}
	];
		return result;
	},
	

	performSearch: function () {
		var result = {
			programs: {
				all_ids: [4836, 4290, 4840, 5060],
				page_data: [
								{
									id: 4836,
									name: "Business - Accounting",
									type: "diploma",
									level: "college",
									institution: 1
								}
							]
			},
			courses: {
				all_ids: [51541, 51545, 51546],
				page_data: [
						{
							id: 51541,
							name: "Accounting for Property Managers",
							semester: "2011-2",
							level: "college",
							institution: 156
						}
					]
			}
		};
		return result;
	}
}