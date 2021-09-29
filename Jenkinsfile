pipeline {
  agent any
  stages {
    stage('git check out') {
      steps {
        echo 'git check out'
      }
    }

    stage('build') {
      steps {
        sh 'npm install -g @angular/cli'
        sh 'npm install --save-dev @angular-devkit/build-angular'
        sh 'ng build --configuration production'
      }
    }

    stage('deploy') {
      steps {
        input 'Click "Proceed" to deploy'
        sh 'cp -r dist/squash-app-bootstrap/* /app'
      }
    }

  }
}