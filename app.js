(function () {
    'use strict';

    angular.module('myAppName', [
        'api',
        'app',
        'common',
        'models',
        'ngAnimate',
        'templates'
    ]);

}());
(function () {
    'use strict';

    var API_BASE_URL = '/api';

    function URL() {
        /**
         * @returns a properly formatted url.
         *     Example Usage: URL('my', 'url', '4') === '/{API_BASE_URL}/my/url/4/'
         */
        return function () {
            var url_array = [API_BASE_URL];
            Array.prototype.push.apply(url_array, arguments);
            return url_array.join('/') + '/';
        };
    }

    angular.module('api', [])
        .service('URL', URL);
}());
(function () {
    'use strict';

    function config($stateProvider, $urlRouterProvider) {

        ///////////////////////////
        // Redirects and Otherwise
        ///////////////////////////
        $urlRouterProvider
            .otherwise('/');

        ///////////////////////////
        // State Configurations
        ///////////////////////////

        $stateProvider


            ///////////////////////////
            // App
            ///////////////////////////
            .state('app', {
                url: '/',
                templateUrl: 'app/app.html',
                abstract: true
            })

            ///////////////////////////
            // Home
            ///////////////////////////
            .state('app.home', {
                url: '',
                templateUrl: 'app/home/home.html',
                controllerAs: 'home',
                controller: ["instagram", "$timeout", function (instagram, $timeout) {
                    var self = this;

                    $timeout(function () {
                        self.fadeLogoIn = true;
                    });

                    instagram.getFeed()
                        .then(function (feed) {
                            self.feed = feed;

                            $timeout(function () {
                                self.fadeFeedIn = true;
                            }, 1000);
                        });
                }]
            });
    }
    config.$inject = ["$stateProvider", "$urlRouterProvider"];

    function init($rootScope) {
        $rootScope.debug = true;
    }
    init.$inject = ["$rootScope"];

    angular.module('app', [
        'ui.router',
        'ngAnimate',
        'models'
    ])
        .config(config)
        .run(init);
}());
(function () {
    'use strict';

    // This module should depend on all of the common components
    // A common component is a component that will be used
    // in multiple places across your app.

    angular.module('common', [
        'common.autofocus',
        'common.tcons',
        'common.navbar'
    ]);
}());
(function () {
    'use strict';

    angular.module('models', [
        'models.instagram'
    ]);
}());
(function () {
    'use strict';

    /*jslint unparam:true*/
    function autoFocus($timeout) {
        return {
            restrict: 'AC',
            link: function (_scope, _element) {
                $timeout(function () {
                    _element[0].focus();
                }, 0);
            }
        };
    }
    autoFocus.$inject = ["$timeout"];

    angular.module('common.autofocus', [])
        .directive('autoFocus', autoFocus);
}());
(function () {
    'use strict';

    function NavbarController($scope, $window) {
        var self = this;
        angular.element($window).bind('scroll', function () {
            if (this.pageYOffset >= 70) {
                self.overlayNavbar = true;
            } else {
                self.overlayNavbar = false;
            }
            $scope.$apply();
        });

        self.isMobileMenuShown = false;
        self.toggleMobileMenu = function () {
            self.isMobileMenuShown = !self.isMobileMenuShown;
        }
    }
    NavbarController.$inject = ["$scope", "$window"];

    function navbar() {
        return {
            controller: NavbarController,
            controllerAs: 'ctrl',
            replace: true,
            restrict: 'E',
            scope: {},
            templateUrl: 'common/navbar/navbar.html'
        };
    }

    angular.module('common.navbar', [])
        .directive('navbar', navbar);

}());
(function (root, factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        // AMD module
        define(factory);
    } else if (typeof exports === 'object') {
        // CommonJS-like environment (i.e. Node)
        module.exports = factory();
    } else {
        // Browser global
        root.transformicons = factory();
        root.transformicons.add('.tcon');
    }
}(this || window, function () {

    // ####################
    // MODULE TRANSFORMICON
    // ####################
    'use strict';

    var
        tcon = {}, // static class
        _transformClass = 'tcon-transform',

        // const
        DEFAULT_EVENTS = {
            transform : ['click'],
            revert : ['click']
        };

    // ##############
    // private methods
    // ##############

    /**
    * Normalize a selector string, a single DOM element or an array of elements into an array of DOM elements.
    * @private
    *
    * @param {(string|element|array)} elements - Selector, DOM element or Array of DOM elements
    * @returns {array} Array of DOM elements
    */
    var getElementList = function (elements) {
        if (typeof elements === 'string') {
            return Array.prototype.slice.call(document.querySelectorAll(elements));
        } else if (typeof elements === 'undefined' || elements instanceof Array) {
            return elements;
        } else {
            return [elements];
        }
    };

    /**
    * Normalize a string with eventnames separated by spaces or an array of eventnames into an array of eventnames.
    * @private
    *
    * @param {(string|array)} elements - String with eventnames separated by spaces or array of eventnames
    * @returns {array} Array of eventnames
    */
    var getEventList = function (events) {
        if (typeof events === 'string') {
            return events.toLowerCase().split(' ');
        } else {
            return events;
        }
    };

    /**
    * Attach or remove transformicon events to one or more elements.
    * @private
    *
    * @param {(string|element|array)} elements - Selector, DOM element or Array of DOM elements to be toggled
    * @param {object} [events] - An Object containing one or more special event definitions
    * @param {boolean} [remove=false] - Defines wether the listeners should be added (default) or removed.
    */
    var setListeners = function (elements, events, remove) {
        var
            method = (remove ? 'remove' : 'add') + 'EventListener',
            elementList = getElementList(elements),
            currentElement = elementList.length,
            eventLists = {};

        // get events or use defaults
        for (var prop in DEFAULT_EVENTS) {
            eventLists[prop] = (events && events[prop]) ? getEventList(events[prop]) : DEFAULT_EVENTS[prop];
        }

        // add or remove all events for all occasions to all elements
        while(currentElement--) {
            for (var occasion in eventLists) {
                var currentEvent = eventLists[occasion].length;
                while(currentEvent--) {
                    elementList[currentElement][method](eventLists[occasion][currentEvent], handleEvent);
                }
            }
        }
    };

    /**
    * Event handler for transform events.
    * @private
    *
    * @param {object} event - event object
    */
    var handleEvent = function (event) {
        tcon.toggle(event.currentTarget);
    };

    // ##############
    // public methods
    // ##############

    /**
    * Add transformicon behavior to one or more elements.
    * @public
    *
    * @param {(string|element|array)} elements - Selector, DOM element or Array of DOM elements to be toggled
    * @param {object} [events] - An Object containing one or more special event definitions
    * @param {(string|array)} [events.transform] - One or more events that trigger the transform. Can be an Array or string with events seperated by space.
    * @param {(string|array)} [events.revert] - One or more events that trigger the reversion. Can be an Array or string with events seperated by space.
    * @returns {transformicon} transformicon instance for chaining
    */
    tcon.add = function (elements, events) {
        setListeners(elements, events);
        return tcon;
    };

    /**
    * Remove transformicon behavior from one or more elements.
    * @public
    *
    * @param {(string|element|array)} elements - Selector, DOM element or Array of DOM elements to be toggled
    * @param {object} [events] - An Object containing one or more special event definitions
    * @param {(string|array)} [events.transform] - One or more events that trigger the transform. Can be an Array or string with events seperated by space.
    * @param {(string|array)} [events.revert] - One or more events that trigger the reversion. Can be an Array or string with events seperated by space.
    * @returns {transformicon} transformicon instance for chaining
    */
    tcon.remove = function (elements, events) {
        setListeners(elements, events, true);
        return tcon;
    };

    /**
    * Put one or more elements in the transformed state.
    * @public
    *
    * @param {(string|element|array)} elements - Selector, DOM element or Array of DOM elements to be transformed
    * @returns {transformicon} transformicon instance for chaining
    */
    tcon.transform = function (elements) {
        getElementList(elements).forEach(function(element) {
            element.classList.add(_transformClass);
        });
        return tcon;
    };

    /**
    * Revert one or more elements to the original state.
    * @public
    *
    * @param {(string|element|array)} elements - Selector, DOM element or Array of DOM elements to be reverted
    * @returns {transformicon} transformicon instance for chaining
    */
    tcon.revert = function (elements) {
        getElementList(elements).forEach(function(element) {
            element.classList.remove(_transformClass);
        });
        return tcon;
    };

    /**
    * Toggles one or more elements between transformed and original state.
    * @public
    *
    * @param {(string|element|array)} elements - Selector, DOM element or Array of DOM elements to be toggled
    * @returns {transformicon} transformicon instance for chaining
    */
    tcon.toggle = function (elements) {
        getElementList(elements).forEach(function(element) {
            tcon[element.classList.contains(_transformClass) ? 'revert' : 'transform'](element);
        });
        return tcon;
    };

    return tcon;
}));
(function () {
    'use strict';
    angular.module('common.tcons', [])
        .run(["$timeout", "$window", function ($timeout, $window) {
            $timeout(function () {
                console.log($window);
                $window.transformicons.add('.tcon');
            });
        }]);
}());

(function () {
    'use strict';

    function instagram($http) {
        this.getFeed = function () {
            return $http.get('https://www.instagram.com/shewritesbyerica/media/')
                .then(function (feed) {
                    return feed;
                });
        }
    }
    instagram.$inject = ["$http"];

    angular.module('models.instagram', [])
        .service('instagram', instagram);
}());