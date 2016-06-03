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
            '#/share': {
            form: 'sharePage',
            controller: 'share',
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
            handleAuthResponse(socialLoginPromise, 'quiz');

        });

        form.children('#btAnon').on('click', function (e) {
            e.preventDefault();
            handleAuthResponse(authAnonymously(), 'quiz');
        });

    };

    // logout immediately when the controller is invoked
    controllers.logout = function (form) {
        $('body').removeClass().addClass('ng-scope logoutPage');
        $('.logo').css('display','block');
        rootRef.unauth();
        routeTo('');


    };

    // logout immediately when the controller is invoked
    controllers.quiz = function (form) {
      $('body').removeClass().addClass('ng-scope quizPage');
      $('.logo').css('display','none');
    };

    // logout immediately when the controller is invoked
    controllers.info = function (form) {
      $('body').removeClass().addClass('ng-scope infoPage');
      $('.logo').css('display','none');

// Check the current user
      var user = rootRef.getAuth();
      var userRef;
      var infoOneVal, infoOneOption,
          infoTwoVal, infoTwoOption,
          infoThreeVal, infoThreeOption,
          infoFourVal, infoFourOption,
          infoFiveVal, infoFiveOption, infoFiveOptionAlt;

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

          dataRef.once('value', function (snap) {
              //main
              var allInfo = snap.val();

              //Q1
              var Q1 = allInfo.Q1;
              if (Q1.optionLeft.n >= Q1.optionRight.n) {
                infoOneOption = "Jazz";
                $("#infographic1 img").attr("src", "images/infographics/1a.png");
              } else {
                infoOneOption = "Hip Hop";
                $("#infographic1 img").attr("src", "images/infographics/1b.png");
              }
              form.find('#infoOneOption').html(infoOneOption);

              //Q2
              var Q2 = allInfo.Q2;
              if (Q2.optionLeft.n >= Q2.optionRight.n) {
                infoTwoOption = "lights on";
                $("#infographic2 img").attr("src", "images/infographics/2b.png");
              } else {
                infoTwoOption = "lights off";
                $("#infographic2 img").attr("src", "images/infographics/2a.png");
              }
              form.find('#infoTwoOption').html(infoTwoOption);
              //Q3
              var Q3 = allInfo.Q3;
              if (Q3.optionLeft.n >= Q3.optionRight.n) {
                infoThreeOption = "a beer";
                $("#infographic3 img").attr("src", "images/infographics/3a.png");
              } else {
                infoThreeOption = "spirits";
                $("#infographic3 img").attr("src", "images/infographics/3b.png");
              }
              form.find('#infoThreeOption').html(infoThreeOption);
              //Q4
              var Q4 = allInfo.Q4;
              if (Q4.optionLeft.n >= Q4.optionRight.n) {
                infoFourOption = "Game of Thrones";
                $("#infographic4 img").attr("src", "images/infographics/4a.png");
              } else {
                infoFourOption = "Breaking Bad";
                $("#infographic4 img").attr("src", "images/infographics/4b.png");
              }
              form.find('#infoFourOption').html(infoFourOption);
              //Q4
              var Q5 = allInfo.Q5;
              if (Q5.optionLeft.n >= Q5.optionRight.n) {
                infoFiveOption = "Nik Naks";
                $("#infographic5 img").attr("src", "images/infographics/5.png");
              } else {
                infoFiveOption = "Quavers";
                $("#infographic5 img").attr("src", "images/infographics/5.png");
              }
              form.find('#infoFiveOption').html(infoFiveOption);

              //overall average
              var overallTotalScore = (Q1.optionLeft.braveScore * Q1.optionLeft.n) +
                                      (Q1.optionRight.braveScore * Q1.optionRight.n) +
                                      (Q2.optionLeft.braveScore * Q2.optionLeft.n) +
                                      (Q2.optionRight.braveScore * Q2.optionRight.n) +
                                      (Q3.optionLeft.braveScore * Q3.optionLeft.n) +
                                      (Q3.optionRight.braveScore * Q3.optionRight.n) +
                                      (Q4.optionLeft.braveScore * Q4.optionLeft.n) +
                                      (Q4.optionRight.braveScore * Q4.optionRight.n) +
                                      (Q5.optionLeft.braveScore * Q5.optionLeft.n) +
                                      (Q5.optionRight.braveScore * Q5.optionRight.n);
              var overallTotalN = Q1.optionLeft.n + Q1.optionRight.n + Q2.optionLeft.n + Q2.optionRight.n + Q3.optionLeft.n + Q3.optionRight.n + Q4.optionLeft.n + Q4.optionRight.n + Q5.optionLeft.n + Q5.optionRight.n;
              var overallAvg = overallTotalScore/overallTotalN;
              form.find('#infoOverallAvg').html(Math.round(overallAvg));
          });
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
        $('.logo').css('display','none');
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

    // share page
    controllers.share = function (form) {
      $('body').removeClass().addClass('ng-scope sharePage');
      $('.logo').css('display','none');

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
          var fbLink = "https://www.facebook.com/dialog/feed?app_id=1707512429512286&redirect_uri=http://southpawagency.com/bravetest2016&link=http://southpawagency.com/bravetest&picture=http://southpawagency.com/bravetest2016/start/images/Mainpage.jpg&description=I%20am%20" + user.scores["brave"] + "%25%20brave%20in%20the%20Southpaw%20Brave%20test."
          var twLink = "https://twitter.com/intent/tweet?text=I%20scored%20" + user.scores["brave"] + "%25%20in%20the%20Southpaw%20Brave%20Test.%20Think%20you%20can%20beat%20me?%20Take%20the%20test%20here%3A%20http%3A//southpawagency.com/bravetest/";

          // set the fields
          $('.fb a').attr("href",fbLink);
          $('.tw a').attr("href",twLink);
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
    Path.map("#/share").to(prepRoute);

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
