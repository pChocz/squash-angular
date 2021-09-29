pipeline {
  agent any
  stages {
    stage('Remove old') {
      steps {
        echo 'Removing old..'
        sh 'rm -rf dist/squash-app-bootstrap/*'
      }
    }

    stage('Build') {
      steps {
        echo 'Building..'
        sh 'npm install -g @angular/cli'
        sh 'npm update --force'
        sh 'ng build --configuration production'
      }
    }

    stage('Replace old') {
      steps {
        echo 'Replacing old..'
        input 'Click "Proceed" to deploy'
        sh 'cp -r dist/squash-app-bootstrap/* /app'
      }
    }

  }
}