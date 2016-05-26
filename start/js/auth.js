(function (jQuery, Firebase, Path) {
    "use strict";


    // the main firebase reference
    var rootRef = new Firebase('https://blistering-inferno-6990.firebaseio.com/web/uauth');

    // the main data reference
    var dataRef = new Firebase('https://blistering-inferno-6990.firebaseio.com/data');

    // pair our routes to our form elements and controller
    var routeMap = {
        '#/': {
            form: 'frmLogin',
            controller: 'login'
        },
            '#/logout': {
            form: 'frmLogout',
            controller: 'logout'
        },
            '#/register': {
            form: 'frmRegister',
            controller: 'register'
        },
            '#/profile': {
            form: 'frmProfile',
            controller: 'profile',
            authRequired: true // must be logged in to get here
        },
            '#/quiz': {
            form: 'quizProfile',
            controller: 'quiz',
            authRequired: true // must be logged in to get here
        },
            '#/info': {
            form: 'infoProfile',
            controller: 'info',
            authRequired: true // must be logged in to get here
        },
    };

    // create the object to store our controllers
    var controllers = {};

    // store the active form shown on the page
    var activeForm = null;

    var alertBox = $('#alert');

    function routeTo(route) {
        window.location.href = '#/' + route;
    }

    // Handle third party login providers
    // returns a promise
    function thirdPartyLogin(provider) {
        var deferred = $.Deferred();

        rootRef.authWithOAuthPopup(provider, function (err, user) {
            if (err) {
                deferred.reject(err);
            }

            if (user) {
                deferred.resolve(user);
            }
        });

        return deferred.promise();
    };

    // Handle Email/Password login
    // returns a promise
    function authWithPassword(userObj) {
        var deferred = $.Deferred();
        // console.log(userObj);
        rootRef.authWithPassword(userObj, function onAuth(err, user) {
            if (err) {
                deferred.reject(err);
            }

            if (user) {
                deferred.resolve(user);
            }

        });

        return deferred.promise();
    }

    // create a user but not login
    // returns a promsie
    function createUser(userObj) {
        var deferred = $.Deferred();
        rootRef.createUser(userObj, function (err) {

            if (!err) {
                deferred.resolve();
            } else {
                deferred.reject(err);
            }

        });

        return deferred.promise();
    }

    // Create a user and then login in
    // returns a promise
    function createUserAndLogin(userObj) {
        return createUser(userObj)
            .then(function () {
            return authWithPassword(userObj);
        });
    }

    // authenticate anonymously
    // returns a promise
    function authAnonymously() {
        var deferred = $.Deferred();
        rootRef.authAnonymously(function (err, authData) {

            if (authData) {
                deferred.resolve(authData);
            }

            if (err) {
                deferred.reject(err);
            }

        });

        return deferred.promise();
    }

    // route to the specified route if sucessful
    // if there is an error, show the alert
    function handleAuthResponse(promise, route) {
        $.when(promise)
            .then(function (authData) {

            // route
            routeTo(route);

        }, function (err) {
            console.log(err);
            // pop up error
            showAlert({
                title: err.code,
                detail: err.message,
                className: 'alert-danger'
            });

        });
    }

    // options for showing the alert box
    function showAlert(opts) {
        var title = opts.title;
        var detail = opts.detail;
        var className = 'alert ' + opts.className;

        alertBox.removeClass().addClass(className);
        alertBox.children('#alert-title').text(title);
        alertBox.children('#alert-detail').text(detail);
    }

    /// Controllers
    ////////////////////////////////////////

    controllers.login = function (form) {

        $('body').removeClass().addClass('ng-scope loginPage');
        // Form submission for logging in
        form.on('submit', function (e) {

            var userAndPass = $(this).serializeObject();
            var loginPromise = authWithPassword(userAndPass);
            e.preventDefault();

            handleAuthResponse(loginPromise, 'quiz');

        });

        // Social buttons
        form.children('.bt-social').on('click', function (e) {

            var $currentButton = $(this);
            var provider = $currentButton.data('provider');
            var socialLoginPromise;
            e.preventDefault();

            socialLoginPromise = thirdPartyLogin(provider);
            handleAuthResponse(socialLoginPromise, 'profile');

        });

        form.children('#btAnon').on('click', function (e) {
            e.preventDefault();
            handleAuthResponse(authAnonymously(), 'profilex');
        });

    };

    // logout immediately when the controller is invoked
    controllers.logout = function (form) {
        $('body').removeClass().addClass('ng-scope logoutPage');
        rootRef.unauth();
        routeTo('');


    };

    // logout immediately when the controller is invoked
    controllers.quiz = function (form) {
      $('body').removeClass().addClass('ng-scope quizPage');
    };

    // logout immediately when the controller is invoked
    controllers.info = function (form) {

// Check the current user
      var user = rootRef.getAuth();
      var userRef;
      var infoOneVal, infoOneValAll, infoOneOption, infoOneOptionAll,
          infoTwoVal, infoTwoValAll, infoTwoOption, infoTwoOptionAll,
          infoThreeVal, infoThreeValAll, infoThreeOption, infoThreeOptionAll,
          infoFourVal, infoFourValAll, infoFourOption, infoFourOptionAll,
          infoFiveVal, infoFiveValAll, infoFiveOption, infoFiveOptionAll;

      // If no current user send to register page
      if (!user) {
          routeTo('login');
          return;
      }

      // Load user info
      userRef = rootRef.child('users').child(user.uid);
      userRef.once('value', function (snap) {
          var user = snap.val();
          if (!user) {
              return;
          }
          var braveType = user.braveCategory;
          var infoRef = dataRef.child(braveType);

          dataRef.once('value', function (snap) {
              //main
              var allInfo = snap.val();
              var profileInfo = allInfo[braveType];
              //Q1
              var profileQ1 = profileInfo.profileQ1;
              var snowboarding = profileQ1.snowboarding;
              var snowboardingAll = allInfo.Adventurer.profileQ1.snowboarding + allInfo.Leader.profileQ1.snowboarding + allInfo.Protector.profileQ1.snowboarding + allInfo.Scientist.profileQ1.snowboarding;
              var skiing = profileQ1.skiing;
              var skiingAll = allInfo.Adventurer.profileQ1.skiing + allInfo.Leader.profileQ1.skiing + allInfo.Protector.profileQ1.skiing + allInfo.Scientist.profileQ1.skiing;
              var Q1total = profileQ1.total;
              var Q1totalAll = allInfo.Adventurer.profileQ1.total + allInfo.Leader.profileQ1.total + allInfo.Protector.profileQ1.total + allInfo.Scientist.profileQ1.total;
              if (snowboarding >= skiing) {
                infoOneVal = (snowboarding/Q1total)*100;
                infoOneValAll = (snowboardingAll/Q1totalAll)*100;
                infoOneOption = "snowboarding";
                infoOneOptionAll = "snowboarding";
              } else {
                infoOneVal = (skiing/Q1total)*100;
                infoOneValAll = (skiingAll/Q1totalAll)*100;
                infoOneOption = "skiing";
                infoOneOptionAll = "skiing";
              }
              form.find('#infoOneOption').html(infoOneOption);
              form.find('#infoOneOptionAll').html(infoOneOptionAll);
              form.find('#infoOneVal').html(Math.round(infoOneVal));
              form.find('#infoOneValAll').html(Math.round(infoOneValAll));
              //Q2
              var profileQ2 = profileInfo.profileQ2;
              var matureCheddar = profileQ2["mature cheddar"];
              var matureCheddarAll = allInfo.Adventurer.profileQ2["mature cheddar"] + allInfo.Leader.profileQ2["mature cheddar"] + allInfo.Protector.profileQ2["mature cheddar"] + allInfo.Scientist.profileQ2["mature cheddar"];
              var blueCheese = profileQ2["blue cheese"];
              var blueCheeseAll = allInfo.Adventurer.profileQ2["blue cheese"] + allInfo.Leader.profileQ2["blue cheese"] + allInfo.Protector.profileQ2["blue cheese"] + allInfo.Scientist.profileQ2["blue cheese"];
              var Q2total = profileQ2.total;
              var Q2totalAll = allInfo.Adventurer.profileQ2.total + allInfo.Leader.profileQ2.total + allInfo.Protector.profileQ2.total + allInfo.Scientist.profileQ2.total;
              if (matureCheddar >= blueCheese) {
                infoTwoVal = (matureCheddar/Q2total)*100;
                infoTwoValAll = (matureCheddarAll/Q2totalAll)*100;
                infoTwoOption = "mature cheddar";
                infoTwoOptionAll = "mature cheddar";
              } else {
                infoTwoVal = (blueCheese/Q2total)*100;
                infoTwoValAll = (blueCheeseAll/Q2totalAll)*100;
                infoTwoOption = "blue cheese";
                infoTwoOptionAll = "blue cheese";

              }
              form.find('#infoTwoOption').html(infoTwoOption);
              form.find('#infoTwoOptionAll').html(infoTwoOptionAll);
              form.find('#infoTwoVal').html(Math.round(infoTwoVal));
              form.find('#infoTwoValAll').html(Math.round(infoTwoValAll));
              //Q3
              var profileQ3 = profileInfo.profileQ3;
              var electronic = profileQ3["electronic music"];
              var rock = profileQ3["rock music"];
              var Q3total = profileQ3.total;
              if (electronic >= rock) {
                infoThreeVal = Q3total/electronic;
                infoThreeOption = "electronic music";
              } else {
                infoThreeVal = Q3total/rock;
                infoThreeOption = "rock music";
              }
              form.find('#infoThreeOption').html(infoThreeOption);
              form.find('#infoThreeVal').html(Math.round(infoThreeVal));
              //Q4
              var profileQ4 = profileInfo.profileQ4;
              var tea = profileQ4["tea"];
              var teaAll = allInfo.Adventurer.profileQ4.tea + allInfo.Leader.profileQ4.tea + allInfo.Protector.profileQ4.tea + allInfo.Scientist.profileQ4.tea;
              var coffee = profileQ4["coffee"];
              var coffeeAll = allInfo.Adventurer.profileQ4.coffee + allInfo.Leader.profileQ4.coffee + allInfo.Protector.profileQ4.coffee + allInfo.Scientist.profileQ4.coffee;
              var Q4total = profileQ4.total;
              var Q4totalAll = allInfo.Adventurer.profileQ4.total + allInfo.Leader.profileQ4.total + allInfo.Protector.profileQ4.total + allInfo.Scientist.profileQ4.total;
              if (tea >= coffee) {
                infoFourVal = (tea/Q4total)*100;
                infoFourValAll = (teaAll/Q4totalAll)*100;
                infoFourOption = "tea";
                infoFourOptionAll = "tea";
              } else {
                infoFourVal = (coffee/Q4total)*100;
                infoFourValAll = (coffeeAll/Q4totalAll)*100;
                infoFourOption = "coffee";
                infoFourOptionAll = "coffee";
              }
              form.find('#infoFourOption').html(infoFourOption);
              form.find('#infoFourOptionAll').html(infoFourOptionAll);
              form.find('#infoFourVal').html(Math.round(infoFourVal));
              form.find('#infoFourValAll').html(Math.round(infoFourValAll));

              //Q5
              var profileQ5 = profileInfo.profileQ5;
              var beach = profileQ5["beach holiday"];
              var beachAll = allInfo.Adventurer.profileQ5["beach holiday"] + allInfo.Leader.profileQ5["beach holiday"] + allInfo.Protector.profileQ5["beach holiday"] + allInfo.Scientist.profileQ5["beach holiday"];
              var city = profileQ5["city break"];
              var cityAll = allInfo.Adventurer.profileQ5["city break"] + allInfo.Leader.profileQ5["city break"] + allInfo.Protector.profileQ5["city break"] + allInfo.Scientist.profileQ5["city break"];
              var Q5total = profileQ5.total;
              var Q5totalAll = allInfo.Adventurer.profileQ5.total + allInfo.Leader.profileQ5.total + allInfo.Protector.profileQ5.total + allInfo.Scientist.profileQ5.total;
              if (beach >= city) {
                infoFiveVal = (beach/Q5total)*100;
                infoFiveValAll = (beachAll/Q5totalAll)*100;
                infoFiveOption = "beach holidays";
                infoFiveOptionAll = "beach holidays";
              } else {
                infoFiveVal = (city/Q5total)*100;
                infoFiveValAll = (cityAll/Q5totalAll)*100;
                infoFiveOption = "city breaks";
                infoFiveOptionAll = "city breaks";
              }
              form.find('#infoFiveOption').html(infoFiveOption);
              form.find('#infoFiveOptionAll').html(infoFiveOptionAll);
              form.find('#infoFiveVal').html(Math.round(infoFiveVal));
              form.find('#infoFiveValAll').html(Math.round(infoFiveValAll));

          });



          // set the fields

          form.find('#braveCategory').html(braveType);
      });



    };

    controllers.register = function (form) {
        $('body').removeClass().addClass('ng-scope registerPage');
        // Form submission for registering
        form.on('submit', function (e) {

            var userAndPass = $(this).serializeObject();
            var loginPromise = createUserAndLogin(userAndPass);
            e.preventDefault();

            handleAuthResponse(loginPromise, 'quiz');

        });

    };

    controllers.profile = function (form) {
        $('body').removeClass().addClass('ng-scope profilePage');
        // Check the current user
        var user = rootRef.getAuth();
        var userRef;

        // If no current user send to register page
        if (!user) {
            routeTo('login');
            return;
        }

        // Load user info
        userRef = rootRef.child('users').child(user.uid);
        userRef.once('value', function (snap) {
            var user = snap.val();
            if (!user) {
                return;
            }

            // set the fields
            $('#braveScore').html(user.scores["brave"]);
            form.find('#txtName').val(user.name);
            form.find('#ddlDino').val(user.favoriteDinosaur);
        });

        // Save user's info to Firebase
        form.on('submit', function (e) {
            e.preventDefault();
            var userInfo = $(this).serializeObject();

            userRef.update(userInfo, function onComplete() {

                // show the message if write is successful
                showAlert({
                    title: 'Successfully saved!',
                    detail: 'You are still logged in',
                    className: 'alert-success'
                });

            });
        });

    };

    /// Routing
    ////////////////////////////////////////

    // Handle transitions between routes
    function transitionRoute(path) {
        // grab the config object to get the form element and controller
        var formRoute = routeMap[path];
        var currentUser = rootRef.getAuth();

        // if authentication is required and there is no
        // current user then go to the register page and
        // stop executing
        if (formRoute.authRequired && !currentUser) {
            routeTo('register');
            return;
        }

        // wrap the upcoming form in jQuery
        var upcomingForm = $('#' + formRoute.form);

        // if there is no active form then make the current one active
        if (!activeForm) {
            activeForm = upcomingForm;
        }

        // hide old form and show new form
        activeForm.hide();
        upcomingForm.show().hide().fadeIn(750);

        // remove any listeners on the soon to be switched form
        activeForm.off();

        // set the new form as the active form
        activeForm = upcomingForm;

        // invoke the controller
        controllers[formRoute.controller](activeForm);
    }

    // Set up the transitioning of the route
    function prepRoute() {
        transitionRoute(this.path);
    }


    /// Routes
    ///  #/         - Login
    //   #/logout   - Logut
    //   #/register - Register
    //   #/profile  - Profile

    Path.map("#/").to(prepRoute);
    Path.map("#/logout").to(prepRoute);
    Path.map("#/register").to(prepRoute);
    Path.map("#/profile").to(prepRoute);
    Path.map("#/quiz").to(prepRoute);
    Path.map("#/info").to(prepRoute);

    Path.root("#/");

    /// Initialize
    ////////////////////////////////////////

    $(function () {

        // Start the router
        Path.listen();

        // whenever authentication happens send a popup
        rootRef.onAuth(function globalOnAuth(authData) {

            if (authData) {
                showAlert({
                    title: 'Logged in!',
                    detail: 'Using ' + authData.provider,
                    className: 'alert-success'
                });
            } else {
                showAlert({
                    title: 'You are not logged in',
                    detail: '',
                    className: 'alert-info'
                });
            }

        });

    });

}(window.jQuery, window.Firebase, window.Path))
