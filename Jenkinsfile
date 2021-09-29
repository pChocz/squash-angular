pipeline {
  
    agent any

    stages {
      
        stage('Remove old') {
            steps {
                echo 'Building..'
                rm -rf dist/squash-app-bootstrap/*
            }
        }
        
        stage('Build') {
            steps {
                npm install -g @angular/cli
                ng build --configuration production
            }
        }
        
        stage('Replace old') {
            steps {
                cp -r dist/squash-app-bootstrap/* /app
            }
        }
        
    }
}
