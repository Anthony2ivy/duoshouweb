// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var starter = angular.module('starter', ['ionic']);
starter.controller('campusbus', function($scope, $ionicModal, $timeout, $ionicLoading, $http, $interval) {
	var num;//现在的站点
	var fx = 1;
	$scope.count = 0;
	//定现在的时间
	var dates = new Date();
	var hour = dates.getHours();
	var minutes = dates.getMinutes();
	if(hour >= 22) {
		$scope.status = "今天已无班次";
	} else {
		$scope.status = "下一班: 17:30";
	}
	//	$scope.status = "还有5分钟";
	$scope.stopleft = "2";
	//加载
	$ionicLoading.show({
		content: '加载中',
		animation: 'fade-in',
		showBackdrop: true,
		maxWidth: 200,
		showDelay: 0
	});
	//加载后
	$timeout(function() {
		$ionicLoading.hide();
	}, 2000);

//站名  
//荔园方向 少一个站
$scope.lib = [{
				"siteno": 1,
				"sitename": "图书馆",
				"longitude": "114.005432",
				"latitude": "22.601681"
			}, {
				"siteno": 2,
				"sitename": "科教中心",
				"longitude": "114.006664",
				"latitude": "22.600334"
			}, {
				"siteno": 3,
				"sitename": "一号门",
				"longitude": "114.006002",
				"latitude": "22.599091"
			}, {
				"siteno": 4,
				"sitename": "二号门",
				"longitude": "114.008077",
				"latitude": "22.600818"
			}, {
				"siteno": 5,
				"sitename": "三号门",
				"longitude": "114.011222",
				"latitude": "22.603487"
			}, {
				"siteno": 6,
				"sitename": "专家公寓",
				"longitude": "114.010016",
				"latitude": "22.605183"
			},
//			{
//				"siteno": 7,
//				"sitename": "社康中心",
//				"longitude": "114.007007",
//				"latitude": "22.606359"
//			},
			{
				"siteno": 8,
				"sitename": "教工餐厅",
				"longitude": "114.006685",
				"latitude": "22.610026"
			}, {
				"siteno": 9,
				"sitename": "慧园站",
				"longitude": "114.009937",
				"latitude": "22.609488"
			}, {
				"siteno": 10,
				"sitename": "荔园站",
				"longitude": "114.006685",
				"latitude": "22.610026"
			}];

$scope.liy = [{
				"siteno": 10,
				"sitename": "荔园站",
				"longitude": "114.006685",
				"latitude": "22.610026"
			},{
				"siteno": 9,
				"sitename": "慧园站",
				"longitude": "114.009937",
				"latitude": "22.609488"
			},{
				"siteno": 8,
				"sitename": "教工餐厅",
				"longitude": "114.006685",
				"latitude": "22.610026"
			}, {
				"siteno": 7,
				"sitename": "社康中心",
				"longitude": "114.007007",
				"latitude": "22.606359"
			}, {
				"siteno": 6,
				"sitename": "专家公寓",
				"longitude": "114.010016",
				"latitude": "22.605183"
			}, {
				"siteno": 5,
				"sitename": "三号门",
				"longitude": "114.011222",
				"latitude": "22.603487"
			}, {
				"siteno": 4,
				"sitename": "二号门",
				"longitude": "114.008077",
				"latitude": "22.600818"
			}, {
				"siteno": 3,
				"sitename": "一号门",
				"longitude": "114.006002",
				"latitude": "22.599091"
			}, {
				"siteno": 2,
				"sitename": "科教中心",
				"longitude": "114.006664",
				"latitude": "22.600334"
			},{
				"siteno": 1,
				"sitename": "图书馆",
				"longitude": "114.005432",
				"latitude": "22.601681"
			}];



	//定位位置
	var geolocation = new BMap.Geolocation();
	geolocation.getCurrentPosition(function(r) {
		if(this.getStatus() == BMAP_STATUS_SUCCESS) {
			nearbystop(r.point.lat, r.point.lng);
			$scope.$apply();
		} else {
			alert('failed' + this.getStatus());
		}
	}, {
		enableHighAccuracy: true
	});

	//经纬度算距离
	function rad(d) {
		return d * Math.PI / 180.0;
	}

	function GetDistance(lat1, lng1, lat2, lng2) {
		var radLat1 = rad(lat1);
		var radLat2 = rad(lat2);
		var a = radLat1 - radLat2;
		var b = rad(lng1) - rad(lng2);
		var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
			Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
		s = s * 6378.137; // EARTH_RADIUS;
		s = Math.round(s * 10000) / 10000;
		return s;
	}
	// 计算距离最近算法
	function nearbystop(lati, lgni) {
		var temp = $scope.stops[0];
		var len = $scope.stops.length;
		var minidis = GetDistance(lati, lgni, temp.latitude, temp.longitude);
		for(var i = 1; i < len; i++) {
			var p1 = $scope.stops[i];
			if(GetDistance(lati, lgni, p1.latitude, p1.longitude) < minidis) {
				temp = $scope.stops[i];
				minidis = GetDistance(lati, lgni, p1.latitude, p1.longitude);
			}
		}
		var nearbystopname = temp.sitename;
		num = temp.siteno;
		var spans = document.getElementsByClassName("stopline")[0];
		var childnode = spans.childNodes;
		for(var i = 0; i < num - 1; i++) {
			childnode[i].className = "ion-record orange";
		}
		childnode[num - 1].className = "ion-android-arrow-dropdown-circle royal";
		for(var i = num; i < len; i++) {
			childnode[i].className = "ion-record dark";
		}
		setTimeout(function() {
			for(var i = 0; i < len; i++) {
				document.getElementsByClassName("item")[i].childNodes[2].className = "";
			}
			var detailitem = document.getElementsByClassName("item")[num - 1];
			var item = detailitem.childNodes;
			item[0].className = "royal";
			item[1].className = "royal";
			item[2].className = "ion-star royal";
			document.getElementsByClassName("stopline")[0].style.visibility = "visible";
			movebusicon();
		}, 500);
	}
//小车移动函数
function movebusicon(){
	var busicon = document.getElementsByClassName("busicon")[0];
			$http.get("http://10.20.99.200:8080/route/getNearestBus?routeNo=1&direction="+fx+"&siteNo="+num).success(function(data) {
				var nextstation = data.nextSiteNo;
				var prestation = data.prevSiteNo;
				if(nextstation == prestation) {
					busicon.style.marginLeft = 48 * (parseInt(prestation) - 1) + 7 + "px";
				} else {
					busicon.style.marginLeft = 48 * (parseInt(prestation) - 1) + 31 + "px";
				}
					busicon.style.visibility = "visible";
			}).error(function(e) {
				alert('请求失败了');
			});

}


	//不断发请求看小车在哪里
	var timer = $interval(function moving() {
		movebusicon();
	}, 10000);

//交换方向
	$scope.direction = "荔园";
	$scope.servicetime = "7:10~21:00";
	$scope.stops = $scope.lib;
	$scope.changeDirection = function() {
		var stopline = document.getElementsByClassName("stopline")[0];
		var movebus = document.getElementsByClassName("movebus")[0];
		var listbar = document.getElementsByClassName("listbar")[0];
		var newspan = document.createElement("span");
		var deletenewspan = document.getElementsByClassName("last")[0];
		newspan.className = "ion-record orange last";
		setTimeout(function() {
			if($scope.count % 2 == 0) {
				$scope.direction = "图书馆";
				$scope.servicetime = "7:10~21:00";
				$scope.count += 1;
				$scope.stops = $scope.liy;
				stopline.style.width ="500px"; 
				movebus.style.width ="483px";
				listbar.style.width ="483px";
				fx = 0;
				stopline.appendChild(newspan);
			} else {
				fx = 1;
				$scope.stops = $scope.lib;
				$scope.servicetime = "8:30~21:55";
				$scope.direction = "荔园";
				stopline.style.width ="450px"; 
				movebus.style.width ="433px";
				listbar.style.width ="433px";
				stopline.removeChild(deletenewspan);
				$scope.count += 1;
			}
			$scope.$apply();
		});
	}

	//时刻表
	$ionicModal.fromTemplateUrl("templates/modal.html", {
		scope: $scope,
		animation: "slide-in-up"
	}).then(function(modal) {
		$scope.modal = modal;
	});
	$scope.openModal = function() {
		$scope.modal.show();
	};
	$scope.closeModal = function() {
		$scope.modal.hide();
	};
	$scope.$on('$destroy', function() {
		$scope.modal.remove();
	});
	$scope.$on('modal.hidden', function() {
		// Execute action
	});
	// Execute action on remove modal
	$scope.$on('modal.removed', function() {
		// Execute action
	});
});
starter.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
	$ionicConfigProvider.tabs.position('bottom');
});