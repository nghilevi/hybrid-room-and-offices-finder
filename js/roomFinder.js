// ************************* BASIC FUNCTIONALITIES **************************//
// TODO 
// add checking for  hasOwnProperty
// better collision detection

// **************** Room Map Data Initialization ****************
var searchString="",valueOfRoom=null, firstCharOfSearchString=null,
floorArray=[
	"ground floor (pohjakerros)", 
	"first floor (1. Kerros)", 
	"second floor (2. Kerros)"
],
roomFunctionArray=[
	"Laboratories and development (Laboratorio jakehitystoiminta)", //value = 0
	"Staff (Henkilöstö)", // value = 1
	"Services; student board, studentaffairs office, building superintendents, gym, nurse (Palvelut; laureamko, opintotoimisto, korkeakouluisännät, kuntosali, terveydenhoitaja)", //value = 2
	"Teaching, projectwork and meeting rooms (Neuvottelu, ryhmätyö- ja opetustilat)" //value = 3
],
roomByValue={ //value of each room hold: [array of roomNumber]
  0:['008','014','011','012','052','054','074',//ground floor
  '075','180','180a','126'//first floor
  ],
  1:['007','074a','079','123',//ground floor
  '123a','123B','122','121','114','111','111a','112','103','104','105','106','161','165','166','175','140','141','142','143','155','153','133','134','135','136','137','137a',//first floor
  '216','216a','215a','215','203','257a','257','256','256a','255','243','244','233'//2nd floor
  ],
  2:['107','108','108a','110','109','181','178','132'],//first floor
  3:['027a','022','027','015','013','009','010',//ground floor
  '130','127','195a','195','189','161a','162','182','181','176',//first floor
  '225','226','130','189','207','204','205','205a','206','206a','258','254','253','241','240','239','238','236','234a','234','232a','232','252','248','247','246','245']//2nd floor
},
roomByFloor={ //empty by default and will be initilized when page ready
	'0':{},//ground floor
	'1':{},//first floor
	'2':{},//second floor
},
speacialRoom={
  '052':['restaurant','res','canteen','ravintola','rav'],
  '074':['dining','din','ruoka','ruo'],
  '111a':['laureamko','lau'],
  '111':['studentaffairs', 'opintotoimisto'],
  '107':['library','lib','kirjasto','kir'],
  '189':['timo','tim'],
  '181':['building superintendents','bui'],
  '180':['cafe beat','cafe'],
  '132':['nurse','nur','tervhoit','ter'],
  '178':['copy room','cop','monitus','mon'],
  '130':['tuomo','tuo']
}
collisionMap={}; 

//construct roomByFloor 		
for (var key in roomByValue) {
  var roomArray=roomByValue[key]; //['008','014','011','012','052','054','074',//ground floor ...
  for(i=0;i<roomArray.length;i++){
    var roomNumber=roomArray[i]; //eg. get '001'
    var firstChar=roomNumber.charAt(0); //get '0' from '001'
    roomByFloor[firstChar][roomNumber]=parseInt(key); //add into roomInfoTable roomNumber and its key
  }
}   

//construct collisionMap 
for (var key in speacialRoom) { 
  var specialRoomArray=speacialRoom[key]; //['restaurant','res','canteen','ravintola','rav']
  for(i=0;i<specialRoomArray.length;i++){
    var roomName=specialRoomArray[i]; //eg. 'restaurant'
    collisionMap[roomName]=key; 
  }
}

console.log(collisionMap);
// **************** Search for room when typing ****************

$('#searchBar').on('input', function() { 
  searchString = $('#searchBar').val().toLowerCase();
  firstCharOfSearchString=searchString.charAt(0);
  if(isNaN(parseInt(firstCharOfSearchString))){
    searchString = collisionMap[searchString];
  }
  if(searchString){
    firstCharOfSearchString=searchString.charAt(0);
    valueOfRoom = roomByFloor[firstCharOfSearchString][searchString];//search for room by floor
    console.log(valueOfRoom);
    if(valueOfRoom!=undefined){ 
      var imgURI="img/"+searchString+".png";
      $("#roomMap").attr("src",imgURI);
    }      
  }
});

// **************** Rotate Image ****************
$('#rotateBtn').click(function(){
    var img = $('img');
    if(img.hasClass('north')){
        img.attr('class','west');
    }else if(img.hasClass('west')){
        img.attr('class','south');
    }else if(img.hasClass('south')){
        img.attr('class','east');
    }else if(img.hasClass('east')){
        img.attr('class','north');
    }
});

// **************** Zoom in and out ****************
var zoomLevel=0;
function zoom(event){
	var scale=0,img = $("#roomMap");
	var option=event.data.option;
  function animateZoom(scale){
    zoomWidth=img.width()*scale+'px';
    zoomHeight=img.height()*scale+'px';
    img.animate({width: zoomWidth, height: zoomHeight}, 200);    
  }	
	if(option=='+' && zoomLevel<1){
		scale=2;
		zoomLevel++;
    animateZoom(scale);
	}
  if(option=='-' && zoomLevel>-2){
		scale=0.5;
		zoomLevel--;
    animateZoom(scale);
	}
}

$('#zoomIn').click({option:'+'},zoom);
$('#zoomOut').click({option:'-'},zoom);

// **************** Reload page ****************
function resetPage() {
   location.reload();
   //reset Zoom
   /*$('img').removeAttr('style');
   zoomLevel=0;
   //reset Rotation
    $('img').attr('class','north');
    //reset hammer
    $('#zoom').removeAttr('style');
    $('#zoom').attr('style',"-webkit-user-select: none; -webkit-user-drag: none; -webkit-tap-highlight-color: rgba(0, 0, 0, 0);");*/
};

$('#refreshBtn').on('click',resetPage); 



// **************** Pop Up functionality ****************
function deselect(targetClass,e) {
  $(targetClass).slideFadeToggle(function() {
    e.removeClass('selected');
  }); 
}

function deselectAgain(event){
  var targetClass=event.data.param1, e=event.data.param2;
  deselect(targetClass,e);
  return false;
}

$.fn.slideFadeToggle = function(easing, callback) {
  return this.animate({ opacity: 'toggle', height: 'toggle' }, 'fast', easing, callback);
};

function populateRoomInfo(valueOfRoom,firstCharOfSearchString) {
  var roomInfo='<p>Please try again with a different search value!</p>';
  console.log(valueOfRoom);
  if(valueOfRoom!=undefined){
    var roomFunction=roomFunctionArray[valueOfRoom];
    var location=floorArray[firstCharOfSearchString];
    roomInfo="<p>Room: "+searchString+"</p><br/> Location: "+location+"<br/><br/> Function: "+roomFunction+"<br/>";
  }  
  roomInfo+='(Tap to dimiss)';
  $('#infoDialog').html(roomInfo);
}

function togglePopUpMessage(event){
  //event.preventDefault();
  var targetClass=event.data.param;
  if($(this).hasClass('selected')) {
    deselect(targetClass,$(this));               
  } else {
      if(targetClass=='.infoDialog'){
        populateRoomInfo(valueOfRoom,firstCharOfSearchString);
      }
      $(this).addClass('selected');
      $(targetClass).slideFadeToggle();   
  }
  return false;
}

$('#infoBtn').click({param:'.infoDialog'}, togglePopUpMessage);
$('#infoDialog').click({param1:'.infoDialog',param2:$('#infoBtn')}, deselectAgain);

// ************************* HAMMER LOGIC FUNCTIONALITIES **************************//
$(function(){
    var zoom = new ZoomView('#zoom','#zoom :first');
		var zoom2 = new ZoomView('#zoom2','#zoom2 :first');
		var zoom3 = new ZoomView('#zoom3','#zoom3 :first');
});


/**
* Inspired by Jesse Guardiani - May 1st, 2012
*/

var zIndexBackup = 10;

function DragView(target) {
  this.target = target[0];
  this.drag = [];
  this.lastDrag = {};

  
  this.WatchDrag = function()
  {
    if(!this.drag.length) {
      return;
    }

    for(var d = 0; d<this.drag.length; d++) {
      var left = $(this.drag[d].el).offset().left;
      var top = $(this.drag[d].el).offset().top;

      var x_offset = -(this.lastDrag.pos.x - this.drag[d].pos.x);
      var y_offset = -(this.lastDrag.pos.y - this.drag[d].pos.y);

      left = left + x_offset;
      top = top + y_offset;

      this.lastDrag = this.drag[d];

      this.drag[d].el.style.left = left +'px';
      this.drag[d].el.style.top = top +'px';
    }
  }

  this.OnDragStart = function(event) {
    var touches = event.originalEvent.touches || [event.originalEvent];
    for(var t=0; t<touches.length; t++) {
      var el = touches[t].target.parentNode;
      console.log(el);
	  
	  if(el.className.search('polaroid') > -1){
		  	
			 el = touches[t].target.parentNode.parentNode;
	  }
		el.style.zIndex = zIndexBackup + 1;
		zIndexBackup = zIndexBackup +1;
		
      if(el && el == this.target) {
		$(el).children().toggleClass('upSky');
        this.lastDrag = {
          el: el,
          pos: event.touches[t]
        };
        return; 
      }
	  
    }
  }

  this.OnDrag = function(event) {
    this.drag = [];
    var touches = event.originalEvent.touches || [event.originalEvent];
    for(var t=0; t<touches.length; t++) {
      var el = touches[t].target.parentNode;

	if(el.className.search('polaroid') > -1){
			 el = touches[t].target.parentNode.parentNode;
	  }
	  
      if(el && el == this.target) {
        this.drag.push({
          el: el,
          pos: event.touches[t]
        });
      }
    }
  }

  this.OnDragEnd = function(event) {
	  	this.drag = [];
    	var touches = event.originalEvent.touches || [event.originalEvent];
	 	for(var t=0; t<touches.length; t++) {
      			var el = touches[t].target.parentNode;
	  
	  			if(el.className.search('polaroid') > -1){
			 			el = touches[t].target.parentNode.parentNode;
	  			}
				$(el).children().toggleClass('upSky');
		
	  }
  }
}

function ZoomView(container, element) {

    container = $(container).hammer({
        prevent_default: true,
        scale_treshold: 0,
        drag_min_distance: 0
    });

    element = $(element);


    var displayWidth = container.width();
    var displayHeight = container.height();

    //These two constants specify the minimum and maximum zoom
    var MIN_ZOOM = 1;
    var MAX_ZOOM = 3;

    var scaleFactor = 1;
    var previousScaleFactor = 1;

    //These two variables keep track of the X and Y coordinate of the finger when it first
    //touches the screen
    var startX = 0;
    var startY = 0;

    //These two variables keep track of the amount we need to translate the canvas along the X
    //and the Y coordinate
    var translateX = 0;
    var translateY = 0;

    //These two variables keep track of the amount we translated the X and Y coordinates, the last time we
    //panned.
    var previousTranslateX = 0;
    var previousTranslateY = 0;

    //Translate Origin variables

    var tch1 = 0, 
        tch2 = 0, 
        tcX = 0, 
        tcY = 0,
        toX = 0,
        toY = 0,
        cssOrigin = "";

    container.bind("transformstart", function(event){

        //We save the initial midpoint of the first two touches to say where our transform origin is.
        e = event

        tch1 = [e.touches[0].x, e.touches[0].y],
        tch2 = [e.touches[1].x, e.touches[1].y]

        tcX = (tch1[0]+tch2[0])/2,
        tcY = (tch1[1]+tch2[1])/2

        toX = tcX
        toY = tcY

        var left = $(element).offset().left;
        var top = $(element).offset().top;

        cssOrigin = (-(left) + toX)/scaleFactor +"px "+ (-(top) + toY)/scaleFactor +"px";
    })

    container.bind("transform", function(event) {
        scaleFactor = previousScaleFactor * event.scale;
		
        scaleFactor = Math.max(MIN_ZOOM, Math.min(scaleFactor, MAX_ZOOM));
        transform(event);
    });

    container.bind("transformend", function(event) {
        previousScaleFactor = scaleFactor;
    });


    /**
    * on drag
    *The DragView function contains the logic to handle drag events. 
    *For each picture, you must associate a DragView call and bind the drag events:
    */
    var dragview = new DragView($(container));
    container.bind("dragstart", $.proxy(dragview.OnDragStart, dragview));
    container.bind("drag", $.proxy(dragview.OnDrag, dragview));
    container.bind("dragend", $.proxy(dragview.OnDragEnd, dragview));

    setInterval($.proxy(dragview.WatchDrag, dragview), 10);

    function transform(e) {
        //We're going to scale the X and Y coordinates by the same amount
        var cssScale = "scaleX("+ scaleFactor +") scaleY("+ scaleFactor +") rotateZ("+ e.rotation +"deg)";

        element.css({
            webkitTransform: cssScale,
            webkitTransformOrigin: cssOrigin,

            transform: cssScale,
            transformOrigin: cssOrigin,
        });   
    }
}	
