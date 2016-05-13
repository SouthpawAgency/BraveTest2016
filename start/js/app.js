
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
                "text": "You rarely catch me changing my mind",
                "catId": 0
        }, {
            "id": 1002,
                "text": "It's not over until the fat lady sings",
                "catId": 0
        }, {
            "id": 1003,
                "text": "Rules? What rules? They're only made to be broken",
                "catId": 0
        }, {
            "id": 1004,
                "text": "Just like the Duracell bunny, I keep going seven times longer than everyone else.",
                "catId": 0
        }, {
            "id": 1005,
                "text": "I go with my gut everytime",
                "catId": 0
        }, {
            "id": 1006,
                "text": "When I believe in something I give 110% of myself to it",
                "catId": 0
        }, {
            "id": 1007,
                "text": "Once I get started on something big, it's all I can think about",
                "catId": 0
        }, {
            "id": 1008,
                "text": "I'm constantly asking questions and looking for answers",
                "catId": 0
        }, {
            "id": 1009,
                "text": "I'm not afraid to flip things on their head in order to get results",
                "catId": 0
        }, {
            "id": 1010,
                "text": "If it's been done before I don't know what to do",
                "catId": 0
        }],
            "categories": [
            "BRAVE SCORE"],
            "categoryMessages": [{
                "protector": "Protector",
                "scientist": "Scientist",
                "adventurer": "Adventurer",
                "leader": "Leader"
            }],
        "profileQuestions": [{
            "id":1001,
            "optionLeft": "snowboarding",
            "optionRight": "skiing"
          },{
            "id":1002,
            "optionLeft": "mature cheddar",
            "optionRight": "blue cheese"
          },{
            "id":1003,
            "optionLeft": "rock music",
            "optionRight": "electronic music"
          },{
            "id":1004,
            "optionLeft": "tea",
            "optionRight": "coffee"
          },{
            "id":1005,
            "optionLeft": "beach holiday",
            "optionRight": "city break"
          }]
        }

    var theUser;
    var theUserRef;
	  var firstBackground = ["Question1.jpg"];
    var backgrounds = ["Question1.jpg", "Question2.jpg", "Question3.jpg", "Question4.jpg", "Question5.jpg", "Question6.jpg", "Question7.jpg", "Question8.jpg", "Question9.jpg", "Question10.jpg", "Question10.jpg"];
    var resultsBackgrounds = ["ResultsPageAventurer.jpg", "ResultsPageLeader.jpg", "ResultsPageProtector.jpg", "ResultsPageScientist.jpg"];

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
        categoryMaxScores[catId] += 5;
    }
    $scope.source.categoryMaxScores = categoryMaxScores;
    $scope.braveCategory = 'participant';
    $scope.questionNdx = 0;
    $scope.profileQuestionNdx = 0;
    $scope.questionsDone = false;
    $scope.profileQuestionsDone = false;
    $scope.isDone = false;
    $scope.isProfileDone = false;
    $scope.shareShow = false;
    $scope.profileInfo = true;
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
        $('body').css("background-image",'url("images/'+firstBackground+'")');

    }

    $scope.isCategoryLeader = function (catId) {
        return $scope.results.categories[catId] <= 0.39;

    }
    $scope.isCategoryAdventurer = function (catId) {
        return ($scope.results.categories[catId] >= 0.40 && $scope.results.categories[catId] <= 0.59);
    }
    $scope.isCategoryScientist = function (catId) {
        return ($scope.results.categories[catId] >= 0.60 && $scope.results.categories[catId] <= 0.79);
    }
    $scope.isCategoryProtector = function (catId) {
        return $scope.results.categories[catId] >= 0.80;
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

      if (selectedResponse) {
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
        $('body').css("background-image",'url("images/'+backgrounds[i]+'")');
        i++;
        if ($scope.questionNdx == $scope.source.questions.length) {
            $scope.isDone = true;
            $scope.questionsDone = true;

            if ($scope.isCategoryLeader(catId)) {
              theUserRef.child('braveCategory').set('Leader');
              $scope.braveCategory = "Leader";
              dataCategory = "Leader";
            }
            if ($scope.isCategoryAdventurer(catId)) {
              theUserRef.child('braveCategory').set('Adventurer');
              $scope.braveCategory = "Adventurer";
              dataCategory = "Adventurer";
            }
            if ($scope.isCategoryScientist(catId)) {
              theUserRef.child('braveCategory').set('Scientist');
              $scope.braveCategory = "Scientist";
              dataCategory = "Scientist";
            }
            if ($scope.isCategoryProtector(catId)) {
              theUserRef.child('braveCategory').set('Protector');
              $scope.braveCategory = "Protector";
              dataCategory = "Protector";
            }
        }
        $scope.safeApply();
        selectedResponse = false;
      } else {
        //do not continue
      }

    }

    //PROFILE QUESTIONS
    var profileJustLoaded = true;
    var dataCategory;

    $scope.onSelectProfileResponse = function (response) {
        var selectedOption;
        var questionNdx = $scope.profileQuestionNdx;
        var question = $scope.source.profileQuestions[questionNdx];
        $scope.profileQuestionNdx++;

        if (profileJustLoaded) {
          theUser = myDataRef.child('web/uauth').getAuth();
          theUserRef = myDataRef.child('web/uauth/users').child(theUser.uid);
          dataCategory = $('#braveCategory').html();
          console.log(dataCategory);
          profileJustLoaded = false;
        }

        if (response == 1) {
          selectedOption = question.optionLeft;
        } else {
          selectedOption = question.optionRight;
        }

        //add selected option to user's profile
        theUserRef.child('profileAnswers/Q' + (questionNdx + 1)).set(selectedOption);
        //increase total by 1
        myDataRef.child('data/'+ dataCategory + "/profileQ" + (questionNdx + 1) + "/total").transaction(function(currentRank) { return currentRank+1; });
        //increase selected option by 1
        myDataRef.child('data/'+ dataCategory + "/profileQ" + (questionNdx + 1) + "/" + selectedOption).transaction(function(currentRank) { return currentRank+1; });

        // $('body').css("background-image",'url("images/'+backgrounds[i]+'")');
        // i++;
        if ($scope.profileQuestionNdx == $scope.source.profileQuestions.length) {
            $scope.isProfileDone = true;
            $scope.profileQuestionsDone = true;
            console.log($scope.profileQuestionsDone);
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
