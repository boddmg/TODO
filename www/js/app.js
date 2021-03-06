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
  // Load or initialize projects
  $scope.projects = Projects.all();

  // Grab the last active, or the first project
  $scope.activeProject = $scope.projects[Projects.getLastActiveIndex()];

  // A utility function for creating a new project
  // with the given project.
  $scope.createProject = function(project) {
    $scope.projectModal.hide();
    var newProject = Projects.newProject(project.title);
    $scope.projects.push(newProject);
    Projects.save($scope.projects);
    $scope.selectProject(newProject, $scope.projects.length-1);
    project.title = "";
  }

  // Called to create a new project
  $scope.newProject = function() {
    $scope.hideAllDelete();
    $scope.projectModal.show();
  };

  $scope.closeNewProject = function() {
    $scope.projectModal.hide();
  }

  // Called to select the given project
  $scope.selectProject = function(project, $index) {
    $scope.activeProject = project;
    Projects.setLastActiveIndex($index);
    $ionicSideMenuDelegate.toggleLeft(false);
  };


  $ionicModal.fromTemplateUrl('new-project.html',
    function (modal) {
      $scope.projectModal = modal;
    }, {
      scope: $scope,
      animation: "slide-in-up"
    });

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
      title:task.title,
      done:false
    });
    $scope.taskModal.hide();
    task.title = "";

    Projects.save($scope.projects);
  }

  $scope.newTask = function() {
    $scope.hideAllDelete();
    $scope.taskModal.show();
  }

  $scope.changeTaskState = function(task, $index){
    task.done = !task.done;
    $scope.activeProject.tasks[$index] = task;
    Projects.save($scope.projects);
  }

  $scope.closeNewTask = function() {
    $scope.taskModal.hide();
  }

  $scope.toggleProjects = function() {
    $scope.hideAllDelete();
    $ionicSideMenuDelegate.toggleLeft();
  }

  $scope.showTaskDelete = function() {
    $scope.shouldShowTaskDelete = true;
  }

  $scope.showProjectDelete = function() {
    $scope.shouldShowProjectDelete = true;
  }

  $scope.hideAllDelete = function() {
    $scope.shouldShowProjectDelete = false;
    $scope.shouldShowTaskDelete = false;
  }

  $scope.delProject = function(project, $index) {
    if ($scope.projects.length > 1) {
      $scope.projects.splice($index, 1);
      if ($scope.activeProject == project) {
        $scope.activeProject = $scope.projects[0];
        Projects.setLastActiveIndex(0);
      }
      Projects.save($scope.projects);
    }else{
      alert("Only one project left!");
    }
  }

  $scope.delTask = function(task, $index) {
    if (!$scope.activeProject || !task) {
      return;
    }
    $scope.activeProject.tasks.splice($index, 1);
    Projects.save($scope.projects);
  }

  $timeout(function() {
    if ($scope.projects.length == 0) {
          createProject("Default");
    }
  })
});
