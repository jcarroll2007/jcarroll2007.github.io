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
                templateUrl: 'app/home/home.html'
            });
    }
    config.$inject = ["$stateProvider", "$urlRouterProvider"];

    angular.module('app', [
        'app.share',
        'ui.router',
        'ngAnimate'
    ])
        .config(config);
}());
(function () {
    'use strict';

    // This module should depend on all of the common components
    // A common component is a component that will be used
    // in multiple places across your app.

    angular.module('common', [
        'common.autofocus',
        'common.navbar'
    ]);
}());
(function () {
    'use strict';

    angular.module('models', [
        'models.submission'
    ]);
}());
(function () {
    'use strict';

    function stateConfig($stateProvider) {
        $stateProvider
            .state('app.share', {
                url: 'share',
                abstract: true,
                template: '<div ui-view></div>'
            })
            .state('app.share.submission', {
                url: '',
                template: '<reason-submission-form></reason-submission-form>'
            })
            .state('app.share.submitted', {
                url: '',
                template: '<reason-submitted></reason-submitted>'
            });
    }
    stateConfig.$inject = ["$stateProvider"];

    angular.module('app.share', [
        'app.share.submission',
        'app.share.submitted',
        'ui.router'
    ])
        .config(stateConfig);
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

    function NavbarController() {
        this.test = 'my navbar';
    }

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
(function () {
    'use strict';

    function Submission($q) {
        var self = {};

        self._cache = {
            list: []
        };

        self.save = function (model) {
            /**
             * This function currently just creates a fake submission
             * and assigns it a fake ID based on the number of submissions
             * in the list.
             */
            var submission = angular.copy(model);
            submission.id = self._cache.list.length + 1;
            self._cache.list.push(submission);
            return $q.resolve(submission);
        };

        return self;
    }
    Submission.$inject = ["$q"];

    angular.module('models.submission', [])
        .factory('Submission', Submission);
}());
(function () {
    'use strict';

    function ReasonSubmissionController(Submission, $state) {
        var ctrl = this;

        ctrl.submission = {};

        ctrl.isSubmitting = false;
        ctrl.submit = function () {
            ctrl.isSubmitting = true;
            Submission.save(ctrl.submission)
                .then(function () {
                    $state.go('app.share.submitted');
                });
        };
    }
    ReasonSubmissionController.$inject = ["Submission", "$state"];

    function reasonSubmissionForm() {
        return {
            controller: ReasonSubmissionController,
            controllerAs: 'submission',
            restrict: 'E',
            templateUrl: 'app/share/submission/submission.html'
        };
    }

    angular.module('app.share.submission', [
        'api'
    ])
        .directive('reasonSubmissionForm', reasonSubmissionForm);
}());
(function () {
    'use strict';

    function ReasonSubmittedController() {
        this.test = 'test';
    }

    function reasonSubmitted() {
        return {
            controller: ReasonSubmittedController,
            controllerAs: 'submitted',
            restrict: 'E',
            templateUrl: 'app/share/submitted/submitted.html'
        };
    }

    angular.module('app.share.submitted', [
        'api'
    ])
        .directive('reasonSubmitted', reasonSubmitted);
}());