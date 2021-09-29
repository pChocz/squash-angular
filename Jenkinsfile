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
                sh 'npm update'
                sh 'ng build --configuration production'
            }
        }
        
        stage('Replace old') {
            steps {
                echo 'Replacing old..'
                sh 'cp -r dist/squash-app-bootstrap/* /app'
            }
        }
        
    }
}
