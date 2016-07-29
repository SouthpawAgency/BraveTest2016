
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
                "high": "You’re extremely unorthodox. You don’t just think outside the box, you take a sledgehammer to it and smash the thing to pieces in order to create something new.",
                "medHigh": "You’re very unorthodox. You understand that convention isn’t your friend and you’re not afraid to ruffle a few feathers to create something completely different.",
                "medLow": "You’re fairly unorthodox. You pride yourself on thinking outside the box, but now it’s time to really shake things up. After all, nobody ever changed the world by following the rules.",
                "low": "You’re a little unorthodox. You like to rock the boat every now and then, but sometimes that’s not enough. It’s time to capsize that boat, turn the world upside down and look at things in a whole new way."
              }, {
                "high": "You’re extremely decisive. You don’t waste time with the ifs, buts and maybes. You make a call and run with it, and you’re more than happy to face the consequences and change things if it doesn’t work out.",
                "medHigh": "You’re very decisive. You understand that you don’t get anything done by umming and ahhing, you’d rather try something and fail than spend all day thinking about it.",
                "medLow": "You’re pretty indecisive. Making decisions isn’t your strong suit, but it’s time to change that. Don’t shy away from failure. If something doesn’t work first time, try something else, and keep trying and trying until you find what you’re looking for.",
                "low": "You’re very indecisive. You can’t even decide whether to have a Mars bar or Dairy Milk. Who cares?! It’s time to start going with your gut and getting things done. If your gut says get both, get both."
              }, {
                "high": "You’re extremely determined. If a job needs doing, you’ll get it done – even if it means fighting through the night and staying until the early hours to see it through.",
                "medHigh": "You’re very determined. Deadlines are your friend. You don’t get caught flapping and panicking about what will happen if you don’t meet them, you just power through until the job is done.",
                "medLow": "You’re fairly determined, but sometimes you can let your attention slip. Do you catch yourself glancing at your phone every now and then to swipe away that pesky notification? It’s time to set it to airplane mode, put it to one side and push on with the task at hand.",
                "low": "You’re a little determined, but you often catch yourself getting distracted by people around you. Don’t let others stand in the way of your success. Find a quiet space, shut yourself off and get the job done."
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
            (!window.requestAnimationFrame) ? setTimeout(setLayerDimensions, 1000) : window.requestAnimationFrame(setLayerDimensions);
        }
    });

    //get current session number
    myDataRef.once("value", function(snapshot) {
      var totalSessions = snapshot.child("sessions").numChildren();
      if (totalSessions !== undefined) {
        currentSession = totalSessions + 1;
        console.log(currentSession);
      } else {
        currentSession = 1;
      }
    });

    //open modal window


    $( ".btn" ).click(function() {
      var t = true;

        $(window).on('hashchange', function(event){
          if (t == true) {
            transitionLayer.addClass('visible closing');
            event.preventDefault();
            var delay = ( $('.no-cssanimations').length > 0 ) ? 0 : 1600;
            setTimeout(function(){
                transitionLayer.removeClass('visible closing');
                $('.cd-transition-layer').css('pointer-events','none');
            }, delay);
            t = false;
          }
        });
    });

      $(".profileSelector").click(function() {
        setTimeout(function(){
          t = true;
        }, 1000);
      });
      $(".responseSelector").click(function() {
        setTimeout(function(){
          t = true;
        }, 1000);
      });

      $(".question10 .next-button").click(function() {
      transitionLayer.addClass('visible closing');
      event.preventDefault();
      var delay = ( $('.no-cssanimations').length > 0 ) ? 0 : 1600;
      setTimeout(function(){
          transitionLayer.removeClass('visible closing');
          $('.cd-transition-layer').css('pointer-events','none');
      }, delay);
      t = false;
    });


    //show next button after all form buttons are selected
    $(".cs-select").each(function() {
      var init = false;
      $(this).find(".cs-options ul li").click(function() {
        if (init == false) {
          console.log('dropdown selected');
          formQuestionsAnswered ++;
          console.log(formQuestionsAnswered);
          $(this).parent().parent().parent().removeClass('notClicked');
          init = true;
        }
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
    var currentSession;
    var formQuestionsAnswered = 0;
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
        myDataRef.child('sessions/' + currentSession + '/' + (questionNdx + 1)).set(selectedResponse);
        $('body').removeClass('question1 question2 question3 question4 question5 question6 question7 question8 question9 question10').addClass('question' + (questionNdx+2));
        if ($scope.questionNdx == $scope.source.questions.length) {
            $scope.isDone = false;
            $scope.profileQuestionsDone = true;
            $scope.questionsDone = true;
            $('body').css("background-image",'url("images/'+profileBackground+'")');
            $('body').removeClass().addClass('ng-scope resultsPage');
            $('body').addClass('profilePage');

            var braveScore = 0;
            for (i = 0; i < categoryCount; i++) {
                categoryMaxScores[i] = 0;
                braveScore += ($scope.results.categories[i]*100);
            }
            $scope.braveScore = Math.round(braveScore/categoryCount);


            $( ".message-tile p" ).each(function( index ) {
              $(this).html($(this).html().replace(/(unorthodox)/g,'<span class="highlight">$1</span>'));
              $(this).html($(this).html().replace(/(indecisive)/g,'<span class="highlight">$1</span>'));
              $(this).html($(this).html().replace(/(decisive)/g,'<span class="highlight">$1</span>'));
              $(this).html($(this).html().replace(/(determined)/g,'<span class="highlight">$1</span>'));
            });


        }
        $scope.safeApply();
        selectedResponse = false;
      } else {
        //do not continue
      }

    }

    $scope.onSubmitForm = function (response) {
        console.log('submit form');
        $scope.profileQuestionsDone = false;
        var totalQuestions = 6;
        //if all questions answered
        if (formQuestionsAnswered == totalQuestions) {
          var braveScore = $scope.braveScore;

          //gender
          var nGender = 0;
          var selectedGender = $('.gender .cs-placeholder').html();
          myDataRef.child('data/gender/' + selectedGender + '/n').transaction(function(currentRank) {
            nGender = currentRank;
            return currentRank+1;
          });
          myDataRef.child('data/gender/' + selectedGender + '/avgBraveScore').transaction(function(currentRank) {
            var avgGender = Math.round(((currentRank*nGender) + braveScore)/(nGender+1));
            return avgGender;
          });

          //age
          var nAge = 0;
          var selectedAge = $('.age .cs-placeholder').html();
          myDataRef.child('data/age/' + selectedAge + '/n').transaction(function(currentRank) {
            nAge = currentRank;
            return currentRank+1;
          });
          myDataRef.child('data/age/' + selectedAge + '/avgBraveScore').transaction(function(currentRank) {
            var avgAge = Math.round(((currentRank*nAge) + braveScore)/(nAge+1));
            return avgAge;
          });

          //occupation - replace audio/video with audio & video as / affects firebase
          var selectedOccupation = $('.occupation .cs-placeholder').html().replace(/\//g, ' & ');;
          myDataRef.child('data/occupation/' + selectedOccupation + '/n').transaction(function(currentRank) { return currentRank+1; });

          //education
          var selectedEducation = $('.education .cs-placeholder').html();
          myDataRef.child('data/education/' + selectedEducation + '/n').transaction(function(currentRank) { return currentRank+1; });

          //lifestyle
          var selectedLifestyle = $('.lifestyle .cs-placeholder').html();
          myDataRef.child('data/lifestyle/' + selectedLifestyle + '/n').transaction(function(currentRank) { return currentRank+1; });

          //news
          var selectedNews = $('.news .cs-placeholder').html();
          myDataRef.child('data/news/' + selectedNews + '/n').transaction(function(currentRank) { return currentRank+1; });
        } else {
          console.log("Please fill in every question");
        }

         $scope.isDone = true;

            $('.count').each(function () {
                $(this).prop('Counter',0).animate({
                    Counter: Math.round(braveScore/categoryCount)
                }, {
                    duration: 1500,
                    easing: 'swing',
                    step: function (now) {
                        $(this).text(Math.ceil(now));
                    }

                });
            });
            $('#braveScore > span').addClass('count');

            $('.delay').delay( 1750 ).animate({opacity:1}, 1500);


            if ($scope.braveScore > 50) {
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

        if ($scope.braveScore > 50) {
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
        }


        if ($scope.profileQuestionNdx == $scope.source.profileQuestions.length) {
            $scope.isProfileDone = true;
            $scope.isDone = true;
            $scope.profileQuestionsDone = false;
            $scope.profileQuestionNdx = 0;
            $('body').removeClass('profilePage');
            $('.delay').delay( 1750 ).animate({opacity:1}, 1500);

            $('.count').each(function () {
                $(this).prop('Counter',0).animate({
                    Counter: Math.round(braveScore/categoryCount)
                }, {
                    duration: 1500,
                    easing: 'swing',
                    step: function (now) {
                        $(this).text(Math.ceil(now));
                    }

                });
            });
            $('#braveScore > span').addClass('count');

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
