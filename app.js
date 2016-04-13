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

    function init($rootScope) {
        $rootScope.debug = true;
    }
    init.$inject = ["$rootScope"];

    angular.module('app', [
        'app.share',
        'app.reasons',
        'ui.router',
        'ngAnimate'
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
            .state('app.reasons', {
                controller: ["submissions", function (submissions) {
                    this.submissions = submissions;
                }],
                controllerAs: 'reasonsState',
                resolve: {
                    submissions: ["Submission", function (Submission) {
                        return Submission.getList();
                    }]
                },
                template: '<reasons-list ng-model="reasonsState.submissions"></reasons-list>',
                url: 'reasons'
            });
    }
    stateConfig.$inject = ["$stateProvider"];

    angular.module('app.reasons', ['app.reasons.list', 'app.reasons.reason'])
        .config(stateConfig);
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

        self.getList = function () {
            return $q.resolve(self._cache.list);
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

    function loadFixtures($rootScope, Submission) {
        if ($rootScope.debug) {
            Submission.save({
                id: 1,
                name: 'Jordan Carroll',
                email: 'jcarroll2007@gmail.com',
                age: '23',
                reason: 'I love our LORD because He came to us to save us when we didn\'t deserve it. He made a way from Heaven, not to Heaven',
                image: 'https://scontent-atl3-1.xx.fbcdn.net/hphotos-xta1/v/t1.0-9/12342504_10208675592032047_2237316667569290936_n.jpg?oh=66cfdbe0967533875b661dbf8281e94b&oe=574BE051'
            });
            Submission.save({
                id: 2,
                name: 'Zack Browne',
                email: 'jcarroll2007@gmail.com',
                age: '23',
                reason: 'I love our LORD because He caerve it. He made a way from Heaven, not to Heaven I love our LORD because He came to us to save us when we didn\'t deserve it. He made a way from Heaven, not to HeavenI love our LORD because He came to us to save us when we didn\'t deserve it. He made a way from Heaven, not to Heaven',
                image: 'http://media.idownloadblog.com/wp-content/uploads/2012/04/Phil-Schiller-headshot-e1362692403868.jpg'
            });
            Submission.save({
                id: 50,
                name: 'John Doe',
                email: 'jcarroll2007@gmail.com',
                age: '23',
                reason: 'I love our LORD because He came to us to save us when we didn\'t deserve it. He made a way from Heaven, not to Heaven I love our LORD because He came to us to save us when we didn\'t deserve it. He made a way from Heaven, not to Heaven',
                image: 'http://pdnpulse.pdnonline.com/wp-content/uploads/2012/07/Andrew-Fingerman-Headshot.jpg'
            });
            Submission.save({
                id: 25,
                name: 'Alan Thicke',
                email: 'jcarroll2007@gmail.com',
                age: '23',
                reason: 'I love our LORD bm Heaven, not to Heaven',
                image: 'https://avatars1.githubusercontent.com/u/8485105?v=3&s=460'
            });
            Submission.save({
                id: 5,
                name: 'Jordan Carroll',
                email: 'jcarroll2007@gmail.com',
                age: '23',
                reason: 'I love our LORD because He came to us to save us when we didn\'t deserve it. He made a way from Heaven, not to Heaven',
                image: 'https://scontent-atl3-1.xx.fbcdn.net/hphotos-xta1/v/t1.0-9/12342504_10208675592032047_2237316667569290936_n.jpg?oh=66cfdbe0967533875b661dbf8281e94b&oe=574BE051'
            });
            Submission.save({
                id: 6,
                name: 'Jordan Carroll',
                email: 'jcarroll2007@gmail.com',
                age: '23',
                reason: 'I love our LORD because He came to us to save us when we didn\'t deserve it. He made a way from Heaven, not to Heaven',
                image: 'https://scontent-atl3-1.xx.fbcdn.net/hphotos-xta1/v/t1.0-9/12342504_10208675592032047_2237316667569290936_n.jpg?oh=66cfdbe0967533875b661dbf8281e94b&oe=574BE051'
            });
        }
    }
    loadFixtures.$inject = ["$rootScope", "Submission"];

    angular.module('models.submission', [])
        .factory('Submission', Submission)
        .run(loadFixtures);
}());
(function () {
    'use strict';

    function ReasonsController() {
        var ctrl = this;
        ctrl.reasons = [];

        ctrl.add = function () {
            ctrl.ngModel.unshift({
                name: 'Jordan Carroll',
                email: 'jcarroll2007@gmail.com',
                age: '23',
                reason: 'I love our LORD because He came to us to save us when we didn\'t deserve it. He made a way from Heaven, not to Heaven',
                image: 'https://scontent-atl3-1.xx.fbcdn.net/hphotos-xta1/v/t1.0-9/12342504_10208675592032047_2237316667569290936_n.jpg?oh=66cfdbe0967533875b661dbf8281e94b&oe=574BE051'
            });
        };
    }

    function reasonsList() {
        return {
            controller: ReasonsController,
            controllerAs: 'ctrl',
            bindToController: true,
            restrict: 'E',
            scope: {
                ngModel: '='
            },
            templateUrl: 'app/reasons/list/list.html'
        };
    }

    angular.module('app.reasons.list', ['akoenig.deckgrid'])
        .directive('reasonsList', reasonsList);

}());
(function () {
    'use strict';

    function ReasonController() {
        this.test = 'test';
    }

    function reason() {
        return {
            controller: ReasonController,
            controllerAs: 'ctrl',
            bindToController: {
                ngModel: '=?'
            },
            restrict: 'E',
            scope: {},
            templateUrl: 'app/reasons/reason/reason.html'
        };
    }

    angular.module('app.reasons.reason', [])
        .directive('reason', reason);
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