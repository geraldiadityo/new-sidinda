pipeline {
    agent any
    
    stages {
        stage('Checkout Code'){
            steps {
                checkout scm
                echo "kode telah di checkout dari branch main"
            }
        }

        stage('Build and Deploy docker compose'){
            steps {
                echo "starting docker compose"

                sh "docker compose up --build --force-recreate -d"
                echo "aplikasi telah di build dan di deploy"
            }
        }

        stage('Verify deployment'){
            steps {
                sleep 10
                echo "Menampilkan 20 logs terakhir setelah di build"
                sh "docker compose logs --tail=20"

                echo "menampilkan running docker"
                sh "docker compose ps"
            }
        }
    }

    post {
        success {
            echo "deploy aplikasi berhasil"
        }
        failure {
            echo "pipeline gagal"
        }
    }
}