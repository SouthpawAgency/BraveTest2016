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
          moneySpend, moneySave, maleAvBravescore, femaleAvBravescore,
          sSlap, sTickle,
          slapValue, moneyValue, alienValue, eatingValue,
          fifteen, twentyfive, thirtyfive, fourtyfive, fiftyfive, sixtyfive,
          bbc, buzzfeed, channelfour, dailyexpress, dailymail, dailymirror, dailystar, dailytelegraph, financialtimes, huffington, mashable, metro, guardian, independent, thesun, times, twitter, vice,
          bbcN, buzzfeedN, channelfourN, dailyexpressN, dailymailN, dailymirrorN, dailystarN, dailytelegraphN, financialtimesN, huffingtonN, mashableN, metroN, guardianN, independentN, thesunN, timesN, twitterN, viceN;


          dataRef.once('value', function (snap) {
              //main
              var allInfo = snap.val();

              var gender = allInfo.gender;
                maleAvBravescore = gender.M.avgBraveScore;
                // console.log('maleAvBravescore:' + maleAvBravescore);
                femaleAvBravescore = gender.F.avgBraveScore;
                // console.log('maleAvBravescore:' + maleAvBravescore);

              var aliens = allInfo.aliens;
                aliensYes = Math.round((aliens.Yes.nb/(aliens.No.nb+aliens.Yes.nb))*100);
                aliensNo = 100 - aliensYes;
              // console.log('Aliens No:' + aliensNo + ' Aliens Yes:' + aliensYes);

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
              // console.log('Eating Yawye:' + eatingYawye + ' Eating Yolo:' + eatingYolo);

              if (eating["YOLO"].nb >= eating["You are what you eat"].nb) {
                eatingValue = "think you are what you eat";
                form.find('#eatingValue').html(eatingValue);
                form.find('#eatingValueP').html(eatingYolo);
              } else {
                eatingValue = "have a YOLO attitude towards eating";
                form.find('#eatingValue').html(eatingValue);
                form.find('#eatingValueP').html(eatingYawye);
              }



              var money = allInfo.money;
                moneySpend = Math.round((money["Spend it all"].nb/(money["Save it all"].nb+money["Spend it all"].nb))*100);
                moneySave = 100 - moneySpend;
              // console.log('Save it all:' + moneySave + ' Spend it all:' + moneySpend);

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
              // console.log('Tickle:' + sTickle + ' Slap:' + sSlap);

              if (slap.Slap.nb >= slap.Tickle.nb) {
                slapValue = "Slap";
                form.find('#slapValue').html(slapValue);
                form.find('#slapValueP').html(sSlap);
              } else {
                slapValue = "Tickle";
                form.find('#slapValue').html(slapValue);
                form.find('#slapValueP').html(sTickle);
              }


              var age = allInfo.age;
              var allAges = age["15-24"].nb+age["25-34"].nb+age["35-44"].nb+age["45-54"].nb+age["55-64"].nb+age["65+"].nb;

                fifteen = Math.round((age["15-24"].nb/(age["15-24"].n))*100);
                twentyfive = Math.round((age["25-34"].nb/(age["25-34"].n))*100);
                thirtyfive = Math.round((age["35-44"].nb/(age["35-44"].n))*100);
                fourtyfive = Math.round((age["45-54"].nb/(age["45-54"].n))*100);
                fiftyfive = Math.round((age["55-64"].nb/(age["55-64"].n))*100);
                sixtyfive = Math.round((age["65+"].nb/(age["65+"].n))*100);
              // console.log('15-24:' + fifteen + ' 25-34:' + twentyfive + ' 35-44:' + thirtyfive + ' 45-54:' + fourtyfive + ' 55-64:' + fiftyfive + ' 65plus:' + sixtyfive);

              // var age = allInfo.age;
              //   fifteen = age["15-24"].avgBraveScore;
              //   console.log('15-24:' + fifteen + '% brave');

              //   twentyfive = age["25-34"].avgBraveScore;
              //   console.log('25-34:' + twentyfive + '% brave');

              //   thirtyfive = age["35-44"].avgBraveScore;
              //   console.log('35-44:' + thirtyfive + '% brave');

              //   fourtyfive = age["45-54"].avgBraveScore;
              //   console.log('45-54:' + fourtyfive + '% brave');

              //   fiftyfive = age["55-64"].avgBraveScore;
              //   console.log('55-64:' + fiftyfive + '% brave');

              //   sixtyfive = age["65+"].avgBraveScore;
              //   console.log('65+:' + sixtyfive + '% brave');

              //   form.find('#ageColumnOne').html('15-24');
              //   form.find('#ageColumnTwo').html('25-34');
              //   form.find('#ageColumnThird').html('35-44');
              //   form.find('#ageColumnFourth').html('45-54');
              //   form.find('#ageColumnFith').html('55-64');
              //   form.find('#ageColumnSixth').html('65+');


              var news = allInfo.news;

                bbc = Math.round((news["BBC News Website"].nb/(news["BBC News Website"].n))*100);
                buzzfeed = Math.round((news["Buzzfeed"].nb/(news["Buzzfeed"].n))*100);
                channelfour = Math.round((news["Channel 4 News Website"].nb/(news["Channel 4 News Website"].n))*100);
                dailyexpress = Math.round((news["Daily Express"].nb/(news["Daily Express"].n))*100);
                dailymail = Math.round((news["Daily Mail"].nb/(news["Daily Mail"].n))*100);
                dailymirror = Math.round((news["Daily Mirror"].nb/(news["Daily Mirror"].n))*100);
                dailystar = Math.round((news["Daily Star"].nb/(news["Daily Star"].n))*100);
                dailytelegraph = Math.round((news["Daily Telegraph"].nb/(news["Daily Telegraph"].n))*100);
                financialtimes = Math.round((news["Financial Times"].nb/(news["Financial Times"].n))*100);
                huffington = Math.round((news["Huffington Post"].nb/(news["Huffington Post"].n))*100);
                mashable = Math.round((news["Mashable"].nb/(news["Mashable"].n))*100);
                metro = Math.round((news["Metro"].nb/(news["Metro"].n))*100);
                guardian = Math.round((news["The Guardian"].nb/(news["The Guardian"].n))*100);
                independent = Math.round((news["The Independent"].nb/(news["The Independent"].n))*100);
                thesun = Math.round((news["The Sun"].nb/(news["The Sun"].n))*100);
                times = Math.round((news["The Times"].nb/(news["The Times"].n))*100);
                twitter = Math.round((news["Twitter"].nb/(news["Twitter"].n))*100);
                vice = Math.round((news["Vice"].nb/(news["Vice"].n))*100);


                bbcN = "BBC News Website";
                buzzfeedN = "Buzzfeed";
                channelfourN = "Channel 4 News Website";
                dailyexpressN = "Daily Express";
                dailymailN = "Daily Mail";
                dailymirrorN = "Daily Mirror";
                dailystarN = "Daily Star";
                dailytelegraphN = "Daily Telegraph";
                financialtimesN = "Financial Times";
                huffingtonN = "Huffington Post";
                mashableN = "Mashable";
                metroN = "Metro";
                guardianN =  "The Guardian";
                independentN = "The Independent";
                thesunN = "The Sun";
                timesN = "The Times";
                twitterN = "Twitter";
                viceN = "Vice";

                var array = [[bbc, bbcN], [buzzfeed, buzzfeedN], [channelfour, channelfourN], [dailyexpress, dailyexpressN], [dailymail, dailymailN], [dailymirror, dailymirrorN], [dailystar, dailystarN], [dailytelegraph, dailytelegraphN], [financialtimes, financialtimesN], [huffington, huffingtonN], [mashable, mashableN], [metro, metroN], [guardian, guardianN], [independent, independentN], [thesun, thesunN], [times, timesN], [twitter, twitterN], [vice, viceN]];
                // var largest = Math.max.apply(Math, array);
                array.sort(function(b,a) {return b[0]-a[0]});
                // console.log('Ordered News:' + array);

                var lastItem = array.pop();
                var secondLastItem = array.pop();
                var thirdLastItem = array.pop();
                var fourthLastItem = array.pop();
                var fithLastItem = array.pop();
                // console.log('Highest News:' + lastItem);
                // console.log('2nd Highest News:' + secondLastItem);
                // console.log('3rd Highest News:' + thirdLastItem);
                // console.log('4th Highest News:' + fourthLastItem);
                // console.log('5th Highest News:' + fithLastItem);
                //
                // console.log('Average Female Bravescore: ' + femaleAvBravescore);
                // console.log('Average Male Bravescore: ' + maleAvBravescore);

                form.find('#newsColumnOne').html(fourthLastItem[1]);
                form.find('#newsColumnTwo').html(secondLastItem[1]);
                form.find('#newsColumnThird').html(thirdLastItem[1]);
                form.find('#newsColumnFourth').html(fithLastItem[1]);
                form.find('#newsColumnFith').html(lastItem[1]);


                var gender = allInfo.gender;

                fPercentage = Math.round((gender.F.nb/(gender.F.n)*100));
                mPercentage = Math.round((gender.M.nb/(gender.M.n)*100));
                // console.log('Males:' + mPercentage + ' Females:' + fPercentage);

                form.find('#femaleAvBravescore').html(fPercentage);
                form.find('#maleAvBravescore').html(mPercentage);



                // GENDER ACITVITY GAUGE
                var chart,
                chart = new Highcharts.Chart({

                    chart: {
                        renderTo: 'genderGauge',
                        type: 'solidgauge',
                        backgroundColor: 'none',
                        spacingTop: 0,
                        spacingRight: 0,
                        spacingBottom: 0,
                        spacingLeft: 0,
                        plotBorderWidth: 0,
                        marginRight: 0, //-60, //this does move the chart but you'll need to recompute it
                        marginLeft: 0, //-60,  //whenever the page changes width
                        marginTop: 80,
                        marginBottom: 0
                    },
                    tooltip: {
                        enabled: false
                    },
                    title: {
                        text: 'Average Brave Score:<br/> Male vs. Female',
                        style: {
                            fontSize: '14px',
                            color: 'white',
                            fontFamily: "LubalinGraphStd-Book",
                        }
                    },
                    credits: {
                        enabled: false
                    },
                    exporting: {
                      enabled: false
                    },
                    pane: {
                        size: '100%',
                        startAngle: 0,
                        endAngle: 360,

                        background: {
                            //innerRadius: '50%', #fix for inner border :D
                            outerRadius: '0%',
                            backgroundColor: 'transparent',
                        }
                    },
                    plotOptions: {
                        solidgauge: {
                            dataLabels: {
                                enabled: false,
                            }
                        }
                    },
                    yAxis: {
                        labels: {
                            enabled: false
                        },

                        min: 0,
                        max: 100,
                        gridLineColor: 'transparent',
                        lineColor: 'transparent',
                        minorTickLength: 0,
                        tickColor: 'white',
                        tickPosition: 'inside',
                        tickInterval: 1,
                        tickWidth: 2,

                    },

                    series: [{
                        name: 'Female',
                        innerRadius: '80%',
                        borderWidth: 2,
                        borderColor: 'white',
                         data: [{y:fPercentage,color:"rgba(255,255,255,0.2)"}],
                        radius: '60%'
                    }, {
                        name: 'Male',
                        innerRadius: '100%',
                        borderWidth: 2,
                        borderColor: 'white',
                         data: [{y:mPercentage,color:"rgba(0,50,255,0.2)"}],
                        radius: '80%',
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
                    title: {
                        text: 'How Brave is your age range?',
                        style: {
                            fontSize: '14px',
                            color: 'white',
                            fontFamily: "LubalinGraphStd-Book",
                            align: 'top',
                        }
                    },
                    yAxis: {
                        title: {
                            text: "Percentage of participants that are brave",
                            style: {
                                fontSize: '14px',
                                color: 'white',
                                fontFamily: "LubalinGraphStd-Book",
                            },
                        },
                        labels: {
                            style: {
                                color: 'white',
                                fontSize:'14px',
                                fontFamily: "LubalinGraphStd-Book",
                            },
                        },
                        gridLineColor: 'rgba(255,255,255,0.3)',
                        lineColor: 'white',
                        gridLineWidth: 1,
                        minorTickLength: 0,
                        tickColor: 'white',
                        tickPosition: 'outside',
                        tickInterval: 2,
                        tickWidth: 2,
                        startOnTick: true,
                        offset : 20,
                    },
                    xAxis: {
                        title: {
                            style: {
                                fontSize: '14px',
                                color: 'rgba(255,255,255,0.6)',
                                fontFamily: "LubalinGraphStd-Book",
                            },
                        },
                    labels: {
                            enabled:false
                        },
                    tickColor: 'transparent',
                    gridLineColor: 'rgba(255,255,255,0.2)',
                    lineColor: 'rgba(255,255,255,0.2)',
                    gridLineWidth: 1,
                    },
                    plotOptions: {
                        series: {
                            lineWidth: 3
                        },
                        dataLabels: {
                            enabled: true,
                            color: 'red',
                            style: { fontFamily: '\'LubalinGraphStd-Book\', sans-serif', lineHeight: '18px', fontSize: '17px' }
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
                money_ranges = [['Spend it all', moneySpend],['Save it all', moneySave]];


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
                                color: 'white',
                                fontSize:'14px',
                                fontFamily: "LubalinGraphStd-Book",
                            }
                        },
                        visible: true,
                        min: 0,
                        max: 100,
                        gridLineWidth: 0,
                        gridLineColor: 'transparent',
                        lineColor: 'transparent',
                        minorTickLength: 0,
                        tickColor: 'white',
                        tickPosition: 'outside',
                        tickInterval: 20,
                        tickWidth: 2,
                        offset : 20,
                    },
                    xAxis: {
                    labels: {
                            enabled:false
                        },
                        visible: true,
                        gridLineWidth: 0,
                        tickColor: 'transparent',

                    },
                    plotOptions: {
                        pie: {
                            shadow: false
                        }
                    },
                    tooltip: {
                        formatter: function() {
                            return '<b>'+ this.point.name +'</b>: '+ this.y +' %';
                        },
                        enabled: false
                    },
                    series: [{
                        name: 'Ages',
                        data: money_ranges,
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
                slap_ranges = [['Slap', sSlap],['Tickle', sTickle]];

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
                                color: 'white',
                                fontSize:'14px',
                                fontFamily: "LubalinGraphStd-Book",
                            }
                        },
                        visible: true,
                        min: 0,
                        max: 100,
                        gridLineWidth: 0,
                        gridLineColor: 'transparent',
                        lineColor: 'transparent',
                        minorTickLength: 0,
                        tickColor: 'white',
                        tickPosition: 'outside',
                        tickInterval: 20,
                        tickWidth: 2,
                        offset : 20,
                    },
                    xAxis: {
                    labels: {
                            enabled:false
                        },
                        gridLineWidth: 0,
                        tickColor: 'transparent',
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
                        },
                        enabled: false
                    },
                    series: [{
                        name: 'Ages',
                        data: slap_ranges,
                        size: '60%',
                        color: "rgba(0,50,255,0.2)",
                        innerSize: '50%',
                        borderWidth: 2,
                        pointPadding: 0, // Defaults to 0.1
                        groupPadding: 0.00, // Defaults to 0.2
                        showInLegend:false,
                        dataLabels: {
                            enabled: false
                        },
                        point: {
                            events: {
                                mouseOver: function() {
                                   $(this.series.chart.xAxis[0].labelGroup.element.childNodes[this.x]).css('font-size', '24px');
                                },
                                mouseOut: function() {
                                     $(this.series.chart.xAxis[0].labelGroup.element.childNodes[this.x]).css('font-size', '24px');
                                }
                            }
                        }

                    }]
                });

                // ALIEN CHART
                var chart,
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
                            x: 0,
                            y: -12
                        },
                        tickWidth: 0,
                        lineWidth: 0,
                        minorGridLineWidth: 0
                    },
                    yAxis: {

                        minorGridLineWidth: 0,
                        majorGridLineWidth: 0,

                        gridLineWidth: 0,
                        labels: {
                            enabled: false
                        },
                        title: {
                            text: '',
                            align: 'high'
                        },
                        tickWidth: 0,
                         min:-1.2,
                         startOnTick:false,
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
                news_ranges = [[fourthLastItem[1],fourthLastItem[0]],[secondLastItem[1],secondLastItem[0]],[thirdLastItem[1],thirdLastItem[0]],[fithLastItem[1],fithLastItem[0]],[lastItem[1],lastItem[0]]];

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
                            text: "Percentage of readers that are brave",
                            style: {
                                fontSize: '14px',
                                color: 'white',
                                fontFamily: "LubalinGraphStd-Book",
                            },
                        },
                        labels: {
                            style: {
                                color: 'white',
                                fontSize:'14px',
                                fontFamily: "LubalinGraphStd-Book",
                            }
                        },
                        visible: true,
                        allowDecimals: false,
                        gridLineWidth: 0,
                        gridLineColor: 'transparent',
                        lineColor: 'transparent',
                        minorTickLength: 0,
                        tickColor: 'white',
                        tickPosition: 'outside',
                        tickInterval: 10,
                        tickWidth: 2,
                        offset : 20,
                    },
                    xAxis: {
                        title: {
                            style: {
                                fontSize: '14px',
                                color: 'white',
                                fontFamily: "LubalinGraphStd-Book",
                            },
                        },
                        labels: {
                            enabled:false
                        },
                        tickWidth: 0,
                        lineWidth: 2,
                    },
                    title: {
                        text: 'Brave people read...',
                        style: {
                            fontSize: '14px',
                            color: 'white',
                            fontFamily: "LubalinGraphStd-Book",
                            align: 'top',
                        }
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
