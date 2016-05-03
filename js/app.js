//<![CDATA[
  var myDataRef = new Firebase('https://blistering-inferno-6990.firebaseio.com/');

  var theUser = myDataRef.child('web/uauth').getAuth();
  var theUserRef = myDataRef.child('web/uauth/users').child(theUser.uid);
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
                "text": "I feel healthy.",
                "catId": 0
        }, {
            "id": 1002,
                "text": "I get the sleep I need.",
                "catId": 0
        }, {
            "id": 1003,
                "text": "I have the time with my family that I need.",
                "catId": 1
        }, {
            "id": 1004,
                "text": "I want to come in to work every single day.",
                "catId": 1
        }, {
            "id": 1005,
                "text": "My personal values are reflected in the actions of the studio.",
                "catId": 2
        }, {
            "id": 1006,
                "text": "The mission/purpose of my studio makes me feel my job is important.",
                "catId": 2
        }, {
            "id": 1007,
                "text": "The things that are most important to me are also important to my studio.",
                "catId": 3
        }, {
            "id": 1008,
                "text": "I have opportunities and freedom to make a difference on the things most important to me as a game developer.",
                "catId": 3
        }, {
            "id": 1009,
                "text": "Senior management openly communicates the state of our studio.",
                "catId": 4
        }, {
            "id": 1010,
                "text": "I believe in the ability of senior management to take the company in the right direction.",
                "catId": 4
        }, {
            "id": 1011,
                "text": "Senior management in my studio has realistic expectations.",
                "catId": 5
        }, {
            "id": 1012,
                "text": "Senior management at my studio is honest with me and themselves about the realities of the game we’re working on.",
                "catId": 5
        }, {
            "id": 1013,
                "text": "My immediate manager holds me accountable for my performance.",
                "catId": 6
        }, {
            "id": 1014,
                "text": "My immediate manager values the work I do.",
                "catId": 6
        }, {
            "id": 1015,
                "text": "I trust the information I receive from my immediate manager.",
                "catId": 7
        }, {
            "id": 1016,
                "text": "My manager inspires me.",
                "catId": 8
        }],
            "categories": [
            "HEALTH & WELLBEING",
            "VALUES",
            "SENIOR MANAGEMENT",
            "IMMEDIATE SUPERVISOR",
            "PERSONAL & PROFESSIONAL DEVELOPMENT",
            "SOCIAL ENVIRONMENT",
            "COWORKERS",
            "CONTRIBUTION"],
            "categoryMessages": [{
            "high": "You seem to be taking good care of yourself in terms of your physical and emotional wellbeing. Make sure it’s not by accident, though! Be intentional about maintaining your health, both emotionally and physically. There’s a bevy of medical and psychological evidence that shows you’ll perform better at work and enjoy life more when you pay attention to your nutrition, get regular exercise, and strengthen your social connections.",
                "neutral": "Don’t let your emotional or physical wellbeing fall by the wayside. Your physical health (nutrition, sleep, exercise) has been proven to have a noteworthy impact on your performance at work. Your emotional health (forging relationships, doing work that’s meaningful to you) also plays a role in how you perform as a team member. Remember…your work isn’t your life!",
                "low": "There’s reason to be concerned that you aren’t placing a high priority on your health, either emotional or physical. Try asking a friend or family member for some objective assessment here, and seriously consider what simple steps you could take that would move you towards a healthier lifestyle."
        }, {
            "high": "Your personal values and those of your studio seem to be in alignment. Excellent!",
                "neutral": "Your personal values and those of your studio might not be aligned very well. Make sure you understand what’s important to you – what priorities you use to determine a course of action or choose a direction in your life. Then be sure you know what the values of your company are. One of the main detractors from workplace satisfaction and passion about your job is a disparity between these sets of values, a disparity which easily leads to reduced productivity and lower happiness.",
                "low": "Your studio’s values aren’t aligned with your personal values. This might be a result of your senior leadership not clearly stating the company’s values, or it might be due to clear differences between what’s important to you and what’s important to your studio. One of the quickest ways to become unhappy in the workplace and to feel more stress from your job is to work for a company that that doesn’t agree with what’s important to you. Very few of us live in an ideal world where we have no need for steady income, but working someplace you don’t like just to pay the bills takes an inarguable and sometimes irreplaceable toll on your wellbeing."
        }, {
            "high": "The senior management at your studio seems to be openly communicative and trustworthy, which is great (and, unfortunately, somewhat uncommon in many cases). Everyone appreciates hearing 'high' feedback, and the people closer to the top of the hierarchy tend to hear it least of all. Consider expressing some appreciation to your studio’s leaders for being honest and for providing good direction for the company!",
                "neutral": "While they aren’t perfect, you do have some pretty good things to say about the communication and trustworthiness of the senior management at your studio. Hopefully the quality of communication extends to you being able to share any concerns you have. In a healthy work environment you should have a channel through which you can get answers to questions about why certain decisions are made, and to inform your leaders about the impact of those decisions.",
                "low": "There are real concerns about the communication and trustworthiness of senior management at your studio, and these are factors that have significant 'low' impact on employee engagement. Your happiness level at work, your emotional attachment to your game and your company…these are critical to both your productivity and the likelihood that you’ll stay at the studio through hard times, and they’re eroded by lack of belief in senior leadership. By all means, use whatever tools are available to you to communicate your concerns and bring about 'high' change. When it comes to your own mental and emotional health, though, the question is begged: Why would you work someplace where you don’t trust the people in charge?"
        }, {
            "high": "You have a relationship with your lead that is somewhere between 'good' and 'great', which is awesome. This is a two-way street, though, and depends upon both of you making an effort on an ongoing basis. Give your lead some encouragement and let them know they’re doing a good job!",
                "neutral": "There are some pros and cons to your relationship with your lead, and that’s pretty normal. Don’t underestimate the importance of how you relate to them, though, and don’t just leave it up to them to improve things – they need your feedback.",
                "low": "The impression you give of your lead is not good. That’s bad for your wellbeing, your productivity, and the quality of your work environment. Multiple studies speak to the importance of your relationship with your immediate manager, so find a way to improve that relationship or find a new manager. Hopefully you can do that within your company, but if not understand that a change is important to your physical and emotional health."
        }, {
            "high": "You are growing and being recognized for doing good work at your studio. Fantastic! You know how good it feels when someone praises you for a job well done? Make sure you do that for your coworkers, too.",
                "neutral": "There are ways in which your personal or professional development can improve at your studio. This may be due to the nature of your tasks, a lack of proactive behavior from your lead, or some other restrictive aspect of your environment. Whatever the cause, make sure it’s not you – seek growth and improvement! Your own happiness and your importance to your company frequently depend on it.",
                "low": "For whatever reason, your personal and professional development is being stunted. In some cases this is an internal problem for a developer – they just think they can slide by due to tenure, seniority, or lack of accountability. Sometimes the cause can be traced to an environment that encourages pigeonholing or to deficient leadership. Whatever the source of the problem, you’re not growing and that’s bad for you and your company."
        }, {
            "high": "Your studio seems to respect you and your beliefs. It’s difficult to create a culture where every employee strives to prevent the creation of an uncomfortable social environment, but your company looks like it’s on the right track.",
                "neutral": "There are one or two aspects of your studio’s social environment that give pause for thought. Maybe coworkers speak in ways that make you uncomfortable, or maybe someone in leadership doesn’t treat everyone equally. Regardless of the source, make sure your lead knows about it. All game developers deserve respect and a safe environment.",
                "low": "The social environment at your studio doesn’t sound particularly safe or supportive. Whether the problem is misogyny, ageism, or some other form of categorization, everyone has the right to work someplace safe from discrimination at the hands of coworkers and leaders. These are thorny issues that often take different forms across cultures and countries so it’s impossible to accurately address via a few simple questions, but please…appreciate your intrinsic value and make sure your workplace treats you with respect."
        }, {
            "high": "Your coworkers embody some excellent traits. They hold themselves to high standards and you seem to connect well with them. Social bonds – especially with the people with whom you spend so much time – are crucial for surviving crunch time and dealing with stress. Keep doing what you can to strengthen them!",
                "neutral": "The folks in your workplace have strengths and weaknesses, like all of us. Maybe your coworkers are generally ethical but don’t seem to place great emphasis on improving the studio or producing the highest quality work. Maybe they do good work but you don’t feel a great connection with any of them. Whatever the case, you can be helping them develop just like they can help you, so don’t neglect your social ties.",
                "low": "There are reasons to be concerned about your workplace based on the behavior of your coworkers. If many seem either ethically or professionally deficient it tends to have a 'low' impact on your performance and growth. If you can’t trust your teammates to perform well – or if you simply can’t trust them – this can create a toxic environment that stresses your emotional wellbeing and stunts your professional development. Have you spoken with your lead to try to improve things?"
        }, {
            "high": "The work that you do and the insights and opinions you bring seem to be respected and valued at your studio. That’s great!",
                "neutral": "There are many ways to judge the acceptance of your contribution at your studio – some are coming out 'high' and some 'low'. Make sure that all of your input – technical expertise, opinions, possible solutions to problems – are at least being given due consideration. And make sure you’re on track to do what you really want to do. It’s easy to let yourself go on autopilot for a while without being challenged or getting a chance to operate in an area where you really shine. Everyone has to pay some dues at some point, but make sure you’re headed where you want to go.",
                "low": "If you aren’t being given a chance to meaningfully contribute, or if your skills and insights aren’t respected, that’s bad for you and it’s bad for your studio. Your employer likely isn’t getting what they’re paying for and you’re being held back from the appreciation of adding your full value. Don’t stunt your own development and allow your happiness to be drained. Work with your lead to verify your perception and take steps to get closer to doing what you want, doing your best, and being appreciated for it."
        }]
    };

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
        categoryMaxScores[catId] += 2;
    }
    $scope.source.categoryMaxScores = categoryMaxScores;

    $scope.questionNdx = 0;
    $scope.isDone = false;
    $scope.source.questions = shuffle($scope.source.questions);
    $scope.results = {
        questions: {},
        categories: {}
    };
    for (i = 0; i < categoryCount; i++) {
        $scope.results.categories[i] = 0;
    }

    $scope.isCategoryLow = function (catId) {
        return $scope.results.categories[catId] <= -0.51;
    }
    $scope.isCategoryNeutral = function (catId) {
        return !($scope.isCategoryLow(catId) || $scope.isCategoryHigh(catId));
    }
    $scope.isCategoryHigh = function (catId) {
        return $scope.results.categories[catId] >= 0.51;
    }

    $scope.onSelectResponse = function (response) {
        var questionNdx = $scope.questionNdx;
        var question = $scope.source.questions[questionNdx];
        var questionId = question.id;
        var catId = question.catId;
        var catMaxScore = $scope.source.categoryMaxScores[catId];
        var catScore = ((response + catMaxScore) / (catMaxScore)) - 1.0;
        $scope.results.questions[questionId] = response;
        $scope.results.categories[catId] += catScore;
        $scope.questionNdx++;
        theUserRef.child('answers/' + (questionNdx + 1)).set(response);
        $('#progress').width(parseInt(($scope.questionNdx / $scope.source.questions.length) * 523) + 'px');
        if ($scope.questionNdx == $scope.source.questions.length) {
            $scope.isDone = true;
        }
        $scope.safeApply();
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
//]]>
