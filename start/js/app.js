
  var myDataRef = new Firebase('https://blistering-inferno-6990.firebaseio.com/');


//+ Jonas Raoni Soares Silva
//@ http://jsfromhell.com/array/shuffle [v1.0]
function shuffle(o) { //v1.0
    for (var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};

var app = angular.module("MyApp", []);

app.controller('Questionnaire', ['$scope', '$http', '$templateCache', function ($scope, $http, $templateCache) {

    $scope.source = {
        "questions": [{
            "id": 1001,
                "text": "You rarely catch me",
                "text2":"changing my mind",
                "catId": 1
        }, {
            "id": 1002,
                "text": "It's not over until",
                "text2": "the fat lady sings",
                "catId": 2
        }, {
            "id": 1003,
                "text": "Rules? What rules?",
                "text2": "They're only made to be broken",
                "catId": 0
        }, {
            "id": 1004,
                "text": "Just like the Duracell bunny, I keep going",
                "text2": "seven times longer than everyone else.",
                "catId": 2
        }, {
            "id": 1005,
                "text": "I go with my gut",
                "text2": "everytime",
                "catId": 1
        }, {
            "id": 1006,
                "text": "When I believe in something",
                "text2": "I give 110% of myself to it",
                "catId": 2
        }, {
            "id": 1007,
                "text": "Once I get started on something big,",
                "text2": "it's all I can think about",
                "catId": 2
        }, {
            "id": 1008,
                "text": "I'm constantly asking questions and",
                "text2": "looking for answers",
                "catId": 0
        }, {
            "id": 1009,
                "text": "I'm not afraid to flip things on their head",
                "text2": "in order to get results",
                "catId": 0
        }, {
            "id": 1010,
                "text": "If it's been done before",
                "text2": "I don't want to know",
                "catId": 0
        }],
            "categories": [
            "UNORTHODOX",
            "DECISIVE",
            "DETERMINED"],
            "categoryMessages": [{
                "high": "You're extremely unorthodox!",
                "medHigh": "You're very unorthodox!",
                "medLow": "You're slightly unorthodox",
                "low": "You're not very unorthodox"
              }, {
                "high": "You're extremely decisive!",
                "medHigh": "You're very decisive!",
                "medLow": "You're slightly decisive",
                "low": "You're not very decisive"
              }, {
                "high": "You're extremely determined!",
                "medHigh": "You're very determined!",
                "medLow": "You're slightly determined",
                "low": "You're not very determined"
            }],
        "profileQuestions": [{
            "id":1001,
            "optionLeft": "Jazz",
            "optionRight": "Hip Hop"
          },{
            "id":1002,
            "optionLeft": "Lights on",
            "optionRight": "Lights off"
          },{
            "id":1003,
            "optionLeft": "Beer",
            "optionRight": "Spirits"
          },{
            "id":1004,
            "optionLeft": "Game of Thrones",
            "optionRight": "Breaking Bad"
          },{
            "id":1005,
            "optionLeft": "Nik Naks",
            "optionRight": "Quavers"
          }]
        }

// transition

jQuery(document).ready(function($){
    //cache some jQuery objects
    var modalTrigger = $('.cd-modal-trigger'),
        transitionLayer = $('.cd-transition-layer'),
        transitionBackground = transitionLayer.children(),
        modalWindow = $('.cd-modal');

    var frameProportion = 1.78, //png frame aspect ratio
        frames = 25, //number of png frames
        resize = false;

    //set transitionBackground dimentions
    setLayerDimensions();
    $(window).on('resize', function(){
        if( !resize ) {
            resize = true;
            (!window.requestAnimationFrame) ? setTimeout(setLayerDimensions, 3300) : window.requestAnimationFrame(setLayerDimensions);
        }
    });

    //open modal window
    modalTrigger.on('click', function(event){   
        // event.preventDefault();
        transitionLayer.addClass('visible closing');
        var delay = ( $('.no-cssanimations').length > 0 ) ? 0 : 1600;
        setTimeout(function(){
            transitionLayer.removeClass('visible closing');
            $('.cd-transition-layer').css('pointer-events','none');
        }, delay);
    });

    //close modal window
    modalWindow.on('click', '.modal-close', function(event){
        // event.preventDefault();
        transitionLayer.addClass('closing');
        modalWindow.removeClass('visible');
        transitionBackground.one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function(){
            transitionLayer.removeClass('closing opening visible');
            transitionBackground.off('webkitAnimationEnd oanimationend msAnimationEnd animationend');
        });
    });

    function setLayerDimensions() {
        var windowWidth = $(window).width(),
            windowHeight = $(window).height(),
            layerHeight, layerWidth;

        if( windowWidth/windowHeight > frameProportion ) {
            layerWidth = windowWidth;
            layerHeight = layerWidth/frameProportion;
        } else {
            layerHeight = windowHeight*1.2;
            layerWidth = layerHeight*frameProportion;
        }

        transitionBackground.css({
            'width': layerWidth*frames+'px',
            'height': layerHeight+'px',
        });

        resize = false;
    }
});

// transition end

    var theUser;
    var theUserRef;
    var backgrounds = ["Question1.jpg", "Question2.jpg", "Question3.jpg", "Question4.jpg", "Question5.jpg", "Question6.jpg", "Question7.jpg", "Question8.jpg", "Question9.jpg", "Question10.jpg", "Question10.jpg"];
    var resultsBackgrounds1 = ["ResultsPageAventurer.jpg"];
    var resultsBackgrounds2 = ["ResultsPageLeader.jpg"];
    var resultsBackgrounds3 = ["ResultsPageProtector.jpg"];
    var resultsBackgrounds4 = ["ResultsPageScientist.jpg"];
    var profileBackground = ["Questionnaire Rock_Electronic.jpg"];

    var i;
    var questions = $scope.source.questions;
    var categories = $scope.source.categories;
    var questionCount = questions.length;
    var categoryCount = categories.length;
    var categoryMaxScores = [];
    for (i = 0; i < categoryCount; i++) {
        categoryMaxScores[i] = 0;
    }
    for (i = 0; i < questionCount; i++) {
        var catId = questions[i].catId;
        categoryMaxScores[catId] += 4;
    }
    $scope.source.categoryMaxScores = categoryMaxScores;
    $scope.braveScore = 0;
    $scope.questionNdx = 0;
    $scope.profileQuestionNdx = 0;
    $scope.questionsDone = false;
    $scope.profileQuestionsDone = false;
    $scope.isDone = false;
    $scope.isProfileDone = false;
    $scope.shareShow = false;
    $scope.profileInfo = true;
    $scope.showSpecificInfo = true;
    $scope.showAllInfo = false;
    // $scope.source.questions = shuffle($scope.source.questions);
    $scope.results = {
        questions: {},
        categories: {}
    };
    for (i = 0; i < categoryCount; i++) {
        $scope.results.categories[i] = 0;
    }

    $scope.quizStart = function(){
        $scope.questionsDone = true;
        $scope.profileInfo = false;
        $('body').css("background-image",'url("images/'+backgrounds[0]+'")');

    }

    $scope.isCategoryHigh = function (catId) {
        return $scope.results.categories[catId] >= 0.75;
    }
    $scope.isCategoryMedHigh = function (catId) {
        return ($scope.results.categories[catId] >= 0.50 && $scope.results.categories[catId] <= 0.74);
    }
    $scope.isCategoryMedLow = function (catId) {
        return ($scope.results.categories[catId] >= 0.25 && $scope.results.categories[catId] <= 0.49);
    }
    $scope.isCategoryLow = function (catId) {
        return $scope.results.categories[catId] <= 0.24;
    }

    var selectedResponse = false;
    var quizJustLoaded = true;

    $scope.onSelectResponse = function (response) {
        selectedResponse = response;
    }

    $scope.onConfirmResponse = function () {
      //get user info when quiz starts
      if (quizJustLoaded) {
        theUser = myDataRef.child('web/uauth').getAuth();
        theUserRef = myDataRef.child('web/uauth/users').child(theUser.uid);
        quizJustLoaded = false;
      }

      if (selectedResponse !== false) {
        //if response is selected...
        var questionNdx = $scope.questionNdx;
        var question = $scope.source.questions[questionNdx];
        var questionId = question.id;
        var catId = question.catId;
        var catMaxScore = $scope.source.categoryMaxScores[catId];
        var catScore = ((selectedResponse + catMaxScore) / (catMaxScore)) - 1.0;
        $scope.results.questions[questionId] = selectedResponse;
        $scope.results.categories[catId] += catScore;
        $scope.questionNdx++;
        theUserRef.child('answers/' + (questionNdx + 1)).set(selectedResponse);
        $('body').removeClass('question1 question2 question3 question4 question5 question6 question7 question8 question9 question10').addClass('question' + (questionNdx+2));
        if ($scope.questionNdx == $scope.source.questions.length) {
            $scope.isDone = true;
            $scope.questionsDone = true;
            $('body').removeClass().addClass('ng-scope resultsPage');

            var braveScore = 0;
            for (i = 0; i < categoryCount; i++) {
                categoryMaxScores[i] = 0;
                theUserRef.child("scores/" + categories[i].toLowerCase()).set(Math.round($scope.results.categories[i]*100));
                braveScore += ($scope.results.categories[i]*100);
            }
            theUserRef.child("scores/brave").set(Math.round(braveScore/categoryCount));
            $scope.braveScore = Math.round(braveScore/categoryCount);
        }
        $scope.safeApply();
        selectedResponse = false;
      } else {
        //do not continue
      }

    }

    $scope.onConfirmResults = function () {
    //change background for profile
    $('body').css("background-image",'url("images/'+profileBackground+'")');
    }

    //PROFILE QUESTIONS
    var profileJustLoaded = true;

    $scope.onSelectProfileResponse = function (response) {
        var selectedOption;
        var questionNdx = $scope.profileQuestionNdx;
        var question = $scope.source.profileQuestions[questionNdx];
        $scope.profileQuestionNdx++;

        if (profileJustLoaded) {
          theUser = myDataRef.child('web/uauth').getAuth();
          theUserRef = myDataRef.child('web/uauth/users').child(theUser.uid);
          profileJustLoaded = false;
        }

        if (response == 1) {
          // selectedOption = question.optionLeft;
          selectedOption = "optionLeft";
        } else {
          // selectedOption = question.optionRight;
          selectedOption = "optionRight";
        }
        //get current n value
        var n = 0;
        //add selected option to user's profile
        theUserRef.child('profileAnswers/Q' + (questionNdx + 1)).set(selectedOption);
        //increase total by 1
        myDataRef.child('data/Q' + (questionNdx + 1) + "/" + selectedOption + "/n").transaction(function(currentRank) {
          n = currentRank;
          return currentRank+1; });
        //update average brave score
        myDataRef.child('data/Q' + (questionNdx + 1) + "/" + selectedOption + "/braveScore").transaction(function(currentRank) {
          //if user has come through the quiz
          if ($scope.braveScore) {
            var thisBraveScore = $scope.braveScore;
          } else {
            //if user has loaded profile page first
            var thisBraveScore = parseInt($('#braveScore').html());
          }
          //if option has been selected by anyone in the past, create average of 2 numbers
          //(Current Average * times selected) + this user's brave score, all divided by n + 1
          if (currentRank) {
            var avgScore = Math.round(((currentRank*n) + thisBraveScore)/(n+1));
          } else {
            //else just add this user's brave score
            var avgScore = thisBraveScore;
          }

          return avgScore;
        });

        if ($scope.profileQuestionNdx == $scope.source.profileQuestions.length) {
            $scope.isProfileDone = true;
            $scope.profileQuestionsDone = true;
            $scope.profileQuestionNdx = 0;
            $('body').removeClass('profilePage');
        }
        $scope.safeApply();
    }

    $scope.quizFinish = function(){
        $scope.shareShow = true;
        $scope.isDone = false;
    }

    $scope.safeApply = function (fn) {
        var phase = this.$root.$$phase;
        if (phase == '$apply' || phase == '$digest') {
            if (fn && (typeof (fn) === 'function')) {
                fn();
            }
        } else {
            this.$apply(fn);
        }
    };


}]);
