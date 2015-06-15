// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('todo', ['ionic'])

/**
 * The Projects factory handles saving and loading projects
 * from local storage, and also lets us save and load the
 * last active project index.
 */
.factory('Projects', function() {
  return {
    all: function() {
      var projectString = window.localStorage['projects'];
      if(projectString) {
        return angular.fromJson(projectString);
      }
      return [];
    },
    save: function(projects) {
      window.localStorage['projects'] = angular.toJson(projects);
    },
    newProject: function(projectTitle) {
      // Add a new project
      return {
        title: projectTitle,
        tasks: []
      };
    },
    getLastActiveIndex: function() {
      return parseInt(window.localStorage['lastActiveProject']) || 0;
    },
    setLastActiveIndex: function(index) {
      window.localStorage['lastActiveProject'] = index;
    }
  }
})

.controller('todo_controller', function (
  $scope, $timeout, $ionicModal,
  Projects, $ionicSideMenuDelegate) {
  // A utility function for creating a new project
  // with the given projectTitle
  var createProject = function(projectTitle) {
    var newProject = Projects.newProject(projectTitle);
    $scope.projects.push(newProject);
    Projects.save($scope.projects);
    $scope.selectProject(newProject, $scope.projects.length-1);
  }

  // Load or initialize projects
  $scope.projects = Projects.all();

  // Grab the last active, or the first project
  $scope.activeProject = $scope.projects[Projects.getLastActiveIndex()];

  // Called to create a new project
  $scope.newProject = function() {
    var projectTitle = prompt('Project name');
    if(projectTitle) {
      createProject(projectTitle);
    }
  };

  // Called to select the given project
  $scope.selectProject = function(project, index) {
    $scope.activeProject = project;
    Projects.setLastActiveIndex(index);
    $ionicSideMenuDelegate.toggleLeft(false);
  };
  //
  // $scope.tasks=[
  //   {title:"14－下午去图书馆"},
  //   {title:"15－下午去找莫老师对接"},
  //   {title:"15－晚广东同乡吃饭"},
  //   {title:"22－交论文展示咻咻咻"},
  // ];

  $ionicModal.fromTemplateUrl('new-task.html',
    function (modal) {
      $scope.taskModal = modal;
    }, {
      scope: $scope,
      animation: "slide-in-up"
    });

    $scope.createTask = function(task) {
      if (!$scope.activeProject || !task) {
        return;
      }
      $scope.activeProject.tasks.push({
        title:task.title
      });
      $scope.taskModal.hide();
      task.title = "";

      Projects.save($scope.projects);
    }

    $scope.newTask = function() {
      $scope.taskModal.show();
    }

    $scope.closeNewTask = function() {
      $scope.taskModal.hide();
    }

    $scope.toggleProjects = function() {
      $ionicSideMenuDelegate.toggleLeft();
    }


    $scope.delTask = function(task, $index) {
      if (!$scope.activeProject || !task) {
        return;
      }
      // $scope.activeProject.tasks.splice($index, 1);
      $scope.activeProject.tasks.splice($index, 1);

      Projects.save($scope.projects);
    }

    $timeout(function() {
      if ($scope.projects.length == 0) {
            createProject("Default");
      }
    })
});
