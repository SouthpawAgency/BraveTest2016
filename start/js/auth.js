(function (jQuery, Firebase, Path) {
    "use strict";


    // the main firebase reference
    var rootRef = new Firebase('https://blistering-inferno-6990.firebaseio.com/web/uauth');

    // the main data reference
    var dataRef = new Firebase('https://blistering-inferno-6990.firebaseio.com/data');

    // pair our routes to our form elements and controller
    var routeMap = {
        '#/': {
            form: 'quizProfile',
            controller: 'quiz'
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
            controller: 'profile'
        },
            '#/info': {
            form: 'infoProfile',
            controller: 'info'
        },
            '#/share': {
            form: 'sharePage',
            controller: 'share'
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
      var fPercentage, mPercentage,
          aliensYes, aliensNo,
          eatingYolo, eatingYawye,
          moneySpend, moneySave,
          sSlap, sTickle,
          slapValue, moneyValue, alienValue, eatingValue,
          fifteen, twentyfive, thirtyfive, fourtyfive, fiftyfive, sixtyfive,
          bbc, buzzfeed, channelfour, dailyexpress, dailymail, dailymirror, dailystar, dailytelegraph, financialtimes, huffington, mashable, metro, guardian, independent, thesun, times, twitter, vice,
          bbcN, buzzfeedN, channelfourN, dailyexpressN, dailymailN, dailymirrorN, dailystarN, dailytelegraphN, financialtimesN, huffingtonN, mashableN, metroN, guardianN, independentN, thesunN, timesN, twitterN, viceN;


          dataRef.once('value', function (snap) {
              //main
              var allInfo = snap.val();
          
              //Q1
              var gender = allInfo.gender;
                fPercentage = Math.round((gender.F.nb/(gender.M.nb+gender.F.nb))*100);
                mPercentage = 100 - fPercentage;
              console.log('Males:' + mPercentage + ' Females:' + fPercentage);

              var aliens = allInfo.aliens;
                aliensYes = Math.round((aliens.Yes.nb/(aliens.No.nb+aliens.Yes.nb))*100);
                aliensNo = 100 - aliensYes;
              console.log('Aliens No:' + aliensNo + ' Aliens Yes:' + aliensYes);

              if (aliens.Yes.nb >= aliens.No.nb) {
                alienValue = "don't";
                form.find('#alienValue').html(alienValue);
                form.find('#alienValueP').html(aliensYes);
              } else {
                alienValue = "do";
                form.find('#alienValue').html(alienValue);
                form.find('#alienValueP').html(aliensNo);
              }

              var eating = allInfo.eating;
                eatingYolo = Math.round((eating.YOLO.nb/(eating["You are what you eat"].nb+eating.YOLO.nb))*100);
                eatingYawye = 100 - eatingYolo;
              console.log('Eating Yawye:' + eatingYawye + ' Eating Yolo:' + eatingYolo);

              if (eating["YOLO"].nb >= eating["You are what you eat"].nb) {
                eatingValue = "you are what you eat";
                form.find('#eatingValue').html(eatingValue);
                form.find('#eatingValueP').html(eatingYolo);
              } else {
                eatingValue = "YOLO towards eating";
                form.find('#eatingValue').html(eatingValue);
                form.find('#eatingValueP').html(eatingYawye);
              }

              var money = allInfo.money;
                moneySpend = Math.round((money["Spend it all"].nb/(money["Save it all"].nb+money["Spend it all"].nb))*100);
                moneySave = 100 - moneySpend;
              console.log('Save it all:' + moneySave + ' Spend it all:' + moneySpend);

              if (money["Spend it all"].nb >= money["Save it all"].nb) {
                moneyValue = "spend it all";
                form.find('#moneyValue').html(moneyValue);
                form.find('#moneyValueP').html(moneySpend);
              } else {
                moneyValue = "save it all";
                form.find('#moneyValue').html(moneyValue);
                form.find('#moneyValueP').html(moneySave);
              }

              var slap = allInfo.slap;
                sSlap = Math.round((slap.Slap.nb/(slap.Tickle.nb+slap.Slap.nb))*100);
                sTickle = 100 - sSlap;
              console.log('Tickle:' + sTickle + ' Slap:' + sSlap);

              if (slap.Slap.nb >= slap.Tickle.nb) {
                slapValue = "Slap";
                form.find('#slapValue').html(slapValue);
                form.find('#slapValueP').html(sSlap);
              } else {
                slapValue = "Tickle";
                form.find('#slapValue').html(slapValue);
                form.find('#slapValueP').html(sTickle);
              }

              
              // var age = allInfo.age;
              // var allAges = age["15-24"].nb+age["25-34"].nb+age["35-44"].nb+age["45-54"].nb+age["55-64"].nb+age["65+"].nb;

              //   fifteen = Math.round((age["15-24"].nb/(allAges))*100);
              //   twentyfive = Math.round((age["25-34"].nb/(allAges))*100);
              //   thirtyfive = Math.round((age["35-44"].nb/(allAges))*100);
              //   fourtyfive = Math.round((age["45-54"].nb/(allAges))*100);
              //   fiftyfive = Math.round((age["55-64"].nb/(allAges))*100);
              //   sixtyfive = Math.round((age["65+"].nb/(allAges))*100);
              // console.log('15-24:' + fifteen + ' 25-34:' + twentyfive + ' 35-44:' + thirtyfive + ' 45-54:' + fourtyfive + ' 55-64:' + fiftyfive + ' 65plus:' + sixtyfive);

              var age = allInfo.age;
                fifteen = age["15-24"].avgBraveScore;
                console.log('15-24:' + fifteen + '% brave');

                twentyfive = age["25-34"].avgBraveScore;
                console.log('25-34:' + twentyfive + '% brave');

                thirtyfive = age["35-44"].avgBraveScore;
                console.log('35-44:' + thirtyfive + '% brave');

                fourtyfive = age["45-54"].avgBraveScore;
                console.log('45-54:' + fourtyfive + '% brave');

                fiftyfive = age["55-64"].avgBraveScore;
                console.log('55-64:' + fiftyfive + '% brave');

                sixtyfive = age["65+"].avgBraveScore;
                console.log('65+:' + sixtyfive + '% brave');

                form.find('#ageColumnOne').html('15-24');
                form.find('#ageColumnTwo').html('25-34');
                form.find('#ageColumnThird').html('35-44');
                form.find('#ageColumnFourth').html('45-54');
                form.find('#ageColumnFith').html('55-64');
                form.find('#ageColumnSixth').html('65+');


              var news = allInfo.news;
                bbc = news["BBC News Website"].avgBraveScore;
                bbcN = "BBC News Website";
                console.log(bbcN + bbc);

                buzzfeed = news["Buzzfeed"].avgBraveScore;
                buzzfeedN = "Buzzfeed";
                console.log('Buzzfeed:' + buzzfeed);

                channelfour = news["Channel 4 News Website"].avgBraveScore;
                channelfourN = "Channel 4 News Website";
                console.log('Channel 4 News Website:' + channelfour);

                dailyexpress = news["Daily Express"].avgBraveScore;
                dailyexpressN = "Daily Express";
                console.log('Daily Express:' + dailyexpress);

                dailymail = news["Daily Mail"].avgBraveScore;
                dailymailN = "Daily Mail";
                console.log('Daily Mail:' + dailymail);

                dailymirror = news["Daily Mirror"].avgBraveScore;
                dailymirrorN = "Daily Mirror";
                console.log('Daily Mirror:' + dailymirror);

                dailystar = news["Daily Star"].avgBraveScore;
                dailystarN = "Daily Star";
                console.log('Daily Star:' + dailystar);

                dailytelegraph = news["Daily Telegraph"].avgBraveScore;
                dailytelegraphN = "Daily Telegraph";
                console.log('Daily Telegraph:' + dailytelegraph);

                financialtimes = news["Financial Times"].avgBraveScore;
                financialtimesN = "Financial Times";
                console.log('Financial Times:' + financialtimes);

                huffington = news["Huffington Post"].avgBraveScore;
                huffingtonN = "Huffington Post";
                console.log('Huffington Post:' + huffington);

                mashable = news["Mashable"].avgBraveScore;
                mashableN = "Mashable";
                console.log('Mashable:' + mashable);

                metro = news["Metro"].avgBraveScore;
                metroN = "Metro";
                console.log('Metro:' + metro);

                guardian = news["The Guardian"].avgBraveScore;
                guardianN =  "The Guardian";
                console.log('The Guardian:' + guardian);

                independent = news["The Independent"].avgBraveScore;
                independentN = "The Independent";
                console.log('The Independent:' + independent);

                thesun = news["The Sun"].avgBraveScore;
                thesunN = "The Sun";
                console.log('The Sun:' + thesun);

                times = news["The Times"].avgBraveScore;
                timesN = "The Times";
                console.log('The Times:' + times);

                twitter = news["Twitter"].avgBraveScore;
                twitterN = "Twitter";
                console.log('Twitter:' + twitter);

                vice = news["Vice"].avgBraveScore;
                viceN = "Vice";
                console.log('Vice:' + vice);

                var array = [[bbc, bbcN], [buzzfeed, buzzfeedN], [channelfour, channelfourN], [dailyexpress, dailyexpressN], [dailymail, dailymailN], [dailymirror, dailymirrorN], [dailystar, dailystarN], [dailytelegraph, dailytelegraphN], [financialtimes, financialtimesN], [huffington, huffingtonN], [mashable, mashableN], [metro, metroN], [guardian, guardianN], [independent, independentN], [thesun, thesunN], [times, timesN], [twitter, twitterN], [vice, viceN]];
                // var largest = Math.max.apply(Math, array);
                array.sort();
                console.log('Ordered News:' + array);

                var lastItem = array.pop();
                var secondLastItem = array.pop();
                var thirdLastItem = array.pop();
                var fourthLastItem = array.pop();
                var fithLastItem = array.pop();
                console.log('Highest News:' + lastItem);
                console.log('2nd Highest News:' + secondLastItem);
                console.log('3rd Highest News:' + thirdLastItem);
                console.log('4th Highest News:' + fourthLastItem);
                console.log('5th Highest News:' + fithLastItem);

                form.find('#newsColumnOne').html(lastItem[1]);
                form.find('#newsColumnTwo').html(secondLastItem[1]);
                form.find('#newsColumnThird').html(thirdLastItem[1]);
                form.find('#newsColumnFourth').html(fourthLastItem[1]);
                form.find('#newsColumnFith').html(fithLastItem[1]);


              // GENDER PIE CHART

                  Highcharts.setOptions({
                     colors: ['rgba(0,50,255,0.0)', 'rgba(0,50,255,0.0)']
                    });

              var chart,
                female_to_male = [['Female', fPercentage],['Male', mPercentage]];

                chart = new Highcharts.Chart({
                    chart: {
                        renderTo: 'genderChart',
                        backgroundColor: "none",
                        color: "rgba(0,50,255,0.2)",
                        border: "none",
                        type: 'pie'

                    },
                    title: {
                        text: ''
                    },
                    exporting: { 
                      enabled: false 
                    },
                    credits: {
                  enabled: false
              },
                    yAxis: {
                        title: {
                            text: ''
                        },
                        visible: false
                    },
                    plotOptions: {
                        pie: {
                            shadow: false
                        }
                    },
                    tooltip: {
                        formatter: function() {
                            return '<b>'+ this.point.name +'</b>: '+ this.y +' %';
                        }
                    },
                    series: [{
                        name: 'Gender',
                        data: female_to_male,
                        size: '60%',
                        borderWidth: 3,
                        innerSize: '50%',
                        showInLegend:false,
                        dataLabels: {
                            enabled: false
                        }

                    }]
                });

              // AGE LINE CHART
              var chart,
                age_ranges = [['15-24', fifteen],['25-34', twentyfive],['35-44', thirtyfive],['45-54', fourtyfive],['55-64', fiftyfive],['65+', sixtyfive]];


                chart = new Highcharts.Chart({
                    chart: {
                        renderTo: 'ageChart',
                        backgroundColor: "none",
                        border: "none",
                        type: 'line'

                    },
                    title: {
                        text: ''
                    },
                    exporting: { 
                      enabled: false 
                    },
                    credits: {
                  enabled: false
              },
                    yAxis: {
                        title: {
                            text: ''
                        },
                        labels: {
                            style: {
                                color: 'rgba(255,255,255,0.5)',
                                fontSize:'14px',
                                fontFamily: "LubalinGraphStd-Book",
                            }
                        },  
                    },
                    xAxis: {
                    labels: {
                            enabled:false
                        },
                    },
                    plotOptions: {
                        series: {
                            lineWidth: 3
                        }
                    },
                    tooltip: {
                        formatter: function() {
                            return '<b>'+ this.point.name +'</b>: '+ this.y +' %';
                        }
                    },
                    series: [{
                        name: 'Ages',
                        data: age_ranges,
                        size: '60%',
                        color: '#ffffff',
                        innerSize: '50%',
                        borderWidth: 2,
                        showInLegend:false,
                        dataLabels: {
                            enabled: false
                        }

                    }]
                });

              // MONEY BAR CHART
              var chart,
                age_ranges = [['Spend it all', moneySpend],['Save it all', moneySave]];
                

                chart = new Highcharts.Chart({
                    chart: {
                        renderTo: 'moneyChart',
                        backgroundColor: "none",
                        border: "none",
                        type: 'column'

                    },
                    title: {
                        text: ''
                    },
                    exporting: { 
                      enabled: false 
                    },
                    credits: {
                  enabled: false
              },
                    yAxis: {
                        title: {
                            text: ''
                        },
                        labels: {
                            style: {
                                color: 'rgba(255,255,255,0.5)',
                                fontSize:'14px',
                                fontFamily: "LubalinGraphStd-Book",
                            }
                        },
                        visible: true,
                        tickInterval: 50,
                        gridLineWidth: 0,
                    },
                    xAxis: {
                    labels: {
                            enabled:false
                        },
                        visible: true,
                        gridLineWidth: 0,

                    },
                    plotOptions: {
                        pie: {
                            shadow: false
                        }
                    },
                    tooltip: {
                        formatter: function() {
                            return '<b>'+ this.point.name +'</b>: '+ this.y +' %';
                        }
                    },
                    series: [{
                        name: 'Ages',
                        data: age_ranges,
                        size: '60%',
                        color: "rgba(0,50,255,0.2)",
                        innerSize: '50%',
                        borderWidth: 2,
                        pointPadding: 0, // Defaults to 0.1
                        groupPadding: 0.00, // Defaults to 0.2
                        showInLegend:false,
                        dataLabels: {
                            enabled: false
                        }

                    }]
                });

              // SLAP BAR CHART
              var chart,
                age_ranges = [['Slap', sSlap],['Tickle', sTickle]];

                chart = new Highcharts.Chart({
                    chart: {
                        renderTo: 'slapChart',
                        backgroundColor: "none",
                        border: "none",
                        type: 'column'

                    },
                    title: {
                        text: ''
                    },
                    exporting: { 
                      enabled: false 
                    },
                    credits: {
                  enabled: false
              },
                    yAxis: {
                        title: {
                            text: ''
                        },
                        labels: {
                            style: {
                                color: 'rgba(255,255,255,0.5)',
                                fontSize:'14px',
                                fontFamily: "LubalinGraphStd-Book",
                            }
                        },                        
                        visible: true,
                        tickInterval: 50,
                        gridLineWidth: 0,
                    },
                    xAxis: {
                    labels: {
                            enabled:false
                        },
                    },
                    plotOptions: {
                        series: {
                            allowPointSelect: false,
                            marker: {
                                states: {
                                    select: {
                                        fillColor: 'yellow',
                                        lineWidth: 0,
                                        borderWidth: 1,
                                        borderColor: '#595E61'
                                    }
                                }
                            }
                        }
                    },
                    tooltip: {
                        formatter: function() {
                            return '<b>'+ this.point.name +'</b>: '+ this.y +' %';
                        }
                    },
                    series: [{
                        name: 'Ages',
                        data: age_ranges,
                        size: '60%',
                        color: "rgba(0,50,255,0.2)",
                        innerSize: '50%',
                        borderWidth: 2,
                        pointPadding: 0, // Defaults to 0.1
                        groupPadding: 0.00, // Defaults to 0.2
                        showInLegend:false,
                        dataLabels: {
                            enabled: false
                        }

                    }]
                });

                // ALIEN CHART
                chart = new Highcharts.Chart({

                    chart: {
                        renderTo: 'alienChart',
                        backgroundColor: "none",
                        border: "none",
                        type: 'bar'

                    },

                    title: {
                        text: ''
                    },
                    exporting: { 
                      enabled: false 
                    },

                    credits: {
                        enabled: false
                    },

                    xAxis: {
                    labels: {
                        enabled: false,
                        align: 'left',
                        x: 0,
                        y: -20
                    },visible: false,
                    },

                    yAxis: {
                    labels: {
                        align: 'left',
                        x: 0,
                        y: 0
                    },
                    visible: false,
                        
                        min: 0,
                        max: 100,

                    },

                    legend: {
                        backgroundColor: '#FFFFFF',
                        reversed: true
                    },

                    tooltip: {
                        formatter: function() {
                            return ''+
                                this.series.name +': '+ this.y +'';
                        },
                        enabled: false 
                    },

                    plotOptions: {
                        series: {
                            stacking: 'normal'
                        }
                    },

                    legend: {
                        enabled: false
                    },

                    series: [{
                        name: 'Yes',
                        data: [aliensNo, eatingYawye],
                        color: "rgba(0,0,0,0)",
                        borderWidth: 2
                    }, 
                    {
                        name: 'No',
                        data: [aliensYes, eatingYolo],
                        color: "rgba(0,50,255,0.2)",
                        borderWidth: 2
                    }]

                });


              // NEWS CHART
              var chart,
                news_ranges = [[lastItem[1],lastItem[0]],[secondLastItem[1],secondLastItem[0]],[thirdLastItem[1],thirdLastItem[0]],[fourthLastItem[1],fourthLastItem[0]],[fithLastItem[1],fithLastItem[0]]];

                // age_ranges = [['Slap', sSlap],['Tickle', sTickle]];

                chart = new Highcharts.Chart({
                    chart: {
                        renderTo: 'newsChart',
                        backgroundColor: "none",
                        border: "none",
                        type: 'column'

                    },
                    title: {
                        text: ''
                    },
                    exporting: { 
                      enabled: false 
                    },
                    credits: {
                  enabled: false
              },
                    yAxis: {
                        title: {
                            text: ''
                        },
                        labels: {
                            style: {
                                color: 'rgba(255,255,255,0.5)',
                                fontSize:'14px',
                                fontFamily: "LubalinGraphStd-Book",
                            }
                        },                        
                        visible: true,
                        allowDecimals: false,
                        tickInterval: 50,
                        gridLineWidth: 0,
                    },
                    xAxis: {
                        labels: {
                            enabled:false
                        },
                    },
                    plotOptions: {
                        series: {
                            allowPointSelect: false,
                            marker: {
                                states: {
                                    select: {
                                        fillColor: 'yellow',
                                        lineWidth: 0,
                                        borderWidth: 1,
                                        borderColor: '#595E61'
                                    }
                                }
                            }
                        }
                    },
                    tooltip: {
                        formatter: function() {
                            return '<b>'+ this.point.name +'</b>: '+ this.y +' %';
                        }
                    },
                    series: [{
                        name: 'Ages',
                        data: news_ranges,
                        size: '60%',
                        color: "rgba(0,50,255,0.2)",
                        borderWidth: 2,
                        pointPadding: 0, // Defaults to 0.1
                        groupPadding: 0.00, // Defaults to 0.2
                        innerSize: '50%',
                        showInLegend:false,
                        dataLabels: {
                            enabled: false
                        }

                    }]
                });


          //
          //     //Q2
          //     var Q2 = allInfo.Q2;
          //     if (Q2.optionLeft.n >= Q2.optionRight.n) {
          //       infoTwoOption = "lights on";
          //       $("#infographic2 img").attr("src", "images/infographics/2b.png");
          //     } else {
          //       infoTwoOption = "lights off";
          //       $("#infographic2 img").attr("src", "images/infographics/2a.png");
          //     }
          //     form.find('#infoTwoOption').html(infoTwoOption);
          //     //Q3
          //     var Q3 = allInfo.Q3;
          //     if (Q3.optionLeft.n >= Q3.optionRight.n) {
          //       infoThreeOption = "beer";
          //       $("#infographic3 img").attr("src", "images/infographics/3a.png");
          //     } else {
          //       infoThreeOption = "spirits";
          //       $("#infographic3 img").attr("src", "images/infographics/3b.png");
          //     }
          //     form.find('#infoThreeOption').html(infoThreeOption);
          //     //Q4
          //     var Q4 = allInfo.Q4;
          //     if (Q4.optionLeft.n >= Q4.optionRight.n) {
          //       infoFourOption = "Game of Thrones";
          //       $("#infographic4 img").attr("src", "images/infographics/4a.png");
          //     } else {
          //       infoFourOption = "Breaking Bad";
          //       $("#infographic4 img").attr("src", "images/infographics/4b.png");
          //     }
          //     form.find('#infoFourOption').html(infoFourOption);
          //     //Q4
          //     var Q5 = allInfo.Q5;
          //     if (Q5.optionLeft.n >= Q5.optionRight.n) {
          //       infoFiveOption = "Nik Naks";
          //       $("#infographic5 img").attr("src", "images/infographics/5.png");
          //     } else {
          //       infoFiveOption = "Quavers";
          //       $("#infographic5 img").attr("src", "images/infographics/5.png");
          //     }
          //     form.find('#infoFiveOption').html(infoFiveOption);
          //
          //     //overall average
          //     var overallTotalScore = (Q1.optionLeft.braveScore * Q1.optionLeft.n) +
          //                             (Q1.optionRight.braveScore * Q1.optionRight.n) +
          //                             (Q2.optionLeft.braveScore * Q2.optionLeft.n) +
          //                             (Q2.optionRight.braveScore * Q2.optionRight.n) +
          //                             (Q3.optionLeft.braveScore * Q3.optionLeft.n) +
          //                             (Q3.optionRight.braveScore * Q3.optionRight.n) +
          //                             (Q4.optionLeft.braveScore * Q4.optionLeft.n) +
          //                             (Q4.optionRight.braveScore * Q4.optionRight.n) +
          //                             (Q5.optionLeft.braveScore * Q5.optionLeft.n) +
          //                             (Q5.optionRight.braveScore * Q5.optionRight.n);
          //     var overallTotalN = Q1.optionLeft.n + Q1.optionRight.n + Q2.optionLeft.n + Q2.optionRight.n + Q3.optionLeft.n + Q3.optionRight.n + Q4.optionLeft.n + Q4.optionRight.n + Q5.optionLeft.n + Q5.optionRight.n;
          //     var overallAvg = overallTotalScore/overallTotalN;
          //     form.find('#infoOverallAvg').html(Math.round(overallAvg));
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
          var fbLink = "https://www.facebook.com/dialog/feed?app_id=1707512429512286&redirect_uri=http://southpawagency.com/bravetest/close.html&link=http://southpawagency.com/bravetest&picture=http://southpawagency.com/bravetest/start/images/ThumbnailImage.jpg&title=Southpaw%20Brave%20Test&description=I%20scored%20" + user.scores["brave"] + "%25%20in%20the%20Southpaw%20Brave%20Test.%20Think%20you%20can%20beat%20me?%20Take%20the%20test%20here."
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
