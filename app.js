(function () {
    'use strict';

    angular.module('teamworks', [
        'ui.router',
        'templates',
        'app.routes',
        'app.components'
    ]);

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
            // Home
            ///////////////////////////
            .state('app', {
                url: '/',
                templateUrl: 'app/app.html'
            })

            ///////////////////////////
            // About
            ///////////////////////////
            .state('app.about', {
                url: 'about',
                templateUrl: 'app/about/about.html'
            })

            ///////////////////////////
            // Signup
            ///////////////////////////
            .state('signup', {
                url: '/signup',
                template: '<signup></signup>'
            })

            ///////////////////////////
            // Home
            ///////////////////////////
            .state('exchange', {
                url: '/exchange',
                templateUrl: 'app/exchange/exchange.html',
                controller: 'ExchangeController',
                controllerAs: 'exchange'
            })

            .state('application', {
                url: '/application',
                template: '<fundraising-application></fundraising-application>'
            });
    }
    config.$inject = ["$stateProvider", "$urlRouterProvider"];

    angular.module('app.routes', [
        'app.signup',
        'app.exchange',
        'app.application',
        'components.header',
        'components.footer',
        'ui.bootstrap'
    ])
        .config(config);
}());
(function () {
    'use strict';

    // This module should depend on all of the common components
    // A common component is a component that will be used
    // in multiple places across your app.

    angular.module('app.components', []);
}());
(function () {
    'use strict';

    function FundraisingApplication() {
        this.sections = [{
            title: 'First, let\'s get some basic information',
            name: 'initialInfo',
            step: 1
        }, {
            title: 'Dates',
            name: 'dates',
            step: 2
        }, {
            title: 'How many kids will be involved?',
            name: 'numberOfKids',
            step: 3
        }, {
            title: 'Now a little bit of information about marketing...',
            name: 'marketing',
            step: 4
        }, {
            title: 'What will you be selling?',
            name: 'marketingSelection',
            step: 5
        }, {
            title: 'TeamWorks Products',
            name: 'products',
            step: 6
        }, {
            title: 'Add your own products',
            name: 'customProducts',
            step: 7
        }, {
            title: 'Add your Services',
            name: 'customServices',
            step: 8
        }, {
            title: 'A-thon',
            name: 'customAthon',
            step: 9
        }, {
            title: 'What type of Fundraiser are you running?',
            name: 'customOther',
            step: 10
        }, {
            title: 'We need some information about your vendor',
            name: 'vendorInfo',
            step: 11
        }, {
            title: 'Give your campaign a name',
            name: 'campaignName',
            step: 12
        }, {
            title: 'Application Submission',
            name: 'terms',
            step: 13
        }];

        this.currentStep = 1;

        this.productZip = '30120';
    }

    function fundraisingApplication() {
        return {
            restrict: 'E',
            templateUrl: 'app/application/application.html',
            controller: FundraisingApplication,
            controllerAs: 'ctrl',
            scope: {}
        };
    }

    angular.module('app.application', ['app.application.section'])
        .directive('fundraisingApplication', fundraisingApplication);
}());
(function () {
    'use strict';

    function ExchangeController() {
        this.is = 'notEmpty';
    }

    angular.module('app.exchange', [])
        .controller('ExchangeController', ExchangeController);
}());
(function () {
    'use strict';

    function SignupController(AddGroupModal, Groups) {
        this.groups = Groups.getList();
        this.titles = [
            'Coach',
            'Fundraising Chair',
            'Booster Club Member',
            'Assistant',
            'Other'
        ];
        this.slides = [{
            image: 'http://www.myteamworks.org/home/wp-content/uploads/2015/10/approval.jpg',
            title: 'manage all of your fundraisers.'
        }, {
            image: 'http://www.myteamworks.org/home/wp-content/uploads/2015/10/funraising_coach.png',
            title: 'walk you through the process.'
        }, {
            image: 'http://www.myteamworks.org/home/wp-content/uploads/2014/01/build-your-own1.jpg',
            title: 'sell your products online.'
        }, {
            image: 'http://www.myteamworks.org/home/wp-content/uploads/2015/10/reports.png',
            title: 'create reports.'
        }];

        this.addGroup = AddGroupModal.show;
    }
    SignupController.$inject = ["AddGroupModal", "Groups"];

    function signup() {
        return {
            restrict: 'E',
            templateUrl: 'app/signup/signup.html',
            controller: SignupController,
            controllerAs: 'ctrl',
            scope: {}
        };
    }

    angular.module('app.signup', [
        'app.signups.groups',
        'components.header',
        'components.footer',
        'ui.bootstrap'
    ])
        .directive('signup', signup);
}());
(function () {
    'use strict';

    function header() {
        return {
            restrict: 'E',
            templateUrl: 'components/header/header.html',
            controller: angular.noop,
            scope: {}
        };
    }

    angular.module('components.header', [])
        .directive('header', header);
}());
(function () {
    'use strict';

    function footer() {
        return {
            restrict: 'E',
            templateUrl: 'components/footer/footer.html',
            controller: angular.noop,
            scope: {}
        };
    }

    angular.module('components.footer', [])
        .directive('footer', footer);
}());
(function () {
    'use strict';

    function fundraisingApplicationSectionController() {
        var self = this;

        self.productZip = '30290';

        self.back = function (input) {
            if (self.currentStep === 1) {
                return;
            }
            self.currentStep = self.currentStep - 1;

            if (input === 'servicesBack') {
                self.currentStep = 5;
            }
        };
        self.next = function (inputType) {
            self.currentStep = self.currentStep + 1;
            if (angular.isNumber(inputType)) {
                self.currentStep = inputType;
            }

            if (inputType === 'productsForward') {
                self.currentStep = 12;
                console.log(self.currentStep);
            }

            //services
            if (inputType === 'services') {
                self.currentStep = 8;
            }
            if (inputType === 'servicesForward') {
                self.currentStep = 12;
            }

            if (inputType === 'donations') {
                self.currentStep = 12;
            }

            if (inputType === 'athon') {
                self.currentStep = 9;
            }
            if (inputType === 'athonForward') {
                self.currentStep = 12;
            }

            if (inputType === 'customOther') {
                self.currentStep = 10;
            }
            if (inputType === 'customOtherForward') {
                self.currentStep = 12;
            }
        };

        self.fundraisingType = "";
    }

    function fundraisingApplicationSection() {

        function link(scope) {
            scope.ctrl.template = "app/application/section/templates/" + scope.ctrl.ngModel.name + '.html';

        }

        return {
            restrict: 'E',
            templateUrl: 'app/application/section/section.html',
            controller: fundraisingApplicationSectionController,
            controllerAs: 'ctrl',
            link: link,
            scope: {},
            bindToController: {
                ngModel: '=',
                currentStep: '='
            }
        };
    }

    angular.module('app.application.section', [
        'ui.bootstrap'
    ])
        .directive('fundraisingApplicationSection', fundraisingApplicationSection);
}());
(function () {
    'use strict';

    function AddGroupController() {
        this.test = 'test';
    }

    function addGroup() {
        return {
            restrict: 'E',
            templateUrl: 'app/signup/groups/add.html',
            controller: AddGroupController,
            controllerAs: 'ctrl',
            scope: {}
        };
    }

    function AddGroupModalController() {
        this.test = 'test';
    }

    function AddGroupModal($modal) {
        this.show = function () {
            $modal.open({
                template: '<add-group></add-group>',
                contoller: AddGroupModalController
            });
        };
    }
    AddGroupModal.$inject = ["$modal"];

    function Groups() {
        this.list = [
            'Band',
            'Baseball',
            'Track',
            'Football',
            'Chearleading'
        ];
        this.getList = function () {
            return this.list;
        };
    }

    angular.module('app.signups.groups', [])
        .directive('addGroup', addGroup)
        .service('AddGroupModal', AddGroupModal)
        .service('Groups', Groups);
}());